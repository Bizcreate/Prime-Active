// NFC Merchandise Service
// This service simulates NFC merchandise tracking and management

export interface MerchandiseItem {
  id: string
  name: string
  image: string
  type: "nfc" | "nfc+nft"
  isCurrentlyWorn: boolean
  wearingSince: string | null
  lastWorn: string | null
  totalWearTime: number // in minutes
  wearCount: number
  linkedNftId?: string
}

class NFCMerchandiseService {
  private items: MerchandiseItem[] = []

  constructor() {
    // Initialize with some example items
    this.items = [
      {
        id: "merch-1",
        name: "Prime Mates Hoodie",
        image: "/black-hoodie-abstract-ape.png",
        type: "nfc+nft",
        isCurrentlyWorn: false,
        wearingSince: null,
        lastWorn: "2023-04-15T14:30:00Z",
        totalWearTime: 240, // 4 hours
        wearCount: 3,
        linkedNftId: "nft-1",
      },
      {
        id: "merch-2",
        name: "Prime Mates Cap",
        image: "/pmbc-red-black-cap.jpeg",
        type: "nfc",
        isCurrentlyWorn: true,
        wearingSince: "2023-04-27T08:15:00Z",
        lastWorn: null,
        totalWearTime: 180, // 3 hours
        wearCount: 5,
      },
    ]
  }

  // Get all merchandise items
  getAllItems(): MerchandiseItem[] {
    return this.items
  }

  // Get currently worn items
  getCurrentlyWornItems(): MerchandiseItem[] {
    return this.items.filter((item) => item.isCurrentlyWorn)
  }

  // Start wearing an item
  startWearing(itemId: string): boolean {
    const itemIndex = this.items.findIndex((item) => item.id === itemId)
    if (itemIndex === -1) return false

    this.items[itemIndex].isCurrentlyWorn = true
    this.items[itemIndex].wearingSince = new Date().toISOString()
    this.items[itemIndex].wearCount += 1
    return true
  }

  // Stop wearing an item and calculate tokens earned
  stopWearing(itemId: string): number {
    const itemIndex = this.items.findIndex((item) => item.id === itemId)
    if (itemIndex === -1) return 0

    const item = this.items[itemIndex]
    if (!item.isCurrentlyWorn || !item.wearingSince) return 0

    // Calculate wear time in minutes
    const startTime = new Date(item.wearingSince).getTime()
    const endTime = new Date().getTime()
    const wearTimeMinutes = Math.floor((endTime - startTime) / (1000 * 60))

    // Update item
    this.items[itemIndex].isCurrentlyWorn = false
    this.items[itemIndex].lastWorn = new Date().toISOString()
    this.items[itemIndex].wearingSince = null
    this.items[itemIndex].totalWearTime += wearTimeMinutes

    // Calculate tokens earned (1 token per 10 minutes)
    const tokensEarned = Math.floor(wearTimeMinutes / 10)
    return tokensEarned
  }

  // Get total tokens earned from all items
  getTotalTokensEarned(): number {
    // Simulate token calculation (1 token per 10 minutes of wear time)
    return Math.floor(this.items.reduce((total, item) => total + item.totalWearTime, 0) / 10)
  }

  // Add a new merchandise item
  addMerchandise(item: MerchandiseItem): void {
    this.items.push(item)
  }

  // Update an existing merchandise item
  updateMerchandise(updatedItem: MerchandiseItem): boolean {
    const itemIndex = this.items.findIndex((item) => item.id === updatedItem.id)
    if (itemIndex === -1) return false

    this.items[itemIndex] = updatedItem
    return true
  }

  // Simulate scanning an NFC tag
  async scanNFC(): Promise<MerchandiseItem | null> {
    // Simulate a delay for scanning
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Randomly decide if scan is successful
    const isSuccessful = Math.random() > 0.3 // 70% success rate

    if (!isSuccessful) return null

    // Create a new merchandise item
    const newItem: MerchandiseItem = {
      id: `merch-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: "Scanned Prime Mates Item",
      image: "/prime-mates-tshirt.png",
      type: Math.random() > 0.5 ? "nfc+nft" : "nfc",
      isCurrentlyWorn: false,
      wearingSince: null,
      lastWorn: null,
      totalWearTime: 0,
      wearCount: 0,
    }

    this.items.push(newItem)
    return newItem
  }
}

// Create a singleton instance
export const nfcMerchandiseService = new NFCMerchandiseService()
