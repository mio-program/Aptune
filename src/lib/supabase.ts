import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// 環境変数の検証
function validateEnvVars() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'

  // 実際のデプロイ時のみ厳密にチェック（ビルド時は緩和）
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && (supabaseUrl.includes('dummy') || supabaseAnonKey.includes('dummy'))) {
    console.warn('Missing required Supabase environment variables in production')
  }

  return { supabaseUrl, supabaseAnonKey }
}

// ブラウザ用クライアント（Client Components用）
export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = validateEnvVars()
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// サーバー用クライアント（Server Components用）
export async function createServerSupabaseClient() {
  const { supabaseUrl, supabaseAnonKey } = validateEnvVars()
  const { cookies } = await import('next/headers')
  const cookieStore = cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

// ミドルウェア用クライアント
export function createMiddlewareClient(request: NextRequest) {
  const { supabaseUrl, supabaseAnonKey } = validateEnvVars()
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({
          name,
          value,
          ...options,
        })
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.set({
          name,
          value,
          ...options,
        })
      },
      remove(name: string, options: any) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        })
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.set({
          name,
          value: '',
          ...options,
        })
      },
    },
  })

  return { supabase, response }
}

// サービス用クライアント（管理者操作用）
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co'
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-service-key'

  // 実際のデプロイ時のみ厳密にチェック（ビルド時は緩和）
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && (supabaseUrl.includes('dummy') || serviceKey.includes('dummy'))) {
    console.warn('Missing Supabase service role key in production')
  }

  return createSupabaseClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
} 