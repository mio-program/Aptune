-- InnerLog Learning Platform Database Schema
-- AI時代のタイプ別学習コンテンツキュレーション機能

-- 1. ユーザー基本情報（既存のauth.usersに追加で管理）
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    diagnosis_type VARCHAR(10) NOT NULL, -- FV, VA, HC, MB, AT, GS
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 初回セットアップ情報
CREATE TABLE IF NOT EXISTS user_setup (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    industry VARCHAR(100) NOT NULL, -- 業界
    job_role VARCHAR(100) NOT NULL, -- 職種
    experience_level VARCHAR(50) NOT NULL, -- 経験レベル: beginner, intermediate, advanced
    learning_goals TEXT[], -- 学習目標配列
    preferred_content_types TEXT[] DEFAULT ARRAY['video', 'article', 'course'], -- 好みのコンテンツタイプ
    daily_learning_time INTEGER DEFAULT 30, -- 1日の学習時間（分）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 3. 学習コンテンツマスター
CREATE TABLE IF NOT EXISTS learning_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL, -- video, article, course, podcast
    source_platform VARCHAR(50) NOT NULL, -- youtube, udemy, coursera, custom
    source_url TEXT NOT NULL,
    source_id VARCHAR(255), -- YouTube動画ID等
    thumbnail_url TEXT,
    duration_minutes INTEGER, -- 動画の長さ等
    difficulty_level VARCHAR(50) NOT NULL, -- beginner, intermediate, advanced
    language VARCHAR(10) DEFAULT 'ja',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. コンテンツカテゴリ・タグ
CREATE TABLE IF NOT EXISTS content_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES content_categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. コンテンツとカテゴリ・タグの関連
CREATE TABLE IF NOT EXISTS content_category_mapping (
    content_id UUID REFERENCES learning_content(id) ON DELETE CASCADE,
    category_id UUID REFERENCES content_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, category_id)
);

CREATE TABLE IF NOT EXISTS content_tag_mapping (
    content_id UUID REFERENCES learning_content(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES content_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, tag_id)
);

-- 6. タイプ別コンテンツレコメンデーション設定
CREATE TABLE IF NOT EXISTS type_content_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagnosis_type VARCHAR(10) NOT NULL, -- FV, VA, HC, MB, AT, GS
    content_id UUID NOT NULL REFERENCES learning_content(id) ON DELETE CASCADE,
    relevance_score DECIMAL(3,2) NOT NULL DEFAULT 0.5, -- 0.0-1.0
    priority_rank INTEGER NOT NULL DEFAULT 100,
    industry VARCHAR(100), -- 特定業界向けの場合
    experience_level VARCHAR(50), -- 特定経験レベル向けの場合
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(diagnosis_type, content_id, industry, experience_level)
);

-- 7. コンテンツ品質評価・メタデータ
CREATE TABLE IF NOT EXISTS content_quality_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES learning_content(id) ON DELETE CASCADE,
    engagement_score DECIMAL(3,2) DEFAULT 0.5, -- エンゲージメント評価
    educational_value DECIMAL(3,2) DEFAULT 0.5, -- 教育的価値
    up_to_date_score DECIMAL(3,2) DEFAULT 0.5, -- 最新性
    ai_relevance_score DECIMAL(3,2) DEFAULT 0.5, -- AI時代関連度
    expert_rating DECIMAL(3,2), -- 専門家評価
    user_rating DECIMAL(3,2), -- ユーザー評価
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    last_quality_check TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(content_id)
);

-- 8. ユーザー学習履歴
CREATE TABLE IF NOT EXISTS user_learning_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES learning_content(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0, -- 0-100
    learning_time_minutes INTEGER DEFAULT 0,
    user_rating INTEGER, -- 1-5
    user_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 学習プラン（AI生成カスタムプラン）
CREATE TABLE IF NOT EXISTS user_learning_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_name VARCHAR(200) NOT NULL,
    description TEXT,
    target_skills TEXT[], -- 目標スキル配列
    estimated_duration_weeks INTEGER,
    difficulty_level VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. 学習プランコンテンツ（プランに含まれるコンテンツ）
CREATE TABLE IF NOT EXISTS learning_plan_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES user_learning_plans(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES learning_content(id) ON DELETE CASCADE,
    sequence_order INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    estimated_completion_days INTEGER DEFAULT 7,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(plan_id, content_id)
);

-- 11. サブスクリプション・プラン管理
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_name VARCHAR(100) NOT NULL UNIQUE,
    price_monthly DECIMAL(10,2) NOT NULL,
    daily_content_limit INTEGER, -- NULL = unlimited
    features JSONB, -- プラン機能をJSONで管理
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. ユーザーサブスクリプション
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, cancelled, expired
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, plan_id, started_at)
);

-- 13. 日次学習統計（使用制限管理）
CREATE TABLE IF NOT EXISTS daily_learning_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    content_accessed_count INTEGER DEFAULT 0,
    learning_time_minutes INTEGER DEFAULT 0,
    completed_content_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 14. AIレコメンデーションログ
CREATE TABLE IF NOT EXISTS ai_recommendation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES learning_content(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(100) NOT NULL, -- type_based, behavior_based, trending
    recommendation_score DECIMAL(3,2) NOT NULL,
    context_data JSONB, -- レコメンデーション時のコンテキスト情報
    user_interaction VARCHAR(50), -- clicked, viewed, completed, skipped
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. 外部API統合管理
CREATE TABLE IF NOT EXISTS external_api_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL UNIQUE, -- youtube, twitter, udemy
    api_endpoint TEXT NOT NULL,
    api_version VARCHAR(20),
    rate_limit_per_hour INTEGER,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    config_data JSONB, -- API固有の設定
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成（パフォーマンス最適化）
CREATE INDEX IF NOT EXISTS idx_user_profiles_diagnosis_type ON user_profiles(diagnosis_type);
CREATE INDEX IF NOT EXISTS idx_learning_content_source_platform ON learning_content(source_platform);
CREATE INDEX IF NOT EXISTS idx_learning_content_difficulty ON learning_content(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_type_content_recommendations_type ON type_content_recommendations(diagnosis_type);
CREATE INDEX IF NOT EXISTS idx_type_content_recommendations_score ON type_content_recommendations(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_learning_history_user_content ON user_learning_history(user_id, content_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_history_completed ON user_learning_history(completed_at);
CREATE INDEX IF NOT EXISTS idx_daily_learning_stats_user_date ON daily_learning_stats(user_id, date);
CREATE INDEX IF NOT EXISTS idx_ai_recommendation_logs_user_created ON ai_recommendation_logs(user_id, created_at);

-- RLS (Row Level Security) 設定
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_learning_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendation_logs ENABLE ROW LEVEL SECURITY;

-- RLSポリシー（ユーザーは自分のデータのみアクセス可能）
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own setup" ON user_setup FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own setup" ON user_setup FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own setup" ON user_setup FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own learning history" ON user_learning_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own learning history" ON user_learning_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own learning history" ON user_learning_history FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own learning plans" ON user_learning_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify own learning plans" ON user_learning_plans FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own daily stats" ON daily_learning_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify own daily stats" ON daily_learning_stats FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own recommendation logs" ON ai_recommendation_logs FOR SELECT USING (auth.uid() = user_id);

-- 初期データ投入
INSERT INTO subscription_plans (plan_name, price_monthly, daily_content_limit, features) VALUES
('Free', 0.00, 3, '{"ai_recommendations": true, "basic_analytics": true}'),
('Premium', 980.00, NULL, '{"ai_recommendations": true, "advanced_analytics": true, "custom_learning_plans": true, "priority_support": true, "offline_content": true}')
ON CONFLICT (plan_name) DO NOTHING;

-- 初期カテゴリ作成
INSERT INTO content_categories (name, description) VALUES
('AI & Machine Learning', 'AI・機械学習関連コンテンツ'),
('Data Science', 'データサイエンス・分析'),
('Programming', 'プログラミング・開発'),
('Business Strategy', 'ビジネス戦略・経営'),
('Leadership', 'リーダーシップ・マネジメント'),
('Design & UX', 'デザイン・UX/UI'),
('Marketing', 'マーケティング・集客'),
('Finance', '金融・投資・会計'),
('Personal Development', '自己啓発・キャリア'),
('Industry Trends', '業界動向・トレンド')
ON CONFLICT (name) DO NOTHING;

-- トリガー関数（updated_at自動更新）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_atトリガー設定
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_setup_updated_at BEFORE UPDATE ON user_setup FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_content_updated_at BEFORE UPDATE ON learning_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_type_content_recommendations_updated_at BEFORE UPDATE ON type_content_recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_quality_metrics_updated_at BEFORE UPDATE ON content_quality_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_learning_history_updated_at BEFORE UPDATE ON user_learning_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_learning_plans_updated_at BEFORE UPDATE ON user_learning_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_learning_stats_updated_at BEFORE UPDATE ON daily_learning_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_external_api_configs_updated_at BEFORE UPDATE ON external_api_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();