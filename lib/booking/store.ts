import { randomBytes, randomInt } from "crypto";
import { ensureSchema, query } from "./db";
import {
  BOOKING,
  BOOKING_STATUSES,
  PAYMENT_STATUSES,
  SLOT_HOLDING_STATUSES,
  type BookingStatus,
  type PaymentMethod,
  type PaymentStatus,
} from "./config";
import { addDays, dailySlotTimes, isBookableSlot, isDateString, isOpenDay, isTimeString, todayInColombo } from "./time";

export type BookingRow = {
  id: string;
  ref: string;
  full_name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  appointment_date: string;
  slot_time: string;
  amount_lkr: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  has_slip: boolean;
  slip_mime: string | null;
  slip_uploaded_at: string | null;
  admin_notes: string | null;
  follow_up_on: string | null;
  payhere_payment_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

const COLUMNS = `
  id, ref, full_name, phone, email, notes,
  to_char(appointment_date, 'YYYY-MM-DD') AS appointment_date,
  slot_time, amount_lkr, status, payment_status, payment_method,
  (slip_file IS NOT NULL) AS has_slip, slip_mime, slip_uploaded_at,
  admin_notes, to_char(follow_up_on, 'YYYY-MM-DD') AS follow_up_on,
  payhere_payment_id, paid_at, created_at, updated_at`;

const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L

function newRef() {
  let out = "JB-";
  for (let i = 0; i < 6; i++) out += REF_ALPHABET[randomInt(REF_ALPHABET.length)];
  return out;
}

export class SlotTakenError extends Error {
  constructor() {
    super("That time slot has just been taken.");
  }
}

export class TooManyBookingsError extends Error {
  constructor() {
    super("This phone number already has the maximum number of upcoming bookings.");
  }
}

type NewBooking = {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  date: string;
  time: string;
  paymentMethod: PaymentMethod;
  slipFile: string | null;
  slipMime: string | null;
  ip: string;
  /** staff entries (phone bookings): skip the per-phone limit and set the starting status */
  staff?: boolean;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
};

const MAX_UPCOMING_PER_PHONE = 3;

export async function createBooking(input: NewBooking): Promise<{ id: string; ref: string; payToken?: string }> {
  await ensureSchema();
  await expireUnpaidCardBookings();

  const upcoming = input.staff ? { rows: [{ n: 0 }] } : await query(
    `SELECT count(*)::int AS n FROM test_bookings
      WHERE phone = $1 AND appointment_date >= $2::date AND status IN ('new','confirmed')`,
    [input.phone, todayInColombo()]
  );
  if (upcoming.rows[0].n >= MAX_UPCOMING_PER_PHONE) throw new TooManyBookingsError();

  const paymentStatus: PaymentStatus = input.paymentStatus ?? (input.slipFile ? "slip_uploaded" : "unpaid");
  const status: BookingStatus = input.status ?? "new";
  // card bookings get a secret token: it is the only way back to the payment pages for that booking
  const payToken = input.paymentMethod === "card" ? randomBytes(24).toString("hex") : null;

  for (let attempt = 0; attempt < 5; attempt++) {
    const ref = newRef();
    try {
      const res = await query(
        `INSERT INTO test_bookings
           (ref, full_name, phone, email, notes, appointment_date, slot_time, amount_lkr,
            payment_status, payment_method, slip_file, slip_mime, slip_uploaded_at, created_ip, status, pay_token)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,
                 CASE WHEN $11::text IS NULL THEN NULL ELSE now() END,$13,$14,$15)
         RETURNING id, ref`,
        [
          ref, input.fullName, input.phone, input.email || null, input.notes || null,
          input.date, input.time, BOOKING.priceLkr, paymentStatus, input.paymentMethod,
          input.slipFile, input.slipMime, input.ip, status, payToken,
        ]
      );
      return { ...res.rows[0], ...(payToken ? { payToken } : {}) };
    } catch (err) {
      const e = err as { code?: string; constraint?: string };
      if (e.code === "23505" && e.constraint === "test_bookings_active_slot") throw new SlotTakenError();
      if (e.code === "23505" && e.constraint === "test_bookings_ref_key") continue; // ref clash: try another
      throw err;
    }
  }
  throw new Error("Could not generate a unique booking reference");
}

/**
 * Releases card bookings whose payment was never completed (patient closed PayHere, card declined, ...).
 * Runs lazily before anything that looks at free slots, so no scheduler is needed.
 */
export async function expireUnpaidCardBookings() {
  await ensureSchema();
  await query(
    `UPDATE test_bookings
        SET status = 'cancelled', expired_at = now(), updated_at = now(),
            admin_notes = concat_ws(E'\n', admin_notes, 'Card payment was not completed within ' || $1::int || ' minutes: slot released automatically.')
      WHERE payment_method = 'card' AND payment_status = 'unpaid' AND status = 'new'
        AND created_at < now() - ($1::int * interval '1 minute')`,
    [BOOKING.cardHoldMinutes]
  );
}

type BookedMap = Map<string, number>; // "YYYY-MM-DD HH:MM" -> count

async function bookedCounts(from: string, to: string): Promise<BookedMap> {
  await expireUnpaidCardBookings();
  const res = await query(
    `SELECT to_char(appointment_date,'YYYY-MM-DD') AS d, slot_time AS t, count(*)::int AS n
       FROM test_bookings
      WHERE appointment_date BETWEEN $1::date AND $2::date AND status = ANY($3)
      GROUP BY 1,2`,
    [from, to, SLOT_HOLDING_STATUSES]
  );
  const map: BookedMap = new Map();
  for (const r of res.rows) map.set(`${r.d} ${String(r.t).trim()}`, r.n);
  return map;
}

export async function getSlots(date: string, nowMs = Date.now()) {
  if (!isDateString(date) || !isOpenDay(date)) return [];
  const booked = await bookedCounts(date, date);
  return dailySlotTimes().map((time) => ({
    time,
    available:
      isBookableSlot(date, time, nowMs) && (booked.get(`${date} ${time}`) ?? 0) < BOOKING.capacityPerSlot,
  }));
}

/** date -> number of bookable slots, for the next `maxDaysAhead` days */
export async function getAvailability(nowMs = Date.now()) {
  const today = todayInColombo(nowMs);
  const last = addDays(today, BOOKING.maxDaysAhead);
  const booked = await bookedCounts(today, last);
  const out: Record<string, number> = {};
  for (let d = today; d <= last; d = addDays(d, 1)) {
    if (!isOpenDay(d)) continue;
    out[d] = dailySlotTimes().filter(
      (t) => isBookableSlot(d, t, nowMs) && (booked.get(`${d} ${t}`) ?? 0) < BOOKING.capacityPerSlot
    ).length;
  }
  return out;
}

// ------------------------- admin -------------------------

export type ListFilter = { status?: string; date?: string; q?: string; paymentStatus?: string; upcoming?: boolean; followUpDue?: boolean };

export async function listBookings(filter: ListFilter): Promise<BookingRow[]> {
  await expireUnpaidCardBookings();
  const where: string[] = [];
  const params: unknown[] = [];
  const add = (sql: string, value: unknown) => {
    params.push(value);
    where.push(sql.replace("?", `$${params.length}`));
  };
  if (filter.status && (BOOKING_STATUSES as readonly string[]).includes(filter.status)) add("status = ?", filter.status);
  if (filter.paymentStatus && (PAYMENT_STATUSES as readonly string[]).includes(filter.paymentStatus)) add("payment_status = ?", filter.paymentStatus);
  if (filter.date && isDateString(filter.date)) add("appointment_date = ?::date", filter.date);
  if (filter.followUpDue) add("follow_up_on IS NOT NULL AND status = 'completed' AND follow_up_on <= ?::date", todayInColombo());
  if (filter.upcoming) add("appointment_date >= ?::date", todayInColombo());
  if (filter.q) {
    const like = `%${filter.q.replace(/[%_\\]/g, (c) => `\\${c}`)}%`;
    params.push(like);
    const i = params.length;
    where.push(`(full_name ILIKE $${i} OR phone ILIKE $${i} OR ref ILIKE $${i} OR coalesce(email,'') ILIKE $${i})`);
  }
  const res = await query(
    `SELECT ${COLUMNS} FROM test_bookings
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY appointment_date ASC, slot_time ASC, created_at ASC
      LIMIT 1000`,
    params
  );
  return res.rows;
}

export async function getBookingCounts() {
  await ensureSchema();
  const res = await query(
    `SELECT
       count(*) FILTER (WHERE status = 'new')::int AS new_count,
       count(*) FILTER (WHERE status IN ('new','confirmed') AND appointment_date >= $1::date)::int AS upcoming,
       count(*) FILTER (WHERE payment_status = 'slip_uploaded' AND status <> 'cancelled')::int AS slips_to_verify,
       count(*) FILTER (WHERE follow_up_on IS NOT NULL AND follow_up_on <= $1::date AND status = 'completed')::int AS follow_ups_due
     FROM test_bookings`,
    [todayInColombo()]
  );
  return res.rows[0] as { new_count: number; upcoming: number; slips_to_verify: number; follow_ups_due: number };
}

export async function getBookingSlip(id: string) {
  await ensureSchema();
  const res = await query(`SELECT slip_file, slip_mime, ref FROM test_bookings WHERE id = $1`, [id]);
  return res.rows[0] as { slip_file: string | null; slip_mime: string | null; ref: string } | undefined;
}

export type BookingPatch = {
  status?: BookingStatus;
  payment_status?: PaymentStatus;
  admin_notes?: string;
  follow_up_on?: string | null;
  appointment_date?: string;
  slot_time?: string;
};

export async function updateBooking(id: string, patch: BookingPatch): Promise<BookingRow | null> {
  await ensureSchema();
  const sets: string[] = [];
  const params: unknown[] = [];
  const set = (col: string, value: unknown, cast = "") => {
    params.push(value);
    sets.push(`${col} = $${params.length}${cast}`);
  };

  if (patch.status !== undefined) {
    if (!(BOOKING_STATUSES as readonly string[]).includes(patch.status)) throw new Error("Invalid status");
    set("status", patch.status);
  }
  if (patch.payment_status !== undefined) {
    if (!(PAYMENT_STATUSES as readonly string[]).includes(patch.payment_status)) throw new Error("Invalid payment status");
    set("payment_status", patch.payment_status);
  }
  if (patch.admin_notes !== undefined) set("admin_notes", patch.admin_notes.trim().slice(0, 2000) || null);
  if (patch.follow_up_on !== undefined) {
    if (patch.follow_up_on !== null && !isDateString(patch.follow_up_on)) throw new Error("Invalid follow-up date");
    set("follow_up_on", patch.follow_up_on, "::date");
  }
  if (patch.appointment_date !== undefined || patch.slot_time !== undefined) {
    if (!patch.appointment_date || !patch.slot_time || !isDateString(patch.appointment_date) || !isTimeString(patch.slot_time)) {
      throw new Error("Invalid appointment date or time");
    }
    set("appointment_date", patch.appointment_date, "::date");
    set("slot_time", patch.slot_time);
  }
  if (!sets.length) throw new Error("Nothing to update");

  params.push(id);
  try {
    const res = await query(
      `UPDATE test_bookings SET ${sets.join(", ")}, updated_at = now()
        WHERE id = $${params.length}
        RETURNING ${COLUMNS}`,
      params
    );
    return res.rows[0] ?? null;
  } catch (err) {
    const e = err as { code?: string; constraint?: string };
    if (e.code === "23505" && e.constraint === "test_bookings_active_slot") throw new SlotTakenError();
    throw err;
  }
}

export async function getBooking(id: string): Promise<BookingRow | null> {
  await ensureSchema();
  const res = await query(`SELECT ${COLUMNS} FROM test_bookings WHERE id = $1`, [id]);
  return res.rows[0] ?? null;
}

export type EmailLogRow = { id: string; kind: string; to_email: string | null; status: "sent" | "failed" | "skipped"; error: string | null; created_at: string; message_id: string | null };

export async function logEmail(bookingId: string | null, kind: string, to: string | null, status: EmailLogRow["status"], error?: string, messageId?: string) {
  try {
    await ensureSchema();
    await query(
      `INSERT INTO booking_emails (booking_id, kind, to_email, status, error, message_id) VALUES ($1,$2,$3,$4,$5,$6)`,
      [bookingId, kind, to, status, error ? error.slice(0, 300) : null, messageId ?? null]
    );
  } catch (err) {
    console.error("[booking-email] could not write log:", err instanceof Error ? err.message : err);
  }
}

export async function listEmails(bookingId: string): Promise<EmailLogRow[]> {
  await ensureSchema();
  const res = await query(
    `SELECT id::text, kind, to_email, status, error, created_at, message_id FROM booking_emails
      WHERE booking_id = $1 ORDER BY created_at DESC LIMIT 20`,
    [bookingId]
  );
  return res.rows;
}

// ------------------------- card payments (PayHere) -------------------------

/** Looks a booking up by reference + its secret pay token (used by the payment return/cancel pages) */
export async function getBookingForPayment(ref: string, token: string): Promise<BookingRow | null> {
  if (!/^JB-[A-Z0-9]{6}$/.test(ref) || !/^[0-9a-f]{48}$/.test(token)) return null;
  await expireUnpaidCardBookings();
  const res = await query(`SELECT ${COLUMNS} FROM test_bookings WHERE ref = $1 AND pay_token = $2`, [ref, token]);
  return res.rows[0] ?? null;
}

export async function getBookingByRef(ref: string): Promise<BookingRow | null> {
  if (!/^JB-[A-Z0-9]{6}$/.test(ref)) return null;
  await ensureSchema();
  const res = await query(`SELECT ${COLUMNS} FROM test_bookings WHERE ref = $1`, [ref]);
  return res.rows[0] ?? null;
}

/** Patient chose "pay at TRACE" instead of finishing the card payment */
export async function switchToPayAtVenue(id: string): Promise<boolean> {
  const res = await query(
    `UPDATE test_bookings SET payment_method = 'pay_at_venue', updated_at = now()
      WHERE id = $1 AND payment_method = 'card' AND payment_status = 'unpaid' AND status = 'new'`,
    [id]
  );
  return res.rowCount === 1;
}

/** Patient chose "start over": give the held slot back right away */
export async function releaseCardBooking(id: string): Promise<boolean> {
  const res = await query(
    `UPDATE test_bookings
        SET status = 'cancelled', updated_at = now(),
            admin_notes = concat_ws(E'\n', admin_notes, 'Patient started over before paying by card: slot released.')
      WHERE id = $1 AND payment_method = 'card' AND payment_status = 'unpaid' AND status = 'new'`,
    [id]
  );
  return res.rowCount === 1;
}

export type PaidResult = { transitioned: boolean; slotLost: boolean };

/**
 * Marks a card booking as paid. Safe to call several times (PayHere may repeat a notification):
 * only the first call reports `transitioned: true`, so emails go out once.
 * If the 30-minute hold had already expired, the slot is taken back when it is still free.
 */
export async function markCardPaid(id: string, paymentId: string): Promise<PaidResult> {
  await ensureSchema();
  const upd = await query(
    `UPDATE test_bookings SET payment_status = 'paid', payhere_payment_id = $2, paid_at = now(), updated_at = now()
      WHERE id = $1 AND payment_status <> 'paid'
      RETURNING status, expired_at`,
    [id, paymentId.slice(0, 40)]
  );
  if (upd.rowCount !== 1) return { transitioned: false, slotLost: false };

  let slotLost = false;
  const { status, expired_at } = upd.rows[0] as { status: string; expired_at: string | null };
  if (status === "cancelled" && expired_at) {
    try {
      await query(
        `UPDATE test_bookings SET status = 'new', expired_at = NULL, updated_at = now(),
                admin_notes = concat_ws(E'\n', admin_notes, 'Payment arrived after the hold expired; slot taken back automatically.')
          WHERE id = $1`,
        [id]
      );
    } catch (err) {
      if ((err as { code?: string }).code !== "23505") throw err;
      slotLost = true;
      await query(
        `UPDATE test_bookings SET admin_notes = concat_ws(E'\n', admin_notes, 'PAID BY CARD but the slot was booked by someone else after the hold expired. Please contact the patient: rebook or refund.'), updated_at = now() WHERE id = $1`,
        [id]
      );
    }
  }
  return { transitioned: true, slotLost };
}

export async function addAdminNote(id: string, note: string) {
  await query(`UPDATE test_bookings SET admin_notes = concat_ws(E'\n', admin_notes, $2::text), updated_at = now() WHERE id = $1`, [id, note.slice(0, 300)]);
}

export async function recordPaymentEvent(e: {
  bookingId: string | null;
  orderId: string;
  paymentId: string;
  statusCode: string;
  amount: string;
  currency: string;
  signatureOk: boolean;
  outcome: string;
}) {
  try {
    await ensureSchema();
    await query(
      `INSERT INTO payment_events (booking_id, order_id, payhere_payment_id, status_code, amount, currency, signature_ok, outcome)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [e.bookingId, e.orderId.slice(0, 40), e.paymentId.slice(0, 40), e.statusCode.slice(0, 8), e.amount.slice(0, 20), e.currency.slice(0, 8), e.signatureOk, e.outcome.slice(0, 60)]
    );
  } catch (err) {
    console.error("[payhere] could not write payment event:", err instanceof Error ? err.message : err);
  }
}
