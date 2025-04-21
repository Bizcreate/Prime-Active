"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Medal, Trophy, Award } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState("week")

  // Mock leaderboard data
  const distanceLeaders = [
    {
      rank: 1,
      user: {
        name: "Marathon Pro",
        username: "marathonpro",
        avatar: "/placeholder.svg?height=40&width=40&query=runner+1",
      },
      activity: "Running",
      score: "156.2 km",
    },
    {
      rank: 2,
      user: {
        name: "Skate Legend",
        username: "sk8legend",
        avatar: "/placeholder.svg?height=40&width=40&query=skater+2",
      },
      activity: "Skateboarding",
      score: "142.8 km",
    },
    {
      rank: 3,
      user: {
        name: "Wave Master",
        username: "wavemaster",
        avatar: "/placeholder.svg?height=40&width=40&query=surfer+3",
      },
      activity: "Surfing",
      score: "128.5 km",
    },
    {
      rank: 4,
      user: {
        name: "Snow Rider",
        username: "snowrider",
        avatar: "/placeholder.svg?height=40&width=40&query=snowboarder+4",
      },
      activity: "Snowboarding",
      score: "115.2 km",
    },
    {
      rank: 5,
      user: {
        name: "Bike Explorer",
        username: "bikeexplorer",
        avatar: "/placeholder.svg?height=40&width=40&query=cyclist+5",
      },
      activity: "Mountain Biking",
      score: "98.7 km",
    },
    {
      rank: 6,
      user: {
        name: "Urban Runner",
        username: "urbanrunner",
        avatar: "/placeholder.svg?height=40&width=40&query=runner+6",
      },
      activity: "Running",
      score: "87.3 km",
    },
    {
      rank: 7,
      user: {
        name: "Beach Surfer",
        username: "beachsurfer",
        avatar: "/placeholder.svg?height=40&width=40&query=surfer+7",
      },
      activity: "Surfing",
      score: "76.9 km",
    },
    {
      rank: 8,
      user: {
        name: "Trail Blazer",
        username: "trailblazer",
        avatar: "/placeholder.svg?height=40&width=40&query=hiker+8",
      },
      activity: "Walking",
      score: "65.4 km",
    },
    {
      rank: 9,
      user: {
        name: "Street Skater",
        username: "streetskater",
        avatar: "/placeholder.svg?height=40&width=40&query=skater+9",
      },
      activity: "Skateboarding",
      score: "54.2 km",
    },
    {
      rank: 10,
      user: {
        name: "Mountain Goat",
        username: "mountaingoat",
        avatar: "/placeholder.svg?height=40&width=40&query=climber+10",
      },
      activity: "Mountain Biking",
      score: "48.6 km",
    },
  ]

  const caloriesLeaders = [
    {
      rank: 1,
      user: {
        name: "Fitness Beast",
        username: "fitnessbeast",
        avatar: "/placeholder.svg?height=40&width=40&query=fitness+1",
      },
      activity: "Running",
      score: "4,250 kcal",
    },
    {
      rank: 2,
      user: {
        name: "Energy Burner",
        username: "energyburner",
        avatar: "/placeholder.svg?height=40&width=40&query=fitness+2",
      },
      activity: "Mountain Biking",
      score: "3,980 kcal",
    },
    {
      rank: 3,
      user: {
        name: "Calorie Crusher",
        username: "caloriecrusher",
        avatar: "/placeholder.svg?height=40&width=40&query=fitness+3",
      },
      activity: "Snowboarding",
      score: "3,750 kcal",
    },
    // More entries...
  ]

  const activitiesLeaders = [
    {
      rank: 1,
      user: {
        name: "Daily Mover",
        username: "dailymover",
        avatar: "/placeholder.svg?height=40&width=40&query=fitness+4",
      },
      activity: "Mixed",
      score: "28 activities",
    },
    {
      rank: 2,
      user: {
        name: "Consistent King",
        username: "consistentking",
        avatar: "/placeholder.svg?height=40&width=40&query=fitness+5",
      },
      activity: "Mixed",
      score: "24 activities",
    },
    {
      rank: 3,
      user: {
        name: "Activity Queen",
        username: "activityqueen",
        avatar: "/placeholder.svg?height=40&width=40&query=fitness+6",
      },
      activity: "Mixed",
      score: "21 activities",
    },
    // More entries...
  ]

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Leaderboard</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="alltime">All Time</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-sm text-zinc-400">
            {timeframe === "day"
              ? "Today's Leaders"
              : timeframe === "week"
                ? "This Week's Leaders"
                : timeframe === "month"
                  ? "This Month's Leaders"
                  : "All Time Leaders"}
          </div>
        </div>

        <Tabs defaultValue="distance" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="distance">Distance</TabsTrigger>
            <TabsTrigger value="calories">Calories</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="distance" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Distance Leaders
              </h2>
              <p className="text-xs text-zinc-400">Your Rank: #42</p>
            </div>

            <div className="space-y-2">
              {distanceLeaders.map((item) => (
                <div
                  key={item.rank}
                  className={`bg-zinc-900 rounded-lg p-3 flex items-center ${
                    item.rank <= 3 ? "border border-primary/30" : ""
                  }`}
                >
                  <div className="w-8 text-center font-bold mr-2">
                    {item.rank === 1 ? (
                      <Medal className="h-5 w-5 text-yellow-500 mx-auto" />
                    ) : item.rank === 2 ? (
                      <Medal className="h-5 w-5 text-zinc-400 mx-auto" />
                    ) : item.rank === 3 ? (
                      <Medal className="h-5 w-5 text-amber-700 mx-auto" />
                    ) : (
                      item.rank
                    )}
                  </div>
                  <Avatar className="mr-3">
                    <AvatarImage src={item.user.avatar || "/placeholder.svg"} alt={item.user.name} />
                    <AvatarFallback>{item.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{item.user.name}</p>
                    <p className="text-xs text-zinc-400">@{item.user.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.score}</p>
                    <p className="text-xs text-zinc-400">{item.activity}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              View Full Leaderboard
            </Button>
          </TabsContent>

          <TabsContent value="calories" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Calorie Leaders
              </h2>
              <p className="text-xs text-zinc-400">Your Rank: #28</p>
            </div>

            <div className="space-y-2">
              {caloriesLeaders.map((item) => (
                <div
                  key={item.rank}
                  className={`bg-zinc-900 rounded-lg p-3 flex items-center ${
                    item.rank <= 3 ? "border border-primary/30" : ""
                  }`}
                >
                  <div className="w-8 text-center font-bold mr-2">
                    {item.rank === 1 ? (
                      <Medal className="h-5 w-5 text-yellow-500 mx-auto" />
                    ) : item.rank === 2 ? (
                      <Medal className="h-5 w-5 text-zinc-400 mx-auto" />
                    ) : item.rank === 3 ? (
                      <Medal className="h-5 w-5 text-amber-700 mx-auto" />
                    ) : (
                      item.rank
                    )}
                  </div>
                  <Avatar className="mr-3">
                    <AvatarImage src={item.user.avatar || "/placeholder.svg"} alt={item.user.name} />
                    <AvatarFallback>{item.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{item.user.name}</p>
                    <p className="text-xs text-zinc-400">@{item.user.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.score}</p>
                    <p className="text-xs text-zinc-400">{item.activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Activity Count Leaders
              </h2>
              <p className="text-xs text-zinc-400">Your Rank: #15</p>
            </div>

            <div className="space-y-2">
              {activitiesLeaders.map((item) => (
                <div
                  key={item.rank}
                  className={`bg-zinc-900 rounded-lg p-3 flex items-center ${
                    item.rank <= 3 ? "border border-primary/30" : ""
                  }`}
                >
                  <div className="w-8 text-center font-bold mr-2">
                    {item.rank === 1 ? (
                      <Medal className="h-5 w-5 text-yellow-500 mx-auto" />
                    ) : item.rank === 2 ? (
                      <Medal className="h-5 w-5 text-zinc-400 mx-auto" />
                    ) : item.rank === 3 ? (
                      <Medal className="h-5 w-5 text-amber-700 mx-auto" />
                    ) : (
                      item.rank
                    )}
                  </div>
                  <Avatar className="mr-3">
                    <AvatarImage src={item.user.avatar || "/placeholder.svg"} alt={item.user.name} />
                    <AvatarFallback>{item.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{item.user.name}</p>
                    <p className="text-xs text-zinc-400">@{item.user.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.score}</p>
                    <p className="text-xs text-zinc-400">{item.activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold mb-3">Your Stats</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xs text-zinc-400">Distance</p>
              <p className="text-xl font-bold">42.5 km</p>
              <p className="text-xs text-zinc-500">Rank #42</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-400">Calories</p>
              <p className="text-xl font-bold">1,850 kcal</p>
              <p className="text-xs text-zinc-500">Rank #28</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-400">Activities</p>
              <p className="text-xl font-bold">12</p>
              <p className="text-xs text-zinc-500">Rank #15</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button className="w-full" asChild>
            <Link href="/start-activity">Start New Activity</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/social">View Community</Link>
          </Button>
        </div>
      </div>

      <TabBar activeTab="home" />
    </main>
  )
}
