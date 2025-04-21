import Link from "next/link"
import { Home, Map, User, Wallet, Activity, Gift } from "lucide-react"

interface TabBarProps {
  activeTab: "home" | "activities" | "achievements" | "map" | "wallet" | "profile" | "rewards"
}

export function TabBar({ activeTab }: TabBarProps) {
  const tabs = [
    { name: "home", icon: Home, label: "Home", href: "/dashboard" },
    { name: "activities", icon: Activity, label: "Activities", href: "/activities" },
    { name: "map", icon: Map, label: "Map", href: "/map" },
    { name: "rewards", icon: Gift, label: "Rewards", href: "/rewards" },
    { name: "wallet", icon: Wallet, label: "Wallet", href: "/wallet" },
    { name: "profile", icon: User, label: "Profile", href: "/profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-2 py-1 z-50">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => {
          const isActive = tab.name === activeTab
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg ${
                isActive ? "text-primary" : "text-zinc-400"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
