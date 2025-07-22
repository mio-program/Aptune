'use client'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// import { diagnosisTypes } from '../../../data/diagnosis-types'
import DiagnosisResult from '../../../components/DiagnosisResult'
import PaymentModal from '../../../components/PaymentModal'
import ParticleEffect from '../../../components/ParticleEffect'
import { createClient } from '../../../lib/supabase'
import { generateDiagnosisPDF, downloadPDF } from '../../../lib/pdf-generator'

// 診断タイプデータは DiagnosisResult コンポーネント内で処理

export default function ResultsPage() {
  const router = useRouter()
  const [resultData, setResultData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false)
  const [user, setUser] = useState<any>(null)

  // 認証チェック（オプション）
  useEffect(() => {
    try {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setUser(data.user)
        }
        // 認証なしでも診断結果は表示可能
      }).catch(error => {
        console.error('Auth check error:', error)
        // エラーが発生しても診断結果は表示
      })
    } catch (error) {
      console.error('Supabase client error:', error)
      // クライアント初期化エラーでも診断結果は表示
    }
  }, [router])

  // 診断データ取得
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('innerlog_diagnostic_result')
    
    if (!stored) {
      console.log('No stored data found, redirecting to assessment');
      setTimeout(() => {
        setIsLoading(false)
        router.push('/assessment')
      }, 1500)
      return
    }
    
    try {
      const parsedData = JSON.parse(stored);
      
      // データ構造の詳細検証
      if (!parsedData || 
          !parsedData.result || 
          !parsedData.result.primaryType || 
          !parsedData.result.scores ||
          !parsedData.answers) {
        console.error('Invalid data structure:', parsedData);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('innerlog_diagnostic_result'); // 無効なデータを削除
        }
        throw new Error('Invalid result data structure')
      }
      
      // スコアデータの検証
      const requiredTypes = ['FV', 'AT', 'VA', 'HC', 'MB', 'GS'];
      const hasValidScores = requiredTypes.every(type => 
        typeof parsedData.result.scores[type] === 'number'
      );
      
      if (!hasValidScores) {
        console.error('Invalid scores data:', parsedData.result.scores);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('innerlog_diagnostic_result');
        }
        throw new Error('Invalid scores data')
      }
      
      setResultData(parsedData)
    } catch (error) {
      console.error('Error parsing stored data:', error);
      setTimeout(() => {
        setIsLoading(false)
        router.push('/assessment')
      }, 1500)
      return
    }
    
    setIsLoading(false)
  }, [router])

  // プレミアムアンロック状態の確認
  useEffect(() => {
    // まずローカルストレージをチェック（認証なしでも動作）
    if (typeof window === 'undefined') return
    const localPremium = localStorage.getItem('premium_unlocked')
    if (localPremium === 'true') {
      setIsPremiumUnlocked(true)
      return
    }

    // ユーザーがログインしている場合はデータベースもチェック
    if (!user) {
      setIsPremiumUnlocked(false)
      return
    }
    
    try {
      const supabase = createClient()
      supabase
        .from('premium_unlocks')
        .select('id')
        .eq('user_id', user.id)
        .then(({ data, error }) => {
          if (error) {
            console.error('Premium unlock check error:', error)
            setIsPremiumUnlocked(false)
          } else {
            const hasUnlock = !!(data && data.length > 0)
            setIsPremiumUnlocked(hasUnlock)
            // データベースにある場合はローカルストレージにも保存
            if (hasUnlock && typeof window !== 'undefined') {
              localStorage.setItem('premium_unlocked', 'true')
            }
          }
        })
        .catch(error => {
          console.error('Premium unlock query error:', error)
          setIsPremiumUnlocked(false)
        })
    } catch (error) {
      console.error('Supabase client error in premium check:', error)
      setIsPremiumUnlocked(false)
    }
  }, [user])

  // Stripe決済成功時のunlock処理
  const handleUnlock = () => {
    setShowPayment(true)
  }
  const handlePaymentClose = () => setShowPayment(false)

  // PDF出力処理
  const handleDownloadPDF = () => {
    if (!isPremiumUnlocked) {
      alert('PDFダウンロードはプレミアムユーザー限定機能です。')
      return
    }

    try {
      const pdf = generateDiagnosisPDF({
        userType: primaryType,
        timestamp: resultData.timestamp,
        answers: resultData.answers,
        scores: resultData.result.scores,
      })
      
      const filename = `innerlog-diagnosis-${primaryType}-${new Date().toISOString().split('T')[0]}.pdf`
      downloadPDF(pdf, filename)
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('PDFの生成中にエラーが発生しました。')
    }
  }

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
            {typeof window !== 'undefined' && !localStorage.getItem('innerlog_diagnostic_result') && (
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
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-16">
          {isPremiumUnlocked && (
            <button
              onClick={handleDownloadPDF}
              className="cyber-button-gold px-10 py-5 rounded-xl font-bold text-xl hover:scale-105 transition-all duration-400 energy-wave-trigger relative overflow-hidden"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              <div className="energy-wave"></div>
              📄 PDFレポートダウンロード
            </button>
          )}
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