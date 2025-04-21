"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, Info, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { NFTCard } from "@/components/nft-card"
import { generateRandomNFTImage } from "@/lib/utils"

export default function SellNFTPage() {
  const router = useRouter()
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null)
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("7")

  // Mock user's NFT collection
  const userNFTs = [
    {
      id: "user-nft-1",
      name: "Step Master",
      image: generateRandomNFTImage(1),
      rarity: "rare" as const,
      activity: "Walking",
    },
    {
      id: "user-nft-2",
      name: "Skate Legend",
      image: generateRandomNFTImage(2),
      rarity: "epic" as const,
      activity: "Skateboarding",
    },
    {
      id: "user-nft-3",
      name: "Morning Runner",
      image: generateRandomNFTImage(3),
      rarity: "rare" as const,
      activity: "Running",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedNFT || !price) {
      alert("Please select an NFT and set a price")
      return
    }

    // In a real app, this would create a listing on the marketplace
    alert(`NFT listed for ${price} PLAY tokens for ${duration} days`)
    router.push("/marketplace")
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
          <h1 className="text-xl font-bold">Sell NFT</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-3">Select NFT to Sell</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {userNFTs.map((nft) => (
                <div
                  key={nft.id}
                  className={`cursor-pointer relative ${selectedNFT === nft.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedNFT(nft.id)}
                >
                  <NFTCard id={nft.id} name={nft.name} image={nft.image} rarity={nft.rarity} activity={nft.activity} />
                  {selectedNFT === nft.id && (
                    <div className="absolute top-2 right-2 bg-primary text-black rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              <div className="bg-zinc-900 border border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center p-4 aspect-square">
                <Upload className="h-8 w-8 text-zinc-500 mb-2" />
                <p className="text-sm text-zinc-500">Import NFT</p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2">
              Price ($ACTIVE tokens)
            </label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price in $ACTIVE tokens"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-zinc-900 border-zinc-800"
              required
            />
            <p className="text-xs text-zinc-500 mt-1">
              Approximate value: ${price ? (Number.parseInt(price) * 0.2).toFixed(2) : "0.00"} USD
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Describe your NFT to potential buyers"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-900 border-zinc-800 min-h-[100px]"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium mb-2">
              Listing Duration
            </label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-zinc-900 rounded-lg p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">Listing Fee</p>
              <p className="text-xs text-zinc-400">
                A 2.5% fee will be charged when your NFT sells. You'll receive{" "}
                {price ? Number.parseInt(price) * 0.975 : 0} PLAY tokens after the sale.
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full">
            List NFT for Sale
          </Button>
        </form>
      </div>
    </main>
  )
}
