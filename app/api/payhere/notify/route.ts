import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateHash } from '@/lib/payhere';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const merchant_id = formData.get('merchant_id');
    const order_id = formData.get('order_id');
    const payhere_amount = formData.get('payhere_amount');
    const payhere_currency = formData.get('payhere_currency');
    const status_code = formData.get('status_code');
    const md5sig = formData.get('md5sig');

    // Verify hash
    const generatedHash = generateHash(
      order_id as string,
      Number(payhere_amount)
    );

    if (md5sig !== generatedHash) {
      return NextResponse.json(
        { success: false, error: 'Invalid hash' },
        { status: 400 }
      );
    }

    // Update order status
    const orderStatus = status_code === '2' ? 'completed' : 'failed';
    
    const { error } = await supabase
      .from('orders')
      .update({ status: orderStatus })
      .eq('id', order_id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment notification error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}