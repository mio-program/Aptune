#!/usr/bin/env node

/**
 * 本番環境用のセキュアなシークレット生成スクリプト
 */

const crypto = require('crypto');

function generateSecureSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

console.log('🔐 APTune v2 本番環境用シークレット生成');
console.log('=====================================');
console.log('');

// NEXTAUTH_SECRET生成
const nextAuthSecret = generateSecureSecret(32);
console.log('NEXTAUTH_SECRET:');
console.log(nextAuthSecret);
console.log('');

// 追加のセキュリティ情報
console.log('📋 設定手順:');
console.log('1. 上記のNEXTAUTH_SECRETをVercelの環境変数に設定');
console.log('2. 他の環境変数も.env.production.exampleを参考に設定');
console.log('3. Stripe本番キーを取得して設定');
console.log('4. 本番URLを確認してNEXTAUTH_URLを設定');
console.log('');

console.log('⚠️  注意事項:');
console.log('- このシークレットは安全に保管してください');
console.log('- 本番環境でのみ使用してください');
console.log('- 定期的にローテーションすることを推奨します');