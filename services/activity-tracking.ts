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
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [stats, setStats] = useState<ActivityStats>({
    steps: 0,
    distance: 0,
    calories: 0,
    duration: 0,
  })
  const [watchId, setWatchId] = useState<number | null>(null)

  // Check for geolocation permissions
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Check if geolocation is available
        if (!navigator.geolocation) {
          setError("Geolocation is not supported by your browser")
          return
        }

        // Check for permissions API
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({ name: "geolocation" as PermissionName })
          setPermissionStatus(result.state)

          // Listen for permission changes
          result.addEventListener("change", () => {
            setPermissionStatus(result.state)
          })
        } else {
          // Fallback for browsers that don't support permissions API
          navigator.geolocation.getCurrentPosition(
            () => setPermissionStatus("granted"),
            () => setPermissionStatus("denied"),
            { timeout: 5000 },
          )
        }
      } catch (err) {
        console.error("Error checking permissions:", err)
        setError("Failed to check location permissions")
      }
    }

    checkPermissions()
  }, [])

  // Start tracking an activity
  const startActivity = async (type: ActivityType): Promise<boolean> => {
    try {
      // Check if already tracking
      if (isTracking) {
        setError("Already tracking an activity")
        return false
      }

      // Check for geolocation support
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser")
        return false
      }

      // Get initial position
      const position = await getCurrentPosition()
      if (!position) {
        setError("Failed to get current position")
        return false
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

      // Start watching position
      const id = navigator.geolocation.watchPosition(handlePositionUpdate, handlePositionError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      })

      setWatchId(id)

      // Start step counter if available
      startStepCounting()

      return true
    } catch (err) {
      console.error("Error starting activity:", err)
      setError("Failed to start activity tracking")
      return false
    }
  }

  // Stop tracking the current activity
  const stopActivity = (): ActivitySession | null => {
    try {
      if (!isTracking || !currentActivity) {
        setError("No active tracking session")
        return null
      }

      // Stop watching position
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
        setWatchId(null)
      }

      // Stop step counter
      stopStepCounting()

      // Update activity with end time
      const completedActivity: ActivitySession = {
        ...currentActivity,
        endTime: Date.now(),
        isActive: false,
      }

      // Reset state
      setIsTracking(false)
      setCurrentActivity(null)

      return completedActivity
    } catch (err) {
      console.error("Error stopping activity:", err)
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

    setLocations((prevLocations) => {
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

        // Update stats
        setStats((prevStats) => ({
          ...prevStats,
          distance: prevStats.distance + newDistance,
          duration: (Date.now() - (currentActivity?.startTime || Date.now())) / 1000,
          calories: calculateCalories(
            prevStats.distance + newDistance,
            (Date.now() - (currentActivity?.startTime || Date.now())) / 1000,
            currentActivity?.type || "walking",
          ),
        }))

        // Update current activity
        if (currentActivity) {
          setCurrentActivity({
            ...currentActivity,
            locations: updatedLocations,
            distance: (currentActivity.distance || 0) + newDistance,
          })
        }
      }

      return updatedLocations
    })
  }

  // Handle position errors
  const handlePositionError = (error: GeolocationPositionError) => {
    console.error("Geolocation error:", error)

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
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          })
        },
        (error) => {
          console.error("Error getting current position:", error)
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
    // Check if the Step Counter API is available
    if (window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", handleStepDetection)
    } else {
      console.warn("Step counting not available: DeviceMotionEvent not supported")
    }
  }

  const stopStepCounting = () => {
    if (window.DeviceMotionEvent) {
      window.removeEventListener("devicemotion", handleStepDetection)
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

        // Update current activity
        if (currentActivity) {
          setCurrentActivity({
            ...currentActivity,
            steps: newSteps,
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

  // Request location permission explicitly
  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            setPermissionStatus("granted")
            resolve(true)
          },
          (error) => {
            console.error("Permission request failed:", error)
            setPermissionStatus("denied")
            setError("Location permission denied")
            resolve(false)
          },
          { enableHighAccuracy: true, timeout: 10000 },
        )
      })
    } catch (err) {
      console.error("Error requesting location permission:", err)
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
  }
}

// Add this to make DeviceMotionEvent available to TypeScript
declare global {
  interface Window {
    DeviceMotionEvent: any
  }
}
