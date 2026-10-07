import { NextRequest, NextResponse } from "next/server";
import { amountMatches, cardPaymentsEnabled, isOurMerchant, readNotice, signatureValid } from "@/lib/booking/payhere";
import { addAdminNote, getBooking, getBookingByRef, markCardPaid, recordPaymentEvent } from "@/lib/booking/store";
import { sendBookingEmail } from "@/lib/booking/mailer";
import { notifyTeamPaid } from "@/lib/booking/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ok = () => new NextResponse("OK", { status: 200, headers: { "Cache-Control": "no-store" } });
const bad = (status: number, text: string) => new NextResponse(text, { status, headers: { "Cache-Control": "no-store" } });

/**
 * PayHere's server-to-server payment notification (notify_url).
 * Nothing here trusts the browser: the request is accepted only with a valid md5sig made with our
 * merchant secret, and the amount/currency must match the booking price exactly.
 */
export async function POST(request: NextRequest) {
  if (!cardPaymentsEnabled()) return bad(503, "Card payments are not enabled");

  let form: FormData;
  try {
    form = await request.formData(); // PayHere sends application/x-www-form-urlencoded
  } catch {
    return bad(400, "Bad request");
  }
  const n = readNotice(form);
  const base = { orderId: n.order_id, paymentId: n.payment_id, statusCode: n.status_code, amount: n.payhere_amount, currency: n.payhere_currency };

  if (!isOurMerchant(n.merchant_id) || !signatureValid(n)) {
    await recordPaymentEvent({ ...base, bookingId: null, signatureOk: false, outcome: "rejected: bad merchant or signature" });
    return bad(400, "Invalid signature");
  }

  const booking = await getBookingByRef(n.order_id);
  if (!booking) {
    await recordPaymentEvent({ ...base, bookingId: null, signatureOk: true, outcome: "ignored: unknown order" });
    return ok(); // signed by PayHere but not one of our bookings: nothing to retry
  }

  // status_code: 2 = success, 0 = pending, -1 = cancelled, -2 = failed, -3 = charged back
  if (n.status_code === "2") {
    if (!amountMatches(n)) {
      await recordPaymentEvent({ ...base, bookingId: booking.id, signatureOk: true, outcome: "rejected: amount or currency mismatch" });
      await addAdminNote(booking.id, `PayHere reported ${n.payhere_currency} ${n.payhere_amount} for this booking: amount does not match the test price. Check the PayHere dashboard.`);
      return bad(400, "Amount mismatch");
    }
    try {
      const result = await markCardPaid(booking.id, n.payment_id);
      await recordPaymentEvent({ ...base, bookingId: booking.id, signatureOk: true, outcome: result.transitioned ? (result.slotLost ? "paid: slot lost" : "paid") : "ignored: already paid" });
      if (result.transitioned) {
        const row = await getBooking(booking.id);
        if (row) {
          void sendBookingEmail("payment_received", row).catch(() => undefined);
          void notifyTeamPaid(row, result.slotLost).catch(() => undefined);
        }
      }
    } catch (err) {
      console.error("[payhere-notify] could not mark paid:", err instanceof Error ? err.message : err);
      return bad(500, "Could not record the payment"); // PayHere will retry
    }
    return ok();
  }

  const outcome =
    n.status_code === "0" ? "pending" : n.status_code === "-1" ? "cancelled by patient" : n.status_code === "-2" ? "failed" : n.status_code === "-3" ? "charged back" : `status ${n.status_code}`;
  await recordPaymentEvent({ ...base, bookingId: booking.id, signatureOk: true, outcome });
  if (n.status_code === "-3") await addAdminNote(booking.id, "PayHere reported a chargeback for this payment. Check the PayHere dashboard.");
  return ok();
}
