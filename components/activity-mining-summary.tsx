"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLayerTwoLabs } from "@/hooks/use-layer-two-labs"
import type { ActivitySession } from "@/services/activity-tracking"
import { Loader2, Check, AlertTriangle } from "lucide-react"
import Image from "next/image"

interface ActivityMiningSummaryProps {
  activity: ActivitySession | null
}

export function ActivityMiningSummary({ activity }: ActivityMiningSummaryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [reward, setReward] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const { isInitialized, submitActivity } = useLayerTwoLabs()

  // Submit activity for mining
  const handleSubmit = async () => {
    if (!activity || !isInitialized) return

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitActivity(activity)

      if (result.success) {
        setIsSubmitted(true)
        if (result.rewardId) {
          // Find the reward in the rewards list
          // This is a simplified approach - in a real app, you'd fetch the reward details
          setReward({
            id: result.rewardId,
            amount: Math.floor(Math.random() * 20) + 5, // Simulated amount
            tokenType: "ACTIVE",
          })
        }
      } else {
        setError(result.error || "Failed to submit activity for mining")
      }
    } catch (error) {
      console.error("Error submitting activity:", error)
      setError(String(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Auto-submit if initialized
  useEffect(() => {
    if (activity && isInitialized && !isSubmitted && !isSubmitting) {
      handleSubmit()
    }
  }, [activity, isInitialized])

  if (!activity) return null

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Activity Mining</h3>
          {isInitialized ? (
            <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
              Enabled
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700">
              Not Enabled
            </Badge>
          )}
        </div>

        {!isInitialized ? (
          <div className="text-center py-2">
            <p className="text-sm text-zinc-400 mb-2">Enable Activity Mining to earn rewards for your activities</p>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <a href="/activity-mining">Set Up Mining</a>
            </Button>
          </div>
        ) : isSubmitting ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <p className="text-sm">Submitting activity for mining...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-900 rounded-md p-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : isSubmitted ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-400">
              <Check className="h-5 w-5" />
              <span>Activity submitted successfully</span>
            </div>

            {reward ? (
              <div className="bg-zinc-800 p-3 rounded-lg">
                <div className="text-sm font-medium mb-1">Reward Earned</div>
                <div className="flex items-center gap-2">
                  <Image src="/shaka-coin.png" alt="Token" width={24} height={24} />
                  <span className="text-xl font-bold">{reward.amount}</span>
                  <span className="text-sm text-zinc-400">{reward.tokenType}</span>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-800 p-3 rounded-lg">
                <div className="text-sm font-medium mb-1">Processing Reward</div>
                <p className="text-xs text-zinc-400">
                  Your activity is being processed. Rewards will be added to your wallet soon.
                </p>
              </div>
            )}

            <Button variant="outline" size="sm" className="w-full" asChild>
              <a href="/activity-mining">View Mining Dashboard</a>
            </Button>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-zinc-400 mb-2">Submit this activity to earn mining rewards</p>
            <Button onClick={handleSubmit} className="w-full">
              Mine Activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
