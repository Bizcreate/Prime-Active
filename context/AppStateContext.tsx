"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AppState {
  user: any
  activities: any[]
  achievements: any[]
  tokens: {
    banana: number
    shaka: number
    activity: number
  }
  nfts: any[]
  isLoading: boolean
  error: string | null
}

interface AppStateContextType {
  state: AppState
  updateUser: (user: any) => void
  addActivity: (activity: any) => void
  addAchievement: (achievement: any) => void
  updateTokens: (tokens: Partial<AppState["tokens"]>) => void
  addNFT: (nft: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  refreshData: () => Promise<void>
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

export const useAppState = () => {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }
  return context
}

// Mock data for demo
const mockActivities = [
  {
    id: 1,
    type: "skateboarding",
    duration: 45,
    distance: 2.3,
    calories: 320,
    date: new Date().toISOString(),
    location: "Venice Beach Skate Park",
  },
  {
    id: 2,
    type: "surfing",
    duration: 90,
    distance: 0,
    calories: 450,
    date: new Date(Date.now() - 86400000).toISOString(),
    location: "Malibu Point",
  },
  {
    id: 3,
    type: "snowboarding",
    duration: 180,
    distance: 15.2,
    calories: 680,
    date: new Date(Date.now() - 172800000).toISOString(),
    location: "Big Bear Mountain",
  },
]

const mockAchievements = [
  {
    id: 1,
    title: "First Ride",
    description: "Complete your first activity",
    earned: true,
    date: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Speed Demon",
    description: "Reach 25+ mph",
    earned: true,
    date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    title: "Distance Master",
    description: "Travel 10+ miles in one session",
    earned: false,
    date: null,
  },
]

const mockNFTs = [
  {
    id: 1,
    name: "Prime Mate #420",
    image: "/pmbc-420.png",
    rarity: "Rare",
    attributes: ["Skateboard", "Sunglasses", "Cool"],
  },
  {
    id: 2,
    name: "Prime Mate #721",
    image: "/pmbc-721.png",
    rarity: "Epic",
    attributes: ["Surfboard", "Hawaiian Shirt", "Chill"],
  },
]

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    user: null,
    activities: [],
    achievements: [],
    tokens: {
      banana: 1250,
      shaka: 890,
      activity: 340,
    },
    nfts: [],
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    // Simulate loading demo data
    const loadDemoData = async () => {
      setState((prev) => ({ ...prev, isLoading: true }))

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setState((prev) => ({
        ...prev,
        activities: mockActivities,
        achievements: mockAchievements,
        nfts: mockNFTs,
        isLoading: false,
      }))
    }

    loadDemoData()
  }, [])

  const updateUser = (user: any) => {
    setState((prev) => ({ ...prev, user }))
  }

  const addActivity = (activity: any) => {
    setState((prev) => ({
      ...prev,
      activities: [activity, ...prev.activities],
    }))
  }

  const addAchievement = (achievement: any) => {
    setState((prev) => ({
      ...prev,
      achievements: [achievement, ...prev.achievements],
    }))
  }

  const updateTokens = (tokens: Partial<AppState["tokens"]>) => {
    setState((prev) => ({
      ...prev,
      tokens: { ...prev.tokens, ...tokens },
    }))
  }

  const addNFT = (nft: any) => {
    setState((prev) => ({
      ...prev,
      nfts: [nft, ...prev.nfts],
    }))
  }

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }))
  }

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }))
  }

  const refreshData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Simulate refresh delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // In a real app, this would fetch fresh data
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }))
    } catch (error) {
      setError("Failed to refresh data")
      setLoading(false)
    }
  }

  const contextValue: AppStateContextType = {
    state,
    updateUser,
    addActivity,
    addAchievement,
    updateTokens,
    addNFT,
    setLoading,
    setError,
    refreshData,
  }

  return <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>
}
