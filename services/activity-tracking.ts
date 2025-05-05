"use client"

import { useState, useEffect, useCallback } from "react"

export type ActivityType =
  | "walking"
  | "running"
  | "cycling"
  | "swimming"
  | "skateboarding"
  | "surfing"
  | "snowboarding"
  | "other"

export interface Location {
  latitude: number
  longitude: number
  timestamp: number
  accuracy?: number
  altitude?: number | null
  altitudeAccuracy?: number | null
  heading?: number | null
  speed?: number | null
}

export interface ActivitySession {
  id: string
  type: string
  startTime: number
  endTime?: number
  distance: number
  duration: number
  calories: number
  locations: Location[]
}

interface ActivityStats {
  distance: number
  duration: number
  calories: number
  pace: number
}

export type PermissionStatus = "granted" | "denied" | "prompt" | "mock"

export function useActivityTracking() {
  const [isTracking, setIsTracking] = useState(false)
  const [locations, setLocations] = useState<Location[]>([])
  const [currentActivity, setCurrentActivity] = useState<ActivitySession | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>("prompt")
  const [stats, setStats] = useState<ActivityStats>({
    distance: 0,
    duration: 0,
    calories: 0,
    pace: 0,
  })
  const [depinSubmissionEnabled, setDepinSubmissionEnabled] = useState(true)
  const [debug, setDebug] = useState<string[]>([])

  const requestLocationPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.")
      return false
    }

    try {
      const permission = await navigator.permissions.query({ name: "geolocation" as PermissionName })
      setPermissionStatus(permission.state as PermissionStatus)
      return permission.state === "granted"
    } catch (error) {
      console.error("Error getting location permission:", error)
      setPermissionStatus("denied")
      return false
    }
  }, [])

  const startActivity = useCallback(
    async (type: string) => {
      if (isTracking) return false

      if (permissionStatus !== "granted" && permissionStatus !== "mock") {
        const granted = await requestLocationPermission()
        if (!granted) return false
      }

      const newActivity: ActivitySession = {
        id: `activity-${Date.now()}`,
        type,
        startTime: Date.now(),
        distance: 0,
        duration: 0,
        calories: 0,
        locations: [],
      }

      setCurrentActivity(newActivity)
      setLocations([])
      setStats({
        distance: 0,
        duration: 0,
        calories: 0,
        pace: 0,
      })

      // Start watching position
      if (navigator.geolocation) {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const newLocation: Location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: position.timestamp,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed,
            }

            setLocations((prevLocations) => {
              const updatedLocations = [...prevLocations, newLocation]

              // Calculate distance
              let totalDistance = 0
              for (let i = 1; i < updatedLocations.length; i++) {
                const prev = updatedLocations[i - 1]
                const curr = updatedLocations[i]
                totalDistance += calculateDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude)
              }

              // Calculate duration
              const duration = (Date.now() - newActivity.startTime) / 60000 // in minutes

              // Calculate calories
              const calories = calculateCalories(type, duration)

              // Calculate pace (min/km)
              const pace = totalDistance > 0 ? duration / totalDistance : 0

              // Update stats
              setStats({
                distance: totalDistance,
                duration,
                calories,
                pace,
              })

              return updatedLocations
            })
          },
          (error) => {
            console.error("Error watching position:", error)
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          },
        )
        setWatchId(id)
      }

      setIsTracking(true)
      return true
    },
    [isTracking, permissionStatus, requestLocationPermission],
  )

  const stopActivity = useCallback(() => {
    if (!isTracking || !currentActivity) return null

    // Stop watching position
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }

    const endTime = Date.now()
    const duration = (endTime - currentActivity.startTime) / 60000 // in minutes

    const completedActivity: ActivitySession = {
      ...currentActivity,
      endTime,
      distance: stats.distance,
      duration,
      calories: stats.calories,
      locations,
    }

    setIsTracking(false)
    setCurrentActivity(null)

    // Here you would typically save the activity to a database
    console.log("Activity completed:", completedActivity)

    return completedActivity
  }, [isTracking, currentActivity, watchId, stats, locations])

  const toggleDepinSubmission = (enabled: boolean) => {
    setDepinSubmissionEnabled(enabled)
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  // Check permission status on mount
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          setPermissionStatus(result.state as PermissionStatus)

          result.onchange = () => {
            setPermissionStatus(result.state as PermissionStatus)
          }
        })
        .catch((error) => {
          console.error("Error checking permission:", error)
        })
    }
  }, [])

  return {
    isTracking,
    currentActivity,
    locations,
    stats,
    startActivity,
    stopActivity,
    requestLocationPermission,
    permissionStatus,
    toggleDepinSubmission,
    depinSubmissionEnabled,
    debug: [],
  }
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  try {
    // Handle invalid inputs
    if (!isFinite(lat1) || !isFinite(lon1) || !isFinite(lat2) || !isFinite(lon2)) {
      console.warn("Invalid coordinates in calculateDistance", { lat1, lon1, lat2, lon2 })
      return 0
    }

    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
  } catch (error) {
    console.error("Error calculating distance:", error)
    return 0
  }
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Calculate calories burned based on activity type, duration, and user stats
function calculateCalories(activityType: string, durationMinutes: number): number {
  // Very simplified calculation
  const MET =
    {
      walking: 3.5,
      running: 8.0,
      cycling: 6.0,
      hiking: 5.0,
      skateboarding: 5.0,
      snowboarding: 7.0,
      surfing: 3.0,
    }[activityType] || 4.0

  // Assume 70kg person
  const weight = 70
  return Math.round((MET * weight * durationMinutes) / 60)
}
