import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./app-design.css";

export const metadata: Metadata = {
  title: "يوم العائلة | إقامتك الخاصة",
  description: "اكتشف وجهات يوم العائلة واختر إقامتك والضيافة المناسبة لك.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "يوم العائلة" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#ffffff" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
