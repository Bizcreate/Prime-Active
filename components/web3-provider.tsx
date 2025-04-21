"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Web3ContextType {
  isConnected: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  address: string | null
  balance: number
  ownedNFTs: any[]
}

const Web3Context = createContext<Web3ContextType>({
  isConnected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  address: null,
  balance: 0,
  ownedNFTs: [],
})

export const useWeb3 = () => useContext(Web3Context)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [ownedNFTs, setOwnedNFTs] = useState<any[]>([])

  // Mock data for NFTs
  const mockNFTs = [
    {
      id: "nft-1",
      name: "Banana Boarder",
      image: "/skateboarding-monkey.png",
      collection: "Prime Mates Board Club",
      rarity: "rare",
    },
    {
      id: "nft-2",
      name: "Wave Rider",
      image: "/surfing-monkey.png",
      collection: "Prime Mates Board Club",
      rarity: "epic",
    },
    {
      id: "nft-3",
      name: "Powder Monkey",
      image: "/snowboarding-monkey.png",
      collection: "Prime Mates Board Club",
      rarity: "legendary",
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
    }
  }, [])

  // Connect wallet function
  const connectWallet = async () => {
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsConnected(true)
    setAddress("0x1234...5678")
    setBalance(250)
    setOwnedNFTs(mockNFTs)
    localStorage.setItem("walletConnected", "true")
  }

  // Disconnect wallet function
  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance(0)
    setOwnedNFTs([])
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
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
