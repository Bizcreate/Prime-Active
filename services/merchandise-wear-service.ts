// This is a mock service for merchandise wear tracking
// In a real app, this would interact with a backend API

export interface ConnectedMerchandise {
  id: string
  productName: string
  productId?: string
  image: string
  dateConnected: string
  lastWorn: string | null
  totalWearTime: number // in minutes
  tokenRewards: number
  isCurrentlyWorn: boolean
  wearingSince: string | null
  hasNFC?: boolean
  hasNFT?: boolean
}

class MerchandiseWearService {
  private items: ConnectedMerchandise[] = []
  private storageKey = "prime-mates-worn-merchandise"

  constructor() {
    this.loadItems()

    // Add some mock items if none exist
    if (this.items.length === 0) {
      this.addMockItems()
    }
  }

  private loadItems(): void {
    if (typeof window !== "undefined") {
      const storedItems = localStorage.getItem(this.storageKey)
      if (storedItems) {
        this.items = JSON.parse(storedItems)
      }
    }
  }

  private saveItems(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items))
    }
  }

  private addMockItems(): void {
    const mockItems: ConnectedMerchandise[] = [
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
    ]

    this.items = mockItems
    this.saveItems()
  }

  getMerchandiseById(id: string): ConnectedMerchandise | null {
    const item = this.items.find((item) => item.id === id)
    return item || null
  }

  getConnectedMerchandise(): ConnectedMerchandise[] {
    return [...this.items]
  }

  getCurrentlyWornItems(): ConnectedMerchandise[] {
    return this.items.filter((item) => item.isCurrentlyWorn)
  }

  getTotalEarnedTokens(): number {
    return this.items.reduce((total, item) => total + item.tokenRewards, 0)
  }

  addMerchandise(item: ConnectedMerchandise): void {
    this.items.push(item)
    this.saveItems()
  }

  startWearing(id: string): boolean {
    const itemIndex = this.items.findIndex((item) => item.id === id)
    if (itemIndex === -1) return false

    this.items[itemIndex].isCurrentlyWorn = true
    this.items[itemIndex].wearingSince = new Date().toISOString()
    this.saveItems()
    return true
  }

  stopWearing(id: string): boolean {
    const itemIndex = this.items.findIndex((item) => item.id === id)
    if (itemIndex === -1) return false

    const now = new Date()
    const wearingSince = this.items[itemIndex].wearingSince
      ? new Date(this.items[itemIndex].wearingSince)
      : new Date(now.getTime() - 10 * 60 * 1000) // Default to 10 minutes ago if no start time

    const wearTimeMinutes = Math.floor((now.getTime() - wearingSince.getTime()) / (1000 * 60))

    this.items[itemIndex].isCurrentlyWorn = false
    this.items[itemIndex].lastWorn = now.toISOString()
    this.items[itemIndex].wearingSince = null
    this.items[itemIndex].totalWearTime += wearTimeMinutes
    this.items[itemIndex].tokenRewards += Math.floor(wearTimeMinutes / 10) // 1 token per 10 minutes

    this.saveItems()
    return true
  }
}

// Create a singleton instance
export const merchandiseWearService = new MerchandiseWearService()
