// Mock implementation of W3bStream service for the Prime Active app
// In a real implementation, this would connect to the W3bStream network

import type { ActivityData } from "./depin-types"

class W3bStreamService {
  private isInitialized = false
  private userId: string | null = null
  private nodeRunning = false
  private passiveRate = 0.5 // Tokens per hour
  private rewards: any[] = []
  private totalMined = 0

  constructor() {
    this.loadState()
  }

  public async initialize(userId: string): Promise<boolean> {
    this.userId = userId
    this.isInitialized = true
    this.saveState()
    return true
  }

  public async startNode(): Promise<boolean> {
    if (!this.isInitialized) {
      console.error("W3bStream service not initialized")
      return false
    }

    this.nodeRunning = true
    this.saveState()
    return true
  }

  public async stopNode(): Promise<boolean> {
    this.nodeRunning = false
    this.saveState()
    return true
  }

  public isNodeRunning(): boolean {
    return this.nodeRunning
  }

  public async submitActivity(activity: ActivityData): Promise<{ amount: number; txHash: string } | null> {
    if (!this.isInitialized) {
      console.error("W3bStream service not initialized")
      return null
    }

    // Calculate reward based on activity
    const reward = this.calculateReward(activity)
    const txHash = this.generateTxHash()

    // Add to total mined
    this.totalMined += reward

    // Add to rewards history
    this.rewards.push({
      amount: reward,
      timestamp: Date.now(),
      activityId: activity.id,
      txHash,
    })

    this.saveState()

    return {
      amount: reward,
      txHash,
    }
  }

  public getRewards(): any[] {
    return this.rewards
  }

  public getTotalMined(): number {
    return this.totalMined
  }

  public setPassiveRate(rate: number): void {
    this.passiveRate = rate
    this.saveState()
  }

  private calculateReward(activity: ActivityData): number {
    // Simple reward calculation based on activity duration and distance
    // In a real implementation, this would be more sophisticated
    const durationHours = activity.duration / 3600 // Convert seconds to hours
    const distanceKm = activity.distance / 1000 // Convert meters to kilometers

    // Base reward: 10 tokens per hour of activity
    const baseReward = durationHours * 10

    // Distance bonus: 1 token per kilometer
    const distanceBonus = distanceKm * 1

    // Total reward
    return Math.round((baseReward + distanceBonus) * 100) / 100
  }

  private generateTxHash(): string {
    // Generate a mock transaction hash
    return `0x${Math.random().toString(16).substring(2, 42)}`
  }

  private saveState(): void {
    // Skip on server
    if (typeof window === "undefined") return

    try {
      const state = {
        isInitialized: this.isInitialized,
        userId: this.userId,
        nodeRunning: this.nodeRunning,
        passiveRate: this.passiveRate,
        rewards: this.rewards,
        totalMined: this.totalMined,
      }
      localStorage.setItem("w3bstream_state", JSON.stringify(state))
    } catch (error) {
      console.error("Failed to save W3bStream state:", error)
    }
  }

  private loadState(): void {
    // Skip on server
    if (typeof window === "undefined") return

    try {
      const stateJson = localStorage.getItem("w3bstream_state")
      if (stateJson) {
        const state = JSON.parse(stateJson)
        this.isInitialized = state.isInitialized || false
        this.userId = state.userId || null
        this.nodeRunning = state.nodeRunning || false
        this.passiveRate = state.passiveRate || 0.5
        this.rewards = state.rewards || []
        this.totalMined = state.totalMined || 0
      }
    } catch (error) {
      console.error("Failed to load W3bStream state:", error)
    }
  }
}

export const w3bStreamService = new W3bStreamService()
