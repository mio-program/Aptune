'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ParticleEffect from '../../components/ParticleEffect'

interface PricingPlan {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  limitations?: string[]
  popular?: boolean
  buttonText: string
  buttonStyle: string
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '永久無料',
    description: 'InnerLogタイプ診断と基本学習機能',
    features: [
      'AI診断（6タイプ分析）',
      '1日3コンテンツまで',
      '基本レコメンデーション',
      '学習進捗記録',
      'コミュニティアクセス'
    ],
    limitations: [
      '1日3コンテンツ制限',
      '基本的なAI推薦のみ',
      'カスタム学習プランなし'
    ],
    buttonText: '現在のプラン',
    buttonStyle: 'cyber-card border-gray-600 text-gray-400 cursor-not-allowed'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 980,
    period: '月額',
    description: 'AI時代のプロフェッショナル向け',
    features: [
      '無制限コンテンツアクセス',
      '高度なAI推薦アルゴリズム',
      'カスタム学習プラン生成',
      '詳細分析レポート',
      'オフラインコンテンツ',
      '優先サポート',
      '最新AI技術の早期アクセス',
      'エキスパート監修コンテンツ',
      '個別メンタリングチャット',
      '業界特化コンテンツ'
    ],
    popular: true,
    buttonText: '今すぐアップグレード',
    buttonStyle: 'cyber-button-gold cyber-glow cyber-pulse'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 2980,
    period: '月額',
    description: '企業・チーム向けソリューション',
    features: [
      'Premium機能すべて',
      'チーム管理ダッシュボード',
      '企業向けコンテンツライブラリ',
      'カスタムブランディング',
      'API連携サポート',
      '専任カスタマーサクセス',
      'オンサイト研修サポート',
      'セキュリティ強化',
      '使用状況分析',
      '無制限ユーザー'
    ],
    buttonText: '営業チームに相談',
    buttonStyle: 'cyber-button'
  }
]

const FAQ_ITEMS = [
  {
    question: '無料プランでも十分使えますか？',
    answer: '無料プランでは1日3コンテンツまでアクセス可能で、AI診断や基本的な学習機能をご利用いただけます。継続的に学習したい方はPremiumプランがおすすめです。'
  },
  {
    question: 'いつでもプランを変更できますか？',
    answer: 'はい、いつでもプランのアップグレードやダウングレードが可能です。変更は即座に反映され、日割り計算で課金調整されます。'
  },
  {
    question: 'Premiumプランの支払い方法は？',
    answer: 'クレジットカード（Visa、MasterCard、JCB）での月額自動課金となります。安全なStripe決済システムを使用しています。'
  },
  {
    question: 'コンテンツの品質はどうやって保証されていますか？',
    answer: '専門家による監修、AI品質スコア分析、ユーザー評価システムにより、高品質なコンテンツのみを厳選してキュレーションしています。'
  },
  {
    question: 'Enterpriseプランの詳細を知りたい',
    answer: 'Enterpriseプランは企業様のニーズに合わせてカスタマイズ可能です。営業チームが詳細をご説明いたします。'
  }
]

export default function PricingPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string>('premium')
  const [isAnnual, setIsAnnual] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const handlePlanSelect = (planId: string) => {
    if (planId === 'free') return
    
    if (planId === 'enterprise') {
      // Enterprise向け問い合わせフォームにリダイレクト
      window.open('mailto:sales@innerlog.ai?subject=Enterprise Plan Inquiry', '_blank')
      return
    }

    // Premium プランの決済処理
    handlePremiumUpgrade()
  }

  const handlePremiumUpgrade = () => {
    // Stripe決済の実装
    console.log('Redirecting to Stripe checkout...')
    // 実際の実装では PaymentModal コンポーネントを使用
    router.push('/learning/dashboard?upgraded=true')
  }

  const getDiscountedPrice = (price: number): number => {
    return isAnnual ? Math.floor(price * 12 * 0.8) : price
  }

  return (
    <div className="min-h-screen bg-black">
      <ParticleEffect />
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* ヘッダー */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black cyber-title mb-6 typing-effect" style={{ fontFamily: 'Orbitron, monospace' }}>
            💎 PREMIUM PLANS
          </h1>
          <p className="text-xl cyber-text-gold mb-8">
            AI時代の学習を加速させる最強プラン
          </p>
          
          {/* 年間/月間切り替え */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg ${!isAnnual ? 'cyber-text-glow' : 'text-gray-400'}`}>月間プラン</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                isAnnual ? 'cyber-gradient' : 'bg-gray-700'
              }`}
            >
              <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-all duration-300 ${
                isAnnual ? 'left-9' : 'left-1'
              }`}></div>
            </button>
            <span className={`text-lg ${isAnnual ? 'cyber-text-glow' : 'text-gray-400'}`}>
              年間プラン 
              <span className="text-green-400 text-sm ml-2">20% OFF</span>
            </span>
          </div>
        </div>

        {/* プライシングカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.popular 
                  ? 'cyber-gradient cyber-glow transform scale-105' 
                  : 'cyber-card hover:border-orange-500'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="cyber-button-gold px-6 py-2 rounded-full text-sm font-bold">
                    🔥 MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold cyber-text-glow mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-black text-green-400">無料</span>
                  ) : (
                    <div>
                      <span className="text-4xl font-black cyber-text-gold">
                        ¥{isAnnual ? getDiscountedPrice(plan.price).toLocaleString() : plan.price.toLocaleString()}
                      </span>
                      <span className="text-gray-400 ml-2">
                        /{isAnnual ? '年' : '月'}
                      </span>
                      {isAnnual && plan.price > 0 && (
                        <div className="text-sm text-green-400 mt-1">
                          月額¥{Math.floor(getDiscountedPrice(plan.price) / 12).toLocaleString()}相当
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-gray-300">{plan.description}</p>
              </div>

              {/* 機能リスト */}
              <div className="mb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="text-green-400 mt-1">✓</div>
                      <span className="text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="text-gray-500 mt-1">−</div>
                          <span className="text-gray-500 text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* プランボタン */}
              <button
                onClick={() => handlePlanSelect(plan.id)}
                disabled={plan.id === 'free'}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${plan.buttonStyle}`}
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* 特徴セクション */}
        <div className="cyber-card rounded-2xl p-12 mb-20">
          <h2 className="text-3xl font-bold cyber-text-glow text-center mb-12" style={{ fontFamily: 'Orbitron, monospace' }}>
            🚀 なぜInnerLog Premiumなのか？
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI駆動キュレーション',
                description: '最新のAI技術であなたに最適化された学習コンテンツを自動選別'
              },
              {
                icon: '📊',
                title: 'データ分析レポート',
                description: 'あなたの学習パターンを分析し、成長を可視化するレポート'
              },
              {
                icon: '⚡',
                title: '効率的学習設計',
                description: 'タイプ別に最適化された学習ルートで最短時間で成果を実現'
              },
              {
                icon: '🎯',
                title: '業界特化コンテンツ',
                description: 'あなたの業界・職種に特化した実践的なコンテンツライブラリ'
              },
              {
                icon: '🔄',
                title: 'リアルタイム更新',
                description: '最新のAI・テクノロジートレンドを反映したコンテンツを随時更新'
              },
              {
                icon: '👨‍🏫',
                title: 'エキスパート監修',
                description: '業界のトップエキスパートが監修した高品質なコンテンツ'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold cyber-text-glow mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ セクション */}
        <div className="cyber-card rounded-2xl p-12">
          <h2 className="text-3xl font-bold cyber-text-glow text-center mb-12" style={{ fontFamily: 'Orbitron, monospace' }}>
            ❓ よくある質問
          </h2>
          
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => (
              <div key={index} className="border-b border-gray-700 last:border-b-0">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full py-6 text-left flex items-center justify-between hover:cyber-text-glow transition-colors"
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  <span className={`text-2xl transition-transform duration-300 ${
                    openFAQ === index ? 'rotate-180' : ''
                  }`}>⌄</span>
                </button>
                
                {openFAQ === index && (
                  <div className="pb-6 text-gray-300 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA セクション */}
        <div className="text-center mt-20">
          <div className="cyber-gradient rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Orbitron, monospace' }}>
              🎯 今すぐAI時代の学習を始めよう
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              あなたのキャリアを次のレベルへ引き上げる時です
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handlePlanSelect('premium')}
                className="cyber-button-gold cyber-glow px-10 py-4 rounded-xl font-bold text-xl"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                💎 Premium で始める
              </button>
              <button
                onClick={() => router.push('/learning/setup')}
                className="cyber-card px-10 py-4 rounded-xl font-medium text-gray-200 hover:cyber-text-glow"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                🆓 無料で体験
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}