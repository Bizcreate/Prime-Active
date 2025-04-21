"use client"

import { Card } from "@/components/ui/card"
import { CircularProgress } from "@/components/circular-progress"
import { Activity, Bike, Snowflake, Waves, SkullIcon as Skateboard, Footprints } from "lucide-react"
import Image from "next/image"

interface ActivityCardProps {
  type:
    | "walking"
    | "running"
    | "skateboarding"
    | "longboarding"
    | "surfing"
    | "snowboarding"
    | "bmx"
    | "mountainbiking"
    | "roadbiking"
    | "skate" // Added this type
    | "surf" // Added this type
  title: string
  value?: string
  unit?: string
  progress?: number
  color?: string
  onClick?: () => void
  location?: string
  distance?: string
  duration?: string
  date?: string
  image?: string
}

export function ActivityCard({
  type,
  title,
  value,
  unit,
  progress = 0,
  color = "#FFC72D",
  onClick,
  location,
  distance,
  duration,
  date,
  image,
}: ActivityCardProps) {
  const icons = {
    walking: Footprints,
    running: Activity,
    skateboarding: Skateboard,
    longboarding: Skateboard,
    surfing: Waves,
    snowboarding: Snowflake,
    bmx: Bike,
    mountainbiking: Bike,
    roadbiking: Bike,
    skate: Skateboard, // Map skate to Skateboard
    surf: Waves, // Map surf to Waves
  }

  const Icon = icons[type] || Activity // Provide a fallback icon

  // Compact card for dashboard recent activities
  if (location && date) {
    return (
      <Card
        className="bg-zinc-900/50 border-zinc-800/50 p-4 cursor-pointer hover:bg-zinc-900/70 transition-all overflow-hidden"
        onClick={onClick}
      >
        <div className="flex gap-3">
          <div className="bg-zinc-800 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm">{title}</h3>
            <p className="text-xs text-zinc-400">{location}</p>
            <div className="flex gap-3 mt-2 text-xs">
              <span>{distance}</span>
              <span>{duration}</span>
              <span className="text-zinc-500">{date}</span>
            </div>
          </div>
          {image && (
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={image || "/placeholder.svg"}
                alt={title}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
      </Card>
    )
  }

  // Original card for activity listings
  return (
    <Card
      className="activity-card bg-zinc-900/50 border-zinc-800/50 p-4 cursor-pointer hover:bg-zinc-900/70 transition-all"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="bg-zinc-800 p-2 rounded-full">
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-zinc-400">{title}</p>
          {value && (
            <p className="text-lg font-semibold flex items-baseline gap-1">
              {value}
              <span className="text-xs text-zinc-500">{unit}</span>
            </p>
          )}
        </div>
        {progress > 0 && <CircularProgress value={progress} size={40} strokeWidth={4} color={color} />}
      </div>
    </Card>
  )
}
