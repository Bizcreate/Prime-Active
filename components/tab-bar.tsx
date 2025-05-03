"use client"

import Link from "next/link"
import { Home, Map, Trophy, Wallet, ShoppingBag, BarChart3 } from "lucide-react"

interface TabBarProps {
  activeTab: "dashboard" | "map" | "challenges" | "wallet" | "merch" | "stake"
}

export function TabBar({ activeTab }: TabBarProps) {
  const tabs = [
    {
      name: "Home",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      id: "dashboard",
    },
    {
      name: "Map",
      href: "/map",
      icon: <Map className="h-5 w-5" />,
      id: "map",
    },
    {
      name: "Challenges",
      href: "/challenges",
      icon: <Trophy className="h-5 w-5" />,
      id: "challenges",
    },
    {
      name: "Wallet",
      href: "/wallet",
      icon: <Wallet className="h-5 w-5" />,
      id: "wallet",
    },
    {
      name: "Merch",
      href: "/merch",
      icon: <ShoppingBag className="h-5 w-5" />,
      id: "merch",
    },
    {
      name: "Stake",
      href: "/staking",
      icon: <BarChart3 className="h-5 w-5" />,
      id: "stake",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-50">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`flex flex-col items-center py-3 px-4 ${
              activeTab === tab.id ? "text-primary" : "text-zinc-400"
            }`}
          >
            {tab.icon}
            <span className="text-xs mt-1">{tab.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
