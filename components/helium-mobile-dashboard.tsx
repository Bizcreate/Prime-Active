"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Signal, Smartphone, Coins, Activity } from "lucide-react"
import { heliumMobileService } from "@/services/helium-mobile-service"

export function HeliumMobileDashboard() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    totalEarned: 0,
    coveragePoints: 0,
    lastReward: null as { amount: number; timestamp: number } | null,
  })

  useEffect(() => {
    // Load initial state
    const enabled = heliumMobileService.isNetworkEnabled()
    setIsEnabled(enabled)

    if (enabled) {
      loadStats()
    }
  }, [])

  const loadStats = () => {
    const rewards = heliumMobileService.getRewards()
    const totalEarned = rewards.reduce((sum, reward) => sum + reward.amount, 0)
    const coveragePoints = rewards.length * 10 // Simulate coverage points

    const lastReward = rewards.length > 0 ? rewards[rewards.length - 1] : null

    setStats({
      totalEarned,
      coveragePoints,
      lastReward: lastReward
        ? {
            amount: lastReward.amount,
            timestamp: lastReward.timestamp,
          }
        : null,
    })
  }

  const handleToggleMining = async () => {
    setIsLoading(true)
    try {
      if (isEnabled) {
        const success = await heliumMobileService.disableMining()
        if (success) {
          setIsEnabled(false)
        }
      } else {
        const userId = localStorage.getItem("userId") || "demo_user"
        const success = await heliumMobileService.enableMining(userId)
        if (success) {
          setIsEnabled(true)
          loadStats()
        }
      }
    } catch (error) {
      console.error("Error toggling Helium Mobile mining:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-full">
                <Signal className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <CardTitle>Helium Mobile</CardTitle>
                <p className="text-sm text-muted-foreground">Earn MOBILE tokens by sharing location data</p>
              </div>
            </div>
            <Badge variant={isEnabled ? "default" : "secondary"} className="bg-blue-500/20 text-blue-400">
              {isEnabled ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Coins className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium">Total Earned</span>
              </div>
              <p className="text-lg font-bold">{stats.totalEarned.toFixed(4)} MOBILE</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium">Coverage Points</span>
              </div>
              <p className="text-lg font-bold">{stats.coveragePoints}</p>
            </div>
          </div>

          {stats.lastReward && (
            <div className="bg-muted/30 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-400" />
                  <span>Last reward: {stats.lastReward.amount.toFixed(4)} MOBILE</span>
                </div>
                <span className="text-muted-foreground">
                  {new Date(stats.lastReward.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={handleToggleMining}
            disabled={isLoading}
            className={`w-full ${isEnabled ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                {isEnabled ? "Stop Mining" : "Start Mining"}
              </div>
            )}
          </Button>

          {isEnabled && (
            <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-start gap-2">
                <Signal className="h-4 w-4 text-blue-400 mt-0.5" />
                <div className="text-xs text-blue-300">
                  <p className="font-medium mb-1">Mining Active</p>
                  <p>
                    Your device is now contributing to the Helium Mobile network by sharing location and cellular data.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500/20 p-1.5 rounded-full">
              <MapPin className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-sm">Location Sharing</p>
              <p className="text-xs text-muted-foreground">Share your location data to help map cellular coverage</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-500/20 p-1.5 rounded-full">
              <Signal className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <p className="font-medium text-sm">Network Quality</p>
              <p className="text-xs text-muted-foreground">Report signal strength and network performance</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-yellow-500/20 p-1.5 rounded-full">
              <Coins className="h-4 w-4 text-yellow-400" />
            </div>
            <div>
              <p className="font-medium text-sm">Earn Rewards</p>
              <p className="text-xs text-muted-foreground">Get MOBILE tokens for contributing valuable data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
