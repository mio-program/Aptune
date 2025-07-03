'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

interface UserData {
  subscription_status: string
  premium_assessment_purchased: boolean
  subscription_end_date: string | null
  personality_type: string
}

interface LearningContent {
  id: string
  title: string
  description: string | null
  url: string
  platform: 'youtube' | 'article' | 'twitter' | 'linkedin'
  content_type: 'skill' | 'career' | 'industry' | 'mindset'
  target_types: string[]
  difficulty_level: 1 | 2 | 3
  duration_minutes: number | null
  tags: string[] | null
  rating: number | null
  created_at: string
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loadingUserData, setLoadingUserData] = useState(true)
  const supabase = createClient()
  const [recommendations, setRecommendations] = useState<LearningContent[]>([])
  const [recommendationReason, setRecommendationReason] = useState('')
  const [loadingRecommendations, setLoadingRecommendations] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
      return
    }

    if (user) {
      loadUserData()
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && userData) {
      fetchRecommendations()
    }
    // eslint-disable-next-line
  }, [user, userData])

  const loadUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('subscription_status, premium_assessment_purchased, subscription_end_date, personality_type')
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

  const fetchRecommendations = async () => {
    setLoadingRecommendations(true)
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          personalityType: userData?.personality_type || 'future_innovator', // 仮
          isPremium: userData?.subscription_status === 'active',
        }),
      })
      const data = await res.json()
      setRecommendations(data.recommended_contents || [])
      setRecommendationReason(data.recommendation_reason || '')
    } catch (e) {
      setRecommendations([])
      setRecommendationReason('')
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const getPlanStatus = () => {
    if (userData?.subscription_status === 'active') {
      return {
        name: '月額プラン',
        status: 'アクティブ',
        color: 'text-green-600 bg-green-100',
        description: 'プレミアム機能が利用可能です'
      }
    } else if (userData?.premium_assessment_purchased) {
      return {
        name: 'プレミアム診断',
        status: '購入済み',
        color: 'text-blue-600 bg-blue-100',
        description: 'プレミアム診断が利用可能です'
      }
    } else {
      return {
        name: '無料プラン',
        status: 'アクティブ',
        color: 'text-gray-600 bg-gray-100',
        description: '基本的な診断機能が利用可能です'
      }
    }
  }

  const canAccessPremiumAssessment = () => {
    return userData?.subscription_status === 'active' || userData?.premium_assessment_purchased
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

  const planStatus = getPlanStatus()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            ダッシュボード
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            ようこそ、{user.email}さん
          </p>
        </div>

        {/* プラン情報 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            現在のプラン
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{planStatus.name}</h3>
              <p className="text-gray-600">{planStatus.description}</p>
              {userData?.subscription_end_date && (
                <p className="text-sm text-gray-500 mt-1">
                  次回更新: {new Date(userData.subscription_end_date).toLocaleDateString('ja-JP')}
                </p>
              )}
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${planStatus.color}`}>
              {planStatus.status}
            </span>
          </div>
          <div className="mt-4">
            <Link
              href="/payment"
              className="text-blue-600 hover:text-blue-500 text-sm"
            >
              プランを変更する →
            </Link>
          </div>
        </div>

        {/* クイックアクション */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/assessment/new"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">診断を開始</h3>
                <p className="text-gray-600">新しいキャリア診断を開始</p>
              </div>
            </div>
          </Link>

          <Link
            href="/assessment/results"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">診断結果</h3>
                <p className="text-gray-600">過去の診断結果を確認</p>
              </div>
            </div>
          </Link>

          <Link
            href="/profile"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">プロフィール</h3>
                <p className="text-gray-600">プロフィールを編集</p>
              </div>
            </div>
          </Link>

          <Link
            href="/payment/history"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">支払い履歴</h3>
                <p className="text-gray-600">決済履歴を確認</p>
              </div>
            </div>
          </Link>

          {canAccessPremiumAssessment() && (
            <Link
              href="/assessment/new?type=premium"
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-blue-200"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">プレミアム診断</h3>
                  <p className="text-gray-600">詳細なAI分析診断</p>
                </div>
              </div>
            </Link>
          )}

          {!canAccessPremiumAssessment() && (
            <Link
              href="/payment"
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-blue-200"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">プレミアムにアップグレード</h3>
                  <p className="text-gray-600">詳細な診断機能を利用</p>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* 最近のアクティビティ */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            最近のアクティビティ
          </h2>
          <div className="text-center py-8">
            <p className="text-gray-500">まだアクティビティがありません</p>
            <p className="text-sm text-gray-400 mt-2">
              診断を開始してアクティビティを追加しましょう
            </p>
          </div>
        </div>

        {/* 今週のおすすめ学習コンテンツ */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">今週のおすすめ学習コンテンツ</h2>
          {loadingRecommendations ? (
            <div className="text-gray-500">読み込み中...</div>
          ) : recommendations.length === 0 ? (
            <div className="text-gray-500">おすすめコンテンツがありません</div>
          ) : (
            <>
              <p className="mb-4 text-blue-700 text-sm">{recommendationReason}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((content) => (
                  <a
                    key={content.id}
                    href={content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-blue-50 hover:bg-blue-100 rounded-lg p-4 transition"
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-200 text-blue-800 mr-2">
                        {content.platform.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{content.content_type}</span>
                      <span className="ml-auto text-xs text-gray-400">
                        {content.duration_minutes ? `${content.duration_minutes}分` : ''}
                      </span>
                    </div>
                    <div className="font-bold text-lg text-blue-900 mb-1">{content.title}</div>
                    <div className="text-gray-700 text-sm mb-1 line-clamp-2">{content.description}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {content.tags?.map((tag) => (
                        <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{tag}</span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 