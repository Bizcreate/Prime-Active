"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppShell } from "@/components/app-shell"
import { TabBar } from "@/components/tab-bar"
import { supabase } from "@/lib/supabase"
import { Plus, Trophy, Clock, MapPin, Flame, TrendingUp, Calendar, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface RecentActivity {
  id: string
  activity_type: string
  title: string
  duration_minutes: number
  distance_km: number
  calories_burned: number
  banana_points_earned: number
  shaka_tokens_earned: number
  created_at: string
}

interface UserStats {
  total_banana_points: number
  total_shaka_tokens: number
  total_activities: number
  total_distance: number
  total_duration: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return

      try {
        // Load recent activities
        const { data: activities, error: activitiesError } = await supabase
          .from("activities")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (activitiesError) throw activitiesError

        setRecentActivities(activities || [])

        // Load user stats
        const { data: stats, error: statsError } = await supabase
          .from("activities")
          .select(`
            banana_points_earned,
            shaka_tokens_earned,
            distance_km,
            duration_minutes
          `)
          .eq("user_id", user.id)

        if (statsError) throw statsError

        if (stats) {
          const userStats: UserStats = {
            total_banana_points: stats.reduce((sum, activity) => sum + (activity.banana_points_earned || 0), 0),
            total_shaka_tokens: stats.reduce((sum, activity) => sum + (activity.shaka_tokens_earned || 0), 0),
            total_activities: stats.length,
            total_distance: stats.reduce((sum, activity) => sum + (activity.distance_km || 0), 0),
            total_duration: stats.reduce((sum, activity) => sum + (activity.duration_minutes || 0), 0),
          }
          setUserStats(userStats)
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

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

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-400">Loading dashboard...</p>
        </div>
        <TabBar activeTab="dashboard" />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="p-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-zinc-400">Welcome back, {user?.email?.split("@")[0]}!</p>
          </div>
          <Link href="/activity-setup">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Start Activity
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        {userStats && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Image src="/banana-icon.png" alt="Banana Points" width={20} height={20} />
                  <span className="text-sm text-zinc-400">Banana Points</span>
                </div>
                <div className="text-2xl font-bold text-yellow-500">
                  {userStats.total_banana_points.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Image src="/shaka-coin.png" alt="Shaka Tokens" width={20} height={20} />
                  <span className="text-sm text-zinc-400">Shaka Tokens</span>
                </div>
                <div className="text-2xl font-bold text-primary">{userStats.total_shaka_tokens.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-zinc-400" />
                  <span className="text-sm text-zinc-400">Activities</span>
                </div>
                <div className="text-2xl font-bold">{userStats.total_activities}</div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-zinc-400" />
                  <span className="text-sm text-zinc-400">Distance</span>
                </div>
                <div className="text-2xl font-bold">{userStats.total_distance.toFixed(1)}km</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/activity-setup">
                <Button variant="outline" className="w-full h-16 flex flex-col">
                  <TrendingUp className="h-5 w-5 mb-1" />
                  <span className="text-sm">Start Activity</span>
                </Button>
              </Link>
              <Link href="/wallet">
                <Button variant="outline" className="w-full h-16 flex flex-col">
                  <Zap className="h-5 w-5 mb-1" />
                  <span className="text-sm">View Wallet</span>
                </Button>
              </Link>
              <Link href="/merch/collection">
                <Button variant="outline" className="w-full h-16 flex flex-col">
                  <span className="text-lg mb-1">👕</span>
                  <span className="text-sm">My Gear</span>
                </Button>
              </Link>
              <Link href="/challenges">
                <Button variant="outline" className="w-full h-16 flex flex-col">
                  <Trophy className="h-5 w-5 mb-1" />
                  <span className="text-sm">Challenges</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <Link href="/activity-history">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-zinc-400 mb-4">No activities yet</p>
                <Link href="/activity-setup">
                  <Button>Start Your First Activity</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="bg-zinc-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getActivityIcon(activity.activity_type)}</span>
                        <div>
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-xs text-zinc-400">{new Date(activity.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">+{activity.banana_points_earned} 🍌</div>
                        <div className="text-xs text-zinc-400">+{activity.shaka_tokens_earned} 🤙</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-zinc-400" />
                        <span>{formatTime(activity.duration_minutes)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-zinc-400" />
                        <span>{activity.distance_km}km</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-zinc-400" />
                        <span>{activity.calories_burned} cal</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <TabBar activeTab="dashboard" />
    </AppShell>
  )
}
