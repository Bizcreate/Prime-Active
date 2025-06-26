"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MerchandiseTypeSelector } from "@/components/merchandise-type-selector"
import { Slider } from "@/components/ui/slider"
import { ArrowRight, Sparkles, ShoppingBag, Clock, Coins } from "lucide-react"
import Image from "next/image"
import type { MerchandiseType } from "@/components/merchandise-type-selector"

interface PurchaseSimulatorProps {
  className?: string
}

export function PurchaseSimulator({ className }: PurchaseSimulatorProps) {
  const [step, setStep] = useState<"select" | "simulate" | "results">("select")
  const [selectedProduct, setSelectedProduct] = useState<"tshirt" | "hat" | "board">("tshirt")
  const [merchandiseType, setMerchandiseType] = useState<MerchandiseType>("standard")
  const [wearTime, setWearTime] = useState(30) // in days
  const [wearFrequency, setWearFrequency] = useState(3) // times per week

  // Product details
  const products = {
    tshirt: {
      name: "Prime Mates Classic T-Shirt",
      image: "/prime-mates-tshirt.png",
      price: 29.99,
      basePoints: 200,
    },
    hat: {
      name: "Prime Mates Board Club Snapback",
      image: "/prime-mates-snapback.png",
      price: 24.99,
      basePoints: 150,
    },
    board: {
      name: "Prime Mates Banana Board",
      image: "/banana-board.png",
      price: 89.99,
      basePoints: 500,
    },
  }

  const selectedProductDetails = products[selectedProduct]

  // Calculate price based on merchandise type
  const getPrice = (basePrice: number, type: MerchandiseType): number => {
    if (type === "nfc") return basePrice * 1.15
    if (type === "nfc+nft") return basePrice * 1.2
    return basePrice
  }

  // Calculate points based on merchandise type
  const getPoints = (basePoints: number, type: MerchandiseType): number => {
    if (type === "nfc") return basePoints * 2
    if (type === "nfc+nft") return basePoints * 3
    return basePoints
  }

  // Calculate rewards based on wear time and frequency
  const calculateRewards = () => {
    if (merchandiseType === "standard") {
      return {
        tokens: 0,
        points: getPoints(selectedProductDetails.basePoints, merchandiseType),
        wearTimeTracking: false,
        digitalCollectible: false,
      }
    }

    // Calculate tokens earned from wearing (only for NFC and NFC+NFT)
    // Assume 1 token per hour of wear, with average wear time of 4 hours per day
    const daysWorn = (wearTime * wearFrequency) / 7
    const hoursWorn = daysWorn * 4
    const tokensEarned = Math.round(hoursWorn)

    // Bonus tokens for NFT holders
    const nftBonus = merchandiseType === "nfc+nft" ? Math.round(tokensEarned * 0.2) : 0

    return {
      tokens: tokensEarned + nftBonus,
      points: getPoints(selectedProductDetails.basePoints, merchandiseType),
      wearTimeTracking: true,
      digitalCollectible: merchandiseType === "nfc+nft",
    }
  }

  const rewards = calculateRewards()

  // Reset when product changes
  const handleProductChange = (product: "tshirt" | "hat" | "board") => {
    setSelectedProduct(product)
    setMerchandiseType("standard")
  }

  // Go to next step
  const handleNext = () => {
    if (step === "select") setStep("simulate")
    else if (step === "simulate") setStep("results")
    else setStep("select")
  }

  return (
    <Card className={`${className} overflow-hidden`}>
      <CardHeader className="bg-zinc-800">
        <CardTitle>Purchase Simulator</CardTitle>
        <CardDescription>See how different merchandise options affect your rewards</CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {step === "select" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Select a Product</h3>
              <Tabs
                defaultValue={selectedProduct}
                onValueChange={(value) => handleProductChange(value as "tshirt" | "hat" | "board")}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="tshirt">T-Shirt</TabsTrigger>
                  <TabsTrigger value="hat">Hat</TabsTrigger>
                  <TabsTrigger value="board">Board</TabsTrigger>
                </TabsList>

                <div className="bg-zinc-800 rounded-lg p-4 flex items-center">
                  <div className="relative w-20 h-20 mr-4">
                    <Image
                      src={selectedProductDetails.image || "/placeholder.svg"}
                      alt={selectedProductDetails.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedProductDetails.name}</h4>
                    <p className="text-sm text-zinc-400">Base Price: ${selectedProductDetails.price.toFixed(2)}</p>
                    <div className="flex items-center mt-1">
                      <Image src="/shaka-banana-hand.png" alt="Points" width={14} height={14} className="mr-1" />
                      <span className="text-xs text-primary">{selectedProductDetails.basePoints} base points</span>
                    </div>
                  </div>
                </div>
              </Tabs>
            </div>

            <MerchandiseTypeSelector
              onSelect={setMerchandiseType}
              selectedType={merchandiseType}
              productHasNFC={true}
              productPrice={selectedProductDetails.price}
            />
          </div>
        )}

        {step === "simulate" && (
          <div className="space-y-6">
            <div className="bg-zinc-800 rounded-lg p-4 flex items-center">
              <div className="relative w-16 h-16 mr-3">
                <Image
                  src={selectedProductDetails.image || "/placeholder.svg"}
                  alt={selectedProductDetails.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{selectedProductDetails.name}</h4>
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    ${getPrice(selectedProductDetails.price, merchandiseType).toFixed(2)}{" "}
                    <span className="text-zinc-400 text-xs">
                      ({merchandiseType === "standard" ? "Standard" : merchandiseType === "nfc" ? "NFC" : "NFC+NFT"})
                    </span>
                  </p>
                  <div className="flex items-center">
                    <Image src="/shaka-banana-hand.png" alt="Points" width={14} height={14} className="mr-1" />
                    <span className="text-xs text-primary">+{rewards.points} points</span>
                  </div>
                </div>
              </div>
            </div>

            {merchandiseType !== "standard" && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Wear Time (Days)</label>
                    <span className="text-sm">{wearTime} days</span>
                  </div>
                  <Slider
                    value={[wearTime]}
                    min={7}
                    max={365}
                    step={7}
                    onValueChange={(value) => setWearTime(value[0])}
                    className="mb-6"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Wear Frequency (Days per Week)</label>
                    <span className="text-sm">{wearFrequency} days/week</span>
                  </div>
                  <Slider
                    value={[wearFrequency]}
                    min={1}
                    max={7}
                    step={1}
                    onValueChange={(value) => setWearFrequency(value[0])}
                  />
                </div>
              </div>
            )}

            {merchandiseType === "standard" && (
              <div className="bg-zinc-800 rounded-lg p-4 text-center">
                <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-zinc-500" />
                <h4 className="font-medium mb-1">Standard Merchandise</h4>
                <p className="text-sm text-zinc-400">
                  Standard merchandise doesn't include NFC tracking or wear-to-earn features.
                </p>
              </div>
            )}
          </div>
        )}

        {step === "results" && (
          <div className="space-y-6">
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="font-medium mb-3">Simulation Results</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center mr-2">
                      <Image src="/shaka-banana-hand.png" alt="Points" width={16} height={16} />
                    </div>
                    <span>Banana Points</span>
                  </div>
                  <span className="font-bold text-primary">+{rewards.points}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center mr-2">
                      <Coins className="h-4 w-4 text-[#ffc72d]" />
                    </div>
                    <span>Tokens Earned</span>
                  </div>
                  <span className="font-bold text-[#ffc72d]">{rewards.tokens}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center mr-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                    </div>
                    <span>Wear Time Tracking</span>
                  </div>
                  <span className={rewards.wearTimeTracking ? "text-green-500" : "text-red-500"}>
                    {rewards.wearTimeTracking ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center mr-2">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                    </div>
                    <span>Digital Collectible</span>
                  </div>
                  <span className={rewards.digitalCollectible ? "text-green-500" : "text-red-500"}>
                    {rewards.digitalCollectible ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="font-medium mb-3">Value Comparison</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Purchase Price:</span>
                  <span>${getPrice(selectedProductDetails.price, merchandiseType).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Token Value Earned:</span>
                  <span>${(rewards.tokens * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-zinc-700 my-2 pt-2 flex justify-between font-medium">
                  <span>Return on Investment:</span>
                  <span
                    className={
                      rewards.tokens * 0.1 > getPrice(selectedProductDetails.price, merchandiseType) * 0.2
                        ? "text-green-500"
                        : "text-zinc-400"
                    }
                  >
                    {((rewards.tokens * 0.1 * 100) / getPrice(selectedProductDetails.price, merchandiseType)).toFixed(
                      0,
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-zinc-800 px-6 py-4">
        <Button onClick={handleNext} className="w-full">
          {step === "select" && (
            <>
              Continue to Simulation <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
          {step === "simulate" && (
            <>
              View Results <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
          {step === "results" && "Start Over"}
        </Button>
      </CardFooter>
    </Card>
  )
}
