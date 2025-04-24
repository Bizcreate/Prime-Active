"use client"

// Define the NFC tag data structure
export interface NFCMerchandiseTag {
  id: string
  productId: string
  productType: "hat" | "tshirt" | "hoodie" | "shoes" | "accessory"
  productName: string
  serialNumber: string
  manufactureDate: string
  isAuthentic: boolean
}

// Mock data for connected merchandise
export interface ConnectedMerchandise {
  id: string
  productName: string
  productId: string
  image: string
  dateConnected: string
  lastWorn: string
  totalWearTime: number // in minutes
  tokenRewards: number
  isCurrentlyWorn: boolean
  wearingSince: string | null
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
      productType: randomType,
      productName: productName,
      serialNumber: `SN${Math.floor(Math.random() * 1000000)}`,
      manufactureDate: new Date(Date.now() - Math.random() * 31536000000).toISOString(), // Random date within the last year
      isAuthentic: true,
    }
  }

  // Verify NFC tag authenticity
  static async verifyNFCTag(tag: NFCMerchandiseTag): Promise<boolean> {
    // In a real implementation, we would verify the tag against a database
    // For this demo, we'll just return true
    return tag.isAuthentic
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

export const MerchandiseWearService = {
  // Get all connected merchandise
  getConnectedMerchandise: (): ConnectedMerchandise[] => {
    return getStoredMerchandise()
  },

  // Get merchandise by ID
  getMerchandiseById: (id: string): ConnectedMerchandise | null => {
    const merchandise = getStoredMerchandise()
    return merchandise.find((item) => item.id === id) || null
  },

  // Add new merchandise
  addMerchandise: (item: ConnectedMerchandise): void => {
    const merchandise = getStoredMerchandise()
    merchandise.push(item)
    saveMerchandise(merchandise)
  },

  // Start wearing an item
  startWearing: (id: string): void => {
    const merchandise = getStoredMerchandise()
    const updatedMerchandise = merchandise.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          isCurrentlyWorn: true,
          wearingSince: new Date().toISOString(),
        }
      }
      return item
    })
    saveMerchandise(updatedMerchandise)
  },

  // Stop wearing an item
  stopWearing: (id: string): void => {
    const merchandise = getStoredMerchandise()
    const updatedMerchandise = merchandise.map((item) => {
      if (item.id === id && item.isCurrentlyWorn && item.wearingSince) {
        const wearingSince = new Date(item.wearingSince)
        const now = new Date()
        const wearTimeMinutes = Math.floor((now.getTime() - wearingSince.getTime()) / (1000 * 60))
        const tokenEarned = Math.floor(wearTimeMinutes / 10) // 1 token per 10 minutes

        return {
          ...item,
          isCurrentlyWorn: false,
          wearingSince: null,
          lastWorn: now.toISOString(),
          totalWearTime: item.totalWearTime + wearTimeMinutes,
          tokenRewards: item.tokenRewards + tokenEarned,
        }
      }
      return item
    })
    saveMerchandise(updatedMerchandise)
  },

  // Get currently worn items
  getCurrentlyWornItems: (): ConnectedMerchandise[] => {
    const merchandise = getStoredMerchandise()
    return merchandise.filter((item) => item.isCurrentlyWorn)
  },

  // Update wear time and rewards for currently worn items
  updateWearTimeAndRewards: (): void => {
    const merchandise = getStoredMerchandise()
    const now = new Date()

    const updatedMerchandise = merchandise.map((item) => {
      if (item.isCurrentlyWorn && item.wearingSince) {
        const wearingSince = new Date(item.wearingSince)
        const wearTimeMinutes = Math.floor((now.getTime() - wearingSince.getTime()) / (1000 * 60))
        const tokenEarned = Math.floor(wearTimeMinutes / 10) // 1 token per 10 minutes

        return {
          ...item,
          totalWearTime: item.totalWearTime + wearTimeMinutes,
          tokenRewards: item.tokenRewards + tokenEarned,
          wearingSince: now.toISOString(), // Reset the wearing since time
        }
      }
      return item
    })

    saveMerchandise(updatedMerchandise)
  },

  // Get total earned tokens
  getTotalEarnedTokens: (): number => {
    const merchandise = getStoredMerchandise()
    return merchandise.reduce((total, item) => total + item.tokenRewards, 0)
  },

  // Remove merchandise
  removeMerchandise: (id: string): void => {
    const merchandise = getStoredMerchandise()
    const updatedMerchandise = merchandise.filter((item) => item.id !== id)
    saveMerchandise(updatedMerchandise)
  },
}

// Set up an interval to update wear time and rewards
if (typeof window !== "undefined") {
  setInterval(() => {
    MerchandiseWearService.updateWearTimeAndRewards()
  }, 60000) // Update every minute
}
