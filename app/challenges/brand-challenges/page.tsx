"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Filter, Search } from "lucide-react"
import Link from "next/link"
import { BrandPartnershipCard } from "@/components/brand-partnership-card"
import { Input } from "@/components/ui/input"

export default function BrandChallengesPage() {
  const [filter, setFilter] = useState<"all" | "official" | "community">("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock brand partnerships with challenges
  const brandPartnerships = [
    {
      brand: {
        name: "RipCurl",
        logo: "/abstract-wave-logo.png",
        description: "Official partner for surf gear. Exclusive patches and challenges available.",
        partnershipLevel: "official" as const,
      },
      challenge: {
        title: "Summer Surf Series",
        description: "Track 10 surf sessions this summer wearing RipCurl gear with PMBC patches.",
        location: "Any Beach",
        participants: 128,
        date: "Jun 1 - Aug 31",
        reward: "Limited Edition RipCurl x PMBC NFT + 500 Tokens",
      },
    },
    {
      brand: {
        name: "Burton",
        logo: "/abstract-snowboard-design.png",
        description: "Official partner for snow gear. Exclusive patches and challenges available.",
        partnershipLevel: "official" as const,
      },
      challenge: {
        title: "Winter Shred Challenge",
        description: "Track 5 snowboarding sessions at different locations wearing Burton gear with PMBC patches.",
        location: "Any Snow Resort",
        participants: 87,
        date: "Dec 1 - Feb 28",
        reward: "Burton x PMBC Limited Edition Beanie + 300 Tokens",
        completed: true,
      },
    },
    {
      brand: {
        name: "Nike SB",
        logo: "/stylized-swoosh.png",
        description: "Community partner for skate gear. Limited edition patches available.",
        partnershipLevel: "community" as const,
      },
      challenge: {
        title: "Urban Skate Tour",
        description: "Visit and skate at 3 different skateparks wearing Nike SB gear with PMBC patches.",
        location: "Urban Areas",
        participants: 215,
        date: "Ongoing",
        reward: "Nike SB x PMBC Sticker Pack + 200 Tokens",
      },
    },
    {
      brand: {
        name: "Billabong",
        logo: "/abstract-wave-logo.png",
        description: "Upcoming partner for surf gear. Partnership launching soon.",
        partnershipLevel: "upcoming" as const,
      },
    },
    {
      brand: {
        name: "Vans",
        logo: "/classic-vans-sidestripe.png",
        description: "Upcoming partner for skate gear. Partnership launching soon.",
        partnershipLevel: "upcoming" as const,
      },
    },
  ]

  // Filter partnerships based on selected filter and search query
  const filteredPartnerships = brandPartnerships.filter((partnership) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "official" && partnership.brand.partnershipLevel === "official") ||
      (filter === "community" && partnership.brand.partnershipLevel === "community")

    const matchesSearch =
      searchQuery === "" ||
      partnership.brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (partnership.challenge?.title.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

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
          <h1 className="text-xl font-bold">Brand Challenges</h1>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search challenges..."
            className="pl-9 bg-zinc-900 border-zinc-800"
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
            All Partners
          </Button>
          <Button
            variant={filter === "official" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("official")}
            className="rounded-full"
          >
            Official Partners
          </Button>
          <Button
            variant={filter === "community" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("community")}
            className="rounded-full"
          >
            Community Partners
          </Button>
        </div>

        <div className="space-y-6">
          {filteredPartnerships.map((partnership, index) => (
            <BrandPartnershipCard
              key={index}
              brand={partnership.brand}
              challenge={partnership.challenge}
              onJoin={() => console.log(`Joined ${partnership.brand.name} challenge`)}
            />
          ))}
        </div>
      </div>

      <TabBar activeTab="challenges" />
    </div>
  )
}
