import { NextResponse } from 'next/server';
import { createPaymentForm } from '@/lib/payhere';
import md5 from 'crypto-js/md5';
import { addToSheet } from '@/lib/googleSheets';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Checkout request joooo data:', data);
    let merchantSecret = process.env.PAYHERE_SECRET!;
    let merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID!;
    let orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    let amount = String(data.amount);
    let hashedSecret = md5(merchantSecret).toString().toUpperCase();
    let amountFormated = parseFloat(amount).toLocaleString('en-us', { minimumFractionDigits: 2 }).replaceAll(',', '');
    console.log('Formatted amount:', amountFormated);
    let currency = 'USD';
    let hash = md5(merchantId + orderId + amountFormated + currency + hashedSecret).toString().toUpperCase();
    // Validate required fields
    // const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'address', 'amount'];
    // for (const field of requiredFields) {
    //   if (!data[field]) {
    //     return NextResponse.json(
    //       { error: `Missing required field: ${field}` },
    //       { status: 400 }
    //     );
    //   }
    // }
    console.log('Checkout request data:', merchantId);
    // Create PayHere payment object
    const payherePayment = createPaymentForm({
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
      notify_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payhere/webhook`,
      order_id: orderId,
      items: data.items,
      currency: currency,
      amount: amount,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city || 'Colombo',
      country: data.country || 'Sri Lanka',
      hash: hash,
      merchant_id: merchantId
    });
    console.log('PayHere payment object:', payherePayment);

    // Save checkout data to Google Sheets
    try {
      await addToSheet('Orders', {
        timestamp: new Date().toISOString(),
        order_id: orderId,
        customer_name: `${data.first_name} ${data.last_name}`,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city || 'Colombo',
        country: data.country || 'Sri Lanka',
        items: data.items,
        amount: data.amount,
        currency: data.currency || 'USD',
        status: 'pending', // Initial status before payment confirmation
        payment_method: 'PayHere'
      });
    } catch (sheetError) {
      console.error('Failed to save order to Google Sheets:', sheetError);
      // Continue with payment flow even if sheet saving fails
    }

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