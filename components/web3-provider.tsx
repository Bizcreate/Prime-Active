"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Web3ContextType {
  isConnected: boolean
  connectWallet: () => Promise<boolean>
  disconnectWallet: () => void
  address: string | null
  balance: number
  ownedNFTs: any[]
  stakedNFTs: any[]
  stakingRewards: number
  hasAccess: boolean
  verifyNFTOwnership: () => Promise<boolean>
  isVerifying: boolean
  isSimulated: boolean
}

// Create a default context value
const defaultContextValue: Web3ContextType = {
  isConnected: false,
  connectWallet: async () => false,
  disconnectWallet: () => {},
  address: null,
  balance: 0,
  ownedNFTs: [],
  stakedNFTs: [],
  stakingRewards: 0,
  hasAccess: false,
  verifyNFTOwnership: async () => false,
  isVerifying: false,
  isSimulated: true,
}

const Web3Context = createContext<Web3ContextType>(defaultContextValue)

export const useWeb3 = () => useContext(Web3Context)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [ownedNFTs, setOwnedNFTs] = useState<any[]>([])
  const [stakedNFTs, setStakedNFTs] = useState<any[]>([])
  const [stakingRewards, setStakingRewards] = useState(0)
  const [hasAccess, setHasAccess] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSimulated] = useState(true) // Always true for testing

  // Updated mock data for NFTs using actual PMBC NFTs
  const mockNFTs = [
    {
      id: "nft-1",
      name: "PMBC #420",
      image: "/pmbc-flamingo.webp",
      collection: "Prime Mates Board Club",
      rarity: "rare",
      stakingRewards: 25,
      stakingPeriod: 7,
    },
    {
      id: "nft-2",
      name: "PMBC #721",
      image: "/pmbc-dreadlocks.webp",
      collection: "Prime Mates Board Club",
      rarity: "epic",
      stakingRewards: 50,
      stakingPeriod: 14,
    },
    {
      id: "nft-3",
      name: "PMBC #1337",
      image: "/pmbc-surfer.jpeg",
      collection: "Prime Mates Board Club",
      rarity: "legendary",
      stakingRewards: 100,
      stakingPeriod: 30,
    },
    {
      id: "nft-4",
      name: "PMBC #888",
      image: "/pmbc-pink.jpeg",
      collection: "Prime Mates Board Club",
      rarity: "legendary",
      stakingRewards: 150,
      stakingPeriod: 14,
    },
  ]

  // Updated mock data for staked NFTs
  const mockStakedNFTs = [
    {
      id: "staked-1",
      name: "PMBC #420",
      image: "/pmbc-flamingo.webp",
      collection: "Prime Mates Board Club",
      rarity: "legendary",
      stakingRewards: 125,
      stakingPeriod: 30,
      stakingProgress: 65,
      stakedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
      unlockAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(), // 20 days from now
    },
    {
      id: "staked-2",
      name: "PMBC #721",
      image: "/pmbc-dreadlocks.webp",
      collection: "Prime Mates Board Club",
      rarity: "epic",
      stakingRewards: 75,
      stakingPeriod: 14,
      stakingProgress: 85,
      stakedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(), // 12 days ago
      unlockAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
    },
  ]

  // Check if wallet is already connected
  useEffect(() => {
    const checkSavedConnection = () => {
      const savedConnection = localStorage.getItem("walletConnected")
      if (savedConnection === "true") {
        console.log("Restoring saved wallet connection")
        setIsConnected(true)
        setAddress("0x1234...5678")
        setBalance(250)
        setOwnedNFTs(mockNFTs)
        setStakedNFTs(mockStakedNFTs)
        setStakingRewards(200)
        setHasAccess(true)
      }
    }

    // Run on client-side only
    if (typeof window !== "undefined") {
      checkSavedConnection()
    }
  }, [])

  // Connect wallet function - guaranteed to work in test mode
  const connectWallet = async () => {
    console.log("Connecting wallet in test mode...")

    try {
      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Wallet connected successfully in test mode")

      // Set all the state values for a connected wallet
      setIsConnected(true)
      setAddress("0x1234...5678")
      setBalance(250)
      setOwnedNFTs(mockNFTs)
      setStakedNFTs(mockStakedNFTs)
      setStakingRewards(200)
      setHasAccess(true)

      // Save connection state to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("walletConnected", "true")
      }

      return true
    } catch (error) {
      console.error("Error connecting wallet:", error)
      return false
    }
  }

  // Verify NFT ownership - always succeeds in test mode
  const verifyNFTOwnership = async () => {
    try {
      setIsVerifying(true)
      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setHasAccess(true)
      setIsVerifying(false)
      return true
    } catch (error) {
      console.error("Error verifying NFT ownership:", error)
      setIsVerifying(false)
      return false
    }
  }

  // Disconnect wallet function
  const disconnectWallet = () => {
    console.log("Disconnecting wallet")
    setIsConnected(false)
    setAddress(null)
    setBalance(0)
    setOwnedNFTs([])
    setStakedNFTs([])
    setStakingRewards(0)
    setHasAccess(false)

    if (typeof window !== "undefined") {
      localStorage.removeItem("walletConnected")
    }
  }

  const contextValue: Web3ContextType = {
    isConnected,
    connectWallet,
    disconnectWallet,
    address,
    balance,
    ownedNFTs,
    stakedNFTs,
    stakingRewards,
    hasAccess,
    verifyNFTOwnership,
    isVerifying,
    isSimulated,
  }

  return <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
}
