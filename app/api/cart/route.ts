'use client';

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { productId, quantity, userId } = await req.json();

    const { data, error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: userId,
        product_id: productId,
        quantity: quantity,
      })
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch cart' }, { status: 500 });
  }
}