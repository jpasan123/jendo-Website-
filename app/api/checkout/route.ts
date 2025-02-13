import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createPaymentForm } from '@/lib/payhere';

export async function POST(req: Request) {
  try {
    const { items, userId, shippingAddress } = await req.json();

    if (!items?.length || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const total = items.reduce((acc: number, item: any) => 
      acc + (item.products.price * item.quantity), 0
    );

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        status: 'pending',
        total_amount: total,
        shipping_address: shippingAddress,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw orderError;
    }

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

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      throw itemsError;
    }

    // Create PayHere payment form data
    const payment = createPaymentForm({
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payhere/notify`,
      order_id: order.id,
      items: items.map((item: any) => item.products.name).join(', '),
      currency: 'LKR',
      amount: total,
      first_name: shippingAddress.firstName,
      last_name: shippingAddress.lastName,
      email: shippingAddress.email,
      phone: shippingAddress.phone,
      address: shippingAddress.address,
      city: shippingAddress.city,
      country: 'Sri Lanka',
    });

    // Clear cart after successful order creation
    const { error: cartError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (cartError) {
      console.error('Cart clearing error:', cartError);
      // Don't throw here as the order is already created
    }

    return NextResponse.json({ 
      success: true, 
      payment 
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Checkout failed' 
      }, 
      { 
        status: 500 
      }
    );
  }
}