import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scala - 동국대 맞춤 장학금 알림",
  description: "동국대학교 재학생/휴학생을 위한 맞춤형 장학금 PUSH 알림 서비스. 지원 가능한 장학금만 필터링해서 알려드려요.",
  keywords: ["동국대학교", "장학금", "대학생", "알림", "PWA"],
  authors: [{ name: "Scala Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Scala",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Scala - 동국대 맞춤 장학금 알림",
    description: "놓치는 장학금 없이, PUSH 알림으로 받아보세요.",
    type: "website",
    locale: "ko_KR",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FF6B35",
};

import FirebaseAnalytics from "@/components/common/FirebaseAnalytics";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Pretendard 폰트 (한글) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Scala" />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-sans antialiased bg-white text-[#212121]`}
      >
        <Suspense fallback={null}>
          <FirebaseAnalytics />
        </Suspense>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
