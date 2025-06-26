"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Share2, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { TabBar } from "@/components/tab-bar"
import { useWishlist } from "@/hooks/use-wishlist"
import { toast } from "@/hooks/use-toast"
import { useWeb3 } from "@/components/web3-provider"

export default function NFTDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { address, balance } = useWeb3()
  const [nft, setNft] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState(false)

  useEffect(() => {
    // Simulate loading NFT data
    setTimeout(() => {
      const id = params.id as string

      // Mock NFT data
      const mockNft = {
        id,
        name: id.includes("420")
          ? "PMBC #420"
          : id.includes("721")
            ? "PMBC #721"
            : id.includes("999")
              ? "PMBC #999"
              : "PMBC #" + Math.floor(Math.random() * 1000),
        image: "/placeholder.svg?height=400&width=400&query=digital art NFT collection",
        description:
          "A unique collectible NFT from the Prime Mates Board Club collection. This NFT grants special access to exclusive events and merchandise.",
        price: id.includes("1") ? "1500" : id.includes("2") ? "850" : id.includes("3") ? "1200" : "950",
        rarity: id.includes("legendary")
          ? "legendary"
          : id.includes("epic")
            ? "epic"
            : id.includes("rare")
              ? "rare"
              : id.includes("7")
                ? "legendary"
                : "rare",
        seller: "0x71C7B4aA9Db5A9e2E585D1a8E646a8B3F93E4",
        tokenId: id.includes("420")
          ? "420"
          : id.includes("721")
            ? "721"
            : id.includes("999")
              ? "999"
              : String(Math.floor(Math.random() * 1000)),
        collection: "Prime Mates Board Club",
        attributes: [
          { trait_type: "Background", value: "Cosmic" },
          { trait_type: "Fur", value: "Golden" },
          { trait_type: "Eyes", value: "Laser" },
          { trait_type: "Clothing", value: "Hawaiian Shirt" },
          { trait_type: "Accessory", value: "Diamond Chain" },
        ],
      }

      setNft(mockNft)
      setIsLoading(false)
    }, 1000)
  }, [params])

  const handleToggleWishlist = () => {
    if (!nft) return

    const isAdded = toggleWishlist(nft.id)

    if (isAdded) {
      toast({
        title: "Added to wishlist",
        description: `${nft.name} has been added to your wishlist.`,
      })
    } else {
      toast({
        title: "Removed from wishlist",
        description: `${nft.name} has been removed from your wishlist.`,
      })
    }
  }

  const handleBuyNow = () => {
    if (!nft) return

    setIsPurchasing(true)

    // Simulate purchase process
    setTimeout(() => {
      toast({
        title: "Purchase successful!",
        description: `You have successfully purchased ${nft.name}.`,
      })

      router.push("/marketplace/purchase-success?id=" + nft.id)
    }, 2000)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-zinc-500"
      case "uncommon":
        return "bg-green-500"
      case "rare":
        return "bg-blue-500"
      case "epic":
        return "bg-purple-500"
      case "legendary":
        return "bg-yellow-500"
      default:
        return "bg-zinc-500"
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-zinc-400">Loading NFT details...</p>
      </div>
    )
  }

  if (!nft) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="bg-zinc-900 p-6 rounded-lg text-center">
          <h1 className="text-xl font-bold mb-4">NFT Not Found</h1>
          <p className="text-zinc-400 mb-6">The NFT you're looking for doesn't exist or has been removed.</p>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/marketplace">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">{nft.name}</h1>
          <div className="flex ml-auto">
            <Button variant="ghost" size="icon" onClick={handleToggleWishlist}>
              <Heart className={`h-5 w-5 ${isInWishlist(nft.id) ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
            <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
          </div>

          <div className="flex items-center justify-between mb-4">
            <Badge className={`${getRarityColor(nft.rarity)} text-white`}>
              {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
            </Badge>
            <div className="text-sm text-zinc-400">Token ID: {nft.tokenId}</div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">{nft.name}</h2>
            <p className="text-zinc-400 text-sm">{nft.description}</p>
          </div>

          <div className="mb-6">
            <div className="text-sm text-zinc-400 mb-1">Price</div>
            <div className="flex items-center">
              <Image src="/shaka-coin.png" alt="SHAKA" width={24} height={24} className="mr-2" />
              <span className="text-2xl font-bold">{nft.price}</span>
              <span className="text-lg font-bold text-primary ml-2">SHAKA</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-zinc-400 mb-2">Collection</div>
            <div className="flex items-center justify-between bg-zinc-900 rounded-lg p-3">
              <div className="flex items-center">
                <div className="w-10 h-10 relative rounded-lg overflow-hidden mr-3">
                  <Image src="/prime-mates-logo.png" alt={nft.collection} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-medium">{nft.collection}</h3>
                  <p className="text-xs text-zinc-400">Floor: 450 SHAKA</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-zinc-400 mb-2">Attributes</div>
            <div className="grid grid-cols-2 gap-2">
              {nft.attributes.map((attr: any, index: number) => (
                <div key={index} className="bg-zinc-900 rounded-lg p-2">
                  <div className="text-xs text-zinc-400">{attr.trait_type}</div>
                  <div className="font-medium truncate">{attr.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-zinc-400 mb-2">Owner</div>
            <div className="bg-zinc-900 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm truncate">{nft.seller}</div>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={handleBuyNow} disabled={isPurchasing}>
            {isPurchasing ? "Processing..." : "Buy Now"}
          </Button>
        </div>
      </div>

      <TabBar activeTab="wallet" />
    </div>
  )
}
