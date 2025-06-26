export interface ShippingAddress {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

// Local storage key
const SHIPPING_ADDRESS_KEY = "prime_active_shipping_address"

class ShippingService {
  private address: ShippingAddress | null = null

  constructor() {
    this.loadFromStorage()
  }

  // Load address from storage
  private loadFromStorage() {
    try {
      if (typeof window !== "undefined") {
        const storedAddress = localStorage.getItem(SHIPPING_ADDRESS_KEY)

        if (storedAddress) {
          this.address = JSON.parse(storedAddress)
        }
      }
    } catch (error) {
      console.error("Error loading shipping address:", error)
      this.address = null
    }
  }

  // Save address to storage
  private saveToStorage() {
    try {
      if (typeof window !== "undefined" && this.address) {
        localStorage.setItem(SHIPPING_ADDRESS_KEY, JSON.stringify(this.address))
      }
    } catch (error) {
      console.error("Error saving shipping address:", error)
    }
  }

  // Get saved address
  getSavedAddress(): ShippingAddress | null {
    return this.address
  }

  // Check if address is saved
  hasSavedAddress(): boolean {
    return this.address !== null
  }

  // Save address
  saveAddress(address: ShippingAddress): void {
    this.address = address
    this.saveToStorage()
  }

  // Clear address
  clearAddress(): void {
    this.address = null

    if (typeof window !== "undefined") {
      localStorage.removeItem(SHIPPING_ADDRESS_KEY)
    }
  }

  // Validate address
  validateAddress(address: ShippingAddress): boolean {
    // Basic validation
    if (
      !address.fullName ||
      !address.addressLine1 ||
      !address.city ||
      !address.state ||
      !address.postalCode ||
      !address.country ||
      !address.phone
    ) {
      return false
    }

    return true
  }
}

// Create and export a singleton instance
export const shippingService = new ShippingService()
