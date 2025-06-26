"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Activity, AlertTriangle, Check } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface PermissionRequestProps {
  onPermissionGranted?: () => void
}

export function PermissionRequest({ onPermissionGranted }: PermissionRequestProps) {
  const [locationPermission, setLocationPermission] = useState(false)
  const [motionPermission, setMotionPermission] = useState(false)

  const handleGrantPermissions = () => {
    // In a real app, we would request actual device permissions here
    // For now, we'll just simulate it
    if (onPermissionGranted && typeof onPermissionGranted === "function") {
      onPermissionGranted()
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-[#ffc72d]">Enable Activity Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-yellow-900/20 border border-yellow-900 rounded-md p-3 flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-500 font-medium">Why we need these permissions</p>
            <p className="text-xs text-yellow-400/80">
              Prime Active needs access to your location and motion sensors to track your activities and reward you
              accurately. We only collect data when you're actively using the app.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500/20 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#ffc72d] mb-1">Location Access</h4>
                <p className="text-xs text-zinc-400">
                  Allows the app to track your location during activities and find nearby spots
                </p>
              </div>
            </div>
            <Switch
              checked={locationPermission}
              onCheckedChange={setLocationPermission}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-green-500/20 p-2 rounded-full">
                <Activity className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#ffc72d] mb-1">Motion Sensors</h4>
                <p className="text-xs text-zinc-400">
                  Allows the app to detect your activities and track your movements
                </p>
              </div>
            </div>
            <Switch
              checked={motionPermission}
              onCheckedChange={setMotionPermission}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGrantPermissions} disabled={!locationPermission && !motionPermission} className="w-full">
          {locationPermission || motionPermission ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Continue
            </>
          ) : (
            "Grant Permissions"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
