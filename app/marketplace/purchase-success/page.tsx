"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { TabBar } from "@/components/tab-bar"
import confetti from "canvas-confetti"

export default function PurchaseSuccessPage() {
  const searchParams = useSearchParams()
  const nftId = searchParams.get("id")
  const [nft, setNft] = useState<any>(null)

  useEffect(() => {
    // Trigger confetti animation on load
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        }),
      )
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        }),
      )
    }, 250)

    // Mock NFT data based on ID
    const fetchNftData = () => {
      const mockNft = {
        id: nftId,
        name: nftId?.includes("420")
          ? "PMBC #420"
          : nftId?.includes("721")
            ? "PMBC #721"
            : nftId?.includes("999")
              ? "PMBC #999"
              : "PMBC #" + Math.floor(Math.random() * 1000),
        image: "/placeholder.svg?height=400&width=400&query=digital art NFT collection",
        price: nftId?.includes("1") ? "1500" : nftId?.includes("2") ? "850" : nftId?.includes("3") ? "1200" : "950",
        rarity: nftId?.includes("legendary")
          ? "legendary"
          : nftId?.includes("epic")
            ? "epic"
            : nftId?.includes("rare")
              ? "rare"
              : nftId?.includes("7")
                ? "legendary"
                : "rare",
        tokenId: nftId?.includes("420")
          ? "420"
          : nftId?.includes("721")
            ? "721"
            : nftId?.includes("999")
              ? "999"
              : String(Math.floor(Math.random() * 1000)),
        collection: "Prime Mates Board Club",
      }

      setNft(mockNft)
    }

    fetchNftData()

    return () => clearInterval(interval)
  }, [nftId])

  if (!nft) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-zinc-400">Loading transaction details...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/wallet">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Purchase Successful</h1>
        </div>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Congratulations!</h2>
          <p className="text-zinc-400 mb-4">
            You have successfully purchased {nft.name} from the {nft.collection} collection.
          </p>
        </div>

        <div className="bg-zinc-900 rounded-lg overflow-hidden mb-6">
          <div className="relative aspect-square">
            <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold mb-1">{nft.name}</h3>
            <p className="text-sm text-zinc-400 mb-2">{nft.collection}</p>
            <div className="flex items-center">
              <Image src="/shaka-coin.png" alt="SHAKA" width={20} height={20} className="mr-1" />
              <span className="text-primary font-bold">{nft.price} SHAKA</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link href={`/nft/${nft.id}`}>
            <Button className="w-full">View My NFT</Button>
          </Link>
          <Button variant="outline" className="w-full">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Link href="/marketplace">
            <Button variant="ghost" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      <TabBar activeTab="wallet" />
    </div>
  )
}
