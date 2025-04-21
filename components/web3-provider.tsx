"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { ethers } from "ethers"

// NFT Collection Addresses
const PRIME_MATES_ADDRESS = "0x12662b6a2a424a0090b7D09401fB775A9b968898"
const PRIME_TO_THE_BONE_ADDRESS = "0x72BCdE3C41c4Afa153F8E7849a9Cf64E2CC84E75"

// ABI for ERC721 (NFT) interface - minimal version for balanceOf and tokenOfOwnerByIndex
const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
]

interface NFT {
  collection: string
  tokenId: string
  image?: string
  name?: string
}

interface Web3ContextType {
  address: string | null
  balance: string
  isConnected: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  verifyNFTOwnership: () => Promise<void>
  ownedNFTs: NFT[]
  isVerifying: boolean
  points: number
  hasAccess: boolean
}

const Web3Context = createContext<Web3ContextType>({
  address: null,
  balance: "0",
  isConnected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  verifyNFTOwnership: async () => {},
  ownedNFTs: [],
  isVerifying: false,
  points: 0,
  hasAccess: false,
})

export const useWeb3 = () => useContext(Web3Context)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0")
  const [isConnected, setIsConnected] = useState(false)
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([])
  const [isVerifying, setIsVerifying] = useState(false)
  const [points, setPoints] = useState(0)
  const [hasAccess, setHasAccess] = useState(false)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)

  // Initialize provider when component mounts
  useEffect(() => {
    // Check if window is defined (browser environment)
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const ethersProvider = new ethers.providers.Web3Provider(window.ethereum as any)
        setProvider(ethersProvider)
      } catch (error) {
        console.error("Error initializing provider:", error)
      }
    }
  }, [])

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (provider) {
        try {
          const accounts = await provider.listAccounts()
          if (accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)

            // Get balance
            const balanceWei = await provider.getBalance(accounts[0])
            const balanceEth = ethers.utils.formatEther(balanceWei)
            setBalance(Number.parseFloat(balanceEth).toFixed(4))

            // Verify NFT ownership
            await verifyNFTOwnership()
          }
        } catch (error) {
          console.error("Error checking connection:", error)
        }
      }
    }

    const savedAddress = localStorage.getItem("walletAddress")
    const walletConnected = localStorage.getItem("walletConnected") === "true"

    if (savedAddress && walletConnected) {
      setAddress(savedAddress)
      setIsConnected(true)

      // For demo purposes, set mock data
      setBalance("1.245")

      // Mock NFT data for demo
      const mockNFTs = [
        {
          collection: "Prime Mates Board Club",
          tokenId: "1234",
          image: `/placeholder.svg?height=300&width=300&query=prime+mates+nft+1234`,
          name: `Prime Mate #1234`,
        },
        {
          collection: "Prime To The Bone",
          tokenId: "5678",
          image: `/placeholder.svg?height=300&width=300&query=prime+to+the+bone+nft+5678`,
          name: `Prime Bone #5678`,
        },
      ]
      setOwnedNFTs(mockNFTs)
      setPoints(250) // 100 + 150
      setHasAccess(true)
    }

    if (provider && isConnected && !ownedNFTs.length) {
      checkConnection()
    }
  }, [provider, isConnected])

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        // For demo purposes, we'll use a mock implementation
        const mockAddress = "0x71C...93E4"
        setAddress(mockAddress)
        setIsConnected(true)
        setBalance("1.245")

        // Store in localStorage for persistence
        localStorage.setItem("walletConnected", "true")
        localStorage.setItem("walletAddress", mockAddress)

        // Mock NFT verification
        setTimeout(() => {
          const mockNFTs = [
            {
              collection: "Prime Mates Board Club",
              tokenId: "1234",
              image: `/placeholder.svg?height=300&width=300&query=prime+mates+nft+1234`,
              name: `Prime Mate #1234`,
            },
            {
              collection: "Prime To The Bone",
              tokenId: "5678",
              image: `/placeholder.svg?height=300&width=300&query=prime+to+the+bone+nft+5678`,
              name: `Prime Bone #5678`,
            },
          ]
          setOwnedNFTs(mockNFTs)
          setPoints(250) // 100 + 150
          setHasAccess(true)
        }, 1500)

        return true
      } catch (error) {
        console.error("Error connecting wallet:", error)
      }
    } else {
      console.error("Ethereum provider not available")

      // For demo purposes, we'll use a mock implementation
      const mockAddress = "0x71C...93E4"
      setAddress(mockAddress)
      setIsConnected(true)
      setBalance("1.245")

      // Store in localStorage for persistence
      localStorage.setItem("walletConnected", "true")
      localStorage.setItem("walletAddress", mockAddress)

      // Mock NFT verification
      setTimeout(() => {
        const mockNFTs = [
          {
            collection: "Prime Mates Board Club",
            tokenId: "1234",
            image: `/placeholder.svg?height=300&width=300&query=prime+mates+nft+1234`,
            name: `Prime Mate #1234`,
          },
          {
            collection: "Prime To The Bone",
            tokenId: "5678",
            image: `/placeholder.svg?height=300&width=300&query=prime+to+the+bone+nft+5678`,
            name: `Prime Bone #5678`,
          },
        ]
        setOwnedNFTs(mockNFTs)
        setPoints(250) // 100 + 150
        setHasAccess(true)
      }, 1500)
    }
    return false
  }

  const disconnectWallet = () => {
    setAddress(null)
    setBalance("0")
    setIsConnected(false)
    setOwnedNFTs([])
    setPoints(0)
    setHasAccess(false)
    localStorage.removeItem("walletConnected")
    localStorage.removeItem("walletAddress")
  }

  const verifyNFTOwnership = async () => {
    if (!provider && !address) return

    setIsVerifying(true)
    try {
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        const mockNFTs = [
          {
            collection: "Prime Mates Board Club",
            tokenId: "1234",
            image: `/placeholder.svg?height=300&width=300&query=prime+mates+nft+1234`,
            name: `Prime Mate #1234`,
          },
          {
            collection: "Prime To The Bone",
            tokenId: "5678",
            image: `/placeholder.svg?height=300&width=300&query=prime+to+the+bone+nft+5678`,
            name: `Prime Bone #5678`,
          },
        ]
        setOwnedNFTs(mockNFTs)
        setPoints(250) // 100 + 150
        setHasAccess(true)
        setIsVerifying(false)
      }, 1500)
    } catch (error) {
      console.error("Error verifying NFT ownership:", error)
      setIsVerifying(false)
    }
  }

  return (
    <Web3Context.Provider
      value={{
        address,
        balance,
        isConnected,
        connectWallet,
        disconnectWallet,
        verifyNFTOwnership,
        ownedNFTs,
        isVerifying,
        points,
        hasAccess,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
