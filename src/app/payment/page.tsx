'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { PRICING } from '@/lib/stripe'
import Link from 'next/link'

interface UserData {
  stripe_customer_id: string | null
  subscription_status: string
  premium_assessment_purchased: boolean
}

export default function PaymentPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loadingUserData, setLoadingUserData] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
      return
    }

    if (user) {
      loadUserData()
    }
  }, [user, loading, router])

  const loadUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('stripe_customer_id, subscription_status, premium_assessment_purchased')
        .eq('id', user?.id)
        .single()

      if (error) {
        console.error('Error loading user data:', error)
        return
      }

      setUserData(data)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoadingUserData(false)
    }
  }

  const handlePayment = async (paymentType: 'premium_assessment' | 'monthly_subscription') => {
    if (!user) return

    setProcessing(true)
    setMessage('')

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          paymentType,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment`,
        }),
      })

      const { url, error } = await response.json()

      if (error) {
        setMessage('決済セッションの作成に失敗しました')
        return
      }

      // Stripe Checkoutにリダイレクト
      window.location.href = url
    } catch (error) {
      console.error('Error creating checkout session:', error)
      setMessage('決済の処理中にエラーが発生しました')
    } finally {
      setProcessing(false)
    }
  }

  if (loading || loadingUserData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            プラン選択
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            あなたに最適なプランを選択してください
          </p>
        </div>

        {message && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 無料プラン */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">無料プラン</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                ¥0<span className="text-lg font-normal text-gray-500">/月</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  基本的なキャリア診断
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  月1回まで診断
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  基本レポート
                </li>
              </ul>
              <div className="text-center">
                <span className="text-gray-500 text-sm">現在のプラン</span>
              </div>
            </div>
          </div>

          {/* プレミアム診断 */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-blue-500 relative">
            {userData?.premium_assessment_purchased && (
              <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-lg text-sm">
                購入済み
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">プレミアム診断</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                ¥{PRICING.PREMIUM_ASSESSMENT.toLocaleString()}<span className="text-lg font-normal text-gray-500">（ワンタイム）</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  詳細なAI分析
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  個人最適化アドバイス
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  スキルギャップ分析
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  キャリア戦略レポート
                </li>
              </ul>
              <button
                onClick={() => handlePayment('premium_assessment')}
                disabled={processing || userData?.premium_assessment_purchased}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  userData?.premium_assessment_purchased
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {userData?.premium_assessment_purchased ? '購入済み' : processing ? '処理中...' : '購入する'}
              </button>
            </div>
          </div>

          {/* 月額プラン */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-purple-500 relative">
            {userData?.subscription_status === 'active' && (
              <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-lg text-sm">
                アクティブ
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">月額プラン</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                ¥{PRICING.MONTHLY_SUBSCRIPTION.toLocaleString()}<span className="text-lg font-normal text-gray-500">/月</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  プレミアム診断の全機能
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  無制限の診断
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  継続的なキャリアサポート
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  メール・チャットサポート
                </li>
              </ul>
              <button
                onClick={() => handlePayment('monthly_subscription')}
                disabled={processing || userData?.subscription_status === 'active'}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  userData?.subscription_status === 'active'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                } disabled:opacity-50`}
              >
                {userData?.subscription_status === 'active' ? 'アクティブ' : processing ? '処理中...' : 'サブスク開始'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            ダッシュボードに戻る
          </Link>
        </div>
      </div>
    </div>
  )
} 