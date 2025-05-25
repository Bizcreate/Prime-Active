"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TabBar } from "@/components/tab-bar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Filter, ShoppingBag, Clock, Star, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Patch {
  id: string
  name: string
  image: string
  description: string
  brand?: string
  brandLogo?: string
  price: number
  currency: string
  limited?: boolean
  exclusive?: boolean
  available: boolean
  stock?: number
  rating?: number
  reviews?: number
}

export default function PatchMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "limited" | "exclusive">("all")

  // Mock data for patches
  const patches: Patch[] = [
    {
      id: "patch1",
      name: "RipCurl Pro Series Patch",
      image: "/digital-threads.png",
      description: "Official RipCurl patch for professional surfers. Track your surf sessions and share with sponsors.",
      brand: "RipCurl",
      brandLogo: "/abstract-wave-logo.png",
      price: 25,
      currency: "USDC",
      limited: true,
      available: true,
      stock: 50,
      rating: 4.8,
      reviews: 24,
    },
    {
      id: "patch2",
      name: "Burton Alpine Collection",
      image: "/digital-threads.png",
      description: "Limited edition Burton patch for snowboarders. Track your mountain adventures.",
      brand: "Burton",
      brandLogo: "/abstract-snowboard-design.png",
      price: 30,
      currency: "USDC",
      limited: true,
      available: true,
      stock: 25,
      rating: 4.9,
      reviews: 18,
    },
    {
      id: "patch3",
      name: "Nike SB Street Series",
      image: "/digital-threads.png",
      description: "Nike SB patch for skateboarders. Track your street sessions and tricks.",
      brand: "Nike SB",
      brandLogo: "/stylized-swoosh.png",
      price: 20,
      currency: "USDC",
      available: true,
      rating: 4.5,
      reviews: 32,
    },
    {
      id: "patch4",
      name: "PMBC x RipCurl Collab",
      image: "/digital-threads.png",
      description: "Exclusive collaboration between Prime Mates Board Club and RipCurl. Limited to PMBC holders.",
      brand: "RipCurl",
      brandLogo: "/abstract-wave-logo.png",
      price: 0,
      currency: "FREE",
      exclusive: true,
      available: true,
      stock: 100,
      rating: 5.0,
      reviews: 12,
    },
    {
      id: "patch5",
      name: "World Surf League Edition",
      image: "/digital-threads.png",
      description: "Official WSL patch. Track your surf sessions at WSL locations.",
      brand: "WSL",
      brandLogo: "/abstract-wave-logo.png",
      price: 35,
      currency: "USDC",
      limited: true,
      available: false,
      stock: 0,
      rating: 4.7,
      reviews: 8,
    },
    {
      id: "patch6",
      name: "PMBC Founder's Edition",
      image: "/digital-threads.png",
      description: "Exclusive patch for PMBC founders. Track your activities and earn special rewards.",
      price: 0,
      currency: "FREE",
      exclusive: true,
      available: false,
      rating: 5.0,
      reviews: 5,
    },
  ]

  // Filter patches based on selected filter and search query
  const filteredPatches = patches.filter((patch) => {
    const matchesFilter =
      filter === "all" || (filter === "limited" && patch.limited) || (filter === "exclusive" && patch.exclusive)

    const matchesSearch =
      searchQuery === "" ||
      patch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patch.brand && patch.brand.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesFilter && matchesSearch
  })

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/patches">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Patch Marketplace</h1>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search patches..."
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
            All Patches
          </Button>
          <Button
            variant={filter === "limited" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("limited")}
            className="rounded-full"
          >
            Limited Edition
          </Button>
          <Button
            variant={filter === "exclusive" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("exclusive")}
            className="rounded-full"
          >
            Exclusive
          </Button>
        </div>

        <div className="space-y-4">
          {filteredPatches.map((patch) => (
            <Card key={patch.id} className="bg-zinc-900">
              <CardContent className="p-4">
                <div className="flex">
                  <div className="relative w-20 h-20 mr-4 flex-shrink-0">
                    <Image src={patch.image || "/placeholder.svg"} alt={patch.name} fill className="object-contain" />
                    {patch.brand && patch.brandLogo && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-zinc-800 rounded-full p-0.5">
                        <Image
                          src={patch.brandLogo || "/placeholder.svg"}
                          alt={patch.brand}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium">{patch.name}</h3>
                      <div className="flex items-center">
                        {patch.limited && <Badge className="bg-amber-600 mr-1">Limited</Badge>}
                        {patch.exclusive && <Badge className="bg-purple-600">Exclusive</Badge>}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 mb-2">{patch.description}</p>
                    {patch.brand && (
                      <div className="flex items-center text-xs text-zinc-500 mb-2">
                        <span>By {patch.brand}</span>
                      </div>
                    )}
                    {patch.rating && (
                      <div className="flex items-center text-xs mb-3">
                        <div className="flex items-center mr-2">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          <span>{patch.rating}</span>
                        </div>
                        <span className="text-zinc-500">({patch.reviews} reviews)</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <div>
                        {patch.limited && patch.stock !== undefined && (
                          <div className="flex items-center text-xs text-zinc-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {patch.stock > 0 ? (
                              <span>{patch.stock} remaining</span>
                            ) : (
                              <span className="text-red-500">Sold out</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <div className="mr-3">
                          <div className="text-sm font-bold">
                            {patch.price} {patch.currency}
                          </div>
                        </div>
                        {patch.available ? (
                          <Button size="sm" className="bg-primary text-black hover:bg-primary/90">
                            <ShoppingBag className="h-3 w-3 mr-1" />
                            {patch.exclusive ? "Claim" : "Buy"}
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            <Lock className="h-3 w-3 mr-1" />
                            {patch.exclusive ? "Locked" : "Sold Out"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
