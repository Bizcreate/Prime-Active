"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, Share2, Clock, MapPin, Flame, Heart, Award } from "lucide-react"
import Link from "next/link"
import { CircularProgress } from "@/components/circular-progress"
import { NFTCard } from "@/components/nft-card"
import { generateRandomNFTImage } from "@/lib/utils"

export default function ActivitySummaryPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Activity Summary</h1>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg">Morning Run</h2>
              <p className="text-zinc-400 text-sm">Today, 7:30 AM</p>
            </div>
            <CircularProgress value={100} size={50} strokeWidth={5} />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-burnz-500" />
              <div>
                <p className="text-xs text-zinc-400">Duration</p>
                <p className="text-lg font-semibold">32:15</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs text-zinc-400">Distance</p>
                <p className="text-lg font-semibold">5.2 km</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-xs text-zinc-400">Calories</p>
                <p className="text-lg font-semibold">327 kcal</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-xs text-zinc-400">Avg Heart Rate</p>
                <p className="text-lg font-semibold">142 bpm</p>
              </div>
            </div>
          </div>

          <div className="h-40 w-full rounded-lg overflow-hidden map-container relative mb-4">
            {/* Map with completed route */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 160">
              <path
                d="M50,80 C100,40 150,120 200,80 C250,40 300,120 350,80"
                fill="none"
                stroke="#FF8800"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="50" cy="80" r="5" fill="#4ADE80" />
              <circle cx="350" cy="80" r="5" fill="#EF4444" />
            </svg>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              View on Leaderboard
            </Button>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <h2 className="font-bold text-lg mb-3">Rewards Earned</h2>

          <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">$ACTIVE Tokens</p>
                <p className="text-xs text-zinc-400">Added to your wallet</p>
              </div>
            </div>
            <p className="font-bold text-primary">+125</p>
          </div>

          <div className="p-3 bg-zinc-800 rounded-lg">
            <p className="font-medium mb-2">Achievement Unlocked!</p>
            <div className="flex items-center gap-3">
              <div className="bg-burnz-500/20 p-2 rounded-full">
                <Trophy className="h-5 w-5 text-burnz-500" />
              </div>
              <div>
                <p className="font-medium">Early Bird</p>
                <p className="text-xs text-zinc-400">Complete a morning activity</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-bold text-lg mb-3">NFT Reward</h2>
          <div className="grid grid-cols-1 gap-3">
            <NFTCard
              id="nft-reward"
              name="Morning Runner"
              image={generateRandomNFTImage(3)}
              rarity="rare"
              activity="Running"
            />
          </div>
          <p className="text-xs text-zinc-400 mt-2 text-center">This NFT has been added to your collection</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/activities">View History</Link>
          </Button>
          <Button className="flex-1" asChild>
            <Link href="/dashboard">Back to Home</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
