"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "lucide-react"
import Image from "next/image"

interface NFTCardProps {
  id: string
  name: string
  image: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  activity: string
  onClick?: () => void
}

export function NFTCard({ id, name, image, rarity, activity, onClick }: NFTCardProps) {
  const rarityColors = {
    common: "bg-zinc-600",
    uncommon: "bg-green-600",
    rare: "bg-blue-600",
    epic: "bg-purple-600",
    legendary: "bg-primary",
  }

  return (
    <Card className="nft-card overflow-hidden bg-zinc-900/50 border-zinc-800/50 cursor-pointer" onClick={onClick}>
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform hover:scale-110"
        />
        <div className={`absolute top-2 right-2 ${rarityColors[rarity]} text-white text-xs px-2 py-0.5 rounded-full`}>
          {rarity}
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm">{name}</h3>
        <p className="text-xs text-zinc-400 flex items-center gap-1">
          <Badge className="h-3 w-3" />
          {activity}
        </p>
      </CardContent>
    </Card>
  )
}
