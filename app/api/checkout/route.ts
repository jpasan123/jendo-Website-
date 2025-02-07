import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { items, userId, shippingAddress } = await req.json();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.products.name,
            description: item.products.description,
            images: [item.products.image_url],
          },
          unit_amount: item.products.price * 100, // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        status: 'pending',
        total_amount: items.reduce((acc: number, item: any) => acc + (item.products.price * item.quantity), 0),
        payment_intent_id: session.payment_intent as string,
        shipping_address: shippingAddress,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: item.products.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Clear cart after successful order creation
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    return NextResponse.json({ success: true, sessionId: session.id });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Checkout failed' }, { status: 500 });
  }
}