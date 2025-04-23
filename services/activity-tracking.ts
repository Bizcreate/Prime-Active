"use client"

import { useState, useEffect } from "react"

// Activity tracking types
export type ActivityType = "walking" | "running" | "cycling" | "skateboarding" | "surfing" | "snowboarding"

export interface Location {
  latitude: number
  longitude: number
  accuracy?: number
  timestamp: number
}

export interface ActivitySession {
  id: string
  type: ActivityType
  startTime: number
  endTime?: number
  locations: Location[]
  distance: number
  steps?: number
  calories?: number
  isActive: boolean
}

export interface ActivityStats {
  steps: number
  distance: number
  calories: number
  duration: number
}

// Hook for activity tracking
export function useActivityTracking() {
  const [isTracking, setIsTracking] = useState(false)
  const [currentActivity, setCurrentActivity] = useState<ActivitySession | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | "mock" | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [stats, setStats] = useState<ActivityStats>({
    steps: 0,
    distance: 0,
    calories: 0,
    duration: 0,
  })
  const [watchId, setWatchId] = useState<number | null>(null)
  const [debug, setDebug] = useState<string[]>([])

  // Add debug logging
  const addDebugLog = (message: string) => {
    console.log(`[ActivityTracking] ${message}`)
    setDebug((prev) => [...prev, `${new Date().toISOString().split("T")[1].split(".")[0]}: ${message}`])
  }

  // Check for geolocation permissions
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        addDebugLog("Checking geolocation permissions")

        // Check if we're in a preview/iframe environment
        const isPreviewEnvironment = window.location.hostname.includes("vercel") || window.top !== window.self

        if (isPreviewEnvironment) {
          addDebugLog("Detected preview environment - using mock permissions")
          setPermissionStatus("mock")
          return
        }

        // Check if geolocation is available
        if (!navigator.geolocation) {
          setError("Geolocation is not supported by your browser")
          addDebugLog("Geolocation not supported")
          return
        }

        // Check for permissions API
        if (navigator.permissions && navigator.permissions.query) {
          addDebugLog("Using Permissions API")
          try {
            const result = await navigator.permissions.query({ name: "geolocation" as PermissionName })
            setPermissionStatus(result.state)
            addDebugLog(`Permission state: ${result.state}`)

            // Listen for permission changes
            result.addEventListener("change", () => {
              addDebugLog(`Permission state changed to: ${result.state}`)
              setPermissionStatus(result.state)
            })
          } catch (err) {
            addDebugLog(`Permissions API error: ${err}`)
            fallbackPermissionCheck()
          }
        } else {
          addDebugLog("Permissions API not available, using fallback")
          fallbackPermissionCheck()
        }
      } catch (err) {
        console.error("Error checking permissions:", err)
        addDebugLog(`Error checking permissions: ${err}`)
        setError("Failed to check location permissions")
      }
    }

    const fallbackPermissionCheck = () => {
      // Fallback for browsers that don't support permissions API
      addDebugLog("Using getCurrentPosition fallback for permission check")

      // Check if we're in a preview/iframe environment
      const isPreviewEnvironment = window.location.hostname.includes("vercel") || window.top !== window.self

      if (isPreviewEnvironment) {
        addDebugLog("Detected preview environment in fallback - using mock permissions")
        setPermissionStatus("mock")
        return
      }

      navigator.geolocation.getCurrentPosition(
        () => {
          addDebugLog("Permission granted (fallback)")
          setPermissionStatus("granted")
        },
        (err) => {
          if (err.message && err.message.includes("permissions policy")) {
            // Permissions policy error (iframe or non-HTTPS)
            addDebugLog("Location blocked by permissions policy - using mock permissions")
            setPermissionStatus("mock")
          } else {
            addDebugLog(`Permission denied (fallback): ${err.code} - ${err.message}`)
            setPermissionStatus("denied")
          }
        },
        { timeout: 5000, maximumAge: 0, enableHighAccuracy: true },
      )
    }

    checkPermissions()

    // Add proper cleanup
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
      if (mockInterval) {
        clearInterval(mockInterval)
      }
    }
  }, [])

  // Start tracking an activity
  const startActivity = async (type: ActivityType): Promise<boolean> => {
    try {
      // Check if already tracking
      if (isTracking) {
        setError("Already tracking an activity")
        addDebugLog("Already tracking an activity")
        return false
      }

      // Check if we're in a preview/iframe environment
      const isPreviewEnvironment = window.location.hostname.includes("vercel") || window.top !== window.self

      // Check for geolocation support
      if (!navigator.geolocation && !isPreviewEnvironment) {
        setError("Geolocation is not supported by your browser")
        addDebugLog("Geolocation not supported")
        return false
      }

      addDebugLog(`Starting ${type} activity tracking`)

      // Get initial position or use mock position in preview
      try {
        let position: Location

        if (isPreviewEnvironment) {
          // Use mock position for preview
          addDebugLog("Using mock position for preview environment")
          position = {
            latitude: 37.7749, // San Francisco coordinates as example
            longitude: -122.4194,
            accuracy: 10,
            timestamp: Date.now(),
          }
        } else {
          position = await getCurrentPosition()
          addDebugLog(`Got initial position: ${position.latitude}, ${position.longitude}`)
        }

        // Create new activity session
        const newActivity: ActivitySession = {
          id: generateId(),
          type,
          startTime: Date.now(),
          locations: [position],
          distance: 0,
          steps: 0,
          calories: 0,
          isActive: true,
        }

        setCurrentActivity(newActivity)
        setLocations([position])
        setIsTracking(true)

        // Start watching position if not in preview
        if (!isPreviewEnvironment) {
          addDebugLog("Starting position watching")
          const id = navigator.geolocation.watchPosition(handlePositionUpdate, handlePositionError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          })

          setWatchId(id)
          addDebugLog(`Watch ID: ${id}`)
        } else {
          addDebugLog("Using mock position updates for preview environment")
        }

        // Start step counter if available
        startStepCounting()

        // Start mock data updates for testing
        startMockDataUpdates()

        return true
      } catch (posErr) {
        if (isPreviewEnvironment) {
          // In preview, continue with mock data
          addDebugLog("Using mock data for preview despite position error")

          const mockPosition: Location = {
            latitude: 37.7749,
            longitude: -122.4194,
            accuracy: 10,
            timestamp: Date.now(),
          }

          const newActivity: ActivitySession = {
            id: generateId(),
            type,
            startTime: Date.now(),
            locations: [mockPosition],
            distance: 0,
            steps: 0,
            calories: 0,
            isActive: true,
          }

          setCurrentActivity(newActivity)
          setLocations([mockPosition])
          setIsTracking(true)
          startMockDataUpdates()

          return true
        } else {
          addDebugLog(`Failed to get initial position: ${posErr}`)
          setError("Failed to get current position. Please ensure location permissions are granted.")
          return false
        }
      }
    } catch (err) {
      console.error("Error starting activity:", err)
      addDebugLog(`Error starting activity: ${err}`)
      setError("Failed to start activity tracking")
      return false
    }
  }

  // Stop tracking the current activity
  const stopActivity = (): ActivitySession | null => {
    try {
      if (!isTracking || !currentActivity) {
        setError("No active tracking session")
        addDebugLog("No active tracking session to stop")
        return null
      }

      addDebugLog("Stopping activity tracking")

      // Stop watching position
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
        addDebugLog(`Cleared watch ID: ${watchId}`)
        setWatchId(null)
      }

      // Stop step counter
      stopStepCounting()

      // Stop mock data updates
      stopMockDataUpdates()

      // Update activity with end time
      const completedActivity: ActivitySession = {
        ...currentActivity,
        endTime: Date.now(),
        isActive: false,
      }

      addDebugLog(
        `Activity completed: ${JSON.stringify({
          type: completedActivity.type,
          duration: (completedActivity.endTime - completedActivity.startTime) / 1000,
          distance: completedActivity.distance,
          steps: completedActivity.steps,
        })}`,
      )

      // Reset state
      setIsTracking(false)
      setCurrentActivity(null)

      return completedActivity
    } catch (err) {
      console.error("Error stopping activity:", err)
      addDebugLog(`Error stopping activity: ${err}`)
      setError("Failed to stop activity tracking")
      return null
    }
  }

  // Handle position updates
  const handlePositionUpdate = (position: GeolocationPosition) => {
    const newLocation: Location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    }

    addDebugLog(`Position update: ${newLocation.latitude}, ${newLocation.longitude}`)

    setLocations((prevLocations) => {
      // Only add location if it's significantly different from the last one
      const lastLocation = prevLocations[prevLocations.length - 1]
      if (lastLocation) {
        const distance = calculateDistance(
          lastLocation.latitude,
          lastLocation.longitude,
          newLocation.latitude,
          newLocation.longitude,
        )

        // If distance is less than 5 meters, don't add a new point (reduces data points)
        if (distance < 0.005) {
          return prevLocations
        }
      }

      const updatedLocations = [...prevLocations, newLocation]

      // Calculate new distance
      if (prevLocations.length > 0) {
        const lastLocation = prevLocations[prevLocations.length - 1]
        const newDistance = calculateDistance(
          lastLocation.latitude,
          lastLocation.longitude,
          newLocation.latitude,
          newLocation.longitude,
        )

        addDebugLog(`New distance segment: ${newDistance.toFixed(4)} km`)

        // Update stats
        setStats((prevStats) => {
          const updatedStats = {
            ...prevStats,
            distance: prevStats.distance + newDistance,
            duration: (Date.now() - (currentActivity?.startTime || Date.now())) / 1000,
            calories: calculateCalories(
              prevStats.distance + newDistance,
              (Date.now() - (currentActivity?.startTime || Date.now())) / 1000,
              currentActivity?.type || "walking",
            ),
          }

          addDebugLog(
            `Updated stats: distance=${updatedStats.distance.toFixed(2)}km, duration=${updatedStats.duration.toFixed(0)}s`,
          )
          return updatedStats
        })

        // Update current activity
        if (currentActivity) {
          setCurrentActivity((prev) => {
            if (!prev) return null
            const updated = {
              ...prev,
              locations: updatedLocations,
              distance: (prev.distance || 0) + newDistance,
            }
            return updated
          })
        }
      }

      return updatedLocations
    })
  }

  // Handle position errors
  const handlePositionError = (error: GeolocationPositionError) => {
    console.error("Geolocation error:", error)
    addDebugLog(`Geolocation error: ${error.code} - ${error.message}`)

    let errorMessage = "Unknown location error"

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Location permission denied"
        break
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information is unavailable"
        break
      case error.TIMEOUT:
        errorMessage = "Location request timed out"
        break
    }

    setError(errorMessage)
  }

  // Get current position as a Promise
  const getCurrentPosition = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      addDebugLog("Getting current position")
      navigator.geolocation.getCurrentPosition(
        (position) => {
          addDebugLog(`Position acquired: ${position.coords.latitude}, ${position.coords.longitude}`)
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          })
        },
        (error) => {
          console.error("Error getting current position:", error)
          addDebugLog(`Error getting position: ${error.code} - ${error.message}`)
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    })
  }

  // Step counting implementation
  const startStepCounting = () => {
    addDebugLog("Attempting to start step counting")
    // Check if the Step Counter API is available
    if (window.DeviceMotionEvent) {
      addDebugLog("DeviceMotionEvent is available")
      try {
        window.addEventListener("devicemotion", handleStepDetection)
        addDebugLog("Added devicemotion event listener")
      } catch (err) {
        addDebugLog(`Error adding devicemotion listener: ${err}`)
      }
    } else {
      addDebugLog("Step counting not available: DeviceMotionEvent not supported")
    }
  }

  const stopStepCounting = () => {
    addDebugLog("Stopping step counting")
    if (window.DeviceMotionEvent) {
      try {
        window.removeEventListener("devicemotion", handleStepDetection)
        addDebugLog("Removed devicemotion event listener")
      } catch (err) {
        addDebugLog(`Error removing devicemotion listener: ${err}`)
      }
    }
  }

  // Simple step detection algorithm
  const handleStepDetection = (event: DeviceMotionEvent) => {
    if (!event.acceleration || !event.acceleration.x || !event.acceleration.y || !event.acceleration.z) {
      return
    }

    const acceleration = event.acceleration
    const magnitude = Math.sqrt(
      acceleration.x * acceleration.x + acceleration.y * acceleration.y + acceleration.z * acceleration.z,
    )

    // Detect steps using acceleration magnitude threshold
    // This is a simplified algorithm - real step detection is more complex
    const STEP_THRESHOLD = 10 // Adjust based on testing

    if (magnitude > STEP_THRESHOLD) {
      // Increment step count
      setStats((prevStats) => {
        const newSteps = prevStats.steps + 1
        addDebugLog(`Step detected! Count: ${newSteps}`)

        // Update current activity
        if (currentActivity) {
          setCurrentActivity((prev) => {
            if (!prev) return null
            return {
              ...prev,
              steps: newSteps,
            }
          })
        }

        return {
          ...prevStats,
          steps: newSteps,
          calories: calculateCalories(
            prevStats.distance,
            (Date.now() - (currentActivity?.startTime || Date.now())) / 1000,
            currentActivity?.type || "walking",
            newSteps,
          ),
        }
      })
    }
  }

  // Mock data updates for testing
  let mockInterval: NodeJS.Timeout | null = null

  const startMockDataUpdates = () => {
    // Check if we're in a preview/iframe environment
    const isPreviewEnvironment = window.location.hostname.includes("vercel") || window.top !== window.self

    const updateInterval = isPreviewEnvironment ? 1000 : 2000 // Faster updates in preview
    const distanceIncrement = isPreviewEnvironment ? 0.01 : 0.005 // Larger increments in preview
    const stepIncrement = isPreviewEnvironment ? 20 : 10 // More steps in preview

    addDebugLog(`Starting mock data updates for testing (${isPreviewEnvironment ? "preview mode" : "normal mode"})`)

    // This is just for testing when sensors aren't available
    mockInterval = setInterval(() => {
      if (isTracking) {
        // Simulate distance increase
        setStats((prevStats) => {
          const newDistance = prevStats.distance + distanceIncrement
          const newSteps = prevStats.steps + stepIncrement
          const newDuration = (Date.now() - (currentActivity?.startTime || Date.now())) / 1000

          // Update current activity
          if (currentActivity) {
            setCurrentActivity((prev) => {
              if (!prev) return null

              // In preview mode, also add mock location updates
              const updatedLocations = [...prev.locations]
              if (isPreviewEnvironment && prev.locations.length > 0) {
                const lastLoc = prev.locations[prev.locations.length - 1]
                // Add a small random offset to create movement
                const newLoc: Location = {
                  latitude: lastLoc.latitude + (Math.random() - 0.5) * 0.001,
                  longitude: lastLoc.longitude + (Math.random() - 0.5) * 0.001,
                  accuracy: 10,
                  timestamp: Date.now(),
                }
                updatedLocations.push(newLoc)
              }

              return {
                ...prev,
                distance: newDistance,
                steps: newSteps,
                locations: updatedLocations,
              }
            })
          }

          return {
            distance: newDistance,
            steps: newSteps,
            duration: newDuration,
            calories: calculateCalories(newDistance, newDuration, currentActivity?.type || "walking", newSteps),
          }
        })
      }
    }, updateInterval)
  }

  const stopMockDataUpdates = () => {
    if (mockInterval) {
      clearInterval(mockInterval)
      mockInterval = null
      addDebugLog("Stopped mock data updates")
    }
  }

  // Request location permission explicitly
  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      addDebugLog("Requesting location permission")

      // Check if we're in a preview/iframe environment
      const isPreviewEnvironment = window.location.hostname.includes("vercel") || window.top !== window.self

      if (isPreviewEnvironment) {
        addDebugLog("Detected preview environment - simulating granted permission")
        setPermissionStatus("mock")
        return true
      }

      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            addDebugLog("Location permission granted")
            setPermissionStatus("granted")
            resolve(true)
          },
          (error) => {
            if (error.message && error.message.includes("permissions policy")) {
              // Permissions policy error (iframe or non-HTTPS)
              addDebugLog("Location blocked by permissions policy - using mock permissions")
              setPermissionStatus("mock")
              resolve(true)
            } else {
              console.error("Permission request failed:", error)
              addDebugLog(`Permission request failed: ${error.code} - ${error.message}`)
              setPermissionStatus("denied")
              setError("Location permission denied")
              resolve(false)
            }
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        )
      })
    } catch (err) {
      console.error("Error requesting location permission:", err)
      addDebugLog(`Error requesting location permission: ${err}`)
      setError("Failed to request location permission")
      return false
    }
  }

  // Helper functions
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    // Haversine formula to calculate distance between two points
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km
    return distance
  }

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180)
  }

  const calculateCalories = (
    distance: number,
    duration: number,
    activityType: ActivityType,
    steps?: number,
  ): number => {
    // Simplified calorie calculation
    // In a real app, you would use more sophisticated formulas based on user weight, height, etc.
    const MET = {
      walking: 3.5,
      running: 8.0,
      cycling: 6.0,
      skateboarding: 5.0,
      surfing: 4.0,
      snowboarding: 5.5,
    }

    // Assume 70kg person
    const weight = 70

    // Calories = MET * weight (kg) * duration (hours)
    const hours = duration / 3600
    return Math.round(MET[activityType] * weight * hours)
  }

  return {
    isTracking,
    currentActivity,
    error,
    permissionStatus,
    locations,
    stats,
    startActivity,
    stopActivity,
    requestLocationPermission,
    debug, // Expose debug logs
  }
}

// Add this to make DeviceMotionEvent available to TypeScript
declare global {
  interface Window {
    DeviceMotionEvent: any
  }
}
