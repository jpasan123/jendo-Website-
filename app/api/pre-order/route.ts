import { NextResponse } from 'next/server';
import { addToSheet } from '@/lib/googleSheets';
import { createPaymentForm } from '@/lib/payhere';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type. Must be application/json.' },
        { status: 400 }
      );
    }

    let data;
    try {
      data = await req.json();
    } catch (jsonError) {
      return NextResponse.json(
        { error: 'Invalid or empty JSON body.' },
        { status: 400 }
      );
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Request body must be a valid JSON object.' },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['full_name', 'email', 'phone', 'package_type', 'delivery_address'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Save to Google Sheets
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

    // Determine currency and amount
    let currency = data.currency || 'LKR';
    let amount = data.amount;
    if (!amount) {
      if (data.package_type === 'starter') amount = 225;
      else if (data.package_type === 'professional') amount = 2250;
      else amount = 0;
    }

    if (!['LKR', 'USD'].includes(currency)) currency = 'LKR';

    // Updated PayHere payment object creation
    const payherePayment = createPaymentForm({
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payhere/webhook`,
      order_id: `PREORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      items: `Jendo PreOrder: ${data.package_type || ''}`,
      currency,
      amount,
      first_name: data.full_name.split(' ')[0] || 'Customer',
      last_name: data.full_name.split(' ').slice(1).join(' ') || ' ',
      email: data.email,
      phone: data.phone,
      address: data.delivery_address,
      city: 'Colombo',
      country: 'Sri Lanka'
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Pre-order submitted!', 
        payherePayment
      },
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