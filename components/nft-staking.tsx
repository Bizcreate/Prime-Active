"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Check, Loader2, Lock, Unlock, Clock, ChevronsUp, Info, Plus } from "lucide-react"
import { useWeb3 } from "@/components/web3-provider"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"

interface NFTStakingProps {
  onSuccess?: () => void
}

type StakingStatus = "unstaked" | "staking" | "staked" | "claiming" | "cooldown"

interface StakableNFT {
  id: string
  name: string
  image: string
  collection: string
  rarity: string
  stakingStatus: StakingStatus
  stakingRewards: number
  stakingPeriod: number
  stakingProgress: number
  selected?: boolean
  stakedAt?: string
  unlockAt?: string
}

export default function NFTStaking({ onSuccess }: NFTStakingProps) {
  const { isConnected, connectWallet, ownedNFTs, stakedNFTs } = useWeb3()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stakableNFTs, setStakableNFTs] = useState<StakableNFT[]>([])
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([])
  const [isStaking, setIsStaking] = useState(false)
  const [stakingSuccess, setStakingSuccess] = useState(false)

  // Load stakable NFTs when wallet is connected
  useEffect(() => {
    if (isConnected) {
      // Convert owned NFTs to stakable format
      const ownedStakable = ownedNFTs.map((nft) => ({
        ...nft,
        stakingStatus: "unstaked" as StakingStatus,
        stakingProgress: 0,
      }))

      // Use staked NFTs as is
      const stakedItems = stakedNFTs.map((nft) => ({
        ...nft,
        stakingStatus: "staked" as StakingStatus,
      }))

      setStakableNFTs([...ownedStakable, ...stakedItems])
    } else {
      setStakableNFTs([])
    }
  }, [isConnected, ownedNFTs, stakedNFTs])

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      setError(null)
      setIsLoading(true)
      await connectWallet()
    } catch (err) {
      console.error("Error connecting wallet:", err)
      setError("Failed to connect wallet. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle NFT selection
  const toggleNFTSelection = (nftId: string) => {
    if (selectedNFTs.includes(nftId)) {
      setSelectedNFTs(selectedNFTs.filter((id) => id !== nftId))
    } else {
      setSelectedNFTs([...selectedNFTs, nftId])
    }
  }

  // Handle staking
  const handleStakeNFTs = async () => {
    try {
      setError(null)
      setIsStaking(true)

      // Simulate staking delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update staking status for selected NFTs
      setStakableNFTs((prevNFTs) =>
        prevNFTs.map((nft) =>
          selectedNFTs.includes(nft.id)
            ? {
                ...nft,
                stakingStatus: "staking",
                stakingProgress: 5,
                stakedAt: new Date().toISOString(),
                unlockAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * nft.stakingPeriod).toISOString(),
              }
            : nft,
        ),
      )

      setStakingSuccess(true)
      setSelectedNFTs([])

      // If onSuccess callback is provided, call it
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess()
      }
    } catch (err) {
      console.error("Error staking NFTs:", err)
      setError("Failed to stake NFTs. Please try again.")
    } finally {
      setIsStaking(false)
    }
  }

  // Handle unstaking
  const handleUnstakeNFT = async (nftId: string) => {
    try {
      setError(null)

      // Update staking status for the NFT
      setStakableNFTs((prevNFTs) =>
        prevNFTs.map((nft) => (nft.id === nftId ? { ...nft, stakingStatus: "cooldown", stakingProgress: 100 } : nft)),
      )
    } catch (err) {
      console.error("Error unstaking NFT:", err)
      setError("Failed to unstake NFT. Please try again.")
    }
  }

  // Handle claiming rewards
  const handleClaimRewards = async (nftId: string) => {
    try {
      setError(null)

      // Update staking status for the NFT
      setStakableNFTs((prevNFTs) =>
        prevNFTs.map((nft) => (nft.id === nftId ? { ...nft, stakingStatus: "unstaked", stakingProgress: 0 } : nft)),
      )
    } catch (err) {
      console.error("Error claiming rewards:", err)
      setError("Failed to claim rewards. Please try again.")
    }
  }

  // Get status text and color
  const getStatusInfo = (status: StakingStatus) => {
    switch (status) {
      case "unstaked":
        return { text: "Ready to Stake", color: "text-blue-400", bgColor: "bg-blue-900/20" }
      case "staking":
        return { text: "Staking", color: "text-yellow-400", bgColor: "bg-yellow-900/20" }
      case "staked":
        return { text: "Staked", color: "text-green-400", bgColor: "bg-green-900/20" }
      case "claiming":
        return { text: "Claiming", color: "text-purple-400", bgColor: "bg-purple-900/20" }
      case "cooldown":
        return { text: "Cooldown", color: "text-red-400", bgColor: "bg-red-900/20" }
      default:
        return { text: "Unknown", color: "text-zinc-400", bgColor: "bg-zinc-900/20" }
    }
  }

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Image src="/shaka-coin.png" alt="Prime Mates Board Club" width={40} height={40} className="object-contain" />
          <CardTitle className="flex items-center gap-2">
            <ChevronsUp className="h-5 w-5 text-[#ffc72d]" />
            NFT Staking
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-900/20 border border-red-900 rounded-md p-3 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {stakingSuccess && (
          <div className="bg-green-900/20 border border-green-900 rounded-md p-3 mb-4 flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-500">
              NFTs successfully staked! You'll start earning rewards immediately.
            </p>
          </div>
        )}

        <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-[#ffc72d]" />
            Staking Benefits
          </h3>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li className="flex items-center gap-2">
              <div className="bg-[#ffc72d]/20 p-1 rounded-full">
                <Check className="h-3 w-3 text-[#ffc72d]" />
              </div>
              <span>
                Earn passive <span className="text-[#ffc72d] font-medium">Shaka Coins</span> daily
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="bg-[#ffc72d]/20 p-1 rounded-full">
                <Check className="h-3 w-3 text-[#ffc72d]" />
              </div>
              <span>
                Unlock exclusive <span className="text-[#ffc72d] font-medium">Board Club</span> challenges
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="bg-[#ffc72d]/20 p-1 rounded-full">
                <Check className="h-3 w-3 text-[#ffc72d]" />
              </div>
              <span>
                Boost your <span className="text-[#ffc72d] font-medium">activity rewards</span> by up to 3x
              </span>
            </li>
          </ul>
        </div>

        {!isConnected ? (
          <div className="text-center py-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-2 text-[#ffc72d]">Connect Wallet to Stake</h2>
              {/* Existing wallet connection UI */}
            </div>
            <div className="mb-4 mx-auto w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
              <Lock className="h-8 w-8 text-zinc-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Connect Wallet to Stake</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Connect your wallet to view and stake your Prime Mates NFTs for rewards
            </p>
            <Button
              onClick={handleConnectWallet}
              disabled={isLoading}
              className="w-full bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </div>
        ) : stakableNFTs.length === 0 ? (
          <div className="text-center py-6">
            <div className="mb-4 mx-auto w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-zinc-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">No Stakable NFTs Found</h3>
            <p className="text-zinc-400 text-sm mb-4">
              You don't have any Prime Mates NFTs that can be staked. Visit the marketplace to get some!
            </p>
            <Button className="w-full bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90">Browse Marketplace</Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Your Stakable NFTs</h3>
              {selectedNFTs.length > 0 && (
                <Button
                  size="sm"
                  onClick={handleStakeNFTs}
                  disabled={isStaking}
                  className="bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90"
                >
                  {isStaking ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Staking...
                    </>
                  ) : (
                    <>
                      Stake {selectedNFTs.length} NFT{selectedNFTs.length !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {stakableNFTs.map((nft) => {
                const { text: statusText, color: statusColor, bgColor } = getStatusInfo(nft.stakingStatus)
                const isSelectable = nft.stakingStatus === "unstaked"
                const isSelected = selectedNFTs.includes(nft.id)

                return (
                  <div
                    key={nft.id}
                    className={`bg-zinc-800 rounded-lg overflow-hidden border ${
                      isSelected ? "border-[#ffc72d]" : "border-zinc-700"
                    } transition-all ${isSelectable ? "cursor-pointer hover:border-[#ffc72d]/50" : ""}`}
                    onClick={() => isSelectable && toggleNFTSelection(nft.id)}
                  >
                    <div className="flex p-3">
                      <div className="w-16 h-16 rounded-md overflow-hidden mr-3 relative">
                        <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                        {isSelectable && (
                          <div
                            className={`absolute inset-0 flex items-center justify-center bg-black/50 ${
                              isSelected ? "opacity-100" : "opacity-0 hover:opacity-100"
                            } transition-opacity`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full ${
                                isSelected ? "bg-[#ffc72d]" : "bg-zinc-700"
                              } flex items-center justify-center`}
                            >
                              {isSelected ? (
                                <Check className="h-4 w-4 text-black" />
                              ) : (
                                <Plus className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{nft.name}</h4>
                            <p className="text-xs text-zinc-400">{nft.collection}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs ${statusColor} ${bgColor}`}>{statusText}</div>
                        </div>

                        {nft.stakingStatus !== "unstaked" && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Staking Progress</span>
                              <span className="text-[#ffc72d]">{nft.stakingProgress}%</span>
                            </div>
                            <Progress value={nft.stakingProgress} className="h-1.5" indicatorClassName="bg-[#ffc72d]" />

                            {nft.stakedAt && nft.unlockAt && (
                              <div className="flex justify-between text-xs mt-1 text-zinc-400">
                                <span>Staked: {formatDate(nft.stakedAt)}</span>
                                <span>Unlock: {formatDate(nft.unlockAt)}</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-1 text-xs">
                            <Image
                              src="/shaka-coin.png"
                              alt="Rewards"
                              width={12}
                              height={12}
                              className="object-contain"
                            />
                            <span className="text-[#ffc72d] font-medium">+{nft.stakingRewards}/day</span>
                          </div>

                          {nft.stakingStatus === "staked" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleUnstakeNFT(nft.id)
                              }}
                            >
                              <Unlock className="h-3 w-3 mr-1" />
                              Unstake
                            </Button>
                          )}

                          {nft.stakingStatus === "cooldown" && (
                            <Button
                              size="sm"
                              className="h-7 text-xs bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleClaimRewards(nft.id)
                              }}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Claim Rewards
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="w-full p-3 bg-zinc-800 rounded-lg">
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2 text-[#ffc72d]">Staking Summary</h2>
            {/* Existing staking summary UI */}
          </div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-sm">Staking Summary</h4>
            <div className="flex items-center gap-1 text-xs bg-[#ffc72d]/20 px-2 py-1 rounded-full">
              <Clock className="h-3 w-3 text-[#ffc72d]" />
              <span className="text-[#ffc72d]">Updated daily</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-zinc-900 p-2 rounded-lg">
              <p className="text-xs text-zinc-400">Staked NFTs</p>
              <p className="text-lg font-bold text-[#ffc72d]">
                {stakableNFTs.filter((nft) => nft.stakingStatus === "staked" || nft.stakingStatus === "staking").length}
              </p>
            </div>
            <div className="bg-zinc-900 p-2 rounded-lg">
              <p className="text-xs text-zinc-400">Daily Rewards</p>
              <div className="flex items-center justify-center gap-1">
                <Image src="/shaka-coin.png" alt="Rewards" width={14} height={14} className="object-contain" />
                <p className="text-lg font-bold text-[#ffc72d]">
                  {stakableNFTs
                    .filter((nft) => nft.stakingStatus === "staked" || nft.stakingStatus === "staking")
                    .reduce((total, nft) => total + nft.stakingRewards, 0)}
                </p>
              </div>
            </div>
            <div className="bg-zinc-900 p-2 rounded-lg">
              <p className="text-xs text-zinc-400">Boost</p>
              <p className="text-lg font-bold text-green-400">+25%</p>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
