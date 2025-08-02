import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const data = await req.json();
  
  // Verify the payment
  const md5sig = data.md5sig;
  const merchantSecret = process.env.PAYHERE_SECRET!;
  
  const localMd5sig = crypto.createHash('md5')
    .update(data.merchant_id + data.order_id + data.payhere_amount + 
           data.payhere_currency + crypto.createHash('md5')
           .update(merchantSecret).digest('hex').toUpperCase())
    .digest('hex')
    .toUpperCase();

  if (localMd5sig !== md5sig) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Payment is verified - update your database here

  return NextResponse.json({ success: true });
}