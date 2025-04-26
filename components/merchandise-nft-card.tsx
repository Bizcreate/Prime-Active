import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { NFTMetadata } from "@/types/nft-types"
import Link from "next/link"

interface MerchandiseNFTCardProps {
  nft: NFTMetadata
}

export function MerchandiseNFTCard({ nft }: MerchandiseNFTCardProps) {
  return (
    <Link href={`/merchandise/${nft.id}`}>
      <Card className="overflow-hidden bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all">
        <div className="relative aspect-square">
          <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
          <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">
            <Image src="/prime-mates-logo.png" alt="Prime Mates" width={40} height={20} className="object-contain" />
          </div>
          <Badge
            className={`absolute top-2 right-2 ${
              nft?.rarity === "legendary"
                ? "bg-[#ffc72d] text-black"
                : nft?.rarity === "rare"
                  ? "bg-blue-600"
                  : nft?.rarity === "uncommon"
                    ? "bg-green-600"
                    : "bg-zinc-600"
            }`}
          >
            {nft?.rarity ? nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1) : "Common"}
          </Badge>
          <Badge className="absolute bottom-2 left-2 bg-[#ffc72d] text-black">Merchandise</Badge>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-sm truncate">{nft.name}</h3>
          <p className="text-xs text-zinc-400 truncate">{nft.collection}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
