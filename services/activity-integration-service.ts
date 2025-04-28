import { merchandiseWearService } from "./merchandise-wear-service"

export interface ActivityReward {
  id: string
  amount: number
  timestamp: string
  source: "wear" | "event" | "challenge" | "other"
  sourceId: string
  sourceName: string
  sourceImage?: string
}

export interface IntegratedActivity {
  id: string
  timestamp: string
  type: "wear" | "event" | "purchase" | "redeem"
  title: string
  description: string
  merchandiseId?: string
  merchandiseName?: string
  merchandiseImage?: string
  eventId?: string
  eventName?: string
  eventImage?: string
  rewardAmount?: number
  rewardType?: "tokens" | "points" | "discount" | "access"
  duration?: number // in minutes
}

class ActivityIntegrationService {
  private storageKey = "integrated_activities"
  private rewardsKey = "activity_rewards"

  // Get all integrated activities
  getIntegratedActivities(): IntegratedActivity[] {
    if (typeof window === "undefined") return []

    try {
      const storedActivities = localStorage.getItem(this.storageKey)
      if (!storedActivities) {
        // No activities found, add demo activities
        this.addDemoActivities()
        // Try again after adding demo activities
        const newStoredActivities = localStorage.getItem(this.storageKey)
        return newStoredActivities ? (JSON.parse(newStoredActivities) as IntegratedActivity[]) : []
      }

      return JSON.parse(storedActivities) as IntegratedActivity[]
    } catch (error) {
      console.error("Error getting integrated activities:", error)
      // If there's an error, try to add demo activities and return them
      this.addDemoActivities()
      const newStoredActivities = localStorage.getItem(this.storageKey)
      return newStoredActivities ? (JSON.parse(newStoredActivities) as IntegratedActivity[]) : []
    }
  }

  // Get activities by merchandise ID
  getActivitiesByMerchandiseId(merchandiseId: string): IntegratedActivity[] {
    const activities = this.getIntegratedActivities()
    return activities.filter((activity) => activity.merchandiseId === merchandiseId)
  }

  // Get activities by event ID
  getActivitiesByEventId(eventId: string): IntegratedActivity[] {
    const activities = this.getIntegratedActivities()
    return activities.filter((activity) => activity.eventId === eventId)
  }

  // Get all activity rewards
  getActivityRewards(): ActivityReward[] {
    if (typeof window === "undefined") return []

    try {
      const storedRewards = localStorage.getItem(this.rewardsKey)
      if (!storedRewards) {
        // No rewards found, add demo rewards
        this.addDemoRewards()
        // Try again after adding demo rewards
        const newStoredRewards = localStorage.getItem(this.rewardsKey)
        return newStoredRewards ? (JSON.parse(newStoredRewards) as ActivityReward[]) : []
      }

      return JSON.parse(storedRewards) as ActivityReward[]
    } catch (error) {
      console.error("Error getting activity rewards:", error)
      // If there's an error, try to add demo rewards and return them
      this.addDemoRewards()
      const newStoredRewards = localStorage.getItem(this.rewardsKey)
      return newStoredRewards ? (JSON.parse(newStoredRewards) as ActivityReward[]) : []
    }
  }

  // Get rewards by source ID
  getRewardsBySourceId(sourceId: string): ActivityReward[] {
    const rewards = this.getActivityRewards()
    return rewards.filter((reward) => reward.sourceId === sourceId)
  }

  // Get total rewards earned
  getTotalRewardsEarned(): number {
    const rewards = this.getActivityRewards()
    return rewards.reduce((total, reward) => total + reward.amount, 0)
  }

  // Get total rewards by source type
  getTotalRewardsBySourceType(sourceType: "wear" | "event" | "challenge" | "other"): number {
    const rewards = this.getActivityRewards()
    return rewards.filter((reward) => reward.source === sourceType).reduce((total, reward) => total + reward.amount, 0)
  }

  // Add a new activity
  addActivity(activity: IntegratedActivity): void {
    if (typeof window === "undefined") return

    try {
      const activities = this.getIntegratedActivities()
      activities.push(activity)
      localStorage.setItem(this.storageKey, JSON.stringify(activities))
    } catch (error) {
      console.error("Error adding activity:", error)
    }
  }

  // Add a new reward
  addReward(reward: ActivityReward): void {
    if (typeof window === "undefined") return

    try {
      const rewards = this.getActivityRewards()
      rewards.push(reward)
      localStorage.setItem(this.rewardsKey, JSON.stringify(rewards))
    } catch (error) {
      console.error("Error adding reward:", error)
    }
  }

  // Generate wear activities from merchandise wear service
  generateWearActivities(): void {
    if (typeof window === "undefined") return

    try {
      const merchandise = merchandiseWearService.getConnectedMerchandise()
      const activities: IntegratedActivity[] = []

      merchandise.forEach((item) => {
        if (item.totalWearTime > 0) {
          // Create an activity for each wear session
          const activity: IntegratedActivity = {
            id: `wear-${item.id}-${Date.now()}`,
            timestamp: item.lastWorn || new Date().toISOString(),
            type: "wear",
            title: `Wore ${item.productName}`,
            description: `Earned tokens by wearing your ${item.productName}`,
            merchandiseId: item.id,
            merchandiseName: item.productName,
            merchandiseImage: item.image,
            rewardAmount: item.tokenRewards,
            rewardType: "tokens",
            duration: item.totalWearTime,
          }

          activities.push(activity)

          // Create a reward for the wear activity
          const reward: ActivityReward = {
            id: `reward-${item.id}-${Date.now()}`,
            amount: item.tokenRewards,
            timestamp: item.lastWorn || new Date().toISOString(),
            source: "wear",
            sourceId: item.id,
            sourceName: item.productName,
            sourceImage: item.image,
          }

          this.addReward(reward)
        }
      })

      // Add the activities to the existing ones
      const existingActivities = this.getIntegratedActivities()
      const allActivities = [...existingActivities, ...activities]
      localStorage.setItem(this.storageKey, JSON.stringify(allActivities))
    } catch (error) {
      console.error("Error generating wear activities:", error)
    }
  }

  // Add demo activities
  private addDemoActivities(): void {
    if (typeof window === "undefined") return

    const now = new Date()
    const oneDay = 24 * 60 * 60 * 1000
    const twoDays = 2 * oneDay
    const threeDays = 3 * oneDay
    const oneWeek = 7 * oneDay

    const demoActivities: IntegratedActivity[] = [
      {
        id: "activity-001",
        timestamp: new Date(now.getTime() - oneDay).toISOString(),
        type: "wear",
        title: "Wore Prime Mates Jumper",
        description: "Earned tokens by wearing your Prime Mates Jumper for 3 hours",
        merchandiseId: "merch-003",
        merchandiseName: "Prime Mates Jumper",
        merchandiseImage: "/prime-mates-jumper.png",
        rewardAmount: 18,
        rewardType: "tokens",
        duration: 180, // 3 hours
      },
      {
        id: "activity-002",
        timestamp: new Date(now.getTime() - twoDays).toISOString(),
        type: "event",
        title: "Attended Beach Cleanup",
        description: "Earned tokens by participating in the Beach Cleanup event",
        eventId: "event4",
        eventName: "Beach Cleanup",
        eventImage: "/coastal-cleanup-crew.png",
        rewardAmount: 50,
        rewardType: "tokens",
      },
      {
        id: "activity-003",
        timestamp: new Date(now.getTime() - threeDays).toISOString(),
        type: "wear",
        title: "Wore Prime Mates Snapback",
        description: "Earned tokens by wearing your Prime Mates Snapback for 5 hours",
        merchandiseId: "merch-002",
        merchandiseName: "Prime Mates Board Club Snapback",
        merchandiseImage: "/prime-mates-snapback.png",
        rewardAmount: 30,
        rewardType: "tokens",
        duration: 300, // 5 hours
      },
      {
        id: "activity-004",
        timestamp: new Date(now.getTime() - oneWeek).toISOString(),
        type: "redeem",
        title: "Redeemed Event Access",
        description: "Used 100 tokens to get access to the Skate Park Competition",
        eventId: "event4",
        eventName: "Skate Park Competition",
        eventImage: "/downtown-skate-showdown.png",
        rewardAmount: -100,
        rewardType: "access",
      },
      {
        id: "activity-005",
        timestamp: new Date(now.getTime() - oneWeek - oneDay).toISOString(),
        type: "purchase",
        title: "Purchased with Discount",
        description: "Used 50 tokens for 20% off Prime Mates T-Shirt",
        merchandiseId: "merch-001",
        merchandiseName: "Prime Mates Classic T-Shirt",
        merchandiseImage: "/prime-mates-tshirt.png",
        rewardAmount: -50,
        rewardType: "discount",
      },
    ]

    localStorage.setItem(this.storageKey, JSON.stringify(demoActivities))
  }

  // Add demo rewards
  private addDemoRewards(): void {
    if (typeof window === "undefined") return

    const now = new Date()
    const oneDay = 24 * 60 * 60 * 1000
    const twoDays = 2 * oneDay
    const threeDays = 3 * oneDay
    const oneWeek = 7 * oneDay

    const demoRewards: ActivityReward[] = [
      {
        id: "reward-001",
        amount: 18,
        timestamp: new Date(now.getTime() - oneDay).toISOString(),
        source: "wear",
        sourceId: "merch-003",
        sourceName: "Prime Mates Jumper",
        sourceImage: "/prime-mates-jumper.png",
      },
      {
        id: "reward-002",
        amount: 50,
        timestamp: new Date(now.getTime() - twoDays).toISOString(),
        source: "event",
        sourceId: "event4",
        sourceName: "Beach Cleanup",
        sourceImage: "/coastal-cleanup-crew.png",
      },
      {
        id: "reward-003",
        amount: 30,
        timestamp: new Date(now.getTime() - threeDays).toISOString(),
        source: "wear",
        sourceId: "merch-002",
        sourceName: "Prime Mates Board Club Snapback",
        sourceImage: "/prime-mates-snapback.png",
      },
      {
        id: "reward-004",
        amount: 75,
        timestamp: new Date(now.getTime() - oneWeek).toISOString(),
        source: "challenge",
        sourceId: "challenge-001",
        sourceName: "Weekly Skate Challenge",
        sourceImage: "/placeholder.svg?key=ol3zm",
      },
      {
        id: "reward-005",
        amount: 25,
        timestamp: new Date(now.getTime() - oneWeek - oneDay).toISOString(),
        source: "other",
        sourceId: "referral-001",
        sourceName: "Friend Referral",
        sourceImage: "/connected-growth.png",
      },
    ]

    localStorage.setItem(this.rewardsKey, JSON.stringify(demoRewards))
  }
}

// Create a singleton instance
export const activityIntegrationService = new ActivityIntegrationService()
