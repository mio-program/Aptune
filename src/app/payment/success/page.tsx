'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
      return
    }

    if (sessionId) {
      verifyPayment()
    } else {
      setVerifying(false)
      setError('決済セッションが見つかりません')
    }
  }, [user, loading, sessionId])

  const verifyPayment = async () => {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          userId: user?.id,
        }),
      })

      const { success, error: verifyError } = await response.json()

      if (success) {
        setVerified(true)
      } else {
        setError(verifyError || '決済の確認に失敗しました')
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      setError('決済の確認中にエラーが発生しました')
    } finally {
      setVerifying(false)
    }
  }

  if (loading || verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">決済を確認中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {verified ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              決済完了
            </h2>
            <p className="text-gray-600 mb-6">
              決済が正常に完了しました。ありがとうございます！
            </p>
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 block text-center"
              >
                ダッシュボードに戻る
              </Link>
              <Link
                href="/assessment/new"
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 block text-center"
              >
                診断を開始する
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              決済エラー
            </h2>
            <p className="text-gray-600 mb-6">
              {error || '決済の確認に失敗しました'}
            </p>
            <div className="space-y-3">
              <Link
                href="/payment"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 block text-center"
              >
                決済ページに戻る
              </Link>
              <Link
                href="/dashboard"
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 block text-center"
              >
                ダッシュボードに戻る
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 