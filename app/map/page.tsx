"use client"

import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { Star, MapPin, Plus, Search, Filter } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function MapPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const categories = [
    { id: "all", label: "All" },
    { id: "skate", label: "Skate" },
    { id: "surf", label: "Surf" },
    { id: "bike", label: "Bike" },
    { id: "snow", label: "Snow" },
  ]

  const nearbySpots = [
    {
      id: 1,
      name: "Downtown Skatepark",
      type: "skatepark",
      distance: "1.2km away",
      riders: 4,
      rating: 4.5,
      reviews: 28,
      icon: "🛹",
    },
    {
      id: 2,
      name: "Sunset Beach",
      type: "surf",
      distance: "3.5km away",
      riders: 8,
      rating: 4.8,
      reviews: 42,
      icon: "🌊",
    },
    {
      id: 3,
      name: "Mountain Trail",
      type: "trail",
      distance: "5.8km away",
      riders: 2,
      rating: 4.2,
      reviews: 15,
      icon: "🚵",
    },
    {
      id: 4,
      name: "Prime Mates Surf Spot",
      type: "surf",
      distance: "2.1km away",
      riders: 12,
      rating: 5.0,
      reviews: 56,
      icon: "🌊",
    },
    {
      id: 5,
      name: "Shaka Point",
      type: "skatepark",
      distance: "0.8km away",
      riders: 7,
      rating: 4.9,
      reviews: 38,
      icon: "🛹",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="relative">
        {/* Header */}
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Explore</h1>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Filter className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search locations..."
              className="w-full bg-zinc-800 rounded-full py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
          </div>

          {/* Category Filters */}
          <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`rounded-full px-6 ${
                  activeCategory === category.id ? "bg-white text-black" : "bg-zinc-800 text-white border-zinc-700"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-[40vh] bg-zinc-900 overflow-hidden">
          {/* Grid pattern for map */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          {/* Sample markers */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-6 w-6 rounded-full bg-red-500"></div>
          </div>
          <div className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-6 w-6 rounded-full bg-[#ffc72d]"></div>
          </div>
          <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-6 w-6 rounded-full bg-blue-400"></div>
          </div>
          <div className="absolute bottom-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-6 w-6 rounded-full bg-green-500"></div>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-black/80 p-3 rounded-lg">
            <h3 className="text-white text-sm font-bold mb-2">Map Legend</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#ffc72d]"></div>
                <span className="text-xs text-white">Skateparks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-white">Trails</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-400"></div>
                <span className="text-xs text-white">Surf Spots</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-white">Your Location</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#ffc72d]"></div>
                <span className="text-xs text-white">Prime Mates Spots</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Link href="/map/add-spot">
              <Button className="bg-[#ffc72d] hover:bg-[#ffc72d]/90 text-black font-medium px-4 py-2">
                <Plus className="h-5 w-5 mr-2" />
                Add Location
              </Button>
            </Link>
            <Button size="icon" className="h-12 w-12 rounded-full bg-zinc-800 hover:bg-zinc-700">
              <MapPin className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Nearby Spots */}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Nearby Spots</h2>
          <div className="space-y-3">
            {nearbySpots.map((spot) => (
              <div key={spot.id} className="bg-zinc-900 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-xl">
                    {spot.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{spot.name}</h3>
                    <p className="text-xs text-zinc-400">
                      {spot.distance} • {spot.riders} riders active
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-[#ffc72d] fill-[#ffc72d]" />
                    <span className="text-sm ml-1">
                      {spot.rating} ({spot.reviews})
                    </span>
                  </div>
                  <Button variant="ghost" className="h-8">
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TabBar activeTab="map" />
    </div>
  )
}
