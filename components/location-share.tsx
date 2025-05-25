"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Navigation, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface LocationShareProps {
  onSelect: (location: { name: string; lat: number; lng: number }) => void
  onCancel: () => void
}

export function LocationShare({ onSelect, onCancel }: LocationShareProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; lat: number; lng: number } | null>(null)

  // Mock locations for demo purposes
  const mockLocations = [
    { name: "Downtown Skatepark", lat: 34.0522, lng: -118.2437 },
    { name: "Sunset Beach", lat: 33.6189, lng: -117.9298 },
    { name: "Mountain Trail", lat: 34.1341, lng: -118.2882 },
    { name: "City Park", lat: 34.0689, lng: -118.4452 },
  ]

  const filteredLocations = searchQuery
    ? mockLocations.filter((loc) => loc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : mockLocations

  const handleSelectLocation = (location: { name: string; lat: number; lng: number }) => {
    setSelectedLocation(location)
  }

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelect(selectedLocation)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Share Location</h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative mb-4">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search locations..."
            className="pl-9 bg-zinc-900 border-zinc-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="h-48 w-full rounded-lg overflow-hidden map-container relative mb-4">
          {/* Map placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 px-4 py-2 rounded-lg">
              <p className="text-sm text-white">Map will display selected location</p>
            </div>
          </div>

          {/* Current location marker */}
          <div className="absolute bottom-4 right-4">
            <Button size="sm" className="flex items-center gap-1">
              <Navigation className="h-3 w-3" />
              Current Location
            </Button>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {filteredLocations.map((location) => (
            <div
              key={location.name}
              className={`p-2 rounded-md cursor-pointer flex items-center gap-2 ${
                selectedLocation?.name === location.name ? "bg-primary/20" : "hover:bg-zinc-800"
              }`}
              onClick={() => handleSelectLocation(location)}
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span>{location.name}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleConfirm} disabled={!selectedLocation}>
            Confirm Location
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
