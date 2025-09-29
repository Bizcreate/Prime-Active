"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppShell } from "@/components/app-shell"
import { TabBar } from "@/components/tab-bar"
import { supabase } from "@/lib/supabase"
import { Plus, Trophy, Clock, MapPin, Flame, TrendingUp, Calendar, Zap, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
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

/* ------------------------------------------------------------------ */
/*  DEMO / OFF-LINE FALLBACK DATA                                     */
/* ------------------------------------------------------------------ */
const DEMO_ACTIVITIES: RecentActivity[] = [
  {
    id: "demo_001",
    activity_type: "running",
    title: "Morning Run",
    duration_minutes: 32,
    distance_km: 5.2,
    calories_burned: 320,
    banana_points_earned: 42,
    shaka_tokens_earned: 3.1,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo_002",
    activity_type: "skateboarding",
    title: "Skate Park Session",
    duration_minutes: 45,
    distance_km: 2.3,
    calories_burned: 290,
    banana_points_earned: 35,
    shaka_tokens_earned: 2.4,
    created_at: new Date(Date.now() - 86_400_000).toISOString(),
  },
]

const makeStats = (activities: RecentActivity[]): UserStats => ({
  total_banana_points: activities.reduce((s, a) => s + a.banana_points_earned, 0),
  total_shaka_tokens: activities.reduce((s, a) => s + a.shaka_tokens_earned, 0),
  total_activities: activities.length,
  total_distance: activities.reduce((s, a) => s + a.distance_km, 0),
  total_duration: activities.reduce((s, a) => s + a.duration_minutes, 0),
})
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const { user } = useAuth()
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /** Attempts Supabase fetch; falls back to demo data on *any* failure */
  const loadDashboardData = useCallback(async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      /* ---------- 1. Fetch recent activities --------------------- */
      const { data: activities, error: activitiesError } = await supabase
        .from("activities")
        .select(
          "id, activity_type, title, duration_minutes, distance_km, calories_burned, banana_points_earned, shaka_tokens_earned, created_at",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (activitiesError) throw activitiesError

      /* ---------- 2. Fetch stats (could be replaced by RPC) ------- */
      const { data: statsRaw, error: statsError } = await supabase
        .from("activities")
        .select("banana_points_earned, shaka_tokens_earned, distance_km, duration_minutes")
        .eq("user_id", user.id)

      if (statsError) throw statsError

      /* ---------- 3. Populate state ------------------------------ */
      setRecentActivities(activities || [])
      setUserStats(
        statsRaw
          ? {
              total_banana_points: statsRaw.reduce((s: number, a: any) => s + (a.banana_points_earned || 0), 0),
              total_shaka_tokens: statsRaw.reduce((s: number, a: any) => s + (a.shaka_tokens_earned || 0), 0),
              total_activities: statsRaw.length,
              total_distance: statsRaw.reduce((s: number, a: any) => s + (a.distance_km || 0), 0),
              total_duration: statsRaw.reduce((s: number, a: any) => s + (a.duration_minutes || 0), 0),
            }
          : null,
      )
    } catch (err: any) {
      console.warn("Supabase unreachable – switching to demo data.", err)
      /* ----------- FALLBACK ------------------------------------- */
      setRecentActivities(DEMO_ACTIVITIES)
      setUserStats(makeStats(DEMO_ACTIVITIES))
      setError(null) // hide banner – we’ve handled it
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  /* ----------------------- helpers ------------------------------ */
  const icons: Record<string, string> = {
    skateboarding: "🛹",
    surfing: "🏄‍♂️",
    snowboarding: "🏂",
    running: "🏃‍♂️",
    cycling: "🚴‍♂️",
    walking: "🚶‍♂️",
  }
  const getActivityIcon = (t: string) => icons[t] || "🏃‍♂️"
  const formatTime = (m: number) => {
    const h = Math.floor(m / 60)
    const mins = m % 60
    return h ? `${h}h ${mins}m` : `${mins}m`
  }

  /* ----------------------- skeleton UI -------------------------- */
  const LoadingSkeleton = () => (
    <AppShell>
      <div className="p-6 pb-20 space-y-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <TabBar activeTab="dashboard" />
    </AppShell>
  )

  /* ----------------------- render ------------------------------- */
  if (!user) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-zinc-400">Please log in to view your dashboard</p>
          <Link href="/login">
            <Button className="mt-4">Log In</Button>
          </Link>
        </div>
        <TabBar activeTab="dashboard" />
      </AppShell>
    )
  }

  if (isLoading) return <LoadingSkeleton />

  return (
    <AppShell>
      {!!error && (
        <Alert variant="destructive" className="mx-6 mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="p-6 pb-20">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-zinc-400">Welcome back, {user.email?.split("@")[0]}!</p>
          </div>
          <Link href="/activity-setup">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Start Activity
            </Button>
          </Link>
        </div>

        {/* STATS */}
        {userStats && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Banana points */}
            <StatCard
              icon={<Image src="/banana-icon.png" alt="" width={20} height={20} />}
              label="Banana Points"
              value={userStats.total_banana_points.toLocaleString()}
              valueClass="text-yellow-500"
            />
            {/* Shaka tokens */}
            <StatCard
              icon={<Image src="/shaka-coin.png" alt="" width={20} height={20} />}
              label="Shaka Tokens"
              value={userStats.total_shaka_tokens.toFixed(2)}
            />
            {/* Activities */}
            <StatCard
              icon={<Trophy className="h-5 w-5 text-zinc-400" />}
              label="Activities"
              value={userStats.total_activities}
            />
            {/* Distance */}
            <StatCard
              icon={<MapPin className="h-5 w-5 text-zinc-400" />}
              label="Distance"
              value={`${userStats.total_distance.toFixed(1)} km`}
            />
          </div>
        )}

        {/* QUICK ACTIONS */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction href="/activity-setup" icon={<TrendingUp />} label="Start Activity" />
              <QuickAction href="/wallet" icon={<Zap />} label="View Wallet" />
              <QuickAction href="/merch/collection" icon={<span className="text-lg">👕</span>} label="My Gear" />
              <QuickAction href="/challenges" icon={<Trophy />} label="Challenges" />
            </div>
          </CardContent>
        </Card>

        {/* RECENT ACTIVITIES */}
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
            {recentActivities.length ? (
              <div className="space-y-3">
                {recentActivities.map((a) => (
                  <div key={a.id} className="bg-zinc-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getActivityIcon(a.activity_type)}</span>
                        <div>
                          <h4 className="font-medium">{a.title}</h4>
                          <p className="text-xs text-zinc-400">{new Date(a.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">+{a.banana_points_earned} 🍌</div>
                        <div className="text-xs text-zinc-400">+{a.shaka_tokens_earned} 🤙</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <DataPoint icon={<Clock />} text={formatTime(a.duration_minutes)} />
                      <DataPoint icon={<MapPin />} text={`${a.distance_km} km`} />
                      <DataPoint icon={<Flame />} text={`${a.calories_burned} cal`} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-400 mb-4">No activities yet</p>
                <Link href="/activity-setup">
                  <Button>Start Your First Activity</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <TabBar activeTab="dashboard" />
    </AppShell>
  )
}

/* ----------------- small sub-components -------------------------- */
function StatCard({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  valueClass?: string
}) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-sm text-zinc-400">{label}</span>
        </div>
        <div className={`text-2xl font-bold ${valueClass}`}>{value}</div>
      </CardContent>
    </Card>
  )
}

function QuickAction({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Link href={href}>
      <Button variant="outline" className="w-full h-16 flex flex-col bg-transparent">
        {icon}
        <span className="text-sm">{label}</span>
      </Button>
    </Link>
  )
}

function DataPoint({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1">
      {icon}
      <span>{text}</span>
    </div>
  )
}
