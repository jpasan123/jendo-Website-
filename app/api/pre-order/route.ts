// app/api/pre-order/route.ts
import { NextResponse } from 'next/server';
import { addToSheet } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic'; // Required for POST requests

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    const data = await request.json();
    console.log('Received data:', data);

    const success = await addToSheet('PreOrders', {
      timestamp: new Date().toISOString(),
      ...data
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save to Google Sheets. Check server logs.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Pre-order submitted!' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}