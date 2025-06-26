"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Info } from "lucide-react"
import Link from "next/link"
import { BitcoinSignetDashboard } from "@/components/bitcoin-signet-dashboard"
import Image from "next/image"

export default function BitcoinMiningPage() {
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
          <h1 className="text-xl font-bold">Bitcoin Signet Mining</h1>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setShowInfo(!showInfo)}>
            <Info className="h-5 w-5" />
          </Button>
        </div>

        {showInfo && (
          <div className="bg-zinc-900 rounded-lg p-4 mb-6">
            <h2 className="font-bold mb-2">Bitcoin Signet with BIP300/301</h2>
            <p className="text-sm text-zinc-400 mb-3">
              This feature allows you to connect to a Bitcoin Signet node that implements BIP300/301 drivechain
              technology, compatible with LayerTwoLabs' infrastructure.
            </p>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-zinc-800 p-2 rounded-full">
                <Image src="/digital-token.png" alt="Token" width={24} height={24} />
              </div>
              <div>
                <h3 className="font-medium text-sm">Drivechain Technology</h3>
                <p className="text-xs text-zinc-400">
                  BIP300/301 enables secure two-way pegs between Bitcoin and sidechains
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-zinc-800 p-2 rounded-full">
                <Image src="/shaka-coin.png" alt="Security" width={24} height={24} />
              </div>
              <div>
                <h3 className="font-medium text-sm">Activity Mining Integration</h3>
                <p className="text-xs text-zinc-400">
                  Combine Bitcoin mining with activity tracking for enhanced rewards
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setShowInfo(false)}>
              Got it
            </Button>
          </div>
        )}

        <BitcoinSignetDashboard />

        <div className="mt-6">
          <Link href="/activity-mining">
            <Button className="w-full">View Activity Mining</Button>
          </Link>
        </div>
      </div>

      <TabBar activeTab="wallet" />
    </main>
  )
}
