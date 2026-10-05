import { NextRequest, NextResponse } from "next/server";
import { emailConfigured, sendTestEmail } from "@/lib/booking/mailer";
import { isAdminRequest, rateLimit, sameOrigin } from "@/lib/booking/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** POST {to}: sends a test message so staff can check the SMTP settings */
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  if (!sameOrigin(request)) return NextResponse.json({ ok: false, message: "Request blocked." }, { status: 403 });
  if (!rateLimit("admin-email-test", 6, 10 * 60_000).ok) return NextResponse.json({ ok: false, message: "Too many tests. Try again in a few minutes." }, { status: 429 });
  if (!emailConfigured()) return NextResponse.json({ ok: false, message: "Email is not configured on the server (SMTP_HOST, SMTP_USER, SMTP_PASSWORD)." }, { status: 400 });

  let to = "";
  try {
    to = String((await request.json()).to ?? "").trim();
  } catch {
    /* handled below */
  }
  if (!EMAIL_RE.test(to)) return NextResponse.json({ ok: false, message: "Enter a valid email address." }, { status: 400 });

  const result = await sendTestEmail(to);
  if (result.status === "sent") return NextResponse.json({ ok: true });
  return NextResponse.json({ ok: false, message: `The mail server rejected it: ${result.error ?? "unknown error"}` }, { status: 502 });
}
