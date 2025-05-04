import { dePINManager } from "./depin-manager"

// Export the depinInitializer object with the initialization functions
export const depinInitializer = {
  initialize: async (userId: string): Promise<boolean> => {
    try {
      // Get IoTeX service and initialize it
      const iotexService = dePINManager.getServiceByNetworkId("iotex")
      if (iotexService) {
        await iotexService.enableMining(userId)
      }

      return true
    } catch (error) {
      console.error("Failed to initialize DePIN services:", error)
      return false
    }
  },

  startIoTeXNode: async (userId: string): Promise<boolean> => {
    try {
      const iotexService = dePINManager.getServiceByNetworkId("iotex")
      if (!iotexService) {
        throw new Error("IoTeX service not found")
      }

      // Enable mining if not already enabled
      if (!iotexService.isNetworkEnabled()) {
        await iotexService.enableMining(userId)
      }

      // Start the node
      return await iotexService.startNode()
    } catch (error) {
      console.error("Failed to start IoTeX node:", error)
      return false
    }
  },
}

// Also export the individual functions for more modern imports
export async function initializeDePINServices(userId: string): Promise<boolean> {
  return depinInitializer.initialize(userId)
}

export async function startIoTeXNode(userId: string): Promise<boolean> {
  return depinInitializer.startIoTeXNode(userId)
}
