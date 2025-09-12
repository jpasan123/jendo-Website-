import { NextResponse } from 'next/server';
import { addToSheet } from '@/lib/googleSheets';
import { createPaymentForm } from '@/lib/payhere';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { serviceAccountAuth } from '@/lib/googleSheets';

export async function POST(req: Request) {
  try {
    const { full_name, email, phone, checkup_type, payment_method, message, amount, currency, start_time, end_time } = await req.json();

    // 1. Fetch existing bookings from Google Sheets
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || '', serviceAccountAuth);
    await doc.loadInfo();
    let sheet = doc.sheetsByTitle['Checkups'];
    if (!sheet) {
      sheet = await doc.addSheet({ title: 'Checkups', headerValues: ['timestamp','full_name','email','phone','checkup_type','payment_method','message','type','start_time','end_time'] });
    } else {
      await sheet.loadHeaderRow();
    }
    const rows = await sheet.getRows();
    const requestedStart = new Date(start_time);
    const requestedEnd = new Date(end_time);
    // 2. Check for overlap
    const overlap = rows.some(row => {
      const rowStart = new Date(row.get('start_time'));
      const rowEnd = new Date(row.get('end_time'));
      return (requestedStart < rowEnd && requestedEnd > rowStart);
    });
    if (overlap) {
      return NextResponse.json({ success: false, message: 'Use a time already booked' }, { status: 409 });
    }
    // 3. Save to Google Sheets
    const success = await addToSheet('Checkups', {
      timestamp: new Date().toISOString(),
      full_name,
      email,
      phone,
      checkup_type,
      payment_method,
      message: message || '',
      type: 'lab_partner',
      start_time,
      end_time,
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
      country: 'Sri Lanka',
      hash: '', // Hash will be generated in createPaymentForm
      merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || '',
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