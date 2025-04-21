"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CircularProgress } from "@/components/circular-progress"
import { useActivityTracking, type ActivityType } from "@/services/activity-tracking"
import { MapPin, Clock, Flame, Activity, Play, Pause, AlertTriangle, Bug } from "lucide-react"
import { useRouter } from "next/navigation"

interface ActivityTrackerProps {
  defaultActivityType?: ActivityType
}

export function ActivityTracker({ defaultActivityType = "walking" }: ActivityTrackerProps) {
  const router = useRouter()
  const [activityType, setActivityType] = useState<ActivityType>(defaultActivityType)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)
  const [showDebug, setShowDebug] = useState(false)

  const {
    isTracking,
    currentActivity,
    error,
    permissionStatus,
    stats,
    startActivity,
    stopActivity,
    requestLocationPermission,
    debug,
  } = useActivityTracking()

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Format distance in km with one decimal place
  const formatDistance = (km: number): string => {
    return km.toFixed(1)
  }

  // Handle start/stop activity
  const toggleTracking = async () => {
    if (isTracking) {
      // Stop tracking
      const completedActivity = stopActivity()
      if (completedActivity) {
        // Navigate to summary page
        router.push("/activity-summary")
      }
    } else {
      // Check permissions first
      if (permissionStatus !== "granted") {
        const granted = await requestLocationPermission()
        if (!granted) {
          return
        }
      }

      // Start tracking
      const success = await startActivity(activityType)
      if (success) {
        // Start timer
        const interval = setInterval(() => {
          setElapsedTime((prev) => prev + 1)
        }, 1000)
        setTimerInterval(interval)
      }
    }
  }

  // Clean up timer on unmount or when tracking stops
  useEffect(() => {
    if (!isTracking && timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
      setElapsedTime(0)
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [isTracking, timerInterval])

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        {error && (
          <div className="bg-red-900/20 border border-red-900 rounded-md p-3 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {permissionStatus === "denied" && (
          <div className="bg-amber-900/20 border border-amber-900 rounded-md p-3 mb-4">
            <p className="text-sm text-amber-500 mb-2">Location permission is required for activity tracking.</p>
            <Button variant="outline" size="sm" onClick={requestLocationPermission} className="w-full">
              Grant Permission
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-lg capitalize">{activityType}</h2>
            <p className="text-zinc-400 text-sm">{isTracking ? "Tracking in progress" : "Ready to start"}</p>
          </div>
          <div className="flex items-center gap-2">
            <CircularProgress
              value={isTracking ? 100 : 0}
              size={50}
              strokeWidth={5}
              className={isTracking ? "animate-pulse-slow" : ""}
            />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowDebug(!showDebug)}>
              <Bug className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-zinc-400">Duration</p>
              <p className="text-lg font-semibold">{formatTime(elapsedTime)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-zinc-400">Distance</p>
              <p className="text-lg font-semibold">{formatDistance(stats.distance)} km</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Flame className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-zinc-400">Calories</p>
              <p className="text-lg font-semibold">{stats.calories} kcal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-xs text-zinc-400">Steps</p>
              <p className="text-lg font-semibold">{stats.steps}</p>
            </div>
          </div>
        </div>

        {showDebug && (
          <div className="mb-4 bg-black/50 p-2 rounded-md">
            <p className="text-xs text-zinc-400 mb-1">Debug Info:</p>
            <div className="text-xs text-zinc-300 max-h-32 overflow-y-auto">
              <p>Permission: {permissionStatus || "unknown"}</p>
              <p>Tracking: {isTracking ? "yes" : "no"}</p>
              <p>Activity: {currentActivity?.type || "none"}</p>
              <div className="mt-1 border-t border-zinc-800 pt-1">
                {debug.map((log, i) => (
                  <p key={i} className="text-[10px] text-zinc-400">
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {!isTracking && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Activity Type</label>
            <div className="grid grid-cols-2 gap-2">
              {["walking", "running", "cycling", "skateboarding"].map((type) => (
                <Button
                  key={type}
                  variant={activityType === type ? "default" : "outline"}
                  className="capitalize"
                  onClick={() => setActivityType(type as ActivityType)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Button
          className="w-full flex items-center gap-2"
          onClick={toggleTracking}
          disabled={permissionStatus === "denied"}
        >
          {isTracking ? (
            <>
              <Pause className="h-4 w-4" />
              Stop Activity
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Start Activity
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
