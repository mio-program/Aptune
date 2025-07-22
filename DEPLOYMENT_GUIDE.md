# APTune v2 デプロイメントガイド

## Phase 3: 本番環境デプロイ準備

### 1. 環境変数設定

#### Vercel環境変数設定
以下の環境変数をVercelダッシュボードで設定してください：

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qsvoiqtauhubtutfnezv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzdm9pcXRhdWh1YnR1dGZuZXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDk2OTAsImV4cCI6MjA2NjY4NTY5MH0.OcA6ytcErxmqkcj_JeYyhvUoVxyfAvLvZeJipw4fdZk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzdm9pcXRhdWh1YnR1dGZuZXp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTEwOTY5MCwiZXhwIjoyMDY2Njg1NjkwfQ.LJ_hT_pZ0IH6-T1DBPsCRV_6AYE6dcbPQN7V1heqs2w

# Stripe Configuration (本番キーに変更)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET

# App Configuration
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your_secure_random_string_for_production
```

#### Stripe本番キー取得手順
1. Stripe Dashboard → Developers → API keys
2. "View live data" トグルをONにする
3. Publishable key と Secret key をコピー
4. Webhook secret は後で設定

### 2. データベース設定

#### premium_unlocks テーブル作成
Supabase SQL Editorで以下を実行：

```sql
-- プレミアム診断アンロック管理テーブル
CREATE TABLE IF NOT EXISTS premium_unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    amount INTEGER NOT NULL DEFAULT 500,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'completed',
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_premium_unlocks_user_id ON premium_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_unlocks_session_id ON premium_unlocks(session_id);
CREATE INDEX IF NOT EXISTS idx_premium_unlocks_created_at ON premium_unlocks(created_at);

-- RLS設定
ALTER TABLE premium_unlocks ENABLE ROW LEVEL SECURITY;

-- RLSポリシー
CREATE POLICY "Users can view own premium unlocks" ON premium_unlocks 
FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- updated_atトリガー
CREATE TRIGGER update_premium_unlocks_updated_at 
BEFORE UPDATE ON premium_unlocks 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. Vercelデプロイ

#### 初回デプロイ手順
1. GitHub リポジトリをVercelに接続
2. 環境変数を設定
3. デプロイ実行

```bash
# ローカルでビルドテスト
npm run build

# Vercel CLIを使用する場合
npx vercel --prod
```

### 4. Stripe Webhook設定

#### 本番Webhook URL設定
1. アプリがデプロイされた後、URLを確認
2. Stripe Dashboard → Developers → Webhooks
3. "Add endpoint" をクリック
4. Endpoint URL: `https://your-app-name.vercel.app/api/webhooks/stripe`
5. Events to send:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
6. Webhook signing secret をコピーして環境変数に設定

### 5. デプロイ後確認事項

#### 機能テスト
- [ ] ユーザー登録・ログイン
- [ ] 診断機能
- [ ] 決済フロー（テストモード）
- [ ] PDF生成
- [ ] Webhook受信

#### 本番決済テスト
- [ ] 実際の決済フロー確認
- [ ] Webhook正常動作確認
- [ ] プレミアム機能アンロック確認

### 6. 監視・メンテナンス

#### ログ監視
- Vercel Function Logs
- Stripe Dashboard Events
- Supabase Logs

#### 定期確認事項
- 決済成功率
- エラーログ
- パフォーマンス指標