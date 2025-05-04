import { dePINManager } from "./depin-manager"
import type { ActivityData } from "./depin-types"

export async function submitActivityToDePINNetworks(activity: ActivityData): Promise<{
  success: boolean
  results: Record<string, boolean>
  rewards: Record<string, number>
}> {
  // This is essentially an alias for trackActivityForDePIN for backward compatibility
  return trackActivityForDePIN(activity)
}

export async function trackActivityForDePIN(activity: ActivityData): Promise<{
  success: boolean
  results: Record<string, boolean>
  rewards: Record<string, number>
}> {
  try {
    // Submit activity to all active DePIN services
    const results = await dePINManager.submitActivityToAll(activity)

    // Calculate rewards by network
    const rewards: Record<string, number> = {}

    for (const service of dePINManager.getActiveServices()) {
      const networkId = service.getNetwork().id
      const networkRewards = service.getRewards()

      // Find rewards for this activity
      const activityRewards = networkRewards
        .filter((reward) => reward.activityId === activity.id)
        .reduce((total, reward) => total + reward.amount, 0)

      if (activityRewards > 0) {
        rewards[networkId] = activityRewards
      }
    }

    return {
      success: Object.values(results).some(Boolean),
      results,
      rewards,
    }
  } catch (error) {
    console.error("Error tracking activity for DePIN:", error)
    return {
      success: false,
      results: {},
      rewards: {},
    }
  }
}

export function getDePINBalances(): Record<string, { amount: number; symbol: string }> {
  const balances: Record<string, { amount: number; symbol: string }> = {}

  for (const service of dePINManager.getAllServices()) {
    const network = service.getNetwork()
    const balance = service.getBalance()

    if (balance > 0) {
      balances[network.id] = {
        amount: balance,
        symbol: network.tokenSymbol,
      }
    }
  }

  return balances
}
