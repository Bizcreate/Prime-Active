"use client"

import { useState } from "react"
import { TabBar } from "@/components/tab-bar"
import { ChallengeCard } from "@/components/challenge-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState("daily")

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Challenges</h1>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input placeholder="Search challenges..." className="pl-9 bg-zinc-900 border-zinc-800" />
        </div>

        <Tabs defaultValue="daily" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="sponsored">Sponsored</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <ChallengeCard
              title="Morning Ride"
              description="Complete a ride before 9am"
              reward="50 $PRIME"
              timeLeft="8 hours left"
            />
            <ChallengeCard
              title="Distance Challenge"
              description="Ride 5km in a single session"
              reward="75 $PRIME"
              timeLeft="Today only"
            />
            <ChallengeCard
              title="Calorie Burner"
              description="Burn 300 calories in a session"
              reward="60 $PRIME"
              timeLeft="Today only"
            />
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <ChallengeCard
              title="Weekend Warrior"
              description="Complete 3 rides this weekend"
              reward="150 $PRIME"
              timeLeft="2 days left"
            />
            <ChallengeCard
              title="Consistency King"
              description="Ride 5 days in a row"
              reward="200 $PRIME"
              timeLeft="Ongoing"
            />
            <ChallengeCard
              title="Distance Master"
              description="Ride 25km total this week"
              reward="180 $PRIME"
              timeLeft="4 days left"
            />
          </TabsContent>

          <TabsContent value="sponsored" className="space-y-4">
            <ChallengeCard
              title="Burton Snow Challenge"
              description="Track 10km on your snowboard"
              reward="250 $PRIME + NFT Badge"
              timeLeft="5 days left"
              sponsored
            />
            <ChallengeCard
              title="Vans Skate Series"
              description="Visit 3 different skateparks"
              reward="300 $PRIME + Discount Code"
              timeLeft="2 weeks left"
              sponsored
            />
            <ChallengeCard
              title="Rip Curl Surf Event"
              description="Track 5 surf sessions"
              reward="400 $PRIME + Limited NFT"
              timeLeft="3 weeks left"
              sponsored
            />
          </TabsContent>
        </Tabs>

        <div>
          <h2 className="text-lg font-bold mb-3">Your Active Challenges</h2>
          <div className="space-y-3">
            <ChallengeCard
              title="Consistency King"
              description="Ride 5 days in a row (3/5 completed)"
              reward="200 $PRIME"
              timeLeft="Ongoing"
            />
            <ChallengeCard
              title="Burton Snow Challenge"
              description="Track 10km on your snowboard (2.5/10km)"
              reward="250 $PRIME + NFT Badge"
              timeLeft="5 days left"
              sponsored
            />
          </div>
        </div>
      </div>

      <TabBar activeTab="challenges" />
    </main>
  )
}
