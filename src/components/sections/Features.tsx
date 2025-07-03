'use client'

import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Award, 
  Zap,
  Shield,
  BarChart3,
  Lightbulb
} from 'lucide-react'

const features = [
  {
    name: 'AI駆動のパーソナライズ診断',
    description: '機械学習アルゴリズムがあなたの回答を分析し、個人に最適化されたキャリアプロファイルを生成します。',
    icon: Brain,
    color: 'bg-indigo-500'
  },
  {
    name: '市場価値の可視化',
    description: '現在のスキルセットと経験に基づいて、転職市場でのあなたの価値を定量的に評価します。',
    icon: TrendingUp,
    color: 'bg-green-500'
  },
  {
    name: 'スキルギャップ分析',
    description: '目標とするポジションに必要なスキルと現在のスキルの差を明確にし、学習プランを提案します。',
    icon: Target,
    color: 'bg-purple-500'
  },
  {
    name: '業界トレンド予測',
    description: 'ビッグデータ分析により、今後成長が期待される業界や職種を予測し、先手を打てるアドバイスを提供。',
    icon: BarChart3,
    color: 'bg-blue-500'
  },
  {
    name: 'ネットワーキング支援',
    description: 'あなたのキャリア目標に合致するメンターやピアとのマッチング機能で、人脈構築をサポート。',
    icon: Users,
    color: 'bg-orange-500'
  },
  {
    name: '認定・資格推奨',
    description: 'キャリアパスに最適な資格や認定制度を推奨し、取得までのロードマップを提供します。',
    icon: Award,
    color: 'bg-yellow-500'
  },
  {
    name: 'リアルタイム更新',
    description: '労働市場の変化に応じて診断結果とアドバイスを自動更新し、常に最新の情報を提供。',
    icon: Zap,
    color: 'bg-red-500'
  },
  {
    name: 'プライバシー保護',
    description: '業界標準のセキュリティ対策により、あなたの個人情報とキャリア情報を安全に保護します。',
    icon: Shield,
    color: 'bg-gray-500'
  },
  {
    name: 'キャリア戦略立案',
    description: '短期・中期・長期の視点から包括的なキャリア戦略を立案し、実行可能なアクションプランを提供。',
    icon: Lightbulb,
    color: 'bg-pink-500'
  }
]

export function Features() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            包括的なキャリア分析
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            AI時代に求められる全ての機能
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            従来のキャリア診断を超えた、次世代のパーソナライズド分析プラットフォーム。
            あなたのキャリアを多角的に分析し、最適な道筋を提示します。
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}>
                    <feature.icon className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        
        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              今すぐあなたのキャリアを次のレベルへ
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              InnerLogの無料診断で、あなたの隠れたポテンシャルを発見し、
              AI時代に通用するキャリア戦略を立てましょう。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                type="button"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
              >
                無料で始める
              </button>
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors"
              >
                詳細を見る <span aria-hidden="true">→</span>
              </button>
            </div>
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle cx={512} cy={512} r={512} fill="url(#gradient)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="gradient">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}