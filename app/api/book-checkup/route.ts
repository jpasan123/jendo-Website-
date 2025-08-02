import { NextResponse } from 'next/server';
import { addToSheet } from '@/lib/googleSheets';
import { createPaymentForm } from '@/lib/payhere';

export async function POST(req: Request) {
  try {
    const { full_name, email, phone, checkup_type, payment_method, message, amount, currency } = await req.json();

    // Save to Google Sheets (unchanged)
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

    // Updated PayHere payment object creation
    const payherePayment = createPaymentForm({
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payhere/webhook`,
      order_id: `CHECKUP_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      items: `Jendo Checkup: ${checkup_type}`,
      currency: currency || 'LKR',
      amount: amount || 5000,
      first_name: full_name.split(' ')[0] || 'Customer',
      last_name: full_name.split(' ').slice(1).join(' ') || ' ',
      email,
      phone,
      address: 'Not Provided',
      city: 'Colombo',
      country: 'Sri Lanka'
    });

    return NextResponse.json({
      success: true,
      message: 'Check-up booked successfully',
      payherePayment, // This will now include the properly generated hash
    });
  } catch (error) {
    console.error('Error processing check-up booking:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to book check-up' 
      },
      { status: 500 }
    );
  }
}