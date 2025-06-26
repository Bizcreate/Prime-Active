"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Calendar, Clock, Shirt, Star, Filter, Sparkles, Tag, Users, Trophy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import {
  activityIntegrationService,
  type IntegratedActivity,
  type ActivityReward,
} from "@/services/activity-integration-service"

export default function ActivityRewardsPage() {
  const [activities, setActivities] = useState<IntegratedActivity[]>([])
  const [rewards, setRewards] = useState<ActivityReward[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("timeline")
  const [filterType, setFilterType] = useState<"all" | "wear" | "event" | "purchase" | "redeem">("all")
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()

  // Load activities and rewards
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        // Add a slight delay to simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate wear activities from merchandise wear service
        activityIntegrationService.generateWearActivities()

        // Get all activities and rewards
        const allActivities = activityIntegrationService.getIntegratedActivities()
        const allRewards = activityIntegrationService.getActivityRewards()

        // Sort activities by timestamp (newest first)
        allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

        setActivities(allActivities)
        setRewards(allRewards)
      } catch (error) {
        console.error("Error loading activities and rewards:", error)
        toast({
          title: "Error",
          description: "Failed to load activities and rewards. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  // Filter activities by type
  const filteredActivities = filterType === "all" ? activities : activities.filter((a) => a.type === filterType)

  // Calculate total rewards
  const totalRewards = rewards.reduce((total, reward) => total + reward.amount, 0)

  // Calculate rewards by source
  const wearRewards = rewards
    .filter((reward) => reward.source === "wear")
    .reduce((total, reward) => total + reward.amount, 0)
  const eventRewards = rewards
    .filter((reward) => reward.source === "event")
    .reduce((total, reward) => total + reward.amount, 0)
  const challengeRewards = rewards
    .filter((reward) => reward.source === "challenge")
    .reduce((total, reward) => total + reward.amount, 0)
  const otherRewards = rewards
    .filter((reward) => reward.source === "other")
    .reduce((total, reward) => total + reward.amount, 0)

  // Format duration
  const formatDuration = (minutes: number | undefined): string => {
    if (!minutes) return "N/A"

    if (minutes < 60) {
      return `${minutes} min`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours < 24) {
      return `${hours}h ${remainingMinutes}m`
    }

    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24

    return `${days}d ${remainingHours}h`
  }

  // Get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "wear":
        return <Shirt className="h-5 w-5 text-blue-500" />
      case "event":
        return <Calendar className="h-5 w-5 text-green-500" />
      case "purchase":
        return <Tag className="h-5 w-5 text-purple-500" />
      case "redeem":
        return <Star className="h-5 w-5 text-amber-500" />
      default:
        return <Sparkles className="h-5 w-5 text-primary" />
    }
  }

  // Get activity color based on type
  const getActivityColor = (type: string) => {
    switch (type) {
      case "wear":
        return "border-blue-500/30 bg-blue-500/10"
      case "event":
        return "border-green-500/30 bg-green-500/10"
      case "purchase":
        return "border-purple-500/30 bg-purple-500/10"
      case "redeem":
        return "border-amber-500/30 bg-amber-500/10"
      default:
        return "border-primary/30 bg-primary/10"
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Activity & Rewards</h1>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        {/* Rewards Summary */}
        <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-l-4 border-l-[#ffc72d] mb-6">
          <CardContent className="p-4">
            <h2 className="font-bold mb-3 flex items-center">
              <Star className="h-5 w-5 mr-2 text-[#ffc72d]" />
              Rewards Summary
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-zinc-400">Total Earned</div>
                <div className="text-xl font-bold flex items-center">
                  <Image src="/shaka-coin.png" alt="SHAKA" width={20} height={20} className="mr-1" />
                  {totalRewards} SHAKA
                </div>
              </div>
              <div>
                <div className="text-sm text-zinc-400">Available</div>
                <div className="text-xl font-bold flex items-center">
                  <Image src="/shaka-coin.png" alt="SHAKA" width={20} height={20} className="mr-1" />
                  {totalRewards} SHAKA
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-3 mb-3">
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm">Next reward milestone</div>
                <div className="text-sm font-bold text-[#ffc72d]">500 SHAKA</div>
              </div>
              <Progress value={totalRewards / 5} className="h-2 bg-zinc-700" />
            </div>

            <div className="text-sm text-zinc-400 flex items-center">
              <Sparkles className="h-4 w-4 mr-1 text-[#ffc72d]" />
              Earn more by wearing merchandise and attending events!
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        {showFilters && (
          <div className="bg-zinc-900 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium mb-3">Filter by Activity Type</h3>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
                className="rounded-full"
              >
                All
              </Button>
              <Button
                variant={filterType === "wear" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("wear")}
                className="rounded-full flex items-center gap-1"
              >
                <Shirt className="h-4 w-4" />
                Wear
              </Button>
              <Button
                variant={filterType === "event" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("event")}
                className="rounded-full flex items-center gap-1"
              >
                <Calendar className="h-4 w-4" />
                Events
              </Button>
              <Button
                variant={filterType === "purchase" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("purchase")}
                className="rounded-full flex items-center gap-1"
              >
                <Tag className="h-4 w-4" />
                Purchases
              </Button>
              <Button
                variant={filterType === "redeem" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("redeem")}
                className="rounded-full flex items-center gap-1"
              >
                <Star className="h-4 w-4" />
                Redemptions
              </Button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="timeline" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 bg-zinc-800">
            <TabsTrigger value="timeline" className={activeTab === "timeline" ? "data-[state=active]:bg-zinc-900" : ""}>
              Timeline
            </TabsTrigger>
            <TabsTrigger
              value="statistics"
              className={activeTab === "statistics" ? "data-[state=active]:bg-zinc-900" : ""}
            >
              Statistics
            </TabsTrigger>
            <TabsTrigger
              value="merchandise"
              className={activeTab === "merchandise" ? "data-[state=active]:bg-zinc-900" : ""}
            >
              Merchandise
            </TabsTrigger>
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="mt-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-zinc-400">Loading activities...</p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="bg-zinc-900 rounded-lg p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
                <h3 className="text-lg font-bold mb-2">No Activities</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  {filterType === "all"
                    ? "You haven't recorded any activities yet."
                    : `You haven't recorded any ${filterType} activities yet.`}
                </p>
                <Link href="/merch/wear-to-earn">
                  <Button>Start Earning</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className={`border rounded-lg p-4 ${getActivityColor(activity.type)}`}>
                    <div className="flex items-start gap-3">
                      <div className="bg-zinc-900 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold">{activity.title}</h3>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              activity.type === "wear"
                                ? "border-blue-500 text-blue-500"
                                : activity.type === "event"
                                  ? "border-green-500 text-green-500"
                                  : activity.type === "purchase"
                                    ? "border-purple-500 text-purple-500"
                                    : "border-amber-500 text-amber-500"
                            }`}
                          >
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-zinc-400 mb-2">{activity.description}</p>

                        <div className="flex flex-wrap gap-2 mb-2">
                          {activity.merchandiseId && (
                            <Link href={`/merch/${activity.merchandiseId}`}>
                              <Badge variant="secondary" className="flex items-center gap-1 cursor-pointer">
                                <Shirt className="h-3 w-3" />
                                {activity.merchandiseName}
                              </Badge>
                            </Link>
                          )}
                          {activity.eventId && (
                            <Link href={`/events?highlight=${activity.eventId}`}>
                              <Badge variant="secondary" className="flex items-center gap-1 cursor-pointer">
                                <Calendar className="h-3 w-3" />
                                {activity.eventName}
                              </Badge>
                            </Link>
                          )}
                          {activity.duration && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(activity.duration)}
                            </Badge>
                          )}
                        </div>

                        <div className="flex justify-between items-center text-xs text-zinc-500">
                          <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                          {activity.rewardAmount && (
                            <div
                              className={`flex items-center gap-1 ${
                                activity.rewardAmount > 0 ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              <Star className="h-3 w-3" />
                              {activity.rewardAmount > 0 ? "+" : ""}
                              {activity.rewardAmount}{" "}
                              {activity.rewardType === "tokens" ? "tokens" : activity.rewardType}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="mt-4">
            <div className="space-y-6">
              <div className="bg-zinc-900 rounded-lg p-4">
                <h3 className="font-bold mb-3">Rewards by Source</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <Shirt className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Wear-to-Earn</span>
                      </div>
                      <span className="text-sm font-bold">{wearRewards} SHAKA</span>
                    </div>
                    <Progress value={(wearRewards / totalRewards) * 100} className="h-2 bg-zinc-800" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Events</span>
                      </div>
                      <span className="text-sm font-bold">{eventRewards} SHAKA</span>
                    </div>
                    <Progress value={(eventRewards / totalRewards) * 100} className="h-2 bg-zinc-800" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Challenges</span>
                      </div>
                      <span className="text-sm font-bold">{challengeRewards} SHAKA</span>
                    </div>
                    <Progress value={(challengeRewards / totalRewards) * 100} className="h-2 bg-zinc-800" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Other</span>
                      </div>
                      <span className="text-sm font-bold">{otherRewards} SHAKA</span>
                    </div>
                    <Progress value={(otherRewards / totalRewards) * 100} className="h-2 bg-zinc-800" />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4">
                <h3 className="font-bold mb-3">Activity Breakdown</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-800 rounded-lg p-3 text-center">
                    <Shirt className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{activities.filter((a) => a.type === "wear").length}</div>
                    <div className="text-xs text-zinc-400">Wear Activities</div>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-3 text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">{activities.filter((a) => a.type === "event").length}</div>
                    <div className="text-xs text-zinc-400">Event Activities</div>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-3 text-center">
                    <Tag className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">{activities.filter((a) => a.type === "purchase").length}</div>
                    <div className="text-xs text-zinc-400">Purchases</div>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-3 text-center">
                    <Star className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                    <div className="text-2xl font-bold">{activities.filter((a) => a.type === "redeem").length}</div>
                    <div className="text-xs text-zinc-400">Redemptions</div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4">
                <h3 className="font-bold mb-3">Total Wear Time</h3>
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {formatDuration(
                        activities.filter((a) => a.type === "wear").reduce((total, a) => total + (a.duration || 0), 0),
                      )}
                    </div>
                    <div className="text-xs text-zinc-400">Total time wearing merchandise</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Merchandise Tab */}
          <TabsContent value="merchandise" className="mt-4">
            <div className="space-y-4">
              <h3 className="font-bold">Top Earning Merchandise</h3>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-zinc-400">Loading merchandise data...</p>
                </div>
              ) : (
                <>
                  {/* Group activities by merchandise and calculate total rewards */}
                  {Object.entries(
                    activities
                      .filter((a) => a.merchandiseId && a.type === "wear")
                      .reduce(
                        (acc, activity) => {
                          const id = activity.merchandiseId as string
                          if (!acc[id]) {
                            acc[id] = {
                              id,
                              name: activity.merchandiseName as string,
                              image: activity.merchandiseImage as string,
                              totalRewards: 0,
                              totalDuration: 0,
                              activities: [],
                            }
                          }
                          acc[id].totalRewards += activity.rewardAmount || 0
                          acc[id].totalDuration += activity.duration || 0
                          acc[id].activities.push(activity)
                          return acc
                        },
                        {} as Record<string, any>,
                      ),
                  )
                    .sort((a, b) => b[1].totalRewards - a[1].totalRewards)
                    .map(([id, data]) => (
                      <Link href={`/merch/${id}`} key={id}>
                        <Card className="bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={data.image || "/placeholder.svg"}
                                  alt={data.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold">{data.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                  <Clock className="h-4 w-4" />
                                  <span>Worn for {formatDuration(data.totalDuration)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-primary mt-1">
                                  <Star className="h-4 w-4" />
                                  <span>{data.totalRewards} Shaka tokens earned</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-zinc-400">Activities</div>
                                <div className="text-lg font-bold">{data.activities.length}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}

                  {activities.filter((a) => a.merchandiseId && a.type === "wear").length === 0 && (
                    <div className="bg-zinc-900 rounded-lg p-6 text-center">
                      <Shirt className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
                      <h3 className="text-lg font-bold mb-2">No Merchandise Activities</h3>
                      <p className="text-zinc-400 text-sm mb-4">
                        You haven't earned any rewards from wearing merchandise yet.
                      </p>
                      <Link href="/merch/wear-to-earn">
                        <Button>Start Wearing</Button>
                      </Link>
                    </div>
                  )}
                </>
              )}

              <h3 className="font-bold mt-6">Top Events</h3>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-zinc-400">Loading event data...</p>
                </div>
              ) : (
                <>
                  {/* Group activities by event and calculate total rewards */}
                  {Object.entries(
                    activities
                      .filter((a) => a.eventId && a.type === "event")
                      .reduce(
                        (acc, activity) => {
                          const id = activity.eventId as string
                          if (!acc[id]) {
                            acc[id] = {
                              id,
                              name: activity.eventName as string,
                              image: activity.eventImage as string,
                              totalRewards: 0,
                              activities: [],
                            }
                          }
                          acc[id].totalRewards += activity.rewardAmount || 0
                          acc[id].activities.push(activity)
                          return acc
                        },
                        {} as Record<string, any>,
                      ),
                  )
                    .sort((a, b) => b[1].totalRewards - a[1].totalRewards)
                    .map(([id, data]) => (
                      <Link href={`/events?highlight=${id}`} key={id}>
                        <Card className="bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={data.image || "/placeholder.svg"}
                                  alt={data.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold">{data.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                  <Users className="h-4 w-4" />
                                  <span>{data.activities.length} activities</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-primary mt-1">
                                  <Star className="h-4 w-4" />
                                  <span>{data.totalRewards} Shaka tokens earned</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}

                  {activities.filter((a) => a.eventId && a.type === "event").length === 0 && (
                    <div className="bg-zinc-900 rounded-lg p-6 text-center">
                      <Calendar className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
                      <h3 className="text-lg font-bold mb-2">No Event Activities</h3>
                      <p className="text-zinc-400 text-sm mb-4">
                        You haven't earned any rewards from attending events yet.
                      </p>
                      <Link href="/events">
                        <Button>Browse Events</Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Link href="/merch/wear-to-earn">
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Shirt className="h-4 w-4" />
              Wear to Earn
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </Button>
          </Link>
        </div>
      </div>

      <TabBar activeTab="rewards" />
    </div>
  )
}
