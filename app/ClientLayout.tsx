"use client"

import type React from "react"

import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { WishlistProvider } from "@/hooks/use-wishlist"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from "react"
import { depinInitializer } from "@/services/depin-initializer"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize DePIN services when the app starts
  useEffect(() => {
    depinInitializer.initialize()
  }, [])

  return (
    <div className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <WishlistProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </WishlistProvider>
      </ThemeProvider>
    </div>
  )
}
