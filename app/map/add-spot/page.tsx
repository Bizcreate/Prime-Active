"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AddSpotPage() {
  const router = useRouter()
  const [spotName, setSpotName] = useState("")
  const [spotType, setSpotType] = useState("")
  const [description, setDescription] = useState("")
  const [amenities, setAmenities] = useState<string[]>([])
  const [newAmenity, setNewAmenity] = useState("")
  const [photos, setPhotos] = useState<string[]>([])

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setAmenities([...amenities, newAmenity.trim()])
      setNewAmenity("")
    }
  }

  const handleRemoveAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index))
  }

  const handleAddPhoto = () => {
    // In a real app, this would open a file picker
    // For demo purposes, we'll just add a placeholder
    const newPhoto = `/placeholder.svg?height=100&width=100&query=spot+${photos.length + 1}`
    setPhotos([...photos, newPhoto])
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!spotName || !spotType || !description) {
      alert("Please fill in all required fields")
      return
    }

    // In a real app, this would submit the spot to an API
    alert("Spot added successfully!")
    router.push("/map")
  }

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/map">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Add New Spot</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="h-48 w-full rounded-lg overflow-hidden map-container relative mb-4">
            {/* Map placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 px-4 py-2 rounded-lg">
                <p className="text-sm text-white">Tap to select spot location</p>
              </div>
            </div>

            {/* Current location marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="h-4 w-4 rounded-full bg-primary"></div>
              <div className="h-10 w-10 rounded-full bg-primary/20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Spot Name*</label>
              <Input
                placeholder="e.g. Downtown Skatepark"
                className="bg-zinc-900 border-zinc-800"
                value={spotName}
                onChange={(e) => setSpotName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Spot Type*</label>
              <Select value={spotType} onValueChange={setSpotType} required>
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <SelectValue placeholder="Select spot type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skate">Skatepark</SelectItem>
                  <SelectItem value="surf">Surf Spot</SelectItem>
                  <SelectItem value="snow">Snow Area</SelectItem>
                  <SelectItem value="bike">Bike Trail</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Description*</label>
              <Textarea
                placeholder="Describe this spot..."
                className="bg-zinc-900 border-zinc-800 min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Amenities</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="e.g. Restrooms"
                  className="bg-zinc-900 border-zinc-800 flex-1"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                />
                <Button type="button" onClick={handleAddAmenity} disabled={!newAmenity.trim()}>
                  Add
                </Button>
              </div>
              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="bg-zinc-800 px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="text-xs">{amenity}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(index)}
                        className="text-zinc-400 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Photos</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Spot photo ${index + 1}`}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="h-20 w-20 bg-zinc-900 border border-dashed border-zinc-700 rounded-md flex items-center justify-center"
                >
                  <Camera className="h-6 w-6 text-zinc-500" />
                </button>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add Spot
          </Button>
        </form>
      </div>
    </main>
  )
}
