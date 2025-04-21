"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Search, Filter, Wallet, ArrowUpRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { NFTMarketCard } from "@/components/nft-market-card"
import { generateRandomNFTImage } from "@/lib/utils"
import { useWeb3 } from "@/components/web3-provider"

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { balance } = useWeb3()

  // Mock NFT marketplace data
  const featuredNFTs = [
    {
      id: "market-1",
      name: "Ultra Runner",
      image: generateRandomNFTImage(10),
      price: "1500",
      rarity: "legendary" as const,
      activity: "Running",
      seller: "0x71C...93E4",
    },
    {
      id: "market-2",
      name: "Pro Skater",
      image: generateRandomNFTImage(11),
      price: "850",
      rarity: "epic" as const,
      activity: "Skateboarding",
      seller: "0x45D...21B7",
    },
    {
      id: "market-3",
      name: "Wave Master",
      image: generateRandomNFTImage(12),
      price: "1200",
      rarity: "legendary" as const,
      activity: "Surfing",
      seller: "0x33A...F7C2",
    },
  ]

  const newNFTs = [
    {
      id: "market-4",
      name: "Snow Legend",
      image: generateRandomNFTImage(13),
      price: "750",
      rarity: "rare" as const,
      activity: "Snowboarding",
      seller: "0x91B...D3A5",
    },
    {
      id: "market-5",
      name: "Mountain Explorer",
      image: generateRandomNFTImage(14),
      price: "600",
      rarity: "epic" as const,
      activity: "Mountain Biking",
      seller: "0x62E...A8F1",
    },
    {
      id: "market-6",
      name: "Urban Cruiser",
      image: generateRandomNFTImage(15),
      price: "450",
      rarity: "rare" as const,
      activity: "Longboarding",
      seller: "0x51D...C4E9",
    },
  ]

  const popularNFTs = [
    {
      id: "market-7",
      name: "Marathon Elite",
      image: generateRandomNFTImage(16),
      price: "2000",
      rarity: "legendary" as const,
      activity: "Running",
      seller: "0x82F...B5D3",
    },
    {
      id: "market-8",
      name: "Surf Champion",
      image: generateRandomNFTImage(17),
      price: "1800",
      rarity: "legendary" as const,
      activity: "Surfing",
      seller: "0x73C...A2E7",
    },
    {
      id: "market-9",
      name: "BMX Trickster",
      image: generateRandomNFTImage(18),
      price: "950",
      rarity: "epic" as const,
      activity: "BMX",
      seller: "0x41B...F9C3",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">NFT Marketplace</h1>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Your Balance</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-burnz-500/20 p-3 rounded-full">
              <Wallet className="h-6 w-6 text-burnz-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {balance} <span className="text-burnz-500">BURNZ</span>
              </p>
              <p className="text-xs text-zinc-400">Available for purchases</p>
            </div>
          </div>
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

        <Tabs defaultValue="featured" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {featuredNFTs.map((nft) => (
                <NFTMarketCard
                  key={nft.id}
                  id={nft.id}
                  name={nft.name}
                  image={nft.image}
                  price={nft.price}
                  rarity={nft.rarity}
                  activity={nft.activity}
                  seller={nft.seller}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {newNFTs.map((nft) => (
                <NFTMarketCard
                  key={nft.id}
                  id={nft.id}
                  name={nft.name}
                  image={nft.image}
                  price={nft.price}
                  rarity={nft.rarity}
                  activity={nft.activity}
                  seller={nft.seller}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {popularNFTs.map((nft) => (
                <NFTMarketCard
                  key={nft.id}
                  id={nft.id}
                  name={nft.name}
                  image={nft.image}
                  price={nft.price}
                  rarity={nft.rarity}
                  activity={nft.activity}
                  seller={nft.seller}
                />
              ))}
            </div>
          </TabsContent>
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
