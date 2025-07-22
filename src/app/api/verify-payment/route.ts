import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Stripe Checkout Sessionの詳細を取得
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    // 決済が成功している場合、データベースに記録
    const supabase = createClient()
    
    // premium_unlocksテーブルに記録（ユーザーIDがある場合）
    if (session.metadata?.userId && session.metadata.userId !== 'anonymous') {
      const { error: insertError } = await supabase
        .from('premium_unlocks')
        .insert({
          user_id: session.metadata.userId,
          session_id: sessionId,
          amount: parseInt(session.metadata?.amount || '500'),
          payment_status: 'completed',
          created_at: new Date().toISOString(),
        })

      if (insertError) {
        console.error('Database insert error:', insertError)
        // エラーがあってもクライアントには成功を返す（決済は完了しているため）
      }
    }

    return NextResponse.json({ 
      success: true,
      sessionId,
      paymentStatus: session.payment_status 
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}