# InnerLog - キャリア診断プラットフォーム

InnerLogは、ユーザーの性格特性、スキル、価値観、興味を分析し、最適なキャリアパスを提案するAI駆動のキャリア診断プラットフォームです。

## 機能

- **認証システム**: Supabase Authを使用した安全なユーザー認証
- **キャリア診断**: 包括的な質問セットによる詳細な分析
- **結果分析**: AIによる個性に基づいたキャリアアドバイス
- **ダッシュボード**: 診断履歴と結果の管理
- **レスポンシブデザイン**: モバイル・デスクトップ対応

## 技術スタック

- **フロントエンド**: Next.js 14, React 18, TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL, Auth, Real-time)
- **認証**: Supabase Auth
- **決済**: Stripe (将来実装予定)

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`env.example`ファイルを参考に、`.env.local`ファイルを作成してください：

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration (将来実装予定)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabaseプロジェクトのセットアップ

1. [Supabase](https://supabase.com)で新しいプロジェクトを作成
2. プロジェクトのURLとanon keyを取得
3. SQL Editorで`database-setup.sql`を実行してデータベーススキーマを作成

### 4. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは [http://localhost:3000](http://localhost:3000) で起動します。

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # 認証ページ
│   ├── dashboard/         # ユーザーダッシュボード
│   ├── assessment/        # 診断関連ページ
│   └── layout.tsx         # ルートレイアウト
├── components/            # Reactコンポーネント
│   ├── sections/          # セクションコンポーネント
│   └── ui/               # UIコンポーネント
├── contexts/             # Reactコンテキスト
│   └── AuthContext.tsx   # 認証コンテキスト
├── data/                 # データ定義
│   └── assessment-questions.ts
├── lib/                  # ユーティリティライブラリ
│   ├── supabase.ts       # Supabaseクライアント（エクスポート）
│   ├── supabase-client.ts # クライアント用Supabase
│   ├── supabase-server.ts # サーバー用Supabase
│   ├── database.types.ts  # データベース型定義
│   ├── stripe.ts         # Stripe設定
│   └── assessment-analysis.ts
├── middleware.ts         # Supabase認証ミドルウェア
└── globals.css           # グローバルスタイル
```

## Supabaseクライアントの使用方法

### クライアントコンポーネントでの使用

```typescript
import { createClient } from '@/lib/supabase-client'

export default function MyClientComponent() {
  const supabase = createClient()
  
  // クライアントサイドでのSupabase操作
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'user@example.com',
      password: 'password'
    })
  }
}
```

### サーバーコンポーネントでの使用

```typescript
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function MyServerComponent() {
  const supabase = createServerSupabaseClient()
  
  // サーバーサイドでのSupabase操作
  const { data: user } = await supabase.auth.getUser()
  
  return <div>Hello, {user?.email}</div>
}
```

## データベーススキーマ

### users
- `id`: UUID (Primary Key)
- `email`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- `profile_completed`: BOOLEAN

### user_profiles
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key)
- `full_name`: TEXT
- `current_role`: TEXT
- `experience_years`: INTEGER
- `skills`: TEXT[]
- `industry`: TEXT
- `education`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### assessments
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key)
- `assessment_data`: JSONB
- `results`: JSONB
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## 診断システム

InnerLogの診断システムは以下の5つのカテゴリで構成されています：

1. **性格特性**: 適応性、チームワーク、リスク許容度
2. **スキル**: 分析力、コミュニケーション、問題解決力、創造性
3. **価値観**: 安定性、成長機会、社会的貢献、収入、ワークライフバランス
4. **興味・関心**: テクノロジー、医療、金融、教育、マーケティング、デザイン
5. **働き方**: リモートワーク、オフィス勤務、期限管理、マルタスク

## 開発ガイドライン

### コードスタイル
- TypeScriptを使用
- ESLintとPrettierでコードフォーマット
- コンポーネントは関数型コンポーネント
- カスタムフックでロジックを分離

### 認証
- Supabase Authを使用
- AuthContextで認証状態を管理
- 保護されたルートは認証チェックを実装
- ミドルウェアでセッション管理

### データベース
- Row Level Security (RLS) を有効化
- ユーザーは自分のデータのみアクセス可能
- 適切なインデックスを作成

### Supabaseクライアント
- クライアントコンポーネントでは `supabase-client.ts` を使用
- サーバーコンポーネントでは `supabase-server.ts` を使用
- 型安全性のために `database.types.ts` を活用

## デプロイ

### Vercel (推奨)
1. GitHubリポジトリをVercelに接続
2. 環境変数を設定
3. デプロイ

### その他のプラットフォーム
- Netlify
- Railway
- Heroku

## ライセンス

MIT License

## 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## サポート

質問や問題がある場合は、GitHubのIssuesページでお知らせください。
