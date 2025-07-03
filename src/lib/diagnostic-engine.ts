import diagnosticData from '../data/innerlog-diagnostic-system.json';

export interface DiagnosticResult {
  characterType: {
    id: string;
    name: string;
    catchphrase: string;
    description: string;
    aiEraStrength: string;
    detailedTraits: string[];
    careerPaths: string[];
    color: string;
    icon: string;
  };
  scores: {
    [key: string]: number;
  };
  percentages: {
    [key: string]: number;
  };
  confidence: number;
  reliabilityScore: number;
  topTraits: string[];
  recommendations: string[];
}

export interface Question {
  id: string;
  text: string;
  category: string;
  weight: number;
  characterTypeMapping: {
    [key: string]: number;
  };
}

export interface CharacterType {
  id: string;
  name: string;
  catchphrase: string;
  description: string;
  aiEraStrength: string;
  detailedTraits: string[];
  careerPaths: string[];
  color: string;
  icon: string;
}

export class DiagnosticEngine {
  private data: any;
  private questions: Question[];
  private characterTypes: CharacterType[];

  constructor() {
    this.data = diagnosticData;
    this.questions = this.data.questions;
    this.characterTypes = this.data.characterTypes;
  }

  // 回答を数値にマッピング
  private mapAnswerToScore(answer: number): number {
    const mapping = this.data.calculationLogic.answerMapping;
    return mapping[answer.toString()] || 0;
  }

  // 各キャラクタータイプのスコアを計算
  private calculateScores(answers: { [key: string]: number }): { [key: string]: number } {
    const scores: { [key: string]: number } = {};
    
    // 初期化
    this.characterTypes.forEach(type => {
      scores[type.id] = 0;
    });

    // 各質問の回答を処理
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = this.questions.find(q => q.id === questionId);
      if (!question) return;

      const score = this.mapAnswerToScore(answer);
      
      // 各キャラクタータイプに重み付きスコアを加算
      Object.entries(question.characterTypeMapping).forEach(([typeId, weight]) => {
        if (scores[typeId] !== undefined) {
          scores[typeId] += score * weight * question.weight;
        }
      });
    });

    return scores;
  }

  // パーセンテージを計算
  private calculatePercentages(scores: { [key: string]: number }): { [key: string]: number } {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + Math.abs(score), 0);
    const percentages: { [key: string]: number } = {};

    if (totalScore === 0) {
      // 全スコアが0の場合は均等配分
      const equalPercentage = 100 / this.characterTypes.length;
      this.characterTypes.forEach(type => {
        percentages[type.id] = equalPercentage;
      });
    } else {
      // 正規化してパーセンテージを計算
      this.characterTypes.forEach(type => {
        const normalizedScore = Math.max(0, scores[type.id]);
        percentages[type.id] = (normalizedScore / totalScore) * 100;
      });
    }

    return percentages;
  }

  // 信頼性スコアを計算
  private calculateReliabilityScore(answers: { [key: string]: number }): number {
    const totalQuestions = Object.keys(answers).length;
    const expectedQuestions = this.data.metadata.totalQuestions;
    
    // 回答完了率
    const completionRate = totalQuestions / expectedQuestions;
    
    // 回答の一貫性（極端な回答の割合）
    const extremeAnswers = Object.values(answers).filter(answer => answer === 1 || answer === 5).length;
    const consistencyScore = 1 - (extremeAnswers / totalQuestions);
    
    // 総合信頼性スコア
    const reliabilityScore = (completionRate * 0.7) + (consistencyScore * 0.3);
    
    return Math.round(reliabilityScore * 100);
  }

  // 信頼度を計算
  private calculateConfidence(reliabilityScore: number): number {
    if (reliabilityScore >= 90) return 0.95;
    if (reliabilityScore >= 80) return 0.85;
    if (reliabilityScore >= 70) return 0.75;
    if (reliabilityScore >= 60) return 0.65;
    return 0.55;
  }

  // トップ特性を抽出
  private getTopTraits(characterType: CharacterType): string[] {
    return characterType.detailedTraits.slice(0, 3);
  }

  // 推奨事項を生成
  private generateRecommendations(characterType: CharacterType): string[] {
    const recommendations = [
      `${characterType.name}としての強みを活かしたキャリアパスを検討しましょう`,
      `AI時代において${characterType.aiEraStrength}を意識したスキル開発を行いましょう`,
      `${characterType.detailedTraits.join('、')}の特性をさらに磨くことで、より大きな価値を生み出せます`
    ];
    return recommendations;
  }

  // メイン診断実行メソッド
  public diagnose(answers: { [key: string]: number }): DiagnosticResult {
    // スコア計算
    const scores = this.calculateScores(answers);
    
    // パーセンテージ計算
    const percentages = this.calculatePercentages(scores);
    
    // 信頼性スコア計算
    const reliabilityScore = this.calculateReliabilityScore(answers);
    
    // 信頼度計算
    const confidence = this.calculateConfidence(reliabilityScore);
    
    // 最も高いスコアのキャラクタータイプを特定
    const topTypeId = Object.entries(percentages).reduce((a, b) => 
      percentages[a[0]] > percentages[b[0]] ? a : b
    )[0];
    
    const characterType = this.characterTypes.find(type => type.id === topTypeId)!;
    
    // トップ特性と推奨事項を取得
    const topTraits = this.getTopTraits(characterType);
    const recommendations = this.generateRecommendations(characterType);

    return {
      characterType,
      scores,
      percentages,
      confidence,
      reliabilityScore,
      topTraits,
      recommendations
    };
  }

  // 質問リストを取得
  public getQuestions(): Question[] {
    return this.questions;
  }

  // キャラクタータイプリストを取得
  public getCharacterTypes(): CharacterType[] {
    return this.characterTypes;
  }

  // レスポンスラベルを取得
  public getResponseLabels(): { [key: string]: string } {
    return this.data.responseLabels;
  }

  // メタデータを取得
  public getMetadata(): any {
    return this.data.metadata;
  }
} 