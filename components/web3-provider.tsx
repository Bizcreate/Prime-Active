"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { ethers } from "ethers"

// Define the shape of our Web3 context
interface Web3ContextType {
  provider: ethers.providers.Web3Provider | null
  signer: ethers.Signer | null
  address: string | null
  balance: string
  isConnected: boolean
  connectWallet: () => Promise<boolean>
  disconnectWallet: () => void
  ownedNFTs: NFT[]
  points: number
  hasAccess: boolean
  verifyNFTOwnership: () => Promise<boolean>
}

// NFT interface
interface NFT {
  tokenId: string
  name?: string
  image?: string
  collection: string
}

// Create the context with default values
const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  address: null,
  balance: "0",
  isConnected: false,
  connectWallet: async () => false,
  disconnectWallet: () => {},
  ownedNFTs: [],
  points: 0,
  hasAccess: false,
  verifyNFTOwnership: async () => false,
})

// NFT contract ABI (simplified for verification)
const NFT_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
]

// Contract addresses - replace with your actual contract addresses
const NFT_CONTRACT_ADDRESS = "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e" // Example NFT contract (Doodles)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0")
  const [isConnected, setIsConnected] = useState(false)
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([])
  const [points, setPoints] = useState(0)
  const [hasAccess, setHasAccess] = useState(false)
  const [connectionAttempted, setConnectionAttempted] = useState(false)

  // Initialize provider from window.ethereum if available
  useEffect(() => {
    const initProvider = async () => {
      // Check if we're in a browser environment
      if (typeof window !== "undefined") {
        try {
          // Check if ethereum is available (MetaMask or similar)
          if (window.ethereum) {
            console.log("Ethereum provider detected")

            // Create ethers provider
            const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, "any")
            setProvider(ethersProvider)

            // Check if already connected
            const accounts = await ethersProvider.listAccounts()
            if (accounts.length > 0) {
              const userSigner = ethersProvider.getSigner()
              const userAddress = await userSigner.getAddress()

              setSigner(userSigner)
              setAddress(userAddress)
              setIsConnected(true)

              // Get balance
              const userBalance = await ethersProvider.getBalance(userAddress)
              setBalance(ethers.utils.formatEther(userBalance))

              // Verify NFT ownership
              await verifyNFTOwnership()
            }
          } else {
            console.log("No Ethereum provider detected")
          }
        } catch (error) {
          console.error("Error initializing Web3Provider:", error)
        } finally {
          setConnectionAttempted(true)
        }
      }
    }

    initProvider()
  }, [])

  // Handle account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        console.log("Accounts changed:", accounts)
        if (accounts.length === 0) {
          // User disconnected
          disconnectWallet()
        } else if (accounts[0] !== address) {
          // Account changed
          if (provider) {
            const userSigner = provider.getSigner()
            const userAddress = await userSigner.getAddress()

            setSigner(userSigner)
            setAddress(userAddress)
            setIsConnected(true)

            // Get balance
            const userBalance = await provider.getBalance(userAddress)
            setBalance(ethers.utils.formatEther(userBalance))

            // Verify NFT ownership
            await verifyNFTOwnership()
          }
        }
      }

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [provider, address])

  // Connect wallet function
  const connectWallet = async (): Promise<boolean> => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

        if (accounts.length > 0) {
          // Create ethers provider if not already created
          const ethersProvider = provider || new ethers.providers.Web3Provider(window.ethereum, "any")
          setProvider(ethersProvider)

          const userSigner = ethersProvider.getSigner()
          const userAddress = await userSigner.getAddress()

          setSigner(userSigner)
          setAddress(userAddress)
          setIsConnected(true)

          // Get balance
          const userBalance = await ethersProvider.getBalance(userAddress)
          setBalance(ethers.utils.formatEther(userBalance))

          // Verify NFT ownership
          await verifyNFTOwnership()

          return true
        }
      } else {
        console.error("No Ethereum provider detected")
        alert("Please install MetaMask or another Web3 wallet to connect")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      alert("Error connecting wallet. Please try again.")
    }

    return false
  }

  // Disconnect wallet function
  const disconnectWallet = () => {
    setSigner(null)
    setAddress(null)
    setIsConnected(false)
    setBalance("0")
    setOwnedNFTs([])
    setHasAccess(false)
  }

  // Verify NFT ownership
  const verifyNFTOwnership = async (): Promise<boolean> => {
    if (!provider || !address) return false

    try {
      // Create contract instance
      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider)

      // Get balance of NFTs
      const balance = await nftContract.balanceOf(address)
      const balanceNumber = balance.toNumber()

      console.log(`User owns ${balanceNumber} NFTs`)

      // If user owns at least one NFT, they have access
      if (balanceNumber > 0) {
        setHasAccess(true)

        // Set points based on NFT ownership (example logic)
        setPoints(balanceNumber * 100)

        // Get owned NFTs (up to 10 for performance)
        const nftsToFetch = Math.min(balanceNumber, 10)
        const fetchedNFTs: NFT[] = []

        for (let i = 0; i < nftsToFetch; i++) {
          try {
            const tokenId = await nftContract.tokenOfOwnerByIndex(address, i)

            // For demo purposes, we're not fetching actual metadata
            // In a real app, you would fetch the tokenURI and get metadata
            fetchedNFTs.push({
              tokenId: tokenId.toString(),
              name: `Prime Active NFT #${tokenId}`,
              collection: "Prime Active Collection",
            })
          } catch (err) {
            console.error(`Error fetching NFT at index ${i}:`, err)
          }
        }

        setOwnedNFTs(fetchedNFTs)
        return true
      } else {
        setHasAccess(false)
        setPoints(0)
        setOwnedNFTs([])
        return false
      }
    } catch (error) {
      console.error("Error verifying NFT ownership:", error)
      setHasAccess(false)
      setPoints(0)
      setOwnedNFTs([])
      return false
    }
  }

  // Provide the context value
  const contextValue: Web3ContextType = {
    provider,
    signer,
    address,
    balance,
    isConnected,
    connectWallet,
    disconnectWallet,
    ownedNFTs,
    points,
    hasAccess,
    verifyNFTOwnership,
  }

  return <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
}

// Custom hook to use the Web3 context
export const useWeb3 = () => useContext(Web3Context)

// Add this to make window.ethereum available to TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
