// app/api/pre-order/route.ts

import { NextResponse } from 'next/server';
import { addToSheet } from '@/lib/googleSheets';
import { createPaymentForm } from '@/lib/payhere';

export const dynamic = 'force-dynamic'; // Required for POST requests

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    const data = await req.json();
    console.log('Received data:', data);

    const success = await addToSheet('PreOrders', {
      timestamp: new Date().toISOString(),
      ...data
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save to Google Sheets. Check server logs.' },
        { status: 500 }
      );
    }

    // Prepare PayHere payment object (backend-generated)
    const payherePayment = createPaymentForm({
      return_url: process.env.NEXT_PUBLIC_BASE_URL + '/checkout/success',
      cancel_url: process.env.NEXT_PUBLIC_BASE_URL + '/checkout/cancel',
      notify_url: process.env.NEXT_PUBLIC_BASE_URL + '/api/payhere-notify',
      order_id: 'ORDER_' + Date.now(),
      items: `Jendo PreOrder: ${data.package_type || ''}`,
      currency: data.currency || 'LKR',
      amount: data.amount || 225, // fallback amount, update as needed
      first_name: data.full_name || '',
      last_name: '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.delivery_address || '',
      city: '',
      country: 'Sri Lanka',
    });

    return NextResponse.json(
      { success: true, message: 'Pre-order submitted!', payherePayment },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
