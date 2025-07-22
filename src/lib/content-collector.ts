// 統合コンテンツ収集システム
// YouTube, Twitter, その他プラットフォームからのコンテンツ収集・管理

import { createYouTubeService, AI_LEARNING_QUERIES, RECOMMENDED_CHANNELS, YouTubeVideoInfo } from './youtube-api'

export interface CollectedContent {
  id: string
  title: string
  description: string
  contentType: 'video' | 'article' | 'course' | 'podcast' | 'tweet'
  sourcePlatform: 'youtube' | 'twitter' | 'udemy' | 'coursera' | 'medium' | 'custom'
  sourceUrl: string
  sourceId: string
  thumbnailUrl?: string
  duration?: number // minutes
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  language: string
  tags: string[]
  categories: string[]
  qualityMetrics: {
    engagementScore: number
    educationalValue: number
    upToDateScore: number
    aiRelevanceScore: number
    overallScore: number
  }
  authorInfo: {
    name: string
    channelId?: string
    followers?: number
    verified?: boolean
  }
  publishedAt: string
  lastUpdated: string
  targetAudience: {
    diagnosisTypes: string[] // FV, VA, HC, MB, AT, GS
    industries: string[]
    experienceLevels: string[]
  }
}

export interface ContentFilter {
  diagnosisType?: string
  industry?: string
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced'
  contentTypes?: string[]
  minQualityScore?: number
  languages?: string[]
  maxDuration?: number
  publishedAfter?: string
}

export class ContentCollector {
  private youtubeService: any
  private lastCollectionTime: { [platform: string]: number } = {}

  constructor() {
    this.youtubeService = createYouTubeService()
  }

  // YouTube からAI学習コンテンツを収集
  async collectYouTubeContent(
    diagnosisType?: keyof typeof AI_LEARNING_QUERIES,
    maxResults: number = 50
  ): Promise<CollectedContent[]> {
    if (!this.youtubeService) {
      console.warn('YouTube service not available')
      return []
    }

    try {
      const queries = diagnosisType 
        ? AI_LEARNING_QUERIES[diagnosisType] || AI_LEARNING_QUERIES.general
        : AI_LEARNING_QUERIES.general

      const allVideos: YouTubeVideoInfo[] = []

      // 複数クエリで検索
      for (const query of queries) {
        try {
          const videos = await this.youtubeService.searchVideos(
            query,
            Math.ceil(maxResults / queries.length),
            'relevance',
            this.getLastWeekISO() // 1週間以内のコンテンツ
          )
          allVideos.push(...videos)
          
          // API制限を考慮して少し待機
          await this.delay(100)
        } catch (error) {
          console.error(`Error searching for query "${query}":`, error)
        }
      }

      // 重複削除
      const uniqueVideos = this.removeDuplicates(allVideos, 'id')

      // CollectedContent形式に変換
      return this.convertYouTubeToCollectedContent(uniqueVideos, diagnosisType)

    } catch (error) {
      console.error('Error collecting YouTube content:', error)
      return []
    }
  }

  // 高品質チャンネルからコンテンツ収集
  async collectFromRecommendedChannels(
    channelCategory: keyof typeof RECOMMENDED_CHANNELS = 'ai_general',
    maxResultsPerChannel: number = 20
  ): Promise<CollectedContent[]> {
    if (!this.youtubeService) return []

    try {
      const channels = RECOMMENDED_CHANNELS[channelCategory]
      const allVideos: YouTubeVideoInfo[] = []

      for (const channelId of channels) {
        try {
          const videos = await this.youtubeService.getChannelVideos(channelId, maxResultsPerChannel)
          allVideos.push(...videos)
          await this.delay(200)
        } catch (error) {
          console.error(`Error collecting from channel ${channelId}:`, error)
        }
      }

      return this.convertYouTubeToCollectedContent(allVideos)

    } catch (error) {
      console.error('Error collecting from recommended channels:', error)
      return []
    }
  }

  // Twitter/X からAI関連ツイート収集（将来実装）
  async collectTwitterContent(diagnosisType?: string): Promise<CollectedContent[]> {
    // Twitter API v2 integration (placeholder)
    console.log('Twitter content collection - coming soon')
    return []
  }

  // Udemy コース情報収集（将来実装）
  async collectUdemyContent(diagnosisType?: string): Promise<CollectedContent[]> {
    // Udemy API integration (placeholder)
    console.log('Udemy content collection - coming soon')
    return []
  }

  // 全プラットフォームから統合収集
  async collectAllContent(
    diagnosisType?: string,
    options: {
      includeYouTube?: boolean
      includeTwitter?: boolean
      includeUdemy?: boolean
      maxResultsPerPlatform?: number
    } = {}
  ): Promise<CollectedContent[]> {
    const {
      includeYouTube = true,
      includeTwitter = false,
      includeUdemy = false,
      maxResultsPerPlatform = 50
    } = options

    const allContent: CollectedContent[] = []

    if (includeYouTube) {
      try {
        const youtubeContent = await this.collectYouTubeContent(
          diagnosisType as keyof typeof AI_LEARNING_QUERIES,
          maxResultsPerPlatform
        )
        allContent.push(...youtubeContent)
      } catch (error) {
        console.error('Error collecting YouTube content:', error)
      }
    }

    if (includeTwitter) {
      try {
        const twitterContent = await this.collectTwitterContent(diagnosisType)
        allContent.push(...twitterContent)
      } catch (error) {
        console.error('Error collecting Twitter content:', error)
      }
    }

    if (includeUdemy) {
      try {
        const udemyContent = await this.collectUdemyContent(diagnosisType)
        allContent.push(...udemyContent)
      } catch (error) {
        console.error('Error collecting Udemy content:', error)
      }
    }

    // 品質スコアでソート
    return allContent.sort((a, b) => b.qualityMetrics.overallScore - a.qualityMetrics.overallScore)
  }

  // コンテンツフィルタリング
  filterContent(content: CollectedContent[], filter: ContentFilter): CollectedContent[] {
    return content.filter(item => {
      // 診断タイプチェック
      if (filter.diagnosisType && !item.targetAudience.diagnosisTypes.includes(filter.diagnosisType)) {
        return false
      }

      // 業界チェック
      if (filter.industry && !item.targetAudience.industries.includes(filter.industry)) {
        return false
      }

      // 経験レベルチェック
      if (filter.experienceLevel && !item.targetAudience.experienceLevels.includes(filter.experienceLevel)) {
        return false
      }

      // コンテンツタイプチェック
      if (filter.contentTypes && !filter.contentTypes.includes(item.contentType)) {
        return false
      }

      // 品質スコアチェック
      if (filter.minQualityScore && item.qualityMetrics.overallScore < filter.minQualityScore) {
        return false
      }

      // 言語チェック
      if (filter.languages && !filter.languages.includes(item.language)) {
        return false
      }

      // 最大時間チェック
      if (filter.maxDuration && item.duration && item.duration > filter.maxDuration) {
        return false
      }

      // 公開日チェック
      if (filter.publishedAfter && new Date(item.publishedAt) < new Date(filter.publishedAfter)) {
        return false
      }

      return true
    })
  }

  // YouTube動画をCollectedContent形式に変換
  private convertYouTubeToCollectedContent(
    videos: YouTubeVideoInfo[],
    diagnosisType?: string
  ): CollectedContent[] {
    return videos.map(video => {
      const qualityMetrics = this.youtubeService.calculateQualityScore(video)
      const duration = this.youtubeService.parseDuration(video.duration)
      
      return {
        id: `youtube_${video.id}`,
        title: video.title,
        description: video.description,
        contentType: 'video' as const,
        sourcePlatform: 'youtube' as const,
        sourceUrl: `https://www.youtube.com/watch?v=${video.id}`,
        sourceId: video.id,
        thumbnailUrl: video.thumbnails.medium?.url,
        duration,
        difficultyLevel: this.determineDifficultyLevel(video.title, video.description, duration),
        language: this.detectLanguage(video.title, video.description),
        tags: video.tags || [],
        categories: this.categorizeContent(video.title, video.description),
        qualityMetrics,
        authorInfo: {
          name: video.channelTitle,
          channelId: video.channelId,
          verified: false // YouTube APIでは取得困難
        },
        publishedAt: video.publishedAt,
        lastUpdated: new Date().toISOString(),
        targetAudience: this.determineTargetAudience(video.title, video.description, diagnosisType)
      }
    })
  }

  // 難易度レベル判定
  private determineDifficultyLevel(title: string, description: string, duration: number): 'beginner' | 'intermediate' | 'advanced' {
    const content = (title + ' ' + description).toLowerCase()
    
    if (content.includes('beginner') || content.includes('入門') || content.includes('初心者') || duration < 15) {
      return 'beginner'
    }
    
    if (content.includes('advanced') || content.includes('expert') || content.includes('上級') || content.includes('専門') || duration > 60) {
      return 'advanced'
    }
    
    return 'intermediate'
  }

  // 言語検出
  private detectLanguage(title: string, description: string): string {
    const content = title + ' ' + description
    const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/
    
    return japaneseRegex.test(content) ? 'ja' : 'en'
  }

  // カテゴリ分類
  private categorizeContent(title: string, description: string): string[] {
    const content = (title + ' ' + description).toLowerCase()
    const categories: string[] = []
    
    const categoryKeywords = {
      'AI & Machine Learning': ['ai', 'artificial intelligence', 'machine learning', 'deep learning', '人工知能', '機械学習'],
      'Data Science': ['data', 'analytics', 'statistics', 'データ', '分析', '統計'],
      'Programming': ['programming', 'coding', 'python', 'javascript', 'プログラミング', 'コーディング'],
      'Business': ['business', 'strategy', 'management', 'ビジネス', '戦略', '経営'],
      'Design': ['design', 'ux', 'ui', 'デザイン']
    }
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => content.includes(keyword))) {
        categories.push(category)
      }
    }
    
    return categories.length > 0 ? categories : ['General']
  }

  // ターゲットオーディエンス判定
  private determineTargetAudience(title: string, description: string, diagnosisType?: string): {
    diagnosisTypes: string[]
    industries: string[]
    experienceLevels: string[]
  } {
    const content = (title + ' ' + description).toLowerCase()
    
    // 診断タイプ判定
    const typeKeywords = {
      FV: ['innovation', 'future', 'startup', 'イノベーション', '未来', '革新'],
      VA: ['analysis', 'data', 'research', '分析', 'データ', '調査'],
      HC: ['team', 'collaboration', 'management', 'チーム', '協働', '管理'],
      MB: ['system', 'automation', 'process', 'システム', '自動化', 'プロセス'],
      AT: ['learning', 'education', 'knowledge', '学習', '教育', '知識'],
      GS: ['strategy', 'business', 'planning', '戦略', 'ビジネス', '計画']
    }
    
    const diagnosisTypes: string[] = []
    if (diagnosisType) {
      diagnosisTypes.push(diagnosisType)
    } else {
      for (const [type, keywords] of Object.entries(typeKeywords)) {
        if (keywords.some(keyword => content.includes(keyword))) {
          diagnosisTypes.push(type)
        }
      }
    }
    
    return {
      diagnosisTypes: diagnosisTypes.length > 0 ? diagnosisTypes : ['FV', 'VA', 'HC', 'MB', 'AT', 'GS'],
      industries: ['Technology', 'Business', 'Education'], // デフォルト
      experienceLevels: ['beginner', 'intermediate', 'advanced']
    }
  }

  // ユーティリティ関数
  private removeDuplicates<T>(array: T[], key: keyof T): T[] {
    const seen = new Set()
    return array.filter(item => {
      const value = item[key]
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private getLastWeekISO(): string {
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    return lastWeek.toISOString()
  }
}

// シングルトンインスタンス
let contentCollectorInstance: ContentCollector | null = null

export function getContentCollector(): ContentCollector {
  if (!contentCollectorInstance) {
    contentCollectorInstance = new ContentCollector()
  }
  return contentCollectorInstance
}

export default ContentCollector