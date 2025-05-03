import { dePINManager } from "./depin-manager"
import type { ActivityData } from "./depin-types"
import type { ActivitySession } from "./activity-tracking"

// Import our enhanced services
import { HeliumMobileService } from "./helium-mobile-service"
import { IoTeXService } from "./iotex-service"
import { FOAMService } from "./foam-service"

export function initializeDePINServices(useTestnet = true) {
  // Clear any existing services
  dePINManager.clearServices()

  // Register all services with the manager
  dePINManager.registerService(
    new HeliumMobileService({
      apiKey: "demo_key",
      deviceId: `mobile_${Date.now().toString(36)}`,
      isTestnet: useTestnet,
    }),
  )

  dePINManager.registerService(
    new IoTeXService({
      apiKey: "demo_key",
      nodeUrl: useTestnet ? "https://babel-api.testnet.iotex.io" : "https://babel-api.mainnet.iotex.io",
      isTestnet: useTestnet,
    }),
  )

  dePINManager.registerService(
    new FOAMService({
      apiKey: "demo_key",
      isTestnet: useTestnet,
    }),
  )

  console.log(`DePIN services initialized in ${useTestnet ? "TESTNET" : "MAINNET"} mode`)
}

// Convert ActivitySession to DePIN ActivityData
export function convertToDePINActivityData(activity: ActivitySession, userId: string): ActivityData {
  return {
    id: activity.id,
    type: activity.type,
    startTime: activity.startTime,
    endTime: activity.endTime || Date.now(),
    locations: activity.locations.map((loc) => ({
      latitude: loc.latitude,
      longitude: loc.longitude,
      timestamp: loc.timestamp,
      accuracy: loc.accuracy,
      altitude: loc.altitude,
      speed: loc.speed,
    })),
    distance: activity.distance,
    duration: (activity.endTime || Date.now()) - activity.startTime,
    userId,
  }
}

// Submit activity data to all enabled DePIN networks
export async function submitActivityToDePINNetworks(
  activity: ActivitySession,
  userId: string,
): Promise<Map<string, boolean>> {
  try {
    const depinActivity = convertToDePINActivityData(activity, userId)
    return await dePINManager.submitActivityData(depinActivity)
  } catch (error) {
    console.error("Error submitting activity to DePIN networks:", error)
    return new Map()
  }
}

// Toggle between testnet and mainnet
export function toggleDePINNetworkMode(useTestnet: boolean): void {
  initializeDePINServices(useTestnet)
}
