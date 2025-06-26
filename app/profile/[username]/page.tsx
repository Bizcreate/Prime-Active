"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostCard } from "@/components/post-card"
import { ActivityCard } from "@/components/activity-card"
import { NftCard } from "@/components/nft-card"
import Link from "next/link"
import { ArrowLeft, Settings, MapPin, Calendar, Trophy, CheckCircle, Flame, Share2 } from "lucide-react"
import Image from "next/image"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  // Simulate profile data loading
  useEffect(() => {
    setTimeout(() => {
      setProfile({
        username: decodeURIComponent(username),
        displayName: decodeURIComponent(username),
        avatar: "/mystical-forest-spirit.png",
        bio: "Extreme sports enthusiast. Skater, surfer, and snowboarder. Collecting NFTs and earning $PRIME tokens through my activities.",
        location: "Los Angeles, CA",
        joinedDate: "September 2023",
        stats: {
          followers: 248,
          following: 156,
          activities: 87,
          achievements: 12,
        },
        level: {
          current: 15,
          xp: 2450,
          nextLevel: 3000,
        },
        badges: [
          { name: "Early Adopter", icon: "🏆" },
          { name: "Skate Master", icon: "🛹" },
          { name: "Wave Rider", icon: "🌊" },
          { name: "Powder Hound", icon: "❄️" },
        ],
        activities: [
          {
            id: "act1",
            type: "skate",
            title: "Evening Skate Session",
            location: "Downtown Skatepark",
            date: "Yesterday",
            duration: "1h 45m",
            distance: "5.2 miles",
            points: 150,
            image: "/sunset-ollie.png",
          },
          {
            id: "act2",
            type: "surf",
            title: "Morning Surf",
            location: "Malibu Beach",
            date: "3 days ago",
            duration: "2h 30m",
            distance: "N/A",
            points: 200,
            image: "/barrel-rider.png",
          },
          {
            id: "act3",
            type: "skate",
            title: "Street Skating",
            location: "Venice Beach",
            date: "Last week",
            duration: "1h 15m",
            distance: "3.8 miles",
            points: 120,
            image: "/placeholder.svg?height=400&width=600&query=street+skateboarding",
          },
        ],
        posts: [
          {
            id: "post1",
            content: "Just hit a new personal best at Downtown Skatepark! Earned 150 banana points today. 🍌🛹",
            image: "/sunset-ollie.png",
            time: "Yesterday",
            likes: 24,
            comments: 8,
            location: "Downtown Skatepark",
            activity: {
              type: "skate",
              duration: "1h 45m",
              distance: "5.2 miles",
              points: 150,
            },
          },
          {
            id: "post2",
            content:
              "Perfect waves this morning at Malibu! Caught the barrel of my life and earned my Banana Barrel achievement. 🍌🌊",
            image: "/barrel-rider.png",
            time: "3 days ago",
            likes: 42,
            comments: 12,
            location: "Malibu Surfrider Beach",
            activity: {
              type: "surf",
              duration: "2h 30m",
              distance: "N/A",
              points: 200,
            },
          },
        ],
        nfts: [
          {
            id: "nft1",
            name: "Prime Mates Skater #042",
            image: "/placeholder.svg?height=400&width=400&query=skateboarding+monkey+nft",
            rarity: "Rare",
            benefits: ["2x Skate Points", "Exclusive Challenges"],
          },
          {
            id: "nft2",
            name: "Wave Rider #108",
            image: "/placeholder.svg?height=400&width=400&query=surfing+monkey+nft",
            rarity: "Uncommon",
            benefits: ["1.5x Surf Points", "Beach Access"],
          },
          {
            id: "nft3",
            name: "Achievement: 50 Sessions",
            image: "/placeholder.svg?height=400&width=400&query=achievement+badge+nft",
            rarity: "Common",
            benefits: ["Profile Badge", "10% Bonus XP"],
          },
        ],
        achievements: [
          {
            id: "ach1",
            name: "Skate Master",
            description: "Complete 50 skateboarding sessions",
            progress: 100,
            completed: true,
            image: "/placeholder.svg?height=100&width=100&query=skateboarding+achievement+badge",
          },
          {
            id: "ach2",
            name: "Wave Hunter",
            description: "Surf at 5 different beaches",
            progress: 80,
            completed: false,
            image: "/placeholder.svg?height=100&width=100&query=surfing+achievement+badge",
          },
          {
            id: "ach3",
            name: "Social Butterfly",
            description: "Make 25 posts",
            progress: 60,
            completed: false,
            image: "/placeholder.svg?height=100&width=100&query=social+achievement+badge",
          },
        ],
      })
      setIsLoading(false)
    }, 1000)
  }, [username])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    if (!isFollowing) {
      setProfile({
        ...profile,
        stats: {
          ...profile.stats,
          followers: profile.stats.followers + 1,
        },
      })
    } else {
      setProfile({
        ...profile,
        stats: {
          ...profile.stats,
          followers: profile.stats.followers - 1,
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-black items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffc72d]"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="relative">
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/social">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Profile</h1>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {/* Profile Header */}
          <div className="mb-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-[#ffc72d]">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.displayName} />
                  <AvatarFallback>{profile.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-[#ffc72d] rounded-full p-1">
                  <CheckCircle className="h-4 w-4 text-black" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{profile.displayName}</h2>
                  <Badge className="bg-[#ffc72d] text-black">Lvl {profile.level.current}</Badge>
                </div>
                <p className="text-sm text-zinc-400 mb-2">@{profile.username}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{profile.location}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Joined {profile.joinedDate}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {username === "you" ? (
                    <Button className="flex-1 bg-zinc-800 hover:bg-zinc-700">Edit Profile</Button>
                  ) : (
                    <>
                      <Button
                        className={`flex-1 ${
                          isFollowing
                            ? "bg-zinc-800 hover:bg-zinc-700"
                            : "bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90"
                        }`}
                        onClick={handleFollow}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm mt-4">{profile.bio}</p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mt-4 text-center">
              <div className="bg-zinc-900 rounded-lg p-2">
                <p className="text-lg font-bold">{profile.stats.followers}</p>
                <p className="text-xs text-zinc-400">Followers</p>
              </div>
              <div className="bg-zinc-900 rounded-lg p-2">
                <p className="text-lg font-bold">{profile.stats.following}</p>
                <p className="text-xs text-zinc-400">Following</p>
              </div>
              <div className="bg-zinc-900 rounded-lg p-2">
                <p className="text-lg font-bold">{profile.stats.activities}</p>
                <p className="text-xs text-zinc-400">Activities</p>
              </div>
              <div className="bg-zinc-900 rounded-lg p-2">
                <p className="text-lg font-bold">{profile.stats.achievements}</p>
                <p className="text-xs text-zinc-400">Achievements</p>
              </div>
            </div>

            {/* Level progress */}
            <div className="mt-4 bg-zinc-900 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-[#ffc72d]" />
                  <p className="text-sm font-medium">Level {profile.level.current}</p>
                </div>
                <p className="text-xs text-zinc-400">
                  {profile.level.xp} / {profile.level.nextLevel} XP
                </p>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-[#ffc72d] h-2 rounded-full"
                  style={{ width: `${(profile.level.xp / profile.level.nextLevel) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Badges */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Badges</h3>
                <Link href="/achievements" className="text-xs text-[#ffc72d]">
                  View All
                </Link>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {profile.badges.map((badge: any, index: number) => (
                  <div key={index} className="flex flex-col items-center bg-zinc-900 rounded-lg p-2 min-w-[70px]">
                    <div className="text-xl mb-1">{badge.icon}</div>
                    <p className="text-xs text-center">{badge.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="activities" className="w-full">
            <TabsList className="grid grid-cols-4 bg-zinc-900">
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="nfts">NFTs</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            <TabsContent value="activities" className="mt-4 space-y-4">
              {profile.activities.map((activity: any) => (
                <ActivityCard
                  key={activity.id}
                  title={activity.title}
                  type={activity.type}
                  location={activity.location}
                  date={activity.date}
                  duration={activity.duration}
                  distance={activity.distance}
                  points={activity.points}
                  image={activity.image}
                />
              ))}
              <Link href="/activities" className="block">
                <Button variant="outline" className="w-full">
                  View All Activities
                </Button>
              </Link>
            </TabsContent>
            <TabsContent value="posts" className="mt-4 space-y-4">
              {profile.posts.map((post: any) => (
                <PostCard
                  key={post.id}
                  username={profile.username}
                  avatar={profile.avatar}
                  time={post.time}
                  content={post.content}
                  image={post.image}
                  likes={post.likes}
                  comments={post.comments}
                  location={post.location}
                  activity={post.activity}
                  verified={true}
                />
              ))}
              <Link href="/social" className="block">
                <Button variant="outline" className="w-full">
                  View All Posts
                </Button>
              </Link>
            </TabsContent>
            <TabsContent value="nfts" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                {profile.nfts.map((nft: any) => (
                  <NftCard key={nft.id} name={nft.name} image={nft.image} rarity={nft.rarity} benefits={nft.benefits} />
                ))}
              </div>
              <Link href="/wallet" className="block mt-4">
                <Button variant="outline" className="w-full">
                  View All NFTs
                </Button>
              </Link>
            </TabsContent>
            <TabsContent value="achievements" className="mt-4 space-y-4">
              {profile.achievements.map((achievement: any) => (
                <div key={achievement.id} className="bg-zinc-900 rounded-lg p-3 flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center">
                    <Image
                      src={achievement.image || "/placeholder.svg"}
                      alt={achievement.name}
                      fill
                      className="object-cover"
                    />
                    {achievement.completed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Trophy className="h-6 w-6 text-[#ffc72d]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{achievement.name}</h3>
                      {achievement.completed && <Badge className="bg-[#ffc72d] text-black">Completed</Badge>}
                    </div>
                    <p className="text-xs text-zinc-400">{achievement.description}</p>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-[#ffc72d] h-1.5 rounded-full"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/achievements" className="block">
                <Button variant="outline" className="w-full">
                  View All Achievements
                </Button>
              </Link>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <TabBar activeTab="profile" />
    </div>
  )
}
