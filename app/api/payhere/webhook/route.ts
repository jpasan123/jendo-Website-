import { NextResponse } from 'next/server';
import { isOurMerchant, readNotice, signatureValid } from '@/lib/booking/payhere';
import { recordPaymentEvent } from '@/lib/booking/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * PayHere payment notification for shop orders (pre-order / checkout).
 * PayHere posts application/x-www-form-urlencoded and signs it with
 * md5sig = MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + MD5(secret)).
 * Test-booking payments use /api/bookings/payhere-notify instead.
 *
 * This endpoint verifies the signature and keeps an audit record of the notification;
 * shop orders are not stored in a database yet, so nothing else is updated here.
 */
export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return new NextResponse('Bad request', { status: 400 });
  }

  const n = readNotice(form);
  const signed = isOurMerchant(n.merchant_id) && signatureValid(n);

  await recordPaymentEvent({
    bookingId: null,
    orderId: n.order_id,
    paymentId: n.payment_id,
    statusCode: n.status_code,
    amount: n.payhere_amount,
    currency: n.payhere_currency,
    signatureOk: signed,
    outcome: signed ? 'shop order notification' : 'rejected: bad merchant or signature',
  });

  if (!signed) return new NextResponse('Invalid signature', { status: 400 });
  return new NextResponse('OK', { status: 200 });
}
