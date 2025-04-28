"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Lock } from "lucide-react"
import Image from "next/image"

interface BananaRewardCardProps {
  title: string
  description: string
  bananaPoints: number
  image: string
  unlocked: boolean
  progress: number
  maxProgress: number
}

export function BananaRewardCard({
  title,
  description,
  bananaPoints,
  image,
  unlocked,
  progress,
  maxProgress,
}: BananaRewardCardProps) {
  const progressPercentage = (progress / maxProgress) * 100

  return (
    <Card className="overflow-hidden bg-zinc-900 border-zinc-800">
      <div className="relative">
        <div className="relative h-32 w-full">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          {!unlocked && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-black/50 p-3 rounded-full">
                <Lock className="h-6 w-6 text-zinc-400" />
              </div>
            </div>
          )}
        </div>
        <div className="absolute top-2 right-2 bg-primary/90 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <Image src="/banana-icon.png" alt="Activity Tokens" width={14} height={14} className="object-contain" />
          {bananaPoints} points
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-sm text-zinc-400 mb-3">{description}</p>
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>
              {progress} / {maxProgress}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        <Button
          className="w-full bg-primary text-black font-medium flex items-center gap-2"
          disabled={!unlocked || progressPercentage < 100}
        >
          {progressPercentage >= 100 ? (
            <>
              <Image src="/banana-icon.png" alt="Claim" width={16} height={16} className="object-contain" />
              Claim Reward
            </>
          ) : unlocked ? (
            "In Progress"
          ) : (
            "Locked"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
