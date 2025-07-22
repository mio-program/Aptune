'use client'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ParticleEffect from '../../../components/ParticleEffect'

interface SetupData {
  industry: string
  jobRole: string
  experienceLevel: string
  learningGoals: string[]
  preferredContentTypes: string[]
  dailyLearningTime: number
}

const INDUSTRIES = [
  'テクノロジー・IT',
  '金融・フィンテック',
  'コンサルティング',
  '製造業・エンジニアリング',
  'ヘルスケア・医療',
  ' 教育・EdTech',
  'マーケティング・広告',
  'Eコマース・小売',
  'エンターテイメント・メディア',
  'スタートアップ・起業',
  'その他'
]

const JOB_ROLES = [
  'エンジニア・開発者',
  'データサイエンティスト',
  'プロダクトマネージャー',
  'プロジェクトマネージャー',
  'デザイナー・UX/UI',
  'マーケティング担当',
  '営業・セールス',
  'コンサルタント',
  '経営者・役員',
  '研究者・アナリスト',
  '人事・組織開発',
  'その他'
]

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: '初心者（0-2年）', description: '基礎から学びたい' },
  { value: 'intermediate', label: '中級者（3-5年）', description: 'スキルアップしたい' },
  { value: 'advanced', label: '上級者（6年以上）', description: '最新トレンドを追いたい' }
]

const LEARNING_GOALS = [
  'AI・機械学習スキル習得',
  'データ分析能力向上',
  'プログラミングスキル強化',
  'ビジネス戦略立案',
  'リーダーシップ開発',
  'マーケティング知識',
  'プロダクト開発',
  'デザイン思考',
  '業界トレンド把握',
  'キャリア転換準備',
  '起業・新規事業',
  '英語・グローバル対応'
]

const CONTENT_TYPES = [
  { value: 'video', label: '動画コンテンツ', icon: '🎥' },
  { value: 'article', label: '記事・ブログ', icon: '📝' },
  { value: 'course', label: 'オンラインコース', icon: '🎓' },
  { value: 'podcast', label: 'ポッドキャスト', icon: '🎙️' }
]

const DAILY_TIME_OPTIONS = [
  { value: 15, label: '15分', description: 'サクッと学習' },
  { value: 30, label: '30分', description: 'じっくり学習' },
  { value: 60, label: '1時間', description: '本格的学習' },
  { value: 120, label: '2時間以上', description: '集中的学習' }
]

export default function LearningSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [userType, setUserType] = useState<string>('')
  const [setupData, setSetupData] = useState<SetupData>({
    industry: '',
    jobRole: '',
    experienceLevel: '',
    learningGoals: [],
    preferredContentTypes: ['video', 'article'],
    dailyLearningTime: 30
  })

  const totalSteps = 6

  // 診断結果からユーザータイプを取得
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('innerlog_diagnostic_result')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setUserType(data.result.primaryType)
      } catch (error) {
        console.error('Error parsing diagnostic result:', error)
        router.push('/assessment')
      }
    } else {
      router.push('/assessment')
    }
  }, [router])

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleLearningGoalToggle = (goal: string) => {
    setSetupData(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.includes(goal)
        ? prev.learningGoals.filter(g => g !== goal)
        : [...prev.learningGoals, goal]
    }))
  }

  const handleContentTypeToggle = (type: string) => {
    setSetupData(prev => ({
      ...prev,
      preferredContentTypes: prev.preferredContentTypes.includes(type)
        ? prev.preferredContentTypes.filter(t => t !== type)
        : [...prev.preferredContentTypes, type]
    }))
  }

  const handleComplete = () => {
    // セットアップデータを保存
    if (typeof window !== 'undefined') {
      localStorage.setItem('innerlog_learning_setup', JSON.stringify({
        userType,
        ...setupData,
        completedAt: new Date().toISOString()
      }))
    }
    
    // 学習ダッシュボードにリダイレクト
    router.push('/learning/dashboard')
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return setupData.industry !== ''
      case 2: return setupData.jobRole !== ''
      case 3: return setupData.experienceLevel !== ''
      case 4: return setupData.learningGoals.length > 0
      case 5: return setupData.preferredContentTypes.length > 0
      case 6: return setupData.dailyLearningTime > 0
      default: return false
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return '業界選択'
      case 2: return '職種選択'
      case 3: return '経験レベル'
      case 4: return '学習目標'
      case 5: return 'コンテンツ形式'
      case 6: return '学習時間'
      default: return ''
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold cyber-text-glow mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
                あなたの業界は？
              </h2>
              <p className="text-gray-300">AI時代の業界特化コンテンツをキュレーションします</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INDUSTRIES.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSetupData(prev => ({ ...prev, industry }))}
                  className={`p-6 rounded-xl text-left transition-all duration-300 ${
                    setupData.industry === industry
                      ? 'cyber-gradient cyber-glow'
                      : 'cyber-card hover:border-orange-500'
                  }`}
                >
                  <div className="text-lg font-medium">{industry}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold cyber-text-glow mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
                あなたの職種は？
              </h2>
              <p className="text-gray-300">役割に特化した学習コンテンツを提供します</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {JOB_ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setSetupData(prev => ({ ...prev, jobRole: role }))}
                  className={`p-6 rounded-xl text-left transition-all duration-300 ${
                    setupData.jobRole === role
                      ? 'cyber-gradient cyber-glow'
                      : 'cyber-card hover:border-orange-500'
                  }`}
                >
                  <div className="text-lg font-medium">{role}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold cyber-text-glow mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
                あなたの経験レベルは？
              </h2>
              <p className="text-gray-300">最適な難易度のコンテンツをお届けします</p>
            </div>
            <div className="space-y-4">
              {EXPERIENCE_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setSetupData(prev => ({ ...prev, experienceLevel: level.value }))}
                  className={`w-full p-6 rounded-xl text-left transition-all duration-300 ${
                    setupData.experienceLevel === level.value
                      ? 'cyber-gradient cyber-glow'
                      : 'cyber-card hover:border-orange-500'
                  }`}
                >
                  <div className="text-xl font-medium mb-2">{level.label}</div>
                  <div className="text-gray-300">{level.description}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold cyber-text-glow mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
                学習目標を選択
              </h2>
              <p className="text-gray-300">複数選択可能です（3つ以上推奨）</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LEARNING_GOALS.map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleLearningGoalToggle(goal)}
                  className={`p-4 rounded-xl text-left transition-all duration-300 ${
                    setupData.learningGoals.includes(goal)
                      ? 'cyber-gradient cyber-glow'
                      : 'cyber-card hover:border-orange-500'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      setupData.learningGoals.includes(goal) ? 'border-white' : 'border-gray-400'
                    }`}>
                      {setupData.learningGoals.includes(goal) && (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="font-medium">{goal}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold cyber-text-glow mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
                好みのコンテンツ形式
              </h2>
              <p className="text-gray-300">複数選択可能です</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleContentTypeToggle(type.value)}
                  className={`p-6 rounded-xl text-left transition-all duration-300 ${
                    setupData.preferredContentTypes.includes(type.value)
                      ? 'cyber-gradient cyber-glow'
                      : 'cyber-card hover:border-orange-500'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-3xl mr-4">{type.icon}</span>
                    <div>
                      <div className="text-lg font-medium">{type.label}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold cyber-text-glow mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
                1日の学習時間
              </h2>
              <p className="text-gray-300">無理のない範囲で設定してください</p>
            </div>
            <div className="space-y-4">
              {DAILY_TIME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSetupData(prev => ({ ...prev, dailyLearningTime: option.value }))}
                  className={`w-full p-6 rounded-xl text-left transition-all duration-300 ${
                    setupData.dailyLearningTime === option.value
                      ? 'cyber-gradient cyber-glow'
                      : 'cyber-card hover:border-orange-500'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xl font-medium">{option.label}</div>
                      <div className="text-gray-300">{option.description}</div>
                    </div>
                    <div className="text-3xl">⏰</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!userType) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">診断結果を読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <ParticleEffect />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black cyber-title mb-4 typing-effect" style={{ fontFamily: 'Orbitron, monospace' }}>
            🚀 LEARNING SETUP
          </h1>
          <p className="text-xl cyber-text-gold">
            {userType}タイプ専用カスタマイズ
          </p>
        </div>

        {/* プログレスバー */}
        <div className="mb-10">
          <div className="flex justify-between text-sm font-semibold text-gray-200 mb-3">
            <span className="cyber-text-gold" style={{ fontFamily: 'Orbitron, monospace' }}>
              STEP {currentStep} / {totalSteps}: {getStepTitle()}
            </span>
            <span className="cyber-text-glow" style={{ fontFamily: 'Orbitron, monospace' }}>
              {Math.round((currentStep / totalSteps) * 100)}% 完了
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-600 glass-morph">
            <div 
              className="cyber-gradient h-3 rounded-full transition-all duration-700 cyber-glow" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* ステップコンテンツ */}
        <div className="mb-12">
          {renderStepContent()}
        </div>

        {/* ナビゲーション */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
              currentStep === 1 
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700' 
                : 'cyber-card text-gray-300 hover:cyber-text-glow hover:scale-105'
            }`}
          >
            ← 前へ
          </button>

          <div className="flex gap-3">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all duration-500 ${
                  i + 1 === currentStep ? 'cyber-gradient cyber-glow' : 
                  i + 1 < currentStep ? 'bg-orange-500' : 'bg-gray-600 border border-gray-500'
                }`}
              />
            ))}
          </div>

          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                !isStepValid()
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700' 
                  : 'cyber-button hover:scale-105 cyber-glow'
              }`}
            >
              次へ →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!isStepValid()}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                !isStepValid()
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700' 
                  : 'cyber-button-gold hover:scale-105 cyber-glow cyber-pulse'
              }`}
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              🎯 学習開始
            </button>
          )}
        </div>
      </div>
    </div>
  )
}