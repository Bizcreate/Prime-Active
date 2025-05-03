import type { BaseDePINService } from "./base-depin-service"
import type { ActivityData } from "./depin-types"

class DePINManager {
  private services: Map<string, BaseDePINService> = new Map()
  private isTestnetMode = true

  public registerService(service: BaseDePINService): void {
    this.services.set(service.getNetwork().id, service)
  }

  public clearServices(): void {
    this.services.clear()
  }

  public getService(networkId: string): BaseDePINService | undefined {
    return this.services.get(networkId)
  }

  public getAllServices(): BaseDePINService[] {
    return Array.from(this.services.values())
  }

  public async enableNetwork(networkId: string, userId: string): Promise<boolean> {
    const service = this.services.get(networkId)
    if (!service) {
      console.error(`Network ${networkId} not found`)
      return false
    }

    return await service.enableMining(userId)
  }

  public async disableNetwork(networkId: string): Promise<boolean> {
    const service = this.services.get(networkId)
    if (!service) {
      console.error(`Network ${networkId} not found`)
      return false
    }

    return await service.disableMining()
  }

  public async submitActivityData(activity: ActivityData): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>()

    for (const [networkId, service] of this.services.entries()) {
      if (service.isNetworkEnabled()) {
        try {
          const success = await service.submitActivityData(activity)
          results.set(networkId, success)
        } catch (error) {
          console.error(`Error submitting activity to ${networkId}:`, error)
          results.set(networkId, false)
        }
      }
    }

    return results
  }

  public setTestnetMode(isTestnet: boolean): void {
    this.isTestnetMode = isTestnet
  }

  public isInTestnetMode(): boolean {
    return this.isTestnetMode
  }
}

// Create a singleton instance
export const dePINManager = new DePINManager()
