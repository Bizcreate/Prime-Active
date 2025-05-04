import { iotexService } from "./iotex-service"
import type { ActivityData } from "./depin-types"

class DePINManagerClass {
  private services = [iotexService]

  // Get all available services
  public getAllServices() {
    return this.services
  }

  // Get a service by network ID
  public getServiceByNetworkId(networkId: string) {
    return this.services.find((service) => service.getNetwork().id === networkId)
  }

  // For backward compatibility
  public getService(networkId: string) {
    return this.getServiceByNetworkId(networkId)
  }

  // Get all active services
  public getActiveServices() {
    return this.services.filter((service) => service.isNetworkEnabled())
  }

  // Submit activity data to all active services
  public async submitActivityToAll(activity: ActivityData): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}

    for (const service of this.getActiveServices()) {
      const networkId = service.getNetwork().id
      try {
        const success = await service.submitActivityData(activity)
        results[networkId] = success
      } catch (error) {
        console.error(`Error submitting to ${networkId}:`, error)
        results[networkId] = false
      }
    }

    return results
  }

  // Get total balance across all services
  public getTotalBalance(): Record<string, number> {
    const balances: Record<string, number> = {}

    for (const service of this.services) {
      const network = service.getNetwork()
      const balance = service.getBalance()

      if (balance > 0) {
        balances[network.tokenSymbol] = (balances[network.tokenSymbol] || 0) + balance
      }
    }

    return balances
  }
}

// Create and export a singleton instance
export const dePINManager = new DePINManagerClass()
