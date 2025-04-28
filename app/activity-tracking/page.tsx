"use client"

import { useState, useEffect, useRef } from "react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, MapPin, Heart, Flame, Play, Pause, StopCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { formatTime, formatDistance, formatCalories } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { merchandiseWearService, type ConnectedMerchandise } from "@/services/merchandise-wear-service"

export default function ActivityTrackingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Use refs to store initial values from URL parameters
  const initialParamsProcessed = useRef(false)

  const [isActive, setIsActive] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [activityType, setActivityType] = useState("")
  const [activityName, setActivityName] = useState("")
  const [location, setLocation] = useState("")
  const [elapsedTime, setElapsedTime] = useState(0)
  const [distance, setDistance] = useState(0)
  const [calories, setCalories] = useState(0)
  const [heartRate, setHeartRate] = useState(0)
  const [wornMerchandise, setWornMerchandise] = useState<ConnectedMerchandise[]>([])

  // Process URL parameters only once on initial render
  useEffect(() => {
    if (initialParamsProcessed.current) return

    // Get activity details from URL parameters
    const type = searchParams.get("type") || ""
    const name = searchParams.get("name") || ""
    const loc = searchParams.get("location") || ""
    const merchParam = searchParams.get("merchandise") || ""

    // Set activity details
    setActivityType(type)
    if (name) setActivityName(decodeURIComponent(name))
    if (loc) setLocation(decodeURIComponent(loc))

    // Process merchandise
    if (merchParam) {
      try {
        const merchIds = JSON.parse(decodeURIComponent(merchParam)) as string[]
        // Get merchandise items outside of render cycle
        const merchandise: ConnectedMerchandise[] = []

        merchIds.forEach((id) => {
          const item = merchandiseWearService.getMerchandiseById(id)
          if (item) merchandise.push(item)
        })

        if (merchandise.length > 0) {
          setWornMerchandise(merchandise)
        }
      } catch (error) {
        console.error("Error parsing merchandise data:", error)
      }
    }

    initialParamsProcessed.current = true
  }, []) // Empty dependency array - run once on mount

  // Separate effect for the interval
  useEffect(() => {
    // Start tracking
    const interval = setInterval(() => {
      if (isActive && !isPaused) {
        setElapsedTime((prev) => prev + 1)
        setDistance((prev) => prev + 0.001)
        setCalories((prev) => prev + 0.1)
        setHeartRate(120 + Math.floor(Math.random() * 20))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, isPaused]) // Only depend on activity state

  const toggleActivity = () => {
    if (isPaused) {
      // Resume activity
      setIsPaused(false)
    } else {
      // Pause activity
      setIsPaused(true)
    }
  }

  const stopActivity = () => {
    setIsActive(false)
    setIsPaused(false)

    // Stop wearing all merchandise
    wornMerchandise.forEach((item) => {
      merchandiseWearService.stopWearing(item.id)
    })

    // In a real app, we would stop tracking and save the activity
    toast({
      title: "Activity completed",
      description: "Your activity has been saved",
    })
    router.push("/activity-summary")
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-black p-6 pb-20">
        <div className="flex items-center mb-6">
          <Link href="/start-activity">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Activity in Progress</h1>
        </div>

        <div className="mb-6">
          <div className="bg-zinc-900 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold">{activityName || "Activity"}</h2>
            {location && <p className="text-sm text-zinc-400">{location}</p>}
          </div>

          <div className="h-60 w-full rounded-lg overflow-hidden map-container relative mb-3">
            {/* Map placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
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
        </div>
        {/* Worn Merchandise Section */}
        {wornMerchandise.length > 0 && (
          <div className="mt-6 mb-4">
            <h3 className="text-md font-semibold mb-3">Wearing</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {wornMerchandise.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 bg-zinc-900 rounded-lg p-2 flex flex-col items-center"
                  style={{ width: "80px" }}
                >
                  <div className="w-12 h-12 rounded-md bg-zinc-800 overflow-hidden mb-1">
                    {item.image && (
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-xs text-center truncate w-full">{item.productName.split(" ")[0]}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
