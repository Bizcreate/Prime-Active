"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface NFTMarketCardProps {
  id: string
  name: string
  image: string
  price: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  activity: string
  seller: string
}

export function NFTMarketCard({ id, name, image, price, rarity, activity, seller }: NFTMarketCardProps) {
  const rarityColors = {
    common: "bg-zinc-600",
    uncommon: "bg-green-600",
    rare: "bg-blue-600",
    epic: "bg-purple-600",
    legendary: "bg-primary",
  }

  return (
    <Card className="overflow-hidden bg-zinc-900/50 border-zinc-800/50">
      <div className="flex">
        <div className="relative h-24 w-24 flex-shrink-0">
          <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
        </div>
        <CardContent className="p-3 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-sm">{name}</h3>
              <p className="text-xs text-zinc-400 flex items-center gap-1">
                <Badge className="h-3 w-3" />
                {activity}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Seller: {seller}</p>
            </div>
            <div className={`${rarityColors[rarity]} text-black text-xs px-2 py-0.5 rounded-full font-medium`}>
              {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="font-bold text-primary">{price} PLAY</p>
            <Link href={`/marketplace/${id}`}>
              <Button size="sm">View</Button>
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
