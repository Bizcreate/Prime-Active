"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Award, Wallet, ExternalLink, Heart, Share2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { generateRandomNFTImage } from "@/lib/utils"
import { useWeb3 } from "@/components/web3-provider"
import Image from "next/image"

export default function NFTDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const { balance } = useWeb3()
  const [liked, setLiked] = useState(false)

  // Mock NFT data - in a real app, this would be fetched from an API
  const nft = {
    id: id as string,
    name: "Ultra Runner",
    image: generateRandomNFTImage(Number.parseInt(id as string, 10) || 10),
    price: "1500",
    rarity: "legendary",
    activity: "Running",
    seller: "0x71C...93E4",
    description:
      "This legendary NFT is awarded to elite runners who have completed multiple marathons. It grants special access to premium running events and exclusive in-app features.",
    attributes: [
      { trait: "Speed", value: "Elite" },
      { trait: "Endurance", value: "Exceptional" },
      { trait: "Style", value: "Professional" },
      { trait: "Rarity", value: "Legendary" },
    ],
    tokenId: "1234",
    contractAddress: "0x1234...5678",
    blockchain: "Ethereum",
    createdAt: "2023-04-15",
  }

  const handlePurchase = () => {
    // In a real app, this would trigger a blockchain transaction
    alert(`Purchase initiated for ${nft.name} at ${nft.price} $ACTIVE tokens`)
    // After successful purchase
    router.push("/marketplace/purchase-success")
  }

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/marketplace">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">NFT Details</h1>
        </div>

        <div className="mb-6">
          <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
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

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{nft.name}</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setLiked(!liked)}>
                <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{nft.activity} NFT</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-zinc-400" />
                <span className="text-xs text-zinc-400">Listed {nft.createdAt}</span>
              </div>
            </div>

            <p className="text-sm text-zinc-300 mb-4">{nft.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {nft.attributes.map((attr, index) => (
                <div key={index} className="bg-zinc-800 p-2 rounded-md">
                  <p className="text-xs text-zinc-400">{attr.trait}</p>
                  <p className="text-sm font-medium">{attr.value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400">Seller</p>
                <p className="text-sm">{nft.seller}</p>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                View on Etherscan
              </Button>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-zinc-400">Current Price</p>
              <div className="flex items-center gap-1">
                <Wallet className="h-4 w-4 text-zinc-400" />
                <p className="text-sm text-zinc-400">Your Balance: {balance} PLAY</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold">
                {nft.price} <span className="text-primary">$ACTIVE</span>
              </p>
              <p className="text-sm text-zinc-400">≈ ${(Number.parseInt(nft.price) * 0.2).toFixed(2)} USD</p>
            </div>
          </div>

          <Button className="w-full py-6" onClick={handlePurchase}>
            Purchase NFT
          </Button>
        </div>
      </div>
    </main>
  )
}
