# APTune v2 デプロイメントチェックリスト

## Phase 3: 本番環境デプロイ準備

### ✅ 事前準備完了項目
- [x] MVP機能実装完了
- [x] ローカル環境での動作確認
- [x] 決済フロー動作確認
- [x] PDF生成機能確認
- [x] ビルドテスト成功
- [x] localStorage使用箇所の安全化
- [x] Supabase環境変数の安全化
- [x] 動的レンダリング設定完了

### 🔄 実行中の作業

#### 1. 環境変数設定
- [ ] **Stripe本番キー取得**
  - [ ] Stripe Dashboard → Developers → API keys
  - [ ] "View live data" トグルをON
  - [ ] Publishable key をコピー
  - [ ] Secret key をコピー
  
- [ ] **Vercel環境変数設定**
  ```bash
  # 以下をVercelダッシュボードで設定
  NEXT_PUBLIC_SUPABASE_URL=https://qsvoiqtauhubtutfnezv.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[YOUR_LIVE_KEY]
  STRIPE_SECRET_KEY=sk_live_[YOUR_LIVE_KEY]
  NEXTAUTH_URL=https://[YOUR_APP_NAME].vercel.app
  NEXTAUTH_SECRET=22f81716e4f2f11beac7d1a672e3ebac4bccd24417f79fcf30732cc22c984dc0
  ```

#### 2. データベース設定
- [ ] **premium_unlocks テーブル作成**
  - [ ] Supabase SQL Editorにアクセス
  - [ ] `database/premium_unlocks_table.sql` を実行
  - [ ] テーブル作成確認
  - [ ] RLS設定確認

#### 3. Vercelデプロイ
- [ ] **ビルドテスト**
  ```bash
  npm run build
  ```
- [ ] **GitHubリポジトリ準備**
  - [ ] 最新コードをpush
  - [ ] main/masterブランチ確認
  
- [ ] **Vercelプロジェクト作成**
  - [ ] Vercel Dashboard → New Project
  - [ ] GitHubリポジトリ接続
  - [ ] 環境変数設定
  - [ ] デプロイ実行

#### 4. Stripe Webhook設定
- [ ] **デプロイURL確認**
  - [ ] Vercelデプロイ完了後、URLを記録
  
- [ ] **Webhook エンドポイント作成**
  - [ ] Stripe Dashboard → Developers → Webhooks
  - [ ] "Add endpoint" クリック
  - [ ] URL: `https://[YOUR_APP].vercel.app/api/webhooks/stripe`
  - [ ] Events選択:
    - [x] `checkout.session.completed`
    - [x] `payment_intent.succeeded`
  - [ ] Webhook作成
  
- [ ] **Webhook Secret設定**
  - [ ] Webhook signing secretをコピー
  - [ ] Vercel環境変数に `STRIPE_WEBHOOK_SECRET` を追加
  - [ ] 再デプロイ

### 5. デプロイ後テスト
- [ ] **基本機能テスト**
  - [ ] サイトアクセス確認
  - [ ] ユーザー登録・ログイン
  - [ ] 診断機能動作確認
  
- [ ] **決済フローテスト（テストモード）**
  - [ ] 決済ページアクセス
  - [ ] テスト決済実行
  - [ ] Webhook受信確認
  - [ ] プレミアム機能アンロック確認
  
- [ ] **本番決済テスト**
  - [ ] 少額での実決済テスト
  - [ ] 決済完了確認
  - [ ] PDF生成確認
  - [ ] 返金テスト

### 6. 監視設定
- [ ] **ログ監視設定**
  - [ ] Vercel Function Logs確認
  - [ ] Stripe Dashboard Events監視
  - [ ] Supabase Logs確認
  
- [ ] **アラート設定**
  - [ ] 決済失敗アラート
  - [ ] エラー率監視
  - [ ] パフォーマンス監視

## 🚨 重要な注意事項

### セキュリティ
- 本番キーは絶対にコードにコミットしない
- 環境変数のみで管理
- Webhook secretは必ず設定

### テスト
- 本番決済前に必ずテストモードで確認
- 少額での実決済テストを実施
- 返金機能も事前テスト

### バックアップ
- デプロイ前にデータベースバックアップ
- 設定ファイルのバックアップ

## 📞 サポート情報
- Stripe サポート: https://support.stripe.com/
- Vercel サポート: https://vercel.com/help
- Supabase サポート: https://supabase.com/docs