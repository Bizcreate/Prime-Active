"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, MapPin, Flame, Activity, Share, Award, Coins } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatTime, formatDistance, formatCalories } from "@/lib/utils"
import { dePINManager } from "@/services/depin-manager"
import Image from "next/image"

export default function ActivitySummaryPage() {
  const router = useRouter()
  const [activityData, setActivityData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [depinRewards, setDepinRewards] = useState<any[]>([])

  useEffect(() => {
    // In a real app, we would load the activity data from a database or state management
    // For this demo, we'll create mock data
    const mockActivity = {
      id: "activity_" + Date.now().toString(36),
      type: "running",
      startTime: Date.now() - 45 * 60 * 1000, // 45 minutes ago
      endTime: Date.now(),
      distance: 5.2, // km
      duration: 45 * 60, // seconds
      calories: 450,
      steps: 6500,
      pace: "5:30", // min/km
      elevation: 120, // meters
    }

    // Get DePIN rewards
    const services = dePINManager.getAllServices()
    const rewards = []

    for (const service of services) {
      if (service.isNetworkEnabled()) {
        const network = service.getNetwork()

        // Get most recent reward (in a real app, we would filter by activity ID)
        const serviceRewards = service.getRewards ? service.getRewards() : []
        const latestReward = serviceRewards.length > 0 ? serviceRewards[serviceRewards.length - 1] : null

        if (latestReward) {
          rewards.push({
            network,
            reward: latestReward,
          })
        }
      }
    }

    setDepinRewards(rewards)
    setActivityData(mockActivity)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <AppShell>
        <div className="min-h-screen bg-black p-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-400">Loading activity summary...</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-black p-6 pb-20">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Activity Summary</h1>
        </div>

        <div className="mb-6">
          <div className="bg-zinc-900 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold capitalize">{activityData.type}</h2>
              <Badge variant="outline" className="capitalize">
                {activityData.type}
              </Badge>
            </div>
            <p className="text-sm text-zinc-400">
              {new Date(activityData.startTime).toLocaleDateString()} •{" "}
              {new Date(activityData.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-zinc-400">Duration</p>
                    <p className="text-lg font-semibold">{formatTime(activityData.duration)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-zinc-400">Distance</p>
                    <p className="text-lg font-semibold">{formatDistance(activityData.distance * 1000)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-zinc-400">Calories</p>
                    <p className="text-lg font-semibold">{formatCalories(activityData.calories)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-xs text-zinc-400">Steps</p>
                    <p className="text-lg font-semibold">{activityData.steps.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-zinc-900 border-zinc-800 mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <p className="font-medium">Additional Stats</p>
              </div>
              <div className="grid grid-cols-2 gap-y-3">
                <div>
                  <p className="text-xs text-zinc-400">Pace</p>
                  <p className="text-sm">{activityData.pace} min/km</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Elevation Gain</p>
                  <p className="text-sm">{activityData.elevation} m</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Avg. Heart Rate</p>
                  <p className="text-sm">142 bpm</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Max Heart Rate</p>
                  <p className="text-sm">165 bpm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {depinRewards.length > 0 && (
            <Card className="bg-zinc-900 border-zinc-800 mb-4">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <p className="font-medium">DePIN Rewards</p>
                </div>
                <div className="space-y-3">
                  {depinRewards.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-zinc-800">
                          <Image
                            src={item.network.logoUrl || "/placeholder.svg"}
                            alt={item.network.name}
                            width={24}
                            height={24}
                          />
                        </div>
                        <div>
                          <p className="text-sm">{item.network.name}</p>
                          <p className="text-xs text-zinc-400">{item.network.tokenName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{item.reward.amount.toFixed(4)}</p>
                        <p className="text-xs text-zinc-400">{item.network.tokenSymbol}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <Button className="w-full flex items-center gap-2">
              <Award className="h-4 w-4" />
              View Achievements
            </Button>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Share className="h-4 w-4" />
              Share Activity
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
