import type { ActivitySession } from "./activity-tracking"
import { activityIntegrationService } from "./activity-integration-service"

// LayerTwoLabs API configuration
interface L2LabsConfig {
  apiKey: string
  apiEndpoint: string
  projectId: string
  webhookSecret: string
}

// Activity mining submission data structure
interface ActivityMiningSubmission {
  userId: string
  activityId: string
  activityType: string
  startTime: number
  endTime: number
  duration: number
  distance: number
  steps: number
  calories: number
  proof: string // Cryptographic proof of activity
  deviceSignature: string // Device signature for verification
}

// Reward structure
interface ActivityReward {
  id: string
  userId: string
  activityId: string
  amount: number
  tokenType: "ACTIVE" | "SHAKA" | "IOTX" | string
  timestamp: number
  status: "pending" | "confirmed" | "rejected"
  txHash?: string
}

class LayerTwoLabsService {
  private config: L2LabsConfig | null = null
  private isInitialized = false
  private userId: string | null = null
  private rewards: ActivityReward[] = []
  private pendingSubmissions: Map<string, ActivityMiningSubmission> = new Map()
  private storageKeyPrefix = "l2labs_"

  constructor() {
    this.loadState()
  }

  // Initialize the service with configuration
  public async initialize(config: L2LabsConfig, userId: string): Promise<boolean> {
    try {
      // Validate configuration
      if (!config.apiKey || !config.apiEndpoint || !config.projectId) {
        console.error("Invalid LayerTwoLabs configuration")
        return false
      }

      // Test API connection
      const response = await fetch(`${config.apiEndpoint}/v1/projects/${config.projectId}/status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        console.error("Failed to connect to LayerTwoLabs API:", await response.text())
        return false
      }

      this.config = config
      this.userId = userId
      this.isInitialized = true
      this.saveState()

      console.log("LayerTwoLabs service initialized successfully")
      return true
    } catch (error) {
      console.error("Error initializing LayerTwoLabs service:", error)
      return false
    }
  }

  // Check if the service is initialized
  public isServiceInitialized(): boolean {
    return this.isInitialized && !!this.config
  }

  // Submit activity for mining
  public async submitActivity(activity: ActivitySession): Promise<{
    success: boolean
    rewardId?: string
    error?: string
  }> {
    if (!this.isInitialized || !this.config || !this.userId) {
      return { success: false, error: "Service not initialized" }
    }

    try {
      // Generate proof of activity (in a real implementation, this would be more sophisticated)
      const proof = this.generateActivityProof(activity)

      // Create submission object
      const submission: ActivityMiningSubmission = {
        userId: this.userId,
        activityId: activity.id,
        activityType: activity.type,
        startTime: activity.startTime,
        endTime: activity.endTime || Date.now(),
        duration: activity.duration,
        distance: activity.distance,
        steps: this.calculateStepsFromActivity(activity),
        calories: activity.calories,
        proof,
        deviceSignature: this.generateDeviceSignature(),
      }

      // Store pending submission
      this.pendingSubmissions.set(activity.id, submission)
      this.saveState()

      // Submit to LayerTwoLabs API
      const response = await fetch(`${this.config.apiEndpoint}/v1/projects/${this.config.projectId}/activities/mine`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Failed to submit activity for mining:", errorText)
        return { success: false, error: errorText }
      }

      const result = await response.json()

      // Process reward if available immediately
      if (result.reward) {
        const reward: ActivityReward = {
          id: result.reward.id,
          userId: this.userId,
          activityId: activity.id,
          amount: result.reward.amount,
          tokenType: result.reward.tokenType,
          timestamp: Date.now(),
          status: result.reward.status || "pending",
          txHash: result.reward.txHash,
        }

        this.rewards.push(reward)
        this.pendingSubmissions.delete(activity.id)
        this.saveState()

        // Also add to activity integration service
        activityIntegrationService.addReward({
          id: reward.id,
          amount: reward.amount,
          timestamp: new Date(reward.timestamp).toISOString(),
          source: "other",
          sourceId: activity.id,
          sourceName: `${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} Activity Mining`,
          sourceImage: "/digital-token.png",
        })

        return { success: true, rewardId: reward.id }
      }

      // If no immediate reward, just return success
      return { success: true }
    } catch (error) {
      console.error("Error submitting activity for mining:", error)
      return { success: false, error: String(error) }
    }
  }

  // Get all rewards
  public getRewards(): ActivityReward[] {
    return this.rewards
  }

  // Get pending submissions
  public getPendingSubmissions(): ActivityMiningSubmission[] {
    return Array.from(this.pendingSubmissions.values())
  }

  // Check reward status
  public async checkRewardStatus(rewardId: string): Promise<{
    success: boolean
    status?: string
    error?: string
  }> {
    if (!this.isInitialized || !this.config) {
      return { success: false, error: "Service not initialized" }
    }

    try {
      const response = await fetch(
        `${this.config.apiEndpoint}/v1/projects/${this.config.projectId}/rewards/${rewardId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Failed to check reward status:", errorText)
        return { success: false, error: errorText }
      }

      const result = await response.json()

      // Update local reward status
      const rewardIndex = this.rewards.findIndex((r) => r.id === rewardId)
      if (rewardIndex >= 0) {
        this.rewards[rewardIndex].status = result.status
        this.rewards[rewardIndex].txHash = result.txHash
        this.saveState()
      }

      return { success: true, status: result.status }
    } catch (error) {
      console.error("Error checking reward status:", error)
      return { success: false, error: String(error) }
    }
  }

  // Get mining statistics
  public async getMiningStats(): Promise<{
    success: boolean
    stats?: {
      totalActivities: number
      totalRewards: number
      pendingRewards: number
      averageRewardPerActivity: number
    }
    error?: string
  }> {
    if (!this.isInitialized || !this.config || !this.userId) {
      return { success: false, error: "Service not initialized" }
    }

    try {
      const response = await fetch(
        `${this.config.apiEndpoint}/v1/projects/${this.config.projectId}/users/${this.userId}/stats`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Failed to get mining stats:", errorText)
        return { success: false, error: errorText }
      }

      return { success: true, stats: await response.json() }
    } catch (error) {
      console.error("Error getting mining stats:", error)
      return { success: false, error: String(error) }
    }
  }

  // Generate cryptographic proof of activity
  private generateActivityProof(activity: ActivitySession): string {
    // In a real implementation, this would use a more sophisticated algorithm
    // For example, it might hash the activity data with a nonce and device signature
    const activityData = JSON.stringify({
      id: activity.id,
      type: activity.type,
      startTime: activity.startTime,
      endTime: activity.endTime,
      distance: activity.distance,
      duration: activity.duration,
      userId: this.userId,
    })

    // Simple hash for demonstration purposes
    return this.simpleHash(activityData + Date.now())
  }

  // Generate device signature for verification
  private generateDeviceSignature(): string {
    // In a real implementation, this would collect device-specific information
    // and create a unique signature that can be verified
    const deviceInfo = {
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      platform: typeof navigator !== "undefined" ? navigator.platform : "unknown",
      timestamp: Date.now(),
    }

    return this.simpleHash(JSON.stringify(deviceInfo))
  }

  // Simple hash function for demonstration
  private simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString(16).padStart(8, "0")
  }

  // Calculate steps from activity data
  private calculateStepsFromActivity(activity: ActivitySession): number {
    // In a real implementation, this would use a more sophisticated algorithm
    // based on activity type, distance, and duration
    if (activity.type === "walking" || activity.type === "running") {
      // Rough estimate: ~1300 steps per km for walking, ~1600 for running
      const stepsPerKm = activity.type === "walking" ? 1300 : 1600
      return Math.round(activity.distance * stepsPerKm)
    }

    // For other activities, estimate based on duration (very rough)
    return Math.round(activity.duration * 20) // 20 steps per minute as a baseline
  }

  // Save state to local storage
  private saveState(): void {
    if (typeof window === "undefined") return

    try {
      // Save config (excluding API key for security)
      if (this.config) {
        const safeConfig = {
          apiEndpoint: this.config.apiEndpoint,
          projectId: this.config.projectId,
          // Don't save API key or webhook secret
        }
        localStorage.setItem(`${this.storageKeyPrefix}config`, JSON.stringify(safeConfig))
      }

      // Save initialization status and user ID
      localStorage.setItem(`${this.storageKeyPrefix}initialized`, String(this.isInitialized))
      if (this.userId) {
        localStorage.setItem(`${this.storageKeyPrefix}userId`, this.userId)
      }

      // Save rewards
      localStorage.setItem(`${this.storageKeyPrefix}rewards`, JSON.stringify(this.rewards))

      // Save pending submissions
      localStorage.setItem(
        `${this.storageKeyPrefix}pendingSubmissions`,
        JSON.stringify(Array.from(this.pendingSubmissions.entries())),
      )
    } catch (error) {
      console.error("Error saving LayerTwoLabs state:", error)
    }
  }

  // Load state from local storage
  private loadState(): void {
    if (typeof window === "undefined") return

    try {
      // Load initialization status
      const initialized = localStorage.getItem(`${this.storageKeyPrefix}initialized`)
      this.isInitialized = initialized === "true"

      // Load user ID
      this.userId = localStorage.getItem(`${this.storageKeyPrefix}userId`)

      // Load config (partial, without API key)
      const configJson = localStorage.getItem(`${this.storageKeyPrefix}config`)
      if (configJson) {
        const partialConfig = JSON.parse(configJson)
        // Note: API key needs to be provided again on initialization
        this.config = partialConfig as L2LabsConfig
      }

      // Load rewards
      const rewardsJson = localStorage.getItem(`${this.storageKeyPrefix}rewards`)
      if (rewardsJson) {
        this.rewards = JSON.parse(rewardsJson)
      }

      // Load pending submissions
      const pendingSubmissionsJson = localStorage.getItem(`${this.storageKeyPrefix}pendingSubmissions`)
      if (pendingSubmissionsJson) {
        const entries = JSON.parse(pendingSubmissionsJson) as [string, ActivityMiningSubmission][]
        this.pendingSubmissions = new Map(entries)
      }
    } catch (error) {
      console.error("Error loading LayerTwoLabs state:", error)
    }
  }
}

// Create singleton instance
export const layerTwoLabsService = new LayerTwoLabsService()
