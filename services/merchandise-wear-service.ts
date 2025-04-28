export interface ConnectedMerchandise {
  id: string
  productName: string
  productId: string
  image: string
  dateConnected: string
  lastWorn: string | null
  totalWearTime: number // in minutes
  tokenRewards: number
  isCurrentlyWorn: boolean
  wearingSince: string | null
  hasNFC: boolean
  hasNFT: boolean
}

class MerchandiseWearService {
  private storageKey = "connected_merchandise"
  private wearingKey = "wearing_merchandise"
  private tokensKey = "earned_tokens"

  // Get all connected merchandise
  getConnectedMerchandise(): ConnectedMerchandise[] {
    if (typeof window === "undefined") return []

    try {
      const storedItems = localStorage.getItem(this.storageKey)
      if (!storedItems) {
        // No items found, add demo items
        this.addDemoItems()
        // Try again after adding demo items
        const newStoredItems = localStorage.getItem(this.storageKey)
        return newStoredItems ? (JSON.parse(newStoredItems) as ConnectedMerchandise[]) : []
      }

      const items = JSON.parse(storedItems) as ConnectedMerchandise[]

      // If we have fewer than 3 items, add demo items
      if (items.length < 3) {
        this.addDemoItems()
        // Try again after adding demo items
        const newStoredItems = localStorage.getItem(this.storageKey)
        return newStoredItems ? (JSON.parse(newStoredItems) as ConnectedMerchandise[]) : []
      }

      // Update wear time for currently worn items
      items.forEach((item) => {
        if (item.isCurrentlyWorn && item.wearingSince) {
          const wearingSince = new Date(item.wearingSince).getTime()
          const now = Date.now()
          const additionalMinutes = Math.floor((now - wearingSince) / (1000 * 60))

          // Only update if there's a meaningful change (at least 1 minute)
          if (additionalMinutes > 0) {
            item.totalWearTime += additionalMinutes
            item.tokenRewards += Math.floor(additionalMinutes / 10) // 1 token per 10 minutes
            item.wearingSince = new Date().toISOString() // Reset the wearing since time

            // Update storage
            localStorage.setItem(this.storageKey, JSON.stringify(items))

            // Update total tokens
            const currentTokens = this.getTotalEarnedTokens()
            this.setTotalEarnedTokens(currentTokens + Math.floor(additionalMinutes / 10))
          }
        }
      })

      return items
    } catch (error) {
      console.error("Error getting connected merchandise:", error)
      // If there's an error, try to add demo items and return them
      this.addDemoItems()
      const newStoredItems = localStorage.getItem(this.storageKey)
      return newStoredItems ? (JSON.parse(newStoredItems) as ConnectedMerchandise[]) : []
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
        this.addDemoItems()
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

  // Start wearing an item
  startWearing(id: string): void {
    if (typeof window === "undefined") return

    try {
      const items = this.getConnectedMerchandise()
      const itemIndex = items.findIndex((item) => item.id === id)

      if (itemIndex >= 0) {
        // Update the item
        items[itemIndex].isCurrentlyWorn = true
        items[itemIndex].wearingSince = new Date().toISOString()
        items[itemIndex].lastWorn = new Date().toISOString()

        localStorage.setItem(this.storageKey, JSON.stringify(items))
      }
    } catch (error) {
      console.error("Error starting to wear merchandise:", error)
    }
  }

  // Stop wearing an item
  stopWearing(id: string): void {
    if (typeof window === "undefined") return

    try {
      const items = this.getConnectedMerchandise()
      const itemIndex = items.findIndex((item) => item.id === id)

      if (itemIndex >= 0 && items[itemIndex].isCurrentlyWorn) {
        const item = items[itemIndex]

        // Calculate additional wear time
        if (item.wearingSince) {
          const wearingSince = new Date(item.wearingSince).getTime()
          const now = Date.now()
          const additionalMinutes = Math.floor((now - wearingSince) / (1000 * 60))

          item.totalWearTime += additionalMinutes

          // Calculate token rewards (1 token per 10 minutes)
          const additionalTokens = Math.floor(additionalMinutes / 10)
          item.tokenRewards += additionalTokens

          // Update total tokens
          const currentTokens = this.getTotalEarnedTokens()
          this.setTotalEarnedTokens(currentTokens + additionalTokens)
        }

        // Update the item
        item.isCurrentlyWorn = false
        item.wearingSince = null
        item.lastWorn = new Date().toISOString()

        localStorage.setItem(this.storageKey, JSON.stringify(items))
      }
    } catch (error) {
      console.error("Error stopping wearing merchandise:", error)
    }
  }

  // Get currently worn items
  getCurrentlyWornItems(): ConnectedMerchandise[] {
    const items = this.getConnectedMerchandise()
    return items.filter((item) => item.isCurrentlyWorn)
  }

  // Get total earned tokens
  getTotalEarnedTokens(): number {
    if (typeof window === "undefined") return 0

    try {
      const storedTokens = localStorage.getItem(this.tokensKey)
      return storedTokens ? Number.parseInt(storedTokens, 10) : 0
    } catch (error) {
      console.error("Error getting total earned tokens:", error)
      return 0
    }
  }

  // Set total earned tokens
  private setTotalEarnedTokens(tokens: number): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.tokensKey, tokens.toString())
    } catch (error) {
      console.error("Error setting total earned tokens:", error)
    }
  }

  // Add demo items
  addDemoItems(): void {
    console.log("Adding demo merchandise items")

    // Clear existing items first to avoid duplicates
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.storageKey)
    }

    const demoItems: ConnectedMerchandise[] = [
      {
        id: "merch-001",
        productName: "Prime Mates Classic T-Shirt",
        productId: "product1",
        image: "/prime-mates-tshirt.png",
        dateConnected: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastWorn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        totalWearTime: 1260, // 21 hours
        tokenRewards: 126,
        isCurrentlyWorn: false,
        wearingSince: null,
        hasNFC: true,
        hasNFT: true,
      },
      {
        id: "merch-002",
        productName: "Prime Mates Board Club Snapback",
        productId: "product2",
        image: "/prime-mates-snapback.png",
        dateConnected: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        lastWorn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        totalWearTime: 840, // 14 hours
        tokenRewards: 84,
        isCurrentlyWorn: false,
        wearingSince: null,
        hasNFC: true,
        hasNFT: false,
      },
      {
        id: "merch-003",
        productName: "Prime Mates Jumper",
        productId: "product3",
        image: "/prime-mates-jumper.png",
        dateConnected: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastWorn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        totalWearTime: 540, // 9 hours
        tokenRewards: 54,
        isCurrentlyWorn: true,
        wearingSince: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        hasNFC: true,
        hasNFT: true,
      },
    ]

    // Save all items at once to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(demoItems))

      // Set initial tokens
      const totalTokens = demoItems.reduce((sum, item) => sum + item.tokenRewards, 0)
      this.setTotalEarnedTokens(totalTokens)

      console.log("Demo items added successfully:", demoItems)
    }
  }
}

// Create a singleton instance
export const merchandiseWearService = new MerchandiseWearService()
