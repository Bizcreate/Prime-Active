"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TabBar } from "@/components/tab-bar"
import { ActivityCard } from "@/components/activity-card"
import { ChallengeCard } from "@/components/challenge-card"
import { CircularProgress } from "@/components/circular-progress"
import { Trophy, Calendar, MapPin, Plus, ChevronRight, Star, Shirt, History } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { AppShell } from "@/components/app-shell"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <AppShell>
      <main className="flex min-h-screen flex-col bg-black pb-20 relative">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-2">
              <div className="bg-zinc-800 rounded-full p-1 w-8 h-8 flex items-center justify-center">
                <Image src="/shaka-coin.png" alt="Shaka Tokens" width={20} height={20} />
              </div>
              <span className="font-bold">1,250</span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[80vh]">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-zinc-400">Loading your dashboard...</p>
            </div>
          ) : (
            <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
              {/* Activity Stats */}
              <motion.div variants={itemVariants}>
                <h2 className="text-lg font-bold mb-3">Activity Stats</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-zinc-400">Weekly Goal</p>
                          <p className="text-2xl font-bold">75%</p>
                        </div>
                        <CircularProgress value={75} size={50} strokeWidth={5} color="#FFC72D" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-zinc-400">Streak</p>
                          <p className="text-2xl font-bold">5 days</p>
                        </div>
                        <div className="bg-zinc-800 p-2 rounded-full">
                          <Trophy className="h-6 w-6 text-[#FFC72D]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Quick Actions - MOVED UP */}
              <motion.div variants={itemVariants}>
                <h2 className="text-lg font-bold mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/start-activity">
                    <Button className="w-full flex items-center gap-2 h-auto py-3">
                      <Plus className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium text-sm">Start Activity</div>
                        <div className="text-xs text-zinc-400">Track your session</div>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/merch/wear-to-earn">
                    <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-3">
                      <Shirt className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium text-sm">Wear to Earn</div>
                        <div className="text-xs text-zinc-400">Earn while you wear</div>
                      </div>
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <Link href="/map">
                    <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-3">
                      <MapPin className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium text-sm">Explore Map</div>
                        <div className="text-xs text-zinc-400">Find spots nearby</div>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/activity-history">
                    <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-3">
                      <History className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium text-sm">Activity History</div>
                        <div className="text-xs text-zinc-400">View past activities</div>
                      </div>
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Activity Rewards Summary */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold">Activity Rewards</h2>
                  <Link href="/activity-rewards">
                    <Button variant="ghost" size="sm" className="gap-1 text-zinc-400 hover:text-white">
                      View All
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <Card className="bg-zinc-900 border-zinc-800 mb-3">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-[#FFC72D]" />
                        <span className="font-medium">Total Rewards</span>
                      </div>
                      <span className="text-lg font-bold">750 tokens</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Shirt className="h-4 w-4 text-blue-500" />
                          <span>Wear-to-Earn</span>
                        </div>
                        <span>350 tokens</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-500" />
                          <span>Events</span>
                        </div>
                        <span>400 tokens</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold">Upcoming Events</h2>
                  <Link href="/events">
                    <Button variant="ghost" size="sm" className="gap-1 text-zinc-400 hover:text-white">
                      View All
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                  <div className="relative h-32">
                    <Image
                      src="/downtown-skate-showdown.png"
                      alt="Skate Park Competition"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-bold text-white">Skate Park Competition</h3>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-zinc-300 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Oct 28
                        </p>
                        <p className="text-xs text-zinc-300 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Downtown Skate Park
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-[#FFC72D]" />
                        <span className="text-sm">500 points reward</span>
                      </div>
                      <Link href="/events">
                        <Button size="sm">RSVP</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activities */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold">Recent Activities</h2>
                  <Link href="/profile/activity-history">
                    <Button variant="ghost" size="sm" className="gap-1 text-zinc-400 hover:text-white">
                      View All
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  <ActivityCard
                    type="skateboarding"
                    title="Downtown Skate Session"
                    location="Urban Skatepark"
                    distance="4.2 km"
                    duration="1h 23m"
                    date="Today"
                    image="/urban-skate-session.png"
                    onClick={() => {}}
                  />
                  <ActivityCard
                    type="surfing"
                    title="Morning Surf"
                    location="Sunset Beach"
                    distance="N/A"
                    duration="1h 45m"
                    date="3 days ago"
                    image="/surfer-silhouette.png"
                    onClick={() => {}}
                  />
                </div>
              </motion.div>

              {/* Active Challenges */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold">Active Challenges</h2>
                  <Link href="/challenges">
                    <Button variant="ghost" size="sm" className="gap-1 text-zinc-400 hover:text-white">
                      View All
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  <ChallengeCard
                    title="Weekly Skate Distance"
                    description="Skate 20km this week"
                    progress={65}
                    reward={150}
                    endDate="3 days left"
                    image="/urban-playground.png"
                  />
                  <ChallengeCard
                    title="Surf Session Streak"
                    description="Surf 5 days in a row"
                    progress={40}
                    reward={200}
                    endDate="5 days left"
                    image="/sunny-seashore.png"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>

        <TabBar activeTab="dashboard" />
      </main>
    </AppShell>
  )
}
