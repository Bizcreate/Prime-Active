"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { Search, Filter, Plus, SkullIcon as Skateboard, Waves, Bike, MapPin, Users, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { CheckInModal } from "@/components/check-in-modal"
import { useRouter } from "next/navigation"

export default function MapPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [showSpotDetails, setShowSpotDetails] = useState<string | null>(null)
  const [checkInLocation, setCheckInLocation] = useState<{ name: string; lat: number; lng: number } | null>(null)

  // Mock spots data
  const spots = [
    {
      id: "spot1",
      name: "Downtown Skatepark",
      type: "skate",
      distance: "1.2km",
      activeUsers: 4,
      rating: 4.5,
      reviews: 28,
      description: "A popular skatepark with various ramps, rails, and obstacles. Great for all skill levels.",
      amenities: ["Lighting", "Water Fountain", "Restrooms"],
      photos: ["/urban-skate-session.png", "/urban-playground.png"],
      lat: 34.0522,
      lng: -118.2437,
    },
    {
      id: "spot2",
      name: "Sunset Beach",
      type: "surf",
      distance: "3.5km",
      activeUsers: 8,
      rating: 4.8,
      reviews: 42,
      description: "Beautiful beach with consistent waves. Perfect for surfing from beginner to advanced.",
      amenities: ["Parking", "Restrooms", "Showers"],
      photos: ["/sunny-seashore.png", "/tropical-getaway.png"],
      lat: 33.6189,
      lng: -117.9298,
    },
    {
      id: "spot3",
      name: "Mountain Trail",
      type: "bike",
      distance: "5.8km",
      activeUsers: 2,
      rating: 4.2,
      reviews: 15,
      description: "Scenic mountain trail with varying difficulty levels. Great for mountain biking.",
      amenities: ["Parking", "Trail Maps"],
      photos: [
        "/placeholder.svg?height=100&width=100&query=mountain+trail+1",
        "/placeholder.svg?height=100&width=100&query=mountain+trail+2",
      ],
      lat: 34.1341,
      lng: -118.2882,
    },
  ]

  const handleSpotClick = (spotId: string) => {
    setShowSpotDetails(spotId === showSpotDetails ? null : spotId)
  }

  const getSpotIcon = (type: string) => {
    switch (type) {
      case "skate":
        return <Skateboard className="h-5 w-5 text-primary" />
      case "surf":
        return <Waves className="h-5 w-5 text-cyan-500" />
      case "bike":
        return <Bike className="h-5 w-5 text-green-500" />
      default:
        return <MapPin className="h-5 w-5 text-primary" />
    }
  }

  const handleCheckIn = (spotId: string) => {
    const spot = spots.find((s) => s.id === spotId)
    if (spot) {
      setCheckInLocation({ name: spot.name, lat: spot.lat, lng: spot.lng })
    }
  }

  const handleCheckInSubmit = (data: { content: string; photo: string | null }) => {
    // In a real app, this would submit the check-in to an API
    alert("Check-in posted successfully!")
    setCheckInLocation(null)
    router.push("/social")
  }

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Explore</h1>
          <Button variant="ghost" size="icon">
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input placeholder="Search locations..." className="pl-9 bg-zinc-900 border-zinc-800" />
        </div>

        {checkInLocation ? (
          <CheckInModal
            location={checkInLocation}
            onClose={() => setCheckInLocation(null)}
            onSubmit={handleCheckInSubmit}
          />
        ) : (
          <>
            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
                  All
                </TabsTrigger>
                <TabsTrigger value="skate" onClick={() => setActiveTab("skate")}>
                  Skate
                </TabsTrigger>
                <TabsTrigger value="surf" onClick={() => setActiveTab("surf")}>
                  Surf
                </TabsTrigger>
                <TabsTrigger value="bike" onClick={() => setActiveTab("bike")}>
                  Bike
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="h-[calc(100vh-280px)] w-full rounded-lg overflow-hidden map-container relative mb-6">
              {/* Map markers */}
              <div className="absolute top-1/4 left-1/4">
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-primary/30 animate-pulse"></div>
                </div>
              </div>

              <div className="absolute top-1/3 left-2/3">
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-blue-500/30 animate-pulse"></div>
                </div>
              </div>

              <div className="absolute top-2/3 left-1/5">
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-cyan-500"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-cyan-500/30 animate-pulse"></div>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2">
                <div className="relative">
                  <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-red-500/30 animate-pulse"></div>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-black/70 p-3 rounded-lg">
                <div className="text-xs text-white font-medium mb-2">Map Legend</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Skateparks</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span>Ski/Snow Areas</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
                    <span>Surf Spots</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span>Your Location</span>
                  </div>
                </div>
              </div>

              {/* Floating action buttons */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <Button className="rounded-full h-12 w-12 shadow-lg">
                  <Plus className="h-5 w-5" />
                </Button>
                <Link href="/map/add-spot">
                  <Button variant="outline" className="rounded-full h-12 w-12 shadow-lg bg-black/50">
                    <MapPin className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-3">Nearby Spots</h2>
              <div className="space-y-3">
                {spots
                  .filter((spot) => activeTab === "all" || spot.type === activeTab)
                  .map((spot) => (
                    <div key={spot.id} className="bg-zinc-900 rounded-lg overflow-hidden">
                      <div className="p-3 flex items-center">
                        <div className="bg-zinc-800 p-2 rounded-full mr-3">{getSpotIcon(spot.type)}</div>
                        <div className="flex-1">
                          <h3 className="font-medium">{spot.name}</h3>
                          <p className="text-xs text-zinc-400">
                            {spot.distance} away • {spot.activeUsers} riders active
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex items-center text-xs text-zinc-400">
                            <Star className="h-3 w-3 text-primary mr-1" />
                            {spot.rating} ({spot.reviews})
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleSpotClick(spot.id)}>
                            {showSpotDetails === spot.id ? "Hide" : "Details"}
                          </Button>
                        </div>
                      </div>

                      {showSpotDetails === spot.id && (
                        <div className="px-3 pb-3 border-t border-zinc-800 pt-3 mt-1">
                          <p className="text-sm text-zinc-300 mb-3">{spot.description}</p>

                          <div className="mb-3">
                            <p className="text-xs text-zinc-400 mb-1">Amenities</p>
                            <div className="flex flex-wrap gap-2">
                              {spot.amenities.map((amenity) => (
                                <span key={amenity} className="text-xs bg-zinc-800 px-2 py-1 rounded-full">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mb-3">
                            <p className="text-xs text-zinc-400 mb-1">Photos</p>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                              {spot.photos.map((photo, index) => (
                                <img
                                  key={index}
                                  src={photo || "/placeholder.svg"}
                                  alt={`${spot.name} photo ${index + 1}`}
                                  className="h-16 w-24 object-cover rounded-md"
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              Navigate
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 flex items-center gap-1"
                              onClick={() => handleCheckIn(spot.id)}
                            >
                              <Users className="h-4 w-4" />
                              Check In
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>

      <TabBar activeTab="map" />
    </main>
  )
}
