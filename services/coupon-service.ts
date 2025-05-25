// Coupon service to manage and validate coupons

export interface Coupon {
  code: string
  type: "percentage" | "fixed" | "free"
  value: number // Percentage or fixed amount discount
  minPurchase?: number // Minimum purchase amount required
  maxDiscount?: number // Maximum discount amount
  expiryDate?: string // ISO date string
  usageLimit?: number // Number of times the coupon can be used
  usageCount: number // Number of times the coupon has been used
  products?: string[] // Product IDs the coupon applies to (empty = all products)
  description: string
}

class CouponService {
  private coupons: Coupon[] = []
  private storageKey = "prime-mates-coupons"

  constructor() {
    this.loadCoupons()
    this.initializeCoupons()
  }

  private loadCoupons(): void {
    if (typeof window !== "undefined") {
      const storedCoupons = localStorage.getItem(this.storageKey)
      if (storedCoupons) {
        this.coupons = JSON.parse(storedCoupons)
      }
    }
  }

  private saveCoupons(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(this.coupons))
    }
  }

  private initializeCoupons(): void {
    // Only initialize if no coupons exist
    if (this.coupons.length === 0) {
      this.coupons = [
        {
          code: "WELCOME10",
          type: "percentage",
          value: 10,
          description: "10% off your first purchase",
          usageCount: 0,
        },
        {
          code: "PRIME20",
          type: "percentage",
          value: 20,
          minPurchase: 50,
          description: "20% off orders over $50",
          usageCount: 0,
        },
        {
          code: "BOARDCLUB",
          type: "fixed",
          value: 15,
          minPurchase: 75,
          description: "$15 off orders over $75",
          usageCount: 0,
        },
        {
          code: "FREE",
          type: "free",
          value: 999, // High value to ensure it covers any purchase
          description: "100% free purchase - demo only",
          usageCount: 0,
        },
      ]
      this.saveCoupons()
    } else {
      // Check if FREE coupon exists, add it if not
      const hasFreeCode = this.coupons.some((coupon) => coupon.code === "FREE")
      if (!hasFreeCode) {
        this.coupons.push({
          code: "FREE",
          type: "free",
          value: 999, // High value to ensure it covers any purchase
          description: "100% free purchase - demo only",
          usageCount: 0,
        })
        this.saveCoupons()
      }
    }
  }

  getCoupons(): Coupon[] {
    return [...this.coupons]
  }

  getCoupon(code: string): Coupon | undefined {
    return this.coupons.find((coupon) => coupon.code.toUpperCase() === code.toUpperCase())
  }

  validateCoupon(
    code: string,
    subtotal: number,
    productIds: string[] = [],
  ): { valid: boolean; message?: string; discount?: number } {
    const coupon = this.getCoupon(code)

    if (!coupon) {
      return { valid: false, message: "Invalid coupon code" }
    }

    // Check expiry date
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, message: "Coupon has expired" }
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: "Coupon usage limit reached" }
    }

    // Check minimum purchase
    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return {
        valid: false,
        message: `Minimum purchase of $${coupon.minPurchase.toFixed(2)} required`,
      }
    }

    // Check product restrictions
    if (coupon.products && coupon.products.length > 0 && productIds.length > 0) {
      const hasMatchingProduct = productIds.some((id) => coupon.products?.includes(id))
      if (!hasMatchingProduct) {
        return { valid: false, message: "Coupon not valid for these products" }
      }
    }

    // Calculate discount
    let discount = 0
    switch (coupon.type) {
      case "percentage":
        discount = subtotal * (coupon.value / 100)
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount
        }
        break
      case "fixed":
        discount = Math.min(coupon.value, subtotal)
        break
      case "free":
        discount = subtotal
        break
    }

    return {
      valid: true,
      discount,
      message: coupon.description,
    }
  }

  applyCoupon(code: string): boolean {
    const couponIndex = this.coupons.findIndex((coupon) => coupon.code.toUpperCase() === code.toUpperCase())

    if (couponIndex === -1) return false

    this.coupons[couponIndex].usageCount++
    this.saveCoupons()
    return true
  }

  addCoupon(coupon: Omit<Coupon, "usageCount">): boolean {
    // Check if coupon code already exists
    if (this.coupons.some((c) => c.code.toUpperCase() === coupon.code.toUpperCase())) {
      return false
    }

    this.coupons.push({
      ...coupon,
      usageCount: 0,
    })
    this.saveCoupons()
    return true
  }

  resetCouponUsage(code: string): boolean {
    const couponIndex = this.coupons.findIndex((coupon) => coupon.code.toUpperCase() === code.toUpperCase())

    if (couponIndex === -1) return false

    this.coupons[couponIndex].usageCount = 0
    this.saveCoupons()
    return true
  }
}

export const couponService = new CouponService()
