"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { PostCard } from "@/components/post-card"
import { CommunityHub } from "@/components/community-hub"
import { Plus, Filter, MessageSquare, Calendar, Users, MapPin, Trophy } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { NotificationCenter } from "@/components/notification-center"

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed")

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Community</h1>
          <div className="flex gap-2">
            <NotificationCenter />
            <Button variant="ghost" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
            <Link href="/social/create-post">
              <Button size="icon">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="feed" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="hub">Hub</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Activity Feed</h2>
              <div className="flex gap-2">
                <Link href="/community/chat">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </Button>
                </Link>
              </div>
            </div>

            <PostCard
              username="alexrider"
              avatar="/mystical-forest-spirit.png"
              time="2 hours ago"
              content="Just hit a new personal best at Downtown Skatepark! 🛹"
              image="/urban-skate-session.png"
              likes={24}
              comments={5}
            />

            <PostCard
              username="snowqueen"
              avatar="/diverse-woman-portrait.png"
              time="Yesterday"
              content="Perfect powder day at Mountain High! Earned 120 $ACTIVE tokens today."
              image="/powder-day-shred.png"
              likes={42}
              comments={8}
            />

            <PostCard
              username="wavehunter"
              avatar="/wave-rider-profile.png"
              time="2 days ago"
              content="Check out this new spot I found! Perfect waves and not crowded at all."
              image="/surfer-silhouette.png"
              likes={36}
              comments={12}
            />

            <PostCard
              username="primeactive"
              avatar="/prime-mates-logo.png"
              time="3 days ago"
              content="We're excited to announce our new partnership with Burton! Join the sponsored challenge to earn exclusive NFTs and $PRIME tokens."
              likes={89}
              comments={15}
            />
          </TabsContent>

          <TabsContent value="hub">
            <CommunityHub />
          </TabsContent>

          <TabsContent value="discover" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Discover</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Link href="/community/events">
                <div className="bg-zinc-900 rounded-lg p-4 flex items-center gap-4">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Community Events</h3>
                    <p className="text-sm text-zinc-400">Join meetups, competitions, and group sessions</p>
                  </div>
                </div>
              </Link>

              <Link href="/community/leaderboards">
                <div className="bg-zinc-900 rounded-lg p-4 flex items-center gap-4">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Community Leaderboards</h3>
                    <p className="text-sm text-zinc-400">See how you rank against other Prime Mates</p>
                  </div>
                </div>
              </Link>

              <Link href="/community/groups">
                <div className="bg-zinc-900 rounded-lg p-4 flex items-center gap-4">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Activity Groups</h3>
                    <p className="text-sm text-zinc-400">Find people who share your interests</p>
                  </div>
                </div>
              </Link>

              <Link href="/map">
                <div className="bg-zinc-900 rounded-lg p-4 flex items-center gap-4">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Popular Spots</h3>
                    <p className="text-sm text-zinc-400">Discover trending locations for your activities</p>
                  </div>
                </div>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <TabBar activeTab="community" />
    </main>
  )
}
