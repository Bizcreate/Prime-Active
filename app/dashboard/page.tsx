"use client"

import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ChallengeCard } from "@/components/challenge-card"
import { PostCard } from "@/components/post-card"
import { ActivityCard } from "@/components/activity-card"
import { useWeb3 } from "@/components/web3-provider"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { ArrowRight, Calendar, Clock, MapPin, Users, User } from "lucide-react"
import Link from "next/link"
import { HealthTracker } from "@/components/health-tracker"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardPage() {
  const { isConnected } = useWeb3()

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/profile">
              <Avatar className="h-10 w-10 mr-3 border-2 border-primary cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src="/stylish-macaque.png" alt="Profile" />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Link>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          {!isConnected && <WalletConnectButton size="sm" />}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#ffc72d]">Health Tracking</h2>
            <Link href="/activities">
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                Details
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <HealthTracker />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">Active Challenges</h2>
            <Link href="/challenges">
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                View All
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            <ChallengeCard
              title="Morning Run Streak"
              description="Complete a morning run for 5 consecutive days"
              progress={60}
              icon={<Clock className="h-5 w-5" />}
              daysLeft={2}
              reward={50}
            />
            <ChallengeCard
              title="Explore New Trails"
              description="Discover 3 new running or hiking trails this week"
              progress={33}
              icon={<MapPin className="h-5 w-5" />}
              daysLeft={5}
              reward={75}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">Community Feed</h2>
            <Link href="/social">
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                View All
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            <PostCard
              avatar="/wave-rider-profile.png"
              username="WaveRider"
              time="2h ago"
              content="Just caught the perfect wave at Sunset Beach! 🏄‍♂️ #PrimeActive #SurfLife"
              image="/wave-rider.png"
              likes={24}
              comments={8}
              hasNft={true}
            />
            <PostCard
              avatar="/diverse-woman-portrait.png"
              username="MountainGoat"
              time="5h ago"
              content="Morning trail run complete! The misty views were absolutely worth the early alarm. Who else is getting their steps in today?"
              image="/misty-trail-run.png"
              likes={42}
              comments={15}
              hasNft={false}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">Upcoming Events</h2>
            <Link href="/events">
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                View All
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">Weekend Beach Cleanup</h3>
                <p className="text-xs text-zinc-400 mb-1">Saturday, 10:00 AM • Sunset Beach</p>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-zinc-500" />
                  <span className="text-xs text-zinc-500">24 attending</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-medium">Board Club Meetup</h3>
                <p className="text-xs text-zinc-400 mb-1">Sunday, 4:00 PM • Skate Park</p>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-zinc-500" />
                  <span className="text-xs text-zinc-500">18 attending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">Recent Activities</h2>
            <Link href="/activities">
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                View All
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            <ActivityCard
              title="Morning Run"
              subtitle="5.2 km • 28 min"
              date="Today, 7:30 AM"
              image="/misty-morning-trail.png"
              points={75}
            />
            <ActivityCard
              title="Skateboarding Session"
              subtitle="Urban Park • 1.5 hours"
              date="Yesterday, 5:15 PM"
              image="/urban-skater-motion.png"
              points={120}
            />
          </div>
        </div>
      </div>

      <TabBar activeTab="dashboard" />
    </div>
  )
}
