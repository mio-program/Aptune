export interface Question {
  id: string;
  question: string;
  category: string;
  measurement: string;
  weights: {
    FV: number;
    AT: number;
    VA: number;
    HC: number;
    MB: number;
    GS: number;
  };
}

export const assessmentQuestions: Question[] = [
  { id: "Q1", question: "AI時代における「強みの源泉」は、特定分野の専門性よりも、異領域統合による新価値創出にある", category: "AI時代適応・イノベーション志向", measurement: "開放性・統合思考", weights: { FV: 3, AT: 3, VA: 0, HC: 1, MB: 0, GS: 1 } },
  { id: "Q2", question: "新しいテクノロジーには、安定性確認より、いち早く試して活用法を模索したい", category: "AI時代適応・イノベーション志向", measurement: "新奇性探求", weights: { FV: 3, AT: 2, VA: 0, HC: 1, MB: 0, GS: 1 } },
  { id: "Q3", question: "プロジェクト変更は、安定回復よりも新方向性探求の機会として捉える", category: "AI時代適応・イノベーション志向", measurement: "変化適応性", weights: { FV: 3, AT: 1, VA: 0, HC: 0, MB: 0, GS: 2 } },
  { id: "Q4", question: "創造的アイデアを得るより、データ分析による論理的最適解を重視する", category: "AI時代適応・イノベーション志向", measurement: "分析vs創造", weights: { FV: 0, AT: 0, VA: 3, HC: 0, MB: 2, GS: 3 } },
  { id: "Q5", question: "AIツールに期待するのは効率化より、新しいインスピレーション獲得である", category: "AI時代適応・イノベーション志向", measurement: "AI活用観", weights: { FV: 3, AT: 3, VA: 0, HC: 1, MB: 0, GS: 0 } },
  { id: "Q6", question: "「独創的で新しい視点」と評価されることに強い喜びを感じる", category: "AI時代適応・イノベーション志向", measurement: "創造性動機", weights: { FV: 3, AT: 2, VA: 0, HC: 1, MB: 0, GS: 0 } },
  { id: "Q7", question: "複雑な課題では全体像把握を経て、段階的論理展開で解決を図る", category: "AI時代適応・イノベーション志向", measurement: "システム思考", weights: { FV: 0, AT: 1, VA: 3, HC: 0, MB: 2, GS: 3 } },
  { id: "Q8", question: "新概念に触れると、既存知識との関連付けによる理解を自然に行う", category: "AI時代適応・イノベーション志向", measurement: "統合学習", weights: { FV: 2, AT: 3, VA: 2, HC: 0, MB: 1, GS: 1 } },
  { id: "Q9", question: "抽象的アイデアより、具体的実現可能ソリューション創造に喜びを感じる", category: "実践・システム構築志向", measurement: "実践志向", weights: { FV: 0, AT: 0, VA: 1, HC: 0, MB: 3, GS: 2 } },
  { id: "Q10", question: "複雑業務プロセスの分析・効率的システム設計が自分の得意分野である", category: "実践・システム構築志向", measurement: "システム設計力", weights: { FV: 0, AT: 0, VA: 2, HC: 0, MB: 3, GS: 2 } },
  { id: "Q11", question: "細部への完璧なこだわりと信頼性の高い成果追求が性格的特徴である", category: "実践・システム構築志向", measurement: "完璧主義", weights: { FV: 0, AT: 0, VA: 3, HC: 0, MB: 3, GS: 1 } },
  { id: "Q12", question: "非効率プロセス発見・改善への関心が人一倍強い", category: "実践・システム構築志向", measurement: "改善志向", weights: { FV: 0, AT: 0, VA: 1, HC: 0, MB: 3, GS: 2 } },
  { id: "Q13", question: "新ツール導入時は革新性より安定性・実用性を最優先する", category: "実践・システム構築志向", measurement: "安定性重視", weights: { FV: 0, AT: 0, VA: 1, HC: 1, MB: 3, GS: 1 } },
  { id: "Q14", question: "作業手順の文書化・標準化の重要性を深く理解している", category: "実践・システム構築志向", measurement: "プロセス管理", weights: { FV: 0, AT: 0, VA: 2, HC: 0, MB: 3, GS: 2 } },
  { id: "Q15", question: "技術問題の根本原因特定まで決して諦めない粘り強さがある", category: "実践・システム構築志向", measurement: "問題解決執着", weights: { FV: 0, AT: 1, VA: 3, HC: 0, MB: 3, GS: 1 } },
  { id: "Q16", question: "長期持続・拡張可能なソリューション設計を常に心がけている", category: "実践・システム構築志向", measurement: "持続性思考", weights: { FV: 1, AT: 0, VA: 1, HC: 0, MB: 3, GS: 3 } },
  { id: "Q17", question: "チーム協働では効率より、メンバー関係性・協力体制構築を最重視する", category: "対人・協働・共感志向", measurement: "関係性重視", weights: { FV: 1, AT: 1, VA: 0, HC: 3, MB: 0, GS: 0 } },
  { id: "Q18", question: "個人成果より、チーム協力による大きな成果達成で充実感を得る", category: "対人・協働・共感志向", measurement: "集団成果志向", weights: { FV: 1, AT: 1, VA: 0, HC: 3, MB: 1, GS: 2 } },
  { id: "Q19", question: "他者の感情変化に敏感に気づき、自然に配慮できる共感能力がある", category: "対人・協働・共感志向", measurement: "共感性", weights: { FV: 1, AT: 1, VA: 0, HC: 3, MB: 0, GS: 0 } },
  { id: "Q20", question: "グループの中心的役割で人々をまとめることが多く、得意でもある", category: "対人・協働・共感志向", measurement: "リーダーシップ", weights: { FV: 1, AT: 0, VA: 0, HC: 2, MB: 1, GS: 3 } },
  { id: "Q21", question: "意見対立時は双方理解による調整役を担うことが自然である", category: "対人・協働・共感志向", measurement: "調整力", weights: { FV: 0, AT: 0, VA: 0, HC: 3, MB: 0, GS: 1 } },
  { id: "Q22", question: "多様意見のまとめ・合意形成プロセスが自分の得意分野である", category: "対人・協働・共感志向", measurement: "合意形成力", weights: { FV: 0, AT: 0, VA: 0, HC: 3, MB: 0, GS: 2 } },
  { id: "Q23", question: "個人成果より、チーム全体成功を常に優先する価値観を持つ", category: "対人・協働・共感志向", measurement: "利他性", weights: { FV: 0, AT: 1, VA: 0, HC: 3, MB: 0, GS: 1 } },
  { id: "Q24", question: "リーダーシップ発揮時は権威より信頼関係構築を重視する", category: "対人・協働・共感志向", measurement: "信頼型リーダー", weights: { FV: 1, AT: 0, VA: 0, HC: 3, MB: 0, GS: 2 } },
  { id: "Q25", question: "学習では体系的理論習得より、実践による必要時知識獲得を好む", category: "学習・探求・成長志向", measurement: "実践学習志向", weights: { FV: 3, AT: 2, VA: 0, HC: 1, MB: 1, GS: 0 } },
  { id: "Q26", question: "キャリア目標は専門特化より、多様経験による自分らしい価値創出である", category: "学習・探求・成長志向", measurement: "多様性志向", weights: { FV: 3, AT: 3, VA: 0, HC: 1, MB: 0, GS: 0 } },
  { id: "Q27", question: "知的好奇心満足・自己成長の内的充実感が学習継続の主動機である", category: "学習・探求・成長志向", measurement: "内発的学習動機", weights: { FV: 2, AT: 3, VA: 0, HC: 1, MB: 0, GS: 1 } },
  { id: "Q28", question: "常に新知識・スキル学習への意欲が旺盛で止まることがない", category: "学習・探求・成長志向", measurement: "継続学習欲求", weights: { FV: 1, AT: 3, VA: 1, HC: 0, MB: 0, GS: 1 } },
  { id: "Q29", question: "学習内容を他者に教えることで、自身の理解深化を実感している", category: "学習・探求・成長志向", measurement: "教授学習", weights: { FV: 1, AT: 3, VA: 0, HC: 2, MB: 0, GS: 0 } },
  { id: "Q30", question: "異分野専門家からの学びによる新視点獲得を特に重視する", category: "学習・探求・成長志向", measurement: "越境学習", weights: { FV: 2, AT: 3, VA: 1, HC: 1, MB: 0, GS: 1 } },
  { id: "Q31", question: "カリキュラムより興味に応じた自由な学習スタイルを好む", category: "学習・探求・成長志向", measurement: "自律学習", weights: { FV: 3, AT: 3, VA: 0, HC: 0, MB: 0, GS: 0 } },
  { id: "Q32", question: "理論理解と実践応用の両方を学習において等しく重視する", category: "学習・探求・成長志向", measurement: "統合学習", weights: { FV: 1, AT: 2, VA: 2, HC: 0, MB: 2, GS: 1 } },
  { id: "Q33", question: "計画立案とその着実実行プロセスに深い喜びを感じる", category: "戦略・価値観・働き方", measurement: "計画実行志向", weights: { FV: 0, AT: 0, VA: 1, HC: 0, MB: 3, GS: 3 } },
  { id: "Q34", question: "理想的働き方は安定より、柔軟で創造性発揮できる自由環境である", category: "戦略・価値観・働き方", measurement: "自由度重視", weights: { FV: 3, AT: 3, VA: 0, HC: 1, MB: 0, GS: 0 } },
  { id: "Q35", question: "自分の強みは論理性・効率性より、創造性・共感力・適応力である", category: "戦略・価値観・働き方", measurement: "ソフトスキル重視", weights: { FV: 3, AT: 2, VA: 0, HC: 3, MB: 0, GS: 0 } },
  { id: "Q36", question: "AIは脅威でなく、新可能性を広げるチャンスと積極的に捉える", category: "戦略・価値観・働き方", measurement: "AI楽観主義", weights: { FV: 3, AT: 3, VA: 1, HC: 0, MB: 1, GS: 2 } },
  { id: "Q37", question: "仕事では安定性より成長・挑戦機会を重視する価値観である", category: "戦略・価値観・働き方", measurement: "成長志向", weights: { FV: 3, AT: 3, VA: 0, HC: 0, MB: 0, GS: 2 } },
  { id: "Q38", question: "組織内で改革・変革推進役を担うことが多く、得意でもある", category: "戦略・価値観・働き方", measurement: "変革推進力", weights: { FV: 3, AT: 1, VA: 0, HC: 0, MB: 0, GS: 3 } },
  { id: "Q39", question: "長期ビジョン描画とその実現戦略立案が自分の得意分野である", category: "戦略・価値観・働き方", measurement: "戦略思考", weights: { FV: 1, AT: 0, VA: 1, HC: 0, MB: 0, GS: 3 } },
  { id: "Q40", question: "効率性と品質の最適バランス追求・実現を常に重視している", category: "戦略・価値観・働き方", measurement: "バランス志向", weights: { FV: 0, AT: 0, VA: 2, HC: 0, MB: 3, GS: 3 } },
  { id: "Q41", question: "AI導入では業務効率化より、新ビジネスモデル・サービス創出を重視", category: "AI協働・未来適応", measurement: "AI革新志向", weights: { FV: 3, AT: 2, VA: 0, HC: 0, MB: 0, GS: 2 } },
  { id: "Q42", question: "AI影響は部分自動化でなく、根本変革による新職種創出と予測する", category: "AI協働・未来適応", measurement: "AI変革認識", weights: { FV: 3, AT: 2, VA: 1, HC: 0, MB: 0, GS: 2 } },
  { id: "Q43", question: "AI学習では体系的コースより最新論文・テックブログを好む", category: "AI協働・未来適応", measurement: "最新情報志向", weights: { FV: 2, AT: 3, VA: 1, HC: 0, MB: 0, GS: 1 } },
  { id: "Q44", question: "AI-人間協働で重要なのは効率分業より、創造性刺激による新発想", category: "AI協働・未来適応", measurement: "創造協働志向", weights: { FV: 3, AT: 2, VA: 0, HC: 2, MB: 0, GS: 0 } },
  { id: "Q45", question: "AI倫理問題への関心度・重要性認識が非常に高い", category: "AI協働・未来適応", measurement: "AI倫理意識", weights: { FV: 1, AT: 2, VA: 2, HC: 3, MB: 1, GS: 1 } },
  { id: "Q46", question: "複雑情報の整理・要点明確化作業に深い満足感を得る", category: "AI協働・未来適応", measurement: "情報整理志向", weights: { FV: 0, AT: 2, VA: 3, HC: 0, MB: 2, GS: 1 } }
]; 