"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TabBar } from "@/components/tab-bar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Filter, Heart, Clock, Trophy, Star, Share2, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Athlete {
  id: string
  name: string
  avatar: string
  sport: string
  specialty: string
  followers: number
  supported: boolean
  verified: boolean
  achievements?: string[]
  sponsoredBy?: {
    name: string
    logo: string
  }[]
  upcomingEvents?: {
    name: string
    date: string
    location: string
  }[]
}

export default function AthleteSupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "supported" | "verified">("all")

  // Mock data for athletes
  const athletes: Athlete[] = [
    {
      id: "ath1",
      name: "Alex Thompson",
      avatar: "/wave-rider-profile.png",
      sport: "Surfing",
      specialty: "Big Wave",
      followers: 12500,
      supported: true,
      verified: true,
      achievements: ["WSL Championship Tour", "Pipeline Masters Winner", "Mavericks Invitational"],
      sponsoredBy: [
        {
          name: "RipCurl",
          logo: "/abstract-wave-logo.png",
        },
        {
          name: "Red Bull",
          logo: "/energy-drink-logo.png",
        },
      ],
      upcomingEvents: [
        {
          name: "Tahiti Pro",
          date: "Aug 15, 2023",
          location: "Teahupo'o, Tahiti",
        },
        {
          name: "Pipeline Masters",
          date: "Dec 8, 2023",
          location: "Banzai Pipeline, Hawaii",
        },
      ],
    },
    {
      id: "ath2",
      name: "Sophia Chen",
      avatar: "/diverse-woman-portrait.png",
      sport: "Snowboarding",
      specialty: "Halfpipe",
      followers: 8700,
      supported: false,
      verified: true,
      achievements: ["Olympic Gold Medalist", "X Games Champion", "US Open Winner"],
      sponsoredBy: [
        {
          name: "Burton",
          logo: "/abstract-snowboard-design.png",
        },
      ],
      upcomingEvents: [
        {
          name: "X Games Aspen",
          date: "Jan 25, 2024",
          location: "Aspen, Colorado",
        },
      ],
    },
    {
      id: "ath3",
      name: "Marcus Johnson",
      avatar: "/contemplative-man.png",
      sport: "Skateboarding",
      specialty: "Street",
      followers: 15200,
      supported: true,
      verified: true,
      achievements: ["Street League Champion", "X Games Gold Medalist", "Tampa Pro Winner"],
      sponsoredBy: [
        {
          name: "Nike SB",
          logo: "/stylized-swoosh.png",
        },
        {
          name: "Monster Energy",
          logo: "/energy-drink-logo.png",
        },
      ],
      upcomingEvents: [
        {
          name: "Street League Los Angeles",
          date: "Jul 30, 2023",
          location: "Los Angeles, CA",
        },
      ],
    },
    {
      id: "ath4",
      name: "Emma Rodriguez",
      avatar: "/diverse-online-profiles.png",
      sport: "Skateboarding",
      specialty: "Park",
      followers: 6300,
      supported: false,
      verified: false,
      achievements: ["Regional Champion", "Rising Star Award"],
      sponsoredBy: [
        {
          name: "Vans",
          logo: "/classic-vans-sidestripe.png",
        },
      ],
    },
    {
      id: "ath5",
      name: "Kai Nakamura",
      avatar: "/contemplative-artist.png",
      sport: "Surfing",
      specialty: "Aerial",
      followers: 9800,
      supported: false,
      verified: true,
      achievements: ["WSL Airshow Champion", "Red Bull Airborne Winner"],
      sponsoredBy: [
        {
          name: "Billabong",
          logo: "/abstract-wave-logo.png",
        },
      ],
      upcomingEvents: [
        {
          name: "Red Bull Airborne",
          date: "Sep 5, 2023",
          location: "Hossegor, France",
        },
      ],
    },
  ]

  // Filter athletes based on selected filter and search query
  const filteredAthletes = athletes.filter((athlete) => {
    const matchesFilter =
      filter === "all" || (filter === "supported" && athlete.supported) || (filter === "verified" && athlete.verified)

    const matchesSearch =
      searchQuery === "" ||
      athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      athlete.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      athlete.specialty.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const toggleSupport = (id: string) => {
    // In a real app, this would call an API to toggle support
    console.log(`Toggle support for athlete ${id}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Athlete Support</h1>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search athletes..."
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
            All Athletes
          </Button>
          <Button
            variant={filter === "supported" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("supported")}
            className="rounded-full"
          >
            Supported
          </Button>
          <Button
            variant={filter === "verified" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("verified")}
            className="rounded-full"
          >
            Verified
          </Button>
        </div>

        <div className="space-y-4">
          {filteredAthletes.map((athlete) => (
            <Card key={athlete.id} className="bg-zinc-900">
              <CardContent className="p-4">
                <div className="flex items-center mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-3">
                    <Image
                      src={athlete.avatar || "/placeholder.svg"}
                      alt={athlete.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-medium">{athlete.name}</h3>
                      {athlete.verified && <Badge className="ml-2 bg-blue-600">Verified</Badge>}
                    </div>
                    <p className="text-sm text-zinc-400">
                      {athlete.sport} • {athlete.specialty}
                    </p>
                    <div className="flex items-center text-xs text-zinc-500">
                      <span>{athlete.followers.toLocaleString()} followers</span>
                    </div>
                  </div>
                  <Button
                    variant={athlete.supported ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full ${athlete.supported ? "bg-primary text-black hover:bg-primary/90" : ""}`}
                    onClick={() => toggleSupport(athlete.id)}
                  >
                    <Heart className={`h-4 w-4 ${athlete.supported ? "fill-black" : ""} mr-1`} />
                    {athlete.supported ? "Supporting" : "Support"}
                  </Button>
                </div>

                {athlete.achievements && athlete.achievements.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center mb-2">
                      <Trophy className="h-4 w-4 text-primary mr-2" />
                      <h4 className="text-sm font-medium">Top Achievements</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {athlete.achievements.map((achievement, index) => (
                        <Badge key={index} variant="outline" className="bg-zinc-800 text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {athlete.sponsoredBy && athlete.sponsoredBy.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-primary mr-2" />
                      <h4 className="text-sm font-medium">Sponsored By</h4>
                    </div>
                    <div className="flex gap-2">
                      {athlete.sponsoredBy.map((sponsor, index) => (
                        <div key={index} className="bg-zinc-800 rounded-full p-1">
                          <div className="relative w-6 h-6">
                            <Image
                              src={sponsor.logo || "/placeholder.svg"}
                              alt={sponsor.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {athlete.upcomingEvents && athlete.upcomingEvents.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 text-primary mr-2" />
                      <h4 className="text-sm font-medium">Upcoming Events</h4>
                    </div>
                    <div className="space-y-2">
                      {athlete.upcomingEvents.map((event, index) => (
                        <div key={index} className="bg-zinc-800 rounded-lg p-2 text-xs">
                          <div className="font-medium">{event.name}</div>
                          <div className="text-zinc-400">
                            {event.date} • {event.location}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Share2 className="h-3 w-3" />
                    Share
                  </Button>
                  <Link href={`/athlete-support/${athlete.id}`}>
                    <Button size="sm" className="flex items-center gap-1">
                      View Profile
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <TabBar activeTab="community" />
    </div>
  )
}
