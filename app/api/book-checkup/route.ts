import { NextResponse } from 'next/server';
import { addToSheet } from '@/lib/googleSheets';

export async function POST(req: Request) {
  try {
    const { full_name, email, phone, checkup_type, payment_method, message } = await req.json();
    
    // Save to Google Sheets
    const success = await addToSheet('Checkups', {
      timestamp: new Date().toISOString(),
      full_name,
      email,
      phone,
      checkup_type,
      payment_method,
      message: message || '', // Handle optional field
      type: 'lab_partner'
    });
    
    if (!success) {
      throw new Error('Failed to save to Google Sheets');
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Check-up booked successfully' 
    });
  } catch (error) {
    console.error('Error processing check-up booking:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to book check-up' },
      { status: 500 }
    );
  }
}