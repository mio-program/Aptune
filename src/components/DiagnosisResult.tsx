import React from 'react';
import { diagnosisTypes } from '../data/diagnosis-types';

interface DiagnosisResultProps {
  userType: string;
  isPremiumUnlocked: boolean;
  onUnlock: () => void;
}

const ShareButtons = () => (
  <div className="flex flex-wrap gap-4 justify-center mb-8">
    <button className="cyber-button energy-wave-trigger px-6 py-3 rounded-lg text-sm font-medium relative overflow-hidden">
      <div className="energy-wave"></div>
      Twitter
    </button>
    <button className="cyber-button energy-wave-trigger px-6 py-3 rounded-lg text-sm font-medium relative overflow-hidden">
      <div className="energy-wave"></div>
      Instagram
    </button>
    <button className="cyber-button energy-wave-trigger px-6 py-3 rounded-lg text-sm font-medium relative overflow-hidden">
      <div className="energy-wave"></div>
      Facebook
    </button>
    <button className="cyber-button energy-wave-trigger px-6 py-3 rounded-lg text-sm font-medium relative overflow-hidden">
      <div className="energy-wave"></div>
      LinkedIn
    </button>
    <button className="cyber-button energy-wave-trigger px-6 py-3 rounded-lg text-sm font-medium relative overflow-hidden">
      <div className="energy-wave"></div>
      メール
    </button>
  </div>
);

const UnlockAllButton = ({ onUnlock }: { onUnlock: () => void }) => (
  <div className="text-center mb-10">
    <button
      onClick={onUnlock}
      className="cyber-button-gold cyber-glow cyber-float px-10 py-5 rounded-xl text-xl font-bold energy-wave-trigger relative overflow-hidden"
      style={{ fontFamily: 'Orbitron, monospace' }}
    >
      <div className="energy-wave"></div>
      💎 すべての結果をアンロック - ¥500
    </button>
  </div>
);

const PremiumSection = ({ 
  title, 
  icon, 
  content, 
  isUnlocked, 
  onUnlock 
}: { 
  title: string; 
  icon: string; 
  content: string; 
  isUnlocked: boolean; 
  onUnlock: () => void; 
}) => (
  <div className={`premium-section rounded-xl p-8 relative ${isUnlocked ? 'cyber-card' : ''}`}>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-2xl font-bold cyber-text-glow flex items-center gap-3" style={{ fontFamily: 'Orbitron, monospace' }}>
        {icon} {title}
      </h3>
      {!isUnlocked && (
        <button
          onClick={onUnlock}
          className="cyber-button-gold px-6 py-3 rounded-lg text-sm font-bold energy-wave-trigger relative overflow-hidden"
        >
          <div className="energy-wave"></div>
          🔓 UNLOCK
        </button>
      )}
    </div>
    {isUnlocked ? (
      <div className="whitespace-pre-line text-gray-200 leading-relaxed text-lg overflow-visible" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '100%' }}>
        {content}
      </div>
    ) : (
      <div className="text-gray-400 glass-morph p-8 rounded-lg space-y-4" style={{ minHeight: '300px' }}>
        <div className="text-center mb-6">
          <div className="text-lg font-bold cyber-text-glow mb-2">🔒 プレミアム詳細分析</div>
          <div className="text-sm opacity-75">50項目以上の専門的洞察・具体的戦略・実践ガイド</div>
        </div>
        
        <div className="space-y-3 text-sm opacity-60 leading-relaxed">
          <div className="blur-sm">
            ■ 高度なAI時代適応戦略の詳細分析により、あなたの潜在能力を最大限に引き出すための具体的アプローチを提示します。
            ■ 50以上の専門的評価項目による多角的な人格分析
            ■ 業界特化型のキャリア戦略と成長ロードマップ
            ■ AI活用における競争優位性の具体的構築方法
          </div>
          <div className="blur-sm">
            ■ データ駆動型の意思決定プロセス最適化手法
            ■ 次世代リーダーシップスキルの段階的開発計画  
            ■ テクノロジー変化への戦略的対応フレームワーク
            ■ 個人ブランディング戦略の包括的ガイドライン
          </div>
          <div className="blur-sm">
            ■ 具体的な転職・昇進戦略とタイミング分析
            ■ ネットワーキング戦略と人脈構築の最適化
            ■ スキル投資のROI分析と優先順位付け
            ■ 長期キャリアビジョンの戦略的設計手法
          </div>
          <div className="blur-sm">
            ■ 業界動向分析に基づく先行投資戦略
            ■ パーソナルエフィシエンシーの科学的向上方法
            ■ ストレス管理と生産性最適化の実践テクニック
            ■ 継続的学習システムの構築ガイド
          </div>
        </div>
        
        <div className="text-center mt-6 p-4 bg-black bg-opacity-30 rounded-lg">
          <div className="text-xs opacity-50 mb-2">🎯 アンロック後に表示される内容</div>
          <div className="text-sm font-medium">• 詳細な分析レポート (8,000文字以上)</div>
          <div className="text-sm font-medium">• 実践的なアクションプラン</div>
          <div className="text-sm font-medium">• 専門家監修のキャリア戦略</div>
        </div>
      </div>
    )}
  </div>
);

export default function DiagnosisResult({ userType, isPremiumUnlocked, onUnlock }: DiagnosisResultProps) {
  console.log('DiagnosisResult props:', { userType, isPremiumUnlocked });
  
  const typeData = diagnosisTypes[userType];
  
  if (!typeData) {
    console.error('Type data not found for:', userType);
    return (
      <div className="cyber-card rounded-xl p-8 mb-10">
        <h2 className="text-3xl font-bold cyber-text-glow mb-6" style={{ fontFamily: 'Orbitron, monospace' }}>⚠️ 診断結果の取得に失敗しました</h2>
        <p className="text-gray-200 text-lg">
          診断タイプ「{userType}」のデータが見つかりません。
          もう一度診断を実行してください。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* シェアボタン */}
      <ShareButtons />
      
      {/* アンロールボタン */}
      {!isPremiumUnlocked && <UnlockAllButton onUnlock={onUnlock} />}
      
      {/* タイプ名とサブタイトル */}
      <div className="cyber-gradient rounded-xl p-10 text-center cyber-glow relative overflow-hidden">
        <div className="particles"></div>
        <h1 className="text-6xl font-black mb-2 cyber-title typing-effect" style={{ fontFamily: 'Orbitron, monospace' }}>{typeData.englishName}</h1>
        <h2 className="text-2xl opacity-85 cyber-text-gold font-medium mb-2">{typeData.name}</h2>
        <p className="text-xl opacity-95 cyber-text-gold font-semibold">{typeData.subtitle}</p>
      </div>

      {/* 無料コンテンツ */}
      <div className="cyber-card rounded-xl p-8 relative overflow-hidden">
        <h2 className="text-3xl font-bold cyber-text-glow mb-6" style={{ fontFamily: 'Orbitron, monospace' }}>🎯 あなたのタイプ特性</h2>
        <div className="whitespace-pre-line text-gray-200 leading-relaxed text-lg overflow-visible" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '100%' }}>
          {typeData.free_content.type_characteristics}
        </div>
      </div>

      <div className="cyber-card rounded-xl p-8 relative overflow-hidden">
        <h2 className="text-3xl font-bold cyber-text-glow mb-6" style={{ fontFamily: 'Orbitron, monospace' }}>🚀 成長トリガー</h2>
        <div className="whitespace-pre-line text-gray-200 leading-relaxed text-lg overflow-visible" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '100%' }}>
          {typeData.free_content.growth_triggers}
        </div>
      </div>

      <div className="cyber-card rounded-xl p-8 relative overflow-hidden">
        <h2 className="text-3xl font-bold cyber-text-glow mb-6" style={{ fontFamily: 'Orbitron, monospace' }}>🤝 人間関係の変化</h2>
        <div className="whitespace-pre-line text-gray-200 leading-relaxed text-lg overflow-visible" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '100%' }}>
          {typeData.free_content.relationship_changes}
        </div>
      </div>

      {/* プレミアムコンテンツセクション */}
      <div className="space-y-6">
        <h2 className="text-4xl font-black cyber-title text-center mb-10" style={{ fontFamily: 'Orbitron, monospace' }}>
          🔥 AI時代の詳細分析レポート
        </h2>
        
        <PremiumSection
          title="AI時代の詳細な強み分析"
          icon="📊"
          content={typeData.premium_content.ai_era_strengths}
          isUnlocked={isPremiumUnlocked}
          onUnlock={onUnlock}
        />
        
        <PremiumSection
          title="AI時代の弱み改善ガイド"
          icon="📈"
          content={typeData.premium_content.ai_era_weaknesses}
          isUnlocked={isPremiumUnlocked}
          onUnlock={onUnlock}
        />
        
        <PremiumSection
          title="活躍できる業界・職種"
          icon="🏢"
          content={typeData.premium_content.industries}
          isUnlocked={isPremiumUnlocked}
          onUnlock={onUnlock}
        />
        
        <PremiumSection
          title="学ぶべき基礎スキル"
          icon="📚"
          content={typeData.premium_content.basic_skills}
          isUnlocked={isPremiumUnlocked}
          onUnlock={onUnlock}
        />
        
        <PremiumSection
          title="学ぶべき応用スキル"
          icon="🚀"
          content={typeData.premium_content.advanced_skills}
          isUnlocked={isPremiumUnlocked}
          onUnlock={onUnlock}
        />
        
        <PremiumSection
          title="具体的キャリアパス"
          icon="💼"
          content={typeData.premium_content.career_paths}
          isUnlocked={isPremiumUnlocked}
          onUnlock={onUnlock}
        />
      </div>
    </div>
  );
} 