"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

// Define the shape of our Web3 context
interface Web3ContextType {
  address: string | undefined
  balance: string
  isConnected: boolean
  connectWallet: () => Promise<boolean>
  disconnectWallet: () => void
  ownedNFTs: any[]
  points: number
  hasAccess: boolean
  verifyNFTOwnership: () => Promise<boolean>
  isVerifying: boolean
}

// Create the context with default values
const Web3Context = createContext<Web3ContextType>({
  address: undefined,
  balance: "0",
  isConnected: false,
  connectWallet: async () => false,
  disconnectWallet: () => {},
  ownedNFTs: [],
  points: 0,
  hasAccess: false,
  verifyNFTOwnership: async () => false,
  isVerifying: false,
})

// Custom hook to use the Web3 context
export const useWeb3 = () => useContext(Web3Context)

// Main provider that implements a simplified wallet connection
export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [balance, setBalance] = useState("1250.00")
  const [isConnected, setIsConnected] = useState(false)
  const [ownedNFTs, setOwnedNFTs] = useState<any[]>([])
  const [points, setPoints] = useState(0)
  const [hasAccess, setHasAccess] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  // Mock NFT data
  const mockNFTs = [
    {
      tokenId: "1",
      name: "Prime Active Runner",
      image: "/abstract-digital-art.png",
      collection: "Prime Active Collection",
    },
    {
      tokenId: "2",
      name: "Prime Active Skater",
      image: "/abstract-nft-duo.png",
      collection: "Prime Active Collection",
    },
  ]

  // Connect wallet function - simplified for preview
  const connectWallet = async (): Promise<boolean> => {
    try {
      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Set mock address
      setAddress("0x1234...5678")
      setIsConnected(true)

      // Verify NFT ownership automatically
      await verifyNFTOwnership()

      return true
    } catch (error) {
      console.error("Error connecting wallet:", error)
      return false
    }
  }

  // Disconnect wallet function
  const disconnectWallet = () => {
    setAddress(undefined)
    setIsConnected(false)
    setOwnedNFTs([])
    setHasAccess(false)
    setPoints(0)
  }

  // Verify NFT ownership - simplified for preview
  const verifyNFTOwnership = async (): Promise<boolean> => {
    try {
      setIsVerifying(true)

      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Set mock NFTs and points
      setOwnedNFTs(mockNFTs)
      setHasAccess(true)
      setPoints(250)

      return true
    } catch (error) {
      console.error("Error verifying NFT ownership:", error)
      return false
    } finally {
      setIsVerifying(false)
    }
  }

  // Provide the context value
  const contextValue: Web3ContextType = {
    address,
    balance,
    isConnected,
    connectWallet,
    disconnectWallet,
    ownedNFTs,
    points,
    hasAccess,
    verifyNFTOwnership,
    isVerifying,
  }

  return <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
}
