'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ParticleEffect from '../../../components/ParticleEffect'

interface SetupData {
  userType: string
  industry: string
  jobRole: string
  experienceLevel: string
  learningGoals: string[]
  preferredContentTypes: string[]
  dailyLearningTime: number
  completedAt: string
}

interface MockContent {
  id: string
  title: string
  description: string
  contentType: 'video' | 'article' | 'course' | 'podcast'
  platform: string
  duration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  thumbnailUrl: string
  rating: number
  tags: string[]
  isCompleted?: boolean
  progress?: number
}

// モックデータ（実際のAPIから取得予定）
const generateMockContent = (userType: string, goals: string[]): MockContent[] => {
  const baseContent: MockContent[] = [
    {
      id: '1',
      title: 'AI時代のリーダーシップ戦略',
      description: '次世代リーダーに求められるAI活用スキルとマインドセット',
      contentType: 'video',
      platform: 'YouTube',
      duration: 45,
      difficulty: 'intermediate',
      thumbnailUrl: '/api/placeholder/320/180',
      rating: 4.8,
      tags: ['リーダーシップ', 'AI戦略', 'マネジメント']
    },
    {
      id: '2',
      title: 'データ分析基礎：Pythonで始める機械学習',
      description: '初心者向けPython機械学習チュートリアル',
      contentType: 'course',
      platform: 'Udemy',
      duration: 180,
      difficulty: 'beginner',
      thumbnailUrl: '/api/placeholder/320/180',
      rating: 4.6,
      tags: ['Python', '機械学習', 'データ分析']
    },
    {
      id: '3',
      title: '2024年AI業界トレンド分析レポート',
      description: '最新のAI技術動向と業界への影響を詳細分析',
      contentType: 'article',
      platform: 'Medium',
      duration: 15,
      difficulty: 'intermediate',
      thumbnailUrl: '/api/placeholder/320/180',
      rating: 4.5,
      tags: ['業界動向', 'AI技術', 'トレンド']
    },
    {
      id: '4',
      title: 'プロダクトマネジメントの新常識',
      description: 'AI活用時代のプロダクト開発手法',
      contentType: 'podcast',
      platform: 'Spotify',
      duration: 60,
      difficulty: 'advanced',
      thumbnailUrl: '/api/placeholder/320/180',
      rating: 4.7,
      tags: ['プロダクト開発', 'PM', 'イノベーション']
    }
  ]

  // ユーザータイプに応じてコンテンツをカスタマイズ
  return baseContent.map(content => ({
    ...content,
    isCompleted: Math.random() > 0.7,
    progress: Math.floor(Math.random() * 100)
  }))
}

const CONTENT_TYPE_ICONS = {
  video: '🎥',
  article: '📝',
  course: '🎓',
  podcast: '🎙️'
}

const DIFFICULTY_COLORS = {
  beginner: 'text-green-400',
  intermediate: 'text-yellow-400',
  advanced: 'text-red-400'
}

export default function LearningDashboardPage() {
  const router = useRouter()
  const [setupData, setSetupData] = useState<SetupData | null>(null)
  const [recommendedContent, setRecommendedContent] = useState<MockContent[]>([])
  const [selectedTab, setSelectedTab] = useState<'recommended' | 'progress' | 'goals'>('recommended')
  const [isLoading, setIsLoading] = useState(true)
  const [dailyUsage, setDailyUsage] = useState({ viewed: 2, limit: 3 })

  useEffect(() => {
    // セットアップデータを取得
    const storedSetup = localStorage.getItem('innerlog_learning_setup')
    if (!storedSetup) {
      router.push('/learning/setup')
      return
    }

    try {
      const data = JSON.parse(storedSetup)
      setSetupData(data)
      
      // モックコンテンツ生成
      const content = generateMockContent(data.userType, data.learningGoals)
      setRecommendedContent(content)
      
      setIsLoading(false)
    } catch (error) {
      console.error('Error parsing setup data:', error)
      router.push('/learning/setup')
    }
  }, [router])

  const handleContentClick = (contentId: string) => {
    // コンテンツ詳細ページまたは外部リンクへ
    console.log('Opening content:', contentId)
    
    // 使用回数更新
    setDailyUsage(prev => ({
      ...prev,
      viewed: Math.min(prev.viewed + 1, prev.limit)
    }))
  }

  const handleUpgrade = () => {
    // プレミアムアップグレード
    router.push('/pricing')
  }

  if (isLoading || !setupData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">学習プランを読み込み中...</p>
        </div>
      </div>
    )
  }

  const canAccessContent = dailyUsage.viewed < dailyUsage.limit

  return (
    <div className="min-h-screen bg-black">
      <ParticleEffect />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-5xl font-black cyber-title mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                🎯 LEARNING HUB
              </h1>
              <p className="text-xl cyber-text-gold">
                {setupData.userType} × {setupData.industry}
              </p>
            </div>
            
            {/* 使用制限表示 */}
            <div className="cyber-card p-4 rounded-lg">
              <div className="text-sm text-gray-300 mb-2">今日の学習</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold cyber-text-glow">
                  {dailyUsage.viewed}/{dailyUsage.limit}
                </div>
                <div className="text-sm text-gray-400">コンテンツ</div>
              </div>
              {!canAccessContent && (
                <button
                  onClick={handleUpgrade}
                  className="cyber-button-gold text-xs px-3 py-1 rounded mt-2 w-full"
                >
                  🔓 制限解除
                </button>
              )}
            </div>
          </div>

          {/* タブナビゲーション */}
          <div className="flex gap-1 bg-gray-900 rounded-xl p-1">
            {[
              { key: 'recommended', label: '🎯 おすすめ', count: recommendedContent.length },
              { key: 'progress', label: '📊 進捗', count: recommendedContent.filter(c => c.isCompleted).length },
              { key: 'goals', label: '🎪 目標', count: setupData.learningGoals.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  selectedTab === tab.key
                    ? 'cyber-gradient cyber-glow text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{tab.label}</span>
                  <span className="text-sm bg-gray-700 px-2 py-1 rounded">{tab.count}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* コンテンツエリア */}
        {selectedTab === 'recommended' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold cyber-text-glow">
                あなたにおすすめのコンテンツ
              </h2>
              <div className="text-sm text-gray-400">
                {setupData.experienceLevel}レベル • {setupData.preferredContentTypes.join(', ')}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedContent.map((content, index) => (
                <div
                  key={content.id}
                  className={`cyber-card rounded-xl overflow-hidden transition-all duration-300 ${
                    canAccessContent || content.isCompleted
                      ? 'hover:scale-105 hover:cyber-glow cursor-pointer'
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => (canAccessContent || content.isCompleted) && handleContentClick(content.id)}
                >
                  {/* サムネイル */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">
                      {CONTENT_TYPE_ICONS[content.contentType]}
                    </div>
                    
                    {/* 難易度・時間 */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2 py-1 text-xs rounded bg-black bg-opacity-70 ${DIFFICULTY_COLORS[content.difficulty]}`}>
                        {content.difficulty}
                      </span>
                      <span className="px-2 py-1 text-xs rounded bg-black bg-opacity-70 text-gray-300">
                        {content.duration}分
                      </span>
                    </div>

                    {/* 完了済みマーク */}
                    {content.isCompleted && (
                      <div className="absolute top-3 right-3 text-green-400 text-xl">✅</div>
                    )}

                    {/* プラットフォーム */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 text-xs rounded bg-black bg-opacity-70 text-gray-300">
                      {content.platform}
                    </div>

                    {/* アクセス制限オーバーレイ */}
                    {!canAccessContent && !content.isCompleted && (
                      <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl mb-2">🔒</div>
                          <div className="text-sm">今日の制限に達しました</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUpgrade()
                            }}
                            className="cyber-button-gold text-xs px-3 py-1 rounded mt-2"
                          >
                            プレミアムで解除
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* コンテンツ情報 */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">{content.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{content.description}</p>
                    
                    {/* 評価・タグ */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm font-medium">{content.rating}</span>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {content.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-1 text-xs bg-gray-800 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 進捗バー */}
                    {content.progress && content.progress > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>進捗</span>
                          <span>{content.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className="cyber-gradient h-2 rounded-full transition-all duration-500"
                            style={{ width: `${content.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'progress' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold cyber-text-glow">学習進捗</h2>
            
            {/* 進捗統計 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="cyber-card p-6 rounded-xl text-center">
                <div className="text-3xl font-bold cyber-text-gold mb-2">
                  {recommendedContent.filter(c => c.isCompleted).length}
                </div>
                <div className="text-gray-400">完了コンテンツ</div>
              </div>
              <div className="cyber-card p-6 rounded-xl text-center">
                <div className="text-3xl font-bold cyber-text-gold mb-2">
                  {Math.floor(Math.random() * 50) + 10}h
                </div>
                <div className="text-gray-400">累計学習時間</div>
              </div>
              <div className="cyber-card p-6 rounded-xl text-center">
                <div className="text-3xl font-bold cyber-text-gold mb-2">
                  {Math.floor((recommendedContent.filter(c => c.isCompleted).length / recommendedContent.length) * 100)}%
                </div>
                <div className="text-gray-400">完了率</div>
              </div>
            </div>

            {/* 最近の学習履歴 */}
            <div className="cyber-card p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">最近の学習履歴</h3>
              <div className="space-y-3">
                {recommendedContent.filter(c => c.isCompleted).slice(0, 5).map((content) => (
                  <div key={content.id} className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                    <div className="text-2xl">{CONTENT_TYPE_ICONS[content.contentType]}</div>
                    <div className="flex-1">
                      <div className="font-medium">{content.title}</div>
                      <div className="text-sm text-gray-400">{content.platform} • {content.duration}分</div>
                    </div>
                    <div className="text-green-400">✅</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'goals' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold cyber-text-glow">学習目標</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {setupData.learningGoals.map((goal, index) => (
                <div key={index} className="cyber-card p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">🎯</div>
                    <h3 className="text-lg font-semibold">{goal}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">進捗</span>
                      <span className="text-gray-300">{Math.floor(Math.random() * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="cyber-gradient h-2 rounded-full"
                        style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 設定変更 */}
            <div className="cyber-card p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">学習設定</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">業界:</span>
                  <span className="ml-2">{setupData.industry}</span>
                </div>
                <div>
                  <span className="text-gray-400">職種:</span>
                  <span className="ml-2">{setupData.jobRole}</span>
                </div>
                <div>
                  <span className="text-gray-400">レベル:</span>
                  <span className="ml-2">{setupData.experienceLevel}</span>
                </div>
                <div>
                  <span className="text-gray-400">1日の学習時間:</span>
                  <span className="ml-2">{setupData.dailyLearningTime}分</span>
                </div>
              </div>
              <button
                onClick={() => router.push('/learning/setup')}
                className="cyber-button px-4 py-2 rounded-lg text-sm mt-4"
              >
                設定を変更
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}