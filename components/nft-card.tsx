"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface NFTCardProps {
  id?: string
  name?: string
  image?: string
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary"
  benefits?: string[]
  activity?: string
  nft?: {
    id: string
    name: string
    image: string
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
    benefits?: string[]
    activity?: string
  }
}

export function NFTCard({ id, name, image, rarity, benefits, activity, nft }: NFTCardProps) {
  // If nft object is provided, use its properties
  const nftId = id || nft?.id || ""
  const nftName = name || nft?.name || ""
  const nftImage = image || nft?.image || "/placeholder.svg"
  const nftRarity = rarity || nft?.rarity || "common"
  const nftBenefits = benefits || nft?.benefits
  const nftActivity = activity || nft?.activity

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
        <Image src={nftImage || "/placeholder.svg"} alt={nftName} fill className="object-cover" />
        <div
          className={`absolute top-2 right-2 ${rarityColors[nftRarity] || "bg-zinc-600"} text-black text-xs px-2 py-0.5 rounded-full`}
        >
          {nftRarity ? nftRarity.charAt(0).toUpperCase() + nftRarity.slice(1) : "Common"}
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm">{nftName}</h3>
        {nftBenefits && (
          <ul className="mt-2 space-y-1">
            {nftBenefits.map((benefit, index) => (
              <li key={index} className="text-xs text-zinc-400">
                • {benefit}
              </li>
            ))}
          </ul>
        )}
        {nftActivity && <p className="text-xs text-zinc-400 mt-2">Activity: {nftActivity}</p>}
      </CardContent>
    </Card>
  )
}

// Add this named export to fix the deployment error
export const NftCard = NFTCard
