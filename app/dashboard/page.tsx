"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TabBar } from "@/components/tab-bar"
import { StatCard } from "@/components/stat-card"
import { ActivityCard } from "@/components/activity-card"
import { ChallengeCard } from "@/components/challenge-card"
import { CircularProgress } from "@/components/circular-progress"
import Link from "next/link"
import { ArrowRight, Trophy } from "lucide-react"
import Image from "next/image"
import { useWeb3 } from "@/components/web3-provider"

export default function DashboardPage() {
  const { isConnected, hasAccess } = useWeb3()
  const [dailyGoal, setDailyGoal] = useState(70)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Mock data
  const stats = [
    { label: "Today", value: "2.4", unit: "km" },
    { label: "Steps", value: "3,248", unit: "" },
    { label: "Calories", value: "187", unit: "kcal" },
    { label: "Time", value: "32", unit: "min" },
  ]

  const recentActivities = [
    {
      id: "1",
      type: "skate",
      title: "Evening Skate Session",
      location: "Venice Beach Skatepark",
      distance: "1.8 km",
      duration: "45 min",
      date: "Today",
      image: "/urban-skate-session.png",
    },
    {
      id: "2",
      type: "surf",
      title: "Morning Surf",
      location: "Malibu Beach",
      distance: "N/A",
      duration: "1h 20m",
      date: "Yesterday",
      image: "/wave-rider.png",
    },
  ]

  const challenges = [
    {
      id: "challenge1",
      title: "10K Steps Challenge",
      description: "Walk 10,000 steps daily for 7 days",
      progress: 4,
      total: 7,
      image: "/focused-marathoner.png",
      reward: "250 Points",
    },
    {
      id: "challenge2",
      title: "Explore 5 New Spots",
      description: "Check in at 5 new locations",
      progress: 2,
      total: 5,
      image: "/urban-playground.png",
      reward: "300 Points",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-zinc-400">Track your active lifestyle</p>
          </div>
          <div className="relative">
            <Image
              src="/prime-mates-logo.png"
              alt="Prime Mates Board Club"
              width={80}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        <div className="mb-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold">Daily Progress</h2>
                <span className="text-sm text-zinc-400">{dailyGoal}% of goal</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16">
                  <CircularProgress value={dailyGoal} />
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-2">
                    {stats.map((stat, index) => (
                      <StatCard key={index} label={stat.label} value={stat.value} unit={stat.unit} />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Recent Activities</h2>
            <Link href="/activities" className="text-primary text-sm flex items-center">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                type={activity.type}
                title={activity.title}
                location={activity.location}
                distance={activity.distance}
                duration={activity.duration}
                date={activity.date}
                image={activity.image}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Active Challenges</h2>
            <Link href="/challenges" className="text-primary text-sm flex items-center">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                title={challenge.title}
                description={challenge.description}
                progress={challenge.progress}
                total={challenge.total}
                image={challenge.image}
                reward={challenge.reward}
              />
            ))}
          </div>
        </div>

        {isConnected && hasAccess && (
          <div className="mb-6">
            <div className="bg-zinc-900 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-4 mb-3">
                <div>
                  <Image
                    src="/prime-mates-logo.png"
                    alt="Prime Mates Board Club"
                    width={60}
                    height={30}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="font-bold">Prime Mates Board Club</h2>
                  <p className="text-sm text-zinc-400">Exclusive challenges and rewards</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-zinc-800 rounded-lg p-3 flex flex-col items-center">
                  <div className="mb-1">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-center">3 Active Challenges</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-3 flex flex-col items-center">
                  <div className="mb-1">
                    <Image src="/shaka-coin.png" alt="Rewards" width={20} height={20} className="object-contain" />
                  </div>
                  <p className="text-xs text-center">1,250 Shaka Coins</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/challenges/board-club">
                  <Button className="w-full" variant="outline">
                    Challenges
                  </Button>
                </Link>
                <Link href="/rewards">
                  <Button className="w-full bg-primary text-black">Rewards</Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link href="/start-activity">
            <Button className="w-full">Start Activity</Button>
          </Link>
          <Link href="/map">
            <Button variant="outline" className="w-full">
              Explore Map
            </Button>
          </Link>
        </div>
      </div>

      <TabBar activeTab="home" />
    </main>
  )
}
