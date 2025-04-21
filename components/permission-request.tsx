"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Activity, AlertTriangle } from "lucide-react"

interface PermissionRequestProps {
  onPermissionGranted?: () => void
}

export function PermissionRequest({ onPermissionGranted }: PermissionRequestProps) {
  const [locationPermission, setLocationPermission] = useState<PermissionState | null>(null)
  const [motionPermission, setMotionPermission] = useState<PermissionState | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check permissions on mount
  useEffect(() => {
    checkLocationPermission()
    checkMotionPermission()
  }, [])

  // Check location permission
  const checkLocationPermission = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: "geolocation" as PermissionName })
        setLocationPermission(result.state)

        // Listen for permission changes
        result.addEventListener("change", () => {
          setLocationPermission(result.state)
          if (result.state === "granted" && motionPermission === "granted") {
            onPermissionGranted?.()
          }
        })
      } else {
        // Fallback for browsers that don't support permissions API
        navigator.geolocation.getCurrentPosition(
          () => setLocationPermission("granted"),
          () => setLocationPermission("denied"),
          { timeout: 5000 },
        )
      }
    } catch (err) {
      console.error("Error checking location permission:", err)
      setError("Failed to check location permissions")
    }
  }

  // Check motion permission
  const checkMotionPermission = async () => {
    try {
      // iOS requires permission for DeviceMotionEvent
      if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof (DeviceMotionEvent as any).requestPermission === "function"
      ) {
        setMotionPermission("prompt")
      } else {
        // For other browsers, assume granted if the API is available
        setMotionPermission(window.DeviceMotionEvent ? "granted" : "denied")
      }
    } catch (err) {
      console.error("Error checking motion permission:", err)
      setError("Failed to check motion permissions")
    }
  }

  // Request location permission
  const requestLocationPermission = () => {
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationPermission("granted")
        if (motionPermission === "granted") {
          onPermissionGranted?.()
        }
      },
      (error) => {
        console.error("Location permission denied:", error)
        setLocationPermission("denied")
        setError("Location permission is required for activity tracking")
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  // Request motion permission
  const requestMotionPermission = async () => {
    try {
      // iOS requires explicit permission
      if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof (DeviceMotionEvent as any).requestPermission === "function"
      ) {
        const permission = await (DeviceMotionEvent as any).requestPermission()
        setMotionPermission(permission === "granted" ? "granted" : "denied")

        if (permission === "granted" && locationPermission === "granted") {
          onPermissionGranted?.()
        }
      } else {
        setMotionPermission("granted")
        if (locationPermission === "granted") {
          onPermissionGranted?.()
        }
      }
    } catch (err) {
      console.error("Error requesting motion permission:", err)
      setMotionPermission("denied")
      setError("Motion permission is required for step counting")
    }
  }

  // Request all permissions
  const requestAllPermissions = async () => {
    requestLocationPermission()
    await requestMotionPermission()
  }

  // Check if all permissions are granted
  const allPermissionsGranted = locationPermission === "granted" && motionPermission === "granted"

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>Enable Activity Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-900/20 border border-red-900 rounded-md p-3 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <p className="text-sm text-zinc-400 mb-4">
          Prime Active needs access to your location and motion sensors to track your activities and count steps.
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Location Access</span>
            </div>
            <div className="text-xs">
              {locationPermission === "granted" ? (
                <span className="text-green-500">Granted</span>
              ) : locationPermission === "denied" ? (
                <span className="text-red-500">Denied</span>
              ) : (
                <span className="text-amber-500">Required</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Motion Sensors</span>
            </div>
            <div className="text-xs">
              {motionPermission === "granted" ? (
                <span className="text-green-500">Granted</span>
              ) : motionPermission === "denied" ? (
                <span className="text-red-500">Denied</span>
              ) : (
                <span className="text-amber-500">Required</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {allPermissionsGranted ? (
          <Button className="w-full" onClick={() => onPermissionGranted?.()}>
            Continue
          </Button>
        ) : (
          <Button className="w-full" onClick={requestAllPermissions}>
            Grant Permissions
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
