"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, Star, Sparkles, Award, Users, Camera, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { TabBar } from "@/components/tab-bar"
import { Badge } from "@/components/ui/badge"
import confetti from "canvas-confetti"

// Custom Banana icon component
const BananaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-banana"
  >
    <path d="M4 13c3.5-2 8-2 10 2a5.5 5.5 0 0 1 8 5" />
    <path d="M5.15 17.89c5.52-1.52 8.65-6.89 7-12C11.55 4 11.5 2 13 2c3.22 0 5 5.5 5 8 0 .5-.5 4-2.5 6C13 18 9.5 20.5 5.15 17.89Z" />
    <path d="M14 12.5c.5-1.5 1.5-3 3-3" />
  </svg>
)

export default function BananaAchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showUnlocked, setShowUnlocked] = useState(true)
  const [showLocked, setShowLocked] = useState(true)
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Trigger confetti when an achievement is selected
  useEffect(() => {
    if (selectedAchievement && selectedAchievement.unlocked) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFC72D", "#FFD700", "#FFEC3F"],
      })
    }
  }, [selectedAchievement])

  // Mock achievements data
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const achievements = [
    {
      id: "achievement1",
      title: "Banana Collector",
      description: "Earn your first 1,000 banana points",
      category: "points",
      icon: <BananaIcon />,
      iconBg: "bg-yellow-500",
      unlocked: true,
      progress: 1000,
      maxProgress: 1000,
      reward: "Banana Collector Badge",
      date: "2023-05-15",
    },
    {
      id: "achievement2",
      title: "Banana Split",
      description: "Complete 5 skateboarding sessions in a single day",
      category: "skate",
      icon: <BananaIcon />,
      iconBg: "bg-yellow-600",
      unlocked: true,
      progress: 5,
      maxProgress: 5,
      reward: "Banana Split Badge + 200 Points",
      date: "2023-06-02",
    },
    {
      id: "achievement3",
      title: "Banana Barrel",
      description: "Ride inside a wave barrel for at least 5 seconds",
      category: "surf",
      icon: <BananaIcon />,
      iconBg: "bg-blue-500",
      unlocked: false,
      progress: 3,
      maxProgress: 5,
      reward: "Barrel Rider Badge + 300 Points",
    },
    {
      id: "achievement4",
      title: "Powder Monkey",
      description: "Snowboard in fresh powder for 3 consecutive days",
      category: "snow",
      icon: <BananaIcon />,
      iconBg: "bg-blue-300",
      unlocked: false,
      progress: 1,
      maxProgress: 3,
      reward: "Powder Monkey Badge + 250 Points",
    },
    {
      id: "achievement5",
      title: "Banana Republic",
      description: "Invite 10 friends to join Prime Mates Board Club",
      category: "social",
      icon: <Users />,
      iconBg: "bg-green-500",
      unlocked: true,
      progress: 10,
      maxProgress: 10,
      reward: "Social Butterfly Badge + 500 Points",
      date: "2023-07-10",
    },
    {
      id: "achievement6",
      title: "Going Bananas",
      description: "Log activities for 30 consecutive days",
      category: "streak",
      icon: <Sparkles />,
      iconBg: "bg-purple-500",
      unlocked: false,
      progress: 22,
      maxProgress: 30,
      reward: "Consistency King Badge + 1000 Points",
    },
    {
      id: "achievement7",
      title: "Top Banana",
      description: "Reach the #1 spot on the weekly leaderboard",
      category: "leaderboard",
      icon: <Trophy />,
      iconBg: "bg-amber-500",
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      reward: "Top Banana Crown + 2000 Points",
      date: "2023-08-05",
    },
    {
      id: "achievement8",
      title: "Banana Bunch",
      description: "Complete all challenges in a single week",
      category: "challenges",
      icon: <Star />,
      iconBg: "bg-red-500",
      unlocked: false,
      progress: 4,
      maxProgress: 7,
      reward: "Challenge Master Badge + 1500 Points",
    },
    {
      id: "achievement9",
      title: "Banana Board",
      description: "Upload 20 photos of your board sessions",
      category: "content",
      icon: <Camera />,
      iconBg: "bg-pink-500",
      unlocked: true,
      progress: 20,
      maxProgress: 20,
      reward: "Content Creator Badge + 300 Points",
      date: "2023-09-12",
    },
    {
      id: "achievement10",
      title: "Golden Banana",
      description: "Earn 10,000 banana points in total",
      category: "points",
      icon: <Award />,
      iconBg: "bg-yellow-400",
      unlocked: false,
      progress: 6500,
      maxProgress: 10000,
      reward: "Golden Banana Trophy + Exclusive NFT",
    },
  ]

  // Filter achievements based on selected category and locked/unlocked status
  const filteredAchievements = achievements.filter((achievement) => {
    const categoryMatch = selectedCategory === "all" || achievement.category === selectedCategory
    const statusMatch = (showUnlocked && achievement.unlocked) || (showLocked && !achievement.unlocked)
    return categoryMatch && statusMatch
  })

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

  const modalVariants = {
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

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/achievements">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Banana Achievements</h1>
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
            <span className="text-xs text-primary font-medium">5/10 Unlocked</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="rounded-full"
          >
            All
          </Button>
          <Button
            variant={selectedCategory === "points" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("points")}
            className="rounded-full flex items-center gap-1"
          >
            <Image src="/banana-icon.png" alt="Points" width={16} height={16} className="object-contain" />
            Points
          </Button>
          <Button
            variant={selectedCategory === "skate" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("skate")}
            className="rounded-full"
          >
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

        <div className="flex gap-2 mb-6">
          <Button
            variant={showUnlocked ? "default" : "outline"}
            size="sm"
            onClick={() => setShowUnlocked(!showUnlocked)}
            className="rounded-full flex-1"
          >
            Unlocked
          </Button>
          <Button
            variant={showLocked ? "default" : "outline"}
            size="sm"
            onClick={() => setShowLocked(!showLocked)}
            className="rounded-full flex-1"
          >
            Locked
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-zinc-900 rounded-lg p-4 aspect-square animate-pulse">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="bg-zinc-800 rounded-full w-16 h-16 mb-4"></div>
                  <div className="bg-zinc-800 h-4 w-24 rounded mb-2"></div>
                  <div className="bg-zinc-800 h-3 w-32 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div className="grid grid-cols-2 gap-4" variants={containerVariants} initial="hidden" animate="show">
            {filteredAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                className={`bg-zinc-900 rounded-lg p-4 aspect-square cursor-pointer ${
                  achievement.unlocked ? "border border-primary/30" : "opacity-70"
                }`}
                variants={itemVariants}
                onClick={() => setSelectedAchievement(achievement)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className={`${achievement.iconBg} rounded-full p-4 mb-3`}>{achievement.icon}</div>
                  <h3 className="font-bold mb-1">{achievement.title}</h3>
                  <p className="text-xs text-zinc-400 mb-2">{achievement.description}</p>

                  {achievement.unlocked ? (
                    <Badge variant="success" className="text-xs">
                      Unlocked
                    </Badge>
                  ) : (
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Achievement detail modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
            <motion.div
              className="bg-zinc-900 rounded-lg max-w-md w-full overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <div className="relative">
                <div className="h-40 bg-gradient-to-b from-primary/30 to-zinc-900 flex items-center justify-center">
                  <div className={`${selectedAchievement.iconBg} rounded-full p-6`}>
                    <div className="text-4xl">{selectedAchievement.icon}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setSelectedAchievement(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-center">{selectedAchievement.title}</h2>
                <p className="text-zinc-400 text-center mb-4">{selectedAchievement.description}</p>

                {selectedAchievement.unlocked ? (
                  <div className="bg-primary/10 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Unlocked On</span>
                      <span className="text-sm">{selectedAchievement.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Reward</span>
                      <span className="text-sm">{selectedAchievement.reward}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm">
                        {selectedAchievement.progress}/{selectedAchievement.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-primary h-full"
                        style={{ width: `${(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Reward</span>
                      <span className="text-sm">{selectedAchievement.reward}</span>
                    </div>
                  </div>
                )}

                <Button className="w-full" onClick={() => setSelectedAchievement(null)}>
                  {selectedAchievement.unlocked ? "Awesome!" : "Keep Going!"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <TabBar activeTab="achievements" />
    </main>
  )
}
