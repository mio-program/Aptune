'use client';

import React from 'react';

interface LikertScaleProps {
  questionId: string;
  currentAnswer: number | null;
  onAnswerChange: (questionId: string, answer: number) => void;
  isDisabled?: boolean;
}

const scaleLabels = ['非常に当てはまらない', 'やや当てはまらない', 'どちらともいえない', 'やや当てはまる', '非常に当てはまる'];

export default function LikertScale({
  questionId,
  currentAnswer,
  onAnswerChange,
  isDisabled = false
}: LikertScaleProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-8">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            disabled={isDisabled}
            onClick={() => onAnswerChange(questionId, value)}
            className={`
              w-14 h-14 rounded-full border-2 transition-all duration-400 relative overflow-hidden
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 cursor-pointer energy-wave-trigger'}
              ${currentAnswer === value 
                ? 'cyber-gradient border-orange-300 shadow-lg shadow-orange-500/60 cyber-glow' 
                : 'glass-morph border-gray-500 hover:border-orange-400'
              }
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50
            `}
            aria-label={scaleLabels[value - 1]}
          >
            {!isDisabled && <div className="energy-wave"></div>}
            {currentAnswer === value && (
              <div className="w-5 h-5 bg-white rounded-full mx-auto cyber-pulse" />
            )}
          </button>
        ))}
      </div>
      
      {/* ラベル表示 */}
      <div className="flex justify-between w-full max-w-2xl text-sm text-gray-300 font-medium">
        <span className="text-center">{scaleLabels[0]}</span>
        <span className="text-center">{scaleLabels[1]}</span>
        <span className="text-center">{scaleLabels[2]}</span>
        <span className="text-center">{scaleLabels[3]}</span>
        <span className="text-center">{scaleLabels[4]}</span>
      </div>
      
      {/* 現在の選択状態表示 */}
      {currentAnswer && (
        <div className="text-center glass-morph p-3 rounded-lg">
          <span className="cyber-text-glow font-bold text-lg" style={{ fontFamily: 'Orbitron, monospace' }}>
            選択中: {scaleLabels[currentAnswer - 1]}
          </span>
        </div>
      )}
    </div>
  );
} 