import { BOOKING, PAYMENT_METHODS, type PaymentMethod } from "./config";
import { isBookableSlot, isScheduledSlot } from "./time";

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
// local part: letters, digits and ._%+'- (no leading/trailing/double dots); domain: labels + a 2+ letter TLD
const EMAIL_RE = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

export function isValidEmail(email: string): boolean {
  if (email.length > 120 || !EMAIL_RE.test(email)) return false;
  const [local] = email.split("@");
  return !email.includes("..") && !local.startsWith(".") && !local.endsWith(".") && local.length <= 64;
}

/**
 * Returns +94XXXXXXXXX for Sri Lankan numbers (mobile 070–078 or landline with area code),
 * +<digits> for other international numbers, or null.
 */
export function normalizePhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s\-().]/g, "");
  const local = cleaned.match(/^(?:\+94|0094|94|0)?(\d{9})$/);
  if (local) {
    const n = local[1];
    if (/^7[0-8]\d{7}$/.test(n)) return `+94${n}`; // mobile
    if (/^[1-689]\d{8}$/.test(n)) return `+94${n}`; // landline: 011 xxx xxxx, 081 xxx xxxx ...
    return null;
  }
  const intl = cleaned.match(/^\+(\d{8,15})$/);
  if (intl && !intl[1].startsWith("94")) return `+${intl[1]}`;
  return null;
}

/** A specific, human message for a phone number that failed normalizePhone */
export function phoneProblem(raw: string): string {
  const v = raw.trim();
  if (!v) return "Please enter a phone number we can call you on.";
  if (/[A-Za-z]/.test(v)) return "A phone number can only contain digits.";
  const digits = v.replace(/\D/g, "");
  if (!v.startsWith("+") && digits.length !== 10 && !/^(?:94|0094)\d{9}$/.test(digits)) {
    return "Sri Lankan numbers have 10 digits, e.g. 077 123 4567.";
  }
  if (/^0?7\d{8}$/.test(digits.replace(/^(?:0094|94)/, "0"))) {
    return "Sri Lankan mobile numbers start with 070 to 078, e.g. 077 123 4567.";
  }
  return "Enter a valid number, e.g. 077 123 4567 (mobile) or include your country code, e.g. +44 7911 123456.";
}

/** Live formatting while typing: "0771234567" -> "077 123 4567". Anything unusual is left as typed. */
export function formatPhoneInput(raw: string): string {
  let v = raw.replace(/[^\d+]/g, "");
  v = v.startsWith("+") ? `+${v.slice(1).replace(/\+/g, "")}` : v.replace(/\+/g, "");
  if (/^0[1-9]/.test(v)) {
    const d = v.slice(0, 10);
    return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean).join(" ");
  }
  if (v.startsWith("+94")) {
    const d = v.slice(3, 12);
    return `+94${d ? " " : ""}${[d.slice(0, 2), d.slice(2, 5), d.slice(5, 9)].filter(Boolean).join(" ")}`;
  }
  return v.slice(0, 16);
}

const DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gmal.com": "gmail.com", "gamil.com": "gmail.com",
  "gnail.com": "gmail.com", "gmail.con": "gmail.com", "gmail.co": "gmail.com", "gmaill.com": "gmail.com",
  "hotmial.com": "hotmail.com", "hotmal.com": "hotmail.com", "hotmail.con": "hotmail.com",
  "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.con": "yahoo.com",
  "outlok.com": "outlook.com", "outlook.con": "outlook.com",
};

/** "kausian@gmial.com" -> "kausian@gmail.com" (null when nothing looks wrong) */
export function suggestEmailFix(email: string): string | null {
  const [local, domain] = email.trim().toLowerCase().split("@");
  if (!local || !domain) return null;
  const fixed = DOMAIN_TYPOS[domain];
  return fixed ? `${local}@${fixed}` : null;
}

/** `staff: true` is used by the admin panel: no lead-time rule and no patient consent tick */
export function validateBooking(
  raw: Partial<Record<keyof BookingInput, unknown>>,
  nowMs = Date.now(),
  options: { staff?: boolean } = {}
) {
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
  else if (!NAME_RE.test(fullName)) errors.fullName = "Please enter a valid name: letters only, 2 to 80 characters (no numbers or symbols).";

  const phone = normalizePhone(phoneRaw);
  if (!phoneRaw) errors.phone = "Please enter a phone number we can call you on.";
  else if (!phone) errors.phone = phoneProblem(phoneRaw);

  if (!email) {
    if (!options.staff) errors.email = "Please enter your email address so we can send your booking confirmation.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address, e.g. name@example.com.";
  }

  if (notes.length > 500) errors.notes = "Notes can be up to 500 characters.";

  if (!date || !time) errors.date = "Please choose a date and time.";
  else if (!(options.staff ? isScheduledSlot(date, time, nowMs) : isBookableSlot(date, time, nowMs))) errors.date = "That time is no longer available. Please pick another slot.";

  if (!(PAYMENT_METHODS as readonly string[]).includes(paymentMethod)) errors.paymentMethod = "Choose how you would like to pay.";

  if (!consent && !options.staff) errors.consent = "Please confirm that we may call you to confirm the appointment.";

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
