"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Lock, Wallet, Trophy } from "lucide-react"
import Link from "next/link"
import { useWeb3 } from "@/components/web3-provider"
import { Badge } from "@/components/ui/badge"
import { NFTVerification } from "@/components/nft-verification"
import { WalletConnectButton } from "@/components/wallet-connect-button"

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
      image: "/digital-art-launch.png",
      category: "nft",
    },
    {
      id: "reward2",
      name: "Premium Activity Tracking",
      description: "Unlock advanced activity tracking features",
      pointsRequired: 200,
      image: "/fitness-journey-dashboard.png",
      category: "feature",
    },
    {
      id: "reward3",
      name: "Limited Edition Gear",
      description: "Unlock special in-app gear for your avatar",
      pointsRequired: 300,
      image: "/interconnected-cogwheels.png",
      category: "gear",
    },
    {
      id: "reward4",
      name: "VIP Challenge Access",
      description: "Access to exclusive challenges with higher rewards",
      pointsRequired: 500,
      image: "/summit-success.png",
      category: "challenge",
    },
    {
      id: "reward5",
      name: "Custom Profile Badge",
      description: "Show off your status with a custom profile badge",
      pointsRequired: 750,
      image: "/digital-profile-badge.png",
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
          <h1 className="text-xl font-bold">NFT Rewards</h1>
        </div>

        {!isConnected ? (
          <div className="bg-zinc-900 rounded-lg p-6 text-center mb-6">
            <Wallet className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-zinc-400 mb-4">
              Connect your wallet to verify NFT ownership and unlock exclusive rewards
            </p>
            <WalletConnectButton />
          </div>
        ) : (
          <>
            <div className="bg-zinc-900 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold">Your Points</h2>
                {hasAccess && (
                  <Badge variant="success" className="text-xs">
                    Verified NFT Owner
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{points}</p>
                  <p className="text-xs text-zinc-400">Based on your NFT ownership</p>
                </div>
              </div>
            </div>

            {ownedNFTs.length > 0 && (
              <div className="bg-zinc-900 rounded-lg p-4 mb-6">
                <h2 className="font-bold mb-3">Your Verified NFTs</h2>
                <div className="grid grid-cols-2 gap-3">
                  {ownedNFTs.map((nft, index) => (
                    <div key={index} className="bg-zinc-800 rounded-lg p-3">
                      <div className="relative aspect-square rounded-md overflow-hidden mb-2">
                        <img
                          src={nft.image || "/placeholder.svg"}
                          alt={nft.name || "NFT"}
                          className="object-cover w-full h-full"
                        />
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
                          <img
                            src={reward.image || "/placeholder.svg"}
                            alt={reward.name}
                            className="object-cover w-full h-full"
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
                              <Trophy className="h-4 w-4 text-primary" />
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

        {!hasAccess && isConnected && (
          <div className="mt-6">
            <NFTVerification />
          </div>
        )}
      </div>

      <TabBar activeTab="rewards" />
    </main>
  )
}
