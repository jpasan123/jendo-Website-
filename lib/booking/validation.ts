import { BOOKING, PAYMENT_METHODS, type PaymentMethod } from "./config";
import { isBookableSlot } from "./time";

export type BookingInput = {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  date: string;
  time: string;
  paymentMethod: PaymentMethod;
  consent: boolean;
};

export type FieldErrors = Partial<Record<keyof BookingInput | "slip", string>>;

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]{1,79}$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns +94XXXXXXXXX for Sri Lankan numbers, +<digits> for other international numbers, or null */
export function normalizePhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s\-().]/g, "");
  const local = cleaned.match(/^(?:\+?94|0094|0)?([1-9]\d{8})$/);
  if (local) return `+94${local[1]}`;
  const intl = cleaned.match(/^\+(\d{8,15})$/);
  if (intl && !intl[1].startsWith("94")) return `+${intl[1]}`;
  return null;
}

export function validateBooking(raw: Partial<Record<keyof BookingInput, unknown>>, nowMs = Date.now()) {
  const errors: FieldErrors = {};
  const fullName = String(raw.fullName ?? "").trim().replace(/\s+/g, " ");
  const phoneRaw = String(raw.phone ?? "").trim();
  const email = String(raw.email ?? "").trim().toLowerCase();
  const notes = String(raw.notes ?? "").trim();
  const date = String(raw.date ?? "").trim();
  const time = String(raw.time ?? "").trim();
  const paymentMethod = String(raw.paymentMethod ?? "") as PaymentMethod;
  const consent = raw.consent === true || raw.consent === "true" || raw.consent === "on";

  if (!fullName) errors.fullName = "Please enter your full name.";
  else if (!NAME_RE.test(fullName)) errors.fullName = "Please enter a valid name (letters only, 2–80 characters).";

  const phone = normalizePhone(phoneRaw);
  if (!phoneRaw) errors.phone = "Please enter a phone number we can call you on.";
  else if (!phone) errors.phone = "Enter a valid phone number, e.g. 077 123 4567.";

  if (email && (email.length > 120 || !EMAIL_RE.test(email))) errors.email = "Enter a valid email address or leave it empty.";

  if (notes.length > 500) errors.notes = "Notes can be up to 500 characters.";

  if (!date || !time) errors.date = "Please choose a date and time.";
  else if (!isBookableSlot(date, time, nowMs)) errors.date = "That time is no longer available. Please pick another slot.";

  if (!(PAYMENT_METHODS as readonly string[]).includes(paymentMethod)) errors.paymentMethod = "Choose how you would like to pay.";

  if (!consent) errors.consent = "Please confirm that we may call you to confirm the appointment.";

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    value: { fullName, phone: phone ?? phoneRaw, email, notes, date, time, paymentMethod, consent } as BookingInput,
  };
}

export type SlipKind = { mime: (typeof BOOKING.slipTypes)[number]; ext: string };

/** Detects the real file type from its first bytes (the browser-supplied type is not trusted) */
export function sniffSlip(bytes: Uint8Array): SlipKind | null {
  const b = bytes;
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { mime: "image/png", ext: "png" };
  if (
    b.length >= 12 &&
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  ) return { mime: "image/webp", ext: "webp" };
  if (b.length >= 5 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 && b[4] === 0x2d) return { mime: "application/pdf", ext: "pdf" };
  return null;
}
