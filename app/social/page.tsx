"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Search, Filter, Plus, Heart, MessageCircle, Share2, Award, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { generateRandomNFTImage } from "@/lib/utils"
import Image from "next/image"

export default function SocialPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock social feed data
  const posts = [
    {
      id: "post-1",
      user: {
        name: "Alex Runner",
        username: "alexrunner",
        avatar: "/focused-marathoner.png",
      },
      content: "Just completed my morning run! 5.2km in 32:15. Feeling great! 🏃‍♂️",
      image: "/misty-morning-trail.png",
      location: {
        name: "Central Park Trail",
        lat: 40.7812,
        lng: -73.9665,
      },
      activity: {
        type: "running",
        distance: "5.2 km",
        duration: "32:15",
        calories: "327",
      },
      nft: {
        earned: true,
        name: "Morning Runner",
        image: generateRandomNFTImage(3),
      },
      likes: 24,
      comments: 5,
      time: "2 hours ago",
    },
    {
      id: "post-2",
      user: {
        name: "Skate Master",
        username: "sk8master",
        avatar: "/urban-skater-motion.png",
      },
      content:
        "New personal best at Downtown Skatepark! Landed my first kickflip 360. Check out the video! #skateboarding #tricks",
      image: "/ollie-over-gap.png",
      location: {
        name: "Downtown Skatepark",
        lat: 34.0522,
        lng: -118.2437,
      },
      activity: {
        type: "skateboarding",
        duration: "1:15:00",
        calories: "450",
      },
      likes: 42,
      comments: 8,
      time: "Yesterday",
    },
    {
      id: "post-3",
      user: {
        name: "Wave Rider",
        username: "waverider",
        avatar: "/determined-surfer.png",
      },
      content:
        "Perfect waves at Sunset Beach this morning! Earned my Wave Catcher NFT after 5 consecutive surf sessions. 🏄‍♂️🌊",
      image: "/placeholder.svg?height=300&width=500&query=surfing+wave",
      location: {
        name: "Sunset Beach",
        lat: 33.6189,
        lng: -117.9298,
      },
      activity: {
        type: "surfing",
        duration: "2:00:00",
        calories: "700",
      },
      nft: {
        earned: true,
        name: "Wave Catcher",
        image: generateRandomNFTImage(5),
      },
      likes: 36,
      comments: 12,
      time: "2 days ago",
    },
  ]

  const challenges = [
    {
      id: "challenge-1",
      title: "10K Challenge",
      description: "Run 10km in a single session",
      reward: "500 BURNZ + Exclusive NFT",
      participants: 128,
      deadline: "3 days left",
      image: "/placeholder.svg?height=100&width=100&query=running+medal",
    },
    {
      id: "challenge-2",
      title: "Skate Park Tour",
      description: "Visit 5 different skateparks",
      reward: "750 BURNZ + Rare NFT",
      participants: 64,
      deadline: "5 days left",
      image: "/placeholder.svg?height=100&width=100&query=skateboard+medal",
    },
    {
      id: "challenge-3",
      title: "Weekend Warrior",
      description: "Complete 3 activities this weekend",
      reward: "300 BURNZ",
      participants: 256,
      deadline: "Starts Saturday",
      image: "/placeholder.svg?height=100&width=100&query=fitness+medal",
    },
  ]

  const leaderboard = [
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
  ]

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Community</h1>
          <Button variant="ghost" size="icon">
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search posts and users..."
            className="pl-9 bg-zinc-900 border-zinc-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="feed" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Activity Feed</h2>
              <Link href="/social/create-post">
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  New Post
                </Button>
              </Link>
            </div>

            {posts.map((post) => (
              <div key={post.id} className="bg-zinc-900 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                      <AvatarFallback>{post.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.user.name}</p>
                      <p className="text-xs text-zinc-400">
                        @{post.user.username} • {post.time}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm mb-3">{post.content}</p>

                  {post.location && (
                    <div className="flex items-center gap-1 text-xs text-zinc-400 mb-2">
                      <MapPin className="h-3 w-3 text-primary" />
                      <span>{post.location.name}</span>
                    </div>
                  )}

                  {post.image && (
                    <div className="rounded-lg overflow-hidden mb-3 relative aspect-video">
                      <Image src={post.image || "/placeholder.svg"} alt="Post" fill className="object-cover" />
                    </div>
                  )}

                  {post.activity && (
                    <div className="bg-zinc-800 rounded-lg p-3 mb-3">
                      <p className="text-xs text-zinc-400 mb-2">Activity Details</p>
                      <div className="flex gap-4">
                        {post.activity.type && (
                          <div>
                            <p className="text-xs text-zinc-400">Type</p>
                            <p className="text-sm capitalize">{post.activity.type}</p>
                          </div>
                        )}
                        {post.activity.distance && (
                          <div>
                            <p className="text-xs text-zinc-400">Distance</p>
                            <p className="text-sm">{post.activity.distance}</p>
                          </div>
                        )}
                        {post.activity.duration && (
                          <div>
                            <p className="text-xs text-zinc-400">Duration</p>
                            <p className="text-sm">{post.activity.duration}</p>
                          </div>
                        )}
                        {post.activity.calories && (
                          <div>
                            <p className="text-xs text-zinc-400">Calories</p>
                            <p className="text-sm">{post.activity.calories} kcal</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {post.nft && post.nft.earned && (
                    <div className="bg-zinc-800 rounded-lg p-3 mb-3 flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden">
                        <Image
                          src={post.nft.image || "/placeholder.svg"}
                          alt={post.nft.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <Award className="h-3 w-3 text-burnz-500" />
                          <p className="text-xs text-burnz-500">NFT Earned</p>
                        </div>
                        <p className="text-sm font-medium">{post.nft.name}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-800 p-2 flex justify-between">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{post.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{post.comments}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    <span className="text-xs">Share</span>
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Active Challenges</h2>
              <Link href="/social/challenges">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            {challenges.map((challenge) => (
              <div key={challenge.id} className="bg-zinc-900 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={challenge.image || "/placeholder.svg"}
                      alt={challenge.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold">{challenge.title}</h3>
                      <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded-full">{challenge.deadline}</span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-2">{challenge.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-burnz-500">{challenge.reward}</p>
                      <p className="text-xs text-zinc-500">{challenge.participants} participants</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button className="w-full">Join a Challenge</Button>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">This Week's Leaders</h2>
              <select className="bg-zinc-800 text-white text-sm rounded-md px-2 py-1 border-none">
                <option value="distance">Distance</option>
                <option value="calories">Calories</option>
                <option value="activities">Activities</option>
              </select>
            </div>

            <div className="space-y-2">
              {leaderboard.map((item) => (
                <div key={item.rank} className="bg-zinc-900 rounded-lg p-3 flex items-center">
                  <div className="w-6 text-center font-bold mr-2">
                    {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : item.rank === 3 ? "🥉" : item.rank}
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
        </Tabs>
      </div>

      <TabBar activeTab="home" />
    </main>
  )
}
