'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { diagnosisTypes } from '../../../data/diagnosis-types'
import DiagnosisResult from '../../../components/DiagnosisResult'
import PaymentModal from '../../../components/PaymentModal'
import ParticleEffect from '../../../components/ParticleEffect'
import { createClient } from '../../../lib/supabase-client'

// const careerTypes = questionsData.career_types

export default function ResultsPage() {
  const router = useRouter()
  const [resultData, setResultData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false)
  const [user, setUser] = useState<any>(null)

  // 認証チェックを一時的に無効化（認証なしでも診断結果を表示）
  useEffect(() => {
    // 認証チェックをスキップ
    // const supabase = createClient()
    // supabase.auth.getUser().then(({ data }) => {
    //   if (!data?.user) {
    //     router.push('/auth')
    //   } else {
    //     setUser(data.user)
    //   }
    // })
  }, [router])

  // 診断データ取得
  useEffect(() => {
    const stored = localStorage.getItem('innerlog_diagnostic_result')
    console.log('Stored data from localStorage:', stored);
    
    if (!stored) {
      console.log('No stored data found, redirecting to assessment');
      setTimeout(() => {
        setIsLoading(false)
        router.push('/assessment')
      }, 2000) // 2秒後にリダイレクト
      return
    }
    
    try {
      const parsedData = JSON.parse(stored);
      console.log('Parsed result data:', parsedData);
      
      // データ構造の検証
      if (!parsedData.result || !parsedData.result.primaryType) {
        console.error('Invalid data structure:', parsedData);
        throw new Error('Invalid result data structure')
      }
      
      setResultData(parsedData)
    } catch (error) {
      console.error('Error parsing stored data:', error);
      setTimeout(() => {
        setIsLoading(false)
        router.push('/assessment')
      }, 2000)
      return
    }
    
    setIsLoading(false)
  }, [router])

  // premium_unlocksテーブルでアンロック判定（認証なしでは無料版として扱う）
  useEffect(() => {
    // 認証なしの場合は無料版として扱う
    setIsPremiumUnlocked(false)
    
    // 以下は認証が必要な場合のコード（コメントアウト）
    // if (!user) return
    // const supabase = createClient()
    // supabase
    //   .from('premium_unlocks')
    //   .select('id')
    //   .eq('user_id', user.id)
    //   .then(({ data }) => {
    //     setIsPremiumUnlocked(!!(data && data.length > 0))
    //   })
  }, [user])

  // Stripe決済成功時のunlock処理
  const handleUnlock = () => {
    setShowPayment(true)
  }
  const handlePaymentClose = () => setShowPayment(false)

  if (isLoading || !resultData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ParticleEffect />
        <div className="text-center cyber-card p-12 rounded-2xl max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold cyber-text-glow mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
            🤖 AI分析中
          </h2>
          <p className="cyber-text-gold text-lg">
            診断結果を読み込んでいます...
          </p>
          <div className="mt-6 text-sm text-gray-400">
            {!localStorage.getItem('innerlog_diagnostic_result') && (
              <div>
                <p className="mb-4">診断データが見つかりません</p>
                <button
                  onClick={() => router.push('/assessment')}
                  className="cyber-button px-6 py-3 rounded-lg"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  診断を開始
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 安全なデータ取得
  const result = resultData?.result
  const primaryType = result?.primaryType

  console.log('Rendering results page with:', { result, primaryType, isPremiumUnlocked });

  // データ再検証
  if (!result || !primaryType) {
    console.error('Missing result or primaryType:', { result, primaryType });
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ParticleEffect />
        <div className="text-center cyber-card p-12 rounded-2xl max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
            ⚠️ エラー
          </h2>
          <p className="text-gray-300 mb-6">
            診断結果データに問題があります
          </p>
          <button
            onClick={() => router.push('/assessment')}
            className="cyber-button px-6 py-3 rounded-lg"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            診断をやり直す
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <ParticleEffect />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <DiagnosisResult
          userType={primaryType}
          isPremiumUnlocked={isPremiumUnlocked}
          onUnlock={handleUnlock}
        />
        
        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center mt-16">
          <button
            onClick={() => router.push('/assessment')}
            className="cyber-button px-10 py-5 rounded-xl font-bold text-xl hover:scale-105 transition-all duration-400 energy-wave-trigger relative overflow-hidden"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            <div className="energy-wave"></div>
            🔄 もう一度診断する
          </button>
          <button
            onClick={() => router.push('/')}
            className="cyber-card px-10 py-5 rounded-xl font-medium text-gray-200 hover:cyber-text-glow hover:scale-105 transition-all duration-400 energy-wave-trigger relative overflow-hidden"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            <div className="energy-wave"></div>
            🏠 ホームへ戻る
          </button>
        </div>
        
        <PaymentModal open={showPayment} onClose={handlePaymentClose} amount={5} />
      </div>
    </div>
  )
} 