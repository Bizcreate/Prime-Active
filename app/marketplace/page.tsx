"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Search, Filter, Heart, ArrowUpRight, Copy } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import { nftService, PMBC_CONTRACT_ADDRESS } from "@/services/nft-service"

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("featured")
  const [nfts, setNfts] = useState<Record<string, any[]>>({
    featured: [],
    new: [],
    popular: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const { wishlistItems, toggleWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  // Load NFTs
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // Get NFTs from service
        const allNfts = nftService.getAllNFTs()

        // Create marketplace listings from NFTs
        const marketplaceNfts = allNfts.map((nft) => ({
          id: nft.id,
          name: nft.name,
          image: nft.image,
          price: String(Math.floor(Math.random() * 1000) + 500), // Random price
          rarity: nft.rarity,
          activity: ["Skateboarding", "Surfing", "Snowboarding"][Math.floor(Math.random() * 3)],
          seller: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          contractAddress: nft.contractAddress,
        }))

        // Shuffle and distribute to categories
        const shuffled = [...marketplaceNfts].sort(() => 0.5 - Math.random())

        setNfts({
          featured: shuffled.slice(0, 3),
          new: shuffled.slice(3, 6),
          popular: shuffled.slice(0, 3).reverse(),
        })
      } catch (error) {
        console.error("Error loading marketplace data:", error)
        toast({
          title: "Error",
          description: "Failed to load marketplace data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  // Handle adding to wishlist
  const handleToggleWishlist = (nft: any) => {
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

  // Filter NFTs based on search query
  const filterNFTs = (nftList: any[]) => {
    if (!searchQuery) return nftList

    return nftList.filter(
      (nft) =>
        nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.activity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.seller.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/wallet">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">NFT Marketplace</h1>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search NFTs..."
            className="pl-9 bg-zinc-900 border-zinc-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Collection Info */}
        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 relative rounded-lg overflow-hidden">
              <Image src="/prime-mates-logo.png" alt="Prime Mates Board Club" fill className="object-cover" />
            </div>
            <div>
              <h2 className="font-bold">Prime Mates Board Club</h2>
              <p className="text-xs text-zinc-400 flex items-center">
                <span className="font-mono mr-1">
                  {PMBC_CONTRACT_ADDRESS.substring(0, 6)}...
                  {PMBC_CONTRACT_ADDRESS.substring(PMBC_CONTRACT_ADDRESS.length - 4)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => navigator.clipboard.writeText(PMBC_CONTRACT_ADDRESS)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-zinc-800 p-2 rounded-lg">
              <p className="text-zinc-400">Floor</p>
              <p className="font-bold">450 SHAKA</p>
            </div>
            <div className="bg-zinc-800 p-2 rounded-lg">
              <p className="text-zinc-400">Volume</p>
              <p className="font-bold">24.5K SHAKA</p>
            </div>
            <div className="bg-zinc-800 p-2 rounded-lg">
              <p className="text-zinc-400">Items</p>
              <p className="font-bold">10,000</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="featured" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <TabsContent value="featured" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {filterNFTs(nfts.featured).map((nft) => (
                    <div key={nft.id} className="relative">
                      <Link href={`/marketplace/${nft.id}`}>
                        <div className="bg-zinc-900 rounded-lg overflow-hidden">
                          <div className="relative aspect-square">
                            <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                            <Badge
                              className={`absolute top-2 right-2 ${
                                nft.rarity === "legendary"
                                  ? "bg-yellow-500"
                                  : nft.rarity === "epic"
                                    ? "bg-purple-500"
                                    : nft.rarity === "rare"
                                      ? "bg-blue-500"
                                      : "bg-zinc-500"
                              } text-black font-bold`}
                            >
                              {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
                            </Badge>
                          </div>
                          <div className="p-3">
                            <div className="flex justify-between items-center">
                              <h3 className="font-bold">{nft.name}</h3>
                              <div className="flex items-center">
                                <Image src="/shaka-coin.png" alt="SHAKA" width={16} height={16} className="mr-1" />
                                <span className="text-primary">{nft.price}</span>
                              </div>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1">Seller: {nft.seller}</p>
                          </div>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 left-2 h-8 w-8 rounded-full bg-black/50"
                        onClick={() => handleToggleWishlist(nft)}
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist(nft.id) ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="new" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {filterNFTs(nfts.new).map((nft) => (
                    <div key={nft.id} className="relative">
                      <Link href={`/marketplace/${nft.id}`}>
                        <div className="bg-zinc-900 rounded-lg overflow-hidden">
                          <div className="relative aspect-square">
                            <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                            <Badge
                              className={`absolute top-2 right-2 ${
                                nft.rarity === "legendary"
                                  ? "bg-yellow-500"
                                  : nft.rarity === "epic"
                                    ? "bg-purple-500"
                                    : nft.rarity === "rare"
                                      ? "bg-blue-500"
                                      : "bg-zinc-500"
                              } text-black font-bold`}
                            >
                              {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
                            </Badge>
                          </div>
                          <div className="p-3">
                            <div className="flex justify-between items-center">
                              <h3 className="font-bold">{nft.name}</h3>
                              <div className="flex items-center">
                                <Image src="/shaka-coin.png" alt="SHAKA" width={16} height={16} className="mr-1" />
                                <span className="text-primary">{nft.price}</span>
                              </div>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1">Seller: {nft.seller}</p>
                          </div>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 left-2 h-8 w-8 rounded-full bg-black/50"
                        onClick={() => handleToggleWishlist(nft)}
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist(nft.id) ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="popular" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {filterNFTs(nfts.popular).map((nft) => (
                    <div key={nft.id} className="relative">
                      <Link href={`/marketplace/${nft.id}`}>
                        <div className="bg-zinc-900 rounded-lg overflow-hidden">
                          <div className="relative aspect-square">
                            <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                            <Badge
                              className={`absolute top-2 right-2 ${
                                nft.rarity === "legendary"
                                  ? "bg-yellow-500"
                                  : nft.rarity === "epic"
                                    ? "bg-purple-500"
                                    : nft.rarity === "rare"
                                      ? "bg-blue-500"
                                      : "bg-zinc-500"
                              } text-black font-bold`}
                            >
                              {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
                            </Badge>
                          </div>
                          <div className="p-3">
                            <div className="flex justify-between items-center">
                              <h3 className="font-bold">{nft.name}</h3>
                              <div className="flex items-center">
                                <Image src="/shaka-coin.png" alt="SHAKA" width={16} height={16} className="mr-1" />
                                <span className="text-primary">{nft.price}</span>
                              </div>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1">Seller: {nft.seller}</p>
                          </div>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 left-2 h-8 w-8 rounded-full bg-black/50"
                        onClick={() => handleToggleWishlist(nft)}
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist(nft.id) ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>

        <div className="flex justify-center">
          <Link href="/marketplace/sell">
            <Button className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4" />
              Sell Your NFT
            </Button>
          </Link>
        </div>
      </div>

      <TabBar activeTab="wallet" />
    </main>
  )
}
