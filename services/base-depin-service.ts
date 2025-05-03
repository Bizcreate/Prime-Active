import type { DePINNetwork, DePINReward, ActivityData, DePINServiceConfig } from "./depin-types"

export abstract class BaseDePINService {
  protected isEnabled = false
  protected userId: string | null = null
  protected config: DePINServiceConfig
  protected rewards: DePINReward[] = []
  protected network: DePINNetwork

  constructor(network: DePINNetwork, config: DePINServiceConfig) {
    this.network = network
    this.config = config
    this.loadState()
  }

  public abstract enableMining(userId: string): Promise<boolean>
  public abstract disableMining(): Promise<boolean>
  public abstract submitActivityData(activity: ActivityData): Promise<boolean>

  public getNetwork(): DePINNetwork {
    return this.network
  }

  public isNetworkEnabled(): boolean {
    return this.isEnabled
  }

  public getRewards(): DePINReward[] {
    return this.rewards
  }

  public getBalance(): number {
    return this.rewards
      .filter((reward) => reward.status === "confirmed")
      .reduce((total, reward) => total + reward.amount, 0)
  }

  protected addReward(amount: number, activityId?: string, txHash?: string): void {
    this.rewards.push({
      networkId: this.network.id,
      amount,
      timestamp: Date.now(),
      txHash,
      activityId,
      status: txHash ? "confirmed" : "pending",
    })

    this.saveState()
  }

  protected saveState(): void {
    try {
      localStorage.setItem(
        `depin_${this.network.id}`,
        JSON.stringify({
          isEnabled: this.isEnabled,
          userId: this.userId,
          rewards: this.rewards,
        }),
      )
    } catch (error) {
      console.error(`Failed to save state for ${this.network.name}:`, error)
    }
  }

  protected loadState(): void {
    try {
      const state = localStorage.getItem(`depin_${this.network.id}`)
      if (state) {
        const parsed = JSON.parse(state)
        this.isEnabled = parsed.isEnabled || false
        this.userId = parsed.userId || null
        this.rewards = parsed.rewards || []
      }
    } catch (error) {
      console.error(`Failed to load state for ${this.network.name}:`, error)
    }
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
