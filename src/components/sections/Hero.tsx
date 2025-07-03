'use client'

import { ArrowRight, Brain, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 py-20 sm:py-32">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              AI時代のキャリア戦略を支援{' '}
              <Link href="/about" className="font-semibold text-indigo-600">
                <span className="absolute inset-0" aria-hidden="true" />
                詳しく見る <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            <span className="block">あなたの</span>
            <span className="block text-indigo-600">キャリアの可能性</span>
            <span className="block">を解き放つ</span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-600">
            AIと最新データ分析技術を活用した、個人に最適化されたキャリア診断プラットフォーム。
            あなたの強み、適性、市場価値を正確に分析し、次のステップを明確にします。
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/assessment"
              className="group relative inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 transform hover:scale-105"
            >
              <Brain className="mr-2 h-4 w-4" />
              無料診断を始める
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link 
              href="/demo" 
              className="inline-flex items-center text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              デモを見る
              <span aria-hidden="true" className="ml-1">→</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-16 flow-root sm:mt-24">
          <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="rounded-md bg-white p-8 shadow-2xl ring-1 ring-gray-900/10">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">AI分析</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    最新のAI技術による<br />精密なキャリア分析
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">市場価値</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    リアルタイムの<br />市場データ分析
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600">
                    <ArrowRight className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">次のステップ</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    個人に最適化された<br />キャリアプラン提案
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}