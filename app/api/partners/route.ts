import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { type, formData } = await req.json();
    
    if (!type || !formData) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate partner type
    if (type !== 'lab' && type !== 'insurance') {
      return NextResponse.json(
        { success: false, error: 'Invalid partner type' },
        { status: 400 }
      );
    }

    const table = type === 'lab' ? 'lab_partners' : 'insurance_partners';

    // Format data based on partner type
    const insertData = type === 'lab' 
      ? {
          full_name: formData.fullName,
          lab_name: formData.labName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          message: formData.message,
          status: 'pending'
        }
      : {
          company_name: formData.companyName,
          contact_person: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          status: 'pending'
        };

    const { data, error } = await supabase
      .from(table)
      .insert([insertData])
      .select();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      data 
    });
  } catch (error) {
    console.error('Partner application error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit partner application' 
      }, 
      { 
        status: 500 
      }
    );
  }
}