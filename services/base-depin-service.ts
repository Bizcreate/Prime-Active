import type { DePINNetwork, DePINServiceConfig } from "./depin-types"
import { utils } from "ethers"

export abstract class BaseDePINService {
  protected network: DePINNetwork
  protected userId: string | null = null
  protected isEnabled = false
  protected balance = 0
  protected rewards: { id: string; amount: number; timestamp: number; activityId?: string; txHash?: string }[] = []

  constructor(network: DePINNetwork, config: DePINServiceConfig) {
    this.network = network
  }

  // Get the network information
  public getNetwork(): DePINNetwork {
    return this.network
  }

  // Get the current balance
  public getBalance(): number {
    return this.balance
  }

  // Get all rewards
  public getRewards(): { id: string; amount: number; timestamp: number; activityId?: string; txHash?: string }[] {
    return [...this.rewards]
  }

  // Check if mining is enabled
  public isServiceEnabled(): boolean {
    return this.isEnabled
  }

  // Enable mining for a user
  public abstract enableMining(userId: string): Promise<boolean>

  // Disable mining
  public abstract disableMining(): Promise<boolean>

  // Submit activity data
  public abstract submitActivityData(activity: any): Promise<boolean>

  // Add a reward
  protected addReward(amount: number, activityId?: string, txHash?: string): void {
    const reward = {
      id: `reward-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      amount,
      timestamp: Date.now(),
      activityId,
      txHash,
    }

    this.rewards.push(reward)
    this.balance += amount
    this.saveState()
  }

  // Save state to localStorage
  protected saveState(): void {
    if (typeof window !== "undefined" && this.userId) {
      const key = `depin_${this.network.id}_${this.userId}`
      const state = {
        isEnabled: this.isEnabled,
        balance: this.balance,
        rewards: this.rewards,
      }
      localStorage.setItem(key, JSON.stringify(state))
    }
  }

  // Load state from localStorage
  protected loadState(): void {
    if (typeof window !== "undefined" && this.userId) {
      const key = `depin_${this.network.id}_${this.userId}`
      const stateStr = localStorage.getItem(key)

      if (stateStr) {
        try {
          const state = JSON.parse(stateStr)
          this.isEnabled = state.isEnabled || false
          this.balance = state.balance || 0
          this.rewards = state.rewards || []
        } catch (error) {
          console.error(`Error loading state for ${this.network.id}:`, error)
        }
      }
    }
  }

  // Generate a mock transaction hash
  protected generateTxHash(): string {
    return utils.hexlify(utils.randomBytes(32))
  }

  protected calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km
    return distance
  }

  protected deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }
}
