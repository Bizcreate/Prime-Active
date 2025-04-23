"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"
import { useWeb3 } from "@/components/web3-provider"
import { Badge } from "@/components/ui/badge"
import { NFTVerification } from "@/components/nft-verification"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import Image from "next/image"
import { NFTCommunityRewards } from "@/components/nft-community-rewards"

export default function RewardsPage() {
  const { isConnected, points, hasAccess, ownedNFTs } = useWeb3()
  const [activeTab, setActiveTab] = useState("available")

  // Define rewards with point requirements
  const rewards = [
    {
      id: "reward1",
      name: "Exclusive NFT Drop",
      description: "Get early access to our next NFT drop",
      pointsRequired: 100,
      image: "/banana-shredder.png",
      category: "nft",
    },
    {
      id: "reward2",
      name: "Premium Activity Tracking",
      description: "Unlock advanced activity tracking features",
      pointsRequired: 200,
      image: "/banana-fueled-fitness.png",
      category: "feature",
    },
    {
      id: "reward3",
      name: "Banana Board Stickers",
      description: "Limited edition Prime Mates stickers for your board",
      pointsRequired: 300,
      image: "/banana-board-stickers.png",
      category: "gear",
    },
    {
      id: "reward4",
      name: "VIP Challenge Access",
      description: "Access to exclusive challenges with higher rewards",
      pointsRequired: 500,
      image: "/placeholder.svg?height=200&width=400&query=vip+access+badge+with+banana",
      category: "challenge",
    },
    {
      id: "reward5",
      name: "Prime Mates Profile Badge",
      description: "Show off your status with a custom profile badge",
      pointsRequired: 750,
      image: "/placeholder.svg?height=200&width=400&query=profile+badge+with+banana+and+shaka+sign",
      category: "badge",
    },
  ]

  // Filter rewards based on active tab and points
  const filteredRewards = rewards.filter((reward) => {
    if (activeTab === "available") {
      return hasAccess && points >= reward.pointsRequired
    } else if (activeTab === "locked") {
      return !hasAccess || points < reward.pointsRequired
    }
    return true
  })

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Banana Rewards</h1>
        </div>

        {!isConnected ? (
          <div className="bg-zinc-900 rounded-lg p-6 text-center mb-6">
            <Image
              src="/prime-mates-logo.png"
              alt="Prime Mates Board Club"
              width={150}
              height={75}
              className="object-contain mx-auto mb-4"
            />
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-zinc-400 mb-4">
              Connect your wallet to verify NFT ownership and unlock exclusive rewards
            </p>
            <WalletConnectButton />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-900 p-4 rounded-lg flex flex-col items-center">
                <div className="mb-2">
                  <Image src="/shaka-coin.png" alt="Shaka Coins" width={48} height={48} className="object-contain" />
                </div>
                <div className="text-2xl font-bold text-yellow-500">1,250</div>
                <div className="text-xs text-zinc-400">Shaka Coins</div>
              </div>
              <div className="bg-zinc-900 p-4 rounded-lg flex flex-col items-center">
                <div className="mb-2">
                  <Image
                    src="/shaka-banana.png"
                    alt="Banana Points"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div className="text-2xl font-bold text-yellow-500">42</div>
                <div className="text-xs text-zinc-400">Banana Points</div>
              </div>
            </div>

            <div className="banana-card p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold">Your Banana Points</h2>
                {hasAccess && (
                  <Badge variant="success" className="text-xs">
                    Verified Prime Mate
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image src="/banana-icon.png" alt="Banana Points" width={48} height={48} className="object-contain" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{points}</p>
                  <p className="text-xs text-zinc-400">Based on your activity and NFT ownership</p>
                </div>
              </div>
            </div>

            {ownedNFTs.length > 0 && (
              <div className="bg-zinc-900 rounded-lg p-4 mb-6">
                <h2 className="font-bold mb-3">Your Prime Mates NFTs</h2>
                <div className="grid grid-cols-2 gap-3">
                  {ownedNFTs.map((nft, index) => (
                    <div key={index} className="bg-zinc-800 rounded-lg p-3">
                      <div className="relative aspect-square rounded-md overflow-hidden mb-2">
                        <Image
                          src={nft.image || "/placeholder.svg"}
                          alt={nft.name || "NFT"}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Image
                            src="/prime-mates-logo.png"
                            alt="Prime Mates"
                            width={30}
                            height={15}
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <p className="text-sm font-medium truncate">{nft.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{nft.collection}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Rewards</h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={activeTab === "all" ? "default" : "outline"}
                  onClick={() => setActiveTab("all")}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "available" ? "default" : "outline"}
                  onClick={() => setActiveTab("available")}
                >
                  Available
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "locked" ? "default" : "outline"}
                  onClick={() => setActiveTab("locked")}
                >
                  Locked
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredRewards.length === 0 ? (
                <div className="bg-zinc-900 rounded-lg p-6 text-center">
                  <p className="text-zinc-400">No rewards found in this category</p>
                </div>
              ) : (
                filteredRewards.map((reward) => {
                  const isAvailable = hasAccess && points >= reward.pointsRequired
                  return (
                    <div
                      key={reward.id}
                      className={`bg-zinc-900 rounded-lg p-4 border ${
                        isAvailable ? "border-primary/30" : "border-zinc-800"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={reward.image || "/placeholder.svg"}
                            alt={reward.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold">{reward.name}</h3>
                            {isAvailable ? (
                              <Badge variant="success" className="text-xs">
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Locked
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-zinc-400 mb-2">{reward.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                              <Image
                                src="/banana-icon.png"
                                alt="Banana Points"
                                width={16}
                                height={16}
                                className="object-contain"
                              />
                              <p className="text-xs">{reward.pointsRequired} points required</p>
                            </div>
                            {isAvailable ? (
                              <Button size="sm">Claim</Button>
                            ) : (
                              <div className="flex items-center gap-1 text-zinc-500">
                                <Lock className="h-4 w-4" />
                                <span className="text-xs">
                                  {hasAccess
                                    ? `Need ${reward.pointsRequired - points} more points`
                                    : "Verify NFT ownership"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </>
        )}

        <div className="mt-8">
          <NFTCommunityRewards />
        </div>

        {!hasAccess && isConnected && (
          <div className="mt-6">
            <NFTVerification />
          </div>
        )}

        <div className="mt-6">
          <Link href="/challenges/board-club">
            <Button className="w-full bg-primary text-black flex items-center gap-2">
              <Image src="/shaka-icon.png" alt="Shaka" width={20} height={20} className="object-contain" />
              Board Club Challenges
            </Button>
          </Link>
        </div>
      </div>

      <TabBar activeTab="rewards" />
    </main>
  )
}
