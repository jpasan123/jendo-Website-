import { NextResponse } from 'next/server';
import { addToSheet } from '@/lib/googleSheets';

export async function POST(req: Request) {
  try {
    const { type, formData } = await req.json();
    const { company_name, contact_person, email, phone } = formData;
    
    // Save to Google Sheets
    const success = await addToSheet('InsurancePartners', {
      timestamp: new Date().toISOString(),
      company_name,
      contact_person,
      email,
      phone,
      partner_type: type
    });
    
    if (!success) {
      throw new Error('Failed to save to Google Sheets');
    }
    
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