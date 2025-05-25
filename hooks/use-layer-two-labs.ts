"use client"

import { useState, useEffect, useCallback } from "react"
import { layerTwoLabsService } from "@/services/layer-two-labs-service"
import type { ActivitySession } from "@/services/activity-tracking"
import { useToast } from "@/hooks/use-toast"

export function useLayerTwoLabs() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [rewards, setRewards] = useState<any[]>([])
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([])
  const [miningStats, setMiningStats] = useState<any>(null)
  const { toast } = useToast()

  // Initialize on component mount
  useEffect(() => {
    setIsInitialized(layerTwoLabsService.isServiceInitialized())

    // Load rewards and pending submissions
    if (layerTwoLabsService.isServiceInitialized()) {
      setRewards(layerTwoLabsService.getRewards())
      setPendingSubmissions(layerTwoLabsService.getPendingSubmissions())

      // Fetch mining stats
      fetchMiningStats()
    }
  }, [])

  // Initialize the service
  const initialize = useCallback(
    async (apiKey: string, userId: string) => {
      setIsInitializing(true)

      try {
        const success = await layerTwoLabsService.initialize(
          {
            apiKey,
            apiEndpoint: "https://api.layertwolabs.io", // Replace with actual endpoint
            projectId: "prime-active-app",
            webhookSecret: "", // This would be set server-side
          },
          userId,
        )

        setIsInitialized(success)

        if (success) {
          toast({
            title: "Activity Mining Enabled",
            description: "You can now earn rewards for your activities!",
          })

          // Load initial data
          setRewards(layerTwoLabsService.getRewards())
          setPendingSubmissions(layerTwoLabsService.getPendingSubmissions())
          fetchMiningStats()
        } else {
          toast({
            title: "Initialization Failed",
            description: "Unable to enable activity mining. Please try again.",
            variant: "destructive",
          })
        }

        return success
      } catch (error) {
        console.error("Error initializing LayerTwoLabs:", error)
        toast({
          title: "Initialization Error",
          description: String(error),
          variant: "destructive",
        })
        return false
      } finally {
        setIsInitializing(false)
      }
    },
    [toast],
  )

  // Submit activity for mining
  const submitActivity = useCallback(
    async (activity: ActivitySession) => {
      if (!layerTwoLabsService.isServiceInitialized()) {
        toast({
          title: "Service Not Initialized",
          description: "Please initialize the service first.",
          variant: "destructive",
        })
        return { success: false }
      }

      try {
        const result = await layerTwoLabsService.submitActivity(activity)

        if (result.success) {
          toast({
            title: "Activity Submitted",
            description: result.rewardId
              ? "You earned a reward for your activity!"
              : "Your activity was submitted for mining.",
          })

          // Refresh data
          setRewards(layerTwoLabsService.getRewards())
          setPendingSubmissions(layerTwoLabsService.getPendingSubmissions())
          fetchMiningStats()
        } else {
          toast({
            title: "Submission Failed",
            description: result.error || "Unable to submit activity for mining.",
            variant: "destructive",
          })
        }

        return result
      } catch (error) {
        console.error("Error submitting activity:", error)
        toast({
          title: "Submission Error",
          description: String(error),
          variant: "destructive",
        })
        return { success: false, error: String(error) }
      }
    },
    [toast],
  )

  // Check reward status
  const checkRewardStatus = useCallback(async (rewardId: string) => {
    if (!layerTwoLabsService.isServiceInitialized()) {
      return { success: false, error: "Service not initialized" }
    }

    try {
      const result = await layerTwoLabsService.checkRewardStatus(rewardId)

      if (result.success) {
        // Refresh rewards
        setRewards(layerTwoLabsService.getRewards())
      }

      return result
    } catch (error) {
      console.error("Error checking reward status:", error)
      return { success: false, error: String(error) }
    }
  }, [])

  // Fetch mining stats
  const fetchMiningStats = useCallback(async () => {
    if (!layerTwoLabsService.isServiceInitialized()) {
      return
    }

    try {
      const result = await layerTwoLabsService.getMiningStats()

      if (result.success && result.stats) {
        setMiningStats(result.stats)
      }
    } catch (error) {
      console.error("Error fetching mining stats:", error)
    }
  }, [])

  return {
    isInitialized,
    isInitializing,
    rewards,
    pendingSubmissions,
    miningStats,
    initialize,
    submitActivity,
    checkRewardStatus,
    fetchMiningStats,
  }
}
