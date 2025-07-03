export interface Character {
  id: string; // "future_innovator", ...
  name: string;
  description: string;
  image_url: string;
  personality_traits: string[];
  catch_phrase: string;
  career_strengths: string[];
  growth_advice: string;
}

export const characters: Character[] = [
  {
    id: 'future_innovator',
    name: '未来イノベーター・アリス',
    description: '常に未来を見据え、新しい価値を創造する革新者。未知の領域にも果敢に挑戦します。',
    image_url: '/characters/future_innovator.png',
    personality_traits: ['創造性', '実行力', '未来志向'],
    catch_phrase: '常に一歩先を見据えて行動する',
    career_strengths: ['戦略立案', '新規事業', 'チーム牽引'],
    growth_advice: '現状維持に満足せず、常に新しい知識やスキルを吸収しましょう。',
  },
  {
    id: 'strategic_leader',
    name: '戦略リーダー・タクミ',
    description: '全体を俯瞰し、最適な道筋を描くリーダータイプ。論理的思考と決断力が強みです。',
    image_url: '/characters/strategic_leader.png',
    personality_traits: ['論理性', '決断力', '俯瞰力'],
    catch_phrase: '最善の一手を常に考える',
    career_strengths: ['組織運営', 'プロジェクト管理', '意思決定'],
    growth_advice: '柔軟な発想や他者の意見も積極的に取り入れましょう。',
  },
  {
    id: 'creative_artist',
    name: 'クリエイティブアーティスト・ミカ',
    description: '独自の感性と表現力で周囲を魅了するアーティスト。新しいアイデアを形にする力があります。',
    image_url: '/characters/creative_artist.png',
    personality_traits: ['感受性', '表現力', '独創性'],
    catch_phrase: '自分だけの世界を創り出す',
    career_strengths: ['デザイン', '企画', 'クリエイティブ制作'],
    growth_advice: '他分野の知識や経験を積極的に取り入れてみましょう。',
  },
  {
    id: 'analytical_expert',
    name: '分析エキスパート・リョウ',
    description: 'データや事実をもとに本質を見抜く分析家。冷静な判断と問題解決力が特徴です。',
    image_url: '/characters/analytical_expert.png',
    personality_traits: ['分析力', '冷静さ', '探究心'],
    catch_phrase: '事実に基づき最適解を導く',
    career_strengths: ['データ分析', 'リサーチ', '課題解決'],
    growth_advice: '直感や感情も時には大切にしてみましょう。',
  },
  {
    id: 'supportive_coordinator',
    name: 'サポートコーディネーター・ユイ',
    description: '周囲を支え、チームの調和を大切にする協調型。細やかな気配りとサポート力が魅力です。',
    image_url: '/characters/supportive_coordinator.png',
    personality_traits: ['協調性', '思いやり', 'サポート力'],
    catch_phrase: 'みんなの力を引き出す名脇役',
    career_strengths: ['チームビルディング', '調整力', 'サポート業務'],
    growth_advice: '自分の意見や希望も時にはしっかり伝えましょう。',
  },
]; 