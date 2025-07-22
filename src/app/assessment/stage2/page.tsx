'use client';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { stage2Questions } from '@/data/assessment-questions';
import { useAuth } from '@/contexts/AuthContext';

export default function Stage2Page() {
  const router = useRouter();
  const { user } = useAuth();
  const [stage1Result, setStage1Result] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 認証チェックを一時的に無効化
    // if (!user) {
    //   router.push('/auth?redirect=/assessment/stage2&message=詳細診断には会員登録が必要です');
    //   return;
    // }
    
    // Stage1結果をローカルストレージから取得
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('stage1_result');
    if (saved) {
      setStage1Result(JSON.parse(saved));
    } else {
      setError('Stage1の結果が見つかりません。最初からやり直してください。');
    }
    setIsLoading(false);
  }, [user, router]);

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < stage2Questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/assessment/submit/stage2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage1Result, answers }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '送信に失敗しました。');
      }
      const data = await response.json();
      router.push(`/assessment/stage2/result?assessmentId=${data.assessmentId}`);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const progress = Math.round(((currentQuestionIndex + 1) / stage2Questions.length) * 100);
  const currentQuestion = stage2Questions[currentQuestionIndex];

  if (isLoading) return <div className="container mx-auto px-4 py-12 text-center">読み込み中...</div>;
  if (error) return <div className="container mx-auto px-4 py-12 text-center text-red-500">{error}</div>;
  if (!stage1Result) return <div className="container mx-auto px-4 py-12 text-center">Stage1の結果が見つかりません。</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-center">詳細診断 (Stage 2)</h1>
      <p className="text-center text-gray-600 mb-8">より深くあなたを理解するための60の質問です。</p>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        <p className="text-sm text-center mt-2">進捗: {currentQuestionIndex + 1} / {stage2Questions.length}</p>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">{`質問 ${currentQuestionIndex + 1}: ${currentQuestion.text}`}</h2>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-2 px-2">
            <span>{currentQuestion.options.scale.min_label}</span>
            <span>{currentQuestion.options.scale.max_label}</span>
        </div>
        <div className="flex justify-around">
          {[1, 2, 3, 4, 5].map(value => (
            <button
              key={value}
              onClick={() => handleAnswer(currentQuestion.id, value)}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                answers[currentQuestion.id] === value
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-blue-500 border-blue-500 hover:bg-blue-100'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="text-center mt-8">
        {currentQuestionIndex < stage2Questions.length - 1 ? (
          <button onClick={handleNext} disabled={!answers[currentQuestion.id]} className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
            次の質問へ
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={isSubmitting || Object.keys(answers).length < stage2Questions.length} className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400">
            {isSubmitting ? '送信中...' : '結果を見る'}
          </button>
        )}
      </div>
    </div>
  );
} 