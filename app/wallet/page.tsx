"use client"

import { useEffect } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, History, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, ExternalLink, Clock, Smartphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation"
import { nftService, type NFT } from "@/services/nft-service"
import { useToast } from "@/hooks/use-toast"
import { merchandiseWearService, type ConnectedMerchandise } from "@/services/merchandise-wear-service"
import { IoTeXMiningRewards } from "@/components/IoTeXMiningRewards"
import { useAppState } from "@/context/AppStateContext"
import { saveActivityToSupabase } from "@/services/supabase-service"

export function WalletContent() {
  const [walletAddress, setWalletAddress] = useState<string>("0x1234...5678")
  const [balance, setBalance] = useState<number>(250)
  const [stakingRewards, setStakingRewards] = useState<number>(0)
  const [nfts, setNfts] = useState<NFT[]>([])
  const [activeTab, setActiveTab] = useState<string>("nfts")
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const highlightId = searchParams.get("highlight")
  const { toast } = useToast()
  const [connectedItems, setConnectedItems] = useState<ConnectedMerchandise[]>([])
  const { activityState, setActivityState } = useAppState()

  useEffect(() => {
    // Load NFT data and update staking rewards
    const loadData = async () => {
      try {
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Update staking rewards
        nftService.updateStakingRewards()

        // Get all NFTs
        const allNfts = nftService.getAllNFTs()
        setNfts(allNfts)

        // Get total staking rewards
        const rewards = nftService.getTotalStakingRewards()
        setStakingRewards(rewards)

        // Load merchandise data
        const merchandise = merchandiseWearService.getConnectedMerchandise()
        setConnectedItems(merchandise)
      } catch (error) {
        console.error("Error loading wallet data:", error)
        toast({
          title: "Error",
          description: "Failed to load wallet data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [highlightId, toast])

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

  const handleActivityStart = (activity: string) => {
    setActivityState({ ...activityState, currentActivity: activity })
    saveActivityToSupabase(activity)
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-400">Loading wallet...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Wallet Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-800 p-3 rounded-full">
                <Image src="/shaka-coin.png" alt="Wallet" width={32} height={32} className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">My Wallet</h1>
                <div className="flex items-center text-sm text-zinc-500">
                  {walletAddress}
                  <button onClick={() => copyToClipboard(walletAddress)} className="ml-1 text-zinc-400">
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
            <Link href="/wallet/transactions">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-zinc-800">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-zinc-800 border-0">
              <CardContent className="p-4">
                <div className="text-sm text-zinc-400 mb-2">Balance</div>
                <div className="flex items-center gap-2">
                  <Image src="/shaka-coin.png" alt="ACTIVE" width={24} height={24} className="h-5 w-5" />
                  <div className="text-2xl font-bold">{balance}</div>
                </div>
                <div className="text-lg font-bold text-primary">ACTIVE</div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800 border-0">
              <CardContent className="p-4">
                <div className="text-sm text-zinc-400 mb-2">Staking Rewards</div>
                <div className="flex items-center gap-2">
                  <Image src="/shaka-coin.png" alt="ACTIVE" width={24} height={24} className="h-5 w-5" />
                  <div className="text-2xl font-bold">{stakingRewards} / day</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="nfts" onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-4 bg-zinc-800">
              <TabsTrigger value="nfts" className={activeTab === "nfts" ? "data-[state=active]:bg-zinc-900" : ""}>
                NFTs
              </TabsTrigger>
              <TabsTrigger
                value="merchandise"
                className={activeTab === "merchandise" ? "data-[state=active]:bg-zinc-900" : ""}
              >
                Merch
              </TabsTrigger>
              <TabsTrigger value="tokens" className={activeTab === "tokens" ? "data-[state=active]:bg-zinc-900" : ""}>
                Tokens
              </TabsTrigger>
              <TabsTrigger value="depin" className={activeTab === "depin" ? "data-[state=active]:bg-zinc-900" : ""}>
                DePIN
              </TabsTrigger>
            </TabsList>

            <TabsContent value="nfts" className="mt-4">
              {nfts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-zinc-400">No NFTs found</p>
                  <Link href="/marketplace">
                    <Button className="mt-4">Browse Marketplace</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {nfts.map((nft) => (
                    <Link href={`/nft/${nft.id}`} key={nft.id}>
                      <div className="bg-zinc-900 rounded-lg overflow-hidden">
                        <div className="relative aspect-square">
                          <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                          <Badge className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)} text-white`}>
                            {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
                          </Badge>
                          {nft.isStaked && (
                            <Badge className="absolute top-2 left-2 bg-[#ffc72d] text-black">Staked</Badge>
                          )}
                        </div>
                        <div className="p-2">
                          <h3 className="font-medium text-sm">{nft.name}</h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <Link href="/marketplace">
                  <Button variant="outline" className="w-full">
                    View NFT Marketplace
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="merchandise" className="mt-4">
              {connectedItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-zinc-400">No connected merchandise found</p>
                  <Link href="/merch/collection">
                    <Button className="mt-4">View Collection</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {connectedItems.map((item) => (
                      <Link href={`/merch/${item.id}`} key={item.id}>
                        <div className="bg-zinc-900 rounded-lg overflow-hidden">
                          <div className="relative aspect-square">
                            <Image
                              src={item.image || "/placeholder.svg?height=200&width=200&query=merchandise"}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                            {item.isCurrentlyWorn && (
                              <Badge className="absolute top-2 right-2 bg-[#ffc72d] text-black">Active</Badge>
                            )}
                            {item.hasNFC && (
                              <Badge className="absolute top-2 left-2 bg-zinc-800 text-[#ffc72d] flex items-center">
                                <Smartphone className="h-3 w-3 mr-1" />
                                NFC
                              </Badge>
                            )}
                          </div>
                          <div className="p-2">
                            <h3 className="font-medium text-sm">{item.productName}</h3>
                            <div className="text-xs text-zinc-400 flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              Worn: {formatWearTime(item.totalWearTime)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Link href="/merch/collection">
                      <Button variant="outline" className="w-full">
                        View Full Collection
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tokens" className="mt-4">
              <div className="space-y-4">
                <Card className="bg-zinc-900 border-0">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image src="/shaka-coin.png" alt="ACTIVE" width={40} height={40} className="h-10 w-10" />
                      <div>
                        <h3 className="font-medium">ACTIVE</h3>
                        <p className="text-xs text-zinc-400">Prime Active Token</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold">{balance}</div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-0">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image src="/shaka-coin.png" alt="SHAKA" width={40} height={40} className="h-10 w-10" />
                      <div>
                        <h3 className="font-medium">SHAKA</h3>
                        <p className="text-xs text-zinc-400">Shaka Tokens</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold">75</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="depin" className="mt-4">
              <div className="space-y-4">
                <Card className="bg-zinc-900 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Image src="/iotex-logo.png" alt="IoTeX" width={24} height={24} className="h-6 w-6" />
                        <h3 className="font-medium">IoTeX Mining</h3>
                      </div>
                      <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
                        Active
                      </Badge>
                    </div>

                    <IoTeXMiningRewards />
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/helium-mobile-logo.png"
                          alt="Helium Mobile"
                          width={24}
                          height={24}
                          className="h-6 w-6"
                        />
                        <h3 className="font-medium">Helium Mobile</h3>
                      </div>
                      <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700">
                        Inactive
                      </Badge>
                    </div>

                    <div className="text-center py-4">
                      <p className="text-zinc-400 text-sm">Connect your Helium Mobile account to earn MOBILE tokens</p>
                      <Button className="mt-3" size="sm">
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("tokens")
  const { activityState } = useAppState()

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Wallet</h1>
        </div>

        <WalletContent />

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link href="/wallet/token-history">
            <Button variant="outline" className="w-full flex items-center gap-2">
              <History className="h-4 w-4" />
              Token History
            </Button>
          </Link>
          <Link href="/wallet/token-conversion">
            <Button variant="outline" className="w-full flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Convert Tokens
            </Button>
          </Link>
        </div>
      </div>

      <TabBar activeTab="wallet" />
    </div>
  )
}
