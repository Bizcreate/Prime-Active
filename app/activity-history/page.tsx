"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AppShell } from "@/components/app-shell"
import { TabBar } from "@/components/tab-bar"
import { supabase } from "@/lib/supabase"
import { Clock, MapPin, Filter, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Activity {
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

export default function ActivityHistoryPage() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const loadActivities = async () => {
      if (!user) return

      try {
        let query = supabase
          .from("activities")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (filter !== "all") {
          query = query.eq("activity_type", filter)
        }

        const { data, error } = await query

        if (error) throw error

        setActivities(data || [])
      } catch (error) {
        console.error("Error loading activities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadActivities()
  }, [user, filter])

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  const activityTypes = ["all", "skateboarding", "surfing", "snowboarding", "running", "cycling", "walking"]

  const totalStats = activities.reduce(
    (acc, activity) => ({
      totalDistance: acc.totalDistance + (activity.distance_km || 0),
      totalDuration: acc.totalDuration + (activity.duration_minutes || 0),
      totalCalories: acc.totalCalories + (activity.calories_burned || 0),
      totalBananaPoints: acc.totalBananaPoints + (activity.banana_points_earned || 0),
      totalShakaTokens: acc.totalShakaTokens + (activity.shaka_tokens_earned || 0),
    }),
    {
      totalDistance: 0,
      totalDuration: 0,
      totalCalories: 0,
      totalBananaPoints: 0,
      totalShakaTokens: 0,
    },
  )

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-400">Loading activity history...</p>
        </div>
        <TabBar activeTab="profile" />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="p-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Activity History</h1>
            <p className="text-zinc-400">{activities.length} activities completed</p>
          </div>
          <Link href="/start-activity">
            <Button>
              <TrendingUp className="h-4 w-4 mr-2" />
              New Activity
            </Button>
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-400">Total Distance</span>
              </div>
              <div className="text-xl font-bold">{totalStats.totalDistance.toFixed(1)} km</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-400">Total Time</span>
              </div>
              <div className="text-xl font-bold">{formatTime(totalStats.totalDuration)}</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Image src="/banana-icon.png" alt="Banana Points" width={16} height={16} />
                <span className="text-sm text-zinc-400">Banana Points</span>
              </div>
              <div className="text-xl font-bold text-yellow-500">{totalStats.totalBananaPoints.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Image src="/shaka-coin.png" alt="Shaka Tokens" width={16} height={16} />
                <span className="text-sm text-zinc-400">Shaka Tokens</span>
              </div>
              <div className="text-xl font-bold text-primary">{totalStats.totalShakaTokens.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {activityTypes.map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(type)}
                  className="capitalize"
                >
                  {type === "all" ? "All" : `${getActivityIcon(type)} ${type}`}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activities List */}
        {activities.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-8 text-center">
              <p className="text-zinc-400 mb-4">
                {filter === "all" ? "No activities found" : `No ${filter} activities found`}
              </p>
              <Link href="/start-activity">
                <Button>Start Your First Activity</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getActivityIcon(activity.activity_type)}</span>
                      <div>
                        <h3 className="font-semibold">{activity.title}</h3>
                        <p className="text-sm text-zinc-400">{formatDate(activity.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-yellow-500">+{activity.banana_points_earned} 🍌</div>
                      <div className="text-xs text-primary">+{activity.shaka_tokens_earned} 🤙</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div className="text-center">
                      <div className="text-xs text-zinc-400">Time</div>
                      <div className="font-medium">{formatTime(activity.duration_minutes)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-zinc-400">Distance</div>
                      <div className="font-medium">{activity.distance_km} km</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-zinc-400">Calories</div>
                      <div className="font-medium">{activity.calories_burned}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-zinc-400">Steps</div>
                      <div className="font-medium">{activity.steps || 0}</div>
                    </div>
                  </div>

                  {/* Activity Features */}
                  {activity.activity_data && (
                    <div className="flex flex-wrap gap-2">
                      {activity.activity_data.merchandise_used?.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          👕 {activity.activity_data.merchandise_used.length} gear item
                          {activity.activity_data.merchandise_used.length > 1 ? "s" : ""}
                        </Badge>
                      )}
                      {activity.activity_data.depin_enabled && (
                        <Badge variant="outline" className="text-xs">
                          ⚡ Crypto mining
                        </Badge>
                      )}
                      {activity.activity_data.gear_bonus > 0 && (
                        <Badge variant="outline" className="text-xs text-green-400">
                          +{Math.round(activity.activity_data.gear_bonus * 100)}% bonus
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <TabBar activeTab="profile" />
    </AppShell>
  )
}
