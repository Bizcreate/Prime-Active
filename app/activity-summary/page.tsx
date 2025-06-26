"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"
import { Trophy, Clock, MapPin, Flame, Award, Coins, Share2, Home, TrendingUp } from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

interface ActivityData {
  id: string
  activity_type: string
  title: string
  duration_minutes: number
  distance_km: number
  calories_burned: number
  steps: number
  banana_points_earned: number
  shaka_tokens_earned: number
  activity_data: any
  created_at: string
}

export default function ActivitySummaryPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activity, setActivity] = useState<ActivityData | null>(null)
  const [iotexReward, setIotexReward] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadActivity = async () => {
      const activityId = searchParams.get("activityId")
      const iotexRewardParam = searchParams.get("iotexReward")

      if (iotexRewardParam) {
        setIotexReward(Number.parseFloat(iotexRewardParam))
      }

      if (!activityId || !user) {
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("activities")
          .select("*")
          .eq("id", activityId)
          .eq("user_id", user.id)
          .single()

        if (error) throw error

        setActivity(data)
      } catch (error) {
        console.error("Error loading activity:", error)
        toast({
          title: "Error",
          description: "Failed to load activity data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadActivity()
  }, [searchParams, user, toast])

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      skateboarding: "🛹",
      surfing: "🏄‍♂️",
      snowboarding: "🏂",
      running: "🏃‍♂️",
      cycling: "🚴‍♂️",
      walking: "🚶‍♂️",
    }
    return icons[type] || "🏃‍♂️"
  }

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
  }

  const shareActivity = async () => {
    if (!activity) return

    const shareText =
      `Just completed a ${activity.activity_type} session! 🎉\n` +
      `⏱️ ${formatTime(activity.duration_minutes)}\n` +
      `📍 ${activity.distance_km}km\n` +
      `🔥 ${activity.calories_burned} calories\n` +
      `🍌 +${activity.banana_points_earned} Banana Points\n` +
      `🤙 +${activity.shaka_tokens_earned} Shaka Tokens`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Prime Active - Activity Complete!",
          text: shareText,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText)
        toast({
          title: "Copied to clipboard",
          description: "Activity summary copied to clipboard!",
        })
      } catch (error) {
        console.error("Error copying to clipboard:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-400">Loading activity summary...</p>
        </div>
      </AppShell>
    )
  }

  if (!activity) {
    return (
      <AppShell>
        <div className="p-6 text-center">
          <p className="text-zinc-400 mb-4">Activity not found</p>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </AppShell>
    )
  }

  const gearBonus = activity.activity_data?.gear_bonus || 0
  const merchandiseUsed = activity.activity_data?.merchandise_used || []

  return (
    <AppShell>
      <div className="p-6 pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-10 w-10 text-black" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Activity Complete!</h1>
          <p className="text-zinc-400">Great job on your {activity.activity_type} session</p>
        </div>

        {/* Activity Overview */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-2xl">{getActivityIcon(activity.activity_type)}</span>
              <div>
                <h2 className="text-lg">{activity.title}</h2>
                <p className="text-sm text-zinc-400 font-normal">
                  {new Date(activity.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-3 bg-zinc-800 rounded-lg">
                <Clock className="h-5 w-5 text-zinc-400 mb-1" />
                <div className="text-sm text-zinc-400">Duration</div>
                <div className="font-bold">{formatTime(activity.duration_minutes)}</div>
              </div>
              <div className="flex flex-col items-center p-3 bg-zinc-800 rounded-lg">
                <MapPin className="h-5 w-5 text-zinc-400 mb-1" />
                <div className="text-sm text-zinc-400">Distance</div>
                <div className="font-bold">{activity.distance_km} km</div>
              </div>
              <div className="flex flex-col items-center p-3 bg-zinc-800 rounded-lg">
                <Flame className="h-5 w-5 text-zinc-400 mb-1" />
                <div className="text-sm text-zinc-400">Calories</div>
                <div className="font-bold">{activity.calories_burned}</div>
              </div>
              <div className="flex flex-col items-center p-3 bg-zinc-800 rounded-lg">
                <Award className="h-5 w-5 text-zinc-400 mb-1" />
                <div className="text-sm text-zinc-400">Steps</div>
                <div className="font-bold">{activity.steps}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Earned */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              Rewards Earned
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Image src="/banana-icon.png" alt="Banana Points" width={24} height={24} />
                <span>Banana Points</span>
              </div>
              <div className="text-xl font-bold text-yellow-500">+{activity.banana_points_earned}</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Image src="/shaka-coin.png" alt="Shaka Tokens" width={24} height={24} />
                <span>Shaka Tokens</span>
              </div>
              <div className="text-xl font-bold text-primary">+{activity.shaka_tokens_earned}</div>
            </div>

            {iotexReward > 0 && (
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Image src="/iotex-logo.png" alt="IoTeX" width={24} height={24} />
                  <span>IOTX Tokens</span>
                </div>
                <div className="text-xl font-bold text-green-500">+{iotexReward}</div>
              </div>
            )}

            {gearBonus > 0 && (
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-green-400">Gear Bonus Applied</span>
                  <span className="text-green-400 font-bold">+{Math.round(gearBonus * 100)}%</span>
                </div>
                {merchandiseUsed.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {merchandiseUsed.map((id: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        Gear #{index + 1}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full" onClick={shareActivity}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Activity
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/activity-setup">
              <Button variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Start Another
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
