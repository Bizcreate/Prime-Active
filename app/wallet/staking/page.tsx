"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Info, ChevronsUp, Wallet, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { nftService, type NFT } from "@/services/nft-service"
import { useWeb3 } from "@/components/web3-provider"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StakingPage() {
  const { isConnected } = useWeb3()
  const [showSuccess, setShowSuccess] = useState(false)
  const [nfts, setNfts] = useState<NFT[]>([])
  const [stakedNfts, setStakedNfts] = useState<NFT[]>([])
  const [unstakedNfts, setUnstakedNfts] = useState<NFT[]>([])
  const [stakingRewards, setStakingRewards] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isStaking, setIsStaking] = useState(false)
  const [isUnstaking, setIsUnstaking] = useState(false)
  const [selectedNft, setSelectedNft] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Update staking rewards
        nftService.updateStakingRewards()

        // Get all NFTs
        const allNfts = nftService.getAllNFTs()
        setNfts(allNfts)

        // Get staked NFTs
        const staked = nftService.getStakedNFTs()
        setStakedNfts(staked)

        // Get unstaked NFTs
        const unstaked = nftService.getUnstakedNFTs()
        setUnstakedNfts(unstaked)

        // Get total staking rewards
        const rewards = nftService.getTotalStakingRewards()
        setStakingRewards(rewards)
      } catch (error) {
        console.error("Error loading staking data:", error)
        toast({
          title: "Error",
          description: "Failed to load staking data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  const handleStake = async (nftId: string) => {
    try {
      setIsStaking(true)
      setSelectedNft(nftId)

      // Simulate staking delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Stake the NFT
      nftService.stakeNFT(nftId)

      // Refresh data
      const allNfts = nftService.getAllNFTs()
      setNfts(allNfts)

      const staked = nftService.getStakedNFTs()
      setStakedNfts(staked)

      const unstaked = nftService.getUnstakedNFTs()
      setUnstakedNfts(unstaked)

      // Show success message
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)

      toast({
        title: "Staking Successful",
        description: "Your NFT has been staked and is now earning rewards.",
      })
    } catch (error) {
      console.error("Error staking NFT:", error)
      toast({
        title: "Staking Failed",
        description: "Failed to stake your NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStaking(false)
      setSelectedNft(null)
    }
  }

  const handleUnstake = async (nftId: string) => {
    try {
      setIsUnstaking(true)
      setSelectedNft(nftId)

      // Simulate unstaking delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Unstake the NFT and get rewards
      const rewards = nftService.unstakeNFT(nftId)

      // Refresh data
      const allNfts = nftService.getAllNFTs()
      setNfts(allNfts)

      const staked = nftService.getStakedNFTs()
      setStakedNfts(staked)

      const unstaked = nftService.getUnstakedNFTs()
      setUnstakedNfts(unstaked)

      // Update rewards
      const totalRewards = nftService.getTotalStakingRewards()
      setStakingRewards(totalRewards)

      toast({
        title: "Unstaking Successful",
        description: `Your NFT has been unstaked. You earned ${rewards} SHAKA tokens.`,
      })
    } catch (error) {
      console.error("Error unstaking NFT:", error)
      toast({
        title: "Unstaking Failed",
        description: "Failed to unstake your NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUnstaking(false)
      setSelectedNft(null)
    }
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

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/wallet">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-[#ffc72d]">NFT Staking</h1>
        </div>

        {!isConnected && (
          <div className="bg-zinc-900 rounded-lg p-4 mb-6 text-center">
            <h2 className="font-bold text-lg mb-3 text-[#ffc72d]">Connect Wallet to Stake</h2>
            <p className="text-sm text-zinc-400 mb-4">
              Connect your wallet to start staking your NFTs and earning rewards
            </p>
            <WalletConnectButton showBypass={false} />
          </div>
        )}

        {isConnected && (
          <div className="bg-zinc-900 rounded-lg p-4 mb-6">
            <h2 className="font-bold text-lg mb-3 text-[#ffc72d]">Staking Summary</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800 p-3 rounded-lg">
                <p className="text-xs text-zinc-400">Total Staked</p>
                <p className="text-lg font-bold text-[#ffc72d]">{stakedNfts.length} NFTs</p>
              </div>
              <div className="bg-zinc-800 p-3 rounded-lg">
                <p className="text-xs text-zinc-400">Daily Rewards</p>
                <p className="text-lg font-bold text-[#ffc72d]">+{stakingRewards} $SHKA</p>
              </div>
            </div>
          </div>
        )}

        {isConnected && (
          <div className="bg-zinc-900 rounded-lg p-4 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 z-0">
              <Image src="/winding-mountain-path.png" alt="Staking Background" fill className="object-cover" />
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#ffc72d]/20 flex items-center justify-center">
                  <ChevronsUp className="h-6 w-6 text-[#ffc72d]" />
                </div>
                <div>
                  <h2 className="font-bold text-[#ffc72d]">Your Staking Rewards</h2>
                  <div className="flex items-center gap-1">
                    <Image src="/shaka-coin.png" alt="Shaka Coins" width={16} height={16} className="object-contain" />
                    <span className="text-[#ffc72d] font-medium">{stakingRewards} $SHKA available</span>
                  </div>
                </div>
              </div>
              <Button size="sm" className="bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90">
                <Wallet className="h-4 w-4 mr-2" />
                Claim All
              </Button>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="bg-green-900/20 border border-green-900 rounded-lg p-4 mb-6 flex items-start gap-3">
            <div className="bg-green-500/20 p-2 rounded-full mt-1">
              <Info className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium text-green-400 mb-1">Staking Successful!</h3>
              <p className="text-sm text-zinc-300">
                Your NFTs are now staked and earning rewards. Check back daily to see your earnings grow!
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-400">Loading staking data...</p>
          </div>
        ) : (
          <>
            {/* Staked NFTs */}
            {stakedNfts.length > 0 && (
              <div className="mb-6">
                <h2 className="font-bold text-lg mb-3 text-[#ffc72d]">Staked NFTs</h2>
                <div className="grid grid-cols-2 gap-4">
                  {stakedNfts.map((nft) => (
                    <Card key={nft.id} className="bg-zinc-900 border-0 overflow-hidden">
                      <div className="relative aspect-square">
                        <Image
                          src={nft.image || "/placeholder.svg?height=200&width=200&query=nft"}
                          alt={nft.name}
                          fill
                          className="object-cover"
                        />
                        <Badge className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)} text-white`}>
                          {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
                        </Badge>
                        <Badge className="absolute top-2 left-2 bg-[#ffc72d] text-black">Staked</Badge>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm mb-1">{nft.name}</h3>
                        <div className="flex justify-between items-center text-xs text-zinc-400 mb-2">
                          <span>APY: {nft.stakingAPY}%</span>
                          <span>Rewards: {nft.earnedRewards}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-1"
                          onClick={() => handleUnstake(nft.id)}
                          disabled={isUnstaking && selectedNft === nft.id}
                        >
                          {isUnstaking && selectedNft === nft.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Unstaking...
                            </>
                          ) : (
                            "Unstake"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Unstaked NFTs */}
            {unstakedNfts.length > 0 && (
              <div className="mb-6">
                <h2 className="font-bold text-lg mb-3 text-[#ffc72d]">Available NFTs</h2>
                <div className="grid grid-cols-2 gap-4">
                  {unstakedNfts.map((nft) => (
                    <Card key={nft.id} className="bg-zinc-900 border-0 overflow-hidden">
                      <div className="relative aspect-square">
                        <Image
                          src={nft.image || "/placeholder.svg?height=200&width=200&query=nft"}
                          alt={nft.name}
                          fill
                          className="object-cover"
                        />
                        <Badge className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)} text-white`}>
                          {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
                        </Badge>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm mb-1">{nft.name}</h3>
                        <div className="flex justify-between items-center text-xs text-zinc-400 mb-2">
                          <span>APY: {nft.stakingAPY}%</span>
                          <span>Collection: PMBC</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-1 hover:bg-[#ffc72d] hover:text-black"
                          onClick={() => handleStake(nft.id)}
                          disabled={isStaking && selectedNft === nft.id}
                        >
                          {isStaking && selectedNft === nft.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Staking...
                            </>
                          ) : (
                            "Stake"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {nfts.length === 0 && (
              <div className="bg-zinc-900 rounded-lg p-6 text-center">
                <h3 className="font-bold text-lg mb-2">No NFTs Found</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  You don't have any NFTs to stake. Visit the marketplace to get some!
                </p>
                <Link href="/marketplace">
                  <Button className="bg-[#ffc72d] hover:bg-[#e6b328] text-black">Browse Marketplace</Button>
                </Link>
              </div>
            )}
          </>
        )}

        <div className="mt-6 bg-zinc-900 rounded-lg p-4">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Info className="h-5 w-5 text-[#ffc72d]" />
            <span className="text-[#ffc72d]">Staking Benefits</span>
          </h2>
          <p className="text-sm text-zinc-400 mb-3">
            Staking your Prime Mates Board Club NFTs allows you to earn passive Shaka Coins while supporting the
            community. The longer you stake, the more rewards you earn!
          </p>
          <div className="space-y-3 mb-3">
            <div className="bg-zinc-800 p-3 rounded-lg">
              <h3 className="font-medium text-sm mb-1 text-[#ffc72d]">Staking Periods</h3>
              <p className="text-xs text-zinc-400">
                Different NFTs have different staking periods. Rarer NFTs earn more rewards but may require longer
                staking periods.
              </p>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg">
              <h3 className="font-medium text-sm mb-1 text-[#ffc72d]">Cooldown Period</h3>
              <p className="text-xs text-zinc-400">
                After unstaking, NFTs enter a cooldown period before they can be staked again. During this time, you can
                claim your earned rewards.
              </p>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg">
              <h3 className="font-medium text-sm mb-1 text-[#ffc72d]">Reward Boosts</h3>
              <p className="text-xs text-zinc-400">
                Staking multiple NFTs from the same collection provides a boost to your rewards. Stake a complete set
                for maximum benefits!
              </p>
            </div>
          </div>
          <Link href="/rewards">
            <Button variant="outline" className="w-full">
              View All Rewards
            </Button>
          </Link>
        </div>
      </div>

      <TabBar activeTab="wallet" />
    </div>
  )
}
