import { NextRequest, NextResponse } from "next/server";
import { buildCheckout, cardPaymentsEnabled } from "@/lib/booking/payhere";
import { getBooking, getBookingForPayment, releaseCardBooking, switchToPayAtVenue } from "@/lib/booking/store";
import { sendBookingEmail } from "@/lib/booking/mailer";
import { notifyTeam } from "@/lib/booking/notify";
import { clientIp, rateLimit, sameOrigin } from "@/lib/booking/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };
const json = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status, headers: noStore });

/**
 * POST { ref, t, action }  (t = the secret pay token returned when the booking was created)
 *   action "retry"        -> a fresh PayHere payload for a card booking that is still waiting for payment
 *   action "pay_at_venue" -> give up on paying by card and pay at TRACE instead
 *   action "release"      -> start over: free the held slot so a new booking can be made
 */
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return json({ ok: false, message: "Request blocked." }, 403);
  if (!rateLimit(`pay:${clientIp(request)}`, 20, 10 * 60_000).ok) return json({ ok: false, message: "Too many attempts. Please wait a few minutes." }, 429);

  let body: { ref?: string; t?: string; action?: string } = {};
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "Invalid request." }, 400);
  }
  const booking = await getBookingForPayment(String(body.ref ?? ""), String(body.t ?? ""));
  if (!booking) return json({ ok: false, message: "We could not find that booking." }, 404);

  if (booking.payment_status === "paid") return json({ ok: true, paid: true });
  if (booking.status === "cancelled") {
    return json({ ok: false, expired: true, message: "This booking was released because the payment was not completed in time. Please book again." }, 410);
  }
  if (booking.status !== "new") return json({ ok: false, message: "This booking can no longer be changed online." }, 409);

  if (body.action === "release") {
    const released = await releaseCardBooking(booking.id);
    return released ? json({ ok: true, released: true }) : json({ ok: false, message: "This booking cannot be released." }, 409);
  }

  if (body.action === "pay_at_venue") {
    if (!(await switchToPayAtVenue(booking.id))) return json({ ok: false, message: "This booking cannot be switched." }, 409);
    const row = await getBooking(booking.id);
    if (row) {
      void sendBookingEmail("received", row).catch(() => undefined);
      void notifyTeam({
        ref: row.ref,
        fullName: row.full_name,
        phone: row.phone,
        email: row.email ?? "",
        date: row.appointment_date,
        time: row.slot_time,
        paymentMethod: "pay_at_venue",
        hasSlip: false,
        notes: row.notes ?? "",
      }).catch(() => undefined);
    }
    return json({ ok: true, switched: true });
  }

  if (booking.payment_method !== "card") return json({ ok: false, message: "This booking is not set to pay by card." }, 409);
  if (!cardPaymentsEnabled()) return json({ ok: false, message: "Card payment is not available right now." }, 503);
  return json({ ok: true, payhere: buildCheckout(booking, String(body.t)) });
}
