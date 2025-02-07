import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { type, formData } = await req.json();
    let table = type === 'lab' ? 'lab_partners' : 'insurance_partners';

    const { data, error } = await supabase
      .from(table)
      .insert([formData])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit partner application' }, { status: 500 });
  }
}