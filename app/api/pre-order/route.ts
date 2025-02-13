import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const formData = await req.json();

    const { data, error } = await supabase
      .from('pre_orders')
      .insert([{
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        package_type: formData.packageType,
        delivery_address: formData.deliveryAddress,
        payment_method: formData.paymentMethod,
        status: 'pending'
      }])
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      data 
    });
  } catch (error) {
    console.error('Pre-order submission error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit pre-order' 
      }, 
      { 
        status: 500 
      }
    );
  }
}