// バッチ処理・API統合システム
// 定期的なコンテンツ収集、データ更新、品質評価の自動化

import { getContentCollector, CollectedContent } from './content-collector'
import { getRecommendationEngine, UserProfile } from './recommendation-engine'
import { getLearningProgressManager } from './learning-progress'

export interface BatchJobConfig {
  id: string
  name: string
  schedule: string // cron format
  enabled: boolean
  lastRun?: string
  nextRun?: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  retryCount: number
  maxRetries: number
  configuration: Record<string, any>
}

export interface BatchJobResult {
  jobId: string
  startTime: string
  endTime: string
  status: 'success' | 'error' | 'partial'
  processedItems: number
  errorCount: number
  errors: string[]
  summary: Record<string, any>
}

export interface ContentUpdateResult {
  newContent: number
  updatedContent: number
  removedContent: number
  qualityIssues: number
  errors: string[]
}

export interface RecommendationUpdateResult {
  usersProcessed: number
  recommendationsGenerated: number
  errors: string[]
}

export class BatchProcessor {
  private jobs: Map<string, BatchJobConfig> = new Map()
  private isRunning = false
  private processInterval: NodeJS.Timeout | null = null

  constructor() {
    this.initializeDefaultJobs()
  }

  // デフォルトジョブ設定
  private initializeDefaultJobs(): void {
    const defaultJobs: BatchJobConfig[] = [
      {
        id: 'daily_content_collection',
        name: 'Daily Content Collection',
        schedule: '0 2 * * *', // 毎日午前2時
        enabled: true,
        status: 'pending',
        retryCount: 0,
        maxRetries: 3,
        configuration: {
          platforms: ['youtube', 'twitter'],
          maxContentPerPlatform: 100,
          qualityThreshold: 0.6
        }
      },
      {
        id: 'weekly_recommendation_update',
        name: 'Weekly Recommendation Update',
        schedule: '0 3 * * 0', // 毎週日曜日午前3時
        enabled: true,
        status: 'pending',
        retryCount: 0,
        maxRetries: 2,
        configuration: {
          batchSize: 50,
          maxRecommendationsPerUser: 20
        }
      },
      {
        id: 'content_quality_review',
        name: 'Content Quality Review',
        schedule: '0 4 * * 1', // 毎週月曜日午前4時
        enabled: true,
        status: 'pending',
        retryCount: 0,
        maxRetries: 2,
        configuration: {
          reviewPeriodDays: 7,
          qualityThreshold: 0.5
        }
      },
      {
        id: 'user_analytics_update',
        name: 'User Analytics Update',
        schedule: '0 1 * * *', // 毎日午前1時
        enabled: true,
        status: 'pending',
        retryCount: 0,
        maxRetries: 3,
        configuration: {
          batchSize: 100
        }
      },
      {
        id: 'trending_content_detection',
        name: 'Trending Content Detection',
        schedule: '0 */6 * * *', // 6時間おき
        enabled: true,
        status: 'pending',
        retryCount: 0,
        maxRetries: 2,
        configuration: {
          trendingThreshold: 0.8,
          timeWindowHours: 24
        }
      }
    ]

    defaultJobs.forEach(job => {
      this.jobs.set(job.id, job)
    })
  }

  // バッチ処理開始
  start(): void {
    if (this.isRunning) {
      console.log('Batch processor is already running')
      return
    }

    this.isRunning = true
    console.log('Starting batch processor...')

    // 1分おきにジョブをチェック
    this.processInterval = setInterval(() => {
      this.checkAndRunJobs()
    }, 60000)

    // 初回実行
    this.checkAndRunJobs()
  }

  // バッチ処理停止
  stop(): void {
    if (!this.isRunning) return

    this.isRunning = false
    if (this.processInterval) {
      clearInterval(this.processInterval)
      this.processInterval = null
    }
    console.log('Batch processor stopped')
  }

  // ジョブチェック・実行
  private async checkAndRunJobs(): Promise<void> {
    const now = new Date()

    for (const [jobId, job] of this.jobs) {
      if (!job.enabled || job.status === 'running') continue

      // 次回実行時刻をチェック
      if (this.shouldRunJob(job, now)) {
        await this.runJob(job)
      }
    }
  }

  // ジョブ実行判定
  private shouldRunJob(job: BatchJobConfig, now: Date): boolean {
    if (!job.nextRun) {
      job.nextRun = this.calculateNextRun(job.schedule, now).toISOString()
      return true
    }

    const nextRunTime = new Date(job.nextRun)
    return now >= nextRunTime
  }

  // cron形式のスケジュールから次回実行時刻を計算
  private calculateNextRun(schedule: string, from: Date): Date {
    // 簡易cron実装（実際の実装では node-cron などを使用）
    const parts = schedule.split(' ')
    if (parts.length !== 5) {
      throw new Error('Invalid cron format')
    }

    const [minute, hour, day, month, weekday] = parts
    const next = new Date(from)

    // 分・時間の設定
    next.setMinutes(parseInt(minute) || 0)
    next.setHours(parseInt(hour) || 0)
    next.setSeconds(0)
    next.setMilliseconds(0)

    // 今日の指定時刻が過ぎている場合は明日に設定
    if (next <= from) {
      next.setDate(next.getDate() + 1)
    }

    return next
  }

  // ジョブ実行
  private async runJob(job: BatchJobConfig): Promise<void> {
    console.log(`Running job: ${job.name}`)
    
    job.status = 'running'
    const startTime = new Date()

    try {
      let result: BatchJobResult

      switch (job.id) {
        case 'daily_content_collection':
          result = await this.runContentCollection(job)
          break
        case 'weekly_recommendation_update':
          result = await this.runRecommendationUpdate(job)
          break
        case 'content_quality_review':
          result = await this.runContentQualityReview(job)
          break
        case 'user_analytics_update':
          result = await this.runUserAnalyticsUpdate(job)
          break
        case 'trending_content_detection':
          result = await this.runTrendingContentDetection(job)
          break
        default:
          throw new Error(`Unknown job type: ${job.id}`)
      }

      job.status = result.status === 'success' ? 'completed' : 'failed'
      job.lastRun = startTime.toISOString()
      job.nextRun = this.calculateNextRun(job.schedule, startTime).toISOString()
      job.retryCount = 0

      console.log(`Job ${job.name} completed:`, result.summary)

    } catch (error) {
      console.error(`Job ${job.name} failed:`, error)
      
      job.retryCount++
      if (job.retryCount >= job.maxRetries) {
        job.status = 'failed'
        job.lastRun = startTime.toISOString()
        job.nextRun = this.calculateNextRun(job.schedule, startTime).toISOString()
        job.retryCount = 0
      } else {
        job.status = 'pending'
        // 5分後にリトライ
        const retryTime = new Date(Date.now() + 5 * 60 * 1000)
        job.nextRun = retryTime.toISOString()
      }
    }

    this.saveJobConfig(job)
  }

  // コンテンツ収集ジョブ
  private async runContentCollection(job: BatchJobConfig): Promise<BatchJobResult> {
    const startTime = new Date().toISOString()
    const config = job.configuration
    const collector = getContentCollector()
    
    let totalProcessed = 0
    const errors: string[] = []
    const platformResults: Record<string, number> = {}

    try {
      for (const platform of config.platforms) {
        try {
          let content: CollectedContent[] = []

          if (platform === 'youtube') {
            // YouTube コンテンツ収集
            for (const diagnosisType of ['FV', 'VA', 'HC', 'MB', 'AT', 'GS']) {
              const typeContent = await collector.collectYouTubeContent(diagnosisType, config.maxContentPerPlatform / 6)
              content.push(...typeContent)
            }
          } else if (platform === 'twitter') {
            // Twitter コンテンツ収集（将来実装）
            console.log('Twitter collection - coming soon')
          }

          // 品質フィルタリング
          const qualityContent = content.filter(c => 
            c.qualityMetrics.overallScore >= config.qualityThreshold
          )

          // データベース保存（実装時）
          await this.saveCollectedContent(qualityContent)

          platformResults[platform] = qualityContent.length
          totalProcessed += qualityContent.length

        } catch (error) {
          errors.push(`${platform}: ${error}`)
        }
      }

      return {
        jobId: job.id,
        startTime,
        endTime: new Date().toISOString(),
        status: errors.length === 0 ? 'success' : 'partial',
        processedItems: totalProcessed,
        errorCount: errors.length,
        errors,
        summary: {
          totalContent: totalProcessed,
          platformBreakdown: platformResults
        }
      }

    } catch (error) {
      return {
        jobId: job.id,
        startTime,
        endTime: new Date().toISOString(),
        status: 'error',
        processedItems: totalProcessed,
        errorCount: 1,
        errors: [error.toString()],
        summary: { error: error.toString() }
      }
    }
  }

  // レコメンデーション更新ジョブ
  private async runRecommendationUpdate(job: BatchJobConfig): Promise<BatchJobResult> {
    const startTime = new Date().toISOString()
    const config = job.configuration
    const engine = getRecommendationEngine()
    
    let usersProcessed = 0
    let recommendationsGenerated = 0
    const errors: string[] = []

    try {
      // 全ユーザーのプロファイルを取得（実装時はバッチで処理）
      const userProfiles = await this.getAllUserProfiles(config.batchSize)
      const availableContent = await this.getAvailableContent()

      for (const userProfile of userProfiles) {
        try {
          const recommendations = engine.generateRecommendations(
            userProfile,
            availableContent,
            config.maxRecommendationsPerUser
          )

          await this.saveUserRecommendations(userProfile.diagnosisType, recommendations)
          
          usersProcessed++
          recommendationsGenerated += recommendations.length

        } catch (error) {
          errors.push(`User ${userProfile.diagnosisType}: ${error}`)
        }
      }

      return {
        jobId: job.id,
        startTime,
        endTime: new Date().toISOString(),
        status: errors.length === 0 ? 'success' : 'partial',
        processedItems: usersProcessed,
        errorCount: errors.length,
        errors,
        summary: {
          usersProcessed,
          recommendationsGenerated,
          averageRecommendationsPerUser: recommendationsGenerated / usersProcessed
        }
      }

    } catch (error) {
      return {
        jobId: job.id,
        startTime,
        endTime: new Date().toISOString(),
        status: 'error',
        processedItems: usersProcessed,
        errorCount: 1,
        errors: [error.toString()],
        summary: { error: error.toString() }
      }
    }
  }

  // コンテンツ品質レビュージョブ
  private async runContentQualityReview(job: BatchJobConfig): Promise<BatchJobResult> {
    const startTime = new Date().toISOString()
    const config = job.configuration
    
    let reviewedItems = 0
    let flaggedItems = 0
    const errors: string[] = []

    try {
      // 指定期間のコンテンツを取得
      const recentContent = await this.getRecentContent(config.reviewPeriodDays)

      for (const content of recentContent) {
        try {
          // 品質再評価
          const updatedMetrics = await this.reevaluateContentQuality(content)
          
          // 品質低下をチェック
          if (updatedMetrics.overallScore < config.qualityThreshold) {
            await this.flagLowQualityContent(content.id, updatedMetrics)
            flaggedItems++
          } else {
            await this.updateContentQuality(content.id, updatedMetrics)
          }

          reviewedItems++

        } catch (error) {
          errors.push(`Content ${content.id}: ${error}`)
        }
      }

      return {
        jobId: job.id,
        startTime,
        endTime: new Date().toISOString(),
        status: errors.length === 0 ? 'success' : 'partial',
        processedItems: reviewedItems,
        errorCount: errors.length,
        errors,
        summary: {
          reviewedItems,
          flaggedItems,
          qualityIssueRate: flaggedItems / reviewedItems
        }
      }

    } catch (error) {
      return {
        jobId: job.id,
        startTime,
        endTime: new Date().toISOString(),
        status: 'error',
        processedItems: reviewedItems,
        errorCount: 1,
        errors: [error.toString()],
        summary: { error: error.toString() }
      }
    }
  }

  // ユーザー分析更新ジョブ
  private async runUserAnalyticsUpdate(job: BatchJobConfig): Promise<BatchJobResult> {
    const startTime = new Date().toISOString()
    const config = job.configuration
    
    let usersProcessed = 0
    const errors: string[] = []

    try {
      const userIds = await this.getActiveUserIds(config.batchSize)

      for (const userId of userIds) {
        try {
          const progressManager = getLearningProgressManager(userId)
          
          // 分析データを更新（実装時は実際のセッションデータを使用）
          const mockSession = {
            id: 'mock',
            userId,
            contentId: 'mock',
            startedAt: new Date().toISOString(),
            durationMinutes: 30,
            progressPercentage: 100,
            completed: true,
            engagementMetrics: {
              pauseCount: 2,
              replayCount: 1,
              speedChanges: 0,
              notesCount: 3,
              bookmarkCount: 1
            },
            contextData: {
              device: 'desktop',
              timeOfDay: 'evening',
              sessionType: 'focused' as const
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          await progressManager.updateAnalytics(mockSession)
          usersProcessed++

        } catch (error) {
          errors.push(`User ${userId}: ${error}`)
        }
      }

      return {
        jobId: job.id,
        startTime,
        endTime: new Date().toISOString(),
        status: errors.length === 0 ? 'success' : 'partial',
        processedItems: usersProcessed,
        errorCount: errors.length,
        errors,
        summary: {
          usersProcessed
        }
      }

    } catch (error) {
      return {
        jobId: job.id,
        startTime,
        endTime: new Date().toISOString(),
        status: 'error',
        processedItems: usersProcessed,
        errorCount: 1,
        errors: [error.toString()],
        summary: { error: error.toString() }
      }
    }
  }

  // トレンド検出ジョブ
  private async runTrendingContentDetection(job: BatchJobConfig): Promise<BatchJobResult> {
    const startTime = new Date().toISOString()
    const config = job.configuration
    
    let analyzedItems = 0
    let trendingItems = 0
    const errors: string[] = []

    try {
      const recentContent = await this.getRecentContent(config.timeWindowHours / 24)

      for (const content of recentContent) {
        try {
          const trendScore = await this.calculateTrendScore(content)
          
          if (trendScore >= config.trendingThreshold) {
            await this.markAsTrending(content.id, trendScore)
            trendingItems++
          }

          analyzedItems++

        } catch (error) {
          errors.push(`Content ${content.id}: ${error}`)
        }
      }

      return {
        jobId: job.id,
        startTime,
        endTime: new Date().toISOString(),
        status: errors.length === 0 ? 'success' : 'partial',
        processedItems: analyzedItems,
        errorCount: errors.length,
        errors,
        summary: {
          analyzedItems,
          trendingItems,
          trendingRate: trendingItems / analyzedItems
        }
      }

    } catch (error) {
      return {
        jobId: job.id,
        startTime,
        endTime: new Date().toISOString(),
        status: 'error',
        processedItems: analyzedItems,
        errorCount: 1,
        errors: [error.toString()],
        summary: { error: error.toString() }
      }
    }
  }

  // API統合・データ永続化メソッド（実装時にSupabase/APIに変更）
  private async saveCollectedContent(content: CollectedContent[]): Promise<void> {
    // プレースホルダー - 実装時はSupabaseに保存
    console.log(`Saving ${content.length} content items to database`)
  }

  private async getAllUserProfiles(batchSize: number): Promise<UserProfile[]> {
    // プレースホルダー - 実装時はSupabaseから取得
    return []
  }

  private async getAvailableContent(): Promise<CollectedContent[]> {
    // プレースホルダー - 実装時はSupabaseから取得
    return []
  }

  private async saveUserRecommendations(userId: string, recommendations: any[]): Promise<void> {
    // プレースホルダー - 実装時はSupabaseに保存
    console.log(`Saving ${recommendations.length} recommendations for user ${userId}`)
  }

  private async getRecentContent(days: number): Promise<CollectedContent[]> {
    // プレースホルダー - 実装時はSupabaseから取得
    return []
  }

  private async reevaluateContentQuality(content: CollectedContent): Promise<any> {
    // プレースホルダー - 実装時は実際の品質評価
    return content.qualityMetrics
  }

  private async flagLowQualityContent(contentId: string, metrics: any): Promise<void> {
    console.log(`Flagging low quality content: ${contentId}`)
  }

  private async updateContentQuality(contentId: string, metrics: any): Promise<void> {
    console.log(`Updating content quality: ${contentId}`)
  }

  private async getActiveUserIds(batchSize: number): Promise<string[]> {
    // プレースホルダー - 実装時はSupabaseから取得
    return Array.from({ length: Math.min(batchSize, 10) }, (_, i) => `user_${i}`)
  }

  private async calculateTrendScore(content: CollectedContent): Promise<number> {
    // プレースホルダー - 実装時は実際のトレンドスコア計算
    return Math.random()
  }

  private async markAsTrending(contentId: string, score: number): Promise<void> {
    console.log(`Marking as trending: ${contentId} (score: ${score})`)
  }

  private saveJobConfig(job: BatchJobConfig): void {
    // プレースホルダー - 実装時はSupabaseに保存
    localStorage.setItem(`batch_job_${job.id}`, JSON.stringify(job))
  }

  // 公開API
  getJobStatus(jobId: string): BatchJobConfig | null {
    return this.jobs.get(jobId) || null
  }

  getAllJobs(): BatchJobConfig[] {
    return Array.from(this.jobs.values())
  }

  enableJob(jobId: string): boolean {
    const job = this.jobs.get(jobId)
    if (job) {
      job.enabled = true
      this.saveJobConfig(job)
      return true
    }
    return false
  }

  disableJob(jobId: string): boolean {
    const job = this.jobs.get(jobId)
    if (job) {
      job.enabled = false
      this.saveJobConfig(job)
      return true
    }
    return false
  }

  async runJobManually(jobId: string): Promise<BatchJobResult | null> {
    const job = this.jobs.get(jobId)
    if (!job) return null

    const originalStatus = job.status
    await this.runJob(job)
    
    // 手動実行後は元のステータスに戻す
    const result = {
      jobId,
      startTime: job.lastRun || new Date().toISOString(),
      endTime: new Date().toISOString(),
      status: job.status === 'completed' ? 'success' as const : 'error' as const,
      processedItems: 0,
      errorCount: 0,
      errors: [],
      summary: {}
    }
    
    job.status = originalStatus
    return result
  }
}

// シングルトンインスタンス
let batchProcessorInstance: BatchProcessor | null = null

export function getBatchProcessor(): BatchProcessor {
  if (!batchProcessorInstance) {
    batchProcessorInstance = new BatchProcessor()
  }
  return batchProcessorInstance
}

// 自動起動（サーバー環境でのみ）
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  const processor = getBatchProcessor()
  processor.start()
  
  // プロセス終了時の cleanup
  process.on('SIGINT', () => {
    processor.stop()
    process.exit(0)
  })
}

export default BatchProcessor