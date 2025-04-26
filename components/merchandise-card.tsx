"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, Smartphone, Sparkles, Heart } from "lucide-react"
import Image from "next/image"
import type { ConnectedMerchandise } from "@/services/nfc-service"
import { useWishlist } from "@/hooks/use-wishlist"
import { useState } from "react"
import { motion } from "framer-motion"

interface MerchandiseCardProps {
  item: ConnectedMerchandise
}

export function MerchandiseCard({ item }: MerchandiseCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(item.id))
  const [isAnimating, setIsAnimating] = useState(false)

  const formatWearTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours < 24) {
      return `${hours}h ${remainingMinutes}m`
    }

    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24

    return `${days}d ${remainingHours}h`
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 500)

    if (isWishlisted) {
      removeFromWishlist(item.id)
    } else {
      addToWishlist({
        id: item.id,
        name: item.productName,
        description: "Premium merchandise from Prime Mates Board Club",
        price: 29.99, // Default price
        image: item.image || "/placeholder.svg",
        bananaPoints: 200, // Default points
        hasNFC: item.hasNFC,
      })
    }

    setIsWishlisted(!isWishlisted)
  }

  return (
    <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-none overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#ffc72d] relative">
      <div className="relative aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900">
        <Image src={item.image || "/placeholder.svg"} alt={item.productName} fill className="object-contain p-4" />
        {item.isCurrentlyWorn && (
          <div className="absolute top-2 right-2 bg-[#ffc72d] text-black text-xs px-2 py-0.5 rounded-full">Active</div>
        )}
        {item.hasNFC && (
          <div className="absolute top-2 left-2 bg-zinc-800 text-[#ffc72d] text-xs px-2 py-0.5 rounded-full flex items-center">
            <Smartphone className="h-3 w-3 mr-1" />
            NFC
          </div>
        )}
        {item.hasNFT && (
          <div className="absolute bottom-2 left-2 bg-zinc-800 text-purple-400 text-xs px-2 py-0.5 rounded-full flex items-center">
            <Sparkles className="h-3 w-3 mr-1" />
            NFT
          </div>
        )}

        <button
          className="absolute top-2 right-2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center z-10"
          onClick={handleToggleWishlist}
        >
          <motion.div animate={isAnimating ? { scale: [1, 1.5, 1] } : {}} transition={{ duration: 0.5 }}>
            <Heart className={`h-4 w-4 ${isWishlisted ? "text-red-500 fill-red-500" : "text-white"}`} />
          </motion.div>
        </button>
      </div>
      <CardContent className="p-3 bg-gradient-to-br from-zinc-900 to-zinc-950">
        <h3 className="font-medium truncate">{item.productName}</h3>
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center text-xs text-zinc-400">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatWearTime(item.totalWearTime)}</span>
          </div>
          <div className="flex items-center text-xs text-[#ffc72d]">
            <Image src="/shaka-banana-hand.png" alt="Tokens" width={12} height={12} className="mr-1" />
            <span>{item.tokenRewards}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
