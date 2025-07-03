'use client'

import React from 'react'
import Link from 'next/link'
import { DiagnosticEngine } from '../../../lib/diagnostic-engine'

export default function AssessmentStartPage() {
  const engine = new DiagnosticEngine()
  const metadata = engine.getMetadata()
  const characterTypes = engine.getCharacterTypes()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {metadata.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {metadata.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 診断の特徴 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            診断の特徴
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">科学的根拠</h3>
                  <p className="text-gray-600 text-sm">
                    Stanford HAI研究に基づいた信頼性の高い診断システム
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">6タイプ完全判定</h3>
                  <p className="text-gray-600 text-sm">
                    バランスの取れた6つのキャラクタータイプから最適なタイプを判定
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">AI時代特化</h3>
                  <p className="text-gray-600 text-sm">
                    AI時代のキャリア戦略に特化した質問と分析
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">詳細な分析</h3>
                  <p className="text-gray-600 text-sm">
                    信頼性スコアと信頼度を含む詳細な結果分析
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                  <span className="text-blue-600 font-bold">5</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">実践的アドバイス</h3>
                  <p className="text-gray-600 text-sm">
                    具体的なキャリアパスとアクションプランの提案
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                  <span className="text-blue-600 font-bold">6</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">無料診断</h3>
                  <p className="text-gray-600 text-sm">
                    完全無料で20問の診断を受けることができます
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* キャラクタータイプ紹介 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            6つのキャラクタータイプ
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characterTypes.map((type) => (
              <div
                key={type.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
                  <p className="text-sm text-gray-600">{type.catchphrase}</p>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {type.detailedTraits.slice(0, 2).map((trait, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 診断情報 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            診断について
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{metadata.totalQuestions}</div>
              <p className="text-gray-600">質問数</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">約5分</div>
              <p className="text-gray-600">所要時間</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">無料</div>
              <p className="text-gray-600">料金</p>
            </div>
          </div>
        </div>

        {/* 開始ボタン */}
        <div className="text-center">
          <Link
            href="/assessment"
            className="inline-block bg-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg shadow-lg hover:shadow-xl"
          >
            診断を開始する
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            診断は約5分で完了します。リラックスして、正直にお答えください。
          </p>
        </div>

        {/* 注意事項 */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">注意事項</h3>
          <ul className="text-sm text-yellow-700 space-y-2">
            <li>• 診断結果は参考情報であり、絶対的な判断ではありません</li>
            <li>• 各質問に対して、最も当てはまる選択肢を選んでください</li>
            <li>• 診断中はページを閉じないでください</li>
            <li>• 結果は匿名で保存され、個人情報は収集されません</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 