import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "خطوة - نظام ادارة تطعيمات الاطفال",
  description: "النظام الوطني الموحد لرصد السجلات الصحية للاطفال",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${notoSansArabic.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
