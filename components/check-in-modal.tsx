"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Camera, X, Users, Award } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface CheckInModalProps {
  location: {
    name: string
    lat: number
    lng: number
  }
  onClose: () => void
  onSubmit: (data: { content: string; photo: string | null }) => void
}

export function CheckInModal({ location, onClose, onSubmit }: CheckInModalProps) {
  const [content, setContent] = useState("")
  const [photo, setPhoto] = useState<string | null>(null)

  const handleAddPhoto = () => {
    // In a real app, this would open a file picker
    // For demo purposes, we'll just set a placeholder image
    setPhoto("/placeholder.svg?height=300&width=500&query=location+photo")
  }

  const handleSubmit = () => {
    if (!content.trim()) {
      alert("Please enter some content for your check-in")
      return
    }

    onSubmit({ content, photo })
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Check In at {location.name}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4 bg-zinc-900 p-2 rounded-lg">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="text-sm">{location.name}</span>
        </div>

        <div className="mb-4">
          <Textarea
            placeholder={`What's happening at ${location.name}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-zinc-900 border-zinc-800 min-h-[100px]"
          />
        </div>

        {photo && (
          <div className="relative rounded-lg overflow-hidden mb-4">
            <img src={photo || "/placeholder.svg"} alt="Check-in" className="w-full h-auto rounded-lg" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={() => setPhoto(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleAddPhoto}>
            <Camera className="h-4 w-4" />
            Add Photo
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Tag Friends
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            Add Activity
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit}>
            Check In
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
