"use client"

import type { ReactNode } from "react"
import { QuickActionButton } from "./quick-action-button"
import { TabBar } from "./tab-bar"

interface AppShellProps {
  children: ReactNode
  showTabBar?: boolean
  showQuickAction?: boolean
}

export function AppShell({ children, showTabBar = true, showQuickAction = true }: AppShellProps) {
  return (
    <div className="min-h-screen pb-16">
      {children}
      {showQuickAction && <QuickActionButton position="top-right" size="sm" />}
      {showTabBar && <TabBar />}
    </div>
  )
}
