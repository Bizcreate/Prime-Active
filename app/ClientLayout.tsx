"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { AuthProvider } from "@/components/auth-provider"
import { AppStateProvider } from "@/context/AppStateContext"
import { AppShell } from "@/components/app-shell"
import { Toaster } from "@/components/ui/toaster"
import { SplashScreen } from "@/components/splash-screen"

// Routes that don't need the app shell (tab bar, etc.)
const STANDALONE_ROUTES = ["/", "/login", "/signup", "/onboarding", "/setup", "/activity-tracking", "/activity-summary"]

// Routes that need authentication
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/wallet", "/challenges", "/marketplace", "/settings"]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [showSplash, setShowSplash] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const isStandalone = STANDALONE_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))

  useEffect(() => {
    // Check if this is the first visit to show splash screen
    const hasVisited = localStorage.getItem("hasVisited")
    const onboardingCompleted = localStorage.getItem("onboarding_completed")

    if (!hasVisited && pathname === "/") {
      setShowSplash(true)
      localStorage.setItem("hasVisited", "true")
    }

    setIsInitialized(true)
  }, [pathname])

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <AppStateProvider>
        {showSplash && pathname === "/" ? (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        ) : isStandalone ? (
          <div className="min-h-screen bg-black">{children}</div>
        ) : (
          <AppShell>{children}</AppShell>
        )}
        <Toaster />
      </AppStateProvider>
    </AuthProvider>
  )
}
