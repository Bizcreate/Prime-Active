import { w3bStreamService } from "./w3bstream-service"
import { dePINManager } from "./depin-manager"

export interface ConnectedMerchandise {
  id: string
  productName: string
  productType: string
  image: string
  hasNFC: boolean
  isCurrentlyWorn: boolean
  wearingSince: string | null
  lastWorn: string | null
  totalWearTime: number // in minutes
  tokenRewards: number
  nftId?: string
}

class MerchandiseWearService {
  private storageKey = "connected_merchandise"
  private wearingKey = "currently_wearing"
  private wearHistoryKey = "wear_history"

  // Get all connected merchandise
  getConnectedMerchandise(): ConnectedMerchandise[] {
    if (typeof window === "undefined") return []

    try {
      const storedMerchandise = localStorage.getItem(this.storageKey)
      if (!storedMerchandise) {
        // No merchandise found, add demo merchandise
        this.addDemoMerchandise()
        // Try again after adding demo merchandise
        const newStoredMerchandise = localStorage.getItem(this.storageKey)
        return newStoredMerchandise ? (JSON.parse(newStoredMerchandise) as ConnectedMerchandise[]) : []
      }

      return JSON.parse(storedMerchandise) as ConnectedMerchandise[]
    } catch (error) {
      console.error("Error getting connected merchandise:", error)
      return []
    }
  }

  // Get merchandise by ID
  getMerchandiseById(id: string): ConnectedMerchandise | undefined {
    if (typeof window === "undefined") return undefined

    try {
      // First check if we have any items at all
      const storedItems = localStorage.getItem(this.storageKey)
      if (!storedItems || JSON.parse(storedItems).length === 0) {
        // No items in storage, add demo items first
        this.addDemoMerchandise()
      }

      const items = this.getConnectedMerchandise()

      // Try to find the item by ID
      const foundItem = items.find((item) => item.id === id)

      // If not found but we have items, return the first one as fallback
      if (!foundItem && items.length > 0) {
        console.log(`Item with ID ${id} not found, returning first item as fallback`)
        return items[0]
      }

      return foundItem
    } catch (error) {
      console.error("Error getting merchandise by ID:", error)
      return undefined
    }
  }

  // Add new merchandise
  addMerchandise(item: ConnectedMerchandise): void {
    if (typeof window === "undefined") return

    try {
      const items = this.getConnectedMerchandise()
      const existingIndex = items.findIndex((i) => i.id === item.id)

      if (existingIndex >= 0) {
        // Update existing item
        items[existingIndex] = item
      } else {
        // Add new item
        items.push(item)
      }

      localStorage.setItem(this.storageKey, JSON.stringify(items))
    } catch (error) {
      console.error("Error adding merchandise:", error)
    }
  }

  // Remove merchandise
  removeMerchandise(id: string): void {
    if (typeof window === "undefined") return

    try {
      const items = this.getConnectedMerchandise()
      const updatedItems = items.filter((item) => item.id !== id)
      localStorage.setItem(this.storageKey, JSON.stringify(updatedItems))
    } catch (error) {
      console.error("Error removing merchandise:", error)
    }
  }

  // Get currently worn items
  getCurrentlyWornItems(): ConnectedMerchandise[] {
    const merchandise = this.getConnectedMerchandise()
    return merchandise.filter((item) => item.isCurrentlyWorn)
  }

  // Start wearing an item
  startWearing(merchandiseId: string): boolean {
    if (typeof window === "undefined") return false

    try {
      const merchandise = this.getConnectedMerchandise()
      const itemIndex = merchandise.findIndex((item) => item.id === merchandiseId)

      if (itemIndex === -1) return false

      // Update the item
      merchandise[itemIndex].isCurrentlyWorn = true
      merchandise[itemIndex].wearingSince = new Date().toISOString()

      // Save the updated merchandise
      localStorage.setItem(this.storageKey, JSON.stringify(merchandise))

      // Update IoTeX mining rate if service is available
      this.updateIoTeXMiningRate()

      return true
    } catch (error) {
      console.error("Error starting to wear merchandise:", error)
      return false
    }
  }

  // Stop wearing an item
  stopWearing(merchandiseId: string): boolean {
    if (typeof window === "undefined") return false

    try {
      const merchandise = this.getConnectedMerchandise()
      const itemIndex = merchandise.findIndex((item) => item.id === merchandiseId)

      if (itemIndex === -1) return false

      // Calculate wear time
      const wearingSince = merchandise[itemIndex].wearingSince
        ? new Date(merchandise[itemIndex].wearingSince)
        : new Date()
      const now = new Date()
      const wearTimeMinutes = Math.floor((now.getTime() - wearingSince.getTime()) / 60000)

      // Update the item
      merchandise[itemIndex].isCurrentlyWorn = false
      merchandise[itemIndex].lastWorn = now.toISOString()
      merchandise[itemIndex].totalWearTime += wearTimeMinutes
      merchandise[itemIndex].wearingSince = null

      // Calculate token rewards (5 tokens per hour)
      const tokenReward = Math.floor((wearTimeMinutes / 60) * 5)
      merchandise[itemIndex].tokenRewards += tokenReward

      // Save the updated merchandise
      localStorage.setItem(this.storageKey, JSON.stringify(merchandise))

      // Update IoTeX mining rate if service is available
      this.updateIoTeXMiningRate()

      return true
    } catch (error) {
      console.error("Error stopping wearing merchandise:", error)
      return false
    }
  }

  // Connect a new merchandise item
  connectMerchandise(
    merchandise: Omit<
      ConnectedMerchandise,
      "isCurrentlyWorn" | "wearingSince" | "lastWorn" | "totalWearTime" | "tokenRewards"
    >,
  ): boolean {
    if (typeof window === "undefined") return false

    try {
      const existingMerchandise = this.getConnectedMerchandise()

      // Check if the item is already connected
      if (existingMerchandise.some((item) => item.id === merchandise.id)) {
        return false
      }

      // Add the new item
      const newMerchandise: ConnectedMerchandise = {
        ...merchandise,
        isCurrentlyWorn: false,
        wearingSince: null,
        lastWorn: null,
        totalWearTime: 0,
        tokenRewards: 0,
      }

      existingMerchandise.push(newMerchandise)
      localStorage.setItem(this.storageKey, JSON.stringify(existingMerchandise))

      return true
    } catch (error) {
      console.error("Error connecting merchandise:", error)
      return false
    }
  }

  // Disconnect a merchandise item
  disconnectMerchandise(merchandiseId: string): boolean {
    if (typeof window === "undefined") return false

    try {
      let merchandise = this.getConnectedMerchandise()

      // Check if the item is currently being worn
      const item = merchandise.find((item) => item.id === merchandiseId)
      if (item && item.isCurrentlyWorn) {
        this.stopWearing(merchandiseId)
      }

      // Remove the item
      merchandise = merchandise.filter((item) => item.id !== merchandiseId)
      localStorage.setItem(this.storageKey, JSON.stringify(merchandise))

      // Update IoTeX mining rate if service is available
      this.updateIoTeXMiningRate()

      return true
    } catch (error) {
      console.error("Error disconnecting merchandise:", error)
      return false
    }
  }

  // Get total earned tokens
  getTotalEarnedTokens(): number {
    const merchandise = this.getConnectedMerchandise()
    return merchandise.reduce((total, item) => total + item.tokenRewards, 0)
  }

  // Update IoTeX mining rate based on worn merchandise
  private updateIoTeXMiningRate(): void {
    try {
      // Get IoTeX service
      const iotexService = dePINManager.getService("iotex")
      if (!iotexService) return

      // Check if node is active
      const isNodeActive = w3bStreamService.isNodeRunning()
      if (!isNodeActive) return

      // Get original base rate
      const originalRate = w3bStreamService.getPassiveRate()

      // Halve the base rate
      const halfRate = originalRate / 2

      // Get worn merchandise count
      const wornItems = this.getCurrentlyWornItems().length

      // Calculate wear bonus (each worn item adds 25% of base rate)
      const wearBonus = halfRate * 0.25 * wornItems

      // Get recent activity count from the IoTeX service
      // This is a simplified version - in a real app, you'd get this from a proper activity service
      const activityBonus = halfRate * 0.1 * Math.min(3, 5) // Assuming 3 recent activities

      // Calculate total adjusted rate
      const adjustedRate = halfRate + wearBonus + activityBonus

      // Update the rate in W3bStream service
      w3bStreamService.setPassiveRate(adjustedRate)

      console.log(`Updated mining rate based on merchandise: ${adjustedRate.toFixed(4)} IOTX/min`)
    } catch (error) {
      console.error("Failed to update IoTeX mining rate:", error)
    }
  }

  // Add demo merchandise
  private addDemoMerchandise(): void {
    if (typeof window === "undefined") return

    const demoMerchandise: ConnectedMerchandise[] = [
      {
        id: "merch-001",
        productName: "Prime Mates Classic T-Shirt",
        productType: "T-Shirt",
        image: "/prime-mates-tshirt.png",
        hasNFC: true,
        isCurrentlyWorn: false,
        wearingSince: null,
        lastWorn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        totalWearTime: 180, // 3 hours
        tokenRewards: 15,
      },
      {
        id: "merch-002",
        productName: "Prime Mates Board Club Snapback",
        productType: "Hat",
        image: "/prime-mates-snapback.png",
        hasNFC: true,
        isCurrentlyWorn: true,
        wearingSince: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        lastWorn: null,
        totalWearTime: 420, // 7 hours
        tokenRewards: 35,
      },
      {
        id: "merch-003",
        productName: "Prime Mates Jumper",
        productType: "Jumper",
        image: "/prime-mates-jumper.png",
        hasNFC: true,
        isCurrentlyWorn: false,
        wearingSince: null,
        lastWorn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        totalWearTime: 240, // 4 hours
        tokenRewards: 20,
      },
    ]

    localStorage.setItem(this.storageKey, JSON.stringify(demoMerchandise))
  }
}

// Create a singleton instance
export const merchandiseWearService = new MerchandiseWearService()
