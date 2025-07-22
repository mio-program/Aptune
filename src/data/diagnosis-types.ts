export interface DiagnosisTypeContent {
  type_characteristics: string;
  growth_triggers: string;
  relationship_changes: string;
}

export interface DiagnosisTypePremiumContent {
  ai_era_strengths: string;
  ai_era_weaknesses: string;
  industries: string;
  basic_skills: string;
  advanced_skills: string;
  career_paths: string;
}

export interface DiagnosisType {
  id: string;
  name: string;
  englishName: string;
  subtitle: string;
  free_content: DiagnosisTypeContent;
  premium_content: DiagnosisTypePremiumContent;
}

export const diagnosisTypes: { [key: string]: DiagnosisType } = {
  FV: {
    id: 'FV',
    name: 'フューチャー・ビジョナリー',
    englishName: 'FUTURE VISIONARY',
    subtitle: 'AI駆動型イノベーター',
    free_content: {
      type_characteristics: '「未来を描く創造者」\n\nあなたは、まだ誰も見たことのない未来を夢想し、それを形にすることに情熱を燃やす、生まれながらのイノベーターです...',
      growth_triggers: 'あなたの成長は「前例のない挑戦」によって最も加速されます...',
      relationship_changes: '・AIは「創造的共犯者」：あなたはAIを単なるツールではなく...'
    },
    premium_content: {
      ai_era_strengths: 'あなたの強みは「AI支援による創造性の指数的拡張」です...',
      ai_era_weaknesses: 'あなたの弱みは「新奇性への過度の傾倒と継続性の課題」にあります...',
      industries: '• テック・スタートアップ：AIプロダクト開発・新規事業創出...',
      basic_skills: '• プロンプトエンジニアリング：AI対話の最適化技術...',
      advanced_skills: '• 生成AI×業界特化応用：特定分野での深い活用...',
      career_paths: '• AIプロダクトマネージャー（0→1特化）：新規AIプロダクトの企画・開発リード...'
    }
  },
  VA: {
    id: 'VA',
    name: 'ヴォイド・アナリスト',
    englishName: 'VOID ANALYST',
    subtitle: 'データ駆動型探究者',
    free_content: {
      type_characteristics: '「虚空から真実を掴む探偵」\n\nあなたは複雑な事象から論理とデータで真実を見つけ出す分析の専門家です...',
      growth_triggers: 'あなたの成長は「未知のパターン発見」によって促進されます...',
      relationship_changes: '・AIは「最強の分析アシスタント」：あなたはAIを高度な分析ツールとして活用し...'
    },
    premium_content: {
      ai_era_strengths: 'あなたの強みは「AI分析ツールを駆使した高度なデータ解釈・予測」です...',
      ai_era_weaknesses: 'あなたの弱みは「分析過多による行動の遅れ」にあります...',
      industries: '• データサイエンス：ビッグデータ解析・AI予測モデル開発...',
      basic_skills: '• 統計解析・データ可視化：AI/BIツール活用...',
      advanced_skills: '• 機械学習モデル設計・評価：AIアルゴリズムの深い理解...',
      career_paths: '• データサイエンティスト：AI/データ活用戦略の立案・実装...'
    }
  },
  HC: {
    id: 'HC',
    name: 'ハーモニー・コーディネーター',
    englishName: 'HARMONY COORDINATOR',
    subtitle: '共感型チームビルダー',
    free_content: {
      type_characteristics: '「心と心を紡ぐ調整者」\n\nあなたは人と人をつなぎ、チームの調和を生み出す共感力の達人です...',
      growth_triggers: 'あなたの成長は「多様な価値観の橋渡し」によって促進されます...',
      relationship_changes: '・AIは「温かいチームメイト」：あなたはAIを人間関係の潤滑油として活用し...'
    },
    premium_content: {
      ai_era_strengths: 'あなたの強みは「AI時代でも不可欠な人間関係構築・チーム統合力」です...',
      ai_era_weaknesses: 'あなたの弱みは「共感過多による自己犠牲」にあります...',
      industries: '• 組織開発・人材育成：AI活用型チームビルディング...',
      basic_skills: '• ファシリテーション・コーチング：AI支援型コミュニケーション...',
      advanced_skills: '• 組織心理学・AIピープルアナリティクス：人間×AI協働の最適化...',
      career_paths: '• 組織開発コンサルタント：AI時代の人材・組織変革リード...'
    }
  },
  MB: {
    id: 'MB',
    name: 'マトリクス・ビルダー',
    englishName: 'MATRIX BUILDER',
    subtitle: '実践型システム構築者',
    free_content: {
      type_characteristics: '「現実を支える建築家」\n\nあなたは抽象的なアイデアを具体的なシステムに落とし込む実践的構築者です...',
      growth_triggers: 'あなたの成長は「現場課題の着実な解決」によって促進されます...',
      relationship_changes: '・AIは「究極の自動化ツールキット」：あなたはAIを業務効率化のパートナーとして活用し...'
    },
    premium_content: {
      ai_era_strengths: 'あなたの強みは「AIを活用した業務自動化・プロセス最適化」です...',
      ai_era_weaknesses: 'あなたの弱みは「安定志向による変化対応の遅れ」にあります...',
      industries: '• システム開発・業務改善：AI自動化・RPA導入...',
      basic_skills: '• プロセス設計・業務フロー分析：AIツール連携...',
      advanced_skills: '• RPA/AIシステム構築：現場実装力...',
      career_paths: '• オペレーションマネージャー：AI活用現場改革リーダー...'
    }
  },
  AT: {
    id: 'AT',
    name: 'アカシック・トラベラー',
    englishName: 'AKASHIC TRAVELER',
    subtitle: '知的好奇心型ラーナー',
    free_content: {
      type_characteristics: '「宇宙の記憶を旅する探求者」\n\nあなたは尽きない知的好奇心で広大な知識の海を旅する学習者です...',
      growth_triggers: 'あなたの成長は「未知領域への挑戦」によって促進されます...',
      relationship_changes: '・AIは「無限の知識を与える賢者」：あなたはAIを知識探索のガイドとして活用し...'
    },
    premium_content: {
      ai_era_strengths: 'あなたの強みは「AI時代の膨大な情報を効率的に習得・活用する力」です...',
      ai_era_weaknesses: 'あなたの弱みは「好奇心の拡散による集中力低下」にあります...',
      industries: '• 教育・研究・ナレッジワーク：AI知識活用・教育イノベーション...',
      basic_skills: '• 情報収集・リサーチ：AI検索・要約活用...',
      advanced_skills: '• AIリテラシー・知識統合：分野横断的応用...',
      career_paths: '• リサーチャー/教育者：AI時代の知識伝達・創造...'
    }
  },
  GS: {
    id: 'GS',
    name: 'グランド・ストラテジスト',
    englishName: 'GRAND STRATEGIST',
    subtitle: '戦略型ビジョナリー',
    free_content: {
      type_characteristics: '「成功を導く戦略家」\n\nあなたは盤面全体を俯瞰し勝利から逆算して最適手を見つける天性のストラテジストです...',
      growth_triggers: 'あなたの成長は「長期ビジョンの具体化」によって促進されます...',
      relationship_changes: '・AIは「最強の戦略シミュレーションツール」：あなたはAIを意思決定の参謀として活用し...'
    },
    premium_content: {
      ai_era_strengths: 'あなたの強みは「AI活用による戦略立案・意思決定の高度化」です...',
      ai_era_weaknesses: 'あなたの弱みは「全体最適志向による現場感覚の希薄化」にあります...',
      industries: '• 経営戦略・事業開発：AI活用型経営・新規事業推進...',
      basic_skills: '• 戦略立案・意思決定プロセス：AIシミュレーション活用...',
      advanced_skills: '• AI経営分析・事業戦略設計：全体俯瞰力...',
      career_paths: '• 経営企画/事業開発マネージャー：AI時代の事業推進リーダー...'
    }
  }
}; 