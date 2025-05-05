"use client"

import type React from "react"

import { CartProvider } from "@/contexts/cart-context"

export default function MerchLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
