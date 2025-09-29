"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Trophy, TrendingUp, MapPin, Clock, Zap, Plus } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useAppState } from "@/context/AppStateContext"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user } = useAuth()
  const { state } = useAppState()
  const router = useRouter()
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  // Redirect to onboarding if not authenticated
  useEffect(() => {
    if (!user && !state.isLoading) {
      router.push("/onboarding")
    }
  }, [user, state.isLoading, router])

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  const recentActivities = state.activities.slice(0, 3)
  const totalActivities = state.activities.length
  const totalDistance = state.activities.reduce((sum, activity) => sum + (activity.distance || 0), 0)
  const totalCalories = state.activities.reduce((sum, activity) => sum + (activity.calories || 0), 0)

  return (
    <main className="min-h-screen bg-black p-6 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{greeting}!</h1>
            <p className="text-zinc-400">{user.user_metadata?.username || user.email?.split("@")[0] || "Rider"}</p>
          </div>
          <Link href="/profile">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-black font-bold">
                {(user.user_metadata?.username?.[0] || user.email?.[0] || "U").toUpperCase()}
              </span>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{state.tokens.banana}</div>
              <div className="text-xs text-zinc-400">Banana Points</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{state.tokens.shaka}</div>
              <div className="text-xs text-zinc-400">Shaka Tokens</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{totalActivities}</div>
              <div className="text-xs text-zinc-400">Activities</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/activity-setup">
              <Button className="w-full h-12 text-left justify-start">
                <Plus className="h-5 w-5 mr-3" />
                Start New Activity
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/challenges">
                <Button variant="outline" className="w-full bg-transparent">
                  <Trophy className="h-4 w-4 mr-2" />
                  Challenges
                </Button>
              </Link>
              <Link href="/map">
                <Button variant="outline" className="w-full bg-transparent">
                  <MapPin className="h-4 w-4 mr-2" />
                  Explore
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <Link href="/activity-history">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium capitalize">{activity.type}</div>
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {activity.duration}min
                          {activity.distance && (
                            <>
                              <span>•</span>
                              <span>{activity.distance.toFixed(1)}mi</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">+{Math.floor(activity.duration * 2)} pts</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-400 mb-4">No activities yet</p>
                <Link href="/activity-setup">
                  <Button>Start Your First Activity</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{totalDistance.toFixed(1)}</div>
                <div className="text-sm text-zinc-400">Miles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{totalCalories}</div>
                <div className="text-sm text-zinc-400">Calories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Preview */}
        {state.achievements.filter((a) => a.earned).length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Latest Achievement
              </CardTitle>
              <Link href="/achievements">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {(() => {
                const latestAchievement = state.achievements
                  .filter((a) => a.earned)
                  .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())[0]

                return latestAchievement ? (
                  <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <div className="font-medium">{latestAchievement.title}</div>
                      <div className="text-sm text-zinc-400">{latestAchievement.description}</div>
                    </div>
                  </div>
                ) : null
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
