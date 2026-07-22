import type { Metadata, Viewport } from "next";
import "./globals.css";
import MobileFrame from "@/components/layout/MobileFrame";

export const metadata: Metadata = {
  title: "CP Maker",
  description: "나만의 취향표를 만들고 공유하세요",
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
