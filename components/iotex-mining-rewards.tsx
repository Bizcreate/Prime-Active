"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"

interface IoTeXMiningRewardsProps {
  userId?: string
}

export function IoTeXMiningRewards({ userId = "default-user" }: IoTeXMiningRewardsProps) {
  const [isActive, setIsActive] = useState(true)
  const [balance, setBalance] = useState(128.45)
  const [baseRewards, setBaseRewards] = useState(2.5)
  const [merchBonus, setMerchBonus] = useState(1.2)
  const [activityBonus, setActivityBonus] = useState(0.8)
  const [timeframe, setTimeframe] = useState("daily")

  // Calculate total rewards
  const totalRewards = baseRewards + merchBonus + activityBonus

  // Multipliers for different timeframes
  const timeMultipliers = {
    daily: 1,
    weekly: 7,
    monthly: 30,
  }

  // Get the current multiplier based on selected timeframe
  const currentMultiplier = timeMultipliers[timeframe as keyof typeof timeMultipliers]

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Image src="/iotex-logo.png" alt="IoTeX" width={24} height={24} className="h-6 w-6" />
            <h3 className="font-medium">IoTeX Mining</h3>
          </div>
          <Badge
            variant="outline"
            className={
              isActive ? "bg-green-900/20 text-green-400 border-green-800" : "bg-zinc-800 text-zinc-400 border-zinc-700"
            }
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <Tabs defaultValue="daily" onValueChange={setTimeframe} className="mt-2">
          <TabsList className="grid grid-cols-3 bg-zinc-800 mb-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Balance:</span>
              <span className="font-medium">{balance.toFixed(2)} IOTX</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Base Rewards:</span>
              <span className="font-medium">{(baseRewards * currentMultiplier).toFixed(2)} IOTX</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Merch Bonus:</span>
              <span className="text-green-400">+{(merchBonus * currentMultiplier).toFixed(2)} IOTX</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Activity Bonus:</span>
              <span className="text-green-400">+{(activityBonus * currentMultiplier).toFixed(2)} IOTX</span>
            </div>

            <div className="h-px bg-zinc-800 my-2"></div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Total {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}:</span>
              <span className="font-bold text-primary">{(totalRewards * currentMultiplier).toFixed(2)} IOTX</span>
            </div>
          </div>
        </Tabs>

        <div className="mt-4">
          <Link href="/wallet/depin-info">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
