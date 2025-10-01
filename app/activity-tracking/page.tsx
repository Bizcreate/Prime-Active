"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AppShell } from "@/components/app-shell"
import { TabBar } from "@/components/tab-bar"
import { supabase } from "@/lib/supabase"
import { Loader2, Play, Square, Clock, MapPin, Flame, Award } from "lucide-react"
import Image from "next/image"

export default function ActivityTrackingPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isTracking, setIsTracking] = useState(false)
  const [activityType, setActivityType] = useState("skateboarding")
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [distance, setDistance] = useState(0)
  const [calories, setCalories] = useState(0)
  const [locations, setLocations] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMiningEnabled, setIsMiningEnabled] = useState(false)

  // Check if IoTeX mining is enabled
  useEffect(() => {
    const checkMiningStatus = async () => {
      if (!user) return

      const { data } = await supabase
        .from("depin_nodes")
        .select("*")
        .eq("user_id", user.id)
        .eq("network_name", "iotex")
        .eq("status", "active")
        .maybeSingle()

      setIsMiningEnabled(!!data)
    }

    checkMiningStatus()
  }, [user])

  // Timer for tracking elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = new Date()
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000)
        setElapsedTime(elapsed)

        // Simulate distance and calories
        setDistance((prev) => prev + 0.01)
        setCalories((prev) => prev + 0.2)

        // Simulate location tracking
        if (elapsed % 10 === 0) {
          const newLocation = {
            latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
            longitude: -74.006 + (Math.random() - 0.5) * 0.01,
            timestamp: now.toISOString(),
          }
          setLocations((prev) => [...prev, newLocation])
        }
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isTracking, startTime])

  const startActivity = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to track activities",
        variant: "destructive",
      })
      return
    }

    setIsTracking(true)
    setStartTime(new Date())
    setElapsedTime(0)
    setDistance(0)
    setCalories(0)
    setLocations([])

    toast({
      title: "Activity started",
      description: `Tracking your ${activityType} activity`,
    })

    // Enable IoTeX mining if not already enabled
    if (!isMiningEnabled) {
      try {
        const response = await fetch("/api/iotex/start-mining", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        })

        if (response.ok) {
          setIsMiningEnabled(true)
          toast({
            title: "IoTeX mining activated",
            description: "You'll earn IOTX tokens for this activity",
          })
        }
      } catch (error) {
        console.error("Failed to start IoTeX mining:", error)
      }
    }
  }

  const stopActivity = async () => {
    if (!isTracking || !startTime || !user) return

    setIsTracking(false)
    setIsSubmitting(true)

    try {
      // Calculate duration in minutes
      const endTime = new Date()
      const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / 60000)

      // Calculate rewards
      const bananaPoints = Math.floor(durationMinutes * 0.8)
      const shakaTokens = Number.parseFloat((durationMinutes * 0.05).toFixed(2))

      // Save activity to database
      const { data: activity, error } = await supabase
        .from("activities")
        .insert({
          user_id: user.id,
          activity_type: activityType,
          title: `${activityType.charAt(0).toUpperCase() + activityType.slice(1)} Session`,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          duration_minutes: durationMinutes,
          distance_km: Number.parseFloat(distance.toFixed(2)),
          calories_burned: Math.floor(calories),
          banana_points_earned: bananaPoints,
          shaka_tokens_earned: shakaTokens,
          location_data: { locations },
          is_verified: true,
        })
        .select()
        .single()

      if (error) throw error

      // Submit to IoTeX for mining rewards
      if (isMiningEnabled) {
        const iotexResponse = await fetch("/api/iotex/submit-activity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            activityId: activity.id,
            type: activityType,
            duration: durationMinutes,
            distance: Number.parseFloat(distance.toFixed(2)),
            locations,
          }),
        })

        const iotexData = await iotexResponse.json()

        if (iotexData.success) {
          toast({
            title: "IOTX tokens earned!",
            description: `You earned ${iotexData.reward.amount} IOTX for this activity`,
          })
        }
      }

      toast({
        title: "Activity completed",
        description: `You earned ${bananaPoints} Banana Points and ${shakaTokens} Shaka Tokens`,
      })
    } catch (error: any) {
      console.error("Error saving activity:", error)
      toast({
        title: "Error saving activity",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <AppShell>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Activity Tracking</h1>

        <Card className="mb-6 border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="mr-2">
                {activityType === "skateboarding" && "🛹"}
                {activityType === "surfing" && "🏄‍♂️"}
                {activityType === "running" && "🏃‍♂️"}
              </div>
              {activityType.charAt(0).toUpperCase() + activityType.slice(1)}
            </CardTitle>
            <CardDescription>Track your activity and earn rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-mono mb-4">{formatTime(elapsedTime)}</div>

              <div className="grid grid-cols-3 gap-4 w-full mb-6">
                <div className="flex flex-col items-center">
                  <Clock className="h-5 w-5 text-zinc-400 mb-1" />
                  <div className="text-sm text-zinc-400">Time</div>
                  <div className="font-medium">{formatTime(elapsedTime)}</div>
                </div>
                <div className="flex flex-col items-center">
                  <MapPin className="h-5 w-5 text-zinc-400 mb-1" />
                  <div className="text-sm text-zinc-400">Distance</div>
                  <div className="font-medium">{distance.toFixed(2)} km</div>
                </div>
                <div className="flex flex-col items-center">
                  <Flame className="h-5 w-5 text-zinc-400 mb-1" />
                  <div className="text-sm text-zinc-400">Calories</div>
                  <div className="font-medium">{Math.floor(calories)}</div>
                </div>
              </div>

              {isMiningEnabled && (
                <div className="flex items-center mb-4 bg-yellow-900/20 p-2 rounded-lg">
                  <Image src="/iotex-logo.png" alt="IoTeX" width={24} height={24} className="mr-2" />
                  <span className="text-sm text-yellow-500">IoTeX mining active - earning IOTX tokens</span>
                </div>
              )}

              {isTracking ? (
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={stopActivity}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Square className="mr-2 h-4 w-4" />
                      Stop Activity
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="lg"
                  onClick={startActivity}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Activity
                </Button>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center">
              <Award className="h-4 w-4 text-primary mr-1" />
              <span className="text-sm">Earn Banana Points + IOTX tokens</span>
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Select Activity Type</h2>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={activityType === "skateboarding" ? "default" : "outline"}
              className={activityType === "skateboarding" ? "bg-primary" : ""}
              onClick={() => setActivityType("skateboarding")}
              disabled={isTracking}
            >
              🛹 Skateboarding
            </Button>
            <Button
              variant={activityType === "surfing" ? "default" : "outline"}
              className={activityType === "surfing" ? "bg-primary" : ""}
              onClick={() => setActivityType("surfing")}
              disabled={isTracking}
            >
              🏄‍♂️ Surfing
            </Button>
            <Button
              variant={activityType === "running" ? "default" : "outline"}
              className={activityType === "running" ? "bg-primary" : ""}
              onClick={() => setActivityType("running")}
              disabled={isTracking}
            >
              🏃‍♂️ Running
            </Button>
          </div>
        </div>
      </div>

      <TabBar activeTab="activity" />
    </AppShell>
  )
}
