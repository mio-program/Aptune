'use client'

import { ArrowRight, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'

const benefits = [
  '完全無料で基本診断を利用',
  'AI分析による精密なキャリア評価',
  '個人に最適化されたアクションプラン',
  '市場価値の定量的な可視化',
  '継続的なキャリア成長支援'
]

const testimonials = [
  {
    content: "InnerLogの診断で自分の市場価値が明確になり、転職活動で大幅な年収アップを実現できました。",
    author: "田中 美咲",
    role: "マーケティングマネージャー",
    rating: 5
  },
  {
    content: "AIによる分析が非常に的確で、今まで気づかなかった自分の強みを発見できました。",
    author: "佐藤 健太",
    role: "エンジニア",
    rating: 5
  },
  {
    content: "キャリアチェンジを成功させるための具体的なロードマップが得られて、とても助かりました。",
    author: "山田 花子",
    role: "プロジェクトマネージャー",
    rating: 5
  }
]

export function CTA() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2 lg:items-center">
          <div className="lg:pr-8 xl:pr-20">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
                今すぐ始めよう
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                あなたのキャリアの<br />
                可能性を最大化
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                AI時代に適応し、成長し続けるキャリアを築くために。
                InnerLogがあなたの成功をサポートします。
              </p>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  InnerLogで得られること：
                </h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="/assessment"
                  className="group relative inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 transform hover:scale-105"
                >
                  無料診断を始める
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                
                <div className="text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2">10,000+ 人が利用</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:ml-8 xl:ml-20">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-8">
                利用者の声
              </h3>
              <div className="space-y-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <blockquote className="text-gray-700 mb-4">
                      &ldquo;{testimonial.content}&rdquo;
                    </blockquote>
                    <div>
                      <div className="font-medium text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div className="relative overflow-hidden rounded-2xl bg-gray-900 px-6 py-20 shadow-xl sm:px-10 sm:py-24 md:px-12 lg:px-20">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20" />
            <div className="relative mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                キャリアの未来は、今日の選択から始まる
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                AI時代を生き抜くキャリア戦略を、今すぐ手に入れましょう
              </p>
              <div className="mt-8">
                <Link
                  href="/assessment"
                  className="inline-flex items-center rounded-full bg-white px-8 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200"
                >
                  今すぐ無料で始める
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                クレジットカード不要 • 3分で完了 • いつでもキャンセル可能
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </section>
  )
}