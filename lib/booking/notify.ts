import { emailConfigured, sendMail } from "./mailer";
import { BOOKING } from "./config";
import { formatDateLong, formatTime12h } from "./time";

type Notice = {
  ref: string;
  fullName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  paymentMethod: string;
  hasSlip: boolean;
  notes: string;
  amountLkr?: number;
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

/**
 * Emails the Jendo team when a new booking arrives. Optional: does nothing unless
 * SMTP_HOST/SMTP_USER/SMTP_PASSWORD and BOOKING_NOTIFY_EMAIL are configured.
 * Never throws — the booking is already saved by the time this runs.
 */
export async function notifyTeam(n: Notice): Promise<void> {
  const to = process.env.BOOKING_NOTIFY_EMAIL?.trim();
  if (!to || !emailConfigured()) return;

  try {
    const when = `${formatDateLong(n.date)} at ${formatTime12h(n.time)}`;
    const payment = n.hasSlip
      ? "Payment slip uploaded (please verify)"
      : n.paymentMethod === "bank_transfer"
        ? "Bank transfer selected"
        : "Will pay at TRACE";
    await sendMail(
      to,
      `New Jendo test booking ${n.ref}: ${n.fullName}, ${n.date} ${n.time}`,
      `
        <h2>New Jendo test booking (${esc(n.ref)})</h2>
        <p>Please call the patient back to confirm the appointment.</p>
        <table cellpadding="6">
          <tr><td><b>Name</b></td><td>${esc(n.fullName)}</td></tr>
          <tr><td><b>Phone</b></td><td>${esc(n.phone)}</td></tr>
          <tr><td><b>Email</b></td><td>${esc(n.email || "-")}</td></tr>
          <tr><td><b>Appointment</b></td><td>${esc(when)} at ${esc(BOOKING.venueName)}</td></tr>
          <tr><td><b>Payment</b></td><td>${esc(payment)} (LKR ${(n.amountLkr ?? BOOKING.priceLkr).toLocaleString("en-US")})</td></tr>
          <tr><td><b>Notes</b></td><td>${esc(n.notes || "-")}</td></tr>
        </table>`,
      `New Jendo test booking ${n.ref} from ${n.fullName} (${n.phone}) for ${when}. Please call to confirm.`
    );
  } catch (err) {
    console.error("[booking-notify] email failed:", err instanceof Error ? err.message : err);
  }
}

/** Tells the team that a card payment arrived (and flags the rare "paid but slot lost" case) */
export async function notifyTeamPaid(b: { ref: string; full_name: string; phone: string; appointment_date: string; slot_time: string; amount_lkr: number }, slotLost: boolean): Promise<void> {
  const to = process.env.BOOKING_NOTIFY_EMAIL?.trim();
  if (!to || !emailConfigured()) return;
  try {
    const when = `${formatDateLong(b.appointment_date)} at ${formatTime12h(b.slot_time)}`;
    const subject = slotLost
      ? `ACTION NEEDED: card payment received but slot lost (${b.ref})`
      : `Card payment received (${b.ref}): ${b.full_name}, ${b.appointment_date} ${b.slot_time}`;
    const warning = slotLost
      ? "<p><b>This patient paid by card, but their time slot had expired and was booked by someone else. Please call them to rebook or refund.</b></p>"
      : "<p>Please call the patient to confirm the appointment.</p>";
    await sendMail(
      to,
      subject,
      `<h2>Card payment received (${esc(b.ref)})</h2>${warning}
        <table cellpadding="6">
          <tr><td><b>Name</b></td><td>${esc(b.full_name)}</td></tr>
          <tr><td><b>Phone</b></td><td>${esc(b.phone)}</td></tr>
          <tr><td><b>Appointment</b></td><td>${esc(when)} at ${esc(BOOKING.venueName)}</td></tr>
          <tr><td><b>Paid</b></td><td>LKR ${b.amount_lkr.toLocaleString("en-US")} by card (PayHere)</td></tr>
        </table>`,
      `Card payment received for ${b.ref} from ${b.full_name} (${b.phone}) for ${when}.${slotLost ? " ACTION NEEDED: the slot was lost, please rebook or refund." : ""}`
    );
  } catch (err) {
    console.error("[booking-notify] paid email failed:", err instanceof Error ? err.message : err);
  }
}
