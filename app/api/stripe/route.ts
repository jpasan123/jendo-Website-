import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

export async function POST(request: Request) {
  const { items, email, shippingAddress } = await request.json();

  const lineItems = items.map((item: any) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.products.name,
        images: [item.products.image_url],
      },
      unit_amount: item.products.price * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
    customer_email: email,
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'LK'], // Add your supported countries
    },
    metadata: {
      email,
      shippingAddress: JSON.stringify(shippingAddress),
    },
  });

  return NextResponse.json({ id: session.id });
}