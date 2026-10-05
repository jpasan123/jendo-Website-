import nodemailer from "nodemailer";
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
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD;
  if (!to || !host || !user || !pass) return;

  try {
    const port = Number(process.env.SMTP_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    const when = `${formatDateLong(n.date)} at ${formatTime12h(n.time)}`;
    const payment = n.hasSlip
      ? "Payment slip uploaded (please verify)"
      : n.paymentMethod === "bank_transfer"
        ? "Bank transfer selected"
        : "Will pay at TRACE";
    await transporter.sendMail({
      from: process.env.SMTP_FROM?.trim() || user,
      to,
      subject: `New Jendo test booking ${n.ref}: ${n.fullName}, ${n.date} ${n.time}`,
      html: `
        <h2>New Jendo test booking (${esc(n.ref)})</h2>
        <p>Please call the patient back to confirm the appointment.</p>
        <table cellpadding="6">
          <tr><td><b>Name</b></td><td>${esc(n.fullName)}</td></tr>
          <tr><td><b>Phone</b></td><td>${esc(n.phone)}</td></tr>
          <tr><td><b>Email</b></td><td>${esc(n.email || "-")}</td></tr>
          <tr><td><b>Appointment</b></td><td>${esc(when)} at ${esc(BOOKING.venueName)}</td></tr>
          <tr><td><b>Payment</b></td><td>${esc(payment)} (LKR ${BOOKING.priceLkr.toLocaleString("en-US")})</td></tr>
          <tr><td><b>Notes</b></td><td>${esc(n.notes || "-")}</td></tr>
        </table>`,
    });
  } catch (err) {
    console.error("[booking-notify] email failed:", err instanceof Error ? err.message : err);
  }
}
