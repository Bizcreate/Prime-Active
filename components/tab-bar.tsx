"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, TrendingUp, MapPin, Trophy, User, Wallet } from "lucide-react"

interface TabBarProps {
  activeTab?: string
}

export function TabBar({ activeTab }: TabBarProps) {
  const pathname = usePathname()

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      paths: ["/dashboard", "/"],
    },
    {
      id: "activity",
      label: "Activity",
      icon: TrendingUp,
      href: "/start-activity",
      paths: ["/start-activity", "/activity-setup", "/activity-tracking", "/activity-summary"],
    },
    {
      id: "map",
      label: "Map",
      icon: MapPin,
      href: "/map",
      paths: ["/map"],
    },
    {
      id: "challenges",
      label: "Challenges",
      icon: Trophy,
      href: "/challenges",
      paths: ["/challenges"],
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: Wallet,
      href: "/wallet",
      paths: ["/wallet"],
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/profile",
      paths: ["/profile", "/settings"],
    },
  ]

  const getActiveTab = () => {
    if (activeTab) return activeTab

    const currentTab = tabs.find((tab) => tab.paths.some((path) => pathname.startsWith(path)))

    return currentTab?.id || "dashboard"
  }

  const currentActiveTab = getActiveTab()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentActiveTab === tab.id

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive ? "text-primary bg-primary/10" : "text-zinc-400 hover:text-zinc-300"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
