import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase-server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  const supabase = createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }

  async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.client_reference_id
    const paymentType = session.metadata?.paymentType

    if (!userId || !paymentType) {
      console.error('Missing userId or paymentType in session metadata')
      return
    }

    // 支払い記録を作成
    await supabase.from('payments').insert({
      user_id: userId,
      stripe_payment_intent_id: session.payment_intent as string,
      stripe_session_id: session.id,
      amount: session.amount_total || 0,
      currency: session.currency || 'jpy',
      status: 'succeeded',
      payment_type: paymentType,
      metadata: session.metadata
    })

    if (paymentType === 'premium_assessment') {
      // プレミアム診断購入フラグを更新
      await supabase
        .from('users')
        .update({ premium_assessment_purchased: true })
        .eq('id', userId)
    } else if (paymentType === 'monthly_subscription') {
      // サブスクリプション情報を更新
      const subscription = session.subscription as string
      if (subscription) {
        const subscriptionData = await stripe.subscriptions.retrieve(subscription)
        
        await supabase.from('subscriptions').insert({
          user_id: userId,
          stripe_subscription_id: subscription,
          status: subscriptionData.status,
          current_period_start: new Date(subscriptionData.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscriptionData.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscriptionData.cancel_at_period_end,
          metadata: subscriptionData.metadata
        })

        await supabase
          .from('users')
          .update({
            subscription_status: subscriptionData.status,
            subscription_id: subscription,
            subscription_end_date: new Date(subscriptionData.current_period_end * 1000).toISOString()
          })
          .eq('id', userId)
      }
    }
  }

  async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
      
      // サブスクリプション情報を更新
      await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end
        })
        .eq('stripe_subscription_id', subscription.id)

      // ユーザー情報を更新
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .single()

      if (subscriptionData) {
        await supabase
          .from('users')
          .update({
            subscription_status: subscription.status,
            subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString()
          })
          .eq('id', subscriptionData.user_id)
      }
    }
  }

  async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
      
      // サブスクリプションステータスを更新
      await supabase
        .from('subscriptions')
        .update({ status: subscription.status })
        .eq('stripe_subscription_id', subscription.id)

      // ユーザー情報を更新
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .single()

      if (subscriptionData) {
        await supabase
          .from('users')
          .update({ subscription_status: subscription.status })
          .eq('id', subscriptionData.user_id)
      }
    }
  }

  async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    // サブスクリプション情報を更新
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end
      })
      .eq('stripe_subscription_id', subscription.id)

    // ユーザー情報を更新
    const { data: subscriptionData } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single()

    if (subscriptionData) {
      await supabase
        .from('users')
        .update({
          subscription_status: subscription.status,
          subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString()
        })
        .eq('id', subscriptionData.user_id)
    }
  }

  async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    // サブスクリプションステータスを更新
    await supabase
      .from('subscriptions')
      .update({ status: subscription.status })
      .eq('stripe_subscription_id', subscription.id)

    // ユーザー情報を更新
    const { data: subscriptionData } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single()

    if (subscriptionData) {
      await supabase
        .from('users')
        .update({
          subscription_status: subscription.status,
          subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString()
        })
        .eq('id', subscriptionData.user_id)
    }
  }
} 