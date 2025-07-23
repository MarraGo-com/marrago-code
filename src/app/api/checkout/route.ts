// /src/app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { experienceTitle, price, customerEmail, experienceId, bookingId } = body;

    if (!experienceTitle || !price || !customerEmail || !experienceId || !bookingId) {
      return NextResponse.json({ error: 'Missing required booking information' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: price.currency.toLowerCase(),
            product_data: {
              name: experienceTitle,
            },
            unit_amount: Math.round(price.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      
      // These are the URLs Stripe will redirect to after the payment.
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      
      // --- THIS IS THE KEY FIX ---
      // We now point the cancel URL to our dedicated "cancelled" page.
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/booking-cancelled`,
      
      metadata: {
        bookingId: bookingId,
      },
    });

    return NextResponse.json({ sessionId: session.id }, { status: 200 });

  } catch (error: unknown) {
    console.error("Error creating Stripe session:", error);
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
  }
}
