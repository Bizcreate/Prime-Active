// Mock implementation of the W3bStream service
import { generateMockTxHash, generateUniqueId } from "@/lib/crypto-utils"

export interface W3bStreamNodeStatus {
  uptime: number
  dataPoints: number
  cpu: number
  memory: number
  storage: number
  bandwidth: {
    up: number
    down: number
  }
  version: string
  lastSeen: number
}

export interface W3bStreamReward {
  id: string
  amount: number
  timestamp: number
  txHash?: string
  activityId?: string
  type: "passive" | "activity"
}

class W3bStreamServiceClass {
  private userId: string | null = null
  private isActive = false
  private rewards: W3bStreamReward[] = []
  private passiveRate = 0.01 // IOTX per minute
  private startTime = 0
  private nodeStatus: W3bStreamNodeStatus = {
    uptime: 0,
    dataPoints: 0,
    cpu: 5.2,
    memory: 12.4,
    storage: 7.8,
    bandwidth: {
      up: 1024 * 1024 * 5, // 5 MB
      down: 1024 * 1024 * 12, // 12 MB
    },
    version: "1.0.3",
    lastSeen: Date.now(),
  }

  private nodeInterval: NodeJS.Timeout | null = null

  public async initialize(userId: string): Promise<boolean> {
    try {
      this.userId = userId
      console.log(`Initialized W3bStream for user ${userId}`)

      // Clear existing rewards
      this.rewards = []

      return true
    } catch (error) {
      console.error("Error initializing W3bStream:", error)
      return false
    }
  }

  public async startNode(): Promise<boolean> {
    try {
      if (this.isActive) {
        return true // Already active
      }

      this.isActive = true
      this.startTime = Date.now()

      // Start passive mining by adding rewards periodically
      this.nodeInterval = setInterval(() => {
        // Add passive reward every minute
        this.addPassiveReward()

        // Update node status
        this.updateNodeStatus()
      }, 60000) // Every minute

      console.log("W3bStream node started")
      return true
    } catch (error) {
      console.error("Error starting W3bStream node:", error)
      return false
    }
  }

  public async stopNode(): Promise<boolean> {
    try {
      if (!this.isActive) {
        return true // Already inactive
      }

      this.isActive = false

      // Stop passive mining
      if (this.nodeInterval) {
        clearInterval(this.nodeInterval)
        this.nodeInterval = null
      }

      // Reset node status
      this.nodeStatus.uptime = 0

      console.log("W3bStream node stopped")
      return true
    } catch (error) {
      console.error("Error stopping W3bStream node:", error)
      return false
    }
  }

  public isNodeActive(): boolean {
    return this.isActive
  }

  public async submitActivity(activity: any): Promise<W3bStreamReward | null> {
    try {
      if (!this.isActive || !this.userId) {
        return null
      }

      // Simulate reward calculation based on activity
      const activityDuration = (activity.endTime - activity.startTime) / 1000 / 60 // in minutes
      const activityDistance = activity.distance || 0 // in km

      // Base formula: 0.05 IOTX per minute + 0.1 IOTX per km
      const rewardAmount = 0.05 * activityDuration + 0.1 * activityDistance

      const reward: W3bStreamReward = {
        id: generateUniqueId("reward_"),
        amount: rewardAmount,
        timestamp: Date.now(),
        activityId: activity.id,
        txHash: generateMockTxHash(),
        type: "activity",
      }

      // Add to rewards
      this.rewards.push(reward)

      // Update data points
      this.nodeStatus.dataPoints += activity.locations?.length || 10

      return reward
    } catch (error) {
      console.error("Error submitting activity to W3bStream:", error)
      return null
    }
  }

  public getNodeStatus(): W3bStreamNodeStatus {
    // Return a copy of the status with updated values
    return {
      ...this.nodeStatus,
      lastSeen: Date.now(),
    }
  }

  public getRewards(): W3bStreamReward[] {
    return [...this.rewards]
  }

  public getTotalMined(): number {
    return this.rewards.reduce((sum, reward) => sum + reward.amount, 0)
  }

  public getPassiveRate(): number {
    return this.passiveRate
  }

  public setPassiveRate(rate: number): void {
    // Rate is expected to be between 0-100, convert to a reasonable token rate
    this.passiveRate = (rate / 100) * 0.02 // Max 0.02 tokens per minute at 100%
  }

  private addPassiveReward(): void {
    if (!this.isActive || !this.userId) return

    const reward: W3bStreamReward = {
      id: generateUniqueId("passive_"),
      amount: this.passiveRate,
      timestamp: Date.now(),
      txHash: generateMockTxHash(),
      type: "passive",
    }

    // Add to rewards
    this.rewards.push(reward)

    console.log(`Added passive reward of ${this.passiveRate} IOTX`)
  }

  private updateNodeStatus(): void {
    if (!this.isActive) return

    // Update uptime
    this.nodeStatus.uptime = Math.floor((Date.now() - this.startTime) / 1000)

    // Randomly fluctuate resource usage
    this.nodeStatus.cpu = 5 + Math.random() * 10
    this.nodeStatus.memory = 10 + Math.random() * 15
    this.nodeStatus.storage = 7 + Math.random() * 5

    // Increase bandwidth
    this.nodeStatus.bandwidth.up += 1024 * 10 // 10 KB
    this.nodeStatus.bandwidth.down += 1024 * 25 // 25 KB
  }
}

export const w3bStreamService = new W3bStreamServiceClass()
