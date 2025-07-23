import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    console.log('Creating checkout session...')
    
    const { amount, userId } = await request.json()
    console.log('Request data:', { amount, userId })

    // 入力値検証
    if (!amount || amount !== 500) {
      console.error('Invalid amount:', amount)
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Stripe環境変数確認
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set')
      return NextResponse.json(
        { error: 'Stripe configuration error' },
        { status: 500 }
      )
    }

    // ユーザー認証チェック（オプション）
    let user = null
    if (userId) {
      try {
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()
        user = authUser
        console.log('User authenticated:', user?.id)
      } catch (authError) {
        console.warn('Auth check failed:', authError)
      }
    }

    // Stripe Checkout Session作成
    console.log('Creating Stripe session with amount:', amount)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: 'APTune AI診断 - プレミアム詳細分析',
              description: 'AI時代のキャリア診断の詳細分析結果をアンロック',
            },
            unit_amount: amount, // JPYは最小単位が円なので変換不要
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

    console.log('Stripe session created successfully:', session.id)
    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })

  } catch (error) {
    console.error('Checkout session creation error:', error)
    
    // より詳細なエラー情報を返す
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: errorMessage 
      },
      { status: 500 }
    )
  }
}