"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import Image from "next/image"

interface CommunityEventCardProps {
  title: string
  description: string
  date: string
  location: string
  attendees: number
  maxAttendees?: number
  image: string
  category: "skate" | "surf" | "snow" | "general"
  isAttending?: boolean
  onAttend?: () => void
}

export function CommunityEventCard({
  title,
  description,
  date,
  location,
  attendees,
  maxAttendees,
  image,
  category,
  isAttending = false,
  onAttend,
}: CommunityEventCardProps) {
  const categoryColors = {
    skate: "bg-emerald-500",
    surf: "bg-blue-500",
    snow: "bg-purple-500",
    general: "bg-primary",
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
      <div className="relative h-40 w-full">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute top-2 right-2">
          <span className={`${categoryColors[category]} text-xs font-bold px-2 py-1 rounded-full text-black`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-sm text-zinc-400 mb-3">{description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span>
              {attendees} {maxAttendees ? `/ ${maxAttendees}` : ""} attending
            </span>
          </div>
        </div>

        <Button
          onClick={onAttend}
          className={isAttending ? "w-full bg-zinc-800" : "w-full"}
          variant={isAttending ? "outline" : "default"}
        >
          {isAttending ? "Attending" : "Join Event"}
        </Button>
      </CardContent>
    </Card>
  )
}
