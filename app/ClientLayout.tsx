"use client"

import type React from "react"

import { WishlistProvider } from "@/hooks/use-wishlist"
import { Toaster } from "@/components/ui/toaster"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      {children}
      <Toaster />
    </WishlistProvider>
  )
}
