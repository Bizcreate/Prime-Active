"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TabBar } from "@/components/tab-bar"
import { CircularProgress } from "@/components/circular-progress"
import {
  Trophy,
  Calendar,
  MapPin,
  Plus,
  ChevronRight,
  Star,
  Shirt,
  History,
  Server,
  Activity,
  Coins,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { AppShell } from "@/components/app-shell"
import { dePINManager } from "@/services/depin-manager"
import type { IoTeXService } from "@/services/iotex-service"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [iotexEnabled, setIotexEnabled] = useState(false)
  const [nodeActive, setNodeActive] = useState(false)
  const [totalMined, setTotalMined] = useState(0)
  const [miningRate, setMiningRate] = useState(0)
  const [lastReward, setLastReward] = useState<{ amount: number; timestamp: number } | null>(null)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)

      // Check if IoTeX is enabled
      const iotexService = dePINManager.getService("iotex") as IoTeXService
      if (iotexService && iotexService.isNetworkEnabled()) {
        setIotexEnabled(true)

        // Check if node is active
        if (iotexService.isNodeActive()) {
          setNodeActive(true)

          // Get mining stats
          const rewards = iotexService.getRewards()
          const total = rewards.reduce((sum, reward) => sum + reward.amount, 0)
          setTotalMined(total)

          // Get mining rate
          setMiningRate(iotexService.getPassiveRate())

          // Get last reward
          if (rewards.length > 0) {
            const lastRwd = rewards[rewards.length - 1]
            setLastReward({
              amount: lastRwd.amount,
              timestamp: lastRwd.timestamp,
            })
          }
        }
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const toggleNode = async () => {
    const iotexService = dePINManager.getService("iotex") as IoTeXService
    if (!iotexService) return

    if (nodeActive) {
      // Stop node
      const success = await iotexService.stopNode()
      if (success) {
        setNodeActive(false)
      }
    } else {
      // Start node
      const success = await iotexService.startNode()
      if (success) {
        setNodeActive(true)
      }
    }
  }

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

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

              {/* Quick Actions */}
              <motion.div variants={itemVariants}>
                <h2 className="text-lg font-bold mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/start-activity">
                    <Button className="w-full flex items-center gap-2 h-auto py-3 bg-[#FFC72D] text-black hover:bg-[#FFC72D]/90">
                      <Plus className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium text-sm">Start Activity</div>
                        <div className="text-xs opacity-80">Track your session</div>
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

              {/* IoTeX Mining Section */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold">IoTeX Mining</h2>
                  <Link href="/wallet/depin-tokens">
                    <Button variant="ghost" size="sm" className="gap-1 text-zinc-400 hover:text-white">
                      Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {!iotexEnabled ? (
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <Coins className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Earn Crypto for Activities</h3>
                          <p className="text-xs text-zinc-400">Set up DePIN mining to earn tokens</p>
                        </div>
                      </div>
                      <Link href="/setup/depin-setup">
                        <Button className="w-full">Set Up Mining</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Image src="/iotex-logo.png" alt="IoTeX" width={24} height={24} className="rounded-full" />
                          <span className="font-medium">IoTeX Node</span>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${nodeActive ? "bg-green-500/20 text-green-400" : "bg-zinc-700/50 text-zinc-400"}`}
                        >
                          {nodeActive ? "Active" : "Inactive"}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-zinc-400">Total Mined</p>
                          <p className="font-medium">{totalMined.toFixed(2)} IOTX</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400">Mining Rate</p>
                          <p className="font-medium">{(miningRate * 60).toFixed(2)} IOTX/hr</p>
                        </div>
                      </div>

                      {lastReward && (
                        <div className="bg-zinc-800 rounded-lg p-2 mb-3">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <Activity className="h-3 w-3 text-green-400" />
                              <span>Last reward: {lastReward.amount.toFixed(4)} IOTX</span>
                            </div>
                            <span className="text-zinc-500">{formatDate(lastReward.timestamp)}</span>
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={toggleNode}
                        variant={nodeActive ? "destructive" : "default"}
                        className="w-full"
                        size="sm"
                      >
                        {nodeActive ? (
                          <>
                            <Server className="h-4 w-4 mr-2" />
                            Stop Mining
                          </>
                        ) : (
                          <>
                            <Server className="h-4 w-4 mr-2" />
                            Start Mining
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}
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
                      <div className="flex items-center gap-2 text-xs text-zinc-300">
                        <Calendar className="h-3 w-3" />
                        <span>Oct 28</span>
                        <MapPin className="h-3 w-3 ml-2" />
                        <span>Downtown Skate Park</span>
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
                        <Button size="sm" className="bg-[#FFC72D] text-black hover:bg-[#FFC72D]/90">
                          RSVP
                        </Button>
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
                  <Card className="bg-zinc-900 border-zinc-800 p-4 cursor-pointer hover:bg-zinc-900/70 transition-all overflow-hidden">
                    <div className="flex gap-3">
                      <div className="bg-zinc-800 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[#FFC72D]"
                        >
                          <path d="M18 6 6 18"></path>
                          <path d="m6 6 12 12"></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">Downtown Skate Session</h3>
                        <p className="text-xs text-zinc-400">Urban Skatepark</p>
                        <div className="flex gap-3 mt-2 text-xs">
                          <span>4.2 km</span>
                          <span>1h 23m</span>
                          <span className="text-zinc-500">Today</span>
                        </div>
                      </div>
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src="/urban-skate-session.png"
                          alt="Downtown Skate Session"
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-zinc-900 border-zinc-800 p-4 cursor-pointer hover:bg-zinc-900/70 transition-all overflow-hidden">
                    <div className="flex gap-3">
                      <div className="bg-zinc-800 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-400"
                        >
                          <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                          <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                          <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">Morning Surf</h3>
                        <p className="text-xs text-zinc-400">Sunset Beach</p>
                        <div className="flex gap-3 mt-2 text-xs">
                          <span>N/A</span>
                          <span>1h 45m</span>
                          <span className="text-zinc-500">3 days ago</span>
                        </div>
                      </div>
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src="/surfer-silhouette.png"
                          alt="Morning Surf"
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  </Card>
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
                <Card className="bg-zinc-900 border-zinc-800 p-4">
                  <div className="mb-2">
                    <h3 className="font-bold">Weekly Skate Distance</h3>
                    <p className="text-sm text-zinc-400">Skate 20km this week</p>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 bg-zinc-800 rounded-full flex-1">
                      <div className="h-full bg-[#FFC72D] rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <span className="text-xs">65%</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#FFC72D]">
                    <Trophy className="h-4 w-4" />
                    <span className="text-sm font-medium">150</span>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </div>

        <TabBar activeTab="dashboard" />
      </main>
    </AppShell>
  )
}
