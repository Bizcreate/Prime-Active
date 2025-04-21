"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { TokenCard } from "@/components/token-card"
import { NFTCard } from "@/components/nft-card"
import { ChallengeCard } from "@/components/challenge-card"
import { ActivityTracker } from "@/components/activity-tracker"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Plus, ChevronRight, Award, Trophy } from "lucide-react"
import Link from "next/link"
import { useWeb3 } from "@/components/web3-provider"
import { generateRandomNFTImage } from "@/lib/utils"
import Image from "next/image"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("activities")
  const { address, balance, isConnected, ownedNFTs, points, hasAccess } = useWeb3()

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Image
              src="/prime-mates-logo.png"
              alt="Prime Mates Board Club"
              width={120}
              height={60}
              className="object-contain mr-2"
            />
          </div>
          <Button variant="outline" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <TokenCard amount={balance} change={{ value: "0.05", positive: true }} />

        <div className="my-6">
          <h2 className="font-bold mb-3">Track Activity</h2>
          <ActivityTracker />
        </div>

        <Tabs defaultValue="activities" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Recent Activities</h3>
              <Link href="/activities">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              <div className="bg-zinc-900 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">Morning Run</h4>
                    <p className="text-xs text-zinc-400">Today, 7:30 AM</p>
                  </div>
                  <div className="bg-primary/20 p-1 rounded-full">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-zinc-400">Distance</p>
                    <p>5.2 km</p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Duration</p>
                    <p>32:15</p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Reward</p>
                    <p className="text-primary">+125 $ACTIVE</p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">Skate Session</h4>
                    <p className="text-xs text-zinc-400">Yesterday, 4:15 PM</p>
                  </div>
                  <div className="bg-primary/20 p-1 rounded-full">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-zinc-400">Distance</p>
                    <p>3.8 km</p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Duration</p>
                    <p>1:15:00</p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Reward</p>
                    <p className="text-primary">+85 $ACTIVE</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="nfts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Your Collection</h3>
              <Link href="/wallet">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {isConnected && ownedNFTs.length > 0 ? (
                ownedNFTs
                  .slice(0, 2)
                  .map((nft, index) => (
                    <NFTCard
                      key={index}
                      id={nft.tokenId}
                      name={nft.name || `NFT #${nft.tokenId}`}
                      image={nft.image || generateRandomNFTImage(Number(nft.tokenId))}
                      rarity="legendary"
                      activity={nft.collection}
                    />
                  ))
              ) : (
                <>
                  <NFTCard
                    id="nft-1"
                    name="Step Master"
                    image={generateRandomNFTImage(1)}
                    rarity="rare"
                    activity="Walking"
                  />
                  <NFTCard
                    id="nft-2"
                    name="Skate Legend"
                    image={generateRandomNFTImage(2)}
                    rarity="epic"
                    activity="Skateboarding"
                  />
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Active Challenges</h3>
              <Link href="/challenges">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              <ChallengeCard
                title="Morning Ride"
                description="Complete a ride before 9am"
                reward="50 $ACTIVE"
                timeLeft="8 hours left"
              />
              <ChallengeCard
                title="Weekend Warrior"
                description="Complete 3 rides this weekend"
                reward="150 $ACTIVE"
                timeLeft="2 days left"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary/20 p-2 rounded-full">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Weekly Leaderboard</h3>
              <p className="text-xs text-zinc-400">You're in 12th place</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-black rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <p className="text-sm">Marathon Pro</p>
              </div>
              <p className="text-sm">156.2 km</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-zinc-700 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <p className="text-sm">Skate Legend</p>
              </div>
              <p className="text-sm">142.8 km</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-zinc-700 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <p className="text-sm">Wave Master</p>
              </div>
              <p className="text-sm">128.5 km</p>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-3" asChild>
            <Link href="/leaderboard">View Leaderboard</Link>
          </Button>
        </div>
      </div>

      <TabBar activeTab="home" />
    </main>
  )
}
