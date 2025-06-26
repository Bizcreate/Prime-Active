"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coins, TrendingUp, Zap, Clock } from "lucide-react"

interface MiningReward {
  id: string
  amount: number
  timestamp: Date
  activityType: string
  transactionHash?: string
}

interface IoTeXMiningRewardsProps {
  userId?: string
  className?: string
}

export function IoTeXMiningRewards({ userId, className }: IoTeXMiningRewardsProps) {
  const [rewards, setRewards] = useState<MiningReward[]>([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [todayEarnings, setTodayEarnings] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMiningRewards()
  }, [userId])

  const fetchMiningRewards = async () => {
    try {
      setIsLoading(true)
      // Simulate API call - replace with actual API
      const mockRewards: MiningReward[] = [
        {
          id: "1",
          amount: 0.25,
          timestamp: new Date(),
          activityType: "Surfing",
          transactionHash: "0x123...abc",
        },
        {
          id: "2",
          amount: 0.15,
          timestamp: new Date(Date.now() - 3600000),
          activityType: "Skateboarding",
          transactionHash: "0x456...def",
        },
      ]

      setRewards(mockRewards)
      setTotalEarnings(mockRewards.reduce((sum, reward) => sum + reward.amount, 0))

      const today = new Date().toDateString()
      const todayRewards = mockRewards.filter((reward) => reward.timestamp.toDateString() === today)
      setTodayEarnings(todayRewards.reduce((sum, reward) => sum + reward.amount, 0))
    } catch (error) {
      console.error("Error fetching mining rewards:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            IoTeX Mining Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-500" />
          IoTeX Mining Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{totalEarnings.toFixed(3)}</div>
            <div className="text-sm text-gray-600">Total IOTX</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{todayEarnings.toFixed(3)}</div>
            <div className="text-sm text-gray-600">Today</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Rewards
          </h4>
          {rewards.length === 0 ? (
            <p className="text-gray-500 text-sm">No mining rewards yet</p>
          ) : (
            <div className="space-y-2">
              {rewards.slice(0, 3).map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium text-sm">+{reward.amount.toFixed(3)} IOTX</div>
                    <div className="text-xs text-gray-500">
                      {reward.activityType} • {reward.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Mined
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => window.open("/wallet/token-history", "_blank")}
        >
          <Coins className="h-4 w-4 mr-2" />
          View Full History
        </Button>
      </CardContent>
    </Card>
  )
}

export default IoTeXMiningRewards
