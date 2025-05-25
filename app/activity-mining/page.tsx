"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Info } from "lucide-react"
import Link from "next/link"
import { ActivityMiningDashboard } from "@/components/activity-mining-dashboard"
import Image from "next/image"

export default function ActivityMiningPage() {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Activity Mining</h1>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setShowInfo(!showInfo)}>
            <Info className="h-5 w-5" />
          </Button>
        </div>

        {showInfo && (
          <div className="bg-zinc-900 rounded-lg p-4 mb-6">
            <h2 className="font-bold mb-2">What is Activity Mining?</h2>
            <p className="text-sm text-zinc-400 mb-3">
              Activity Mining allows you to earn tokens by tracking your physical activities. The more you move, the
              more you earn!
            </p>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-zinc-800 p-2 rounded-full">
                <Image src="/digital-token.png" alt="Token" width={24} height={24} />
              </div>
              <div>
                <h3 className="font-medium text-sm">Earn ACTIVE Tokens</h3>
                <p className="text-xs text-zinc-400">Tokens can be used for discounts, exclusive content, and more</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-zinc-800 p-2 rounded-full">
                <Image src="/shaka-coin.png" alt="Security" width={24} height={24} />
              </div>
              <div>
                <h3 className="font-medium text-sm">Secure & Transparent</h3>
                <p className="text-xs text-zinc-400">All activity data is verified and rewards are tracked on-chain</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setShowInfo(false)}>
              Got it
            </Button>
          </div>
        )}

        <ActivityMiningDashboard />

        <div className="mt-6">
          <Link href="/start-activity">
            <Button className="w-full bg-primary text-black">Start Activity & Earn</Button>
          </Link>
        </div>
      </div>

      <TabBar activeTab="wallet" />
    </main>
  )
}
