import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getUser } from '../../../lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-08-16' })

export async function POST(req: NextRequest) {
  // 認証ユーザー取得
  const user = await getUser(req)
  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }
  const { amount } = await req.json()
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'apple_pay', 'google_pay'],
      mode: 'payment',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'InnerLog有料診断コンテンツ',
            },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/diagnosis/premium-unlocked`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/diagnosis/result`,
      metadata: {
        user_id: user.id,
      },
    })
    return NextResponse.json({ url: session.url })
  } catch (e) {
    return NextResponse.json({ error: 'Stripeセッション作成失敗' }, { status: 500 })
  }
} 