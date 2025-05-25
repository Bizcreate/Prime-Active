export interface NFT {
  id: string
  name: string
  image: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  tokenId: string
  collection: string
  stakingAPY?: number
  isStaked?: boolean
  stakedSince?: string
  earnedRewards?: number
}

// Contract address for Prime Mates Board Club
export const PMBC_CONTRACT_ADDRESS = "0x12662b6a2a424a0090b7D09401fB775A9b968898"

// Demo NFT data
const DEMO_NFTS: NFT[] = [
  {
    id: "nft-1",
    name: "PMBC #420",
    image: "/pmbc-crown-surfer.png",
    rarity: "rare",
    tokenId: "420",
    collection: "Prime Mates Board Club",
    stakingAPY: 12.5,
    isStaked: true,
    stakedSince: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    earnedRewards: 45,
  },
  {
    id: "nft-2",
    name: "PMBC #721",
    image: "/pmbc-mustache-skater.png",
    rarity: "epic",
    tokenId: "721",
    collection: "Prime Mates Board Club",
    stakingAPY: 18.2,
    isStaked: false,
    stakedSince: null,
    earnedRewards: 0,
  },
  {
    id: "nft-3",
    name: "PMBC #1337",
    image: "/pmbc-gasmask-skater.png",
    rarity: "legendary",
    tokenId: "1337",
    collection: "Prime Mates Board Club",
    stakingAPY: 25.0,
    isStaked: true,
    stakedSince: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    earnedRewards: 75,
  },
  {
    id: "nft-4",
    name: "PMBC #888",
    image: "/pmbc-glasses-snowboarder.png",
    rarity: "legendary",
    tokenId: "888",
    collection: "Prime Mates Board Club",
    stakingAPY: 25.0,
    isStaked: false,
    stakedSince: null,
    earnedRewards: 0,
  },
]

// Local storage key
const NFT_STORAGE_KEY = "prime_active_nfts"

class NFTService {
  private nfts: NFT[] = []

  constructor() {
    this.loadFromStorage()
  }

  // Load data from storage or initialize with demo data
  private loadFromStorage() {
    try {
      if (typeof window !== "undefined") {
        const storedNFTs = localStorage.getItem(NFT_STORAGE_KEY)

        if (storedNFTs) {
          this.nfts = JSON.parse(storedNFTs)
        } else {
          // Initialize with demo data if nothing in storage
          this.nfts = [...DEMO_NFTS]
          this.saveToStorage()
        }
      }
    } catch (error) {
      console.error("Error loading NFT data:", error)
      // Fallback to demo data on error
      this.nfts = [...DEMO_NFTS]
      this.saveToStorage()
    }
  }

  // Save data to storage
  private saveToStorage() {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(NFT_STORAGE_KEY, JSON.stringify(this.nfts))
      }
    } catch (error) {
      console.error("Error saving NFT data:", error)
    }
  }

  // Get all NFTs
  getAllNFTs(): NFT[] {
    return [...this.nfts]
  }

  // Get staked NFTs
  getStakedNFTs(): NFT[] {
    return this.nfts.filter((nft) => nft.isStaked)
  }

  // Get unstaked NFTs
  getUnstakedNFTs(): NFT[] {
    return this.nfts.filter((nft) => !nft.isStaked)
  }

  // Get NFT by ID
  getNFTById(id: string): NFT | undefined {
    return this.nfts.find((nft) => nft.id === id)
  }

  // Stake an NFT
  stakeNFT(id: string): void {
    const nftIndex = this.nfts.findIndex((nft) => nft.id === id)

    if (nftIndex === -1) {
      throw new Error(`NFT with ID ${id} not found`)
    }

    this.nfts[nftIndex] = {
      ...this.nfts[nftIndex],
      isStaked: true,
      stakedSince: new Date().toISOString(),
      earnedRewards: 0,
    }

    this.saveToStorage()
  }

  // Unstake an NFT
  unstakeNFT(id: string): number {
    const nftIndex = this.nfts.findIndex((nft) => nft.id === id)

    if (nftIndex === -1) {
      throw new Error(`NFT with ID ${id} not found`)
    }

    const nft = this.nfts[nftIndex]

    if (!nft.isStaked) {
      return 0 // Already unstaked
    }

    // Calculate rewards
    const rewards = nft.earnedRewards || 0

    this.nfts[nftIndex] = {
      ...this.nfts[nftIndex],
      isStaked: false,
      stakedSince: null,
      earnedRewards: 0,
    }

    this.saveToStorage()
    return rewards
  }

  // Calculate total staking rewards
  getTotalStakingRewards(): number {
    return this.nfts.reduce((total, nft) => total + (nft.earnedRewards || 0), 0)
  }

  // Update staking rewards
  updateStakingRewards(): void {
    const now = Date.now()
    let updated = false

    this.nfts.forEach((nft, index) => {
      if (nft.isStaked && nft.stakedSince) {
        const stakedTime = new Date(nft.stakedSince).getTime()
        const stakedDays = (now - stakedTime) / (24 * 60 * 60 * 1000)

        // Calculate rewards based on APY
        // APY is annual, so divide by 365 to get daily rate
        const dailyRate = (nft.stakingAPY || 0) / 365
        const rewards = Math.floor(stakedDays * dailyRate)

        if (rewards > (nft.earnedRewards || 0)) {
          this.nfts[index].earnedRewards = rewards
          updated = true
        }
      }
    })

    if (updated) {
      this.saveToStorage()
    }
  }

  // Add a new NFT
  addNFT(nft: NFT): void {
    // Check if NFT already exists
    const existingIndex = this.nfts.findIndex((n) => n.id === nft.id)

    if (existingIndex >= 0) {
      // Update existing NFT
      this.nfts[existingIndex] = { ...nft }
    } else {
      // Add new NFT
      this.nfts.push({ ...nft })
    }

    this.saveToStorage()
  }

  // Remove an NFT
  removeNFT(id: string): void {
    this.nfts = this.nfts.filter((nft) => nft.id !== id)
    this.saveToStorage()
  }

  // Reset all data (for testing)
  resetAll(): void {
    this.nfts = [...DEMO_NFTS]
    this.saveToStorage()
  }
}

// Create and export a singleton instance
export const nftService = new NFTService()
