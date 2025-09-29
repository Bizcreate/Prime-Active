"use client"

import type React from "react"

import { AuthProvider } from "@/components/auth-provider"
import { AppStateProvider } from "@/context/AppStateContext"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/contexts/cart-context"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <AppStateProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </AppStateProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
