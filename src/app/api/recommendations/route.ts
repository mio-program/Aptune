import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { userId, personalityType, isPremium } = await request.json()
    if (!userId || !personalityType) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }
    const supabase = createClient()

    // 学習コンテンツをタイプでフィルタ
    const { data: contents, error } = await supabase
      .from('learning_contents')
      .select('*')
      .contains('target_types', [personalityType])
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    // 無料ユーザーは3本、プレミアムは全件
    const recommended = isPremium ? contents : (contents || []).slice(0, 3)

    // 推薦理由（ダミー）
    const recommendation_reason = `あなたのタイプ「${personalityType}」に最適な学習コンテンツを選びました。`

    return NextResponse.json({
      user_id: userId,
      personality_type: personalityType,
      recommended_contents: recommended,
      recommendation_reason,
      priority_score: 1,
      created_at: new Date().toISOString(),
    })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
} 