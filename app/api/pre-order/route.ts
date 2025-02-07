import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const formData = await req.json();

    const { data, error } = await supabase
      .from('pre_orders')
      .insert([formData])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit pre-order' }, { status: 500 });
  }
}