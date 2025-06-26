import { BaseDePINService } from "./base-depin-service"
import type { DePINNetwork, DePINServiceConfig, ActivityData } from "./depin-types"

class MystService extends BaseDePINService {
  private _isNodeRunning = false
  private nodeInterval: any = null
  private earningRate = 0.05 // MYST tokens per hour (estimated)
  private lastRewardTime = 0
  private apiKey: string | null = null
  private deviceId: string | null = null
  private earningBoostMultiplier = 1.0
  private earningBoostEndTime: number | null = null

  constructor() {
    // Define the MystNodes network information
    const mystNetwork: DePINNetwork = {
      id: "mystnode",
      name: "Mysterium Network",
      description: "Decentralized VPN network powered by Mysterium",
      tokenSymbol: "MYST",
      tokenName: "Mysterium Token",
      logoUrl: "/myst-logo.png", // We'll add this image later
      category: "compute",
      status: "active",
    }

    // Configuration for the Myst service
    const config: DePINServiceConfig = {
      apiUrl: "https://mystnodes.com/api",
      options: {
        rewardInterval: 3600000, // 1 hour in milliseconds
        minBandwidthForReward: 10, // 10 MB
      },
    }

    super(mystNetwork, config)
  }

  // Connect to MystNodes with user credentials
  public async connect(apiKey: string, userId: string): Promise<boolean> {
    try {
      // Real API call to MystNodes
      const response = await fetch("https://api.mystnodes.com/v1/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error(`MystNodes API error: ${response.statusText}`)
      }

      const data = await response.json()

      // Store API key and user ID
      this.apiKey = apiKey
      this.userId = userId
      this.deviceId = data.deviceId || `prime-active-${Date.now()}`

      // Update state
      this.saveState()
      return true
    } catch (error) {
      console.error("Failed to connect to MystNodes:", error)
      return false
    }
  }

  // Start the MystNodes service
  public async startNode(): Promise<boolean> {
    try {
      if (!this.apiKey || !this.userId) {
        console.error("Cannot start MystNode: No API key or user ID")
        return false
      }

      // Simulate starting a node
      // In production, this would call the MystNodes API to start a node
      console.log("Starting MystNode...")

      // Update state
      this._isNodeRunning = true
      this.lastRewardTime = Date.now()
      this.saveState()

      // Start interval to check for rewards
      this.nodeInterval = setInterval(() => this.checkForRewards(), 60000) // Check every minute

      return true
    } catch (error) {
      console.error("Failed to start MystNode:", error)
      return false
    }
  }

  // Stop the MystNodes service
  public async stopNode(): Promise<boolean> {
    try {
      // Simulate stopping a node
      // In production, this would call the MystNodes API to stop a node
      console.log("Stopping MystNode...")

      // Clear interval
      if (this.nodeInterval) {
        clearInterval(this.nodeInterval)
        this.nodeInterval = null
      }

      // Update state
      this._isNodeRunning = false
      this.saveState()

      return true
    } catch (error) {
      console.error("Failed to stop MystNode:", error)
      return false
    }
  }

  // Check node status
  public isNodeRunning(): boolean {
    return this._isNodeRunning
  }

  // Get passive earning rate
  public getPassiveRate(): number {
    return this.earningRate
  }

  // Set passive earning rate
  public setPassiveRate(rate: number): void {
    this.earningRate = rate
    this.saveState()
  }

  // Apply an earning boost to the MystNode service
  public applyEarningBoost(multiplier: number, duration: number): void {
    this.earningBoostMultiplier = multiplier
    this.earningBoostEndTime = Date.now() + duration
    console.log(`Applied earning boost: ${multiplier}x for ${duration / (60 * 60 * 1000)} hours`)
    this.saveState()
  }

  // Remove an earning boost from the MystNode service
  public removeEarningBoost(): void {
    this.earningBoostMultiplier = 1.0
    this.earningBoostEndTime = null
    console.log("Removed earning boost")
    this.saveState()
  }

  // Get the current earning boost multiplier
  public getEarningBoostMultiplier(): number {
    // Check if the boost has expired
    if (this.earningBoostEndTime && Date.now() > this.earningBoostEndTime) {
      this.removeEarningBoost()
    }
    return this.earningBoostMultiplier
  }

  // Check for rewards based on time elapsed and bandwidth shared
  private checkForRewards(): void {
    if (!this._isNodeRunning) return

    const now = Date.now()
    const elapsed = now - this.lastRewardTime

    // Only issue rewards at the configured interval
    if (elapsed >= this.config.options?.rewardInterval) {
      // Calculate reward based on time
      const hoursElapsed = elapsed / 3600000
      const baseReward = hoursElapsed * this.earningRate

      // Apply the boost multiplier
      const boostedReward = baseReward * this.getEarningBoostMultiplier()

      // Add reward
      this.addReward(boostedReward, `passive-${now}`)

      // Update last reward time
      this.lastRewardTime = now
      this.saveState()

      console.log(
        `Added MYST reward: ${boostedReward.toFixed(4)} MYST (Base: ${baseReward.toFixed(4)}, Boost: ${this.getEarningBoostMultiplier()}x)`,
      )
    }
  }

  // Submit activity data to potentially boost rewards
  public async submitActivityData(activity: ActivityData): Promise<boolean> {
    try {
      if (!this._isNodeRunning) {
        console.log("Node not running, cannot submit activity")
        return false
      }

      // Calculate activity-based reward boost
      const activityBoost = this.calculateActivityBoost(activity)

      if (activityBoost > 0) {
        // Add extra reward for activity
        this.addReward(activityBoost, activity.id)
        console.log(`Added activity-based MYST reward: ${activityBoost.toFixed(4)} MYST`)
      }

      return true
    } catch (error) {
      console.error("Failed to submit activity data to MystNodes:", error)
      return false
    }
  }

  // Calculate reward boost based on activity
  private calculateActivityBoost(activity: ActivityData): number {
    // Simple algorithm to calculate boost based on activity duration and distance
    // This could be refined based on actual MystNodes incentive structure
    const durationHours = activity.duration / 60 / 60
    const distanceKm = activity.distance / 1000

    // Base boost on duration and distance
    const boost = durationHours * 0.1 + distanceKm * 0.05

    return Math.min(boost, 2) // Cap at 2 MYST tokens
  }

  // Get node statistics
  public async getNodeStats(): Promise<any> {
    try {
      if (!this.apiKey || !this._isNodeRunning) {
        return { status: "offline" }
      }

      const response = await fetch(`https://api.mystnodes.com/v1/nodes/${this.deviceId}/stats`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`MystNodes API error: ${response.statusText}`)
      }

      const stats = await response.json()
      return {
        status: "online",
        uptime: stats.uptime || 0,
        uploadMb: stats.bytesUploaded / (1024 * 1024),
        downloadMb: stats.bytesDownloaded / (1024 * 1024),
        earnings: stats.earnings || this.getBalance(),
        connections: stats.activeConnections || 0,
      }
    } catch (error) {
      console.error("Failed to get node stats:", error)
      return { status: "error", message: "Failed to get node stats" }
    }
  }

  // Override the saveState method to include additional properties
  protected saveState(): void {
    // Skip saving state on the server
    if (typeof window === "undefined") return

    try {
      const state = {
        isEnabled: this.isNetworkEnabled(),
        userId: this.userId,
        rewards: this.rewards,
        _isNodeRunning: this._isNodeRunning,
        apiKey: this.apiKey,
        deviceId: this.deviceId,
        lastRewardTime: this.lastRewardTime,
        earningRate: this.earningRate,
        earningBoostMultiplier: this.earningBoostMultiplier,
        earningBoostEndTime: this.earningBoostEndTime,
      }
      localStorage.setItem(`depin_${this.getNetwork().id}`, JSON.stringify(state))
    } catch (error) {
      console.error(`Failed to save state for ${this.getNetwork().name}:`, error)
    }
  }

  // Override the loadState method to include additional properties
  protected loadState(): void {
    // Skip loading state on the server
    if (typeof window === "undefined") return

    try {
      const stateJson = localStorage.getItem(`depin_${this.getNetwork().id}`)
      if (stateJson) {
        const state = JSON.parse(stateJson)
        this.isEnabled = state.isEnabled || false
        this.userId = state.userId || null
        this.rewards = state.rewards || []
        this._isNodeRunning = state._isNodeRunning || false
        this.apiKey = state.apiKey || null
        this.deviceId = state.deviceId || null
        this.lastRewardTime = state.lastRewardTime || 0
        this.earningRate = state.earningRate || 0.05
        this.earningBoostMultiplier = state.earningBoostMultiplier || 1.0
        this.earningBoostEndTime = state.earningBoostEndTime || null

        // Restart node interval if node was running
        if (this._isNodeRunning) {
          this.nodeInterval = setInterval(() => this.checkForRewards(), 60000)
        }
      }
    } catch (error) {
      console.error(`Failed to load state for ${this.getNetwork().name}:`, error)
    }
  }
}

// Create a singleton instance
export const mystService = new MystService()
