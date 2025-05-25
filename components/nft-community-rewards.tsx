"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

interface NFTReward {
  id: string
  name: string
  image: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  activity: string
  requiredPoints: number
  description: string
  unlocked: boolean
}

export function NFTCommunityRewards() {
  const [rewards, setRewards] = useState<NFTReward[]>([
    {
      id: "community-1",
      name: "Social Butterfly",
      image: "/prismatic-flutter.png",
      rarity: "uncommon",
      activity: "Social Engagement",
      requiredPoints: 500,
      description: "Create 10 posts and comment on 20 community posts",
      unlocked: false,
    },
    {
      id: "community-2",
      name: "Event Organizer",
      image: "/digital-event-flow.png",
      rarity: "rare",
      activity: "Community Events",
      requiredPoints: 1000,
      description: "Organize 3 community events with at least 5 participants each",
      unlocked: false,
    },
    {
      id: "community-3",
      name: "Prime Mate Legend",
      image: "/crowned-golden-primate.png",
      rarity: "legendary",
      activity: "Board Club",
      requiredPoints: 5000,
      description: "Reach Level 10 in the Prime Mates Board Club",
      unlocked: false,
    },
    {
      id: "community-4",
      name: "Group Leader",
      image: "/digital-pathfinders.png",
      rarity: "epic",
      activity: "Group Activities",
      requiredPoints: 2500,
      description: "Lead 10 group activities with at least 3 participants each",
      unlocked: false,
    },
  ])

  const [userPoints, setUserPoints] = useState(750)
  const [selectedReward, setSelectedReward] = useState<NFTReward | null>(null)

  const handleClaimReward = (reward: NFTReward) => {
    if (userPoints >= reward.requiredPoints) {
      setRewards(rewards.map((r) => (r.id === reward.id ? { ...r, unlocked: true } : r)))
      setUserPoints(userPoints - reward.requiredPoints)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Community NFT Rewards</h2>
        <div className="flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-full">
          <Image src="/banana-icon.png" alt="Community Points" width={16} height={16} className="object-contain" />
          <span className="text-sm font-medium">{userPoints} Points</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards.map((reward) => (
          <Card
            key={reward.id}
            className={`bg-zinc-900 border-zinc-800 overflow-hidden cursor-pointer transition-all ${
              reward.unlocked ? "border-primary" : ""
            }`}
            onClick={() => setSelectedReward(reward)}
          >
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-1/3 aspect-square relative">
                <Image src={reward.image || "/placeholder.svg"} alt={reward.name} fill className="object-cover" />
                <div className="absolute top-2 right-2 bg-primary text-black text-xs px-2 py-0.5 rounded-full">
                  {reward.rarity}
                </div>
              </div>
              <CardContent className="p-4 w-full sm:w-2/3">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{reward.name}</h3>
                  {reward.unlocked && (
                    <div className="bg-primary text-black text-xs px-2 py-0.5 rounded-full">Claimed</div>
                  )}
                </div>
                <p className="text-sm text-zinc-400 mb-3">{reward.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>
                      {Math.min(userPoints, reward.requiredPoints)}/{reward.requiredPoints}
                    </span>
                  </div>
                  <Progress value={(userPoints / reward.requiredPoints) * 100} className="h-2" />
                </div>
                <Button
                  className="w-full mt-3"
                  disabled={userPoints < reward.requiredPoints || reward.unlocked}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClaimReward(reward)
                  }}
                >
                  {reward.unlocked ? "Claimed" : userPoints < reward.requiredPoints ? "Not Enough Points" : "Claim NFT"}
                </Button>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {selectedReward && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedReward.name}</h3>
              <button onClick={() => setSelectedReward(null)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>
            <div className="relative aspect-square mb-4">
              <Image
                src={selectedReward.image || "/placeholder.svg"}
                alt={selectedReward.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-zinc-400">Description</h4>
                <p className="text-sm">{selectedReward.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-zinc-400">Rarity</h4>
                <div className="bg-primary text-black text-xs px-2 py-0.5 rounded-full inline-block mt-1">
                  {selectedReward.rarity}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-zinc-400">Required Points</h4>
                <div className="flex items-center gap-1 mt-1">
                  <Image src="/banana-icon.png" alt="Points" width={16} height={16} />
                  <span>{selectedReward.requiredPoints}</span>
                </div>
              </div>
              <Button
                className="w-full"
                disabled={userPoints < selectedReward.requiredPoints || selectedReward.unlocked}
                onClick={() => handleClaimReward(selectedReward)}
              >
                {selectedReward.unlocked
                  ? "Already Claimed"
                  : userPoints < selectedReward.requiredPoints
                    ? "Not Enough Points"
                    : "Claim NFT"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
