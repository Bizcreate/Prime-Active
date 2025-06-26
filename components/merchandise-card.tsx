"use client"

import type React from "react"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/hooks/use-wishlist"

interface MerchandiseCardProps {
  id: string
  name: string
  price: number
  image: string
  rating?: number
  reviews?: number
  bananaPoints?: number
  isNew?: boolean
  isLimited?: boolean
  hasNFC?: boolean
  onClick?: () => void
}

export function MerchandiseCard({
  id,
  name,
  price,
  image,
  rating = 0,
  reviews = 0,
  bananaPoints = 0,
  isNew = false,
  isLimited = false,
  hasNFC = false,
  onClick,
}: MerchandiseCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const inWishlist = isInWishlist(id)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (inWishlist) {
      removeFromWishlist(id)
    } else {
      addToWishlist({
        id,
        name,
        price,
        image,
        bananaPoints,
        hasNFC,
        isLimited,
      })
    }
  }

  return (
    <Card
      className="bg-zinc-900 border-0 overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative h-40 w-full bg-zinc-800">
          <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {isNew && <Badge className="bg-[#ffc72d] text-black">New</Badge>}
            {isLimited && <Badge className="bg-purple-600">Limited</Badge>}
            {hasNFC && <Badge className="bg-blue-600">NFC</Badge>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 h-8 w-8 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-white"}`} />
          </Button>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm mb-1 line-clamp-1">{name}</h3>
          <div className="flex justify-between items-center">
            <p className="text-[#ffc72d] font-bold">${price.toFixed(2)}</p>
            {rating > 0 && (
              <div className="flex items-center text-xs text-zinc-400">
                <Star className="h-3 w-3 mr-1 text-[#ffc72d]" />
                {rating}
              </div>
            )}
          </div>
          {bananaPoints > 0 && (
            <div className="flex items-center mt-1">
              <Image src="/shaka-banana-hand.png" alt="Banana Points" width={12} height={12} />
              <span className="text-xs text-[#ffc72d] ml-1">{bananaPoints} pts</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
