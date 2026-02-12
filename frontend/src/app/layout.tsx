import AppProviders from "@/providers/app-providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "Workflow Builder",
    template: "%s | Workflow Builder",
  },
  description: "A lightweight AI automation tool. Create, run, and track multi-step text processing workflows in real-time.",
  keywords: ["AI", "Automation", "Workflow", "Text Processing", "Gemini"],
  authors: [{ name: "Shivam Taneja" }],
  openGraph: {
    title: "Workflow Builder",
    description: "Build and run AI workflows in seconds.",
    type: "website",
    locale: "en_US",
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
