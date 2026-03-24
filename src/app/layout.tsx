import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ember",
  description: "一个温暖的双人信件应用",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ember",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
          </AuthProvider>
        </I18nProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
