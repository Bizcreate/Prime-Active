"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TabBar } from "@/components/tab-bar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Users, Calendar, Trophy, Search, Filter, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface LocationChallenge {
  id: string
  title: string
  description: string
  location: string
  coordinates: [number, number]
  image: string
  participants: number
  startDate: string
  endDate: string
  reward: string
  distance?: string
  difficulty: "easy" | "medium" | "hard"
  brand?: {
    name: string
    logo: string
  }
  completed?: boolean
}

export default function LocationChallengesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "nearby" | "popular">("all")

  // Mock data for location challenges
  const challenges: LocationChallenge[] = [
    {
      id: "loc1",
      title: "Bondi Beach Surf Challenge",
      description: "Complete 3 surf sessions at Bondi Beach within a month.",
      location: "Bondi Beach, Sydney, Australia",
      coordinates: [-33.8915, 151.2767],
      image: "/sunny-seashore.png",
      participants: 128,
      startDate: "Jun 1, 2023",
      endDate: "Jun 30, 2023",
      reward: "Limited Edition RipCurl x PMBC Patch + 500 Tokens",
      distance: "1.2 km away",
      difficulty: "medium",
      brand: {
        name: "RipCurl",
        logo: "/abstract-wave-logo.png",
      },
    },
    {
      id: "loc2",
      title: "Pipeline Masters",
      description: "Surf at the legendary Pipeline spot on the North Shore of Oahu.",
      location: "Banzai Pipeline, Oahu, Hawaii",
      coordinates: [21.6654, -158.0521],
      image: "/barrel-rider.png",
      participants: 64,
      startDate: "Dec 1, 2023",
      endDate: "Dec 31, 2023",
      reward: "Exclusive Pipeline NFT + 1000 Tokens",
      distance: "8,500 km away",
      difficulty: "hard",
      brand: {
        name: "WSL",
        logo: "/abstract-wave-logo.png",
      },
    },
    {
      id: "loc3",
      title: "Venice Beach Skate Series",
      description: "Complete 5 skate sessions at Venice Beach Skatepark.",
      location: "Venice Beach Skatepark, Los Angeles, CA",
      coordinates: [33.985, -118.4695],
      image: "/urban-skate-session.png",
      participants: 215,
      startDate: "Jul 15, 2023",
      endDate: "Aug 15, 2023",
      reward: "Nike SB x PMBC Limited Edition Patch + 300 Tokens",
      distance: "12,000 km away",
      difficulty: "medium",
      brand: {
        name: "Nike SB",
        logo: "/stylized-swoosh.png",
      },
    },
    {
      id: "loc4",
      title: "Whistler Blackcomb Challenge",
      description: "Complete 3 snowboarding sessions at Whistler Blackcomb Resort.",
      location: "Whistler Blackcomb, BC, Canada",
      coordinates: [50.1163, -122.9574],
      image: "/powder-shred.png",
      participants: 87,
      startDate: "Dec 15, 2023",
      endDate: "Jan 15, 2024",
      reward: "Burton x PMBC Limited Edition Beanie + 400 Tokens",
      distance: "9,800 km away",
      difficulty: "hard",
      brand: {
        name: "Burton",
        logo: "/abstract-snowboard-design.png",
      },
      completed: true,
    },
    {
      id: "loc5",
      title: "Local Skatepark Challenge",
      description: "Visit and skate at your local skatepark 10 times in a month.",
      location: "Any Local Skatepark",
      coordinates: [0, 0],
      image: "/urban-playground.png",
      participants: 312,
      startDate: "Ongoing",
      endDate: "Ongoing",
      reward: "PMBC Skate Patch + 200 Tokens",
      distance: "Varies",
      difficulty: "easy",
    },
  ]

  // Filter challenges based on selected filter and search query
  const filteredChallenges = challenges.filter((challenge) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "nearby" &&
        challenge.distance &&
        challenge.distance.includes("km away") &&
        Number.parseInt(challenge.distance) < 5000) ||
      (filter === "popular" && challenge.participants > 100)

    const matchesSearch =
      searchQuery === "" ||
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.location.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/challenges">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Location Challenges</h1>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search locations..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="rounded-full"
          >
            All Challenges
          </Button>
          <Button
            variant={filter === "nearby" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("nearby")}
            className="rounded-full"
          >
            Nearby
          </Button>
          <Button
            variant={filter === "popular" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("popular")}
            className="rounded-full"
          >
            Popular
          </Button>
        </div>

        <div className="space-y-4">
          {filteredChallenges.map((challenge) => (
            <Card key={challenge.id} className="bg-zinc-900 overflow-hidden">
              <div className="relative h-40">
                <Image
                  src={challenge.image || "/placeholder.svg"}
                  alt={challenge.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h2 className="text-lg font-bold">{challenge.title}</h2>
                  <div className="flex items-center text-xs text-zinc-300">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{challenge.location}</span>
                  </div>
                </div>
                {challenge.brand && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-black/60 rounded-full p-1">
                      <div className="relative w-6 h-6">
                        <Image
                          src={challenge.brand.logo || "/placeholder.svg"}
                          alt={challenge.brand.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge
                    className={`${
                      challenge.difficulty === "easy"
                        ? "bg-green-600"
                        : challenge.difficulty === "medium"
                          ? "bg-amber-600"
                          : "bg-red-600"
                    }`}
                  >
                    {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-zinc-400 mb-3">{challenge.description}</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-zinc-800 p-2 rounded-lg flex flex-col items-center">
                    <Users className="h-4 w-4 text-zinc-500 mb-1" />
                    <span className="text-xs">{challenge.participants}</span>
                  </div>
                  <div className="bg-zinc-800 p-2 rounded-lg flex flex-col items-center">
                    <Calendar className="h-4 w-4 text-zinc-500 mb-1" />
                    <span className="text-xs">{challenge.startDate.includes("Ongoing") ? "Ongoing" : "Limited"}</span>
                  </div>
                  <div className="bg-zinc-800 p-2 rounded-lg flex flex-col items-center">
                    <Clock className="h-4 w-4 text-zinc-500 mb-1" />
                    <span className="text-xs">{challenge.distance}</span>
                  </div>
                </div>
                <div className="flex items-start mb-4">
                  <Trophy className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-primary">{challenge.reward}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-zinc-500">
                    {challenge.startDate} - {challenge.endDate}
                  </div>
                  {challenge.completed ? (
                    <Badge className="bg-green-600">Completed</Badge>
                  ) : (
                    <Button size="sm" className="bg-primary text-black hover:bg-primary/90">
                      Join Challenge
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <TabBar activeTab="challenges" />
    </div>
  )
}
