"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the wishlist item type
export interface WishlistItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  bananaPoints?: number
  hasNFC?: boolean
}

// Define the context type
interface WishlistContextType {
  wishlist: WishlistItem[]
  addToWishlist: (item: WishlistItem) => Promise<void>
  removeFromWishlist: (id: string) => Promise<void>
  isInWishlist: (id: string) => boolean
  clearWishlist: () => Promise<void>
}

// Create the context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

// Storage key
const WISHLIST_STORAGE_KEY = "prime_active_wishlist"

// Provider component
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load wishlist from storage on mount
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY)
        if (storedWishlist) {
          setWishlist(JSON.parse(storedWishlist))
        }
      } catch (error) {
        console.error("Error loading wishlist:", error)
      } finally {
        setIsInitialized(true)
      }
    }

    if (typeof window !== "undefined") {
      loadWishlist()
    }
  }, [])

  // Save wishlist to storage whenever it changes
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist))
    }
  }, [wishlist, isInitialized])

  // Add item to wishlist
  const addToWishlist = async (item: WishlistItem): Promise<void> => {
    return new Promise((resolve) => {
      setWishlist((prev) => {
        // Check if item already exists
        if (prev.some((i) => i.id === item.id)) {
          return prev
        }
        return [...prev, item]
      })
      resolve()
    })
  }

  // Remove item from wishlist
  const removeFromWishlist = async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setWishlist((prev) => prev.filter((item) => item.id !== id))
      resolve()
    })
  }

  // Check if item is in wishlist
  const isInWishlist = (id: string): boolean => {
    return wishlist.some((item) => item.id === id)
  }

  // Clear wishlist
  const clearWishlist = async (): Promise<void> => {
    return new Promise((resolve) => {
      setWishlist([])
      resolve()
    })
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

// Hook to use the wishlist context
export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
