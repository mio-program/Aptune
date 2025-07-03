'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PremiumUnlockedPage() {
  const router = useRouter();
  useEffect(() => {
    // 仮unlock: localStorageに保存
    localStorage.setItem('innerlog_premium_unlocked', '1');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-blue-100">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">有料コンテンツが解放されました！</h1>
        <p className="text-gray-700 mb-6">AI時代キャリアの詳細診断結果がご覧いただけます。</p>
        <button
          onClick={() => router.push('/assessment/results')}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          診断結果ページへ戻る
        </button>
      </div>
    </div>
  );
} 