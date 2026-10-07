import { createHash, timingSafeEqual } from "crypto";
import { BOOKING } from "./config";

/**
 * PayHere card payments for test bookings (server-side only: the merchant secret never leaves the server).
 * The amount comes from the booking row (set by the server when the booking was made), never from the browser.
 */

const md5Upper = (value: string) => createHash("md5").update(value).digest("hex").toUpperCase();

const merchantId = () => process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID?.trim() || "";
const merchantSecret = () => process.env.PAYHERE_SECRET?.trim() || "";

/** Card payments are offered only when PayHere is configured (and not switched off with BOOKING_CARD_PAYMENTS=off) */
export function cardPaymentsEnabled() {
  return !!merchantId() && !!merchantSecret() && process.env.BOOKING_CARD_PAYMENTS?.trim().toLowerCase() !== "off";
}

/** Public address used in the links PayHere sends people (and its server) back to */
export function publicBaseUrl() {
  const raw = process.env.BOOKING_PUBLIC_URL?.trim() || process.env.AUTH_URL?.trim() || "https://jendo.health";
  return raw.replace(/\/+$/, "");
}

function checkoutUrl() {
  return process.env.PAYHERE_MODE?.trim().toLowerCase() === "sandbox"
    ? "https://sandbox.payhere.lk/pay/checkout"
    : "https://www.payhere.lk/pay/checkout";
}

export type CheckoutPayload = { action: string; fields: Record<string, string> };

type CheckoutBooking = { ref: string; full_name: string; email: string | null; phone: string; amountLkr: number };

export function buildCheckout(b: CheckoutBooking, payToken: string): CheckoutPayload {
  const amount = b.amountLkr.toFixed(2);
  const currency = BOOKING.currency;
  const hash = md5Upper(`${merchantId()}${b.ref}${amount}${currency}${md5Upper(merchantSecret())}`);
  const [first, ...rest] = b.full_name.trim().split(/\s+/);
  const base = publicBaseUrl();
  const q = `ref=${encodeURIComponent(b.ref)}&t=${encodeURIComponent(payToken)}`;
  return {
    action: checkoutUrl(),
    fields: {
      merchant_id: merchantId(),
      return_url: `${base}/book-test/payment/return?${q}`,
      cancel_url: `${base}/book-test/payment/cancel?${q}`,
      notify_url: `${base}/api/bookings/payhere-notify`,
      order_id: b.ref,
      items: `Jendo vascular health test (${b.ref})`,
      currency,
      amount,
      first_name: first || "Patient",
      last_name: rest.join(" ") || "-",
      email: b.email || "",
      phone: b.phone,
      address: "Jendo test booking",
      city: "Colombo",
      country: "Sri Lanka",
      hash,
      custom_1: b.ref,
    },
  };
}

export type PayhereNotice = {
  merchant_id: string;
  order_id: string;
  payment_id: string;
  payhere_amount: string;
  payhere_currency: string;
  status_code: string;
  md5sig: string;
};

export function readNotice(form: FormData): PayhereNotice {
  const get = (k: string) => String(form.get(k) ?? "").trim();
  return {
    merchant_id: get("merchant_id"),
    order_id: get("order_id"),
    payment_id: get("payment_id"),
    payhere_amount: get("payhere_amount"),
    payhere_currency: get("payhere_currency"),
    status_code: get("status_code"),
    md5sig: get("md5sig"),
  };
}

/** md5sig = MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + MD5(secret)) as PayHere documents it */
export function signatureValid(n: PayhereNotice): boolean {
  if (!n.md5sig || !merchantSecret()) return false;
  const expected = md5Upper(`${n.merchant_id}${n.order_id}${n.payhere_amount}${n.payhere_currency}${n.status_code}${md5Upper(merchantSecret())}`);
  const given = n.md5sig.toUpperCase();
  if (given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

export function isOurMerchant(id: string) {
  return !!id && id === merchantId();
}

/** The amount PayHere charged must equal the amount stored on the booking when it was made (to the cent), in LKR */
export function amountMatches(n: PayhereNotice, expectedLkr: number) {
  return n.payhere_currency === BOOKING.currency && Math.abs(Number(n.payhere_amount) - expectedLkr) < 0.005;
}
