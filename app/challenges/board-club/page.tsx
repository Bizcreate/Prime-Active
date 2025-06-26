"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Filter, MapPin, Calendar, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BananaRewardCard } from "@/components/banana-reward-card"

export default function BoardClubChallengesPage() {
  const [filter, setFilter] = useState("all")

  // Mock challenges data
  const challenges = [
    {
      id: "challenge-1",
      title: "Shaka Shredder",
      description: "Complete 5 skateboarding sessions this week",
      bananaPoints: 250,
      image: "/sunset-skate.png",
      unlocked: true,
      progress: 3,
      maxProgress: 5,
      type: "skate",
    },
    {
      id: "challenge-2",
      title: "Banana Barrel",
      description: "Ride 3 waves over 6ft tall",
      bananaPoints: 350,
      image: "/barrel-rider.png",
      unlocked: false,
      progress: 1,
      maxProgress: 3,
      type: "surf",
    },
    {
      id: "challenge-3",
      title: "Powder Monkey",
      description: "Track 10,000ft of vertical descent",
      bananaPoints: 400,
      image: "/powder-shred.png",
      unlocked: false,
      progress: 4500,
      maxProgress: 10000,
      type: "snow",
    },
    {
      id: "challenge-4",
      title: "Urban Explorer",
      description: "Visit 5 different skateparks in your city",
      bananaPoints: 300,
      image: "/concrete-canvas.png",
      unlocked: false,
      progress: 2,
      maxProgress: 5,
      type: "skate",
    },
    {
      id: "challenge-5",
      title: "Dawn Patrol",
      description: "Surf 3 days in a row before 8am",
      bananaPoints: 275,
      image: "/sunrise-surf.png",
      unlocked: false,
      progress: 1,
      maxProgress: 3,
      type: "surf",
    },
    {
      id: "challenge-6",
      title: "Fresh Tracks",
      description: "Be the first to ride a freshly groomed trail",
      bananaPoints: 200,
      image: "/winter-trail.png",
      unlocked: true,
      progress: 0,
      maxProgress: 1,
      type: "snow",
    },
  ]

  const filteredChallenges = filter === "all" ? challenges : challenges.filter((challenge) => challenge.type === filter)

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/challenges">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Board Club Challenges</h1>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex">
            {/* Replace Prime Mates logo with Shaka Coin logo */}
            <Image
              src="/shaka-coin.png"
              alt="Prime Mates Board Club"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-1 bg-primary/20 px-3 py-1 rounded-full">
            {/* Update to Shaka Banana logo */}
            <Image src="/shaka-banana.png" alt="Banana Points" width={16} height={16} className="object-contain" />
            <span className="text-xs text-primary font-medium">1,250 points available</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
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
            <Image src="/shaka-banana.png" alt="Skate" width={16} height={16} className="object-contain" />
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
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredChallenges.map((challenge) => (
              <BananaRewardCard
                key={challenge.id}
                title={challenge.title}
                description={challenge.description}
                bananaPoints={challenge.bananaPoints}
                image={challenge.image}
                unlocked={challenge.unlocked}
                progress={challenge.progress}
                maxProgress={challenge.maxProgress}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 bg-zinc-900 rounded-lg p-4">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Community Challenge
          </h2>
          <div className="relative h-40 rounded-lg overflow-hidden mb-3">
            <Image src="/placeholder.svg?key=vx2d0" alt="Community Challenge" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-bold text-white">Summer Shred Fest</h3>
              <div className="flex justify-between items-center">
                <p className="text-xs text-zinc-300 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Ends in 5 days
                </p>
                <p className="text-xs text-zinc-300 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Venice Beach
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-zinc-400 mb-3">
            Join the Prime Mates crew for our biggest event of the summer! Track your activities, share your best
            tricks, and earn exclusive rewards.
          </p>
          <Button className="w-full bg-primary text-black">Join Challenge</Button>
        </div>
      </div>

      <TabBar activeTab="challenges" />
    </main>
  )
}
