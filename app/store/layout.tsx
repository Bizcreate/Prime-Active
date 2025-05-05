"use client"

import type React from "react"

import { WishlistProvider } from "@/hooks/use-wishlist"
import { CartProvider } from "@/contexts/cart-context"

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      <CartProvider>{children}</CartProvider>
    </WishlistProvider>
  )
}
