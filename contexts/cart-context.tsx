"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface CartContextType {
  appliedCoupon: string | null
  couponDiscount: number
  selectedType: "standard" | "nfc" | "nfc+nft"
  setAppliedCoupon: (coupon: string | null) => void
  setCouponDiscount: (discount: number) => void
  setSelectedType: (type: "standard" | "nfc" | "nfc+nft") => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [selectedType, setSelectedType] = useState<"standard" | "nfc" | "nfc+nft">("nfc+nft")

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCoupon = localStorage.getItem("appliedCoupon")
      const savedDiscount = localStorage.getItem("couponDiscount")
      const savedType = localStorage.getItem("selectedType")

      if (savedCoupon) setAppliedCoupon(savedCoupon)
      if (savedDiscount) setCouponDiscount(Number.parseFloat(savedDiscount))
      if (savedType && ["standard", "nfc", "nfc+nft"].includes(savedType)) {
        setSelectedType(savedType as "standard" | "nfc" | "nfc+nft")
      }
    }
  }, [])

  // Save state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (appliedCoupon) {
        localStorage.setItem("appliedCoupon", appliedCoupon)
      } else {
        localStorage.removeItem("appliedCoupon")
      }

      localStorage.setItem("couponDiscount", couponDiscount.toString())
      localStorage.setItem("selectedType", selectedType)
    }
  }, [appliedCoupon, couponDiscount, selectedType])

  return (
    <CartContext.Provider
      value={{
        appliedCoupon,
        couponDiscount,
        selectedType,
        setAppliedCoupon,
        setCouponDiscount,
        setSelectedType,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
