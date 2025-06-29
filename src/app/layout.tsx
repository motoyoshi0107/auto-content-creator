import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Auto Content Creator',
  description: 'URLインポート + AI生成でブログ・noteコンテンツ・Xポストを自動作成',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}