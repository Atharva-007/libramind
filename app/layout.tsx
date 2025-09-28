import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
// import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClientProvider } from "@/lib/query-client"
import { Toaster } from "@/components/ui/sonner"
import ClientI18nProvider from "@/components/ClientI18nProvider"
import "./globals.css"

export const metadata: Metadata = {
  title: "LibraMind Pro - Your Ultimate Reading Companion",
  description: "Transform your reading experience with AI-powered recommendations, progress tracking, and community features",
  keywords: ["reading", "books", "library", "tracking", "community", "AI"],
  authors: [{ name: "LibraMind Team" }],
  creator: "LibraMind",
  publisher: "LibraMind",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://libramind.app",
    siteName: "LibraMind Pro",
    title: "LibraMind Pro - Your Ultimate Reading Companion",
    description: "Transform your reading experience with AI-powered recommendations, progress tracking, and community features",
  },
  twitter: {
    card: "summary_large_image",
    title: "LibraMind Pro - Your Ultimate Reading Companion",
    description: "Transform your reading experience with AI-powered recommendations, progress tracking, and community features",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
        <QueryClientProvider>
          <ClientI18nProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Suspense fallback={<div className="min-h-screen bg-background animate-pulse" />}>
                {children}
              </Suspense>
              <Toaster />
              {/* <Analytics /> */}
            </ThemeProvider>
          </ClientI18nProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
