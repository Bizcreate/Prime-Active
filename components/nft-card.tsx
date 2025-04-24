"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface NFTCardProps {
  id: string
  name: string
  image: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  benefits?: string[]
  activity?: string
}

export function NFTCard({ id, name, image, rarity, benefits, activity }: NFTCardProps) {
  const rarityColors = {
    common: "bg-zinc-600",
    uncommon: "bg-green-600",
    rare: "bg-blue-600",
    epic: "bg-purple-600",
    legendary: "bg-[#ffc72d]",
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
      <div className="relative aspect-square">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
        <div className={`absolute top-2 right-2 ${rarityColors[rarity]} text-black text-xs px-2 py-0.5 rounded-full`}>
          {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm">{name}</h3>
        {benefits && (
          <ul className="mt-2 space-y-1">
            {benefits.map((benefit, index) => (
              <li key={index} className="text-xs text-zinc-400">
                • {benefit}
              </li>
            ))}
          </ul>
        )}
        {activity && <p className="text-xs text-zinc-400 mt-2">Activity: {activity}</p>}
      </CardContent>
    </Card>
  )
}

// Add this named export to fix the deployment error
export const NftCard = NFTCard
