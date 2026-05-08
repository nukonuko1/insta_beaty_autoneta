import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Instagram投稿ジェネレーター | 10個の投稿文を30秒で自動生成",
  description:
    "お店の特徴を入力するだけで、Instagram投稿文・ハッシュタグ・CTAを10個まとめて生成。美容室・整体院・飲食店・ネイルサロンなど小規模店舗向け無料ツール。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
