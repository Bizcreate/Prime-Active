"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, ArrowRightLeft, Info, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function TokenConversionPage() {
  const [fromAmount, setFromAmount] = useState("")
  const [fromToken, setFromToken] = useState("banana")
  const [toToken, setToToken] = useState("shaka")
  const [isConverting, setIsConverting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Conversion rates
  const conversionRates = {
    banana: {
      shaka: 0.5, // 2 banana points = 1 shaka token
    },
    shaka: {
      banana: 2, // 1 shaka token = 2 banana points
    },
  }

  // Calculate conversion
  const calculateConversion = () => {
    if (!fromAmount) return "0"
    const amount = Number.parseFloat(fromAmount)
    if (isNaN(amount)) return "0"

    const rate =
      conversionRates[fromToken as keyof typeof conversionRates][
        toToken as keyof (typeof conversionRates)[typeof fromToken]
      ]
    return (amount * rate).toFixed(2)
  }

  // Handle token swap
  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount("")
  }

  // Handle conversion
  const handleConvert = () => {
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) return

    setIsConverting(true)

    // Simulate conversion process
    setTimeout(() => {
      setIsConverting(false)
      setShowSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        setFromAmount("")
      }, 3000)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/wallet">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Convert Tokens</h1>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Token Conversion</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Info className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">From</label>
                <div className="flex gap-3">
                  <div className="flex-1 bg-zinc-800 rounded-lg p-3 flex items-center">
                    <Image
                      src={fromToken === "banana" ? "/banana-icon.png" : "/shaka-coin.png"}
                      alt={fromToken}
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={fromAmount}
                        onChange={(e) => setFromAmount(e.target.value)}
                        placeholder="0.00"
                        className="border-0 bg-transparent p-0 focus-visible:ring-0 text-lg"
                      />
                    </div>
                    <div className="text-sm font-medium">{fromToken === "banana" ? "Banana Points" : "SHAKA"}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="ghost" size="icon" className="h-8 w-8 rotate-90" onClick={handleSwapTokens}>
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <label className="text-sm text-zinc-400 mb-1 block">To</label>
                <div className="flex gap-3">
                  <div className="flex-1 bg-zinc-800 rounded-lg p-3 flex items-center">
                    <Image
                      src={toToken === "banana" ? "/banana-icon.png" : "/shaka-coin.png"}
                      alt={toToken}
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    <div className="flex-1">
                      <div className="text-lg">{calculateConversion()}</div>
                    </div>
                    <div className="text-sm font-medium">{toToken === "banana" ? "Banana Points" : "SHAKA"}</div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800 rounded-lg p-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-400">Exchange Rate</span>
                  <span>
                    1 {fromToken === "banana" ? "Banana Point" : "SHAKA"} ={" "}
                    {
                      conversionRates[fromToken as keyof typeof conversionRates][
                        toToken as keyof (typeof conversionRates)[typeof fromToken]
                      ]
                    }{" "}
                    {toToken === "banana" ? "Banana Points" : "SHAKA"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Network Fee</span>
                  <span>0.00</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {showSuccess && (
          <div className="bg-green-900/20 border border-green-900/30 rounded-lg p-4 mb-6 flex items-center">
            <div className="w-8 h-8 bg-green-900/50 rounded-full flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-green-500">Conversion Successful!</h3>
              <p className="text-sm text-zinc-300">
                You've converted {fromAmount} {fromToken === "banana" ? "Banana Points" : "SHAKA"} to{" "}
                {calculateConversion()} {toToken === "banana" ? "Banana Points" : "SHAKA"}
              </p>
            </div>
          </div>
        )}

        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <h3 className="font-bold mb-3">Conversion Limits</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-zinc-400">Daily Limit</span>
              <span className="text-sm">1,000 Banana Points / 500 SHAKA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-400">Monthly Limit</span>
              <span className="text-sm">10,000 Banana Points / 5,000 SHAKA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-400">Minimum Conversion</span>
              <span className="text-sm">10 Banana Points / 5 SHAKA</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-900/20 p-3 rounded-lg mb-6">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-zinc-300">
            Token conversions are irreversible. Please double-check your amounts before confirming.
          </p>
        </div>

        <Button
          className="w-full bg-[#ffc72d] hover:bg-[#e6b328] text-black"
          onClick={handleConvert}
          disabled={isConverting || !fromAmount || Number.parseFloat(fromAmount) <= 0}
        >
          {isConverting ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">⟳</span> Converting...
            </span>
          ) : (
            "Convert Tokens"
          )}
        </Button>
      </div>

      <TabBar activeTab="wallet" />
    </div>
  )
}
