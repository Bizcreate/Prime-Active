"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Clock, Trophy, Shirt, Sparkles, History } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { merchandiseWearService, type ConnectedMerchandise } from "@/services/merchandise-wear-service"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { activityIntegrationService } from "@/services/activity-integration-service"

export default function WearToEarnPage() {
  const [merchandise, setMerchandise] = useState<ConnectedMerchandise[]>([])
  const [activeItems, setActiveItems] = useState<ConnectedMerchandise[]>([])
  const [totalTokens, setTotalTokens] = useState(0)
  const [dailyEarnings, setDailyEarnings] = useState(0)
  const [nextReward, setNextReward] = useState(0)
  const [timeToReward, setTimeToReward] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [wearActivities, setWearActivities] = useState(0)
  const { toast } = useToast()

  // Load merchandise data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Add a slight delay to simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Load merchandise data
        const items = merchandiseWearService.getConnectedMerchandise()
        setMerchandise(items || [])

        // Get currently worn items
        const worn = merchandiseWearService.getCurrentlyWornItems()
        setActiveItems(worn || [])

        // Get total tokens
        const tokens = merchandiseWearService.getTotalEarnedTokens()
        setTotalTokens(tokens || 0)

        // Calculate daily earnings
        const daily = (worn?.length || 0) * 5 // 5 tokens per item per day
        setDailyEarnings(daily)

        // Calculate time to next reward
        const minutes = Math.floor(Math.random() * 60) // Random minutes for demo
        setTimeToReward(`${minutes} minutes`)

        // Set next reward amount
        setNextReward(worn && worn.length > 0 ? worn.length : 0)

        // Get wear activities count
        const activities = activityIntegrationService.getIntegratedActivities()
        const wearCount = activities.filter((a) => a.type === "wear").length
        setWearActivities(wearCount)
      } catch (error) {
        console.error("Error loading merchandise data:", error)
        toast({
          title: "Error",
          description: "Failed to load merchandise data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Set up interval to refresh data
    const interval = setInterval(() => {
      try {
        const items = merchandiseWearService.getConnectedMerchandise()
        setMerchandise(items || [])

        const worn = merchandiseWearService.getCurrentlyWornItems()
        setActiveItems(worn || [])
      } catch (error) {
        console.error("Error updating merchandise data:", error)
      }
    }, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [toast])

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/merch">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Wear to Earn</h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-400">Loading earnings data...</p>
          </div>
        ) : (
          <>
            {/* Earnings Overview */}
            <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-l-4 border-l-[#ffc72d] mb-6">
              <CardContent className="p-4">
                <h2 className="font-bold mb-3 flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-[#ffc72d]" />
                  Earning Overview
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-zinc-400">Total Earned</div>
                    <div className="text-xl font-bold flex items-center">
                      <Image src="/shaka-coin.png" alt="SHAKA" width={20} height={20} className="mr-1" />
                      {totalTokens} SHAKA
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-400">Daily Earnings</div>
                    <div className="text-xl font-bold flex items-center">
                      <Image src="/shaka-coin.png" alt="SHAKA" width={20} height={20} className="mr-1" />
                      {dailyEarnings}/day
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-800 rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm">Next reward in {timeToReward}</div>
                    <div className="text-sm font-bold text-[#ffc72d]">{nextReward} SHAKA</div>
                  </div>
                  <Progress value={65} className="h-2 bg-zinc-700" />
                </div>

                <div className="text-sm text-zinc-400 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1 text-[#ffc72d]" />
                  Wear more items to increase your earnings!
                </div>
              </CardContent>
            </Card>

            {/* Activity Stats */}
            <Card className="bg-zinc-900 mb-6">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold flex items-center">
                    <History className="h-5 w-5 mr-2 text-blue-500" />
                    Activity Stats
                  </h3>
                  <Link href="/activity-rewards">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View All
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-800 p-3 rounded-lg">
                    <div className="text-sm text-zinc-400 mb-1">Wear Activities</div>
                    <div className="text-xl font-bold">{wearActivities}</div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded-lg">
                    <div className="text-sm text-zinc-400 mb-1">Active Items</div>
                    <div className="text-xl font-bold">{activeItems.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Items */}
            <h2 className="text-lg font-bold mb-3 flex items-center">
              <Shirt className="h-5 w-5 mr-2 text-[#ffc72d]" />
              Currently Wearing ({activeItems.length})
            </h2>

            {activeItems.length === 0 ? (
              <Card className="bg-zinc-900 mb-6">
                <CardContent className="p-4 text-center">
                  <p className="text-zinc-400 mb-3">You are not wearing any items</p>
                  <Link href="/merch/collection">
                    <Button>View Collection</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3 mb-6">
                {activeItems.map((item) => (
                  <Card key={item.id} className="bg-zinc-900 border-l-2 border-l-green-500">
                    <CardContent className="p-3">
                      <div className="flex items-center">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{item.productName}</h3>
                          <div className="flex items-center text-xs text-zinc-400">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              Wearing since{" "}
                              {item.wearingSince
                                ? new Date(item.wearingSince).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "now"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#ffc72d]">+5/day</div>
                          <div className="text-xs text-zinc-400">Token Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* How It Works */}
            <h2 className="text-lg font-bold mb-3">How It Works</h2>
            <Card className="bg-zinc-900 mb-6">
              <CardContent className="p-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <div className="bg-zinc-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      1
                    </div>
                    <span>Connect your Prime Active merchandise using NFC</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-zinc-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      2
                    </div>
                    <span>Start wearing your merchandise by tapping "Start Wearing" in your collection</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-zinc-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      3
                    </div>
                    <span>Earn tokens for every hour you wear your merchandise</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-zinc-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      4
                    </div>
                    <span>Use earned tokens for discounts, exclusive items, and more!</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/merch/collection">
                <Button className="w-full">Manage Collection</Button>
              </Link>
              <Link href="/activity-rewards">
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Activity History
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
