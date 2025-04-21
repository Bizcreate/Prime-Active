"use client"

import { TabBar } from "@/components/tab-bar"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Plus, Filter } from "lucide-react"

export default function CommunityPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Community</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
            <Button size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <PostCard
            username="alexrider"
            avatar="/mystical-forest-spirit.png"
            time="2 hours ago"
            content="Just hit a new personal best at Downtown Skatepark! 🛹"
            image="/placeholder.svg?key=80ron"
            likes={24}
            comments={5}
          />

          <PostCard
            username="snowqueen"
            avatar="/diverse-woman-portrait.png"
            time="Yesterday"
            content="Perfect powder day at Mountain High! Earned 120 $PRIME tokens today."
            image="/powder-day-shred.png"
            likes={42}
            comments={8}
          />

          <PostCard
            username="wavehunter"
            avatar="/wave-rider-profile.png"
            time="2 days ago"
            content="Check out this new spot I found! Perfect waves and not crowded at all."
            image="/placeholder.svg?height=300&width=500&query=surfing+wave"
            likes={36}
            comments={12}
          />

          <PostCard
            username="primeactive"
            avatar="/placeholder.svg?height=40&width=40&query=logo"
            time="3 days ago"
            content="We're excited to announce our new partnership with Burton! Join the sponsored challenge to earn exclusive NFTs and $PRIME tokens."
            likes={89}
            comments={15}
          />
        </div>
      </div>

      <TabBar activeTab="community" />
    </main>
  )
}
