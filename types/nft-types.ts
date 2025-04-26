export interface NFTAttribute {
  trait_type: string
  value: string | number
}

export interface NFTMetadata {
  id: string
  name: string
  description: string
  image: string
  attributes: NFTAttribute[]
  owner: string
  collection: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  createdAt: string
  merchandiseData?: {
    productId: string
    productName: string
    purchaseTransactionId: string
    nfcId?: string
  }
}
