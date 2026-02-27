import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1565d8",
};

export const metadata: Metadata = {
  title: {
    default: "MicroCBM — Condition-Based Maintenance",
    template: "%s | MicroCBM",
  },
  description:
    "MicroCBM empowers industries to protect critical rotating equipment with simple, smart, and scalable condition monitoring. Predict failures, extend asset life, and lower maintenance costs.",
  keywords: [
    "condition-based maintenance",
    "predictive maintenance",
    "oil analysis",
    "asset management",
    "rotating equipment",
    "CBM",
    "industrial monitoring",
  ],
  authors: [{ name: "MicroCBM" }],
  creator: "MicroCBM",
  icons: {
    icon: "/assets/svg/new_logo_white.svg",
    apple: "/assets/svg/new_logo_white.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MicroCBM",
    title: "MicroCBM — Condition-Based Maintenance",
    description:
      "Predict failures, extend asset life, and lower maintenance costs with smart condition monitoring.",
  },
  twitter: {
    card: "summary",
    title: "MicroCBM — Condition-Based Maintenance",
    description:
      "Predict failures, extend asset life, and lower maintenance costs with smart condition monitoring.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
