import { NextRequest, NextResponse } from "next/server";
import { getBooking, listEmails } from "@/lib/booking/store";
import { brevoDelivery, EMAIL_KINDS, maskEmail, sendBookingEmailWithin, type Delivery, type EmailKind } from "@/lib/booking/mailer";
import { isAdminRequest, rateLimit, sameOrigin } from "@/lib/booking/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const noStore = { "Cache-Control": "no-store" };

/** GET: email history for one booking */
export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401, headers: noStore });
  const { id } = await ctx.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ ok: false, message: "Invalid booking id." }, { status: 400 });
  try {
    const rows = await listEmails(id);
    // ask Brevo what really happened to the latest messages (accepted is not the same as delivered)
    const items = await Promise.all(
      rows.map(async (r, i): Promise<(typeof rows)[number] & { delivery?: Delivery }> =>
        r.status === "sent" && r.message_id && i < 6 && process.env.BREVO_API_KEY ? { ...r, delivery: await brevoDelivery(r.message_id) } : r
      )
    );
    return NextResponse.json({ ok: true, items }, { headers: noStore });
  } catch (err) {
    console.error("[admin/email] history failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, message: "Could not load the email history." }, { status: 500, headers: noStore });
  }
}

/** POST {kind}: (re)send an email to the patient */
export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401, headers: noStore });
  if (!sameOrigin(request)) return NextResponse.json({ ok: false, message: "Request blocked." }, { status: 403 });
  const { id } = await ctx.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ ok: false, message: "Invalid booking id." }, { status: 400 });

  const limit = rateLimit(`admin-email:${id}`, 10, 10 * 60_000);
  if (!limit.ok) return NextResponse.json({ ok: false, message: "Too many emails for this booking. Try again later." }, { status: 429 });

  let kind = "";
  try {
    kind = String((await request.json()).kind ?? "");
  } catch {
    /* handled below */
  }
  if (!(EMAIL_KINDS as string[]).includes(kind)) return NextResponse.json({ ok: false, message: "Unknown email type." }, { status: 400 });

  const booking = await getBooking(id);
  if (!booking) return NextResponse.json({ ok: false, message: "Booking not found." }, { status: 404, headers: noStore });
  const result = await sendBookingEmailWithin(kind as EmailKind, booking);
  return NextResponse.json(
    { ok: true, email: { kind, status: result.status, reason: "reason" in result ? result.reason : undefined, to: booking.email ? maskEmail(booking.email) : undefined } },
    { headers: noStore }
  );
}
