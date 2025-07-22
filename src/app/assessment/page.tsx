'use client'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentQuestions } from '../../data/assessment-questions';
import LikertScale from '../../components/ui/LikertScale';
import ParticleEffect from '../../components/ParticleEffect';
import { calculateScores } from '../../lib/innerlog-engine';

const QUESTIONS_PER_PAGE = 6;

export default function AssessmentPage() {
  const router = useRouter();
  const questions = assessmentQuestions;
  const totalQuestions = questions.length;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);

  const [currentPage, setCurrentPage] = useState(0); // 0-indexed
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ページごとの質問を取得
  const pageQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  // 回答変更
  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // ページ内すべて回答済みか
  const isPageAnswered = pageQuestions.every((q) => answers[q.id] !== undefined);
  // 全問回答済みか
  const isAllAnswered = questions.every((q) => answers[q.id] !== undefined);

  // 次へ
  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  // 前へ
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // 診断実行
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const result = calculateScores(answers);
      
      // データ検証
      if (!result || !result.primaryType) {
        throw new Error('診断結果の計算に失敗しました');
      }
      
      const resultData = {
        answers,
        result,
        timestamp: new Date().toISOString(),
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('innerlog_diagnostic_result', JSON.stringify(resultData));
      }
      
      // 少し待ってからリダイレクト（UX向上）
      setTimeout(() => {
        router.push('/assessment/results');
      }, 1000);
      
    } catch (error) {
      console.error('Assessment submission error:', error);
      setIsSubmitting(false);
      alert('診断結果の処理中にエラーが発生しました。もう一度お試しください。');
    }
  };

  // プログレス
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-black">
      <ParticleEffect />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-10 text-center">
          <h1 className="text-6xl font-black cyber-title mb-6 typing-effect" style={{ fontFamily: 'Orbitron, monospace' }}>🔥 InnerLog AI診断</h1>
          <p className="text-gray-200 text-xl cyber-text-gold">AI時代の最強キャリア分析 - 全{totalQuestions}問・6タイプ診断</p>
        </div>
        
        {/* プログレスバー */}
        <div className="mb-10">
          <div className="flex justify-between text-lg font-semibold text-gray-200 mb-3">
            <span className="cyber-text-gold" style={{ fontFamily: 'Orbitron, monospace' }}>進捗: {answeredCount} / {totalQuestions}問</span>
            <span className="cyber-text-glow" style={{ fontFamily: 'Orbitron, monospace' }}>{progress}% 完了</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4 border border-gray-600 glass-morph">
            <div 
              className="cyber-gradient h-4 rounded-full transition-all duration-700 cyber-glow" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* 質問リスト */}
        <div className="space-y-12 mb-12">
          {pageQuestions.map((q, idx) => (
            <div key={q.id} className="cyber-card rounded-xl p-10 relative overflow-hidden energy-wave-trigger">
              <div className="energy-wave"></div>
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-black cyber-text-glow" style={{ fontFamily: 'Orbitron, monospace' }}>
                    Q{currentPage * QUESTIONS_PER_PAGE + idx + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-medium text-gray-100 leading-relaxed">
                  {q.question}
                </h3>
              </div>
              
              <LikertScale
                questionId={q.id}
                currentAnswer={answers[q.id] || null}
                onAnswerChange={handleAnswerChange}
                isDisabled={isSubmitting}
              />
            </div>
          ))}
        </div>
        {/* ナビゲーション */}
        <div className="flex justify-between items-center gap-6 mt-12">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0 || isSubmitting}
            className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
              currentPage === 0 || isSubmitting 
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700' 
                : 'cyber-card text-gray-300 hover:cyber-text-glow hover:scale-105'
            }`}
          >
            ← 前へ
          </button>
          
          <div className="text-center">
            <div className="text-gray-300 text-lg mb-2 font-semibold" style={{ fontFamily: 'Orbitron, monospace' }}>
              ページ {currentPage + 1} / {totalPages}
            </div>
            <div className="flex gap-3">
              {Array.from({ length: totalPages }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    i === currentPage ? 'cyber-gradient cyber-glow' : 'bg-gray-600 border border-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {currentPage < totalPages - 1 ? (
            <button
              onClick={handleNext}
              disabled={!isPageAnswered || isSubmitting}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                !isPageAnswered || isSubmitting 
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700' 
                  : 'cyber-button hover:scale-105 cyber-glow'
              }`}
            >
              次へ →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isAllAnswered || isSubmitting}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                !isAllAnswered || isSubmitting 
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700' 
                  : 'cyber-button-gold hover:scale-105 cyber-glow cyber-pulse'
              }`}
            >
              {isSubmitting ? '🔄 AI分析中...' : '🚀 診断結果を見る'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 