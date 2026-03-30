import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CoPiper",
  description: "High-efficiency data management desktop tool",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}
