'use client';

import React from 'react';

interface LikertScaleProps {
  questionId: string;
  currentAnswer: number | null;
  onAnswerChange: (questionId: string, answer: number) => void;
  isDisabled?: boolean;
}

const scaleSizes = [20, 28, 36, 28, 20]; // 1〜5の○の大きさ
const scaleLabels = ['全く当てはまらない', '', 'どちらともいえない', '', '非常に当てはまる'];

export default function LikertScale({
  questionId,
  currentAnswer,
  onAnswerChange,
  isDisabled = false
}: LikertScaleProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-6">
        {[1, 2, 3, 4, 5].map((value, idx) => (
          <button
            key={value}
            type="button"
            disabled={isDisabled}
            onClick={() => onAnswerChange(questionId, value)}
            className={`focus:outline-none transition-transform duration-150 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'} ${currentAnswer === value ? 'ring-2 ring-blue-500' : ''}`}
            style={{ width: scaleSizes[idx], height: scaleSizes[idx], borderRadius: '50%', border: '2px solid #3b82f6', background: currentAnswer === value ? '#3b82f6' : '#fff' }}
            aria-label={scaleLabels[idx]}
          >
            {/* 空白ラベルは非表示 */}
          </button>
        ))}
      </div>
      <div className="flex justify-between w-full mt-2 text-xs text-gray-500">
        <span>{scaleLabels[0]}</span>
        <span>{scaleLabels[2]}</span>
        <span>{scaleLabels[4]}</span>
      </div>
    </div>
  );
} 