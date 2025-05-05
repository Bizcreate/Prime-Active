"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { MapPin, Plus, ArrowLeft, Compass, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useMapToken } from "@/components/map-token-provider"
import { MapTokenProvider } from "@/components/map-token-provider"
import { FallbackPage } from "@/components/fallback-page"

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
  const [isLoading, setIsLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

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
    // Check if we're in a preview environment
    const checkPreviewMode = () => {
      // Check if we're in an iframe (common for previews)
      const inIframe = window !== window.parent
      // Check if we're in a Vercel preview environment
      const inVercelPreview = window.location.hostname.includes("vercel.app")

      return inIframe || inVercelPreview
    }

    setIsPreviewMode(checkPreviewMode())

    // Simulate loading the map
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
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

  if (isLoading) {
    return <FallbackPage />
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
          <h1 className="text-xl font-bold">Spot Map</h1>
        </div>

        {isPreviewMode && (
          <div className="bg-amber-900/20 border border-amber-900/30 rounded-lg p-4 mb-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-500 mb-1">Preview Mode</h3>
              <p className="text-sm text-zinc-300">
                Map functionality is limited in preview mode. Geolocation and interactive maps are fully enabled in the
                deployed application.
              </p>
            </div>
          </div>
        )}

        {mapError ? (
          <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-6 text-center">
            <div className="bg-red-900/30 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">Map Error</h3>
            <p className="text-zinc-300 mb-4">{mapError}</p>
            <Button onClick={() => window.location.reload()}>Reload Map</Button>
          </div>
        ) : (
          <div className="relative h-[calc(100vh-200px)] bg-zinc-900 rounded-lg overflow-hidden">
            {/* Placeholder for map */}
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
              <div className="text-center">
                <Compass className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Map Placeholder</h3>
                <p className="text-zinc-400 max-w-xs mx-auto mb-4">
                  {isPreviewMode
                    ? "Interactive map is disabled in preview mode."
                    : "Map will be displayed here in the deployed application."}
                </p>
              </div>
            </div>

            {/* Add spot button */}
            <div className="absolute bottom-6 right-6">
              <Link href="/map/add-spot">
                <Button size="lg" className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90">
                  <Plus className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-bold mb-3">Popular Spots</h2>
          <div className="space-y-3">
            {/* Spot items */}
            {[1, 2, 3].map((spot) => (
              <div key={spot} className="bg-zinc-900 rounded-lg p-4 flex items-center gap-3">
                <div className="bg-zinc-800 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">
                    {spot === 1 ? "Downtown Skatepark" : spot === 2 ? "Malibu Surfrider Beach" : "Mountain High Resort"}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {spot === 1 ? "Skateboarding" : spot === 2 ? "Surfing" : "Snowboarding"} •
                    {spot === 1 ? "2.5 miles away" : spot === 2 ? "12 miles away" : "45 miles away"}
                  </p>
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

// Export a wrapper component that includes the MapTokenProvider
export default function MapPage() {
  return (
    <MapTokenProvider>
      <MapPageContent />
    </MapTokenProvider>
  )
}
