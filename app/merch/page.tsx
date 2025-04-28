"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TabBar } from "@/components/tab-bar"
import {
  ShoppingBag,
  Shirt,
  Heart,
  Clock,
  Smartphone,
  Sparkles,
  ArrowLeft,
  Wallet,
  Copy,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { merchandiseService, type MerchandiseProduct } from "@/services/merchandise-service"
import { useWeb3 } from "@/components/web3-provider"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NFTMintingService } from "@/services/nft-minting-service"
import { AppShell } from "@/components/app-shell"

export default function MerchPage() {
  const [featuredItems, setFeaturedItems] = useState<MerchandiseProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [nfts, setNfts] = useState<any[]>([])
  const router = useRouter()
  const { address, balance } = useWeb3()
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()
  const { wishlist } = useWishlist()

  // Load featured items and NFTs
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      try {
        // Add a slight delay to simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get featured products
        const featured = merchandiseService.getFeaturedProducts()
        setFeaturedItems(featured)

        // Get user NFTs
        const userNfts = NFTMintingService.getUserNFTs()
        setNfts(userNfts)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle navigation
  const handleViewCollection = () => {
    router.push("/merch/collection")
  }

  const handleViewShop = () => {
    router.push("/store")
  }

  const handleViewWishlist = () => {
    router.push("/merch/wishlist")
  }

  const handleViewWearToEarn = () => {
    router.push("/merch/wear-to-earn")
  }

  // Copy address to clipboard
  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)

      toast({
        title: "Copied",
        description: "Address copied to clipboard!",
      })
    }
  }

  // Format address for display
  const formatAddress = (addr: string) => {
    if (!addr) return "Not connected"
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  return (
    <AppShell>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Merchandise</h1>
        </div>

        {/* Wallet Card - similar to the reference image */}
        <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-l-4 border-[#ffc72d] mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="h-5 w-5 text-[#ffc72d]" />
              <h2 className="text-lg font-bold">My Wallet</h2>
            </div>
            <p className="text-sm text-zinc-400 mb-3">Your digital assets</p>

            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-zinc-400">Address</div>
              <div className="flex items-center">
                <span className="font-mono text-sm mr-2">{formatAddress(address || "")}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyToClipboard}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-zinc-400">Balance</div>
              <div className="font-bold">{balance.toFixed(2)} ETH</div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Grid - with smaller squares as requested */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card
            className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-0 overflow-hidden cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={handleViewShop}
          >
            <CardContent className="p-3 flex flex-col items-center justify-center h-24">
              <ShoppingBag className="h-6 w-6 mb-2 text-[#ffc72d]" />
              <span className="text-center text-sm font-medium">Shop</span>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-0 overflow-hidden cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={handleViewCollection}
          >
            <CardContent className="p-3 flex flex-col items-center justify-center h-24">
              <Shirt className="h-6 w-6 mb-2 text-[#ffc72d]" />
              <span className="text-center text-sm font-medium">My Collection</span>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-0 overflow-hidden cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={handleViewWishlist}
          >
            <CardContent className="p-3 flex flex-col items-center justify-center h-24">
              <Heart className="h-6 w-6 mb-2 text-[#ffc72d]" />
              <span className="text-center text-sm font-medium">Wishlist</span>
              {wishlist && wishlist.length > 0 && (
                <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs h-5 min-w-5 flex items-center justify-center p-0">
                  {wishlist.length}
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-0 overflow-hidden cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={handleViewWearToEarn}
          >
            <CardContent className="p-3 flex flex-col items-center justify-center h-24">
              <Clock className="h-6 w-6 mb-2 text-[#ffc72d]" />
              <span className="text-center text-sm font-medium">Wear to Earn</span>
            </CardContent>
          </Card>
        </div>

        {/* NFC Merchandise Section */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-zinc-800 p-2 rounded-full">
              <Smartphone className="h-6 w-6 text-[#ffc72d]" />
            </div>
            <h2 className="text-lg font-bold">NFC Merchandise</h2>
          </div>
          <p className="text-zinc-400 mb-4">
            Connect your Prime Active merchandise to track wear time and earn tokens!
          </p>
          <Button className="w-full bg-[#ffc72d] hover:bg-[#e6b328] text-black" onClick={handleViewCollection}>
            View My Collection
          </Button>
        </div>

        {/* Tabs for NFTs and Tokens - like the wallet page */}
        <Tabs defaultValue="nfts" className="w-full mb-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>

          <TabsContent value="nfts" className="space-y-4">
            <h2 className="text-lg font-bold">NFTs</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                  <Card key={i} className="bg-zinc-900 animate-pulse h-48">
                    <CardContent className="p-0"></CardContent>
                  </Card>
                ))}
              </div>
            ) : !nfts || nfts.length === 0 ? (
              <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-0">
                <CardContent className="p-4 text-center">
                  <div className="bg-zinc-800 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Image src="/shaka-coin.png" alt="NFT" width={24} height={24} />
                  </div>
                  <h3 className="font-medium mb-2">No NFTs Found</h3>
                  <p className="text-sm text-zinc-400 mb-4">
                    Purchase merchandise with NFT or earn them through challenges
                  </p>
                  <Button className="w-full bg-[#ffc72d] hover:bg-[#e6b328] text-black" onClick={handleViewShop}>
                    Browse Store
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <motion.div className="grid grid-cols-2 gap-3" initial="hidden" animate="show">
                {nfts.map((nft) => (
                  <motion.div key={nft.id} className="bg-zinc-900 rounded-lg overflow-hidden relative">
                    <div className="relative h-40">
                      <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate">{nft.name}</h3>
                        <Sparkles className="h-4 w-4 text-[#ffc72d]" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-zinc-400 truncate">{nft.collection}</div>
                        <Link href={`/nft/${nft.id}`}>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="tokens" className="space-y-4">
            <h2 className="text-lg font-bold">Tokens</h2>
            {/* SHAKA token */}
            <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-0">
              <CardContent className="p-4 flex items-center">
                <div className="relative w-10 h-10 mr-3 flex-shrink-0">
                  <Image src="/shaka-coin.png" alt="SHAKA" fill className="object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">SHAKA</h3>
                  <div className="text-xs text-zinc-400">SHAKA</div>
                </div>
                <div className="font-bold text-lg">250</div>
              </CardContent>
            </Card>

            {/* Banana token */}
            <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-0">
              <CardContent className="p-4 flex items-center">
                <div className="relative w-10 h-10 mr-3 flex-shrink-0">
                  <Image src="/banana-icon.png" alt="Banana" fill className="object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Banana</h3>
                  <div className="text-xs text-zinc-400">BNNA</div>
                </div>
                <div className="font-bold text-lg">75</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Featured Items Section */}
        <h2 className="text-xl font-bold mb-4">Featured Items</h2>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-zinc-900 animate-pulse h-48">
                <CardContent className="p-0"></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {featuredItems.map((item) => (
              <Card
                key={item.id}
                className="bg-zinc-900 border-0 overflow-hidden cursor-pointer"
                onClick={() => router.push(`/store/${item.id}`)}
              >
                <CardContent className="p-0">
                  <div className="relative h-32 w-full bg-zinc-800">
                    <Image src={item.images[0] || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    {item.isNew && (
                      <div className="absolute top-2 right-2 bg-[#ffc72d] text-black text-xs px-2 py-1 rounded-full flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        NEW
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1 line-clamp-1">{item.name}</h3>
                    <p className="text-[#ffc72d] font-bold">${item.price.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={handleViewShop}>
            View All Products
          </Button>
        </div>
      </div>

      <TabBar activeTab="merch" />
    </AppShell>
  )
}
