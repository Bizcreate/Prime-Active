"use client"

// Define the connected merchandise interface
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
  nftTokenId?: string
  nftImage?: string
}

// Define the NFC tag interface
export interface NFCMerchandiseTag {
  id: string
  productId: string
  productName: string
  productType: string
  hasNFT?: boolean
  nftTokenId?: string
}

// Mock initial data
const initialMerchandise: ConnectedMerchandise[] = [
  {
    id: "merch-1",
    productName: "Prime Mates Hoodie",
    productId: "product3",
    image: "/prime-mates-jumper.png",
    dateConnected: "2023-05-15T10:30:00Z",
    lastWorn: "2023-05-20T18:45:00Z",
    totalWearTime: 720, // 12 hours
    tokenRewards: 72,
    isCurrentlyWorn: false,
    wearingSince: null,
    hasNFC: false,
    hasNFT: false,
  },
  {
    id: "merch-2",
    productName: "Prime Mates Beanie",
    productId: "product5",
    image: "/prime-mates-snapback.png",
    dateConnected: "2023-06-01T09:15:00Z",
    lastWorn: "2023-06-05T17:30:00Z",
    totalWearTime: 480, // 8 hours
    tokenRewards: 48,
    isCurrentlyWorn: false,
    wearingSince: null,
    hasNFC: false,
    hasNFT: false,
  },
]

// Helper to get data from localStorage
const getStoredMerchandise = (): ConnectedMerchandise[] => {
  if (typeof window === "undefined") return initialMerchandise

  const stored = localStorage.getItem("connectedMerchandise")
  if (!stored) {
    localStorage.setItem("connectedMerchandise", JSON.stringify(initialMerchandise))
    return initialMerchandise
  }

  return JSON.parse(stored)
}

// Helper to save data to localStorage
const saveMerchandise = (merchandise: ConnectedMerchandise[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("connectedMerchandise", JSON.stringify(merchandise))
}

export class NFCService {
  // Check if NFC is available on the device
  static isNFCAvailable(): boolean {
    return typeof window !== "undefined" && "NDEFReader" in window
  }

  // Scan for NFC tags
  static async scanNFCTag(): Promise<NFCMerchandiseTag | null> {
    if (!this.isNFCAvailable()) {
      throw new Error("NFC is not available on this device")
    }

    try {
      // @ts-ignore - NDEFReader is not in the TypeScript types yet
      const ndef = new window.NDEFReader()
      await ndef.scan()

      return new Promise((resolve) => {
        // @ts-ignore
        ndef.onreading = (event) => {
          // In a real implementation, we would parse the NDEF message
          // For this demo, we'll simulate reading tag data
          const simulatedTag: NFCMerchandiseTag = this.parseNFCData(event)
          resolve(simulatedTag)
        }

        // Set a timeout to simulate a tag being read
        setTimeout(() => {
          // If no tag is read after 10 seconds, resolve with null
          resolve(null)
        }, 10000)
      })
    } catch (error) {
      console.error("Error scanning NFC tag:", error)
      throw error
    }
  }

  // Simulate parsing NFC data
  private static parseNFCData(event: any): NFCMerchandiseTag {
    // In a real implementation, we would parse the NDEF message from the event
    // For this demo, we'll return simulated data

    // Generate a random product type
    const productTypes: Array<"hat" | "tshirt" | "hoodie" | "shoes" | "accessory"> = [
      "hat",
      "tshirt",
      "hoodie",
      "shoes",
      "accessory",
    ]
    const randomType = productTypes[Math.floor(Math.random() * productTypes.length)]

    // Generate product name based on type
    let productName = ""
    switch (randomType) {
      case "hat":
        productName = "Prime Mates Snapback"
        break
      case "tshirt":
        productName = "Prime Mates T-Shirt"
        break
      case "hoodie":
        productName = "Prime Mates Jumper"
        break
      case "shoes":
        productName = "Prime Mates Sneakers"
        break
      case "accessory":
        productName = "Prime Mates Wristband"
        break
    }

    return {
      id: `tag_${Math.random().toString(36).substring(2, 11)}`,
      productId: `prod_${Math.random().toString(36).substring(2, 11)}`,
      productName: productName,
      productType: randomType,
      hasNFT: Math.random() > 0.5,
      nftTokenId: Math.random().toString(36).substring(2, 15),
    }
  }

  // Verify NFC tag authenticity
  static async verifyNFCTag(tag: NFCMerchandiseTag): Promise<boolean> {
    // In a real implementation, we would verify the tag against a database
    // For this demo, we'll just return true
    return true
  }

  // Simulate writing to an NFC tag (for future use)
  static async writeToNFCTag(data: any): Promise<boolean> {
    if (!this.isNFCAvailable()) {
      throw new Error("NFC is not available on this device")
    }

    try {
      // In a real implementation, we would write to the tag
      // For this demo, we'll just return success
      return true
    } catch (error) {
      console.error("Error writing to NFC tag:", error)
      throw error
    }
  }

  // Get device compatibility information
  static getDeviceCompatibilityInfo(): {
    isCompatible: boolean
    reason?: string
    browserSupport?: boolean
    osSupport?: boolean
  } {
    if (typeof window === "undefined") {
      return { isCompatible: false, reason: "Server-side rendering" }
    }

    const isChrome = navigator.userAgent.indexOf("Chrome") > -1
    const isAndroid = /Android/i.test(navigator.userAgent)

    if (!isChrome) {
      return {
        isCompatible: false,
        reason: "Browser not supported",
        browserSupport: false,
        osSupport: isAndroid,
      }
    }

    if (!isAndroid) {
      return {
        isCompatible: false,
        reason: "OS not supported",
        browserSupport: true,
        osSupport: false,
      }
    }

    if (!this.isNFCAvailable()) {
      return {
        isCompatible: false,
        reason: "NFC API not available",
        browserSupport: true,
        osSupport: true,
      }
    }

    return { isCompatible: true }
  }
}

// Export the MerchandiseWearService class
export class MerchandiseWearService {
  static merchandise: ConnectedMerchandise[] = []
  private static storageKey = "prime-mates-merchandise"
  private static initialized = false

  // Initialize the service
  static initialize() {
    if (this.initialized) return
    this.initialized = true

    this.loadMerchandise()

    // Add mock data if empty
    if (this.merchandise.length === 0) {
      this.addMockMerchandise()
    }

    // Start tracking interval
    this.startTrackingInterval()
  }

  private static loadMerchandise() {
    if (typeof window !== "undefined") {
      const storedMerchandise = localStorage.getItem(this.storageKey)
      if (storedMerchandise) {
        this.merchandise = JSON.parse(storedMerchandise)
      }
    }
  }

  private static saveMerchandise() {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(this.merchandise))
    }
  }

  private static addMockMerchandise() {
    const mockMerchandise: ConnectedMerchandise[] = [
      {
        id: "merch-1",
        productName: "Prime Mates Classic T-Shirt",
        productId: "product1",
        image: "/prime-mates-tshirt.png",
        dateConnected: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastWorn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        totalWearTime: 480, // 8 hours
        tokenRewards: 48,
        isCurrentlyWorn: false,
        wearingSince: null,
        hasNFC: true,
        hasNFT: true,
        nftTokenId: "0x123456789",
        nftImage: "/prime-mates-tshirt.png",
      },
      {
        id: "merch-2",
        productName: "Prime Mates Board Club Snapback",
        productId: "product2",
        image: "/prime-mates-snapback.png",
        dateConnected: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        lastWorn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        totalWearTime: 720, // 12 hours
        tokenRewards: 72,
        isCurrentlyWorn: false,
        wearingSince: null,
        hasNFC: true,
        hasNFT: false,
      },
    ]

    this.merchandise = mockMerchandise
    this.saveMerchandise()
  }

  private static startTrackingInterval() {
    if (typeof window !== "undefined") {
      // Update worn items every minute
      setInterval(() => {
        const now = new Date()
        let updated = false

        this.merchandise.forEach((item) => {
          if (item.isCurrentlyWorn && item.wearingSince) {
            const wearingSince = new Date(item.wearingSince)
            const elapsedMinutes = Math.floor((now.getTime() - wearingSince.getTime()) / (60 * 1000))

            // Award 1 token for every 10 minutes
            const newTokens = Math.floor(elapsedMinutes / 10) - Math.floor(item.totalWearTime / 10)

            if (newTokens > 0) {
              item.tokenRewards += newTokens
              item.totalWearTime = elapsedMinutes
              updated = true
            }
          }
        })

        if (updated) {
          this.saveMerchandise()
        }
      }, 60000) // Check every minute
    }
  }

  static getConnectedMerchandise(): ConnectedMerchandise[] {
    this.initialize()
    return [...this.merchandise]
  }

  static getCurrentlyWornItems(): ConnectedMerchandise[] {
    this.initialize()
    return this.merchandise.filter((item) => item.isCurrentlyWorn)
  }

  static getTotalEarnedTokens(): number {
    this.initialize()
    return this.merchandise.reduce((total, item) => total + item.tokenRewards, 0)
  }

  static startWearing(itemId: string): boolean {
    this.initialize()
    const itemIndex = this.merchandise.findIndex((item) => item.id === itemId)
    if (itemIndex === -1) return false

    this.merchandise[itemIndex].isCurrentlyWorn = true
    this.merchandise[itemIndex].wearingSince = new Date().toISOString()
    this.merchandise[itemIndex].lastWorn = new Date().toISOString()

    this.saveMerchandise()
    return true
  }

  static stopWearing(itemId: string): boolean {
    this.initialize()
    const itemIndex = this.merchandise.findIndex((item) => item.id === itemId)
    if (itemIndex === -1 || !this.merchandise[itemIndex].isCurrentlyWorn) return false

    const item = this.merchandise[itemIndex]
    const wearingSince = new Date(item.wearingSince || new Date())
    const now = new Date()

    // Calculate additional wear time
    const additionalMinutes = Math.floor((now.getTime() - wearingSince.getTime()) / (60 * 1000))

    // Update item
    this.merchandise[itemIndex].isCurrentlyWorn = false
    this.merchandise[itemIndex].wearingSince = null
    this.merchandise[itemIndex].lastWorn = now.toISOString()
    this.merchandise[itemIndex].totalWearTime += additionalMinutes

    // Award tokens (1 token per 10 minutes)
    const newTokens = Math.floor(additionalMinutes / 10)
    this.merchandise[itemIndex].tokenRewards += newTokens

    this.saveMerchandise()
    return true
  }

  static addMerchandise(item: ConnectedMerchandise): ConnectedMerchandise {
    // Ensure the item has all required properties
    const newItem: ConnectedMerchandise = {
      id: item.id || `merch-${Date.now()}`,
      productName: item.productName,
      productId: item.productId,
      image: item.image,
      dateConnected: item.dateConnected || new Date().toISOString(),
      lastWorn: item.lastWorn || null,
      totalWearTime: item.totalWearTime || 0,
      tokenRewards: item.tokenRewards || 0,
      isCurrentlyWorn: item.isCurrentlyWorn || false,
      wearingSince: item.wearingSince || null,
      hasNFC: item.hasNFC !== undefined ? item.hasNFC : true,
      hasNFT: item.hasNFT !== undefined ? item.hasNFT : false,
    }

    this.merchandise.push(newItem)
    this.saveMerchandise()
    return newItem
  }

  static removeMerchandise(itemId: string): boolean {
    this.initialize()
    const initialLength = this.merchandise.length
    this.merchandise = this.merchandise.filter((item) => item.id !== itemId)

    if (this.merchandise.length !== initialLength) {
      this.saveMerchandise()
      return true
    }

    return false
  }
}

// Initialize the service
if (typeof window !== "undefined") {
  // Initialize on the client side
  setTimeout(() => {
    MerchandiseWearService.initialize()
  }, 0)
}
