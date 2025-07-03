import Stripe from 'stripe'

// サーバーサイド用Stripeクライアント
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

// 料金設定
export const PRICING = {
  BASIC_ASSESSMENT: 0, // 簡易診断料
  PREMIUM_ASSESSMENT: 3480, // 初回診断料
  MONTHLY_SUBSCRIPTION: 1280, // 月額プラン
}

// 商品・価格ID（Stripeダッシュボードで作成後、ここに設定）
export const STRIPE_PRODUCTS = {
  PREMIUM_ASSESSMENT: 'price_premium_assessment', // 初回診断
  MONTHLY_SUBSCRIPTION: 'price_monthly_subscription', // 月額サブスク
}

// 決済タイプ
export type PaymentType = 'premium_assessment' | 'monthly_subscription'

// 決済セッション作成
export async function createCheckoutSession(
  userId: string,
  paymentType: PaymentType,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: undefined, // ユーザーが既にログインしているため
      client_reference_id: userId,
      payment_method_types: ['card'],
      mode: paymentType === 'monthly_subscription' ? 'subscription' : 'payment',
      line_items: [
        {
          price: STRIPE_PRODUCTS[paymentType === 'premium_assessment' ? 'PREMIUM_ASSESSMENT' : 'MONTHLY_SUBSCRIPTION'],
          quantity: 1,
        },
      ],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        paymentType,
      },
    })

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

// サブスクリプション作成
export async function createSubscription(customerId: string, priceId: string) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    })

    return subscription
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw error
  }
}

// サブスクリプションキャンセル
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}

// サブスクリプション復活
export async function reactivateSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })

    return subscription
  } catch (error) {
    console.error('Error reactivating subscription:', error)
    throw error
  }
}

// 顧客作成
export async function createCustomer(email: string, name?: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    })

    return customer
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}

// 支払い履歴取得
export async function getPaymentHistory(customerId: string) {
  try {
    const payments = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 100,
    })

    return payments.data
  } catch (error) {
    console.error('Error getting payment history:', error)
    throw error
  }
}

// サブスクリプション情報取得
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error getting subscription:', error)
    throw error
  }
}