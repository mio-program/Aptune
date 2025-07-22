# Aptune MVP - 実装タスクリスト
**目標**: 週15時間 × 6週間で収益化可能なMVP完成

## 技術スタック（簡素化）
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth + Database + Storage)
- **State**: React Context + localStorage（Zustand不要）
- **Payment**: Stripe
- **Deploy**: Vercel
- **Testing**: 手動テスト（自動化は後回し）

## Phase 1: 基盤修正（2週間 - 30時間）

### 1. Supabase認証の修正
- [ ] 1.1 認証クライアント統一化
  - 既存の3つのSupabaseクライアント設定を1つに統合
  - src/lib/supabase.ts のみ残して他を削除
  - 基本的なエラーハンドリング追加
  - _Requirements: Requirement 1 (統一認証システム)_

- [ ] 1.2 認証ミドルウェア有効化
  - src/middleware.ts のコメントアウト部分を有効化
  - 保護ルート（/dashboard, /assessment/result）の認証チェック
  - 簡単なリダイレクト処理実装
  - _Requirements: Requirement 1 (統一認証システム)_

- [ ] 1.3 AuthContext修正
  - エラーハンドリング改善
  - ローディング状態の適切な管理
  - 基本的な型定義追加
  - _Requirements: Requirement 1 (統一認証システム)_

### 2. 基本的な型定義統一
- [ ] 2.1 共通型定義ファイル作成
  - src/types/index.ts 作成
  - User, Assessment, ContentItem の基本型定義
  - 既存コンポーネントでの型エラー修正
  - _Requirements: Requirement 10 (開発・運用効率化)_

- [ ] 2.2 環境変数検証
  - 必要最小限の環境変数チェック
  - SUPABASE_URL, SUPABASE_ANON_KEY, STRIPE_SECRET_KEY
  - 起動時エラーで停止する仕組み
  - _Requirements: Requirement 8 (包括的セキュリティ対策)_

### 3. 既存診断機能の動作確認
- [ ] 3.1 診断フロー修正
  - 既存の診断質問データ確認
  - 結果計算ロジックの動作確認
  - エラー発生箇所の修正
  - _Requirements: Requirement 2 (改善されたキャリア診断システム)_

- [ ] 3.2 診断結果表示修正
  - DiagnosisResult コンポーネントのエラー修正
  - 診断タイプデータの存在確認
  - 基本的な結果表示の動作確認
  - _Requirements: Requirement 2 (改善されたキャリア診断システム)_

## Phase 2: 収益化機能（3週間 - 45時間）

### 4. Stripe決済統合
- [ ] 4.1 Stripe Checkout実装
  - 既存のPaymentModalを実際のStripe Checkoutに接続
  - プレミアム診断（¥500）の決済フロー完成
  - 決済成功・失敗時の適切なリダイレクト
  - _Requirements: Requirement 8 (包括的セキュリティ対策)_

- [ ] 4.2 決済状態管理
  - ユーザーのプレミアム購入状態をSupabaseに保存
  - 決済完了後のプレミアムコンテンツアンロック
  - 簡単な決済履歴表示
  - _Requirements: Requirement 8 (包括的セキュリティ対策)_

- [ ] 4.3 Stripe Webhook実装
  - 決済完了通知の受信
  - データベースの購入状態��新
  - 基本的なエラーハンドリング
  - _Requirements: Requirement 8 (包括的セキュリティ対策)_

### 5. 診断結果PDF出力
- [ ] 5.1 PDF生成ライブラリ導入
  - react-pdf または jsPDF の導入
  - 基本的なPDFテンプレート作成
  - 診断結果データのPDF変換
  - _Requirements: Requirement 2 (改善されたキャリア診断システム)_

- [ ] 5.2 PDF出力機能実装
  - プレミアムユーザー向けPDFダウンロード機能
  - 診断結果の整形とレイアウト
  - ダウンロードボタンの実装
  - _Requirements: Requirement 2 (改善されたキャリア診断システム)_

### 6. 基本的なダッシュボード
- [ ] 6.1 ユーザーダッシュボード作成
  - /dashboard ページの基本実装
  - 診断履歴の表示
  - プレミアム購入状態の表示
  - _Requirements: Requirement 6 (統合ダッシュボード)_

- [ ] 6.2 プロフィール管理
  - 基本的なプロフィール編集機能
  - ユーザー情報の更新
  - アバター画像アップロード（Supabase Storage使用）
  - _Requirements: Requirement 6 (統合ダッシュボード)_

- [ ] 6.3 診断履歴管理
  - 過去の診断結果一覧表示
  - 診断結果の再表示機能
  - PDF再ダウンロード機能（プレミアムユーザー）
  - _Requirements: Requirement 6 (統合ダッシュボード)_

## Phase 3: デプロイ・本番環境（1週間 - 15時間）

### 7. 本番環境設定
- [ ] 7.1 Vercel デプロイ設定
  - Vercelプロジェクト作成
  - 環境変数設定
  - カスタムドメイン設定
  - _Requirements: Requirement 11 (高可用性システム)_

- [ ] 7.2 Supabase本番環境
  - 本番用Supabaseプロジェクト作成
  - データベーススキーマのデプロイ
  - RLS（Row Level Security）設定
  - _Requirements: Requirement 8 (包括的セキュリティ対策)_

- [ ] 7.3 Stripe本番設定
  - Stripe本番アカウント設定
  - Webhook URL設定
  - 決済テスト実行
  - _Requirements: Requirement 8 (包括的セキュリティ対策)_

### 8. 基本的な監視・エラー処理
- [ ] 8.1 エラー境界実装
  - React Error Boundary追加
  - 基本的なエラー表示UI
  - エラー発生時のフォールバック
  - _Requirements: Requirement 10 (開発・運用効率化)_

- [ ] 8.2 基本ログ収集
  - console.error の適切な配置
  - 決済エラーの記録
  - 認証エラーの記録
  - _Requirements: Requirement 10 (開発・運用効率化)_

### 9. 手動テスト・品質確認
- [ ] 9.1 機能テスト実行
  - 全機能の手動テスト実行
  - 決済フローの完全テスト
  - モバイル表示確認
  - _Requirements: Requirement 10 (開発・運用効率化)_

- [ ] 9.2 パフォーマンス基本チェック
  - ページ読み込み速度確認
  - 画像最適化確認
  - 基本的なSEO設定
  - _Requirements: Requirement 7 (レスポンス時間最適化)_

---

## 実装スケジュール（週15時間想定）

### Phase 1: 基盤修正（2週間）
- **Week 1**: Supabase認証修正 + 型定義統一（15時間）
- **Week 2**: 診断機能動作確認 + バグ修正（15時間）

### Phase 2: 収益化機能（3週間）  
- **Week 3**: Stripe決済統合（15時間）
- **Week 4**: PDF出力機能（15時間）
- **Week 5**: 基本ダッシュボード（15時間）

### Phase 3: デプロイ・本番環境（1週間）
- **Week 6**: 本番環境設定 + テスト（15時間）

**総開発時間**: 90時間（週15時間 × 6週間）
**収益化開始**: 6週間後

---

## 段階的改善計画

### 月収5万円達成後（追加2-3ヶ月）
- [ ] テスト自動化（Jest + React Testing Library）
- [ ] パフォーマンス最適化（画像最適化、キャッシュ）
- [ ] 基本的なSEO対策
- [ ] ユーザーフィードバック収集機能

### 月収20万円達成後（追加3-4ヶ月）
- [ ] AI機能追加（OpenAI API統合）
- [ ] 学習コンテンツ管理システム
- [ ] 高度な分析・レポート機能
- [ ] スケーラビリティ対応（Redis、負荷分散）

---

**承認者**: プロダクトオーナー  
**作成日**: 2025年1月22日  
**バージョン**: 2.0 (MVP)  
**目標**: 6週間で収益化開始

---

**承認者**: プロダクトオーナー、技術責任者  
**作成日**: 2025年1月22日  
**バージョン**: 1.0  
**次回レビュー予定**: 2025年2月5日