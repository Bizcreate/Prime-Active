import { BaseDePINService } from "./base-depin-service"
import type { DePINNetwork, DePINServiceConfig, ActivityData } from "./depin-types"
import { w3bStreamService } from "./w3bstream-service"

interface IoTeXConfig extends DePINServiceConfig {
  nodeUrl: string
  contractAddress?: string
  isTestnet?: boolean
}

// Base IoTeX mining rewards (tokens per timeframe)
const BASE_MINING_REWARDS = {
  daily: 10,
  weekly: 70,
  monthly: 300,
}

// Maximum multipliers
const MAX_WEAR_MULTIPLIER = 2.0
const MAX_ACTIVITY_MULTIPLIER = 2.0

export class IoTeXService extends BaseDePINService {
  private nodeActive = false
  private passiveRate = 0.5 // Tokens per hour

  constructor(network: DePINNetwork, config: DePINServiceConfig) {
    super(network, config)
  }

  public async enableMining(userId: string): Promise<boolean> {
    try {
      this.userId = userId
      this.isEnabled = true

      // Initialize W3bStream service
      await w3bStreamService.initialize(userId)

      console.log(`IoTeX mining enabled for user ${userId}`)
      this.saveState()
      return true
    } catch (error) {
      console.error("Failed to enable IoTeX mining:", error)
      return false
    }
  }

  public async disableMining(): Promise<boolean> {
    try {
      // Stop node if active
      if (this.nodeActive) {
        await this.stopNode()
      }

      this.isEnabled = false
      this.saveState()
      return true
    } catch (error) {
      console.error("Failed to disable IoTeX mining:", error)
      return false
    }
  }

  public async startNode(): Promise<boolean> {
    try {
      if (!this.isEnabled) {
        console.error("IoTeX service not enabled")
        return false
      }

      const success = await w3bStreamService.startNode()
      if (success) {
        this.nodeActive = true
        this.saveState()
      }
      return success
    } catch (error) {
      console.error("Failed to start IoTeX node:", error)
      return false
    }
  }

  public async stopNode(): Promise<boolean> {
    try {
      const success = await w3bStreamService.stopNode()
      if (success) {
        this.nodeActive = false
        this.saveState()
      }
      return success
    } catch (error) {
      console.error("Failed to stop IoTeX node:", error)
      return false
    }
  }

  public isNodeActive(): boolean {
    return this.nodeActive
  }

  public getNodeStatus(): string {
    return this.nodeActive ? "Active" : "Inactive"
  }

  public async submitActivityData(activity: ActivityData): Promise<boolean> {
    try {
      if (!this.isEnabled) {
        console.error("IoTeX service not enabled")
        return false
      }

      // Submit to W3bStream
      const reward = await w3bStreamService.submitActivity(activity)

      if (reward) {
        // Add reward to our records
        this.addReward(reward.amount, activity.id, reward.txHash)
        return true
      }

      return false
    } catch (error) {
      console.error("Failed to submit activity data to IoTeX:", error)
      return false
    }
  }

  public getPassiveRate(): number {
    return this.passiveRate
  }

  public setPassiveRate(rate: number): void {
    this.passiveRate = rate
    w3bStreamService.setPassiveRate(rate)
  }

  public getRewards(): any[] {
    return w3bStreamService.getRewards()
  }

  public getTotalMined(): number {
    return w3bStreamService.getTotalMined()
  }

  /**
   * Calculate adjusted reward based on wear-to-earn and activity level
   */
  private async calculateAdjustedReward(baseAmount: number, activity: ActivityData): Promise<number> {
    if (!this.userId) return baseAmount

    try {
      // Get user's merchandise wear status (returns a value between 0-1)
      const wearStatus = await this.getMerchandiseWearStatus(this.userId)

      // Get user's activity level (returns a value between 0-1)
      const activityLevel = await this.getUserActivityLevel(this.userId, activity)

      // Halve the base reward as per the new system
      const baseReward = baseAmount / 2

      // Calculate multipliers (scaled between 1.0 and MAX_MULTIPLIER)
      const wearToEarnMultiplier = 1 + wearStatus * (MAX_WEAR_MULTIPLIER - 1)
      const activityMultiplier = 1 + activityLevel * (MAX_ACTIVITY_MULTIPLIER - 1)

      // Calculate bonuses
      const wearToEarnBonus = baseReward * (wearToEarnMultiplier - 1)
      const activityBonus = baseReward * (activityMultiplier - 1)

      // Calculate total reward
      const totalReward = baseReward + wearToEarnBonus + activityBonus

      return totalReward
    } catch (error) {
      console.error("Error calculating adjusted reward:", error)
      return baseAmount // Fallback to original amount if calculation fails
    }
  }

  /**
   * Get user's merchandise wear status
   * Returns a value between 0 and 1 representing the level of merchandise engagement
   */
  private async getMerchandiseWearStatus(userId: string): Promise<number> {
    try {
      // In a real implementation, this would call the merchandise-wear-service
      // For now, return a mock value between 0 and 1
      return 0.7
    } catch (error) {
      console.error("Error getting merchandise wear status:", error)
      return 0
    }
  }

  /**
   * Get user's activity level
   * Returns a value between 0 and 1 representing the level of platform activity
   */
  private async getUserActivityLevel(userId: string, currentActivity?: ActivityData): Promise<number> {
    try {
      // In a real implementation, this would analyze the user's activity history
      // For now, return a mock value between 0 and 1
      return 0.8
    } catch (error) {
      console.error("Error getting user activity level:", error)
      return 0
    }
  }

  /**
   * Calculate mining rewards based on user's merchandise wear and activity level
   */
  public async calculateMiningRewards(timeframe: "daily" | "weekly" | "monthly" = "daily") {
    if (!this.userId) {
      throw new Error("User ID not set")
    }

    try {
      // Get base reward for the selected timeframe
      const standardReward = BASE_MINING_REWARDS[timeframe]

      // Halve the base reward as per the new system
      const baseReward = standardReward / 2

      // Get user's merchandise wear status (returns a value between 0-1)
      const wearStatus = await this.getMerchandiseWearStatus(this.userId)

      // Get user's activity level (returns a value between 0-1)
      const activityLevel = await this.getUserActivityLevel(this.userId)

      // Calculate multipliers (scaled between 1.0 and MAX_MULTIPLIER)
      const wearToEarnMultiplier = 1 + wearStatus * (MAX_WEAR_MULTIPLIER - 1)
      const activityMultiplier = 1 + activityLevel * (MAX_ACTIVITY_MULTIPLIER - 1)

      // Calculate bonuses
      const wearToEarnBonus = baseReward * (wearToEarnMultiplier - 1)
      const activityBonus = baseReward * (activityMultiplier - 1)

      // Calculate total reward
      const totalReward = baseReward + wearToEarnBonus + activityBonus

      return {
        baseReward,
        wearToEarnBonus,
        activityBonus,
        totalReward,
        wearToEarnMultiplier,
        activityMultiplier,
      }
    } catch (error) {
      console.error("Error calculating mining rewards:", error)
      throw error
    }
  }

  /**
   * Get user's IoTeX mining history
   */
  public async getMiningHistory(timeframe: "daily" | "weekly" | "monthly" = "daily") {
    if (!this.userId) {
      throw new Error("User ID not set")
    }

    // This would typically be an API call to fetch historical data
    // For now, we'll return mock data
    return {
      history: [
        { date: "2023-05-01", baseReward: 5, wearToEarnBonus: 2.5, activityBonus: 3.2, totalReward: 10.7 },
        { date: "2023-05-02", baseReward: 5, wearToEarnBonus: 3.0, activityBonus: 3.5, totalReward: 11.5 },
        { date: "2023-05-03", baseReward: 5, wearToEarnBonus: 3.2, activityBonus: 3.8, totalReward: 12.0 },
        // More historical data...
      ],
      totalEarned: 34.2,
    }
  }

  private formatActivityData(activity: ActivityData): any {
    // Format the activity data according to IoTeX requirements
    return {
      userId: this.userId,
      activityId: activity.id,
      activityType: activity.type,
      startTime: activity.startTime,
      endTime: activity.endTime,
      duration: activity.duration,
      distance: activity.distance,
      locationCount: activity.locations.length,
      // Include a hash of the locations for verification
      locationHash: this.hashLocations(activity.locations),
    }
  }

  private hashLocations(locations: any[]): string {
    // Create a simple hash of the locations for verification
    // In a real implementation, this would be more sophisticated
    const locationString = locations
      .map((loc) => `${loc.latitude.toFixed(6)},${loc.longitude.toFixed(6)},${loc.timestamp}`)
      .join("|")

    // Use a simple hash function instead of web3.utils.sha3
    return this.simpleHash(locationString)
  }

  private simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString(16)
  }

  // This method is to support IoTeXNodeManager component
  public getProjectDetails() {
    return {
      id: "prime_active_w3bs",
      version: "1.0.3",
    }
  }
}

// First, define the IoTeXServiceClass before using it
class IoTeXServiceClass extends IoTeXService {
  constructor(network: DePINNetwork, config: DePINServiceConfig) {
    super(network, config)
  }
}

// Then create and export the singleton instance
export const iotexService = new IoTeXServiceClass(
  {
    id: "iotex",
    name: "IoTeX",
    description: "IoTeX is a blockchain platform for the Internet of Things (IoT).",
    tokenSymbol: "IOTX",
    tokenName: "IoTeX",
    logoUrl: "/iotex-logo.png",
    website: "https://iotex.io",
    category: "compute",
    status: "active",
  },
  {
    apiUrl: "https://api.iotex.io",
    options: {
      chainId: 4689,
    },
  },
)
