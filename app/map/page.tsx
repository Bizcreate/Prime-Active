"use client"

import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { Star, MapPin, Plus, Search, Filter, Users, CheckIcon as CheckIn, Trophy, Play } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AppShell } from "@/components/app-shell"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useMapToken } from "@/components/map-token-provider"
import { MapTokenProvider } from "@/components/map-token-provider"

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

// Define the Mapbox map instance type
declare global {
  interface Window {
    mapboxgl: any
    MapboxDirections: any
  }
}

function MapPageContent() {
  const { toast } = useToast()
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedSpot, setSelectedSpot] = useState<any>(null)
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const router = useRouter()
  const [isPreviewEnvironment, setIsPreviewEnvironment] = useState(false)

  // Get map token from context
  const { token, isLoading: isLoadingToken, error: tokenError } = useMapToken()

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
      coordinates: [-122.4194, 37.7749], // San Francisco coordinates
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
      coordinates: [-122.4284, 37.7694], // Slightly offset from SF
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
      coordinates: [-122.4104, 37.7829], // Another offset from SF
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
      coordinates: [-122.4314, 37.7719], // Another offset from SF
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
      coordinates: [-122.4094, 37.7699], // Another offset from SF
    },
  ]

  // Check if we're in a preview environment
  useEffect(() => {
    const checkPreviewEnvironment = () => {
      // Check if we're in an iframe or a Vercel preview environment
      const isInIframe = window !== window.parent
      const isVercelPreview = window.location.hostname.includes("vercel.app")
      const isPreview = isInIframe || isVercelPreview

      setIsPreviewEnvironment(isPreview)

      if (isPreview) {
        console.log("Running in preview environment - using mock location data")
      }
    }

    checkPreviewEnvironment()
  }, [])

  // Add this function before the useEffect hooks
  const isGeolocationAvailable = () => {
    if (isPreviewEnvironment) return false
    return "geolocation" in navigator
  }

  // Load Mapbox scripts
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return

    // Check if Mapbox is already loaded
    if (window.mapboxgl) {
      setMapboxLoaded(true)
      return
    }

    // Load Mapbox GL JS
    const mapboxScript = document.createElement("script")
    mapboxScript.src = "https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js"
    mapboxScript.async = true

    // Load Mapbox CSS
    const mapboxCss = document.createElement("link")
    mapboxCss.rel = "stylesheet"
    mapboxCss.href = "https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css"

    // Load Mapbox Directions plugin
    const directionsScript = document.createElement("script")
    directionsScript.src =
      "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.1/mapbox-gl-directions.js"
    directionsScript.async = true

    // Load Directions CSS
    const directionsCss = document.createElement("link")
    directionsCss.rel = "stylesheet"
    directionsCss.href =
      "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.1/mapbox-gl-directions.css"

    // Append to document head
    document.head.appendChild(mapboxCss)
    document.head.appendChild(directionsCss)
    document.head.appendChild(mapboxScript)
    document.head.appendChild(directionsScript)

    // Set up onload handler
    mapboxScript.onload = () => {
      if (directionsScript.loaded) {
        setMapboxLoaded(true)
      }
    }

    directionsScript.onload = () => {
      directionsScript.loaded = true
      if (window.mapboxgl) {
        setMapboxLoaded(true)
      }
    }

    // Clean up
    return () => {
      document.head.removeChild(mapboxScript)
      document.head.removeChild(mapboxCss)
      document.head.removeChild(directionsScript)
      document.head.removeChild(directionsCss)
    }
  }, [])

  // Initialize map when Mapbox is loaded and token is available
  useEffect(() => {
    if (!mapboxLoaded || !mapContainerRef.current || !token) return

    try {
      // Set Mapbox access token
      window.mapboxgl.accessToken = token

      // Create map instance
      const map = new window.mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-122.4194, 37.7749], // San Francisco
        zoom: 13,
      })

      // Save map instance to ref
      mapInstanceRef.current = map

      // Add navigation controls
      map.addControl(new window.mapboxgl.NavigationControl(), "bottom-right")

      // Only add geolocate control if not in preview environment
      if (!isPreviewEnvironment) {
        // Add geolocate control with error handling
        const geolocateControl = new window.mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          },
          trackUserLocation: true,
          showUserHeading: true,
          showAccuracyCircle: true,
        })

        // Add error handling for the geolocate control
        geolocateControl.on("error", (e) => {
          console.error("Geolocate control error:", e.error)
          toast({
            title: "Location Error",
            description: "Unable to access your location. Using default location.",
            variant: "default",
          })
        })

        map.addControl(geolocateControl, "bottom-right")
      }

      // Add directions control
      const directions = new window.MapboxDirections({
        accessToken: token,
        unit: "metric",
        profile: "mapbox/walking",
        controls: {
          inputs: false,
          instructions: false,
        },
      })

      map.addControl(directions, "top-right")

      // When map loads
      map.on("load", () => {
        setMapLoaded(true)

        // Set default location (San Francisco)
        const defaultLocation = { lat: 37.7749, lng: -122.4194 }
        setUserLocation(defaultLocation)

        // Try to get user location if not in preview environment
        if (!isPreviewEnvironment && navigator.geolocation) {
          try {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords
                setUserLocation({ lat: latitude, lng: longitude })
                map.flyTo({
                  center: [longitude, latitude],
                  zoom: 14,
                  essential: true,
                })

                // Add user marker
                new window.mapboxgl.Marker({
                  color: "#ff0000",
                })
                  .setLngLat([longitude, latitude])
                  .addTo(map)
              },
              (error) => {
                console.error("Error getting location:", error)
                // Use default location and show toast notification

                // Add default marker
                new window.mapboxgl.Marker({
                  color: "#ff0000",
                })
                  .setLngLat([defaultLocation.lng, defaultLocation.lat])
                  .addTo(map)

                toast({
                  title: "Using default location",
                  description: "We couldn't access your location. Using San Francisco as default.",
                  variant: "default",
                })
              },
              {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
              },
            )
          } catch (geoError) {
            console.error("Geolocation error:", geoError)
            // Use default location

            // Add default marker
            new window.mapboxgl.Marker({
              color: "#ff0000",
            })
              .setLngLat([defaultLocation.lng, defaultLocation.lat])
              .addTo(map)
          }
        } else {
          // In preview or geolocation not available - use default location
          new window.mapboxgl.Marker({
            color: "#ff0000",
          })
            .setLngLat([defaultLocation.lng, defaultLocation.lat])
            .addTo(map)

          if (isPreviewEnvironment) {
            console.log("Using mock location for preview environment")
          } else {
            toast({
              title: "Location not available",
              description: "Using default location for demonstration.",
              variant: "default",
            })
          }
        }

        // Add spot markers
        nearbySpots.forEach((spot) => {
          // Create custom marker element
          const el = document.createElement("div")
          el.className = "spot-marker"
          el.style.width = "30px"
          el.style.height = "30px"
          el.style.borderRadius = "50%"
          el.style.display = "flex"
          el.style.alignItems = "center"
          el.style.justifyContent = "center"
          el.style.cursor = "pointer"

          // Set background color based on type
          if (spot.type === "skatepark") {
            el.style.backgroundColor = "#ffc72d"
          } else if (spot.type === "surf") {
            el.style.backgroundColor = "#3b82f6"
          } else {
            el.style.backgroundColor = "#22c55e"
          }

          // Add badge for active users if any
          if (spot.activeUsers.length > 0) {
            const badge = document.createElement("div")
            badge.className = "user-badge"
            badge.textContent = spot.activeUsers.length.toString()
            badge.style.position = "absolute"
            badge.style.top = "-5px"
            badge.style.right = "-5px"
            badge.style.backgroundColor = "#ef4444"
            badge.style.color = "white"
            badge.style.borderRadius = "50%"
            badge.style.width = "16px"
            badge.style.height = "16px"
            badge.style.fontSize = "10px"
            badge.style.display = "flex"
            badge.style.alignItems = "center"
            badge.style.justifyContent = "center"
            el.appendChild(badge)
          }

          // Add badge for challenges if any
          if (spot.challenges > 0) {
            const badge = document.createElement("div")
            badge.className = "challenge-badge"
            badge.textContent = spot.challenges.toString()
            badge.style.position = "absolute"
            badge.style.bottom = "-5px"
            badge.style.right = "-5px"
            badge.style.backgroundColor = "#ffc72d"
            badge.style.color = "black"
            badge.style.borderRadius = "50%"
            badge.style.width = "16px"
            badge.style.height = "16px"
            badge.style.fontSize = "10px"
            badge.style.display = "flex"
            badge.style.alignItems = "center"
            badge.style.justifyContent = "center"
            el.appendChild(badge)
          }

          // Create marker
          const marker = new window.mapboxgl.Marker(el).setLngLat(spot.coordinates).addTo(map)

          // Add click handler
          marker.getElement().addEventListener("click", () => {
            handleSpotClick(spot)

            // Fly to spot
            map.flyTo({
              center: spot.coordinates,
              zoom: 15,
              essential: true,
            })
          })
        })
      })

      // Clean up on unmount
      return () => {
        map.remove()
      }
    } catch (error) {
      console.error("Error initializing map:", error)
      toast({
        title: "Map Error",
        description: "Failed to initialize map. Please try again.",
        variant: "destructive",
      })
    }
  }, [mapboxLoaded, token, toast, isPreviewEnvironment])

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

  const handleGetDirections = () => {
    if (!mapInstanceRef.current || !selectedSpot || !userLocation) return

    try {
      // Get directions control
      const directionsControl = mapInstanceRef.current._controls.find(
        (control: any) => control instanceof window.MapboxDirections,
      )

      if (directionsControl) {
        // Set origin and destination
        directionsControl.setOrigin([userLocation.lng, userLocation.lat])
        directionsControl.setDestination(selectedSpot.coordinates)

        // Close spot details
        handleCloseSpotDetails()

        toast({
          title: "Directions Set",
          description: `Directions to ${selectedSpot.name} have been set.`,
        })
      }
    } catch (error) {
      console.error("Error getting directions:", error)
      toast({
        title: "Directions Error",
        description: "Failed to get directions. Please try again.",
        variant: "destructive",
      })
    }
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

  if (isLoadingToken) {
    return <div className="flex items-center justify-center h-64">Loading map...</div>
  }

  if (tokenError || !token) {
    return <div className="flex items-center justify-center h-64">Error loading map</div>
  }

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
          {/* Mapbox container */}
          <div ref={mapContainerRef} className="absolute inset-0" style={{ width: "100%", height: "100%" }} />

          {(!mapLoaded || !token) && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 bg-opacity-80 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffc72d]"></div>
            </div>
          )}

          {isPreviewEnvironment && (
            <div className="absolute top-4 left-4 right-4 bg-black/70 rounded-lg p-3 z-10">
              <p className="text-sm text-center text-amber-400">
                ⚠️ Preview Mode: Using mock location data. Geolocation is disabled in preview environments.
              </p>
            </div>
          )}

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-black/80 p-3 rounded-lg z-20">
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
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
            <Link href="/map/add-spot">
              <Button className="bg-[#ffc72d] hover:bg-[#ffc72d]/90 text-black font-medium px-4 py-2">
                <Plus className="h-5 w-5 mr-2" />
                Add Location
              </Button>
            </Link>
            <Button
              className="bg-[#ffc72d] hover:bg-[#ffc72d]/90 text-black font-medium px-4 py-2"
              onClick={() => router.push("/activity-tracking")}
            >
              <Play className="h-5 w-5 mr-2" />
              Start Activity
            </Button>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-zinc-800 hover:bg-zinc-700"
              onClick={() => {
                if (mapInstanceRef.current) {
                  if (userLocation) {
                    mapInstanceRef.current.flyTo({
                      center: [userLocation.lng, userLocation.lat],
                      zoom: 14,
                      essential: true,
                    })
                  } else if (isGeolocationAvailable()) {
                    // Try to get location again
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const { latitude, longitude } = position.coords
                        setUserLocation({ lat: latitude, lng: longitude })
                        mapInstanceRef.current.flyTo({
                          center: [longitude, latitude],
                          zoom: 14,
                          essential: true,
                        })
                      },
                      (error) => {
                        console.error("Error getting location:", error)
                        toast({
                          title: "Location access denied",
                          description: "Enable location permissions in your browser settings.",
                          variant: "default",
                        })
                      },
                    )
                  } else {
                    toast({
                      title: "Location not available",
                      description: "Your browser doesn't support geolocation.",
                      variant: "default",
                    })
                  }
                }
              }}
            >
              <MapPin className="h-6 w-6" />
            </Button>
          </div>
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
                    <Button variant="outline" className="flex-1" onClick={handleGetDirections}>
                      <MapPin className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
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

// Export a wrapper component that includes the MapTokenProvider
export default function MapPage() {
  return (
    <MapTokenProvider>
      <MapPageContent />
    </MapTokenProvider>
  )
}
