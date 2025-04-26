"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

export interface WishlistItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  bananaPoints: number
  hasNFC: boolean
  isLimited?: boolean
  category?: string
}

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  moveToCart: (id: string) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [cartItems, setCartItems] = useState<any[]>([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("primeActiveWishlist")
      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist))
        } catch (error) {
          console.error("Failed to parse wishlist from localStorage:", error)
          setWishlistItems([])
        }
      }

      const savedCart = localStorage.getItem("primeActiveCart")
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart))
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error)
          setCartItems([])
        }
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("primeActiveWishlist", JSON.stringify(wishlistItems))
    }
  }, [wishlistItems])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("primeActiveCart", JSON.stringify(cartItems))
    }
  }, [cartItems])

  const addToWishlist = (item: WishlistItem) => {
    if (!isInWishlist(item.id)) {
      setWishlistItems((prev) => [...prev, item])
    }
  }

  const removeFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id))
  }

  const isInWishlist = (id: string) => {
    return wishlistItems.some((item) => item.id === id)
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  const moveToCart = (id: string) => {
    const item = wishlistItems.find((item) => item.id === id)
    if (item) {
      // Add to cart
      const cartItem = {
        id: `${item.id}-standard-one-size`,
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        variant: "One Size",
        quantity: 1,
        bananaPoints: item.bananaPoints,
        hasNFC: item.hasNFC,
        merchandiseType: "standard",
      }

      const existingItemIndex = cartItems.findIndex((i) => i.id === cartItem.id)

      if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems]
        updatedCartItems[existingItemIndex].quantity += 1
        setCartItems(updatedCartItems)
      } else {
        setCartItems([...cartItems, cartItem])
      }

      // Remove from wishlist
      removeFromWishlist(id)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
