"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Play, Pause, StopCircle, Timer, MapPin, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { CircularProgress } from "@/components/circular-progress"
import { FallbackPage } from "@/components/fallback-page"

export default function ActivityTrackingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [distance, setDistance] = useState(0)
  const [calories, setCalories] = useState(0)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    // Check if we're in a preview environment
    const checkPreviewMode = () => {
      // Check if we're in an iframe (common for previews)
      const inIframe = window !== window.parent
      // Check if we're in a Vercel preview environment
      const inVercelPreview = window.location.hostname.includes("vercel.app")

      return inIframe || inVercelPreview
    }

    setIsPreviewMode(checkPreviewMode())

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Simulate activity tracking
  useEffect(() => {
    if (isLoading || isPaused) return

    const interval = setInterval(() => {
      setDuration((prev) => prev + 1)
      setDistance((prev) => prev + 0.001)
      setCalories((prev) => prev + 0.1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isLoading, isPaused])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (isLoading) {
    return <FallbackPage />
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/start-activity">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Tracking Activity</h1>
        </div>

        {isPreviewMode && (
          <div className="bg-amber-900/20 border border-amber-900/30 rounded-lg p-4 mb-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-500 mb-1">Preview Mode</h3>
              <p className="text-sm text-zinc-300">
                Activity tracking is simulated in preview mode. Full tracking functionality is available in the deployed
                application.
              </p>
            </div>
          </div>
        )}

        <div className="bg-zinc-900 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold">Skateboarding</h2>
              <p className="text-sm text-zinc-500">In Progress</p>
            </div>
            <CircularProgress value={Math.min((duration / 3600) * 100, 100)} size={60} strokeWidth={6} />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-xs text-zinc-500 mb-1">Duration</p>
              <p className="text-lg font-bold">{formatDuration(duration)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-500 mb-1">Distance</p>
              <p className="text-lg font-bold">{distance.toFixed(2)} km</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-500 mb-1">Calories</p>
              <p className="text-lg font-bold">{Math.round(calories)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? (
                <>
                  <Play className="h-4 w-4 mr-2" /> Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4 mr-2" /> Pause
                </>
              )}
            </Button>
            <Link href="/activity-summary" className="flex-1">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                <StopCircle className="h-4 w-4 mr-2" /> End
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-zinc-800 p-2 rounded-full">
              <Timer className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Activity Stats</h3>
              <p className="text-xs text-zinc-500">Real-time tracking</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <p className="text-sm">Average Speed</p>
                <p className="text-sm font-bold">{(distance / (duration / 3600)).toFixed(1)} km/h</p>
              </div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <p className="text-sm">Elevation Gain</p>
                <p className="text-sm font-bold">{Math.round(duration * 0.2)} m</p>
              </div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <p className="text-sm">Steps</p>
                <p className="text-sm font-bold">{Math.round(duration * 20)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-zinc-800 p-2 rounded-full">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Current Location</h3>
              <p className="text-xs text-zinc-500">
                {isPreviewMode ? "Location tracking simulated in preview" : "GPS tracking active"}
              </p>
            </div>
          </div>

          <div className="h-40 bg-zinc-800 rounded-lg flex items-center justify-center">
            <p className="text-zinc-500">
              {isPreviewMode ? "Map preview disabled in preview mode" : "Map will display your current location"}
            </p>
          </div>
        </div>
      </div>

      <TabBar activeTab="none" />
    </div>
  )
}
