"use client"

import { Card } from "@/components/ui/card"
import { CircularProgress } from "@/components/circular-progress"
import { Activity, Bike, Snowflake, Waves, SkullIcon as Skateboard, Footprints } from "lucide-react"

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
  title: string
  value: string
  unit: string
  progress?: number
  color?: string
  onClick?: () => void
}

export function ActivityCard({
  type,
  title,
  value,
  unit,
  progress = 0,
  color = "#FFC72D",
  onClick,
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
  }

  const Icon = icons[type]

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
          <p className="text-lg font-semibold flex items-baseline gap-1">
            {value}
            <span className="text-xs text-zinc-500">{unit}</span>
          </p>
        </div>
        {progress > 0 && <CircularProgress value={progress} size={40} strokeWidth={4} color={color} />}
      </div>
    </Card>
  )
}
