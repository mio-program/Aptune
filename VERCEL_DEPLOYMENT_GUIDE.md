# Vercel デプロイメントガイド

## 🚀 ステップ1: Vercelプロジェクト作成

### 1. Vercel Dashboardにアクセス
- [Vercel Dashboard](https://vercel.com/dashboard) を開く
- GitHubアカウントでログイン

### 2. 新規プロジェクト作成
1. **"New Project"** ボタンをクリック
2. **"Import Git Repository"** セクションで
3. **"mio-program/Aptune"** リポジトリを選択
4. **"Import"** をクリック

### 3. プロジェクト設定
- **Project Name**: `aptune-v2` (または任意の名前)
- **Framework Preset**: `Next.js` (自動検出)
- **Root Directory**: `.` (デフォルト)
- **Build and Output Settings**: デフォルトのまま

## 🔧 ステップ2: 環境変数設定

**重要**: デプロイ前に環境変数を設定する必要があります

### 必須環境変数一覧

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qsvoiqtauhubtutfnezv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzdm9pcXRhdWh1YnR1dGZuZXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDk2OTAsImV4cCI6MjA2NjY4NTY5MH0.OcA6ytcErxmqkcj_JeYyhvUoVxyfAvLvZeJipw4fdZk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzdm9pcXRhdWh1YnR1dGZuZXp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTEwOTY5MCwiZXhwIjoyMDY2Njg1NjkwfQ.LJ_hT_pZ0IH6-T1DBPsCRV_6AYE6dcbPQN7V1heqs2w

# Stripe Configuration (テストキーから開始)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# App Configuration
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=22f81716e4f2f11beac7d1a672e3ebac4bccd24417f79fcf30732cc22c984dc0
```

### 環境変数設定手順
1. プロジェクト作成画面で **"Configure Project"** をクリック
2. **"Environment Variables"** セクションを展開
3. 上記の環境変数を一つずつ追加

## 🎯 ステップ3: 初回デプロイ

1. 環境変数設定完了後、**"Deploy"** をクリック
2. デプロイ進行状況を確認（約2-3分）
3. **"Congratulations!"** 画面でデプロイURL確認

## ✅ ステップ4: デプロイ後確認

### 基本動作確認
- [ ] サイトアクセス確認
- [ ] トップページ表示確認
- [ ] 診断ページアクセス確認