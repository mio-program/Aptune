# データベース設定確認チェックリスト

## premium_unlocks テーブル作成確認

### ✅ 実行すべきSQL
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

### ✅ 確認項目

#### 1. テーブル作成確認
- [ ] Supabase SQL Editorでエラーなく実行完了
- [ ] Table Editorで `premium_unlocks` テーブルが表示される
- [ ] 全カラムが正しく作成されている

#### 2. インデックス確認
- [ ] `idx_premium_unlocks_user_id` が作成されている
- [ ] `idx_premium_unlocks_session_id` が作成されている  
- [ ] `idx_premium_unlocks_created_at` が作成されている

#### 3. RLS設定確認
- [ ] Row Level Security が有効になっている
- [ ] ポリシー "Users can view own premium unlocks" が作成されている

#### 4. トリガー確認
- [ ] `update_premium_unlocks_updated_at` トリガーが作成されている
- [ ] `update_updated_at_column()` 関数が存在する

### 🔍 テスト用SQL

テーブルが正しく動作するかテスト：

```sql
-- テストデータ挿入
INSERT INTO premium_unlocks (session_id, amount, stripe_customer_id) 
VALUES ('cs_test_123456789', 500, 'cus_test_123');

-- データ確認
SELECT * FROM premium_unlocks;

-- テストデータ削除
DELETE FROM premium_unlocks WHERE session_id = 'cs_test_123456789';
```

### ⚠️ トラブルシューティング

#### エラー: `update_updated_at_column() does not exist`

以下の関数を先に作成：

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

#### エラー: `auth.users does not exist`

Supabase Authが有効になっているか確認：
1. Authentication → Settings
2. "Enable email confirmations" の設定確認

### 📋 次のステップ

データベース設定完了後：
1. ✅ premium_unlocks テーブル作成完了
2. 🔄 Vercelデプロイ実行
3. 🔄 Stripe Webhook URL設定
4. 🔄 決済フローテスト