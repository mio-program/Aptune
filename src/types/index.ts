// 共通型定義ファイル

// ユーザー関連の型
export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

// 診断関連の型
export interface DiagnosisResult {
  id: string
  user_id: string
  personality_type: string
  scores: Record<string, number>
  recommendations: string[]
  created_at: string
}

// 学習関連の型
export interface LearningPath {
  id: string
  title: string
  description: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  estimated_duration: number // 分単位
  modules: LearningModule[]
}

export interface LearningModule {
  id: string
  title: string
  content: string
  type: 'video' | 'text' | 'quiz' | 'exercise'
  duration: number
  order: number
}

// 支払い関連の型
export interface PaymentPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
}

// API レスポンス関連の型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// フォーム関連の型
export interface LoginForm {
  email: string
  password: string
}

export interface SignUpForm {
  email: string
  password: string
  confirmPassword: string
}

// 環境変数の型
export interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  STRIPE_SECRET_KEY?: string
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string
}