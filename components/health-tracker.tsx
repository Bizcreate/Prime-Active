"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CircularProgress } from "@/components/circular-progress"
import { Activity, Heart, MapPin, Flame, Play, Pause, StopCircle, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type ActivityType =
  | "walking"
  | "running"
  | "cycling"
  | "swimming"
  | "skateboarding"
  | "surfing"
  | "snowboarding"
  | "other"

interface HealthData {
  steps: number
  distance: number
  calories: number
  heartRate: number
  goalCompletion: number
}

interface ActivitySummary extends HealthData {
  activityType: ActivityType
  duration: number
  notes?: string
  date: Date
}

export function HealthTracker() {
  const router = useRouter()
  const [isTracking, setIsTracking] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    distance: 0,
    calories: 0,
    heartRate: 0,
    goalCompletion: 0,
  })
  const [updateInterval, setUpdateInterval] = useState<NodeJS.Timeout | null>(null)
  const [activityType, setActivityType] = useState<ActivityType>("walking")
  const [activityNotes, setActivityNotes] = useState("")
  const [showSummary, setShowSummary] = useState(false)
  const [activitySummary, setActivitySummary] = useState<ActivitySummary | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)

  // Check for permissions on component mount
  useEffect(() => {
    checkPermissions()

    // Initialize with some data for preview/testing
    const initialData = getInitialHealthData()
    setHealthData(initialData)

    return () => {
      if (updateInterval) {
        clearInterval(updateInterval)
      }
    }
  }, [])

  // Get initial health data (with some realistic values for testing)
  const getInitialHealthData = (): HealthData => {
    // Generate some realistic starting values
    const steps = Math.floor(Math.random() * 2000) + 4000 // 4000-6000 steps
    const distance = Number.parseFloat((steps / 1500).toFixed(1)) // Roughly convert steps to km
    const calories = Math.floor(steps / 20) // Rough calorie estimate
    const heartRate = Math.floor(Math.random() * 15) + 65 // 65-80 bpm
    const goalCompletion = Math.floor((steps / 10000) * 100) // Assuming 10k steps is 100%

    return {
      steps,
      distance,
      calories,
      heartRate,
      goalCompletion: Math.min(goalCompletion, 100), // Cap at 100%
    }
  }

  // Check for required permissions
  const checkPermissions = async () => {
    // Check if we're in a preview/iframe environment
    const isPreviewEnvironment =
      typeof window !== "undefined" && (window.location.hostname.includes("vercel") || window.top !== window.self)

    if (isPreviewEnvironment) {
      // In preview, simulate permissions granted
      setPermissionGranted(true)
      return
    }

    // Check for geolocation permission
    try {
      if (navigator.permissions) {
        const result = await navigator.permissions.query({ name: "geolocation" as PermissionName })
        if (result.state === "granted") {
          setPermissionGranted(true)
        }
      } else if (navigator.geolocation) {
        // Fallback check
        navigator.geolocation.getCurrentPosition(
          () => setPermissionGranted(true),
          () => setPermissionGranted(false),
          { timeout: 5000 },
        )
      }
    } catch (err) {
      console.error("Error checking permissions:", err)
    }
  }

  // Request necessary permissions
  const requestPermissions = async () => {
    // Check if we're in a preview/iframe environment
    const isPreviewEnvironment =
      typeof window !== "undefined" && (window.location.hostname.includes("vercel") || window.top !== window.self)

    if (isPreviewEnvironment) {
      // In preview, simulate permissions granted
      setPermissionGranted(true)
      return true
    }

    // Request geolocation permission
    try {
      return new Promise<boolean>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            setPermissionGranted(true)
            resolve(true)
          },
          (error) => {
            console.error("Permission denied:", error)
            resolve(false)
          },
          { enableHighAccuracy: true, timeout: 10000 },
        )
      })
    } catch (err) {
      console.error("Error requesting permissions:", err)
      return false
    }
  }

  const startTracking = async () => {
    if (!permissionGranted) {
      const granted = await requestPermissions()
      if (!granted) return
    }

    setIsTracking(true)
    setStartTime(new Date())
    setShowSummary(false)
    setActivitySummary(null)

    // Simulate data updates
    const interval = setInterval(() => {
      setHealthData((prev) => {
        // Generate realistic increments
        const stepIncrement = Math.floor(Math.random() * 30) + 10 // 10-40 steps per update
        const newSteps = prev.steps + stepIncrement
        const newDistance = Number.parseFloat((newSteps / 1500).toFixed(1)) // Roughly convert steps to km
        const newCalories = Math.floor(newSteps / 20) // Rough calorie estimate

        // Heart rate varies slightly
        const heartRateChange = Math.floor(Math.random() * 5) - 2 // -2 to +2 bpm
        const newHeartRate = Math.max(60, Math.min(100, prev.heartRate + heartRateChange))

        // Goal completion based on steps (assuming 10k steps is 100%)
        const newGoalCompletion = Math.min(100, Math.floor((newSteps / 10000) * 100))

        return {
          steps: newSteps,
          distance: newDistance,
          calories: newCalories,
          heartRate: newHeartRate,
          goalCompletion: newGoalCompletion,
        }
      })
    }, 3000) // Update every 3 seconds

    setUpdateInterval(interval)
  }

  const stopTracking = () => {
    setIsTracking(false)

    if (updateInterval) {
      clearInterval(updateInterval)
      setUpdateInterval(null)
    }

    if (startTime) {
      const endTime = new Date()
      const durationMs = endTime.getTime() - startTime.getTime()
      const durationMinutes = Math.floor(durationMs / 60000)

      // Create activity summary
      const summary: ActivitySummary = {
        ...healthData,
        activityType,
        duration: durationMinutes,
        notes: activityNotes,
        date: new Date(),
      }

      setActivitySummary(summary)
      setShowSummary(true)
    }
  }

  // Navigate to detailed activity page
  const goToDetailedActivity = () => {
    stopTracking()
    router.push("/activity-summary")
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        {!showSummary ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-zinc-400">Daily Goal</h3>
                <p className="text-xl font-bold text-[#ffc72d]">{healthData.goalCompletion}% Complete</p>
              </div>
              <div className="h-16 w-16">
                <CircularProgress value={healthData.goalCompletion} size={64} strokeWidth={6} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <p className="text-xs text-zinc-400">Distance</p>
                </div>
                <p className="text-lg font-semibold text-[#ffc72d]">
                  {healthData.distance} <span className="text-xs text-zinc-400">km</span>
                </p>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <p className="text-xs text-zinc-400">Calories</p>
                </div>
                <p className="text-lg font-semibold text-[#ffc72d]">
                  {healthData.calories} <span className="text-xs text-zinc-400">kcal</span>
                </p>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4 text-green-500" />
                  <p className="text-xs text-zinc-400">Steps</p>
                </div>
                <p className="text-lg font-semibold text-[#ffc72d]">{healthData.steps.toLocaleString()}</p>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <p className="text-xs text-zinc-400">Heart Rate</p>
                </div>
                <p className="text-lg font-semibold text-[#ffc72d]">
                  {healthData.heartRate} <span className="text-xs text-zinc-400">bpm</span>
                </p>
              </div>
            </div>

            {!isTracking ? (
              <div className="space-y-3">
                <div className="mb-3">
                  <label className="text-sm text-zinc-400 mb-1 block">Activity Type</label>
                  <Select value={activityType} onValueChange={(value) => setActivityType(value as ActivityType)}>
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walking">Walking</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="cycling">Cycling</SelectItem>
                      <SelectItem value="swimming">Swimming</SelectItem>
                      <SelectItem value="skateboarding">Skateboarding</SelectItem>
                      <SelectItem value="surfing">Surfing</SelectItem>
                      <SelectItem value="snowboarding">Snowboarding</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-3">
                  <label className="text-sm text-zinc-400 mb-1 block">Notes (Optional)</label>
                  <Textarea
                    placeholder="Add notes about your activity..."
                    className="bg-zinc-800 border-zinc-700 resize-none"
                    value={activityNotes}
                    onChange={(e) => setActivityNotes(e.target.value)}
                  />
                </div>

                <Button
                  onClick={startTracking}
                  className="w-full bg-[#ffc72d] text-black hover:bg-[#e6b328] flex items-center justify-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Start Activity Tracking
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    onClick={stopTracking}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Pause className="h-4 w-4" />
                    Pause
                  </Button>
                  <Button
                    onClick={stopTracking}
                    variant="destructive"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <StopCircle className="h-4 w-4" />
                    Stop
                  </Button>
                </div>
                <Button onClick={goToDetailedActivity} className="w-full bg-[#ffc72d] text-black hover:bg-[#e6b328]">
                  View Detailed Activity
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="activity-summary">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Activity Summary</h3>
              <div className="bg-green-500/20 p-1 rounded-full">
                <Check className="h-5 w-5 text-green-500" />
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-zinc-400">Activity Type</p>
              <p className="text-lg font-semibold text-[#ffc72d] capitalize">{activitySummary?.activityType}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-zinc-400">Duration</p>
                <p className="text-lg font-semibold text-[#ffc72d]">
                  {activitySummary?.duration || 0} <span className="text-xs text-zinc-400">min</span>
                </p>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-zinc-400">Distance</p>
                <p className="text-lg font-semibold text-[#ffc72d]">
                  {activitySummary?.distance || 0} <span className="text-xs text-zinc-400">km</span>
                </p>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-zinc-400">Steps</p>
                <p className="text-lg font-semibold text-[#ffc72d]">{activitySummary?.steps.toLocaleString() || 0}</p>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-zinc-400">Calories</p>
                <p className="text-lg font-semibold text-[#ffc72d]">
                  {activitySummary?.calories || 0} <span className="text-xs text-zinc-400">kcal</span>
                </p>
              </div>
            </div>

            {activitySummary?.notes && (
              <div className="mb-4">
                <p className="text-sm text-zinc-400">Notes</p>
                <p className="text-sm bg-zinc-800/50 p-3 rounded-lg mt-1">{activitySummary.notes}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={() => setShowSummary(false)} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={goToDetailedActivity} className="flex-1 bg-[#ffc72d] text-black hover:bg-[#e6b328]">
                View Details
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
