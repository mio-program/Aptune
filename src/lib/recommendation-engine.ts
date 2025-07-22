// AI駆動レコメンデーションエンジン
// ユーザーの診断タイプ、学習履歴、目標に基づく高精度コンテンツ推薦

import { CollectedContent, ContentFilter } from './content-collector'

export interface UserProfile {
  diagnosisType: string // FV, VA, HC, MB, AT, GS
  industry: string
  jobRole: string
  experienceLevel: 'beginner' | 'intermediate' | 'advanced'
  learningGoals: string[]
  preferredContentTypes: string[]
  dailyLearningTime: number
  completedContent: string[]
  learningHistory: LearningHistoryItem[]
  engagementMetrics: UserEngagementMetrics
}

export interface LearningHistoryItem {
  contentId: string
  startedAt: string
  completedAt?: string
  progressPercentage: number
  timeSpent: number // minutes
  userRating?: number // 1-5
  userFeedback?: string
}

export interface UserEngagementMetrics {
  averageCompletionRate: number
  preferredDuration: number // minutes
  preferredDifficulty: 'beginner' | 'intermediate' | 'advanced'
  mostEngagedCategories: string[]
  learningStreak: number // days
  lastActiveDate: string
}

export interface RecommendationScore {
  contentId: string
  score: number
  reasoning: string[]
  recommendationType: 'type_based' | 'behavior_based' | 'trending' | 'collaborative'
  confidence: number
}

export interface RecommendationResult {
  content: CollectedContent
  score: RecommendationScore
  explanations: string[]
}

export class RecommendationEngine {
  private typeWeights = {
    // 各診断タイプの学習傾向重み
    FV: { // Future Visionary
      innovation: 0.9,
      trends: 0.8,
      creativity: 0.9,
      leadership: 0.7,
      technical: 0.6
    },
    VA: { // Void Analyst
      analysis: 0.9,
      data: 0.9,
      research: 0.8,
      technical: 0.8,
      theory: 0.7
    },
    HC: { // Harmony Coordinator
      collaboration: 0.9,
      communication: 0.8,
      management: 0.8,
      psychology: 0.7,
      ethics: 0.8
    },
    MB: { // Matrix Builder
      implementation: 0.9,
      systems: 0.8,
      automation: 0.8,
      processes: 0.8,
      practical: 0.9
    },
    AT: { // Akashic Traveler
      learning: 0.9,
      knowledge: 0.8,
      exploration: 0.8,
      theory: 0.8,
      broad: 0.9
    },
    GS: { // Grand Strategist
      strategy: 0.9,
      planning: 0.8,
      business: 0.8,
      leadership: 0.8,
      vision: 0.8
    }
  }

  // メインレコメンデーション関数
  generateRecommendations(
    userProfile: UserProfile,
    availableContent: CollectedContent[],
    maxRecommendations: number = 20
  ): RecommendationResult[] {
    const recommendations: RecommendationResult[] = []

    for (const content of availableContent) {
      // 既に完了したコンテンツをスキップ
      if (userProfile.completedContent.includes(content.id)) {
        continue
      }

      const score = this.calculateRecommendationScore(userProfile, content)
      
      if (score.score > 0.3) { // 最低スコア閾値
        recommendations.push({
          content,
          score,
          explanations: this.generateExplanations(userProfile, content, score)
        })
      }
    }

    // スコア順でソート
    recommendations.sort((a, b) => b.score.score - a.score.score)

    // 多様性を考慮した選択
    return this.diversifyRecommendations(recommendations, maxRecommendations)
  }

  // レコメンデーションスコア計算
  private calculateRecommendationScore(
    userProfile: UserProfile,
    content: CollectedContent
  ): RecommendationScore {
    let totalScore = 0
    const reasoning: string[] = []
    let recommendationType: RecommendationScore['recommendationType'] = 'type_based'

    // 1. 診断タイプベースのスコア (40%)
    const typeScore = this.calculateTypeBasedScore(userProfile, content)
    totalScore += typeScore * 0.4
    if (typeScore > 0.6) {
      reasoning.push(`${userProfile.diagnosisType}タイプに最適化された内容`)
    }

    // 2. 個人の学習履歴ベースのスコア (30%)
    const behaviorScore = this.calculateBehaviorBasedScore(userProfile, content)
    totalScore += behaviorScore * 0.3
    if (behaviorScore > 0.6) {
      reasoning.push('あなたの学習パターンに合致')
      recommendationType = 'behavior_based'
    }

    // 3. コンテンツ品質スコア (20%)
    const qualityScore = content.qualityMetrics.overallScore
    totalScore += qualityScore * 0.2
    if (qualityScore > 0.8) {
      reasoning.push('高品質コンテンツ')
    }

    // 4. 個人設定との適合性 (10%)
    const preferenceScore = this.calculatePreferenceScore(userProfile, content)
    totalScore += preferenceScore * 0.1
    if (preferenceScore > 0.8) {
      reasoning.push('あなたの設定に最適')
    }

    // トレンド要素の加味
    const trendingBonus = this.calculateTrendingBonus(content)
    if (trendingBonus > 0) {
      totalScore += trendingBonus * 0.05
      reasoning.push('注目のトレンドコンテンツ')
      recommendationType = 'trending'
    }

    // 協調フィルタリング要素
    const collaborativeScore = this.calculateCollaborativeScore(userProfile, content)
    if (collaborativeScore > 0) {
      totalScore += collaborativeScore * 0.05
      reasoning.push('同じタイプのユーザーに人気')
      recommendationType = 'collaborative'
    }

    const confidence = Math.min(
      (reasoning.length / 3) * 
      (userProfile.learningHistory.length > 10 ? 1 : userProfile.learningHistory.length / 10),
      1
    )

    return {
      contentId: content.id,
      score: Math.min(totalScore, 1),
      reasoning,
      recommendationType,
      confidence
    }
  }

  // 診断タイプベーススコア計算
  private calculateTypeBasedScore(userProfile: UserProfile, content: CollectedContent): number {
    const typeWeights = this.typeWeights[userProfile.diagnosisType as keyof typeof this.typeWeights]
    if (!typeWeights) return 0.5

    let score = 0
    const title = content.title.toLowerCase()
    const description = content.description.toLowerCase()
    const tags = content.tags.join(' ').toLowerCase()
    const fullText = `${title} ${description} ${tags}`

    // キーワードマッチング
    const keywordScores = this.getKeywordScores(userProfile.diagnosisType, fullText)
    score += keywordScores

    // カテゴリマッチング
    score += this.getCategoryScore(userProfile.diagnosisType, content.categories)

    // ターゲットオーディエンスチェック
    if (content.targetAudience.diagnosisTypes.includes(userProfile.diagnosisType)) {
      score += 0.3
    }

    // 経験レベル適合性
    if (content.targetAudience.experienceLevels.includes(userProfile.experienceLevel)) {
      score += 0.2
    }

    return Math.min(score, 1)
  }

  // 行動ベーススコア計算
  private calculateBehaviorBasedScore(userProfile: UserProfile, content: CollectedContent): number {
    if (userProfile.learningHistory.length === 0) return 0.5

    let score = 0

    // 完了率が高いコンテンツタイプ
    const preferredTypes = this.getPreferredContentTypes(userProfile.learningHistory)
    if (preferredTypes.includes(content.contentType)) {
      score += 0.3
    }

    // 好まれる難易度
    if (content.difficultyLevel === userProfile.engagementMetrics.preferredDifficulty) {
      score += 0.3
    }

    // 好まれる時間長
    const idealDuration = userProfile.engagementMetrics.preferredDuration
    if (content.duration) {
      const durationDiff = Math.abs(content.duration - idealDuration) / idealDuration
      score += Math.max(0, (1 - durationDiff) * 0.3)
    }

    // 高評価カテゴリ
    const highRatedCategories = this.getHighRatedCategories(userProfile.learningHistory)
    const categoryMatch = content.categories.some(cat => highRatedCategories.includes(cat))
    if (categoryMatch) {
      score += 0.2
    }

    return Math.min(score, 1)
  }

  // 設定適合性スコア
  private calculatePreferenceScore(userProfile: UserProfile, content: CollectedContent): number {
    let score = 0

    // コンテンツタイプ設定
    if (userProfile.preferredContentTypes.includes(content.contentType)) {
      score += 0.5
    }

    // 学習時間設定
    if (content.duration && content.duration <= userProfile.dailyLearningTime) {
      score += 0.3
    }

    // 学習目標との関連性
    const goalMatch = this.checkGoalAlignment(userProfile.learningGoals, content)
    score += goalMatch * 0.2

    return Math.min(score, 1)
  }

  // トレンディングボーナス計算
  private calculateTrendingBonus(content: CollectedContent): number {
    const publishedDate = new Date(content.publishedAt)
    const daysSincePublished = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)
    
    // 新しいコンテンツほど高スコア
    if (daysSincePublished <= 7) return 0.2
    if (daysSincePublished <= 30) return 0.1
    return 0
  }

  // 協調フィルタリングスコア計算
  private calculateCollaborativeScore(userProfile: UserProfile, content: CollectedContent): number {
    // 実装時は他のユーザーの学習データを使用
    // 現在はプレースホルダー
    return 0
  }

  // キーワードスコア計算
  private getKeywordScores(diagnosisType: string, text: string): number {
    const keywords = {
      FV: ['innovation', 'future', 'creative', 'startup', 'disrupt', 'vision', 'イノベーション', '未来', '創造', '革新'],
      VA: ['analysis', 'data', 'research', 'study', 'investigate', 'examine', '分析', 'データ', '調査', '研究'],
      HC: ['team', 'collaboration', 'communication', 'relationship', 'people', 'チーム', '協力', 'コミュニケーション'],
      MB: ['system', 'process', 'automation', 'implement', 'build', 'construct', 'システム', 'プロセス', '実装'],
      AT: ['learn', 'knowledge', 'education', 'explore', 'discover', 'understand', '学習', '知識', '教育', '探求'],
      GS: ['strategy', 'planning', 'business', 'management', 'leadership', 'goal', '戦略', '計画', 'ビジネス', '経営']
    }

    const typeKeywords = keywords[diagnosisType as keyof typeof keywords] || []
    const matches = typeKeywords.filter(keyword => text.includes(keyword)).length
    
    return Math.min(matches / typeKeywords.length * 0.5, 0.5)
  }

  // カテゴリスコア計算
  private getCategoryScore(diagnosisType: string, categories: string[]): number {
    const preferredCategories = {
      FV: ['AI & Machine Learning', 'Business Strategy', 'Innovation'],
      VA: ['Data Science', 'AI & Machine Learning', 'Research'],
      HC: ['Leadership', 'Personal Development', 'Communication'],
      MB: ['Programming', 'Systems', 'Automation'],
      AT: ['Education', 'Personal Development', 'Research'],
      GS: ['Business Strategy', 'Leadership', 'Management']
    }

    const typeCategories = preferredCategories[diagnosisType as keyof typeof preferredCategories] || []
    const matches = categories.filter(cat => typeCategories.includes(cat)).length
    
    return Math.min(matches / typeCategories.length * 0.3, 0.3)
  }

  // レコメンデーション多様性の確保
  private diversifyRecommendations(
    recommendations: RecommendationResult[],
    maxCount: number
  ): RecommendationResult[] {
    const selected: RecommendationResult[] = []
    const usedCategories = new Set<string>()
    const usedTypes = new Set<string>()

    // まず上位の高スコアコンテンツを選択
    for (const rec of recommendations) {
      if (selected.length >= maxCount) break
      
      const categoryKey = rec.content.categories.join('-')
      const typeKey = rec.content.contentType
      
      // 多様性チェック
      if (selected.length < maxCount * 0.7 || 
          (!usedCategories.has(categoryKey) || !usedTypes.has(typeKey))) {
        selected.push(rec)
        usedCategories.add(categoryKey)
        usedTypes.add(typeKey)
      }
    }

    // 残りのスロットを埋める
    for (const rec of recommendations) {
      if (selected.length >= maxCount) break
      if (!selected.includes(rec)) {
        selected.push(rec)
      }
    }

    return selected.slice(0, maxCount)
  }

  // 説明文生成
  private generateExplanations(
    userProfile: UserProfile,
    content: CollectedContent,
    score: RecommendationScore
  ): string[] {
    const explanations: string[] = []

    // 基本的な適合理由
    explanations.push(...score.reasoning)

    // 追加の説明
    if (content.qualityMetrics.overallScore > 0.8) {
      explanations.push('専門家から高い評価を受けています')
    }

    if (content.duration && content.duration <= 30) {
      explanations.push('短時間で効率的に学習できます')
    }

    if (content.language === 'ja') {
      explanations.push('日本語コンテンツで理解しやすい')
    }

    return explanations
  }

  // ユーティリティ関数
  private getPreferredContentTypes(history: LearningHistoryItem[]): string[] {
    // 実装時は実際の履歴データから分析
    return ['video', 'article']
  }

  private getHighRatedCategories(history: LearningHistoryItem[]): string[] {
    // 実装時は実際の評価データから分析
    return ['AI & Machine Learning', 'Data Science']
  }

  private checkGoalAlignment(goals: string[], content: CollectedContent): number {
    // 学習目標とコンテンツの関連性チェック
    const goalKeywords = goals.join(' ').toLowerCase()
    const contentText = (content.title + ' ' + content.description).toLowerCase()
    
    let matches = 0
    for (const goal of goals) {
      if (contentText.includes(goal.toLowerCase())) {
        matches++
      }
    }
    
    return goals.length > 0 ? matches / goals.length : 0
  }
}

// シングルトンインスタンス
let recommendationEngineInstance: RecommendationEngine | null = null

export function getRecommendationEngine(): RecommendationEngine {
  if (!recommendationEngineInstance) {
    recommendationEngineInstance = new RecommendationEngine()
  }
  return recommendationEngineInstance
}

export default RecommendationEngine