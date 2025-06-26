"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { activityBoostService, type ActivityBoost } from "@/services/activity-boost-service"
import { Activity, Clock, Zap, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function ActivityBoostManager() {
  const [boosts, setBoosts] = useState<ActivityBoost[]>([])
  const [activeBoosts, setActiveBoosts] = useState<ActivityBoost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load boosts
    const loadBoosts = () => {
      setBoosts(activityBoostService.getBoosts())
      setActiveBoosts(activityBoostService.getActiveBoosts())
      setIsLoading(false)
    }

    loadBoosts()

    // Set up interval to refresh boosts and check for expired ones
    const interval = setInterval(() => {
      activityBoostService.checkExpiredBoosts()
      loadBoosts()
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `${days}d ${hours % 24}h`
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else {
      return `${minutes}m`
    }
  }

  const formatTimeRemaining = (endTime: number): string => {
    const remaining = endTime - Date.now()
    if (remaining <= 0) return "Expired"
    return formatDuration(remaining)
  }

  const getNetworkLogo = (networkId: string): string => {
    switch (networkId) {
      case "mystnode":
        return "/myst-logo.png"
      case "iotex":
        return "/iotex-logo.png"
      case "bitcoin":
        return "/bitcoin-logo.png" // Assuming you have this logo
      case "all":
        return "/digital-token.png" // Generic token logo
      default:
        return "/digital-token.png"
    }
  }

  const getNetworkName = (networkId: string): string => {
    switch (networkId) {
      case "mystnode":
        return "Mysterium Network"
      case "iotex":
        return "IoTeX"
      case "bitcoin":
        return "Bitcoin Signet"
      case "all":
        return "All Networks"
      default:
        return networkId
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {activeBoosts.length > 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle>Active Boosts</CardTitle>
            <CardDescription>Currently active earning boosts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeBoosts.map((boost) => (
                <div key={boost.id} className="bg-zinc-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      <span className="font-medium">{boost.name}</span>
                    </div>
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50">
                      {boost.multiplier}x Boost
                    </Badge>
                  </div>

                  <p className="text-sm text-zinc-400 mb-3">{boost.description}</p>

                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {boost.endTime ? formatTimeRemaining(boost.endTime) : formatDuration(boost.duration)} remaining
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Image
                        src={getNetworkLogo(boost.networkId) || "/placeholder.svg"}
                        alt={boost.networkId}
                        width={16}
                        height={16}
                        className="rounded-full"
                      />
                      <span>{getNetworkName(boost.networkId)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle>Available Boosts</CardTitle>
          <CardDescription>Complete activities to unlock these boosts</CardDescription>
        </CardHeader>
        <CardContent>
          {boosts.filter((boost) => !boost.isActive).length > 0 ? (
            <div className="space-y-4">
              {boosts
                .filter((boost) => !boost.isActive)
                .map((boost) => (
                  <div key={boost.id} className="bg-zinc-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        <span className="font-medium">{boost.name}</span>
                      </div>
                      <Badge variant="outline" className="bg-zinc-700 text-zinc-300 border-zinc-600">
                        {boost.multiplier}x Boost
                      </Badge>
                    </div>

                    <p className="text-sm text-zinc-400 mb-3">{boost.description}</p>

                    <div className="w-full bg-zinc-700 rounded-full h-2 mb-1">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${boost.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400 mb-3">
                      <span>Progress: {Math.round(boost.progress)}%</span>
                      <span>Duration: {formatDuration(boost.duration)}</span>
                    </div>

                    <div className="flex items-center text-xs text-zinc-400">
                      <Image
                        src={getNetworkLogo(boost.networkId) || "/placeholder.svg"}
                        alt={boost.networkId}
                        width={16}
                        height={16}
                        className="rounded-full mr-1"
                      />
                      <span>Boosts {getNetworkName(boost.networkId)} earnings</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-6 text-zinc-400">
              <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>All boosts are currently active!</p>
              <p className="text-sm">Check back later for more boosts</p>
            </div>
          )}

          <Link href="/start-activity">
            <Button className="w-full mt-4">Start Activity to Earn Boosts</Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle>How Boosts Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-zinc-800 p-2 rounded-full mt-1">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Complete Activities</h4>
                <p className="text-sm text-zinc-400">
                  Track your physical activities like running, skateboarding, or surfing
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-zinc-800 p-2 rounded-full mt-1">
                <Zap className="h-4 w-4 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-medium">Earn Boosts</h4>
                <p className="text-sm text-zinc-400">Activities unlock earning boosts for specific DePIN networks</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-zinc-800 p-2 rounded-full mt-1">
                <Clock className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium">Limited Time</h4>
                <p className="text-sm text-zinc-400">Boosts are active for a limited time, so make the most of them!</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
