"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useActivityTracking, type ActivitySession, type Location } from "@/services/activity-tracking"
import { useToast } from "@/hooks/use-toast"
import { Play, Pause, StopCircle, MapPin } from "lucide-react"
import { useMapToken } from "./map-token-provider"

interface ActivityMapTrackerProps {
  activityType?: string
  onComplete?: (activity: ActivitySession) => void
}

export function ActivityMapTracker({ activityType = "walking", onComplete }: ActivityMapTrackerProps) {
  const { toast } = useToast()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const routeSourceRef = useRef<string | null>(null)
  const userMarkerRef = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isPreviewEnvironment, setIsPreviewEnvironment] = useState(false)

  // Get map token from context
  const { token, isLoading: isLoadingToken, error: tokenError } = useMapToken()

  // Get activity tracking hooks
  const {
    isTracking,
    currentActivity,
    stats,
    locations,
    startActivity,
    stopActivity,
    requestLocationPermission,
    permissionStatus,
  } = useActivityTracking()

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

  // Initialize map when component mounts and token is available
  useEffect(() => {
    if (!mapContainerRef.current || !window.mapboxgl || !token) return

    // Initialize map
    window.mapboxgl.accessToken = token

    const map = new window.mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-122.4194, 37.7749], // Default center (San Francisco)
      zoom: 14,
    })

    mapInstanceRef.current = map

    // Add navigation controls
    map.addControl(new window.mapboxgl.NavigationControl(), "bottom-right")

    // When map loads
    map.on("load", () => {
      setMapLoaded(true)

      // Add empty route line source
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [],
          },
        },
      })
      routeSourceRef.current = "route"

      // Add route line layer
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ffc72d",
          "line-width": 4,
          "line-opacity": 0.8,
        },
      })

      // Set default location (San Francisco)
      const defaultLocation = { latitude: 37.7749, longitude: -122.4194 }

      // Add user marker with default location
      const el = document.createElement("div")
      el.className = "user-location-marker"
      el.style.width = "20px"
      el.style.height = "20px"
      el.style.borderRadius = "50%"
      el.style.backgroundColor = "#ff0000"
      el.style.border = "2px solid white"
      el.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.1)"

      userMarkerRef.current = new window.mapboxgl.Marker(el)
        .setLngLat([defaultLocation.longitude, defaultLocation.latitude])
        .addTo(map)

      // Try to get user location if not in preview environment
      if (!isPreviewEnvironment && navigator.geolocation) {
        try {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords
              map.flyTo({
                center: [longitude, latitude],
                zoom: 15,
                essential: true,
              })

              // Update user marker position
              if (userMarkerRef.current) {
                userMarkerRef.current.setLngLat([longitude, latitude])
              }
            },
            (error) => {
              console.error("Error getting location:", error)
              // Keep default location
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            },
          )
        } catch (error) {
          console.error("Geolocation error:", error)
          // Keep default location
        }
      } else if (isPreviewEnvironment) {
        // In preview - show notification
        console.log("Using mock location for preview environment")
      }
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }
    }
  }, [token, isPreviewEnvironment])

  // Update route on map when locations change
  useEffect(() => {
    if (!mapInstanceRef.current || !routeSourceRef.current || !mapLoaded || locations.length === 0) return

    const map = mapInstanceRef.current
    const coordinates = locations.map((loc: Location) => [loc.longitude, loc.latitude])

    // Update the route line
    map.getSource(routeSourceRef.current).setData({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates,
      },
    })

    // Update user marker position
    if (userMarkerRef.current && locations.length > 0) {
      const lastLocation = locations[locations.length - 1]
      userMarkerRef.current.setLngLat([lastLocation.longitude, lastLocation.latitude])
    }

    // Fit map to route bounds if we have multiple points
    if (coordinates.length > 1 && isTracking) {
      const bounds = coordinates.reduce(
        (bounds, coord) => bounds.extend(coord),
        new window.mapboxgl.LngLatBounds(coordinates[0], coordinates[0]),
      )

      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 16,
        duration: 500,
      })
    }
  }, [locations, mapLoaded, isTracking])

  // Handle start activity
  const handleStartActivity = async () => {
    if (isPreviewEnvironment) {
      toast({
        title: "Preview Mode",
        description: "Activity tracking is simulated in preview mode.",
      })
      // Simulate starting activity with mock data
      return
    }

    if (permissionStatus !== "granted" && permissionStatus !== "mock") {
      const granted = await requestLocationPermission()
      if (!granted) {
        toast({
          title: "Permission Required",
          description: "Location permission is needed to track your activity.",
          variant: "destructive",
        })
        return
      }
    }

    const started = await startActivity(activityType as any)
    if (started) {
      toast({
        title: "Activity Started",
        description: `Your ${activityType} activity is now being tracked.`,
      })
    } else {
      toast({
        title: "Failed to Start",
        description: "Could not start activity tracking. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle stop activity
  const handleStopActivity = async () => {
    if (isPreviewEnvironment) {
      toast({
        title: "Activity Completed",
        description: "Activity tracking simulation ended.",
      })
      return
    }

    const activity = await stopActivity()
    if (activity) {
      toast({
        title: "Activity Completed",
        description: `You completed ${activity.distance.toFixed(2)}km in ${formatDuration(
          activity.startTime,
          activity.endTime || Date.now(),
        )}.`,
      })

      if (onComplete) {
        onComplete(activity)
      }
    }
  }

  // Format duration helper
  const formatDuration = (start: number, end: number) => {
    const durationSeconds = Math.floor((end - start) / 1000)
    const minutes = Math.floor(durationSeconds / 60)
    const seconds = durationSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (isLoadingToken) {
    return <div className="flex items-center justify-center h-64">Loading map...</div>
  }

  if (tokenError || !token) {
    return <div className="flex items-center justify-center h-64">Error loading map</div>
  }

  return (
    <div className="flex flex-col h-full">
      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-[40vh] bg-zinc-900 relative" style={{ minHeight: "300px" }}>
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

        {/* Activity stats overlay */}
        {isTracking && (
          <div className="absolute top-4 left-4 right-4 bg-black/70 rounded-lg p-3 z-10">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-zinc-400">Distance</p>
                <p className="text-lg font-bold">{stats.distance.toFixed(2)} km</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Duration</p>
                <p className="text-lg font-bold">{formatDuration(currentActivity?.startTime || 0, Date.now())}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Calories</p>
                <p className="text-lg font-bold">{stats.calories}</p>
              </div>
            </div>
          </div>
        )}

        {/* Center on user button */}
        <Button
          size="icon"
          className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-zinc-800 hover:bg-zinc-700 z-10"
          onClick={() => {
            if (mapInstanceRef.current && locations.length > 0) {
              const lastLocation = locations[locations.length - 1]
              mapInstanceRef.current.flyTo({
                center: [lastLocation.longitude, lastLocation.latitude],
                zoom: 16,
                essential: true,
              })
            }
          }}
        >
          <MapPin className="h-5 w-5" />
        </Button>
      </div>

      {/* Activity controls */}
      <div className="p-4 bg-zinc-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold capitalize">{activityType} Activity</h2>
          {isTracking && (
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
              <span className="text-sm">Recording</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-zinc-800 p-3 rounded-lg text-center">
            <p className="text-xs text-zinc-400">Distance</p>
            <p className="text-xl font-bold">{stats.distance.toFixed(2)}</p>
            <p className="text-xs text-zinc-400">km</p>
          </div>
          <div className="bg-zinc-800 p-3 rounded-lg text-center">
            <p className="text-xs text-zinc-400">Duration</p>
            <p className="text-xl font-bold">{formatDuration(currentActivity?.startTime || Date.now(), Date.now())}</p>
            <p className="text-xs text-zinc-400">min:sec</p>
          </div>
          <div className="bg-zinc-800 p-3 rounded-lg text-center">
            <p className="text-xs text-zinc-400">Calories</p>
            <p className="text-xl font-bold">{stats.calories}</p>
            <p className="text-xs text-zinc-400">kcal</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {!isTracking ? (
            <Button
              className="bg-[#ffc72d] hover:bg-[#ffc72d]/90 text-black font-medium px-8 py-6 rounded-full"
              onClick={handleStartActivity}
            >
              <Play className="h-6 w-6 mr-2" />
              Start Activity
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="px-8 py-6 rounded-full"
                onClick={() => {
                  // This would be implemented to pause tracking
                  toast({
                    title: "Feature Coming Soon",
                    description: "Pausing activities will be available in the next update.",
                  })
                }}
              >
                <Pause className="h-6 w-6 mr-2" />
                Pause
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 px-8 py-6 rounded-full" onClick={handleStopActivity}>
                <StopCircle className="h-6 w-6 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
