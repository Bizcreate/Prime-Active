"use client"

import { ActivityMapTracker } from "@/components/activity-map-tracker"
import { AppShell } from "@/components/app-shell"
import { MapTokenProvider } from "@/components/map-token-provider"

export default function ActivityTrackingPage() {
  return (
    <MapTokenProvider>
      <AppShell>
        <ActivityMapTracker />
      </AppShell>
    </MapTokenProvider>
  )
}
