import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { amount, userId } = await request.json()

    // 入力値検証
    if (!amount || amount !== 500) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // ユーザー認証チェック（オプション）
    let user = null
    if (userId) {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      user = authUser
    }

    // Stripe Checkout Session作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: 'InnerLog AI診断 - プレミアム詳細分析',
              description: 'AI時代のキャリア診断の詳細分析結果をアンロック',
            },
            unit_amount: amount * 100, // 円をセント単位に変換
          },
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/diagnosis/premium-unlocked?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/assessment/results`,
      metadata: {
        userId: user?.id || 'anonymous',
        amount: amount.toString(),
        type: 'premium_diagnosis',
      },
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })

  } catch (error) {
    console.error('Checkout session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}