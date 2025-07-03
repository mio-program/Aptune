'use client'

import { useState } from 'react'
import { PricingCard } from '@/components/ui/PricingCard'
import { PricingPlan } from '@/lib/stripe'

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
  
  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan)
    // ここでStripe Checkoutへの処理を実装
    console.log('Selected plan:', plan)
  }
  
  return (
    <div className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            料金プラン
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            あなたに最適なプランを選択
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            基本的な診断から本格的なキャリア戦略まで、
            ニーズに合わせたプランをご用意しています。
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-3">
          <PricingCard
            plan="basic"
            onSelectPlan={handleSelectPlan}
          />
          <PricingCard
            plan="premium"
            isPopular={true}
            onSelectPlan={handleSelectPlan}
          />
          <PricingCard
            plan="enterprise"
            onSelectPlan={handleSelectPlan}
          />
        </div>
        
        <div className="mt-16 sm:mt-20">
          <div className="rounded-2xl bg-gray-50 p-8 sm:p-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              よくある質問
            </h3>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  無料プランでも十分な分析が受けられますか？
                </h4>
                <p className="text-sm text-gray-600">
                  基本的なキャリア診断と市場価値の概算は無料プランでもご利用いただけます。
                  より詳細な分析をご希望の場合は、プレミアムプランをお勧めします。
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  プランはいつでも変更できますか？
                </h4>
                <p className="text-sm text-gray-600">
                  はい、いつでもプランの変更やキャンセルが可能です。
                  アップグレードは即座に、ダウングレードは次の請求サイクルから適用されます。
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  支払い方法は何が利用できますか？
                </h4>
                <p className="text-sm text-gray-600">
                  クレジットカード（Visa、MasterCard、American Express）、
                  デビットカード、PayPalがご利用いただけます。
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  エンタープライズプランの詳細を知りたい
                </h4>
                <p className="text-sm text-gray-600">
                  エンタープライズプランでは専任コンサルタントによる個別サポートを提供します。
                  詳細については、お気軽にお問い合わせください。
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            まだ迷っていますか？
          </h3>
          <p className="text-gray-600 mb-6">
            まずは無料プランでInnerLogの価値を体験してください
          </p>
          <button
            onClick={() => handleSelectPlan('basic')}
            className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            無料で始める
          </button>
        </div>
      </div>
    </div>
  )
}