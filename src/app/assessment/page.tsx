'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentQuestions } from '../../data/assessment-questions';
import LikertScale from '../../components/ui/LikertScale';
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
  const handleSubmit = () => {
    setIsSubmitting(true);
    const result = calculateScores(answers);
    localStorage.setItem('innerlog_diagnostic_result', JSON.stringify({
      answers,
      result,
      timestamp: new Date().toISOString(),
    }));
    router.push('/assessment/results');
  };

  // プログレス
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">InnerLogキャリア診断</h1>
          <p className="text-gray-600">全{totalQuestions}問・6タイプ診断（1ページ6問）</p>
        </div>
        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-700 mb-1">
            <span>進捗: {answeredCount} / {totalQuestions}問</span>
            <span>{progress}% 完了</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        {/* 質問リスト */}
        <div className="space-y-8 mb-8">
          {pageQuestions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-lg shadow p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-lg font-bold text-blue-600">Q{currentPage * QUESTIONS_PER_PAGE + idx + 1}</span>
                <span className="text-base font-medium text-gray-900">{q.question}</span>
              </div>
              <LikertScale
                questionId={q.id}
                currentAnswer={answers[q.id] || null}
                onAnswerChange={handleAnswerChange}
                isDisabled={isSubmitting}
              />
              <div className="mt-2 text-xs text-gray-400">{q.category} / {q.measurement}</div>
            </div>
          ))}
        </div>
        {/* ナビゲーション */}
        <div className="flex justify-between items-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0 || isSubmitting}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${currentPage === 0 || isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            前へ
          </button>
          {currentPage < totalPages - 1 ? (
            <button
              onClick={handleNext}
              disabled={!isPageAnswered || isSubmitting}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${!isPageAnswered || isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              次へ
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isAllAnswered || isSubmitting}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${!isAllAnswered || isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
            >
              {isSubmitting ? '診断中...' : '診断結果を見る'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 