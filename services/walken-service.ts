import { BaseDePINService } from "./base-depin-service"
import type { ActivityData, DePINNetwork, DePINServiceConfig } from "./depin-types"

interface WalkenConfig extends DePINServiceConfig {
  walletAddress?: string
  characterId?: string
}

interface WalkenCharacter {
  id: string
  name: string
  level: number
  stamina: number
  maxStamina: number
  lastStaminaUpdate: number
}

export class WalkenService extends BaseDePINService {
  private walletAddress: string | null = null
  private character: WalkenCharacter | null = null

  constructor(config: WalkenConfig) {
    const network: DePINNetwork = {
      id: "walken",
      name: "Walken",
      tokenSymbol: "WLKN",
      tokenName: "Walken Token",
      logoUrl: "/walken-logo.png",
      description: "Move-to-earn game with step tracking",
      enabled: false,
    }

    super(network, config)
    this.walletAddress = config.walletAddress || null

    // Initialize character if ID provided
    if (config.characterId) {
      this.initializeCharacter(config.characterId)
    }
  }

  private initializeCharacter(id: string): void {
    this.character = {
      id,
      name: `CAThletic #${id.substring(0, 4)}`,
      level: 1,
      stamina: 100,
      maxStamina: 100,
      lastStaminaUpdate: Date.now(),
    }
  }

  public async enableMining(userId: string): Promise<boolean> {
    try {
      this.userId = userId

      // Create or retrieve character
      const characterResult = await this.getOrCreateCharacter()

      if (characterResult) {
        this.isEnabled = true
        this.saveState()
        console.log("Walken mining enabled for user:", userId)
        return true
      } else {
        console.error("Failed to enable Walken mining: Could not create character")
        return false
      }
    } catch (error) {
      console.error("Failed to enable Walken mining:", error)
      return false
    }
  }

  private async getOrCreateCharacter(): Promise<boolean> {
    try {
      // In a real implementation, you would check if the user has a character
      // or create one for them

      if (!this.character) {
        // Create a new character
        const characterId = `char_${Date.now().toString(36)}`
        this.initializeCharacter(characterId)
      }

      // Simulate successful character creation/retrieval
      return true
    } catch (error) {
      console.error("Error creating/retrieving character:", error)
      return false
    }
  }

  public async disableMining(): Promise<boolean> {
    try {
      this.isEnabled = false
      this.saveState()
      console.log("Walken mining disabled")
      return true
    } catch (error) {
      console.error("Failed to disable Walken mining:", error)
      return false
    }
  }

  public async submitActivityData(activity: ActivityData): Promise<boolean> {
    if (!this.isEnabled || !this.userId || !this.character) return false

    try {
      // Update character stamina
      this.updateStamina()

      // Calculate steps from activity
      const steps = this.calculateStepsFromActivity(activity)

      // Calculate stamina used (1 stamina per 100 steps)
      const staminaUsed = Math.min(this.character.stamina, Math.ceil(steps / 100))

      if (staminaUsed <= 0) {
        console.log("No stamina available for Walken mining")
        return false
      }

      // Submit steps to Walken
      const result = await this.submitStepsToWalken(steps, staminaUsed)

      if (result.success) {
        // Deduct stamina
        this.character.stamina -= staminaUsed

        // Add rewards
        this.addReward(result.wlknReward, activity.id, result.txHash)

        // Check for level up
        if (result.levelUp) {
          this.character.level += 1
          this.character.maxStamina += 10
          console.log(`Character leveled up to ${this.character.level}!`)
        }

        console.log(`Used ${staminaUsed} stamina on Walken, earned ${result.wlknReward} WLKN`)
        return true
      } else {
        console.error("Failed to submit steps to Walken:", result.error)
        return false
      }
    } catch (error) {
      console.error("Failed to submit activity data to Walken:", error)
      return false
    }
  }

  private updateStamina(): void {
    // Walken typically regenerates stamina over time
    const now = Date.now()
    const hoursPassed = (now - this.character!.lastStaminaUpdate) / (1000 * 60 * 60)

    // Each hour adds 5 stamina (up to max)
    const staminaToAdd = Math.floor(hoursPassed * 5)

    if (staminaToAdd > 0) {
      this.character!.stamina = Math.min(this.character!.maxStamina, this.character!.stamina + staminaToAdd)
      this.character!.lastStaminaUpdate = now
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

  private async submitStepsToWalken(
    steps: number,
    staminaUsed: number,
  ): Promise<{
    success: boolean
    wlknReward: number
    levelUp: boolean
    txHash?: string
    error?: string
  }> {
    try {
      // In a real implementation, you would call the Walken API
      // to submit steps and receive rewards

      // Simulated API call
      console.log(`Submitting ${steps} steps to Walken using ${staminaUsed} stamina`)

      // Calculate WLKN reward (typically 0.1-0.3 WLKN per stamina point)
      const baseReward = 0.1 + Math.random() * 0.2
      const wlknReward = baseReward * staminaUsed

      // Check for level up (random chance based on steps)
      const levelUpChance = steps / 10000 // 1% chance per 10,000 steps
      const levelUp = Math.random() < levelUpChance

      // Simulate transaction hash
      const txHash = `walken_${Date.now().toString(36)}`

      return {
        success: true,
        wlknReward,
        levelUp,
        txHash,
      }
    } catch (error) {
      console.error("Error submitting steps to Walken:", error)
      return {
        success: false,
        wlknReward: 0,
        levelUp: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}
