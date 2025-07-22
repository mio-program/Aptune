import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '../../../../lib/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-08-16' });

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const paymentId = session.payment_intent as string;
    const unlockedAt = new Date().toISOString();
    if (userId && paymentId) {
      const supabase = createClient();
      await supabase.from('premium_unlocks').insert({
        user_id: userId,
        stripe_payment_id: paymentId,
        unlocked_at: unlockedAt,
      });
    }
  }
  return NextResponse.json({ received: true });
} 