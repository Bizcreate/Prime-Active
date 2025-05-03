import { utils } from "ethers"

export interface W3bStreamReward {
  id: string
  amount: number
  timestamp: number
  txHash?: string
  activityId?: string
}

class W3bStreamServiceClass {
  private isInitialized = false
  private userId: string | null = null
  private nodeActive = false
  private rewards: W3bStreamReward[] = []
  private passiveRate = 0.5 // Tokens per hour when node is active

  // Initialize the service for a user
  async initialize(userId: string): Promise<boolean> {
    try {
      this.userId = userId
      this.isInitialized = true
      console.log(`W3bStream initialized for user ${userId}`)
      return true
    } catch (error) {
      console.error("Failed to initialize W3bStream:", error)
      return false
    }
  }

  // Start the W3bStream node
  async startNode(): Promise<boolean> {
    if (!this.isInitialized) {
      console.error("W3bStream not initialized")
      return false
    }

    try {
      // Simulate node startup
      await new Promise((resolve) => setTimeout(resolve, 1000))
      this.nodeActive = true
      console.log("W3bStream node started")
      return true
    } catch (error) {
      console.error("Failed to start W3bStream node:", error)
      return false
    }
  }

  // Stop the W3bStream node
  async stopNode(): Promise<boolean> {
    if (!this.isInitialized) {
      console.error("W3bStream not initialized")
      return false
    }

    try {
      // Simulate node shutdown
      await new Promise((resolve) => setTimeout(resolve, 500))
      this.nodeActive = false
      console.log("W3bStream node stopped")
      return true
    } catch (error) {
      console.error("Failed to stop W3bStream node:", error)
      return false
    }
  }

  // Check if the node is active
  isNodeActive(): boolean {
    return this.nodeActive
  }

  // Get node status
  getNodeStatus(): string {
    if (!this.isInitialized) return "Not Initialized"
    return this.nodeActive ? "Active" : "Inactive"
  }

  // Submit activity data and get rewards
  async submitActivity(activity: any): Promise<W3bStreamReward | null> {
    if (!this.isInitialized) {
      console.error("W3bStream not initialized")
      return null
    }

    try {
      // Calculate reward based on activity
      const reward = this.calculateReward(activity)

      // Generate a mock transaction hash
      const txHash = utils.hexlify(utils.randomBytes(32))

      // Create reward record
      const rewardRecord: W3bStreamReward = {
        id: `reward-${Date.now()}`,
        amount: reward,
        timestamp: Date.now(),
        txHash,
        activityId: activity.id,
      }

      // Add to rewards list
      this.rewards.push(rewardRecord)

      return rewardRecord
    } catch (error) {
      console.error("Failed to submit activity to W3bStream:", error)
      return null
    }
  }

  // Calculate reward based on activity
  private calculateReward(activity: any): number {
    // Base reward
    let reward = 5

    // Adjust based on duration (if available)
    if (activity.duration) {
      // Convert duration to hours and add 2 tokens per hour
      const durationHours = activity.duration / 3600
      reward += durationHours * 2
    }

    // Adjust based on distance (if available)
    if (activity.distance) {
      // Add 1 token per km
      reward += activity.distance
    }

    // Cap reward at 50 tokens
    return Math.min(50, reward)
  }

  // Get all rewards
  getRewards(): W3bStreamReward[] {
    return [...this.rewards]
  }

  // Get total mined tokens
  getTotalMined(): number {
    return this.rewards.reduce((total, reward) => total + reward.amount, 0)
  }

  // Get passive mining rate (tokens per hour)
  getPassiveRate(): number {
    return this.passiveRate
  }

  // Set passive mining rate
  setPassiveRate(rate: number): void {
    this.passiveRate = rate
  }

  // Reset all data (for testing)
  reset(): void {
    this.isInitialized = false
    this.userId = null
    this.nodeActive = false
    this.rewards = []
  }
}

// Create and export a singleton instance
export const w3bStreamService = new W3bStreamServiceClass()
