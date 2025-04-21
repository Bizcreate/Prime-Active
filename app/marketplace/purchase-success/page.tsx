"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Share2 } from "lucide-react"
import Link from "next/link"
import { generateRandomNFTImage } from "@/lib/utils"
import Image from "next/image"

export default function PurchaseSuccessPage() {
  // Mock purchased NFT data
  const nft = {
    id: "purchased-nft",
    name: "Ultra Runner",
    image: generateRandomNFTImage(10),
    rarity: "legendary",
    activity: "Running",
    transactionHash: "0x71C7...93E4",
  }

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md mx-auto text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Purchase Successful!</h1>
            <p className="text-zinc-400">
              Congratulations! You've successfully purchased the {nft.name} NFT. It has been added to your collection.
            </p>
          </div>

          <div className="relative aspect-square w-64 mx-auto rounded-lg overflow-hidden mb-6">
            <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
            <div
              className={`absolute top-4 right-4 ${
                nft.rarity === "legendary"
                  ? "bg-primary"
                  : nft.rarity === "epic"
                    ? "bg-purple-600"
                    : nft.rarity === "rare"
                      ? "bg-blue-600"
                      : "bg-green-600"
              } text-black text-xs px-2 py-1 rounded-full font-medium`}
            >
              {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-4 mb-6 text-left">
            <h2 className="font-bold mb-2">{nft.name}</h2>
            <p className="text-sm text-zinc-400 mb-2">{nft.activity} NFT</p>
            <div className="flex justify-between items-center">
              <p className="text-xs text-zinc-500">Transaction Hash</p>
              <p className="text-xs text-zinc-300">{nft.transactionHash}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full" asChild>
              <Link href="/wallet">
                View in My Collection <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>

            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>

            <Button variant="ghost" className="w-full" asChild>
              <Link href="/marketplace">Back to Marketplace</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
