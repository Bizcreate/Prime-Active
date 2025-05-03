import { BaseDePINService } from "./base-depin-service"
import type { ActivityData, DePINNetwork, DePINServiceConfig } from "./depin-types"
import { w3bStreamService, type W3bStreamReward } from "./w3bstream-service"
import { Web3 } from "web3"

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
  private web3: Web3
  private nodeUrl: string
  private contractAddress?: string
  private isTestnet: boolean
  private lastSyncTimestamp = 0

  constructor(config: IoTeXConfig) {
    const network: DePINNetwork = {
      id: "iotex",
      name: config.isTestnet ? "IoTeX Testnet" : "IoTeX",
      tokenSymbol: "IOTX",
      tokenName: "IoTeX Token",
      logoUrl: "/iotex-logo.png",
      description: "Blockchain for Internet of Things with W3bStream",
      enabled: false,
    }

    super(network, config)

    this.nodeUrl =
      config.nodeUrl || (config.isTestnet ? "https://babel-api.testnet.iotex.io" : "https://babel-api.mainnet.iotex.io")
    this.contractAddress = config.contractAddress
    this.isTestnet = config.isTestnet || false
    this.web3 = new Web3(this.nodeUrl)
  }

  public async enableMining(userId: string): Promise<boolean> {
    try {
      this.userId = userId

      // Initialize W3bStream for this user
      const success = await w3bStreamService.initialize(userId)
      if (!success) {
        console.error("Failed to initialize W3bStream")
        return false
      }

      // Register user with IoTeX DApp (in a real implementation)
      console.log(`Registering user ${userId} with IoTeX ${this.isTestnet ? "Testnet" : "Mainnet"}`)

      // For testnet, we can simulate successful registration
      this.isEnabled = true
      this.saveState()

      return true
    } catch (error) {
      console.error("Failed to enable IoTeX mining:", error)
      return false
    }
  }

  public async disableMining(): Promise<boolean> {
    try {
      // Stop W3bStream node
      await w3bStreamService.stopNode()

      this.isEnabled = false
      this.saveState()
      return true
    } catch (error) {
      console.error("Failed to disable IoTeX mining:", error)
      return false
    }
  }

  public async submitActivityData(activity: ActivityData): Promise<boolean> {
    if (!this.isEnabled || !this.userId) return false

    try {
      // Submit to W3bStream
      const reward = await w3bStreamService.submitActivity(activity)

      if (reward) {
        // Calculate adjusted reward based on wear-to-earn and activity level
        const adjustedReward = await this.calculateAdjustedReward(reward.amount, activity)

        // Add adjusted reward to our balance
        this.addReward(adjustedReward, activity.id, reward.txHash)

        console.log(`IoTeX activity submitted via W3bStream, earned ${adjustedReward.toFixed(4)} IOTX`)
        return true
      }

      return false
    } catch (error) {
      console.error("Failed to submit activity data to IoTeX:", error)
      return false
    }
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

  public getNodeStatus() {
    return w3bStreamService.getNodeStatus()
  }

  public isNodeActive() {
    return w3bStreamService.isNodeActive()
  }

  public async startNode() {
    console.log("Starting IoTeX node...")
    const result = await w3bStreamService.startNode()
    console.log("IoTeX node start result:", result)
    return result
  }

  public async stopNode() {
    console.log("Stopping IoTeX node...")
    const result = await w3bStreamService.stopNode()
    console.log("IoTeX node stop result:", result)
    return result
  }

  public getRewards(): W3bStreamReward[] {
    return w3bStreamService.getRewards()
  }

  public getPassiveRate(): number {
    return w3bStreamService.getPassiveRate()
  }

  public setPassiveRate(rate: number): void {
    w3bStreamService.setPassiveRate(rate)
  }

  public syncRewardsWithW3bStream(): void {
    // Get all rewards from W3bStream
    const totalMined = w3bStreamService.getTotalMined()

    // Update our balance
    this.balance = totalMined
    this.lastSyncTimestamp = Date.now()
    this.saveState()
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

    return this.web3.utils.sha3(locationString) || ""
  }

  // This method is to support IoTeXNodeManager component
  public getProjectDetails() {
    return {
      id: "prime_active_w3bs",
      version: "1.0.3",
    }
  }
}

// Export a function to create an instance of IoTeXService
export function createIoTeXService(config: IoTeXConfig): IoTeXService {
  return new IoTeXService(config)
}
