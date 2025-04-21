"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Award, Trophy, Medal, Star } from "lucide-react"

interface AchievementCardProps {
  title: string
  description: string
  type: "badge" | "medal" | "trophy" | "star"
  unlocked: boolean
  progress?: number
  maxProgress?: number
  onClick?: () => void
}

export function AchievementCard({
  title,
  description,
  type,
  unlocked,
  progress = 0,
  maxProgress = 0,
  onClick,
}: AchievementCardProps) {
  const icons = {
    badge: Award,
    medal: Medal,
    trophy: Trophy,
    star: Star,
  }

  const Icon = icons[type]

  return (
    <Card
      className={`achievement-card p-4 cursor-pointer ${unlocked ? "opacity-100" : "opacity-60"}`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${unlocked ? "bg-primary/20" : "bg-zinc-800"}`}>
            <Icon className={`h-5 w-5 ${unlocked ? "text-primary" : "text-zinc-500"}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm">{title}</h3>
            <p className="text-xs text-zinc-400">{description}</p>

            {maxProgress > 0 && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(progress / maxProgress) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {progress}/{maxProgress}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
