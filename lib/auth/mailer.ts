import { emailConfigured, maskEmail, sendMail } from "@/lib/booking/mailer";
import { claimSignInEmail } from "@/lib/auth/db";

/**
 * Account emails (welcome + "you signed in"). They go through the same Brevo pipeline as the
 * booking emails (lib/booking/mailer.sendMail) and use the same look. Every function here
 * swallows its own errors: an email problem must never block a sign-in or sign-up.
 */

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

const siteUrl = () => (process.env.BOOKING_PUBLIC_URL?.trim() || "https://jendo.health").replace(/\/$/, "");
const contactPhone = () => process.env.BOOKING_CONTACT_PHONE?.trim() || "+94 76 621 0120";

type Content = { subject: string; heading: string; intro: string; lines: string[] };

function layout(c: Content) {
  const html = `<!doctype html><html><body style="margin:0;background:#f6f4f9;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f4f9;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="padding:22px 28px 6px"><img src="${siteUrl()}/jendo-icon.png" alt="Jendo" width="120" style="display:block;margin:0 0 -20px -12px"></td></tr>
<tr><td style="background:#4a1260;background-image:linear-gradient(135deg,#2d0a3e,#893A9F);padding:26px 28px"><h1 style="margin:0;color:#ffffff;font-size:24px">${esc(c.heading)}</h1></td></tr>
<tr><td style="padding:26px 28px;color:#374151;font-size:15px;line-height:1.6">
<p style="margin:0 0 16px">${esc(c.intro)}</p>
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
    ...c.lines.map((l) => l.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&")),
    "",
    `Questions? Reply to this email or call ${contactPhone()}.`,
  ].join("\n");
  return { html, text };
}

async function deliver(kind: string, to: string, c: Content) {
  if (!emailConfigured()) {
    console.warn(`[auth-email] ${kind} to ${maskEmail(to)} skipped: email is not configured`);
    return;
  }
  try {
    const { html, text } = layout(c);
    const messageId = await sendMail(to, c.subject, html, text);
    console.info(`[auth-email] ${kind} sent to ${maskEmail(to)}${messageId ? ` (${messageId})` : ""}`);
  } catch (err) {
    console.error(`[auth-email] ${kind} to ${maskEmail(to)} failed:`, err instanceof Error ? err.message : String(err));
  }
}

const firstName = (name: string | null | undefined, email: string) => (name || email.split("@")[0]).trim().split(/\s+/)[0];

const bookLink = () =>
  `<a href="${siteUrl()}/book-test" style="display:inline-block;background:#893A9F;color:#ffffff;text-decoration:none;font-weight:bold;padding:11px 20px;border-radius:10px">Book your Jendo test</a>`;

/** Sent once, when an account is created (manual sign-up or first Google sign-in). */
export async function sendWelcomeEmail(email: string, name: string | null | undefined) {
  await deliver("welcome", email, {
    subject: "Welcome to Jendo Test",
    heading: "Welcome to Jendo",
    intro: `Hi ${firstName(name, email)}, your Jendo Test account is ready.`,
    lines: [
      "You can now book your non-invasive Jendo vascular health test at TRACE in a few steps: pick a date and time, tell us how to reach you, and our team will call to confirm.",
      bookLink(),
    ],
  });
}

/** Sent on every sign-in (except a repeat within a minute, see claimSignInEmail). */
export async function sendSignInEmail(email: string, name: string | null | undefined, method: "google" | "password") {
  try {
    if (!(await claimSignInEmail(email))) return;
  } catch (err) {
    console.error(`[auth-email] sign-in claim failed for ${maskEmail(email)}:`, err instanceof Error ? err.message : String(err));
    return;
  }
  const when = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Colombo",
  }).format(new Date());
  await deliver("signin", email, {
    subject: "You signed in to Jendo Test",
    heading: "You're signed in",
    intro: `Hi ${firstName(name, email)}, you just signed in to Jendo Test with ${method === "google" ? "your Google account" : "your email and password"} on ${when} (Sri Lanka time).`,
    lines: [
      "Ready to book? It only takes a minute.",
      bookLink(),
      `<span style="color:#6b7280;font-size:13px">If this wasn&rsquo;t you, reply to this email or call ${esc(contactPhone())} straight away so we can secure your account.</span>`,
    ],
  });
}
