import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { NFTMetadata } from "@/services/nft-minting-service"

interface MerchandiseNFTCardProps {
  nft: NFTMetadata & {
    id?: string
    rarity?: string
    collection?: string
  }
}

export function MerchandiseNFTCard({ nft }: MerchandiseNFTCardProps) {
  // Extract product name from NFT name (remove the #number part)
  const productName = nft.name.split("#")[0].trim()

  // Get rarity color
  const getRarityColor = (rarity = "common") => {
    switch (rarity.toLowerCase()) {
      case "rare":
        return "bg-blue-500"
      case "epic":
        return "bg-purple-500"
      case "legendary":
        return "bg-amber-500"
      default:
        return "bg-green-500"
    }
  }

  return (
    <Link href={`/nft/${nft.id}`}>
      <Card className="overflow-hidden bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all">
        <div className="relative aspect-square">
          <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
          <Badge className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)}`}>{nft.rarity || "Common"}</Badge>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-sm truncate">{productName}</h3>
          <p className="text-xs text-zinc-400 truncate">{nft.collection || "Prime Mates"}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
