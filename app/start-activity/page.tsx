"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ActivityCard } from "@/components/activity-card"
import { ArrowLeft, Clock, MapPin, Heart, Flame, Play, Pause, StopCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatTime, formatDistance, formatCalories } from "@/lib/utils"

export default function StartActivityPage() {
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [activityType, setActivityType] = useState<string>("running")
  const [elapsedTime, setElapsedTime] = useState(0)
  const [distance, setDistance] = useState(0)
  const [calories, setCalories] = useState(0)
  const [heartRate, setHeartRate] = useState(0)

  const router = useRouter()

  const toggleActivity = () => {
    if (!isActive) {
      // Start activity
      setIsActive(true)
      setIsPaused(false)
      // In a real app, we would start tracking location, etc.
      startMockDataUpdates()
    } else if (!isPaused) {
      // Pause activity
      setIsPaused(true)
      // In a real app, we would pause tracking
    } else {
      // Resume activity
      setIsPaused(false)
      // In a real app, we would resume tracking
    }
  }

  const stopActivity = () => {
    setIsActive(false)
    setIsPaused(false)
    // In a real app, we would stop tracking and save the activity
    router.push("/activity-summary")
  }

  // Mock data updates for demo purposes
  const startMockDataUpdates = () => {
    const interval = setInterval(() => {
      if (isActive && !isPaused) {
        setElapsedTime((prev) => prev + 1)
        setDistance((prev) => prev + 0.001)
        setCalories((prev) => prev + 0.1)
        setHeartRate(120 + Math.floor(Math.random() * 20))
      }
    }, 1000)

    return () => clearInterval(interval)
  }

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">{isActive ? "Activity in Progress" : "Start Activity"}</h1>
        </div>

        {!isActive && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Choose Activity Type</h2>
            <div className="grid grid-cols-2 gap-3">
              <ActivityCard
                type="running"
                title="Running"
                value="Track"
                unit="run"
                onClick={() => setActivityType("running")}
              />
              <ActivityCard
                type="walking"
                title="Walking"
                value="Track"
                unit="walk"
                onClick={() => setActivityType("walking")}
              />
              <ActivityCard
                type="skateboarding"
                title="Skateboarding"
                value="Track"
                unit="skate"
                onClick={() => setActivityType("skateboarding")}
              />
              <ActivityCard
                type="surfing"
                title="Surfing"
                value="Track"
                unit="surf"
                onClick={() => setActivityType("surfing")}
              />
              <ActivityCard
                type="snowboarding"
                title="Snowboarding"
                value="Track"
                unit="snow"
                onClick={() => setActivityType("snowboarding")}
              />
              <ActivityCard
                type="mountainbiking"
                title="Biking"
                value="Track"
                unit="bike"
                onClick={() => setActivityType("mountainbiking")}
              />
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="h-60 w-full rounded-lg overflow-hidden map-container relative mb-3">
            {/* Map placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              {!isActive ? (
                <div className="bg-black/50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-white">Map will display your route here</p>
                </div>
              ) : (
                <>
                  {/* User location marker */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 rounded-full bg-burnz-500 animate-pulse"></div>
                    <div className="h-10 w-10 rounded-full bg-burnz-500/20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                  </div>

                  {/* Mock route path */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 240">
                    <path
                      d="M100,120 C150,80 200,160 300,120"
                      fill="none"
                      stroke="#FF8800"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="5,5"
                    />
                  </svg>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-burnz-500" />
                <div>
                  <p className="text-xs text-zinc-400">Duration</p>
                  <p className="text-lg font-semibold">{formatTime(elapsedTime)}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-zinc-400">Distance</p>
                  <p className="text-lg font-semibold">{formatDistance(distance * 1000)}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-xs text-zinc-400">Heart Rate</p>
                  <p className="text-lg font-semibold">{heartRate > 0 ? `${heartRate} bpm` : "--"}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Flame className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-xs text-zinc-400">Calories</p>
                  <p className="text-lg font-semibold">{formatCalories(calories)}</p>
                </div>
              </div>
            </div>
          </div>

          {!isActive ? (
            <Button className="w-full py-6 text-lg" onClick={toggleActivity}>
              <Play className="h-5 w-5 mr-2" /> Start Activity
            </Button>
          ) : (
            <div className="space-y-3">
              <Button
                className={`w-full py-6 text-lg ${isPaused ? "bg-burnz-500 hover:bg-burnz-600" : "bg-red-500 hover:bg-red-600"}`}
                onClick={toggleActivity}
              >
                {isPaused ? (
                  <>
                    <Play className="h-5 w-5 mr-2" /> Resume Activity
                  </>
                ) : (
                  <>
                    <Pause className="h-5 w-5 mr-2" /> Pause Activity
                  </>
                )}
              </Button>

              <Button variant="outline" className="w-full py-4 text-lg" onClick={stopActivity}>
                <StopCircle className="h-5 w-5 mr-2" /> End Activity
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
