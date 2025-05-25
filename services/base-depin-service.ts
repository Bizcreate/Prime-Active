import type { DePINNetwork, DePINServiceConfig, DePINReward } from "./depin-types"

export abstract class BaseDePINService {
  protected network: DePINNetwork
  protected config: DePINServiceConfig
  protected isEnabled = false
  protected userId: string | null = null
  protected rewards: DePINReward[] = []

  constructor(network: DePINNetwork, config: DePINServiceConfig) {
    this.network = network
    this.config = config
    this.loadState()
  }

  public getNetwork(): DePINNetwork {
    return this.network
  }

  public getConfig(): DePINServiceConfig {
    return this.config
  }

  // Keep both methods for backward compatibility
  public isServiceEnabled(): boolean {
    return this.isEnabled
  }

  // This was the original method name used in dashboard.tsx
  public isNetworkEnabled(): boolean {
    return this.isEnabled
  }

  public getUserId(): string | null {
    return this.userId
  }

  // Add the getBalance method
  public getBalance(): number {
    // Skip on server
    if (typeof window === "undefined") return 0

    return this.rewards
      .filter((reward) => reward.status === "confirmed")
      .reduce((total, reward) => total + reward.amount, 0)
  }

  // Add getRewards method for backward compatibility
  public getRewards(): DePINReward[] {
    return this.rewards
  }

  protected addReward(amount: number, activityId: string, txHash?: string): void {
    this.rewards.push({
      networkId: this.network.id,
      amount,
      timestamp: Date.now(),
      activityId,
      txHash,
      status: "confirmed",
    })
    this.saveState()
  }

  protected saveState(): void {
    // Skip saving state on the server
    if (typeof window === "undefined") return

    try {
      const state = {
        isEnabled: this.isEnabled,
        userId: this.userId,
        rewards: this.rewards,
      }
      localStorage.setItem(`depin_${this.network.id}`, JSON.stringify(state))
    } catch (error) {
      console.error(`Failed to save state for ${this.network.name}:`, error)
    }
  }

  protected loadState(): void {
    // Skip loading state on the server
    if (typeof window === "undefined") return

    try {
      const stateJson = localStorage.getItem(`depin_${this.network.id}`)
      if (stateJson) {
        const state = JSON.parse(stateJson)
        this.isEnabled = state.isEnabled || false
        this.userId = state.userId || null
        this.rewards = state.rewards || []
      }
    } catch (error) {
      console.error(`Failed to load state for ${this.network.name}:`, error)
    }
  }
}
