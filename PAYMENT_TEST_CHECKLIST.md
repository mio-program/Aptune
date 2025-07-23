# 決済フローテストチェックリスト

## 🎯 テスト目的
- 診断から決済までの完全なフローが動作することを確認
- Stripe Webhookが正常に動作することを確認
- プレミアム機能のアンロックが正常に動作することを確認

## ✅ テスト手順

### ステップ1: 診断完了
- [ ] https://aptune-v2.vercel.app/assessment にアクセス
- [ ] 診断を最後まで完了
- [ ] 結果ページが正常に表示される
- [ ] 「プレミアム診断」ボタンが表示される

### ステップ2: 決済ページ確認
- [ ] 「プレミアム診断」ボタンをクリック
- [ ] Stripe決済ページにリダイレクトされる
- [ ] 金額が正しく表示される（500円）
- [ ] 決済フォームが正常に表示される

### ステップ3: テスト決済実行
**テストカード情報:**
```
カード番号: 4242 4242 4242 4242
有効期限: 12/34
CVC: 123
郵便番号: 12345
```

- [ ] テストカード情報を入力
- [ ] 「支払う」ボタンをクリック
- [ ] 決済処理が完了する
- [ ] 成功ページにリダイレクトされる

### ステップ4: Webhook動作確認
- [ ] Stripe Dashboard → Events でWebhook受信を確認
- [ ] `checkout.session.completed` イベントが記録されている
- [ ] Webhook配信が成功している（200 OK）

### ステップ5: プレミアム機能確認
- [ ] 決済完了後、プレミアム機能がアンロックされる
- [ ] PDF生成機能が利用可能になる
- [ ] データベースに決済記録が保存される

## 🚨 トラブルシューティング

### 決済ページが表示されない場合
1. ブラウザコンソールエラーを確認
2. Vercel Function Logsを確認
3. Stripe環境変数設定を再確認

### Webhookが受信されない場合
1. Stripe Dashboard → Webhooks → Attempts を確認
2. Webhook URL が正しいか確認
3. Vercel Function Logsでエラー確認

### プレミアム機能がアンロックされない場合
1. データベースの `premium_unlocks` テーブル確認
2. Webhook処理ログ確認
3. ユーザーIDの紐付け確認

## 📊 確認すべきログ

### Vercel Function Logs
- `/api/create-checkout-session` の実行ログ
- `/api/webhooks/stripe` の実行ログ
- エラーメッセージの詳細

### Stripe Dashboard
- Events タブでWebhook受信状況
- Payments タブで決済状況
- Webhooks タブで配信状況

### Supabase
- `premium_unlocks` テーブルのデータ確認
- Auth ユーザーとの紐付け確認