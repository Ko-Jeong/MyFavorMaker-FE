import type { Metadata, Viewport } from "next";
import "./globals.css";
import MobileFrame from "@/components/layout/MobileFrame";

export const metadata: Metadata = {
  metadataBase: new URL("https://cp-maker.vercel.app"),
  title: "CP Maker",
  description: "나만의 취향표를 만들고 공유하세요",
  openGraph: {
    title: "CP Maker",
    description: "나만의 취향표를 만들고 공유하세요",
    url: "https://cp-maker.vercel.app",
    siteName: "CP Maker",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CP Maker 미리보기",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CP Maker",
    description: "나만의 취향표를 만들고 공유하세요",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">
        <MobileFrame>{children}</MobileFrame>
      </body>
    </html>
  );
}
