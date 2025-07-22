'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ParticleEffect from '@/components/ParticleEffect'

export default function PremiumUnlockedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [isVerifying, setIsVerifying] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setIsVerifying(false)
        return
      }

      try {
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        const data = await response.json()
        
        if (data.success) {
          setIsSuccess(true)
          // プレミアムアンロック状態をローカルストレージに保存
          if (typeof window !== 'undefined') {
            localStorage.setItem('premium_unlocked', 'true')
            localStorage.setItem('premium_unlocked_at', new Date().toISOString())
          }
        }
      } catch (error) {
        console.error('Payment verification error:', error)
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [sessionId])

  const handleGoToResults = () => {
    router.push('/assessment/results')
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ParticleEffect />
        <div className="text-center cyber-card p-12 rounded-2xl max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold cyber-text-glow mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
            🔄 決済確認中
          </h2>
          <p className="cyber-text-gold text-lg">
            決済の完了を確認しています...
          </p>
        </div>
      </div>
    )
  }

  if (!isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ParticleEffect />
        <div className="text-center cyber-card p-12 rounded-2xl max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
            ⚠️ 決済エラー
          </h2>
          <p className="text-gray-300 mb-6">
            決済の確認に失敗しました。
          </p>
          <button
            onClick={() => router.push('/assessment/results')}
            className="cyber-button px-6 py-3 rounded-lg"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            診断結果に戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <ParticleEffect />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center cyber-card p-12 rounded-2xl">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-black cyber-title mb-6" style={{ fontFamily: 'Orbitron, monospace' }}>
            プレミアムアンロック完了！
          </h1>
          <p className="text-xl cyber-text-gold mb-8">
            決済が正常に完了しました。すべての詳細分析結果がご利用いただけます。
          </p>
          
          <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="text-green-400 text-xl">✓</div>
              <span className="text-gray-200">AI時代の詳細強み分析</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-green-400 text-xl">✓</div>
              <span className="text-gray-200">弱み改善の具体的ガイド</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-green-400 text-xl">✓</div>
              <span className="text-gray-200">活躍できる業界・職種分析</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-green-400 text-xl">✓</div>
              <span className="text-gray-200">学習すべきスキル・キャリアパス</span>
            </div>
          </div>

          <button
            onClick={handleGoToResults}
            className="cyber-button-gold px-10 py-5 rounded-xl text-xl font-bold hover:scale-105 transition-all duration-400 energy-wave-trigger relative overflow-hidden"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            <div className="energy-wave"></div>
            🚀 詳細分析結果を見る
          </button>
        </div>
      </div>
    </div>
  )
}