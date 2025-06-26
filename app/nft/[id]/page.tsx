"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Share2, ExternalLink, Copy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { TabBar } from "@/components/tab-bar"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/components/web3-provider"
import { nftService, type NFT, PMBC_CONTRACT_ADDRESS } from "@/services/nft-service"

export default function NFTDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { address, balance } = useWeb3()
  const [nft, setNft] = useState<NFT | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load NFT data
    const loadData = async () => {
      try {
        setIsLoading(true)
        const id = params.id as string

        // Get NFT from service
        const nftData = nftService.getNFTById(id)

        if (nftData) {
          setNft(nftData)
        } else {
          // If not found, create a mock NFT
          const mockNft: NFT = {
            id,
            name: id.includes("420")
              ? "PMBC #420"
              : id.includes("721")
                ? "PMBC #721"
                : id.includes("999")
                  ? "PMBC #999"
                  : "PMBC #" + Math.floor(Math.random() * 1000),
            image: "/digital-art-collection.png",
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
            tokenId: id.includes("420")
              ? "420"
              : id.includes("721")
                ? "721"
                : id.includes("999")
                  ? "999"
                  : String(Math.floor(Math.random() * 1000)),
            collection: "Prime Mates Board Club",
            contractAddress: PMBC_CONTRACT_ADDRESS,
            attributes: [
              { trait_type: "Background", value: "Cosmic" },
              { trait_type: "Fur", value: "Golden" },
              { trait_type: "Eyes", value: "Laser" },
              { trait_type: "Clothing", value: "Hawaiian Shirt" },
              { trait_type: "Accessory", value: "Diamond Chain" },
            ],
          } as any

          setNft(mockNft)
        }
      } catch (error) {
        console.error("Error loading NFT:", error)
        toast({
          title: "Error",
          description: "Failed to load NFT details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params, toast])

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copied",
          description: "Address copied to clipboard!",
        })
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
        toast({
          title: "Error",
          description: "Failed to copy address to clipboard.",
          variant: "destructive",
        })
      })
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
          <div className="relative aspect-square w-full mb-4">
            <Image
              src={nft?.image || "/placeholder.svg?height=400&width=400&query=nft"}
              alt={nft?.name || "NFT"}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <Badge className={`${getRarityColor(nft.rarity)} text-white`}>
              {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
            </Badge>
            <div className="text-sm text-zinc-400">Token ID: {nft.tokenId}</div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">{nft.name}</h2>
            <p className="text-zinc-400 text-sm">
              {nft.description || "A unique collectible NFT from the Prime Mates Board Club collection."}
            </p>
          </div>

          {/* Contract Address */}
          <div className="mb-4">
            <div className="text-sm text-zinc-400 mb-2">Contract Address</div>
            <div className="bg-zinc-900 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm truncate">{nft.contractAddress}</div>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(nft.contractAddress || "")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Price (if in marketplace) */}
          {(nft as any).price && (
            <div className="mb-6">
              <div className="text-sm text-zinc-400 mb-1">Price</div>
              <div className="flex items-center">
                <Image src="/shaka-coin.png" alt="SHAKA" width={24} height={24} className="mr-2" />
                <span className="text-2xl font-bold">{(nft as any).price}</span>
                <span className="text-lg font-bold text-primary ml-2">SHAKA</span>
              </div>
            </div>
          )}

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

          {/* Attributes */}
          {(nft as any).attributes && (
            <div className="mb-6">
              <div className="text-sm text-zinc-400 mb-2">Attributes</div>
              <div className="grid grid-cols-2 gap-2">
                {(nft as any).attributes.map((attr: any, index: number) => (
                  <div key={index} className="bg-zinc-900 rounded-lg p-2">
                    <div className="text-xs text-zinc-400">{attr.trait_type}</div>
                    <div className="font-medium truncate">{attr.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Owner */}
          {(nft as any).seller && (
            <div className="mb-4">
              <div className="text-sm text-zinc-400 mb-2">Owner</div>
              <div className="bg-zinc-900 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm truncate">{(nft as any).seller}</div>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Buy button (if in marketplace) */}
          {(nft as any).price && (
            <Button className="w-full" onClick={handleBuyNow} disabled={isPurchasing}>
              {isPurchasing ? "Processing..." : "Buy Now"}
            </Button>
          )}

          {/* Stake/Unstake button (if owned) */}
          {nft.isStaked !== undefined && (
            <Button
              className={`w-full mt-4 ${nft.isStaked ? "bg-red-500 hover:bg-red-600" : "bg-[#ffc72d] hover:bg-[#e6b328] text-black"}`}
              onClick={() => router.push(`/staking?nft=${nft.id}`)}
            >
              {nft.isStaked ? "Manage Staking" : "Stake This NFT"}
            </Button>
          )}
        </div>
      </div>

      <TabBar activeTab="wallet" />
    </div>
  )
}
