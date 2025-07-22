'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ParticleEffect from '../../../components/ParticleEffect'

export default function DebugPage() {
  const router = useRouter()
  const [debugData, setDebugData] = useState<any>(null)

  useEffect(() => {
    // localStorage の全データをチェック
    const stored = localStorage.getItem('innerlog_diagnostic_result')
    const data = {
      hasStoredData: !!stored,
      rawData: stored,
      parsedData: stored ? (() => {
        try {
          return JSON.parse(stored)
        } catch (e) {
          return { error: e.message }
        }
      })() : null,
      localStorageKeys: Object.keys(localStorage).filter(key => key.includes('innerlog'))
    }
    
    setDebugData(data)
    console.log('Debug data:', data)
  }, [])

  const clearLocalStorage = () => {
    localStorage.removeItem('innerlog_diagnostic_result')
    setDebugData(prev => ({ ...prev, hasStoredData: false, rawData: null, parsedData: null }))
  }

  const createTestData = () => {
    const testData = {
      answers: { Q1: 5, Q2: 4, Q3: 3 },
      result: {
        scores: { FV: 15, AT: 12, VA: 8, HC: 6, MB: 4, GS: 10 },
        primaryType: 'FV',
        secondaryTypes: ['AT', 'GS']
      },
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('innerlog_diagnostic_result', JSON.stringify(testData))
    setDebugData(prev => ({ ...prev, hasStoredData: true, rawData: JSON.stringify(testData), parsedData: testData }))
  }

  return (
    <div className="min-h-screen bg-black">
      <ParticleEffect />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="cyber-card rounded-xl p-8">
          <h1 className="text-3xl font-bold cyber-text-glow mb-6" style={{ fontFamily: 'Orbitron, monospace' }}>
            🔧 診断データデバッグ
          </h1>

          {debugData && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold cyber-text-gold mb-3">データ状況</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">保存済みデータ</div>
                    <div className={`text-lg font-medium ${debugData.hasStoredData ? 'text-green-400' : 'text-red-400'}`}>
                      {debugData.hasStoredData ? '✅ あり' : '❌ なし'}
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">LocalStorage Keys</div>
                    <div className="text-sm text-gray-300">
                      {debugData.localStorageKeys.join(', ') || 'なし'}
                    </div>
                  </div>
                </div>
              </div>

              {debugData.rawData && (
                <div>
                  <h2 className="text-xl font-semibold cyber-text-gold mb-3">生データ</h2>
                  <pre className="bg-gray-900 p-4 rounded-lg text-xs text-gray-300 overflow-auto max-h-40">
                    {debugData.rawData}
                  </pre>
                </div>
              )}

              {debugData.parsedData && (
                <div>
                  <h2 className="text-xl font-semibold cyber-text-gold mb-3">パースされたデータ</h2>
                  <pre className="bg-gray-900 p-4 rounded-lg text-xs text-gray-300 overflow-auto max-h-60">
                    {JSON.stringify(debugData.parsedData, null, 2)}
                  </pre>
                </div>
              )}

              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => router.push('/assessment')}
                  className="cyber-button px-6 py-3 rounded-lg"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  📋 診断ページ
                </button>
                
                <button
                  onClick={() => router.push('/assessment/results')}
                  className="cyber-button px-6 py-3 rounded-lg"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  📊 結果ページ
                </button>
                
                <button
                  onClick={createTestData}
                  className="cyber-button-gold px-6 py-3 rounded-lg"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  🧪 テストデータ作成
                </button>
                
                <button
                  onClick={clearLocalStorage}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  🗑️ データクリア
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-900 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">使用方法</h3>
            <ol className="text-sm text-gray-300 space-y-1">
              <li>1. 「診断ページ」で診断を実行</li>
              <li>2. 「結果ページ」で結果を確認</li>
              <li>3. エラーが出る場合は「テストデータ作成」を試す</li>
              <li>4. 問題が続く場合は「データクリア」後に再実行</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}