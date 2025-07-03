import React from 'react';

interface PremiumContentProps {
  content: any;
  isLocked: boolean;
  onUnlock?: () => void;
}

export default function PremiumContent({ content, isLocked, onUnlock }: PremiumContentProps) {
  if (!content) return null;
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl shadow p-6">
      <h3 className="text-xl font-bold text-yellow-700 mb-4">AI時代キャリア・スキル詳細（有料）</h3>
      {isLocked ? (
        <>
          <div className="text-gray-700 mb-2">この先は有料コンテンツです。</div>
          <ul className="list-disc pl-6 text-gray-500 mb-4">
            <li>AI時代の強み・弱み</li>
            <li>おすすめ業界・職種</li>
            <li>必須スキル・キャリアパス</li>
          </ul>
          <button
            onClick={onUnlock}
            className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow"
          >
            $5でアンロック（Stripe決済）
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-yellow-700 mb-1">AI時代の強み</h4>
            <p className="whitespace-pre-line text-gray-800">{content.ai_era_strengths}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-yellow-700 mb-1">AI時代の弱み</h4>
            <p className="whitespace-pre-line text-gray-800">{content.ai_era_weaknesses}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-yellow-700 mb-1">おすすめ業界・職種</h4>
            <p className="whitespace-pre-line text-gray-800">{content.industries}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-yellow-700 mb-1">必須スキル</h4>
            <p className="whitespace-pre-line text-gray-800">{content.basic_skills}</p>
            <p className="whitespace-pre-line text-gray-800 mt-1">{content.advanced_skills}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-yellow-700 mb-1">キャリアパス例</h4>
            <p className="whitespace-pre-line text-gray-800">{content.career_paths}</p>
          </div>
        </div>
      )}
    </div>
  );
} 