"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Calendar, Clock, MapPin, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface ActivityRecord {
  id: string
  type: "skateboarding" | "surfing" | "snowboarding" | "social" | "event"
  title: string
  date: string
  duration: string
  distance?: string
  location?: string
  points: number
  image?: string
  achievements?: string[]
}

export default function ActivityHistoryPage() {
  const [filter, setFilter] = useState<"all" | "skate" | "surf" | "snow" | "social" | "events">("all")

  const activityHistory: ActivityRecord[] = [
    {
      id: "act1",
      type: "skateboarding",
      title: "Downtown Skate Session",
      date: "Today",
      duration: "1h 23m",
      distance: "4.2 km",
      location: "Urban Skatepark",
      points: 320,
      image: "/urban-skate-session.png",
      achievements: ["Ollie Master", "Street Style"],
    },
    {
      id: "act2",
      type: "social",
      title: "Community Meetup",
      date: "Yesterday",
      duration: "2h 30m",
      location: "Prime Mates HQ",
      points: 150,
      image: "/placeholder.svg?height=200&width=400&query=group+of+people+meeting",
    },
    {
      id: "act3",
      type: "surfing",
      title: "Morning Surf",
      date: "3 days ago",
      duration: "1h 45m",
      distance: "N/A",
      location: "Sunset Beach",
      points: 280,
      image: "/surfer-silhouette.png",
      achievements: ["Wave Rider"],
    },
    {
      id: "act4",
      type: "event",
      title: "Beach Cleanup",
      date: "Last week",
      duration: "3h 15m",
      location: "North Shore",
      points: 500,
      image: "/placeholder.svg?height=200&width=400&query=beach+cleanup+volunteers",
      achievements: ["Community Hero", "Environmental Champion"],
    },
    {
      id: "act5",
      type: "snowboarding",
      title: "Powder Day",
      date: "2 weeks ago",
      duration: "4h 30m",
      distance: "12.8 km",
      location: "Mountain High",
      points: 420,
      image: "/powder-day-shred.png",
      achievements: ["Powder Hound"],
    },
    {
      id: "act6",
      type: "skateboarding",
      title: "Night Skate",
      date: "3 weeks ago",
      duration: "1h 10m",
      distance: "3.5 km",
      location: "City Center",
      points: 180,
      image: "/placeholder.svg?height=200&width=400&query=night+skateboarding+city+lights",
    },
  ]

  const filteredActivities =
    filter === "all"
      ? activityHistory
      : activityHistory.filter((a) => {
          if (filter === "skate") return a.type === "skateboarding"
          if (filter === "surf") return a.type === "surfing"
          if (filter === "snow") return a.type === "snowboarding"
          if (filter === "social") return a.type === "social"
          if (filter === "events") return a.type === "event"
          return true
        })

  // Calculate stats
  const totalActivities = activityHistory.length
  const totalPoints = activityHistory.reduce((sum, act) => sum + act.points, 0)
  const totalAchievements = activityHistory.reduce((sum, act) => sum + (act.achievements?.length || 0), 0)

  // Calculate total duration in minutes
  const totalDurationMinutes = activityHistory.reduce((sum, act) => {
    const durationParts = act.duration.split("h ")
    const hours = Number.parseInt(durationParts[0]) || 0
    const minutes = Number.parseInt(durationParts[1].replace("m", "")) || 0
    return sum + hours * 60 + minutes
  }, 0)

  // Format total duration
  const totalHours = Math.floor(totalDurationMinutes / 60)
  const totalMinutes = totalDurationMinutes % 60
  const formattedTotalDuration = `${totalHours}h ${totalMinutes}m`

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Activity History</h1>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Activities</p>
            </div>
            <p className="text-2xl font-bold">{totalActivities}</p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Image src="/banana-icon.png" alt="Banana Points" width={16} height={16} className="object-contain" />
              <p className="text-sm font-medium">Points</p>
            </div>
            <p className="text-2xl font-bold">{totalPoints}</p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Duration</p>
            </div>
            <p className="text-2xl font-bold">{formattedTotalDuration}</p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Achievements</p>
            </div>
            <p className="text-2xl font-bold">{totalAchievements}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Activity Filter</h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="rounded-full"
            >
              All
            </Button>
            <Button
              variant={filter === "skate" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("skate")}
              className="rounded-full flex items-center gap-1"
            >
              <Image src="/shaka-icon.png" alt="Skate" width={16} height={16} className="object-contain" />
              Skate
            </Button>
            <Button
              variant={filter === "surf" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("surf")}
              className="rounded-full"
            >
              Surf
            </Button>
            <Button
              variant={filter === "snow" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("snow")}
              className="rounded-full"
            >
              Snow
            </Button>
            <Button
              variant={filter === "social" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("social")}
              className="rounded-full"
            >
              Social
            </Button>
            <Button
              variant={filter === "events" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("events")}
              className="rounded-full"
            >
              Events
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="bg-zinc-900 rounded-lg p-6 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
              <h3 className="text-lg font-bold mb-2">No Activities Found</h3>
              <p className="text-zinc-400 text-sm">Try changing your filter settings</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="bg-zinc-900 rounded-lg overflow-hidden">
                <div className="relative h-40">
                  <Image
                    src={activity.image || "/placeholder.svg?height=200&width=400&query=activity"}
                    alt={activity.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-white">{activity.title}</h3>
                      <Badge className="bg-primary text-black">{activity.type}</Badge>
                    </div>
                    <p className="text-xs text-zinc-300">{activity.date}</p>
                  </div>
                </div>
                <div className="p-3 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <p className="text-xs text-zinc-500">Duration</p>
                      <p className="font-medium">{activity.duration}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-zinc-500">Distance</p>
                      <p className="font-medium">{activity.distance || "N/A"}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-zinc-500">Points</p>
                      <div className="flex items-center justify-center gap-1">
                        <Image src="/banana-icon.png" alt="Points" width={12} height={12} />
                        <p className="font-medium">{activity.points}</p>
                      </div>
                    </div>
                  </div>

                  {activity.location && (
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                      <MapPin className="h-3 w-3" />
                      {activity.location}
                    </div>
                  )}

                  {activity.achievements && activity.achievements.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {activity.achievements.map((achievement) => (
                        <Badge key={achievement} variant="outline" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TabBar activeTab="profile" />
    </main>
  )
}
