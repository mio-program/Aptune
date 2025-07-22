// YouTube Data API v3 Integration
// コンテンツ収集・品質評価システム

export interface YouTubeVideoInfo {
  id: string
  title: string
  description: string
  channelTitle: string
  channelId: string
  publishedAt: string
  thumbnails: {
    default: { url: string; width: number; height: number }
    medium: { url: string; width: number; height: number }
    high: { url: string; width: number; height: number }
  }
  duration: string // ISO 8601 format (PT4M13S)
  viewCount: string
  likeCount: string
  commentCount: string
  categoryId: string
  tags?: string[]
  defaultLanguage?: string
  defaultAudioLanguage?: string
}

export interface ContentQualityScore {
  engagementScore: number // 0-1
  educationalValue: number // 0-1
  upToDateScore: number // 0-1
  aiRelevanceScore: number // 0-1
  overallScore: number // 0-1
}

class YouTubeAPIService {
  private apiKey: string
  private baseUrl = 'https://www.googleapis.com/youtube/v3'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // キーワード検索でAI関連動画を取得
  async searchVideos(
    query: string,
    maxResults: number = 50,
    order: 'relevance' | 'date' | 'rating' | 'viewCount' = 'relevance',
    publishedAfter?: string // ISO 8601 format
  ): Promise<YouTubeVideoInfo[]> {
    try {
      const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: maxResults.toString(),
        order,
        key: this.apiKey,
        ...(publishedAfter && { publishedAfter })
      })

      const response = await fetch(`${this.baseUrl}/search?${params}`)
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`)
      }

      const data = await response.json()
      const videoIds = data.items.map((item: any) => item.id.videoId).join(',')

      // 詳細情報を取得
      return this.getVideoDetails(videoIds)
    } catch (error) {
      console.error('Error searching YouTube videos:', error)
      throw error
    }
  }

  // 動画の詳細情報を取得
  async getVideoDetails(videoIds: string): Promise<YouTubeVideoInfo[]> {
    try {
      const params = new URLSearchParams({
        part: 'snippet,contentDetails,statistics',
        id: videoIds,
        key: this.apiKey
      })

      const response = await fetch(`${this.baseUrl}/videos?${params}`)
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`)
      }

      const data = await response.json()
      
      return data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt,
        thumbnails: item.snippet.thumbnails,
        duration: item.contentDetails.duration,
        viewCount: item.statistics.viewCount || '0',
        likeCount: item.statistics.likeCount || '0',
        commentCount: item.statistics.commentCount || '0',
        categoryId: item.snippet.categoryId,
        tags: item.snippet.tags,
        defaultLanguage: item.snippet.defaultLanguage,
        defaultAudioLanguage: item.snippet.defaultAudioLanguage
      }))
    } catch (error) {
      console.error('Error getting YouTube video details:', error)
      throw error
    }
  }

  // チャンネルの最新動画を取得
  async getChannelVideos(
    channelId: string,
    maxResults: number = 50
  ): Promise<YouTubeVideoInfo[]> {
    try {
      const params = new URLSearchParams({
        part: 'snippet',
        channelId,
        type: 'video',
        maxResults: maxResults.toString(),
        order: 'date',
        key: this.apiKey
      })

      const response = await fetch(`${this.baseUrl}/search?${params}`)
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`)
      }

      const data = await response.json()
      const videoIds = data.items.map((item: any) => item.id.videoId).join(',')

      return this.getVideoDetails(videoIds)
    } catch (error) {
      console.error('Error getting channel videos:', error)
      throw error
    }
  }

  // 動画の時間をミニッツに変換
  parseDuration(isoDuration: string): number {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    const matches = regex.exec(isoDuration)
    
    if (!matches) return 0
    
    const hours = parseInt(matches[1] || '0')
    const minutes = parseInt(matches[2] || '0')
    const seconds = parseInt(matches[3] || '0')
    
    return hours * 60 + minutes + Math.ceil(seconds / 60)
  }

  // コンテンツ品質スコアを計算
  calculateQualityScore(video: YouTubeVideoInfo): ContentQualityScore {
    const viewCount = parseInt(video.viewCount)
    const likeCount = parseInt(video.likeCount)
    const commentCount = parseInt(video.commentCount)
    const duration = this.parseDuration(video.duration)
    
    // エンゲージメントスコア（いいね率・コメント率）
    const likeRatio = viewCount > 0 ? likeCount / viewCount : 0
    const commentRatio = viewCount > 0 ? commentCount / viewCount : 0
    const engagementScore = Math.min((likeRatio * 100 + commentRatio * 1000) * 10, 1)

    // 教育的価値（タイトル・説明文のキーワード分析）
    const educationalKeywords = [
      'tutorial', 'learn', 'guide', 'how to', 'explanation', 'course',
      'チュートリアル', '学習', 'ガイド', '解説', '講座', '入門'
    ]
    const title = video.title.toLowerCase()
    const description = video.description.toLowerCase()
    const keywordCount = educationalKeywords.filter(keyword => 
      title.includes(keyword) || description.includes(keyword)
    ).length
    const educationalValue = Math.min(keywordCount / educationalKeywords.length * 2, 1)

    // 最新性（公開日から計算）
    const publishedDate = new Date(video.publishedAt)
    const daysSincePublished = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)
    const upToDateScore = Math.max(1 - daysSincePublished / 365, 0.1)

    // AI関連性（タイトル・説明文のAIキーワード分析）
    const aiKeywords = [
      'ai', 'artificial intelligence', 'machine learning', 'deep learning',
      'neural network', 'chatgpt', 'automation', 'data science',
      'AI', '人工知能', '機械学習', 'ディープラーニング', '自動化', 'データサイエンス'
    ]
    const aiKeywordCount = aiKeywords.filter(keyword => 
      title.includes(keyword) || description.includes(keyword)
    ).length
    const aiRelevanceScore = Math.min(aiKeywordCount / aiKeywords.length * 3, 1)

    // 総合スコア
    const overallScore = (
      engagementScore * 0.3 +
      educationalValue * 0.25 +
      upToDateScore * 0.2 +
      aiRelevanceScore * 0.25
    )

    return {
      engagementScore: Math.round(engagementScore * 100) / 100,
      educationalValue: Math.round(educationalValue * 100) / 100,
      upToDateScore: Math.round(upToDateScore * 100) / 100,
      aiRelevanceScore: Math.round(aiRelevanceScore * 100) / 100,
      overallScore: Math.round(overallScore * 100) / 100
    }
  }
}

// AI学習コンテンツ専用の検索クエリ
export const AI_LEARNING_QUERIES = {
  // 汎用AI学習
  general: [
    'AI 入門 tutorial',
    'machine learning basics',
    'artificial intelligence course',
    'AI活用 ビジネス',
    'ChatGPT 使い方'
  ],
  
  // タイプ別クエリ
  FV: [ // Future Visionary
    'AI innovation strategy',
    'future technology trends',
    'AI startup ideas',
    'AI イノベーション 戦略',
    'AI 未来予測'
  ],
  
  VA: [ // Void Analyst
    'data analysis AI',
    'machine learning analytics',
    'AI data science',
    'AI データ分析',
    '機械学習 分析手法'
  ],
  
  HC: [ // Harmony Coordinator
    'AI team collaboration',
    'AI human resources',
    'AI communication tools',
    'AI チーム運営',
    'AI 人材育成'
  ],
  
  MB: [ // Matrix Builder
    'AI automation tools',
    'AI workflow optimization',
    'AI process improvement',
    'AI 業務改善',
    'AI 自動化 実装'
  ],
  
  AT: [ // Akashic Traveler
    'AI learning methods',
    'AI education technology',
    'AI knowledge management',
    'AI 学習法',
    'AI 知識獲得'
  ],
  
  GS: [ // Grand Strategist
    'AI business strategy',
    'AI strategic planning',
    'AI digital transformation',
    'AI 経営戦略',
    'AI デジタル変革'
  ]
}

// 高品質チャンネルリスト（定期的に更新）
export const RECOMMENDED_CHANNELS = {
  ai_general: [
    'UCBfYHVIIGM_J1K0VGEcEVjQ', // AI Explained
    'UCUzGOj2C0l9KnpOvSS3qv7Q', // Two Minute Papers
    'UCkRfkJVY8xIpz1Qp02Lj5Gw'  // Yannic Kilcher
  ],
  
  japanese: [
    'UC4LoEOFLYaKhJGn2w_7TpWw', // 予備校のノリで学ぶ「大学の数学・物理」
    'UCIRy4sfGqgaJYGLG6GsrfMg'  // キカガク
  ],
  
  business: [
    'UCnKE3BzuEE91j8xFVbJM8rg', // Stanford Graduate School of Business
    'UCqZQJ4600a9wIfMPbYc60OQ'  // Harvard Business Review
  ]
}

// API呼び出し制限管理
export class YouTubeAPIRateLimiter {
  private callCount = 0
  private resetTime = Date.now() + 24 * 60 * 60 * 1000 // 24時間後
  private maxCallsPerDay = 10000 // YouTube API quota

  canMakeCall(): boolean {
    if (Date.now() > this.resetTime) {
      this.callCount = 0
      this.resetTime = Date.now() + 24 * 60 * 60 * 1000
    }
    
    return this.callCount < this.maxCallsPerDay
  }

  recordCall(): void {
    this.callCount++
  }

  getRemainingCalls(): number {
    return Math.max(this.maxCallsPerDay - this.callCount, 0)
  }
}

// メイン関数：YouTube APIサービスのインスタンス化
export function createYouTubeService(): YouTubeAPIService | null {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY
  
  if (!apiKey) {
    console.warn('YouTube API key not found. YouTube integration will be disabled.')
    return null
  }
  
  return new YouTubeAPIService(apiKey)
}

export default YouTubeAPIService