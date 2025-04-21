"use client"

import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ActivityCard } from "@/components/activity-card"
import { NFTCard } from "@/components/nft-card"
import { AchievementCard } from "@/components/achievement-card"
import { CircularProgress } from "@/components/circular-progress"
import { Play, ChevronRight, Trophy, Wallet } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { generateRandomNFTImage } from "@/lib/utils"
import { useWeb3 } from "@/components/web3-provider"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const router = useRouter()
  const { isConnected, points, hasAccess, ownedNFTs } = useWeb3()

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Hey, Rider!</h1>
            <p className="text-zinc-400">Ready to move and earn?</p>
          </div>
          <Link href="/profile">
            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="font-medium text-sm">JD</span>
            </div>
          </Link>
        </div>

        {isConnected && (
          <div className="bg-zinc-900 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold">NFT Status</h2>
              {hasAccess && (
                <Badge variant="success" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <span className="text-sm">{ownedNFTs.length} Verified NFTs</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold">{points} Points</span>
              </div>
            </div>
            <div className="mt-2">
              <Link href="/rewards">
                <Button variant="outline" size="sm" className="w-full">
                  View Rewards
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <CircularProgress value={75} size={60} strokeWidth={6} />
            <div>
              <h2 className="font-bold text-lg">Today's Progress</h2>
              <p className="text-zinc-400 text-sm">You're doing great! Keep it up.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold">1,275</p>
              <p className="text-xs text-zinc-400">Steps</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">7.5</p>
              <p className="text-xs text-zinc-400">km</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">327</p>
              <p className="text-xs text-zinc-400">kcal</p>
            </div>
          </div>
        </div>

        <Link href="/start-activity">
          <Button className="w-full py-6 text-lg mb-6 flex items-center gap-2">
            <Play className="h-5 w-5" />
            Start Activity
          </Button>
        </Link>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Recent Activities</h2>
            <Link href="/activities" className="text-primary text-sm flex items-center">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            <ActivityCard type="running" title="Morning Run" value="5.2" unit="km" progress={100} />
            <ActivityCard type="skateboarding" title="Skate Session" value="45" unit="min" progress={100} />
            <ActivityCard type="walking" title="Evening Walk" value="3.1" unit="km" progress={100} />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Your NFT Collection</h2>
            <Link href="/wallet" className="text-primary text-sm flex items-center">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {ownedNFTs.length > 0 ? (
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
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Achievements</h2>
            <Link href="/achievements" className="text-primary text-sm flex items-center">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            <AchievementCard
              title="Early Bird"
              description="Complete a morning activity 5 days in a row"
              type="badge"
              unlocked={true}
            />
            <AchievementCard
              title="Marathon Runner"
              description="Run a total of 42.2km"
              type="medal"
              unlocked={false}
              progress={25}
              maxProgress={42.2}
            />
          </div>
        </div>
      </div>

      <TabBar activeTab="home" />
    </main>
  )
}
