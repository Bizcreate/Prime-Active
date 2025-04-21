"use client"

import { Card, CardContent } from "@/components/ui/card"
import { SkullIcon as Skateboard, Snowflake, WavesIcon as Surfboard } from "lucide-react"

interface GearCardProps {
  name: string
  type: "skate" | "snow" | "surf"
  brand: string
  model: string
  active?: boolean
  onClick?: () => void
}

export function GearCard({ name, type, brand, model, active, onClick }: GearCardProps) {
  const icons = {
    skate: Skateboard,
    snow: Snowflake,
    surf: Surfboard,
  }

  const Icon = icons[type]

  return (
    <Card
      className={`bg-zinc-900 border-zinc-800 ${active ? "border-primary" : ""} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${active ? "bg-primary/20" : "bg-zinc-800"}`}>
            <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-white"}`} />
          </div>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-zinc-400">
              {brand} • {model}
            </p>
          </div>
          {active && (
            <div className="ml-auto">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
