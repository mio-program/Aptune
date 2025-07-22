// 学習履歴・進捗管理システム
// ユーザーの学習進捗を追跡し、パーソナライズされた学習体験を提供

export interface LearningSession {
  id: string
  userId: string
  contentId: string
  startedAt: string
  endedAt?: string
  durationMinutes: number
  progressPercentage: number // 0-100
  completed: boolean
  userRating?: number // 1-5
  userFeedback?: string
  engagementMetrics: {
    pauseCount: number
    replayCount: number
    speedChanges: number
    notesCount: number
    bookmarkCount: number
  }
  contextData: {
    device: string
    location?: string
    timeOfDay: string
    sessionType: 'focused' | 'casual' | 'review'
  }
  createdAt: string
  updatedAt: string
}

export interface LearningStreak {
  userId: string
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  streakStartDate: string
  weeklyGoal: number
  monthlyGoal: number
  achievements: string[]
}

export interface SkillProgress {
  userId: string
  skillName: string
  currentLevel: number // 0-100
  targetLevel: number
  completedContent: string[]
  totalTimeSpent: number // minutes
  lastProgressDate: string
  milestones: SkillMilestone[]
  certificationsEarned: string[]
}

export interface SkillMilestone {
  id: string
  name: string
  description: string
  requirement: number // level requirement
  achievedAt?: string
  badgeUrl?: string
}

export interface LearningAnalytics {
  userId: string
  weeklyStats: {
    contentConsumed: number
    timeSpent: number
    completionRate: number
    averageRating: number
    topCategories: string[]
  }
  monthlyStats: {
    contentConsumed: number
    timeSpent: number
    completionRate: number
    skillsImproved: string[]
    goalsAchieved: number
  }
  learningPatterns: {
    preferredTimeSlots: string[]
    preferredContentTypes: string[]
    averageSessionLength: number
    retentionRate: number
    engagementTrend: 'improving' | 'stable' | 'declining'
  }
  recommendations: {
    nextContent: string[]
    skillsToFocus: string[]
    learningSchedule: string[]
  }
  lastUpdated: string
}

export class LearningProgressManager {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  // 学習セッション開始
  async startLearningSession(contentId: string, sessionType: 'focused' | 'casual' | 'review' = 'focused'): Promise<string> {
    const session: LearningSession = {
      id: this.generateSessionId(),
      userId: this.userId,
      contentId,
      startedAt: new Date().toISOString(),
      durationMinutes: 0,
      progressPercentage: 0,
      completed: false,
      engagementMetrics: {
        pauseCount: 0,
        replayCount: 0,
        speedChanges: 0,
        notesCount: 0,
        bookmarkCount: 0
      },
      contextData: {
        device: this.detectDevice(),
        timeOfDay: this.getTimeOfDay(),
        sessionType
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // ローカルストレージまたはAPIに保存
    await this.saveLearningSession(session)
    return session.id
  }

  // 学習進捗更新
  async updateProgress(
    sessionId: string, 
    progressPercentage: number, 
    engagementData?: Partial<LearningSession['engagementMetrics']>
  ): Promise<void> {
    const session = await this.getLearningSession(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    const now = new Date()
    const startTime = new Date(session.startedAt)
    const durationMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60))

    session.progressPercentage = Math.min(progressPercentage, 100)
    session.durationMinutes = durationMinutes
    session.updatedAt = now.toISOString()

    if (engagementData) {
      session.engagementMetrics = { ...session.engagementMetrics, ...engagementData }
    }

    // 完了判定
    if (progressPercentage >= 100) {
      session.completed = true
      session.endedAt = now.toISOString()
      await this.handleContentCompletion(session)
    }

    await this.saveLearningSession(session)
  }

  // 学習完了処理
  private async handleContentCompletion(session: LearningSession): Promise<void> {
    // 学習ストリーク更新
    await this.updateLearningStreak()

    // スキル進捗更新
    await this.updateSkillProgress(session.contentId, session.durationMinutes)

    // 実績・バッジチェック
    await this.checkAchievements(session)

    // 分析データ更新
    await this.updateAnalytics(session)
  }

  // 学習セッション終了
  async endLearningSession(
    sessionId: string, 
    userRating?: number, 
    feedback?: string
  ): Promise<void> {
    const session = await this.getLearningSession(sessionId)
    if (!session) return

    const now = new Date()
    const startTime = new Date(session.startedAt)
    const durationMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60))

    session.endedAt = now.toISOString()
    session.durationMinutes = durationMinutes
    session.userRating = userRating
    session.userFeedback = feedback
    session.updatedAt = now.toISOString()

    await this.saveLearningSession(session)

    // 中断した場合でも基本的な統計は更新
    await this.updateAnalytics(session)
  }

  // 学習ストリーク管理
  async updateLearningStreak(): Promise<LearningStreak> {
    const existingStreak = await this.getLearningStreak()
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

    let streak: LearningStreak

    if (!existingStreak) {
      // 初回ストリーク
      streak = {
        userId: this.userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
        streakStartDate: today,
        weeklyGoal: 5,
        monthlyGoal: 20,
        achievements: []
      }
    } else {
      streak = { ...existingStreak }
      
      if (streak.lastActiveDate === today) {
        // 今日既に学習済み
        return streak
      } else if (streak.lastActiveDate === yesterday) {
        // 連続学習
        streak.currentStreak += 1
        streak.lastActiveDate = today
        
        // 最長記録更新チェック
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak
        }
      } else {
        // ストリーク途切れ
        streak.currentStreak = 1
        streak.lastActiveDate = today
        streak.streakStartDate = today
      }
    }

    // 実績チェック
    await this.checkStreakAchievements(streak)
    
    await this.saveLearningStreak(streak)
    return streak
  }

  // スキル進捗更新
  async updateSkillProgress(contentId: string, timeSpent: number): Promise<void> {
    // コンテンツから関連スキルを取得（実装時はAPIから）
    const relatedSkills = await this.getContentSkills(contentId)

    for (const skillName of relatedSkills) {
      let skillProgress = await this.getSkillProgress(skillName)

      if (!skillProgress) {
        skillProgress = {
          userId: this.userId,
          skillName,
          currentLevel: 0,
          targetLevel: 100,
          completedContent: [],
          totalTimeSpent: 0,
          lastProgressDate: new Date().toISOString(),
          milestones: this.getSkillMilestones(skillName),
          certificationsEarned: []
        }
      }

      // 進捗計算（時間ベース + コンテンツ完了ベース）
      const progressIncrement = Math.min(timeSpent * 0.1, 5) // 時間による進捗
      skillProgress.currentLevel = Math.min(skillProgress.currentLevel + progressIncrement, 100)
      skillProgress.totalTimeSpent += timeSpent
      skillProgress.lastProgressDate = new Date().toISOString()

      if (!skillProgress.completedContent.includes(contentId)) {
        skillProgress.completedContent.push(contentId)
      }

      // マイルストーンチェック
      await this.checkSkillMilestones(skillProgress)

      await this.saveSkillProgress(skillProgress)
    }
  }

  // 実績・バッジチェック
  async checkAchievements(session: LearningSession): Promise<void> {
    const achievements: string[] = []

    // 基本実績
    const totalSessions = await this.getTotalSessions()
    if (totalSessions === 1) achievements.push('first_session')
    if (totalSessions === 10) achievements.push('dedicated_learner')
    if (totalSessions === 50) achievements.push('learning_champion')

    // 時間ベース実績
    if (session.durationMinutes >= 60) achievements.push('hour_scholar')
    if (session.durationMinutes >= 120) achievements.push('marathon_learner')

    // エンゲージメント実績
    if (session.engagementMetrics.notesCount >= 5) achievements.push('note_taker')
    if (session.progressPercentage === 100) achievements.push('completionist')

    // 実績を保存
    for (const achievement of achievements) {
      await this.saveAchievement(achievement)
    }
  }

  // 学習分析データ更新
  async updateAnalytics(session: LearningSession): Promise<void> {
    const analytics = await this.getLearningAnalytics() || this.createEmptyAnalytics()
    const now = new Date()
    const weekStart = this.getWeekStart(now)
    const monthStart = this.getMonthStart(now)

    // 週間統計更新
    analytics.weeklyStats.contentConsumed += 1
    analytics.weeklyStats.timeSpent += session.durationMinutes
    
    if (session.completed) {
      const totalCompleted = await this.getWeeklyCompletedCount()
      analytics.weeklyStats.completionRate = totalCompleted / analytics.weeklyStats.contentConsumed
    }

    if (session.userRating) {
      analytics.weeklyStats.averageRating = await this.calculateAverageRating('week')
    }

    // 月間統計更新
    analytics.monthlyStats.contentConsumed += 1
    analytics.monthlyStats.timeSpent += session.durationMinutes

    // 学習パターン分析
    analytics.learningPatterns.averageSessionLength = await this.calculateAverageSessionLength()
    analytics.learningPatterns.preferredTimeSlots = await this.getPreferredTimeSlots()
    analytics.learningPatterns.engagementTrend = await this.calculateEngagementTrend()

    analytics.lastUpdated = now.toISOString()
    await this.saveLearningAnalytics(analytics)
  }

  // 学習目標設定・追跡
  async setLearningGoals(goals: {
    dailyMinutes?: number
    weeklyContent?: number
    monthlySkills?: number
    targetSkills?: string[]
  }): Promise<void> {
    const goalData = {
      userId: this.userId,
      ...goals,
      createdAt: new Date().toISOString()
    }
    
    await this.saveLearningGoals(goalData)
  }

  // 学習推奨スケジュール生成
  async generateLearningSchedule(): Promise<{
    daily: string[]
    weekly: string[]
    recommendations: string[]
  }> {
    const analytics = await this.getLearningAnalytics()
    const streak = await this.getLearningStreak()
    const preferredTimes = analytics?.learningPatterns.preferredTimeSlots || ['19:00']

    return {
      daily: [
        `${preferredTimes[0]}に${analytics?.learningPatterns.averageSessionLength || 30}分の学習セッション`,
        '新しいコンテンツを1つ完了する',
        '学習ノートを3つ作成する'
      ],
      weekly: [
        `週間目標: ${streak?.weeklyGoal || 5}日の学習を継続`,
        '新しいスキル分野に挑戦する',
        '完了したコンテンツをレビューする'
      ],
      recommendations: [
        '朝の時間帯の学習を試してみる',
        'ポモドーロテクニックを活用する',
        '学習仲間とのディスカッション'
      ]
    }
  }

  // データ永続化メソッド（実装時はSupabaseまたはAPIに変更）
  private async saveLearningSession(session: LearningSession): Promise<void> {
    localStorage.setItem(`learning_session_${session.id}`, JSON.stringify(session))
  }

  private async getLearningSession(sessionId: string): Promise<LearningSession | null> {
    const stored = localStorage.getItem(`learning_session_${sessionId}`)
    return stored ? JSON.parse(stored) : null
  }

  private async saveLearningStreak(streak: LearningStreak): Promise<void> {
    localStorage.setItem(`learning_streak_${this.userId}`, JSON.stringify(streak))
  }

  private async getLearningStreak(): Promise<LearningStreak | null> {
    const stored = localStorage.getItem(`learning_streak_${this.userId}`)
    return stored ? JSON.parse(stored) : null
  }

  private async saveSkillProgress(skillProgress: SkillProgress): Promise<void> {
    localStorage.setItem(`skill_progress_${this.userId}_${skillProgress.skillName}`, JSON.stringify(skillProgress))
  }

  private async getSkillProgress(skillName: string): Promise<SkillProgress | null> {
    const stored = localStorage.getItem(`skill_progress_${this.userId}_${skillName}`)
    return stored ? JSON.parse(stored) : null
  }

  private async saveLearningAnalytics(analytics: LearningAnalytics): Promise<void> {
    localStorage.setItem(`learning_analytics_${this.userId}`, JSON.stringify(analytics))
  }

  private async getLearningAnalytics(): Promise<LearningAnalytics | null> {
    const stored = localStorage.getItem(`learning_analytics_${this.userId}`)
    return stored ? JSON.parse(stored) : null
  }

  private async saveLearningGoals(goals: any): Promise<void> {
    localStorage.setItem(`learning_goals_${this.userId}`, JSON.stringify(goals))
  }

  private async saveAchievement(achievement: string): Promise<void> {
    const existing = JSON.parse(localStorage.getItem(`achievements_${this.userId}`) || '[]')
    if (!existing.includes(achievement)) {
      existing.push(achievement)
      localStorage.setItem(`achievements_${this.userId}`, JSON.stringify(existing))
    }
  }

  // ユーティリティメソッド
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private detectDevice(): string {
    if (typeof window !== 'undefined') {
      return /Mobile|Android|iP(hone|od|ad)/.test(window.navigator.userAgent) ? 'mobile' : 'desktop'
    }
    return 'unknown'
  }

  private getTimeOfDay(): string {
    const hour = new Date().getHours()
    if (hour < 6) return 'late_night'
    if (hour < 12) return 'morning'
    if (hour < 18) return 'afternoon'
    if (hour < 22) return 'evening'
    return 'night'
  }

  private getWeekStart(date: Date): Date {
    const start = new Date(date)
    const day = start.getDay()
    const diff = start.getDate() - day
    return new Date(start.setDate(diff))
  }

  private getMonthStart(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }

  private createEmptyAnalytics(): LearningAnalytics {
    return {
      userId: this.userId,
      weeklyStats: {
        contentConsumed: 0,
        timeSpent: 0,
        completionRate: 0,
        averageRating: 0,
        topCategories: []
      },
      monthlyStats: {
        contentConsumed: 0,
        timeSpent: 0,
        completionRate: 0,
        skillsImproved: [],
        goalsAchieved: 0
      },
      learningPatterns: {
        preferredTimeSlots: ['19:00'],
        preferredContentTypes: ['video'],
        averageSessionLength: 30,
        retentionRate: 0,
        engagementTrend: 'stable'
      },
      recommendations: {
        nextContent: [],
        skillsToFocus: [],
        learningSchedule: []
      },
      lastUpdated: new Date().toISOString()
    }
  }

  // プレースホルダーメソッド（実装時に具体化）
  private async getContentSkills(contentId: string): Promise<string[]> {
    // 実装時はコンテンツAPIから取得
    return ['AI & Machine Learning', 'Data Analysis']
  }

  private getSkillMilestones(skillName: string): SkillMilestone[] {
    return [
      { id: '1', name: '初心者', description: '基礎を理解', requirement: 25 },
      { id: '2', name: '中級者', description: '実践的スキル', requirement: 50 },
      { id: '3', name: '上級者', description: '専門知識', requirement: 75 },
      { id: '4', name: 'エキスパート', description: 'マスタリー', requirement: 100 }
    ]
  }

  private async checkSkillMilestones(skillProgress: SkillProgress): Promise<void> {
    // マイルストーン達成チェック
    for (const milestone of skillProgress.milestones) {
      if (skillProgress.currentLevel >= milestone.requirement && !milestone.achievedAt) {
        milestone.achievedAt = new Date().toISOString()
        await this.saveAchievement(`skill_milestone_${milestone.id}`)
      }
    }
  }

  private async checkStreakAchievements(streak: LearningStreak): Promise<void> {
    if (streak.currentStreak === 7) await this.saveAchievement('week_streak')
    if (streak.currentStreak === 30) await this.saveAchievement('month_streak')
    if (streak.currentStreak === 100) await this.saveAchievement('hundred_days')
  }

  private async getTotalSessions(): Promise<number> {
    // 実装時は実際のセッション数を返す
    return Math.floor(Math.random() * 100)
  }

  private async getWeeklyCompletedCount(): Promise<number> {
    // 実装時は週間完了数を返す
    return Math.floor(Math.random() * 10)
  }

  private async calculateAverageRating(period: 'week' | 'month'): Promise<number> {
    // 実装時は実際の平均評価を計算
    return 4.2
  }

  private async calculateAverageSessionLength(): Promise<number> {
    // 実装時は実際の平均セッション長を計算
    return 35
  }

  private async getPreferredTimeSlots(): Promise<string[]> {
    // 実装時は実際の優先時間帯を分析
    return ['19:00', '21:00']
  }

  private async calculateEngagementTrend(): Promise<'improving' | 'stable' | 'declining'> {
    // 実装時は実際のエンゲージメント傾向を分析
    return 'improving'
  }
}

// シングルトンファクトリー
const progressManagers = new Map<string, LearningProgressManager>()

export function getLearningProgressManager(userId: string): LearningProgressManager {
  if (!progressManagers.has(userId)) {
    progressManagers.set(userId, new LearningProgressManager(userId))
  }
  return progressManagers.get(userId)!
}

export default LearningProgressManager