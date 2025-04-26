// This is a mock service for NFC merchandise tracking
// In a real app, this would interact with a backend API and NFC hardware

export interface MerchandiseItem {
  id: string
  name: string
  type: "standard" | "nfc" | "nfc+nft"
  image: string
  dateAcquired: string
  lastWorn?: string
  totalWearTime: number // in minutes
  wearCount: number
  isCurrentlyWorn: boolean
  wearingSince?: string
  tokensEarned: number
  nftTokenId?: string
}

class NFCMerchandiseService {
  private items: MerchandiseItem[] = []
  private storageKey = "prime-mates-merchandise"

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
    const mockItems: MerchandiseItem[] = [
      {
        id: "merch-001",
        name: "Prime Mates Classic T-Shirt",
        type: "nfc+nft",
        image: "/prime-mates-tshirt.png",
        dateAcquired: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastWorn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        totalWearTime: 1260, // 21 hours
        wearCount: 7,
        isCurrentlyWorn: false,
        tokensEarned: 126,
        nftTokenId: "0x123456789",
      },
      {
        id: "merch-002",
        name: "Prime Mates Board Club Snapback",
        type: "nfc",
        image: "/prime-mates-snapback.png",
        dateAcquired: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        lastWorn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        totalWearTime: 840, // 14 hours
        wearCount: 5,
        isCurrentlyWorn: false,
        tokensEarned: 84,
      },
    ]

    this.items = mockItems
    this.saveItems()
  }

  getAllItems(): MerchandiseItem[] {
    return [...this.items]
  }

  getItemById(id: string): MerchandiseItem | undefined {
    return this.items.find((item) => item.id === id)
  }

  getCurrentlyWornItems(): MerchandiseItem[] {
    return this.items.filter((item) => item.isCurrentlyWorn)
  }

  startWearing(id: string): boolean {
    const itemIndex = this.items.findIndex((item) => item.id === id)
    if (itemIndex === -1) return false

    this.items[itemIndex].isCurrentlyWorn = true
    this.items[itemIndex].wearingSince = new Date().toISOString()
    this.saveItems()
    return true
  }

  stopWearing(id: string): number {
    const itemIndex = this.items.findIndex((item) => item.id === id)
    if (itemIndex === -1 || !this.items[itemIndex].isCurrentlyWorn) return 0

    const item = this.items[itemIndex]
    const wearingSince = new Date(item.wearingSince || Date.now())
    const now = new Date()
    const wearTimeMinutes = Math.floor((now.getTime() - wearingSince.getTime()) / (1000 * 60))

    // Update item
    this.items[itemIndex].isCurrentlyWorn = false
    this.items[itemIndex].lastWorn = now.toISOString()
    this.items[itemIndex].totalWearTime += wearTimeMinutes
    this.items[itemIndex].wearCount += 1

    // Calculate tokens earned (1 token per 10 minutes)
    const tokensEarned = Math.floor(wearTimeMinutes / 10)
    this.items[itemIndex].tokensEarned += tokensEarned

    this.saveItems()
    return tokensEarned
  }

  addItem(
    item: Omit<
      MerchandiseItem,
      "id" | "dateAcquired" | "totalWearTime" | "wearCount" | "isCurrentlyWorn" | "tokensEarned"
    >,
  ): MerchandiseItem {
    const newItem: MerchandiseItem = {
      id: `merch-${Date.now()}`,
      dateAcquired: new Date().toISOString(),
      totalWearTime: 0,
      wearCount: 0,
      isCurrentlyWorn: false,
      tokensEarned: 0,
      ...item,
    }

    this.items.push(newItem)
    this.saveItems()
    return newItem
  }

  getTotalTokensEarned(): number {
    return this.items.reduce((total, item) => total + item.tokensEarned, 0)
  }

  scanNFC(): Promise<MerchandiseItem | null> {
    // In a real app, this would interact with the device's NFC hardware
    // For this demo, we'll simulate a successful scan after a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate finding an item or not
        const found = Math.random() > 0.3 // 70% chance of success

        if (found) {
          // Return a random item from our collection or a new one
          if (this.items.length > 0 && Math.random() > 0.5) {
            resolve(this.items[Math.floor(Math.random() * this.items.length)])
          } else {
            // Create a new random item
            const types: ("nfc" | "nfc+nft")[] = ["nfc", "nfc+nft"]
            const names = [
              "Prime Mates Classic T-Shirt",
              "Prime Mates Board Club Snapback",
              "Prime Mates Crew Jumper",
              "Bone Shaka T-Shirt",
              "PMBC Red/Black Snapback",
            ]
            const images = [
              "/prime-mates-tshirt.png",
              "/prime-mates-snapback.png",
              "/prime-mates-jumper.png",
              "/prime-mates-boneshaka.webp",
              "/pmbc-red-black-cap.jpeg",
            ]

            const randomIndex = Math.floor(Math.random() * names.length)
            const newItem = this.addItem({
              name: names[randomIndex],
              type: types[Math.floor(Math.random() * types.length)],
              image: images[randomIndex],
              nftTokenId: Math.random() > 0.5 ? `0x${Math.floor(Math.random() * 1000000000).toString(16)}` : undefined,
            })

            resolve(newItem)
          }
        } else {
          resolve(null)
        }
      }, 2000)
    })
  }
}

export const nfcMerchandiseService = new NFCMerchandiseService()
