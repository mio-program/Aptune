import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClientProviders } from "@/contexts/ClientProviders";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "InnerLog - AI時代のキャリア診断",
  description: "あなたの強みを発見し、AI時代に適したキャリアパスを見つけましょう",
  keywords: "キャリア診断, AI, キャリア, 転職, 就職, 自己分析",
  authors: [{ name: "InnerLog Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
