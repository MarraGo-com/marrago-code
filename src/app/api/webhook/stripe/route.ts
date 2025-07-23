// /src/app/api/webhook/stripe/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature')!;

  let event: Stripe.Event;

  // --- 1. Securely verify the request came from Stripe ---
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown)
  {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`❌ Error verifying webhook signature: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  // --- 2. Handle the specific event type ---
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      
      // --- 3. Get the bookingId from the metadata we passed earlier ---
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        try {
          // --- 4. Update the booking in our Firestore database ---
          const bookingRef = adminDb.collection('bookings').doc(bookingId);
          await bookingRef.update({
            status: 'confirmed',
            updatedAt: FieldValue.serverTimestamp(),
          });
          console.log(`✅ Webhook received: Booking ${bookingId} confirmed.`);
        } catch (dbError) {
          console.error(`Error updating booking ${bookingId} in Firestore:`, dbError);
          // Return a 500 so Stripe knows to retry the webhook later
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }
      } else {
        console.warn('Webhook received for session without a bookingId in metadata:', session.id);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // --- 5. Return a 200 response to Stripe to acknowledge receipt ---
  return NextResponse.json({ received: true }, { status: 200 });
}
