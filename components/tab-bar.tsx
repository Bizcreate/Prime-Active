"use client"

import Link from "next/link"
import { Home, Map, Trophy, Wallet, ChevronsUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface TabBarProps {
  activeTab?: string
}

export function TabBar({ activeTab }: TabBarProps) {
  const pathname = usePathname()
  const currentPath = activeTab || pathname.split("/")[1] || "home"

  const tabs = [
    {
      name: "home",
      icon: Home,
      label: "Home",
      href: "/dashboard",
    },
    {
      name: "map",
      icon: Map,
      label: "Map",
      href: "/map",
    },
    {
      name: "challenges",
      icon: Trophy,
      label: "Challenges",
      href: "/challenges/board-club",
    },
    {
      name: "wallet",
      icon: Wallet,
      label: "Wallet",
      href: "/wallet",
    },
    {
      name: "staking",
      icon: ChevronsUp,
      label: "Stake",
      href: "/staking",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = currentPath === tab.name
          const Icon = tab.icon
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full",
                isActive ? "text-primary" : "text-zinc-400",
              )}
            >
              <Icon className={cn("h-5 w-5 mb-1", isActive ? "text-primary" : "text-zinc-400")} />
              <span className="text-xs">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
