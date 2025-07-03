'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { diagnosisTypes } from '../../data/diagnosis-types'
import DiagnosisResult from '../../components/DiagnosisResult'
import PaymentModal from '../../components/PaymentModal'
import { createClient } from '../../lib/supabase-client'

const careerTypes = questionsData.career_types

export default function ResultsPage() {
  const router = useRouter()
  const [resultData, setResultData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Supabase認証必須
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        router.push('/auth')
      } else {
        setUser(data.user)
      }
    })
  }, [router])

  // 診断データ取得
  useEffect(() => {
    const stored = localStorage.getItem('innerlog_diagnostic_result')
    if (!stored) {
      router.push('/assessment')
      return
    }
    try {
      setResultData(JSON.parse(stored))
    } catch {
      router.push('/assessment')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // premium_unlocksテーブルでアンロック判定
  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase
      .from('premium_unlocks')
      .select('id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setIsPremiumUnlocked(!!(data && data.length > 0))
      })
  }, [user])

  // Stripe決済成功時のunlock処理
  const handleUnlock = () => {
    setShowPayment(true)
  }
  const handlePaymentClose = () => setShowPayment(false)

  if (isLoading || !resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">診断結果を読み込み中...</p>
        </div>
      </div>
    )
  }

  const { result } = resultData
  const { primaryType } = result

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <DiagnosisResult
          userType={primaryType}
          isPremiumUnlocked={isPremiumUnlocked}
          onUnlock={handleUnlock}
        />
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => router.push('/assessment')}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
          >
            もう一度診断する
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 text-center"
          >
            ホームへ戻る
          </button>
        </div>
        <PaymentModal open={showPayment} onClose={handlePaymentClose} amount={5} />
      </div>
    </div>
  )
} 