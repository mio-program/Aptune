# Stripe Webhook設定ガイド

## 🎯 目的
Vercelデプロイ完了後、Stripe Webhookを設定して決済機能を有効化

## 📋 前提条件
- [x] Vercelデプロイ完了
- [x] デプロイURL確認済み
- [ ] Stripe本番キー取得
- [ ] Webhook URL設定

## 🔧 設定手順

### ステップ1: Stripe Dashboard アクセス
1. [Stripe Dashboard](https://dashboard.stripe.com/) にログイン
2. 左サイドバー「Developers」→「Webhooks」をクリック

### ステップ2: Webhook エンドポイント作成
1. **"Add endpoint"** ボタンをクリック
2. **Endpoint URL** に以下を入力：
   ```
   https://[YOUR_VERCEL_URL]/api/webhooks/stripe
   ```
   例：`https://aptune-v2.vercel.app/api/webhooks/stripe`

3. **Events to send** で以下を選択：
   - [x] `checkout.session.completed`
   - [x] `payment_intent.succeeded`
   - [x] `payment_intent.payment_failed`

4. **"Add endpoint"** をクリック

### ステップ3: Webhook Secret取得
1. 作成されたWebhookをクリック
2. **"Signing secret"** セクションで **"Reveal"** をクリック
3. `whsec_...` で始まるシークレットをコピー

### ステップ4: Vercel環境変数更新
1. Vercel Dashboard → プロジェクト → Settings → Environment Variables
2. `STRIPE_WEBHOOK_SECRET` を追加/更新
3. 値に上記でコピーしたシークレットを設定
4. **"Save"** をクリック

### ステップ5: 再デプロイ
1. Vercel Dashboard → Deployments
2. **"Redeploy"** をクリック（環境変数変更を反映）

## ✅ 動作確認

### テスト決済実行
1. デプロイされたサイトで診断を完了
2. 決済ページで **テスト決済** を実行
3. Stripe Dashboard → Events でWebhook受信確認

### 確認項目
- [ ] Webhook URL が正しく設定されている
- [ ] イベントが正しく選択されている
- [ ] Webhook Secret が設定されている
- [ ] テスト決済でWebhookが受信される
- [ ] プレミアム機能がアンロックされる

## 🚨 トラブルシューティング

### Webhook が受信されない場合
1. Vercel Function Logs を確認
2. Stripe Dashboard → Webhooks → Attempts で配信状況確認
3. URL の typo がないか確認

### 決済は成功するがアンロックされない場合
1. データベースの `premium_unlocks` テーブル確認
2. Webhook処理のログ確認
3. RLSポリシーの設定確認