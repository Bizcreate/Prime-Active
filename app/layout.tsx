import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WishlistProvider } from "@/hooks/use-wishlist"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prime Active",
  description: "Prime Active - Action Sports Social App",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <WishlistProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </WishlistProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
