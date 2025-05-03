import { BaseDePINService } from "./base-depin-service"
import type { ActivityData, DePINNetwork, DePINServiceConfig } from "./depin-types"

interface SweatcoinConfig extends DePINServiceConfig {
  walletAddress?: string
}

export class SweatcoinService extends BaseDePINService {
  private walletAddress: string | null = null
  private stepCount = 0
  private lastStepUpdate = 0

  constructor(config: SweatcoinConfig) {
    const network: DePINNetwork = {
      id: "sweatcoin",
      name: "Sweatcoin",
      tokenSymbol: "SWEAT",
      tokenName: "Sweat Economy",
      logoUrl: "/sweatcoin-inspired-logo.png",
      description: "Move-to-earn token rewarding physical activity",
      enabled: false,
    }

    super(network, config)
    this.walletAddress = config.walletAddress || null
  }

  public async enableMining(userId: string): Promise<boolean> {
    try {
      this.userId = userId

      // Register with Sweatcoin
      const registrationResult = await this.registerWallet()

      if (registrationResult) {
        this.isEnabled = true
        this.saveState()
        console.log("Sweatcoin mining enabled for user:", userId)
        return true
      } else {
        console.error("Failed to register wallet with Sweatcoin")
        return false
      }
    } catch (error) {
      console.error("Failed to enable Sweatcoin mining:", error)
      return false
    }
  }

  private async registerWallet(): Promise<boolean> {
    try {
      // In a real implementation, you would register the user's wallet
      // with the Sweatcoin platform

      // Simulated API call
      console.log("Registering wallet with Sweatcoin:", this.walletAddress || "No wallet provided")

      // Generate a wallet address if none provided
      if (!this.walletAddress) {
        this.walletAddress = `0x${Math.random().toString(16).substring(2, 42)}`
      }

      // Simulate successful registration
      return true
    } catch (error) {
      console.error("Error registering wallet:", error)
      return false
    }
  }

  public async disableMining(): Promise<boolean> {
    try {
      this.isEnabled = false
      this.saveState()
      console.log("Sweatcoin mining disabled")
      return true
    } catch (error) {
      console.error("Failed to disable Sweatcoin mining:", error)
      return false
    }
  }

  public async submitActivityData(activity: ActivityData): Promise<boolean> {
    if (!this.isEnabled || !this.userId) return false

    try {
      // Calculate steps from activity data
      const steps = this.calculateStepsFromActivity(activity)

      // Update step count
      this.stepCount += steps
      this.lastStepUpdate = Date.now()

      // Submit steps to Sweatcoin
      const result = await this.submitSteps(steps)

      if (result.success) {
        // Add reward based on steps
        this.addReward(result.reward, activity.id, result.txHash)

        console.log(`Submitted ${steps} steps to Sweatcoin, earned ${result.reward} SWEAT`)
        return true
      } else {
        console.error("Failed to submit steps to Sweatcoin:", result.error)
        return false
      }
    } catch (error) {
      console.error("Failed to submit activity data to Sweatcoin:", error)
      return false
    }
  }

  private calculateStepsFromActivity(activity: ActivityData): number {
    // Simple algorithm to estimate steps from distance and duration
    // In a real implementation, you would use a more sophisticated approach

    // Average step length in meters
    const averageStepLength = 0.75

    // Calculate steps from distance
    const distanceSteps = Math.floor((activity.distance * 1000) / averageStepLength)

    // Calculate steps from duration (assuming average cadence)
    const durationMinutes = activity.duration / 60
    const activityType = activity.type.toLowerCase()

    let cadence = 0
    if (activityType.includes("walk")) {
      cadence = 100 // steps per minute
    } else if (activityType.includes("run") || activityType.includes("jog")) {
      cadence = 160 // steps per minute
    } else if (activityType.includes("hike")) {
      cadence = 110 // steps per minute
    } else {
      cadence = 90 // default steps per minute
    }

    const durationSteps = Math.floor(durationMinutes * cadence)

    // Use the more conservative estimate
    return Math.min(distanceSteps, durationSteps)
  }

  private async submitSteps(steps: number): Promise<{
    success: boolean
    reward: number
    txHash?: string
    error?: string
  }> {
    try {
      // In a real implementation, you would call the Sweatcoin API
      // to submit steps and receive rewards

      // Simulated API call
      console.log(`Submitting ${steps} steps to Sweatcoin`)

      // Calculate reward (Sweatcoin typically gives ~1 SWEAT per 1000 steps)
      const reward = steps / 1000

      // Simulate transaction hash for the reward
      const txHash = `sweat_${Date.now().toString(36)}`

      return {
        success: true,
        reward,
        txHash,
      }
    } catch (error) {
      console.error("Error submitting steps:", error)
      return {
        success: false,
        reward: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}
