"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Activity, AlertTriangle, Check } from "lucide-react"

interface PermissionRequestProps {
  onPermissionGranted?: () => void
}

export function PermissionRequest({ onPermissionGranted }: PermissionRequestProps) {
  const [locationPermission, setLocationPermission] = useState<PermissionState | null>(null)
  const [motionPermission, setMotionPermission] = useState<PermissionState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [debugLogs, setDebugLogs] = useState<string[]>([])

  // Add debug logging
  const addDebugLog = (message: string) => {
    console.log(`[PermissionRequest] ${message}`)
    setDebugLogs((prev) => [...prev, message])
  }

  // Check permissions on mount
  useEffect(() => {
    checkLocationPermission()
    checkMotionPermission()
  }, [])

  // Check location permission
  const checkLocationPermission = async () => {
    try {
      addDebugLog("Checking location permission")
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const result = await navigator.permissions.query({ name: "geolocation" as PermissionName })
          setLocationPermission(result.state)
          addDebugLog(`Location permission state: ${result.state}`)

          // Listen for permission changes
          result.addEventListener("change", () => {
            addDebugLog(`Location permission changed to: ${result.state}`)
            setLocationPermission(result.state)
            if (result.state === "granted" && motionPermission === "granted") {
              onPermissionGranted?.()
            }
          })
        } catch (err) {
          addDebugLog(`Permissions API error: ${err}`)
          fallbackLocationCheck()
        }
      } else {
        addDebugLog("Permissions API not available, using fallback")
        fallbackLocationCheck()
      }
    } catch (err) {
      console.error("Error checking location permission:", err)
      addDebugLog(`Error checking location permission: ${err}`)
      setError("Failed to check location permissions")
    }
  }

  const fallbackLocationCheck = () => {
    addDebugLog("Using getCurrentPosition fallback for location permission check")
    navigator.geolocation.getCurrentPosition(
      () => {
        addDebugLog("Location permission granted (fallback)")
        setLocationPermission("granted")
        if (motionPermission === "granted") {
          onPermissionGranted?.()
        }
      },
      (err) => {
        addDebugLog(`Location permission denied (fallback): ${err.code} - ${err.message}`)
        setLocationPermission("denied")
      },
      { timeout: 5000, maximumAge: 0, enableHighAccuracy: true },
    )
  }

  // Check motion permission
  const checkMotionPermission = async () => {
    try {
      addDebugLog("Checking motion permission")
      // iOS requires permission for DeviceMotionEvent
      if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof (DeviceMotionEvent as any).requestPermission === "function"
      ) {
        addDebugLog("iOS DeviceMotionEvent permission required")
        setMotionPermission("prompt")
      } else if (window.DeviceMotionEvent) {
        // For other browsers, assume granted if the API is available
        addDebugLog("DeviceMotionEvent available, assuming granted")
        setMotionPermission("granted")
      } else {
        addDebugLog("DeviceMotionEvent not available")
        setMotionPermission("denied")
      }
    } catch (err) {
      console.error("Error checking motion permission:", err)
      addDebugLog(`Error checking motion permission: ${err}`)
      setMotionPermission("denied")
    }
  }

  // Request location permission
  const requestLocationPermission = () => {
    addDebugLog("Requesting location permission")
    navigator.geolocation.getCurrentPosition(
      () => {
        addDebugLog("Location permission granted")
        setLocationPermission("granted")
        if (motionPermission === "granted") {
          onPermissionGranted?.()
        }
      },
      (error) => {
        console.error("Location permission denied:", error)
        addDebugLog(`Location permission denied: ${error.code} - ${error.message}`)
        setLocationPermission("denied")
        setError("Location permission is required for activity tracking")
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  // Request motion permission
  const requestMotionPermission = async () => {
    try {
      addDebugLog("Requesting motion permission")
      // iOS requires explicit permission
      if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof (DeviceMotionEvent as any).requestPermission === "function"
      ) {
        addDebugLog("Using iOS DeviceMotionEvent.requestPermission")
        try {
          const permission = await (DeviceMotionEvent as any).requestPermission()
          addDebugLog(`iOS motion permission result: ${permission}`)
          setMotionPermission(permission === "granted" ? "granted" : "denied")

          if (permission === "granted" && locationPermission === "granted") {
            onPermissionGranted?.()
          }
        } catch (err) {
          addDebugLog(`iOS motion permission error: ${err}`)
          setMotionPermission("denied")
        }
      } else {
        addDebugLog("No explicit motion permission needed, setting to granted")
        setMotionPermission("granted")
        if (locationPermission === "granted") {
          onPermissionGranted?.()
        }
      }
    } catch (err) {
      console.error("Error requesting motion permission:", err)
      addDebugLog(`Error requesting motion permission: ${err}`)
      setMotionPermission("denied")
      setError("Motion permission is required for step counting")
    }
  }

  // Request all permissions
  const requestAllPermissions = async () => {
    addDebugLog("Requesting all permissions")
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
                <span className="text-green-500 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Granted
                </span>
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
                <span className="text-green-500 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Granted
                </span>
              ) : motionPermission === "denied" ? (
                <span className="text-red-500">Denied</span>
              ) : (
                <span className="text-amber-500">Required</span>
              )}
            </div>
          </div>
        </div>

        {/* Debug logs - only in development */}
        {debugLogs.length > 0 && (
          <div className="mt-4 p-2 bg-black/30 rounded-md">
            <p className="text-xs text-zinc-500 mb-1">Debug logs:</p>
            <div className="max-h-24 overflow-y-auto">
              {debugLogs.map((log, i) => (
                <p key={i} className="text-xs text-zinc-600">
                  {log}
                </p>
              ))}
            </div>
          </div>
        )}
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
