import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arcana Atelier",
  description: "高级极简风格的在线塔罗三张牌占卜体验。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
