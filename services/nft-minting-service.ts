// Types for NFT minting
export type MerchandiseType = "standard" | "nfc" | "nfc+nft"

export interface MintingRequest {
  productId: string
  productName: string
  productImage: string
  recipientAddress: string
  merchandiseType: MerchandiseType
  transactionId: string
  nfcId?: string
}

export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: {
    trait_type: string
    value: string
  }[]
  owner?: string // Add owner field to NFTMetadata
}

export interface MintingResult {
  success: boolean
  tokenId?: string
  transactionHash?: string
  nftMetadata?: NFTMetadata
  errorMessage?: string
}

// Mock NFT Minting Service
export class NFTMintingService {
  private static mintingRequests: Map<string, MintingRequest> = new Map()
  private static mintedNFTs: { [tokenId: string]: NFTMetadata } = {} // Store minted NFTs

  // Create a minting request and return a request ID
  static createMintingRequest(request: MintingRequest): string {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    this.mintingRequests.set(requestId, request)
    return requestId
  }

  // Process a minting request and return the result
  static async processMintingRequest(requestId: string): Promise<MintingResult> {
    const request = this.mintingRequests.get(requestId)

    if (!request) {
      return {
        success: false,
        errorMessage: "Minting request not found",
      }
    }

    // Simulate minting delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Simulate minting success (95% success rate)
    const success = Math.random() < 0.95

    if (success) {
      const tokenId = `${Math.floor(Math.random() * 1000000)}`
      const transactionHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(
        "",
      )}`

      // Create NFT metadata
      const nftMetadata: NFTMetadata = {
        name: `${request.productName} #${tokenId}`,
        description: `Digital collectible representing your ${request.productName} purchase.`,
        image: request.productImage,
        attributes: [
          {
            trait_type: "Product",
            value: request.productName,
          },
          {
            trait_type: "Type",
            value: "Physical Merchandise",
          },
          {
            trait_type: "Collection",
            value: "Prime Mates",
          },
          {
            trait_type: "Purchase Date",
            value: new Date().toISOString().split("T")[0],
          },
        ],
        owner: request.recipientAddress, // Set the owner of the NFT
      }

      // Store the minted NFT
      this.mintedNFTs[tokenId] = nftMetadata

      return {
        success: true,
        tokenId,
        transactionHash,
        nftMetadata,
      }
    } else {
      return {
        success: false,
        errorMessage: "Failed to mint NFT. The blockchain transaction was rejected.",
      }
    }
  }

  // Make sure the getMintedNFTsByOwner function is properly implemented
  // This function should return NFTs owned by a specific address

  // Update the class to ensure the function exists and works correctly
  static getMintedNFTsByOwner(ownerAddress: string): NFTMetadata[] {
    return Object.values(this.mintedNFTs).filter((nft) => nft.owner === ownerAddress)
  }
}
