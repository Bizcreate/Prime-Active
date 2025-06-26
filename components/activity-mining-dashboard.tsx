"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useLayerTwoLabs } from "@/hooks/use-layer-two-labs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Trophy, Clock, Activity, ArrowRight } from "lucide-react"
import Image from "next/image"

export function ActivityMiningDashboard() {
  const [apiKey, setApiKey] = useState("")
  const [userId, setUserId] = useState("")
  const { isInitialized, isInitializing, rewards, pendingSubmissions, miningStats, initialize, checkRewardStatus } =
    useLayerTwoLabs()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")

  // Load user ID from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId") || ""
      setUserId(storedUserId || `user-${Math.floor(Math.random() * 10000)}`)
    }
  }, [])

  // Handle initialization
  const handleInitialize = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your LayerTwoLabs API key.",
        variant: "destructive",
      })
      return
    }

    if (!userId) {
      toast({
        title: "User ID Required",
        description: "Please enter your user ID.",
        variant: "destructive",
      })
      return
    }

    // Save user ID to local storage
    localStorage.setItem("userId", userId)

    // Initialize the service
    const success = await initialize(apiKey, userId)

    if (success) {
      // Clear API key for security
      setApiKey("")
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  // Check status of pending rewards
  const handleCheckStatus = async (rewardId: string) => {
    await checkRewardStatus(rewardId)
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Activity Mining
        </CardTitle>
        <CardDescription>Earn rewards by tracking your activities</CardDescription>
      </CardHeader>
      <CardContent>
        {!isInitialized ? (
          <div className="space-y-4">
            <p className="text-sm text-zinc-400">
              Connect to LayerTwoLabs to start earning rewards for your activities. You'll need an API key to get
              started.
            </p>

            <div className="space-y-3">
              <div>
                <label htmlFor="apiKey" className="text-sm font-medium block mb-1">
                  API Key
                </label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your LayerTwoLabs API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div>
                <label htmlFor="userId" className="text-sm font-medium block mb-1">
                  User ID
                </label>
                <Input
                  id="userId"
                  placeholder="Enter your user ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <Button onClick={handleInitialize} disabled={isInitializing} className="w-full">
                {isInitializing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  "Connect & Start Mining"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 bg-zinc-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-800 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400 mb-1">Total Rewards</div>
                  <div className="flex items-center gap-2">
                    <Image src="/shaka-coin.png" alt="Tokens" width={20} height={20} />
                    <span className="text-xl font-bold">
                      {miningStats?.totalRewards || rewards.reduce((sum, r) => sum + r.amount, 0)}
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-800 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400 mb-1">Activities Mined</div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="text-xl font-bold">{miningStats?.totalActivities || rewards.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800 p-3 rounded-lg">
                <div className="text-xs text-zinc-400 mb-2">Mining Rate</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    <span className="font-medium">
                      {miningStats?.averageRewardPerActivity?.toFixed(2) || "~10"} tokens per activity
                    </span>
                  </div>
                  <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
                    Active
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Recent Rewards</div>
                {rewards.length === 0 ? (
                  <div className="text-center py-4 text-sm text-zinc-400">
                    No rewards yet. Start tracking activities to earn!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {rewards.slice(0, 5).map((reward) => (
                      <div key={reward.id} className="bg-zinc-800 p-2 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image src="/shaka-coin.png" alt="Token" width={16} height={16} />
                          <span className="font-medium">{reward.amount}</span>
                          <span className="text-xs text-zinc-400">{reward.tokenType}</span>
                        </div>
                        <div className="text-xs text-zinc-400">{formatTimestamp(reward.timestamp)}</div>
                      </div>
                    ))}

                    {rewards.length > 5 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => setActiveTab("rewards")}
                      >
                        View All Rewards
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">All Rewards</div>
                <Badge className="bg-primary text-black">{rewards.length} Total</Badge>
              </div>

              {rewards.length === 0 ? (
                <div className="text-center py-8 text-sm text-zinc-400">
                  No rewards yet. Start tracking activities to earn!
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="bg-zinc-800 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Image src="/shaka-coin.png" alt="Token" width={20} height={20} />
                          <span className="font-medium">{reward.amount}</span>
                          <span className="text-xs text-zinc-400">{reward.tokenType}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            reward.status === "confirmed"
                              ? "bg-green-900/20 text-green-400 border-green-800"
                              : reward.status === "rejected"
                                ? "bg-red-900/20 text-red-400 border-red-800"
                                : "bg-yellow-900/20 text-yellow-400 border-yellow-800"
                          }
                        >
                          {reward.status}
                        </Badge>
                      </div>

                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>Activity: {reward.activityId}</span>
                        <span>{formatTimestamp(reward.timestamp)}</span>
                      </div>

                      {reward.txHash && <div className="mt-2 text-xs text-zinc-400 truncate">TX: {reward.txHash}</div>}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Pending Submissions</div>
                <Badge className="bg-zinc-700 text-zinc-300">{pendingSubmissions.length} Pending</Badge>
              </div>

              {pendingSubmissions.length === 0 ? (
                <div className="text-center py-8 text-sm text-zinc-400">No pending submissions.</div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {pendingSubmissions.map((submission) => (
                    <div key={submission.activityId} className="bg-zinc-800 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium capitalize">{submission.activityType} Activity</div>
                        <Badge variant="outline" className="bg-yellow-900/20 text-yellow-400 border-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400 mb-2">
                        <div>Duration: {(submission.duration / 60).toFixed(1)} min</div>
                        <div>Distance: {submission.distance.toFixed(2)} km</div>
                        <div>Steps: {submission.steps}</div>
                        <div>Calories: {Math.round(submission.calories)}</div>
                      </div>

                      <div className="text-xs text-zinc-400">Submitted: {formatTimestamp(submission.startTime)}</div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => handleCheckStatus(submission.activityId)}
                      >
                        Check Status
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
