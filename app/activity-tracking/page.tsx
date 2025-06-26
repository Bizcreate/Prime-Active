"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"
import { Loader2, Play, Square, Clock, MapPin, Flame, Award, Shirt, Zap } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { merchandiseWearService } from "@/services/merchandise-wear-service"

export default function ActivityTrackingPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isTracking, setIsTracking] = useState(false)
  const [activityType, setActivityType] = useState("")
  const [selectedMerchandise, setSelectedMerchandise] = useState<string[]>([])
  const [depinEnabled, setDepinEnabled] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [distance, setDistance] = useState(0)
  const [calories, setCalories] = useState(0)
  const [steps, setSteps] = useState(0)
  const [locations, setLocations] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Get setup data from URL parameters
    const type = searchParams.get("type")
    const merchandise = searchParams.get("merchandise")
    const depin = searchParams.get("depin")

    if (type) setActivityType(type)
    if (merchandise) {
      try {
        setSelectedMerchandise(JSON.parse(merchandise))
      } catch (e) {
        console.error("Failed to parse merchandise data:", e)
      }
    }
    if (depin) setDepinEnabled(depin === "true")
  }, [searchParams])

  // Timer for tracking elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = new Date()
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000)
        setElapsedTime(elapsed)

        // Simulate realistic activity data
        const activityMultiplier = getActivityMultiplier(activityType)
        setDistance((prev) => prev + 0.008 * activityMultiplier)
        setCalories((prev) => prev + 0.15 * activityMultiplier)
        setSteps((prev) => prev + Math.floor(Math.random() * 3) + 1)

        // Simulate location tracking every 30 seconds
        if (elapsed % 30 === 0) {
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
  }, [isTracking, startTime, activityType])

  const getActivityMultiplier = (type: string) => {
    const multipliers: Record<string, number> = {
      running: 1.5,
      cycling: 2.0,
      skateboarding: 1.2,
      surfing: 1.0,
      snowboarding: 1.3,
      walking: 0.8,
    }
    return multipliers[type] || 1.0
  }

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
    setSteps(0)
    setLocations([])

    toast({
      title: "Activity started",
      description: `Tracking your ${activityType} activity`,
    })
  }

  const stopActivity = async () => {
    if (!isTracking || !startTime || !user) return

    setIsTracking(false)
    setIsSubmitting(true)

    try {
      // Calculate duration in minutes
      const endTime = new Date()
      const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / 60000)

      // Calculate base rewards
      const baseMultiplier = getActivityMultiplier(activityType)
      const gearBonus = selectedMerchandise.length * 0.2 // 20% bonus per gear item
      const totalMultiplier = baseMultiplier * (1 + gearBonus)

      const bananaPoints = Math.floor(durationMinutes * 0.8 * totalMultiplier)
      const shakaTokens = Number.parseFloat((durationMinutes * 0.05 * totalMultiplier).toFixed(2))

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
          steps: steps,
          banana_points_earned: bananaPoints,
          shaka_tokens_earned: shakaTokens,
          location_data: { locations },
          activity_data: {
            merchandise_used: selectedMerchandise,
            depin_enabled: depinEnabled,
            gear_bonus: gearBonus,
          },
          is_verified: true,
        })
        .select()
        .single()

      if (error) throw error

      // Submit to IoTeX for mining rewards if enabled
      let iotexReward = 0
      if (depinEnabled) {
        try {
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
              merchandise: selectedMerchandise,
            }),
          })

          const iotexData = await iotexResponse.json()

          if (iotexData.success) {
            iotexReward = iotexData.reward.amount
          }
        } catch (error) {
          console.error("IoTeX submission failed:", error)
        }
      }

      // Update user totals
      await supabase.rpc("update_user_tokens", {
        user_id: user.id,
        banana_points: bananaPoints,
        shaka_tokens: shakaTokens,
      })

      // Stop wearing merchandise
      selectedMerchandise.forEach((id) => {
        merchandiseWearService.stopWearing(id)
      })

      // Navigate to activity summary
      router.push(`/activity-summary?activityId=${activity.id}&iotexReward=${iotexReward}`)
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

  if (!activityType) {
    return (
      <AppShell>
        <div className="p-6 text-center">
          <p className="text-zinc-400 mb-4">No activity selected</p>
          <Button onClick={() => router.push("/activity-setup")}>Set Up Activity</Button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="p-6">
        <Card className="mb-6 border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="mr-3 text-3xl">{getActivityIcon(activityType)}</div>
              <div>
                <h1 className="text-xl">{activityType.charAt(0).toUpperCase() + activityType.slice(1)}</h1>
                <p className="text-sm text-zinc-400 font-normal">
                  {isTracking ? "Tracking in progress" : "Ready to start"}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-mono mb-6">{formatTime(elapsedTime)}</div>

              <div className="grid grid-cols-2 gap-4 w-full mb-6">
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
                <div className="flex flex-col items-center">
                  <Award className="h-5 w-5 text-zinc-400 mb-1" />
                  <div className="text-sm text-zinc-400">Steps</div>
                  <div className="font-medium">{steps}</div>
                </div>
              </div>

              {/* Active Features */}
              <div className="w-full space-y-2 mb-6">
                {selectedMerchandise.length > 0 && (
                  <div className="flex items-center justify-center bg-green-900/20 p-2 rounded-lg">
                    <Shirt className="h-4 w-4 text-green-400 mr-2" />
                    <span className="text-sm text-green-400">
                      {selectedMerchandise.length} gear item{selectedMerchandise.length > 1 ? "s" : ""} active
                    </span>
                  </div>
                )}

                {depinEnabled && (
                  <div className="flex items-center justify-center bg-yellow-900/20 p-2 rounded-lg">
                    <Zap className="h-4 w-4 text-yellow-400 mr-2" />
                    <span className="text-sm text-yellow-400">Crypto mining active</span>
                  </div>
                )}
              </div>

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
                      Saving Activity...
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
        </Card>
      </div>
    </AppShell>
  )
}
