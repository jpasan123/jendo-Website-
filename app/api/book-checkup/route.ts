import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Check-up booking received:', data);
    
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