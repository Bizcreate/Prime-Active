"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface CartContextType {
  appliedCoupon: string | null
  couponDiscount: number
  selectedType: "standard" | "nfc" | "nfc+nft"
  cartItems: Array<{
    id: string
    name: string
    size: string
    color: string
    price: number
    image: string
    bananaPoints?: number
    merchandiseType?: string
    productId?: string
  }>
  setAppliedCoupon: (coupon: string | null) => void
  setCouponDiscount: (discount: number) => void
  setSelectedType: (type: "standard" | "nfc" | "nfc+nft") => void
  setCartItems: (
    items: Array<{
      id: string
      name: string
      size: string
      color: string
      price: number
      image: string
      bananaPoints?: number
      merchandiseType?: string
      productId?: string
    }>,
  ) => void
  addToCart: (item: {
    id: string
    name: string
    price: number
    image: string
    variantId?: string
    variantName?: string
    quantity?: number
    size?: string
    color?: string
    bananaPoints?: number
  }) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [selectedType, setSelectedType] = useState<"standard" | "nfc" | "nfc+nft">("nfc+nft")
  const [cartItems, setCartItems] = useState<
    Array<{
      id: string
      name: string
      size: string
      color: string
      price: number
      image: string
      bananaPoints?: number
      merchandiseType?: string
      productId?: string
    }>
  >([])

  // Add to cart function
  const addToCart = (item: {
    id: string
    name: string
    price: number
    image: string
    variantId?: string
    variantName?: string
    quantity?: number
    size?: string
    color?: string
    bananaPoints?: number
  }) => {
    const newItem = {
      id: `${item.id}-${Date.now()}`,
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      size: item.size || "M",
      color: item.color || "Default",
      bananaPoints: item.bananaPoints || 0,
      merchandiseType: selectedType,
    }

    setCartItems((prev) => [...prev, newItem])
  }

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCoupon = localStorage.getItem("appliedCoupon")
      const savedDiscount = localStorage.getItem("couponDiscount")
      const savedType = localStorage.getItem("selectedType")
      const savedCart = localStorage.getItem("cartItems")

      if (savedCoupon) setAppliedCoupon(savedCoupon)
      if (savedDiscount) setCouponDiscount(Number.parseFloat(savedDiscount))
      if (savedType && ["standard", "nfc", "nfc+nft"].includes(savedType)) {
        setSelectedType(savedType as "standard" | "nfc" | "nfc+nft")
      }
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart))
        } catch (e) {
          console.error("Error parsing cart items from localStorage:", e)
        }
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
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
    }
  }, [appliedCoupon, couponDiscount, selectedType, cartItems])

  return (
    <CartContext.Provider
      value={{
        appliedCoupon,
        couponDiscount,
        selectedType,
        cartItems,
        setAppliedCoupon,
        setCouponDiscount,
        setSelectedType,
        setCartItems,
        addToCart,
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

export { CartContext }
