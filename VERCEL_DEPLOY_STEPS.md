# Vercel デプロイ手順

## 1. GitHubリポジトリ準備

```bash
# 最新コードをコミット・プッシュ
git add .
git commit -m "Phase 3: デプロイ準備完了 - ビルドエラー修正、環境変数安全化"
git push origin main
```

## 2. Vercelプロジェクト作成

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. "New Project" をクリック
3. GitHubリポジトリを選択
4. プロジェクト名を設定（例：aptune-v2）
5. Framework Preset: Next.js を確認
6. Root Directory: そのまま
7. Build and Output Settings: デフォルト

## 3. 環境変数設定

Vercel Dashboard → Settings → Environment Variables で以下を設定：

### 必須環境変数

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qsvoiqtauhubtutfnezv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzdm9pcXRhdWh1YnR1dGZuZXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDk2OTAsImV4cCI6MjA2NjY4NTY5MH0.OcA6ytcErxmqkcj_JeYyhvUoVxyfAvLvZeJipw4fdZk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzdm9pcXRhdWh1YnR1dGZuZXp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTEwOTY5MCwiZXhwIjoyMDY2Njg1NjkwfQ.LJ_hT_pZ0IH6-T1DBPsCRV_6AYE6dcbPQN7V1heqs2w

# Stripe Configuration (本番キーに変更必要)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET

# App Configuration
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=22f81716e4f2f11beac7d1a672e3ebac4bccd24417f79fcf30732cc22c984dc0
```

### 環境変数設定手順

1. **Production** 環境を選択
2. 各環境変数を個別に追加
3. **重要**: Stripe本番キーは後で設定（まずはテストキーで動作確認）

## 4. 初回デプロイ実行

1. "Deploy" ボタンをクリック
2. デプロイ完了を待つ（約2-3分）
3. デプロイURLを確認・記録

## 5. デプロイ後確認

### 基本動作確認
- [ ] サイトアクセス確認
- [ ] ページ遷移確認
- [ ] 診断機能確認

### エラーチェック
- [ ] Vercel Function Logs確認
- [ ] ブラウザコンソールエラー確認
- [ ] 404エラーページ確認

## 6. ドメイン設定（オプション）

独自ドメインを使用する場合：

1. Vercel Dashboard → Settings → Domains
2. カスタムドメインを追加
3. DNS設定を更新
4. SSL証明書の自動発行を確認

## 7. 次のステップ

デプロイ成功後：
1. Stripe Webhook URL設定
2. 本番決済テスト
3. 監視・アラート設定

## トラブルシューティング

### よくある問題

1. **ビルドエラー**
   - 環境変数の設定確認
   - ローカルでのビルドテスト実行

2. **Runtime Error**
   - Vercel Function Logsを確認
   - Supabase接続確認

3. **404エラー**
   - next.config.mjsの設定確認
   - ルーティング設定確認

### サポートリソース

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Supabase + Vercel Integration](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)