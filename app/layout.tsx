import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | shimizu item",
    default: "shimizu item",
  },
  description: "自分が使って良かったモノを紹介してます",
  keywords: ["比較", "レビュー", "おすすめ", "商品"],
  openGraph: {
    title: "shimizu item",
    description: "自分が使って良かったモノを紹介してます",
    type: "website",
    url: "https://shimizu-item.vercel.app/", // 必要に応じて本番URLに変更してください
    siteName: "shimizu-item",
    images: [
      {
        url: "/placeholder.svg",
        width: 1200,
        height: 630,
        alt: "アイテム",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "紹介",
    description: "自分が使って良かったモノを紹介してます",
    images: ["/placeholder.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
