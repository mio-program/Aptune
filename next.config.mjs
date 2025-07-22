/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 本番ビルド時にESLintエラーを無視（警告として扱う）
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 本番ビルド時にTypeScriptエラーを無視（開発時は有効）
    ignoreBuildErrors: true,
  },
  // 静的生成をスキップして動的レンダリングを強制
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // 出力設定
  output: 'standalone',
  async rewrites() {
    return []
  },
}

export default nextConfig;
