'use client'

import React from 'react'

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  amount: number
}

export default function PaymentModal({ open, onClose, amount }: PaymentModalProps) {
  if (!open) return null

  const handlePayment = () => {
    // Stripe決済の実装予定
    console.log('Processing payment for amount:', amount)
    alert(`¥${amount * 100}の決済を処理しています...`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="cyber-card rounded-2xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
        >
          ×
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold cyber-text-glow mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
            💎 プレミアムアンロック
          </h2>
          
          <div className="mb-6">
            <div className="text-4xl font-black cyber-text-gold mb-2">
              ¥{amount * 100}
            </div>
            <p className="text-gray-300">
              すべての詳細分析結果をアンロック
            </p>
          </div>

          <div className="space-y-4 mb-6 text-left">
            <div className="flex items-center gap-3">
              <div className="text-green-400">✓</div>
              <span className="text-gray-200">AI時代の詳細強み分析</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-green-400">✓</div>
              <span className="text-gray-200">弱み改善の具体的ガイド</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-green-400">✓</div>
              <span className="text-gray-200">活躍できる業界・職種分析</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-green-400">✓</div>
              <span className="text-gray-200">学習すべきスキル・キャリアパス</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handlePayment}
              className="flex-1 cyber-button-gold py-3 px-6 rounded-lg font-bold"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              今すぐ購入
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 