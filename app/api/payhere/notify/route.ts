import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateHash } from '@/lib/payhere';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const merchant_id = data.get('merchant_id');
    const order_id = data.get('order_id');
    const payhere_amount = data.get('payhere_amount');
    const payhere_currency = data.get('payhere_currency');
    const status_code = data.get('status_code');
    const md5sig = data.get('md5sig');

    // Verify hash
    const generatedHash = generateHash(
      order_id as string,
      Number(payhere_amount)
    );

    if (md5sig !== generatedHash) {
      throw new Error('Invalid hash');
    }

    // Update order status
    const orderStatus = status_code === '2' ? 'completed' : 'failed';
    
    const { error } = await supabase
      .from('orders')
      .update({ status: orderStatus })
      .eq('id', order_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment notification error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}