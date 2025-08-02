import { NextResponse } from 'next/server';
import { createPaymentForm } from '@/lib/payhere';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Checkout request data:', data);

    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'address', 'amount'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create PayHere payment object
    const payherePayment = createPaymentForm({
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
      notify_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payhere/webhook`,
      order_id: data.order_id || `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      items: data.items || 'Jendo Products',
      currency: data.currency || 'USD',
      amount: parseFloat(data.amount),
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city || 'Colombo',
      country: data.country || 'Sri Lanka',
    });

    return NextResponse.json({ 
      success: true, 
      payherePayment,
      message: 'Payment form created successfully'
    });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        success: false 
      }, 
      { status: 500 }
    );
  }
}
