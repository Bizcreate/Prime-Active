"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { motion } from "framer-motion"

interface BrandedNFTCardProps {
  id: string
  name: string
  image: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  activity: string
  onClick?: () => void
}

export function BrandedNFTCard({ id, name, image, rarity, activity, onClick }: BrandedNFTCardProps) {
  const rarityColors = {
    common: "bg-zinc-600",
    uncommon: "bg-green-600",
    rare: "bg-blue-600",
    epic: "bg-purple-600",
    legendary: "bg-[#ffc72d]",
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="cursor-pointer" onClick={onClick}>
      <Card className="overflow-hidden bg-zinc-900/50 border-zinc-800/50 prime-mates-shadow">
        <div className="relative aspect-square rounded-t-lg overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              ;(e.target as HTMLImageElement).src = "/chromatic-flow.png"
            }}
          />
          <div className={`absolute top-2 right-2 ${rarityColors[rarity]} text-black text-xs px-2 py-0.5 rounded-full`}>
            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
          </div>
          <div className="absolute top-2 left-2">
            <Image src="/prime-mates-logo.png" alt="Prime Mates" width={40} height={20} className="object-contain" />
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-sm">{name}</h3>
          <div className="flex justify-between items-center">
            <p className="text-xs text-zinc-400 flex items-center gap-1">
              <Image src="/banana-icon.png" alt="Banana" width={12} height={12} className="object-contain" />
              {activity}
            </p>
            <div className="flex items-center">
              <Image
                src="/shaka-icon.png"
                alt="Shaka"
                width={16}
                height={16}
                className="object-contain shaka-animation"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
