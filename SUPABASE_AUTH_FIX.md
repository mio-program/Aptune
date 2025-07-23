# Supabase Auth設定修正ガイド

## 🚨 問題: ユーザー登録・ログインで「Failed to fetch」エラー

## 🔧 修正手順

### ステップ1: Supabase Auth設定確認

1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. プロジェクト「qsvoiqtauhubtutfnezv」を選択
3. 左サイドバー「**Authentication**」→「**Settings**」をクリック

### ステップ2: Site URL設定

**Site URL** セクションで以下を設定：

```
Site URL: https://aptune-v2.vercel.app
```

### ステップ3: Redirect URLs設定

**Redirect URLs** セクションに以下を追加：

```
https://aptune-v2.vercel.app/auth/callback
https://aptune-v2.vercel.app/dashboard
https://aptune-v2.vercel.app/
```

### ステップ4: Email Settings確認

**Email** タブで以下を確認：
- [ ] **Enable email confirmations** がON
- [ ] **Enable email change confirmations** がON
- [ ] **Enable secure email change** がON

### ステップ5: Auth Providers確認

**Providers** タブで以下を確認：
- [ ] **Email** プロバイダーが有効
- [ ] **Enable email signup** がON

## 🔍 追加確認項目

### RLS (Row Level Security) 設定
1. 左サイドバー「**Table Editor**」をクリック
2. `auth.users` テーブルが存在することを確認
3. `premium_unlocks` テーブルのRLS設定確認

### API Keys確認
1. 左サイドバー「**Settings**」→「**API**」
2. **anon public** キーが環境変数と一致することを確認
3. **service_role** キーが環境変数と一致することを確認