import { BaseDePINService } from "./base-depin-service"
import type { ActivityData, DePINNetwork, DePINServiceConfig } from "./depin-types"

interface FitmintConfig extends DePINServiceConfig {
  apiEndpoint?: string
  appId?: string
}

export class FitmintService extends BaseDePINService {
  private apiEndpoint: string
  private appId: string
  private deviceId: string

  constructor(config: FitmintConfig) {
    const network: DePINNetwork = {
      id: "fitmint",
      name: "Fitmint",
      tokenSymbol: "FITT",
      tokenName: "Fitmint Token",
      logoUrl: "/fitmint-logo.png",
      description: "Move-to-earn fitness app with EVM compatibility",
      enabled: false,
    }

    super(network, config)

    this.apiEndpoint = config.apiEndpoint || "https://api.fitmint.io/v1"
    this.appId = config.appId || "primeactive"
    this.deviceId = `fitmint_device_${Date.now().toString(36)}`
  }

  public async enableMining(userId: string): Promise<boolean> {
    try {
      this.userId = userId

      // Register with Fitmint
      const registrationResult = await this.registerWithFitmint()

      if (registrationResult) {
        this.isEnabled = true
        this.saveState()
        console.log("Fitmint mining enabled for user:", userId)
        return true
      } else {
        console.error("Failed to register with Fitmint")
        return false
      }
    } catch (error) {
      console.error("Failed to enable Fitmint mining:", error)
      return false
    }
  }

  private async registerWithFitmint(): Promise<boolean> {
    try {
      // In a real implementation, you would call the Fitmint API
      // to register this user and device

      console.log("Registering with Fitmint:", this.userId, this.deviceId)

      // Simulate successful registration
      return true
    } catch (error) {
      console.error("Error registering with Fitmint:", error)
      return false
    }
  }

  public async disableMining(): Promise<boolean> {
    try {
      // Unregister from Fitmint
      const unregistrationResult = await this.unregisterFromFitmint()

      if (unregistrationResult) {
        this.isEnabled = false
        this.saveState()
        console.log("Fitmint mining disabled")
        return true
      } else {
        console.error("Failed to unregister from Fitmint")
        return false
      }
    } catch (error) {
      console.error("Failed to disable Fitmint mining:", error)
      return false
    }
  }

  private async unregisterFromFitmint(): Promise<boolean> {
    try {
      // In a real implementation, you would call the Fitmint API
      // to unregister this user and device

      console.log("Unregistering from Fitmint:", this.userId, this.deviceId)

      // Simulate successful unregistration
      return true
    } catch (error) {
      console.error("Error unregistering from Fitmint:", error)
      return false
    }
  }

  public async submitActivityData(activity: ActivityData): Promise<boolean> {
    if (!this.isEnabled || !this.userId) return false

    try {
      // Format data for Fitmint
      const formattedData = this.formatActivityData(activity)

      // Submit data to Fitmint
      const result = await this.submitToFitmint(formattedData)

      if (result.success) {
        // Calculate reward based on the workout intensity and duration
        const rewardAmount = this.calculateReward(activity)

        // Add reward to user's balance
        this.addReward(rewardAmount, activity.id, result.txHash)

        console.log("Activity data submitted to Fitmint:", result)
        return true
      } else {
        console.error("Failed to submit data to Fitmint:", result.error)
        return false
      }
    } catch (error) {
      console.error("Failed to submit activity data to Fitmint:", error)
      return false
    }
  }

  private formatActivityData(activity: ActivityData): any {
    // Calculate workout intensity based on speed and distance
    const avgSpeed = activity.distance / (activity.duration / 3600) // km/h

    // Determine workout type based on activity type and speed
    let workoutType = "walking"
    if (activity.type === "running" || avgSpeed > 8) {
      workoutType = "running"
    } else if (activity.type === "cycling") {
      workoutType = "cycling"
    } else if (["skateboarding", "surfing", "snowboarding"].includes(activity.type)) {
      workoutType = "other"
    }

    // Calculate calories burned (simplified)
    const caloriesBurned = this.estimateCaloriesBurned(activity)

    return {
      userId: this.userId,
      deviceId: this.deviceId,
      activityId: activity.id,
      workoutType,
      startTime: activity.startTime,
      endTime: activity.endTime,
      duration: activity.duration,
      distance: activity.distance,
      caloriesBurned,
      avgSpeed,
      locations: activity.locations.map((loc) => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
        timestamp: loc.timestamp,
      })),
      appId: this.appId,
      appVersion: "1.0.0",
    }
  }

  private async submitToFitmint(data: any): Promise<{
    success: boolean
    txHash?: string
    error?: string
  }> {
    try {
      // In a real implementation, you would call the Fitmint API
      // to submit the workout data

      console.log(`Submitting workout data to Fitmint: ${data.workoutType}, ${data.duration / 60} minutes`)

      // Simulate transaction hash for the reward
      const txHash = `fitt_${Date.now().toString(36)}`

      return {
        success: true,
        txHash,
      }
    } catch (error) {
      console.error("Error submitting data to Fitmint:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private estimateCaloriesBurned(activity: ActivityData): number {
    // Simplified calorie calculation
    // In a real app, you would use more sophisticated formulas based on user weight, height, etc.
    const MET = {
      walking: 3.5,
      running: 8.0,
      cycling: 6.0,
      skateboarding: 5.0,
      surfing: 4.0,
      snowboarding: 5.5,
    }

    // Assume 70kg person
    const weight = 70

    // Calories = MET * weight (kg) * duration (hours)
    const hours = activity.duration / 3600
    return Math.round(MET[activity.type as keyof typeof MET] * weight * hours)
  }

  private calculateReward(activity: ActivityData): number {
    // Fitmint rewards are based on workout intensity, duration, and consistency

    // Base reward per minute of activity
    const baseRewardPerMinute = 0.05

    // Duration in minutes
    const durationMinutes = activity.duration / 60

    // Intensity multiplier based on activity type
    const intensityMultiplier = {
      walking: 1.0,
      running: 1.5,
      cycling: 1.2,
      skateboarding: 1.3,
      surfing: 1.4,
      snowboarding: 1.4,
    }

    const activityMultiplier = intensityMultiplier[activity.type as keyof typeof intensityMultiplier] || 1.0

    // Distance bonus (small bonus per km)
    const distanceBonus = activity.distance * 0.1

    // Calculate total reward
    return baseRewardPerMinute * durationMinutes * activityMultiplier + distanceBonus
  }
}
