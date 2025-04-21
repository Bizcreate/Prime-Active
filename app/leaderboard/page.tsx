"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Trophy, Medal, Award, Crown, ChevronUp, Filter, Users, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useWeb3 } from "@/components/web3-provider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function LeaderboardPage() {
  const { address } = useWeb3()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [timeframe, setTimeframe] = useState("weekly")
  const [showFilters, setShowFilters] = useState(false)
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userRank, setUserRank] = useState<number | null>(null)

  // Mock leaderboard data
  useEffect(() => {
    // Simulate loading
    setIsLoading(true)

    setTimeout(() => {
      const mockUsers = [
        {
          id: "user1",
          name: "BananaShredder",
          avatar: "/cheerful-monkey-profile.png",
          points: 12450,
          level: 42,
          change: 3,
          activities: 156,
          boardType: "skate",
          isVerified: true,
          achievements: 24,
          streak: 15,
        },
        {
          id: "user2",
          name: "WaveMaster",
          avatar: "/stoked-simian.png",
          points: 10890,
          level: 38,
          change: 1,
          activities: 132,
          boardType: "surf",
          isVerified: true,
          achievements: 21,
          streak: 12,
        },
        {
          id: "user3",
          name: "PowderMonkey",
          avatar: "/stoked-snowboarder-ape.png",
          points: 9750,
          level: 35,
          change: -1,
          activities: 118,
          boardType: "snow",
          isVerified: true,
          achievements: 19,
          streak: 8,
        },
        {
          id: "user4",
          name: "OllieKing",
          avatar: "/rad-monkey-ollie.png",
          points: 8600,
          level: 32,
          change: 2,
          activities: 104,
          boardType: "skate",
          isVerified: false,
          achievements: 17,
          streak: 6,
        },
        {
          id: "user5",
          name: "BarrelHunter",
          avatar: "/stoked-simian.png",
          points: 7950,
          level: 30,
          change: 0,
          activities: 96,
          boardType: "surf",
          isVerified: true,
          achievements: 15,
          streak: 5,
        },
        {
          id: "user6",
          name: "ParkRider",
          avatar: "/placeholder.svg?height=100&width=100&query=snowpark+monkey+avatar",
          points: 7200,
          level: 28,
          change: 4,
          activities: 87,
          boardType: "snow",
          isVerified: false,
          achievements: 14,
          streak: 4,
        },
        {
          id: "user7",
          name: "StreetStyler",
          avatar: "/placeholder.svg?height=100&width=100&query=street+skater+monkey+avatar",
          points: 6800,
          level: 26,
          change: -2,
          activities: 82,
          boardType: "skate",
          isVerified: true,
          achievements: 13,
          streak: 3,
        },
        {
          id: "user8",
          name: "CurrentRider",
          avatar: "/placeholder.svg?height=100&width=100&query=wave+rider+monkey+avatar",
          points: 6300,
          level: 24,
          change: 1,
          activities: 76,
          boardType: "surf",
          isVerified: false,
          achievements: 12,
          streak: 7,
        },
        {
          id: "user9",
          name: "PowderHound",
          avatar: "/placeholder.svg?height=100&width=100&query=powder+snowboarder+monkey+avatar",
          points: 5900,
          level: 22,
          change: 3,
          activities: 71,
          boardType: "snow",
          isVerified: true,
          achievements: 11,
          streak: 9,
        },
        {
          id: "user10",
          name: "FlipMaster",
          avatar: "/placeholder.svg?height=100&width=100&query=skateboard+trick+monkey+avatar",
          points: 5500,
          level: 20,
          change: 0,
          activities: 66,
          boardType: "skate",
          isVerified: false,
          achievements: 10,
          streak: 2,
        },
        // Add the current user at a random position
        {
          id: address || "current-user",
          name: "You",
          avatar: "/placeholder.svg?height=100&width=100&query=cool+monkey+with+sunglasses",
          points: 6100,
          level: 23,
          change: 2,
          activities: 74,
          boardType: "skate",
          isVerified: true,
          achievements: 12,
          streak: 5,
          isCurrentUser: true,
        },
      ]

      // Sort by points
      const sortedUsers = mockUsers.sort((a, b) => b.points - a.points)

      // Filter by category if needed
      const filteredUsers =
        selectedCategory === "all" ? sortedUsers : sortedUsers.filter((user) => user.boardType === selectedCategory)

      // Find user rank
      const userIndex = filteredUsers.findIndex((user) => user.isCurrentUser)
      setUserRank(userIndex !== -1 ? userIndex + 1 : null)

      setLeaderboardData(filteredUsers)
      setIsLoading(false)
    }, 1000)
  }, [selectedCategory, timeframe, address])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  const podiumVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  }

  // Get top 3 users for podium
  const topThreeUsers = leaderboardData.slice(0, 3)

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Prime Mates Leaderboard</h1>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex">
            <Image
              src="/prime-mates-logo.png"
              alt="Prime Mates Board Club"
              width={100}
              height={50}
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-1 bg-primary/20 px-3 py-1 rounded-full">
            <Image src="/banana-icon.png" alt="Banana Points" width={16} height={16} className="object-contain" />
            <span className="text-xs text-primary font-medium">Season 1</span>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-zinc-900 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3">Filters</h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-zinc-400 mb-2">Board Type</p>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedCategory === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory("all")}
                        className="rounded-full"
                      >
                        All
                      </Button>
                      <Button
                        variant={selectedCategory === "skate" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory("skate")}
                        className="rounded-full flex items-center gap-1"
                      >
                        <Image src="/shaka-icon.png" alt="Skate" width={16} height={16} className="object-contain" />
                        Skate
                      </Button>
                      <Button
                        variant={selectedCategory === "surf" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory("surf")}
                        className="rounded-full"
                      >
                        Surf
                      </Button>
                      <Button
                        variant={selectedCategory === "snow" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory("snow")}
                        className="rounded-full"
                      >
                        Snow
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-400 mb-2">Time Period</p>
                    <div className="flex gap-2">
                      <Button
                        variant={timeframe === "weekly" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeframe("weekly")}
                        className="rounded-full"
                      >
                        Weekly
                      </Button>
                      <Button
                        variant={timeframe === "monthly" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeframe("monthly")}
                        className="rounded-full"
                      >
                        Monthly
                      </Button>
                      <Button
                        variant={timeframe === "alltime" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeframe("alltime")}
                        className="rounded-full"
                      >
                        All Time
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Podium for top 3 */}
        {!isLoading && topThreeUsers.length > 0 && (
          <motion.div className="relative h-48 mb-8" variants={containerVariants} initial="hidden" animate="show">
            {/* Second Place */}
            {topThreeUsers.length > 1 && (
              <motion.div
                className="absolute left-0 bottom-0 w-1/3 flex flex-col items-center"
                variants={podiumVariants}
              >
                <div className="relative">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#C0C0C0] mb-2">
                    <Image
                      src={topThreeUsers[1].avatar || "/placeholder.svg"}
                      alt={topThreeUsers[1].name}
                      fill
                      className="object-cover"
                    />
                    {topThreeUsers[1].isVerified && (
                      <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                        <Image src="/shaka-icon.png" alt="Verified" width={12} height={12} />
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-[#C0C0C0] rounded-full p-1.5">
                    <Medal className="h-4 w-4 text-black" />
                  </div>
                </div>
                <p className="text-xs font-bold truncate max-w-full px-2">{topThreeUsers[1].name}</p>
                <div className="flex items-center gap-1">
                  <Image src="/banana-icon.png" alt="Points" width={12} height={12} />
                  <p className="text-xs">{topThreeUsers[1].points.toLocaleString()}</p>
                </div>
                <div className="h-20 w-full bg-gradient-to-t from-[#C0C0C0]/80 to-[#C0C0C0]/30 rounded-t-lg mt-2 flex items-end justify-center pb-2">
                  <span className="text-lg font-bold">2</span>
                </div>
              </motion.div>
            )}

            {/* First Place */}
            <motion.div
              className="absolute left-1/3 bottom-0 w-1/3 flex flex-col items-center z-10"
              variants={podiumVariants}
            >
              <div className="relative">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#FFD700] mb-2">
                  <Image
                    src={topThreeUsers[0].avatar || "/placeholder.svg"}
                    alt={topThreeUsers[0].name}
                    fill
                    className="object-cover"
                  />
                  {topThreeUsers[0].isVerified && (
                    <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                      <Image src="/shaka-icon.png" alt="Verified" width={12} height={12} />
                    </div>
                  )}
                </div>
                <div className="absolute -top-3 -right-2 bg-[#FFD700] rounded-full p-2">
                  <Crown className="h-5 w-5 text-black" />
                </div>
              </div>
              <p className="text-sm font-bold truncate max-w-full px-2">{topThreeUsers[0].name}</p>
              <div className="flex items-center gap-1">
                <Image src="/banana-icon.png" alt="Points" width={14} height={14} />
                <p className="text-sm font-medium">{topThreeUsers[0].points.toLocaleString()}</p>
              </div>
              <div className="h-28 w-full bg-gradient-to-t from-[#FFD700]/80 to-[#FFD700]/30 rounded-t-lg mt-2 flex items-end justify-center pb-2">
                <span className="text-xl font-bold">1</span>
              </div>
            </motion.div>

            {/* Third Place */}
            {topThreeUsers.length > 2 && (
              <motion.div
                className="absolute right-0 bottom-0 w-1/3 flex flex-col items-center"
                variants={podiumVariants}
              >
                <div className="relative">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#CD7F32] mb-2">
                    <Image
                      src={topThreeUsers[2].avatar || "/placeholder.svg"}
                      alt={topThreeUsers[2].name}
                      fill
                      className="object-cover"
                    />
                    {topThreeUsers[2].isVerified && (
                      <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                        <Image src="/shaka-icon.png" alt="Verified" width={12} height={12} />
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-[#CD7F32] rounded-full p-1.5">
                    <Award className="h-4 w-4 text-black" />
                  </div>
                </div>
                <p className="text-xs font-bold truncate max-w-full px-2">{topThreeUsers[2].name}</p>
                <div className="flex items-center gap-1">
                  <Image src="/banana-icon.png" alt="Points" width={12} height={12} />
                  <p className="text-xs">{topThreeUsers[2].points.toLocaleString()}</p>
                </div>
                <div className="h-16 w-full bg-gradient-to-t from-[#CD7F32]/80 to-[#CD7F32]/30 rounded-t-lg mt-2 flex items-end justify-center pb-2">
                  <span className="text-lg font-bold">3</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* User's rank if not in top 3 */}
        {!isLoading && userRank && userRank > 3 && (
          <motion.div
            className="bg-zinc-800 rounded-lg p-4 mb-6 border border-primary/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-zinc-700 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {userRank}
                </div>
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=100&width=100&query=cool+monkey+with+sunglasses"
                    alt="Your Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-sm">You</p>
                  <div className="flex items-center gap-1">
                    <Image src="/banana-icon.png" alt="Points" width={12} height={12} />
                    <p className="text-xs">{leaderboardData.find((u) => u.isCurrentUser)?.points.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <ChevronUp className="h-4 w-4" />
                <span className="text-xs font-medium">2 ranks</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard list */}
        <Tabs defaultValue="leaderboard" className="mb-6">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-zinc-900 rounded-lg p-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="bg-zinc-800 rounded-full w-8 h-8"></div>
                      <div className="bg-zinc-800 rounded-full w-10 h-10"></div>
                      <div className="space-y-2">
                        <div className="bg-zinc-800 h-4 w-24 rounded"></div>
                        <div className="bg-zinc-800 h-3 w-16 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="show">
                {leaderboardData.slice(3).map((user, index) => (
                  <motion.div
                    key={user.id}
                    className={`bg-zinc-900 rounded-lg p-3 ${user.isCurrentUser ? "border border-primary/30" : ""}`}
                    variants={itemVariants}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-zinc-800 rounded-full w-8 h-8 flex items-center justify-center font-medium text-sm">
                          {index + 4}
                        </div>
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                          {user.isVerified && (
                            <div className="absolute bottom-0 right-0 bg-primary rounded-full p-0.5">
                              <Image src="/shaka-icon.png" alt="Verified" width={8} height={8} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-sm">{user.name}</p>
                            {user.isVerified && (
                              <Badge variant="outline" className="text-[0.6rem] py-0 h-4">
                                Prime
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Image src="/banana-icon.png" alt="Points" width={10} height={10} />
                              <p className="text-xs">{user.points.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Trophy className="h-3 w-3 text-zinc-500" />
                              <p className="text-xs text-zinc-500">{user.achievements}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          user.change > 0 ? "text-green-500" : user.change < 0 ? "text-red-500" : "text-zinc-500"
                        }`}
                      >
                        {user.change > 0 ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : user.change < 0 ? (
                          <ChevronUp className="h-4 w-4 rotate-180" />
                        ) : null}
                        {user.change !== 0 && <span className="text-xs font-medium">{Math.abs(user.change)}</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="friends">
            <div className="bg-zinc-900 rounded-lg p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
              <h3 className="text-lg font-bold mb-2">Connect with Friends</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Add friends to see how you rank against them on the leaderboard
              </p>
              <Button>Find Friends</Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 bg-zinc-900 rounded-lg p-4">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Weekly Challenge
          </h2>
          <div className="relative h-40 rounded-lg overflow-hidden mb-3">
            <Image
              src="/placeholder.svg?height=200&width=400&query=group+of+monkeys+skateboarding"
              alt="Weekly Challenge"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-bold text-white">Banana Bonanza</h3>
              <div className="flex justify-between items-center">
                <p className="text-xs text-zinc-300 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />3 days left
                </p>
                <div className="flex items-center gap-1 bg-primary/80 px-2 py-0.5 rounded-full">
                  <Image src="/banana-icon.png" alt="Banana Points" width={12} height={12} />
                  <span className="text-xs text-black font-medium">500 points</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-zinc-400 mb-3">
            Earn the most banana points this week to win exclusive Prime Mates gear and NFTs!
          </p>
          <Button className="w-full bg-primary text-black">Join Challenge</Button>
        </div>
      </div>

      <TabBar activeTab="leaderboard" />
    </main>
  )
}
