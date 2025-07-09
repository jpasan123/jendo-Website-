import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Pre-order data received:', data);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Pre-order received successfully' 
    });
  } catch (error) {
    console.error('Error processing pre-order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process pre-order' },
      { status: 500 }
    );
  }
}