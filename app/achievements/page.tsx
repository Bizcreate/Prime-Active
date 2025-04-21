"use client"

import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { AchievementCard } from "@/components/achievement-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AchievementsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Achievements</h1>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
            <TabsTrigger value="locked">Locked</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <h2 className="text-lg font-bold mb-3">Daily Achievements</h2>
            <div className="space-y-3">
              <AchievementCard
                title="Early Bird"
                description="Complete a morning activity"
                type="badge"
                unlocked={true}
              />
              <AchievementCard
                title="Distance Demon"
                description="Cover 10km in a single day"
                type="badge"
                unlocked={false}
                progress={5.2}
                maxProgress={10}
              />
              <AchievementCard
                title="Calorie Crusher"
                description="Burn 500 calories in a day"
                type="badge"
                unlocked={false}
                progress={327}
                maxProgress={500}
              />
            </div>

            <h2 className="text-lg font-bold mb-3 mt-6">Weekly Challenges</h2>
            <div className="space-y-3">
              <AchievementCard
                title="Consistency King"
                description="Complete activities 5 days in a row"
                type="medal"
                unlocked={false}
                progress={2}
                maxProgress={5}
              />
              <AchievementCard
                title="Weekend Warrior"
                description="Complete 3 activities on weekends"
                type="medal"
                unlocked={false}
                progress={1}
                maxProgress={3}
              />
            </div>

            <h2 className="text-lg font-bold mb-3 mt-6">Lifetime Achievements</h2>
            <div className="space-y-3">
              <AchievementCard
                title="Marathon Runner"
                description="Run a total of 42.2km"
                type="trophy"
                unlocked={false}
                progress={25}
                maxProgress={42.2}
              />
              <AchievementCard
                title="Skate Master"
                description="Complete 50 skateboarding sessions"
                type="trophy"
                unlocked={false}
                progress={12}
                maxProgress={50}
              />
              <AchievementCard
                title="Wave Rider"
                description="Track 20 surfing sessions"
                type="trophy"
                unlocked={false}
                progress={5}
                maxProgress={20}
              />
              <AchievementCard
                title="Snow Shredder"
                description="Track 30 snowboarding sessions"
                type="trophy"
                unlocked={false}
                progress={8}
                maxProgress={30}
              />
              <AchievementCard
                title="Bike Explorer"
                description="Cycle a total of 500km"
                type="trophy"
                unlocked={false}
                progress={125}
                maxProgress={500}
              />
            </div>
          </TabsContent>

          <TabsContent value="unlocked" className="space-y-4">
            <div className="space-y-3">
              <AchievementCard
                title="Early Bird"
                description="Complete a morning activity"
                type="badge"
                unlocked={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="locked" className="space-y-4">
            <div className="space-y-3">
              <AchievementCard
                title="Distance Demon"
                description="Cover 10km in a single day"
                type="badge"
                unlocked={false}
                progress={5.2}
                maxProgress={10}
              />
              <AchievementCard
                title="Calorie Crusher"
                description="Burn 500 calories in a day"
                type="badge"
                unlocked={false}
                progress={327}
                maxProgress={500}
              />
              <AchievementCard
                title="Consistency King"
                description="Complete activities 5 days in a row"
                type="medal"
                unlocked={false}
                progress={2}
                maxProgress={5}
              />
              <AchievementCard
                title="Weekend Warrior"
                description="Complete 3 activities on weekends"
                type="medal"
                unlocked={false}
                progress={1}
                maxProgress={3}
              />
              <AchievementCard
                title="Marathon Runner"
                description="Run a total of 42.2km"
                type="trophy"
                unlocked={false}
                progress={25}
                maxProgress={42.2}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <TabBar activeTab="achievements" />
    </main>
  )
}
