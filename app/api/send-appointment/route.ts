// app/api/send-appointment/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Here you would normally:
    // 1. Save to a database
    // 2. Send an email notification
    // 3. Or any other processing
    
    console.log('Appointment request received:', data);
    
    return NextResponse.json(
      { success: true, message: 'Appointment request received successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing appointment request:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process appointment request' },
      { status: 500 }
    );
  }
}