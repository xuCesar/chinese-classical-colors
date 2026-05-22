import type { Metadata } from "next";
import { Noto_Serif_SC, Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: "国色 ccc - Chinese Classical Colors",
  description: "用中国传统色生成 Tailwind 风格色阶，预览现代产品 UI 与东方视觉场景。",
  keywords: ["国色", "chinese classical colors", "Tailwind colors", "传统色", "调色板"],
  authors: [{ name: "ccc" }]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${notoSerif.variable}`}>{children}</body>
    </html>
  );
}
