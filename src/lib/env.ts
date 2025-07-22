// 環境変数の検証とタイプセーフなアクセス

import { EnvConfig } from '@/types'

// 必須の環境変数をチェック
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
] as const

// 環境変数の検証
function validateEnv(): EnvConfig {
  const missingVars: string[] = []
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar)
    }
  }
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    )
  }
  
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  }
}

// 検証済みの環境変数をエクスポート
export const env = validateEnv()

// 個別の環境変数へのアクセス用ヘルパー
export const getEnvVar = (key: keyof EnvConfig): string => {
  const value = env[key]
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`)
  }
  return value
}

// 開発環境かどうかの判定
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'

// Supabase設定の取得
export const getSupabaseConfig = () => ({
  url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
})

// Stripe設定の取得（オプション）
export const getStripeConfig = () => ({
  secretKey: env.STRIPE_SECRET_KEY,
  publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
})