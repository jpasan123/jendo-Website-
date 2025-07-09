import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Partner application received:', data);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Partner application received successfully' 
    });
  } catch (error) {
    console.error('Error processing partner application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process partner application' },
      { status: 500 }
    );
  }
}