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
}

const Web3Context = createContext<Web3ContextType>({
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
})

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

  // Mock data for NFTs
  const mockNFTs = [
    {
      id: "nft-1",
      name: "Banana Boarder",
      image: "/skateboarding-monkey.png",
      collection: "Prime Mates Board Club",
      rarity: "rare",
      stakingRewards: 25,
      stakingPeriod: 7,
    },
    {
      id: "nft-2",
      name: "Wave Rider",
      image: "/surfing-monkey.png",
      collection: "Prime Mates Board Club",
      rarity: "epic",
      stakingRewards: 50,
      stakingPeriod: 14,
    },
    {
      id: "nft-3",
      name: "Powder Monkey",
      image: "/snowboarding-monkey.png",
      collection: "Prime Mates Board Club",
      rarity: "legendary",
      stakingRewards: 100,
      stakingPeriod: 30,
    },
    {
      id: "nft-4",
      name: "Community Champion",
      image: "/crowned-golden-primate.png",
      collection: "Prime Mates Community",
      rarity: "legendary",
      stakingRewards: 150,
      stakingPeriod: 14,
    },
    {
      id: "nft-5",
      name: "Digital Pathfinder",
      image: "/digital-pathfinders.png",
      collection: "Prime Mates Community",
      rarity: "epic",
      stakingRewards: 75,
      stakingPeriod: 7,
    },
  ]

  // Mock data for staked NFTs
  const mockStakedNFTs = [
    {
      id: "staked-1",
      name: "Happy Monkey",
      image: "/happy-monkey-portrait.png",
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
      name: "Digital Flow",
      image: "/digital-event-flow.png",
      collection: "Prime Mates Community",
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
    const savedConnection = localStorage.getItem("walletConnected")
    if (savedConnection === "true") {
      setIsConnected(true)
      setAddress("0x1234...5678")
      setBalance(250)
      setOwnedNFTs(mockNFTs)
      setStakedNFTs(mockStakedNFTs)
      setStakingRewards(200)
      setHasAccess(true)
    }
  }, [])

  // Connect wallet function - now always simulates a successful connection
  const connectWallet = async () => {
    try {
      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Always simulate a successful connection
      setIsConnected(true)
      setAddress("0x1234...5678")
      setBalance(250)
      setOwnedNFTs(mockNFTs)
      setStakedNFTs(mockStakedNFTs)
      setStakingRewards(200)
      setHasAccess(true)
      localStorage.setItem("walletConnected", "true")

      return true
    } catch (error) {
      console.error("Error connecting wallet:", error)
      return false
    }
  }

  // Verify NFT ownership
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
    setIsConnected(false)
    setAddress(null)
    setBalance(0)
    setOwnedNFTs([])
    setStakedNFTs([])
    setStakingRewards(0)
    setHasAccess(false)
    localStorage.removeItem("walletConnected")
  }

  return (
    <Web3Context.Provider
      value={{
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
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
