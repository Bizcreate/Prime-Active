"use client"

import type React from "react"

import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/hooks/use-wishlist"

export default function MerchLayout({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      <CartProvider>{children}</CartProvider>
    </WishlistProvider>
  )
}
