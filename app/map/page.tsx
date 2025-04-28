"use client"

import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { Star, MapPin, Plus, Search, Filter, Users, CheckIcon as CheckIn, Trophy } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AppShell } from "@/components/app-shell"

// Mock data for active users at locations
const activeUsers = [
  {
    id: 1,
    name: "Alex Rider",
    avatar: "/mystical-forest-spirit.png",
    level: 12,
    activity: "skateboarding",
  },
  {
    id: 2,
    name: "Jamie Snow",
    avatar: "/diverse-woman-portrait.png",
    level: 8,
    activity: "snowboarding",
  },
  {
    id: 3,
    name: "Wave Hunter",
    avatar: "/wave-rider-profile.png",
    level: 15,
    activity: "surfing",
  },
]

export default function MapPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedSpot, setSelectedSpot] = useState<any>(null)
  const [showCheckIn, setShowCheckIn] = useState(false)

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

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
      position: { top: "30%", left: "40%" },
      activeUsers: [activeUsers[0]],
      challenges: 2,
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
      position: { top: "50%", left: "70%" },
      activeUsers: [activeUsers[2]],
      challenges: 1,
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
      position: { top: "70%", left: "30%" },
      activeUsers: [],
      challenges: 0,
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
      position: { top: "20%", left: "60%" },
      activeUsers: [activeUsers[2]],
      challenges: 3,
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
      position: { top: "60%", left: "20%" },
      activeUsers: [activeUsers[0], activeUsers[1]],
      challenges: 2,
    },
  ]

  const handleSpotClick = (spot: any) => {
    setSelectedSpot(spot)
  }

  const handleCloseSpotDetails = () => {
    setSelectedSpot(null)
    setShowCheckIn(false)
  }

  const handleCheckIn = () => {
    setShowCheckIn(true)
  }

  const filteredSpots =
    activeCategory === "all"
      ? nearbySpots
      : nearbySpots.filter((spot) => {
          if (activeCategory === "skate") return spot.type === "skatepark"
          if (activeCategory === "surf") return spot.type === "surf"
          if (activeCategory === "bike") return spot.type === "trail"
          return true
        })

  return (
    <AppShell>
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
          {/* Map Background */}
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffc72d]"></div>
            </div>
          ) : (
            <>
              {/* Grid pattern for map */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>

              {/* User location */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="h-6 w-6 rounded-full bg-red-500 animate-pulse"></div>
              </div>

              {/* Location markers */}
              {filteredSpots.map((spot) => (
                <div
                  key={spot.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110"
                  style={{ top: spot.position.top, left: spot.position.left }}
                  onClick={() => handleSpotClick(spot)}
                >
                  <div
                    className={`h-6 w-6 rounded-full ${
                      spot.type === "skatepark" ? "bg-[#ffc72d]" : spot.type === "surf" ? "bg-blue-400" : "bg-green-500"
                    }`}
                  ></div>
                  {spot.activeUsers.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {spot.activeUsers.length}
                    </div>
                  )}
                  {spot.challenges > 0 && (
                    <div className="absolute -bottom-1 -right-1 bg-[#ffc72d] text-black text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {spot.challenges}
                    </div>
                  )}
                </div>
              ))}

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
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 flex items-center justify-center text-[8px]">1</div>
                    <span className="text-xs text-white">Active Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#ffc72d]"></div>
                    <div className="h-3 w-3 flex items-center justify-center text-[8px]">1</div>
                    <span className="text-xs text-white">Active Challenges</span>
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
            </>
          )}
        </div>

        {/* Spot Details Modal */}
        {selectedSpot && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-xl w-full max-w-md overflow-hidden">
              <div className="relative h-40 bg-gradient-to-r from-zinc-800 to-zinc-700">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full"
                  onClick={handleCloseSpotDetails}
                >
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
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Button>
                <div className="absolute bottom-4 left-4">
                  <h2 className="text-xl font-bold">{selectedSpot.name}</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-[#ffc72d] fill-[#ffc72d]" />
                      <span className="text-sm ml-1">
                        {selectedSpot.rating} ({selectedSpot.reviews})
                      </span>
                    </div>
                    <span className="text-sm">•</span>
                    <span className="text-sm">{selectedSpot.distance}</span>
                  </div>
                </div>
              </div>

              {!showCheckIn ? (
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Active Users</h3>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {selectedSpot.riders} active
                    </Badge>
                  </div>

                  {selectedSpot.activeUsers.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {selectedSpot.activeUsers.map((user: any) => (
                        <div key={user.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-zinc-400 capitalize">{user.activity}</p>
                            </div>
                          </div>
                          <Badge className="bg-[#ffc72d] text-black">Lvl {user.level}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400 mb-4">No users currently active at this location.</p>
                  )}

                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Active Challenges</h3>
                    {selectedSpot.challenges > 0 ? (
                      <div className="space-y-2">
                        {Array.from({ length: selectedSpot.challenges }).map((_, i) => (
                          <div key={i} className="bg-zinc-800 rounded-lg p-3 flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-[#ffc72d]" />
                                <p className="font-medium text-sm">
                                  {["Trick Challenge", "Speed Run", "Style Contest"][i % 3]}
                                </p>
                              </div>
                              <p className="text-xs text-zinc-400">
                                {["2 participants", "4 participants", "1 participant"][i % 3]}
                              </p>
                            </div>
                            <Button size="sm" className="bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90">
                              Join
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-400">No active challenges at this location.</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Trophy className="h-4 w-4 mr-2" />
                      Create Challenge
                    </Button>
                    <Button className="flex-1 bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90" onClick={handleCheckIn}>
                      <CheckIn className="h-4 w-4 mr-2" />
                      Check In
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <h3 className="font-semibold mb-4">Check In at {selectedSpot.name}</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-zinc-400 mb-1 block">Activity Type</label>
                      <select className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-sm">
                        <option value="skateboarding">Skateboarding</option>
                        <option value="surfing">Surfing</option>
                        <option value="snowboarding">Snowboarding</option>
                        <option value="biking">Biking</option>
                        <option value="running">Running</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-zinc-400 mb-1 block">Status Update (Optional)</label>
                      <textarea
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-sm resize-none h-20"
                        placeholder="Share what you're up to..."
                      ></textarea>
                    </div>

                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="startActivity" className="rounded bg-zinc-800 border-zinc-700" />
                      <label htmlFor="startActivity" className="text-sm">
                        Start activity tracking
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="shareLocation" className="rounded bg-zinc-800 border-zinc-700" />
                      <label htmlFor="shareLocation" className="text-sm">
                        Share my location with other users
                      </label>
                    </div>

                    <div className="bg-zinc-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Check-in Rewards</p>
                        <Badge className="bg-[#ffc72d] text-black">+25 XP</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-zinc-400">First check-in of the day</p>
                        <p className="text-xs text-[#ffc72d]">+10 $PRIME</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setShowCheckIn(false)}>
                        Cancel
                      </Button>
                      <Button className="flex-1 bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90">Check In</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nearby Spots */}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Nearby Spots</h2>
          <div className="space-y-3">
            {filteredSpots.map((spot) => (
              <div
                key={spot.id}
                className="bg-zinc-900 rounded-xl p-4 flex items-center justify-between cursor-pointer"
                onClick={() => handleSpotClick(spot)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-xl">
                    {spot.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{spot.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-zinc-400">{spot.distance}</p>
                      <span className="text-xs text-zinc-500">•</span>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 text-zinc-400 mr-1" />
                        <span className="text-xs text-zinc-400">{spot.riders}</span>
                      </div>
                      {spot.challenges > 0 && (
                        <>
                          <span className="text-xs text-zinc-500">•</span>
                          <div className="flex items-center">
                            <Trophy className="h-3 w-3 text-[#ffc72d] mr-1" />
                            <span className="text-xs text-[#ffc72d]">{spot.challenges}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-[#ffc72d] fill-[#ffc72d]" />
                    <span className="text-sm ml-1">{spot.rating}</span>
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
    </AppShell>
  )
}
