"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Clock, Shirt, Star, Timer, Smartphone, AlertTriangle, History } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { merchandiseWearService, type ConnectedMerchandise } from "@/services/merchandise-wear-service"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { TabBar } from "@/components/tab-bar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { activityIntegrationService, type IntegratedActivity } from "@/services/activity-integration-service"

export default function MerchandiseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [merchandise, setMerchandise] = useState<ConnectedMerchandise | null>(null)
  const [activities, setActivities] = useState<IntegratedActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    const loadMerchandise = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Add a slight delay to simulate loading
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (!params.id) {
          throw new Error("No merchandise ID provided")
        }

        const id = Array.isArray(params.id) ? params.id[0] : params.id
        console.log("Loading merchandise with ID:", id)

        // First, ensure we have demo items if needed
        const items = merchandiseWearService.getConnectedMerchandise()
        if (!items || items.length === 0 || items.length < 3) {
          console.log("Not enough items found, adding demo items")
          merchandiseWearService.addDemoItems()
        }

        // Try to get the item by ID
        const item = merchandiseWearService.getMerchandiseById(id)
        console.log("Retrieved item:", item)

        if (!item) {
          // If still not found, redirect to collection
          console.log("Item not found, redirecting to collection")
          toast({
            title: "Merchandise Not Found",
            description: "Redirecting to your collection...",
          })

          setTimeout(() => {
            router.push("/merch/collection")
          }, 1500)

          throw new Error("Merchandise not found")
        }

        setMerchandise(item)

        // Load activities for this merchandise
        const merchandiseActivities = activityIntegrationService.getActivitiesByMerchandiseId(id)
        setActivities(merchandiseActivities)
      } catch (error) {
        console.error("Error loading merchandise:", error)
        setError(error instanceof Error ? error.message : "Failed to load merchandise")

        toast({
          title: "Error",
          description: "Failed to load merchandise details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadMerchandise()
  }, [params.id, toast, router])

  // Format wear time
  const formatWearTime = (minutes: number): string => {
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

  // Toggle item wearing
  const handleToggleWearing = () => {
    if (!merchandise) return

    try {
      if (merchandise.isCurrentlyWorn) {
        merchandiseWearService.stopWearing(merchandise.id)
        toast({
          title: "Stopped wearing",
          description: `You've stopped wearing ${merchandise.productName}`,
        })
      } else {
        merchandiseWearService.startWearing(merchandise.id)
        toast({
          title: "Started wearing",
          description: `You're now wearing ${merchandise.productName}`,
        })
      }

      // Refresh merchandise data
      const updatedItem = merchandiseWearService.getMerchandiseById(merchandise.id)
      setMerchandise(updatedItem || null)
    } catch (error) {
      console.error("Error toggling wear status:", error)
      toast({
        title: "Error",
        description: "Failed to update wear status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle view NFT
  const handleViewNFT = () => {
    if (!merchandise) return

    // In a real app, you would navigate to the NFT detail page
    toast({
      title: "View NFT",
      description: "NFT functionality will be added in a future update.",
    })
  }

  // Calculate total rewards earned from this merchandise
  const totalRewardsEarned = activities.reduce((total, activity) => {
    return total + (activity.rewardAmount || 0)
  }, 0)

  // Safe format distance function to handle invalid dates
  const safeFormatDistanceToNow = (dateString: string | null | undefined): string => {
    if (!dateString) return "Never"

    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date"
      }
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/merch/collection">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Merchandise Details</h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-400">Loading merchandise details...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900 rounded-lg p-6 text-center">
            <div className="bg-red-800 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-200" />
            </div>
            <h3 className="text-lg font-bold mb-2">Error Loading Merchandise</h3>
            <p className="text-zinc-300 text-sm mb-4">{error}</p>
            <Button onClick={() => router.push("/merch/collection")}>Return to Collection</Button>
          </div>
        ) : !merchandise ? (
          <div className="bg-zinc-900 rounded-lg p-6 text-center">
            <div className="bg-zinc-800 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Smartphone className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">Merchandise Not Found</h3>
            <p className="text-zinc-400 text-sm mb-4">The requested merchandise could not be found.</p>
            <Button onClick={() => router.push("/merch/collection")}>Return to Collection</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Merchandise Image */}
            <div className="relative w-full h-64 bg-zinc-900 rounded-lg overflow-hidden">
              <Image
                src={merchandise.image || "/placeholder.svg?height=256&width=512&query=merchandise"}
                alt={merchandise.productName}
                fill
                className="object-contain"
              />
              <div className="absolute top-4 right-4 flex gap-1">
                {merchandise.hasNFC && <Badge className="bg-blue-500 text-white">NFC</Badge>}
                {merchandise.hasNFT && <Badge className="bg-purple-500 text-white">NFT</Badge>}
              </div>
            </div>

            <Tabs defaultValue="details" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 bg-zinc-800">
                <TabsTrigger
                  value="details"
                  className={activeTab === "details" ? "data-[state=active]:bg-zinc-900" : ""}
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="activities"
                  className={activeTab === "activities" ? "data-[state=active]:bg-zinc-900" : ""}
                >
                  Activities
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4">
                {/* Merchandise Details */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">{merchandise.productName}</h2>
                  <p className="text-zinc-400 mb-4">Connected {safeFormatDistanceToNow(merchandise.dateConnected)}</p>

                  <Card className="bg-zinc-900 border-none mb-6">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-sm text-zinc-500 mb-1">Total Wear Time</div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-[#ffc72d]" />
                            <span className="text-lg font-medium">{formatWearTime(merchandise.totalWearTime)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-zinc-500 mb-1">Tokens Earned</div>
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-[#ffc72d]" />
                            <span className="text-lg font-medium">{merchandise.tokenRewards}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-zinc-500 mb-1">Status</div>
                          <div className="flex items-center gap-2">
                            <Shirt className="h-5 w-5 text-[#ffc72d]" />
                            <span className="text-lg font-medium">
                              {merchandise.isCurrentlyWorn ? "Currently Worn" : "Not Worn"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-zinc-500 mb-1">Last Worn</div>
                          <div className="flex items-center gap-2">
                            <Timer className="h-5 w-5 text-[#ffc72d]" />
                            <span className="text-lg font-medium">{safeFormatDistanceToNow(merchandise.lastWorn)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Wear Status */}
                  {merchandise.isCurrentlyWorn && merchandise.wearingSince && (
                    <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">Currently Wearing</span>
                      </div>
                      <p className="text-sm text-zinc-300">
                        You've been wearing this item since {safeFormatDistanceToNow(merchandise.wearingSince)}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-4">
                    <Button
                      variant={merchandise.isCurrentlyWorn ? "destructive" : "default"}
                      className={`w-full ${!merchandise.isCurrentlyWorn ? "bg-[#ffc72d] hover:bg-[#e6b328] text-black" : ""}`}
                      onClick={handleToggleWearing}
                    >
                      {merchandise.isCurrentlyWorn ? "Stop Wearing" : "Start Wearing"}
                    </Button>

                    {merchandise.hasNFT && (
                      <Button variant="outline" className="w-full" onClick={handleViewNFT}>
                        View NFT
                      </Button>
                    )}

                    <Link href="/merch/wear-to-earn">
                      <Button variant="outline" className="w-full">
                        View Earnings
                      </Button>
                    </Link>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activities" className="mt-4">
                <div className="space-y-4">
                  <Card className="bg-zinc-900 border-none">
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-3">Earnings Summary</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-zinc-500 mb-1">Total Tokens</div>
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-[#ffc72d]" />
                            <span className="text-lg font-medium">{totalRewardsEarned}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-zinc-500 mb-1">Activities</div>
                          <div className="flex items-center gap-2">
                            <History className="h-5 w-5 text-[#ffc72d]" />
                            <span className="text-lg font-medium">{activities.length}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <h3 className="font-bold">Activity History</h3>

                  {activities.length === 0 ? (
                    <div className="bg-zinc-900 rounded-lg p-6 text-center">
                      <History className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
                      <h3 className="text-lg font-bold mb-2">No Activities Yet</h3>
                      <p className="text-zinc-400 text-sm mb-4">
                        You haven't recorded any activities with this merchandise yet.
                      </p>
                      <Button onClick={handleToggleWearing}>
                        {merchandise.isCurrentlyWorn ? "Stop Wearing" : "Start Wearing"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activities
                        .sort((a, b) => {
                          try {
                            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                          } catch (error) {
                            return 0
                          }
                        })
                        .map((activity) => (
                          <Card key={activity.id} className="bg-zinc-900 border-none">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-3">
                                <div className="bg-zinc-800 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                                  {activity.type === "wear" ? (
                                    <Shirt className="h-5 w-5 text-blue-500" />
                                  ) : (
                                    <Star className="h-5 w-5 text-amber-500" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{activity.title}</h4>
                                  <p className="text-sm text-zinc-400">{activity.description}</p>

                                  <div className="flex justify-between items-center mt-2">
                                    <div className="text-xs text-zinc-500">
                                      {safeFormatDistanceToNow(activity.timestamp)}
                                    </div>
                                    {activity.rewardAmount && (
                                      <div className="flex items-center gap-1 text-primary text-sm">
                                        <Star className="h-4 w-4" />
                                        <span>+{activity.rewardAmount} tokens</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}

                  <Link href="/activity-rewards">
                    <Button variant="outline" className="w-full mt-4">
                      View All Activities
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
