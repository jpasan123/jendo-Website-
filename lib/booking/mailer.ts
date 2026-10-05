import nodemailer, { type Transporter } from "nodemailer";
import { BOOKING } from "./config";
import { buildIcs } from "./ics";
import { formatDateLong, formatTime12h } from "./time";
import { logEmail, type BookingRow } from "./store";

export type EmailKind = "received" | "confirmed" | "cancelled" | "rescheduled" | "payment_received";
export const EMAIL_KINDS: EmailKind[] = ["received", "confirmed", "cancelled", "rescheduled", "payment_received"];

export type SendResult = { status: "sent" | "failed" | "skipped"; reason?: "not_configured" | "no_email" | "error"; to?: string; error?: string };

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

const brevoKey = () => process.env.BREVO_API_KEY?.trim() || "";
const brevoUrl = () => process.env.BREVO_API_URL?.trim() || "https://api.brevo.com/v3/smtp/email";

/** Either a Brevo API key (HTTPS) or classic SMTP settings */
export function emailConfigured() {
  if (brevoKey()) return !!senderAddress();
  return !!(process.env.SMTP_HOST?.trim() && process.env.SMTP_USER?.trim() && process.env.SMTP_PASSWORD);
}

/** "Name <address>" or a bare address from SMTP_FROM / BREVO_SENDER_EMAIL / SMTP_USER */
export function smtpFrom() {
  return process.env.SMTP_FROM?.trim() || (process.env.BREVO_SENDER_EMAIL?.trim() ? `Jendo <${process.env.BREVO_SENDER_EMAIL.trim()}>` : process.env.SMTP_USER?.trim() ? `Jendo <${process.env.SMTP_USER.trim()}>` : "");
}

function senderAddress() {
  const from = smtpFrom();
  const m = from.match(/^\s*(?:"?([^"<]*?)"?\s*)?<([^>]+)>\s*$/);
  if (m) return { name: (m[1] || "Jendo").trim() || "Jendo", email: m[2].trim() };
  return from ? { name: "Jendo", email: from.trim() } : null;
}

let cached: { key: string; transport: Transporter } | null = null;
export function getTransport(): Transporter {
  const host = process.env.SMTP_HOST!.trim();
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER!.trim();
  const key = `${host}:${port}:${user}`;
  if (!cached || cached.key !== key) {
    cached = {
      key,
      transport: nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass: process.env.SMTP_PASSWORD },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 15000,
      }),
    };
  }
  return cached.transport;
}

export function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.slice(0, 1)}${"*".repeat(Math.max(1, Math.min(name.length - 1, 5)))}@${domain}`;
}

const siteUrl = () => (process.env.BOOKING_PUBLIC_URL?.trim() || "https://jendo.health").replace(/\/$/, "");
const contactPhone = () => process.env.BOOKING_CONTACT_PHONE?.trim() || "+94 76 621 0120";

type Content = { subject: string; heading: string; intro: string; lines: string[]; showDetails: boolean; ics: boolean };

function contentFor(kind: EmailKind, b: BookingRow): Content {
  const first = b.full_name.split(" ")[0];
  const venue = BOOKING.venueName;
  switch (kind) {
    case "received":
      return {
        subject: `We received your Jendo test booking (${b.ref})`,
        heading: "Booking received",
        intro: `Hi ${first}, thank you for booking a Jendo vascular health test. Our team will call you shortly to confirm your appointment time.`,
        lines: [
          `Please keep your reference <strong>${esc(b.ref)}</strong> handy.`,
          b.payment_status === "slip_uploaded"
            ? "We have your payment slip and will verify it."
            : `The test fee is <strong>Rs. ${b.amount_lkr.toLocaleString("en-US")}</strong>. You can pay online or at ${esc(venue)} on the day.`,
        ],
        showDetails: true,
        ics: false,
      };
    case "confirmed":
      return {
        subject: `Your Jendo test appointment is confirmed (${b.ref})`,
        heading: "Appointment confirmed",
        intro: `Hi ${first}, your Jendo vascular health test is confirmed. We look forward to seeing you.`,
        lines: [
          "Please arrive about 10 minutes early. The test takes around 15 minutes.",
          b.payment_status === "paid"
            ? "Your payment has been received, so there is nothing more to pay."
            : `The test fee is <strong>Rs. ${b.amount_lkr.toLocaleString("en-US")}</strong>, payable at ${esc(venue)} (or online before your visit).`,
          "A calendar invite is attached so you can add this to your calendar.",
        ],
        showDetails: true,
        ics: true,
      };
    case "rescheduled":
      return {
        subject: `Your Jendo test appointment has moved (${b.ref})`,
        heading: "Appointment rescheduled",
        intro: `Hi ${first}, your Jendo test appointment has been moved to the time below.`,
        lines: [`If this time does not suit you, please call us on ${esc(contactPhone())} and we will find another.`, "An updated calendar invite is attached."],
        showDetails: true,
        ics: true,
      };
    case "cancelled":
      return {
        subject: `Your Jendo test booking was cancelled (${b.ref})`,
        heading: "Booking cancelled",
        intro: `Hi ${first}, your Jendo test booking has been cancelled.`,
        lines: [
          `If this is unexpected, or you would like to rebook, call us on ${esc(contactPhone())} or book again at <a href="${siteUrl()}/book-test" style="color:#893A9F">${siteUrl().replace(/^https?:\/\//, "")}/book-test</a>.`,
          b.payment_status !== "unpaid" ? "If you have already paid, our team will contact you about your payment." : "",
        ].filter(Boolean),
        showDetails: true,
        ics: false,
      };
    case "payment_received":
      return {
        subject: `Payment received for your Jendo test (${b.ref})`,
        heading: "Payment received",
        intro: `Hi ${first}, we have received your payment of Rs. ${b.amount_lkr.toLocaleString("en-US")}. Thank you.`,
        lines: ["Nothing more to pay on the day. We will call you if anything needs to change."],
        showDetails: true,
        ics: false,
      };
  }
}

function render(c: Content, b: BookingRow) {
  const rows: [string, string][] = [
    ["Reference", b.ref],
    ["Date", formatDateLong(b.appointment_date)],
    ["Time", formatTime12h(b.slot_time)],
    ["Where", `${BOOKING.venueName}, ${BOOKING.venueAddress}`],
  ];
  const detailRows = c.showDetails
    ? rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:8px 0;color:#6b7280;font-size:13px;width:110px;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;color:#2d0a3e;font-size:15px;font-weight:600">${esc(v)}</td></tr>`
        )
        .join("")
    : "";
  const html = `<!doctype html><html><body style="margin:0;background:#f6f4f9;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f4f9;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="padding:22px 28px 6px"><img src="${siteUrl()}/jendo-icon.png" alt="Jendo" width="120" style="display:block;margin:0 0 -20px -12px"></td></tr>
<tr><td style="background:#4a1260;background-image:linear-gradient(135deg,#2d0a3e,#893A9F);padding:26px 28px"><h1 style="margin:0;color:#ffffff;font-size:24px">${esc(c.heading)}</h1></td></tr>
<tr><td style="padding:26px 28px;color:#374151;font-size:15px;line-height:1.6">
<p style="margin:0 0 16px">${esc(c.intro)}</p>
${detailRows ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1fa;border-radius:12px;padding:8px 18px;margin:0 0 18px">${detailRows}</table>` : ""}
${c.lines.map((l) => `<p style="margin:0 0 12px">${l}</p>`).join("")}
<p style="margin:20px 0 0;color:#6b7280;font-size:13px">Questions? Reply to this email or call ${esc(contactPhone())}.</p>
</td></tr>
<tr><td style="padding:16px 28px;background:#faf8fc;color:#9ca3af;font-size:12px">Jendo Innovations &middot; jendo.health</td></tr>
</table></td></tr></table></body></html>`;
  const text = [
    c.heading,
    "",
    c.intro,
    "",
    ...(c.showDetails ? rows.map(([k, v]) => `${k}: ${v}`) : []),
    "",
    ...c.lines.map((l) => l.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&")),
    "",
    `Questions? Reply to this email or call ${contactPhone()}.`,
  ].join("\n");
  return { html, text };
}

type Attachment = { filename: string; content: string; contentType: string };

/** Sends one email through Brevo's HTTPS API (used when BREVO_API_KEY is set) */
async function sendViaBrevoApi(to: string, subject: string, html: string, text: string, attachments?: Attachment[], replyTo?: string) {
  const sender = senderAddress();
  if (!sender) throw new Error("No sender address configured (set BREVO_SENDER_EMAIL or SMTP_FROM)");
  const res = await fetch(brevoUrl(), {
    method: "POST",
    headers: { "api-key": brevoKey(), "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender,
      to: [{ email: to }],
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
      subject,
      htmlContent: html,
      textContent: text,
      ...(attachments?.length ? { attachment: attachments.map((a) => ({ name: a.filename, content: Buffer.from(a.content, "utf8").toString("base64") })) } : {}),
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    let detail = "";
    try {
      const body = (await res.json()) as { message?: string; code?: string };
      detail = [body.code, body.message].filter(Boolean).join(": ");
    } catch {
      /* non-JSON error body */
    }
    throw new Error(`Brevo ${res.status}${detail ? ` ${detail}` : ""}`.slice(0, 280));
  }
}

/** Single entry point used by every email in the booking system */
export async function sendMail(to: string, subject: string, html: string, text: string, attachments?: Attachment[]) {
  const replyTo = process.env.BOOKING_NOTIFY_EMAIL?.trim() || undefined;
  if (brevoKey()) return sendViaBrevoApi(to, subject, html, text, attachments, replyTo);
  await getTransport().sendMail({ from: smtpFrom(), to, replyTo, subject, html, text, attachments });
}

const deliver = sendMail;

/** Emails the patient and records the outcome. Never throws: a mail problem must not break a booking action. */
export async function sendBookingEmail(kind: EmailKind, b: BookingRow): Promise<SendResult> {
  const to = (b.email || "").trim();
  if (!to) {
    await logEmail(b.id, kind, null, "skipped", "no email address on file");
    return { status: "skipped", reason: "no_email" };
  }
  if (!emailConfigured()) {
    await logEmail(b.id, kind, to, "skipped", "SMTP is not configured");
    return { status: "skipped", reason: "not_configured", to };
  }
  try {
    const c = contentFor(kind, b);
    const { html, text } = render(c, b);
    const attachments = c.ics
      ? [{
          filename: `Jendo-Test-${b.ref}.ics`,
          content: buildIcs({ ref: b.ref, date: b.appointment_date, time: b.slot_time, venueName: BOOKING.venueName, venueAddress: BOOKING.venueAddress, slotMinutes: BOOKING.slotMinutes }),
          contentType: "text/calendar; charset=utf-8; method=PUBLISH",
        }]
      : undefined;
    await deliver(to, c.subject, html, text, attachments);
    await logEmail(b.id, kind, to, "sent");
    return { status: "sent", to };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[booking-email] ${kind} to ${maskEmail(to)} failed:`, message);
    await logEmail(b.id, kind, to, "failed", message);
    return { status: "failed", reason: "error", to, error: message };
  }
}

/** Same as sendBookingEmail but gives up waiting after `ms` (the send keeps going in the background) */
export async function sendBookingEmailWithin(kind: EmailKind, b: BookingRow, ms = 8000): Promise<SendResult | { status: "pending" }> {
  const sending = sendBookingEmail(kind, b);
  const timeout = new Promise<{ status: "pending" }>((resolve) => setTimeout(() => resolve({ status: "pending" }), ms));
  return Promise.race([sending, timeout]);
}

export async function sendTestEmail(to: string): Promise<SendResult> {
  if (!emailConfigured()) return { status: "skipped", reason: "not_configured", to };
  try {
    await deliver(
      to,
      "Jendo booking emails are working",
      `<p style="font-family:Arial,sans-serif">This is a test email from the Jendo booking system. If you can read this, patient emails will be delivered.</p>`,
      "This is a test email from the Jendo booking system. If you can read this, patient emails will be delivered."
    );
    return { status: "sent", to };
  } catch (err) {
    return { status: "failed", reason: "error", to, error: err instanceof Error ? err.message : String(err) };
  }
}
