
import { NextResponse } from 'next/server';
import { addToSheet } from '@/lib/googleSheets';
import { createPaymentForm } from '@/lib/payhere';

export async function POST(req: Request) {
  try {
    const { full_name, email, phone, checkup_type, payment_method, message, amount, currency } = await req.json();

    // Save to Google Sheets
    const success = await addToSheet('Checkups', {
      timestamp: new Date().toISOString(),
      full_name,
      email,
      phone,
      checkup_type,
      payment_method,
      message: message || '',
      type: 'lab_partner',
    });

    if (!success) {
      throw new Error('Failed to save to Google Sheets');
    }

    // Prepare PayHere payment object (backend-generated)
    // You may want to set amount/currency logic based on checkup_type or frontend input
    const payherePayment = createPaymentForm({
      return_url: process.env.NEXT_PUBLIC_BASE_URL + '/checkout/success',
      cancel_url: process.env.NEXT_PUBLIC_BASE_URL + '/checkout/cancel',
      notify_url: process.env.NEXT_PUBLIC_BASE_URL + '/api/payhere-notify',
      order_id: 'ORDER_' + Date.now(),
      items: `Jendo Checkup: ${checkup_type}`,
      currency: currency || 'LKR',
      amount: amount || 5000, // fallback amount, update as needed
      first_name: full_name,
      last_name: '',
      email,
      phone,
      address: '',
      city: '',
      country: 'Sri Lanka',
    });

    return NextResponse.json({
      success: true,
      message: 'Check-up booked successfully',
      payherePayment,
    });
  } catch (error) {
    console.error('Error processing check-up booking:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to book check-up' },
      { status: 500 }
    );
  }
}