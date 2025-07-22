-- プレミアム診断アンロック管理テーブル
CREATE TABLE IF NOT EXISTS premium_unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL可（匿名ユーザー対応）
    session_id VARCHAR(255) NOT NULL UNIQUE, -- Stripe Checkout Session ID
    amount INTEGER NOT NULL DEFAULT 500, -- 決済金額（円）
    payment_status VARCHAR(50) NOT NULL DEFAULT 'completed', -- completed, failed, refunded
    stripe_customer_id VARCHAR(255), -- Stripe Customer ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_premium_unlocks_user_id ON premium_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_unlocks_session_id ON premium_unlocks(session_id);
CREATE INDEX IF NOT EXISTS idx_premium_unlocks_created_at ON premium_unlocks(created_at);

-- RLS設定
ALTER TABLE premium_unlocks ENABLE ROW LEVEL SECURITY;

-- RLSポリシー（ユーザーは自分のアンロック記録のみ閲覧可能）
CREATE POLICY "Users can view own premium unlocks" ON premium_unlocks 
FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- updated_atトリガー
CREATE TRIGGER update_premium_unlocks_updated_at 
BEFORE UPDATE ON premium_unlocks 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();