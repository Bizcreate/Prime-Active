import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PrimeX watchX | Web3 Action Sports Wearable",
  description: "The World's First Web3 Smartwatch for Skaters, Surfers, and Snowboarders",
  metadataBase: new URL("https://v0-vPrimeX-watchX-Vercel.app"),
  openGraph: {
    title: "PrimeX watchX | Web3 Action Sports Wearable",
    description: "The World's First Web3 Smartwatch for Skaters, Surfers, and Snowboarders",
    url: "https://v0-vPrimeX-watchX-Vercel.app",
    siteName: "PrimeX watchX",
    images: [
      {
        url: "https://v0-vPrimeX-watchX-Vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "PrimeX watchX - Move-to-Earn Meets Board Culture",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrimeX watchX | Web3 Action Sports Wearable",
    description: "The World's First Web3 Smartwatch for Skaters, Surfers, and Snowboarders",
    images: ["https://v0-vPrimeX-watchX-Vercel.app/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
