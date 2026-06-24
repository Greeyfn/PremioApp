import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";

const pinar = localFont({
  src: [
    { path: "../../public/fonts/Pinar-DS4-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Pinar-DS4-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Pinar-DS4-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/Pinar-DS4-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Pinar-DS4-Black.ttf", weight: "900", style: "normal" },
  ],
  display: "swap",
  variable: "--font-pinar",
});

export const metadata: Metadata = {
  title: "PremioShop",
  description: "Digital products marketplace",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PremioShop",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f0f0f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" href="/icons/logo.svg" type="image/svg+xml" />
      </head>
      <body className={`${pinar.className} bg-bg-primary text-text-primary antialiased`}>
        {children}
      </body>
    </html>
  );
}
