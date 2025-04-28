import { merchandiseWearService, type ConnectedMerchandise } from "./merchandise-wear-service"
import { NFTMintingService, type NFTMetadata } from "./nft-minting-service"

/**
 * Service to synchronize merchandise between store, wallet and merch pages
 */
class MerchandiseSyncService {
  // Add merchandise to both wear service and NFT service for wallet display
  syncMerchandiseAfterPurchase(cartItems: any[]): {
    merchandise: ConnectedMerchandise[]
    nfts: NFTMetadata[]
    lastMerchandiseId?: string
    lastNftId?: string
  } {
    const addedMerchandise: ConnectedMerchandise[] = []
    const addedNfts: NFTMetadata[] = []
    let lastMerchandiseId: string | undefined
    let lastNftId: string | undefined

    // Filter for NFC/NFT items
    const nfcItems = cartItems.filter(
      (item) =>
        item.hasNFC || (item.merchandiseType && (item.merchandiseType === "nfc" || item.merchandiseType === "nfc+nft")),
    )

    if (nfcItems.length > 0) {
      for (const item of nfcItems) {
        const hasNFT = item.hasNFT || item.merchandiseType === "nfc+nft"
        const merchId = `merch-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        let nftId: string | undefined

        // Create merchandise item for wear tracking
        const newMerchandiseItem: ConnectedMerchandise = {
          id: merchId,
          productName: item.name,
          productId: item.productId || `product-${Date.now()}`,
          image: item.image,
          dateConnected: new Date().toISOString(),
          lastWorn: null,
          totalWearTime: 0,
          tokenRewards: 0,
          isCurrentlyWorn: false,
          wearingSince: null,
          hasNFC: true,
          hasNFT: hasNFT,
          type: item.merchandiseType || "nfc",
          wearCount: 0,
        }

        // Add to merchandise service
        merchandiseWearService.addMerchandise(newMerchandiseItem)
        addedMerchandise.push(newMerchandiseItem)
        lastMerchandiseId = newMerchandiseItem.id

        // Create NFT for wallet if it's an NFT item
        if (hasNFT) {
          const nftMetadata: NFTMetadata = {
            name: item.name,
            description: `NFT for ${item.name}`,
            image: item.image,
            attributes: [
              { trait_type: "Product Type", value: "Merchandise" },
              { trait_type: "Product ID", value: item.productId || "unknown" },
              { trait_type: "Purchase Date", value: new Date().toISOString() },
              { trait_type: "Merchandise ID", value: merchId },
            ],
            owner: "0x1234567890123456789012345678901234567890", // Mock owner address
            collection: "Prime Mates Merchandise",
            rarity: "common",
          }

          // Mint the NFT to the user's wallet
          const mintedNFT = NFTMintingService.mintNFT(nftMetadata)
          if (mintedNFT) {
            addedNfts.push(mintedNFT)
            lastNftId = mintedNFT.id
            nftId = mintedNFT.id

            // Update merchandise with NFT ID for linking
            newMerchandiseItem.linkedNftId = nftId
            merchandiseWearService.updateMerchandise(newMerchandiseItem)
          }
        }
      }
    }

    return {
      merchandise: addedMerchandise,
      nfts: addedNfts,
      lastMerchandiseId,
      lastNftId,
    }
  }
}

// Create a singleton instance
export const merchandiseSyncService = new MerchandiseSyncService()
