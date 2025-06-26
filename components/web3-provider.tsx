"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { nftService } from "@/services/nft-service"

interface Web3ContextType {
  isConnected: boolean
  address: string | null
  balance: number
  stakingRewards: number
  stakedNFTs: number
  connect: () => Promise<void>
  disconnect: () => void
}

const Web3Context = createContext<Web3ContextType>({
  isConnected: false,
  address: null,
  balance: 0,
  stakingRewards: 0,
  stakedNFTs: 0,
  connect: async () => {},
  disconnect: () => {},
})

export const useWeb3 = () => useContext(Web3Context)

interface Web3ProviderProps {
  children: ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [stakingRewards, setStakingRewards] = useState(0)
  const [stakedNFTs, setStakedNFTs] = useState(0)

  // Load wallet state from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedIsConnected = localStorage.getItem("wallet_connected")

        if (storedIsConnected === "true") {
          setIsConnected(true)
          setAddress("0x1234...5678")
          setBalance(250)

          // Update staking data
          nftService.updateStakingRewards()
          const staked = nftService.getStakedNFTs()
          setStakedNFTs(staked.length)

          const rewards = nftService.getTotalStakingRewards()
          setStakingRewards(rewards)
        }
      }
    } catch (error) {
      console.error("Error loading wallet state:", error)
    }
  }, [])

  // Connect wallet
  const connect = async (): Promise<void> => {
    try {
      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsConnected(true)
      setAddress("0x1234...5678")
      setBalance(250)

      // Update staking data
      nftService.updateStakingRewards()
      const staked = nftService.getStakedNFTs()
      setStakedNFTs(staked.length)

      const rewards = nftService.getTotalStakingRewards()
      setStakingRewards(rewards)

      // Save connection state
      if (typeof window !== "undefined") {
        localStorage.setItem("wallet_connected", "true")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      throw error
    }
  }

  // Disconnect wallet
  const disconnect = (): void => {
    setIsConnected(false)
    setAddress(null)
    setBalance(0)
    setStakingRewards(0)
    setStakedNFTs(0)

    // Clear connection state
    if (typeof window !== "undefined") {
      localStorage.removeItem("wallet_connected")
    }
  }

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        address,
        balance,
        stakingRewards,
        stakedNFTs,
        connect,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
