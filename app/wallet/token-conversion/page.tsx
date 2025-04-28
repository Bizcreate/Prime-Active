"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeftRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

const CONVERSION_RATES = {
  shaka: {
    banana: 5,
    prime: 0.1,
  },
  banana: {
    shaka: 0.2,
    prime: 0.02,
  },
  prime: {
    shaka: 10,
    banana: 50,
  },
}

export default function TokenConversionPage() {
  const [fromToken, setFromToken] = useState("shaka")
  const [toToken, setToToken] = useState("banana")
  const [amount, setAmount] = useState("")
  const [estimatedAmount, setEstimatedAmount] = useState("")

  const handleFromTokenChange = (value: string) => {
    setFromToken(value)
    calculateConversion(amount, value, toToken)
  }

  const handleToTokenChange = (value: string) => {
    setToToken(value)
    calculateConversion(amount, fromToken, value)
  }

  const calculateConversion = (amount: string, from: string, to: string) => {
    if (!amount || isNaN(Number(amount))) {
      setEstimatedAmount("")
      return
    }

    const rate = CONVERSION_RATES[from][to]
    const result = (Number(amount) * rate).toFixed(2)
    setEstimatedAmount(result)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)
    calculateConversion(value, fromToken, toToken)
  }

  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    calculateConversion(amount, toToken, fromToken)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to convert",
        variant: "destructive",
      })
      return
    }

    // Simulate a conversion transaction
    setTimeout(() => {
      toast({
        title: "Conversion successful",
        description: `Converted ${amount} ${fromToken.toUpperCase()} to ${estimatedAmount} ${toToken.toUpperCase()}`,
        variant: "default",
      })
      setAmount("")
      setEstimatedAmount("")
    }, 1000)
  }

  const getTokenImage = (token: string) => {
    switch (token) {
      case "shaka":
        return "/shaka-coin.png"
      case "banana":
        return "/shaka-banana.png"
      case "prime":
        return "/activity-token-icon.png"
      default:
        return "/shaka-coin.png"
    }
  }

  const getTokenLabel = (token: string) => {
    switch (token) {
      case "shaka":
        return "SHAKA"
      case "banana":
        return "BANANA"
      case "prime":
        return "PRIME"
      default:
        return "SHAKA"
    }
  }

  return (
    <div className="container max-w-md pb-16">
      <div className="flex items-center mb-8 mt-6">
        <Button variant="ghost" className="p-0 mr-2" asChild>
          <a href="/wallet">
            <ArrowLeft className="h-6 w-6" />
          </a>
        </Button>
        <h1 className="text-2xl font-bold">Token Conversion</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Convert Your Tokens</CardTitle>
          <CardDescription>Exchange between different token types with current market rates</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                <div className="space-y-2">
                  <Label htmlFor="from-token">From</Label>
                  <Select value={fromToken} onValueChange={handleFromTokenChange}>
                    <SelectTrigger id="from-token" className="flex items-center">
                      <img
                        src={getTokenImage(fromToken) || "/placeholder.svg"}
                        alt={fromToken}
                        className="w-5 h-5 mr-2"
                      />
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shaka" className="flex items-center">
                        <div className="flex items-center">
                          <img src="/shaka-coin.png" alt="Shaka" className="w-5 h-5 mr-2" />
                          SHAKA
                        </div>
                      </SelectItem>
                      <SelectItem value="banana">
                        <div className="flex items-center">
                          <img src="/shaka-banana.png" alt="Banana" className="w-5 h-5 mr-2" />
                          BANANA
                        </div>
                      </SelectItem>
                      <SelectItem value="prime">
                        <div className="flex items-center">
                          <img src="/activity-token-icon.png" alt="Prime" className="w-5 h-5 mr-2" />
                          PRIME
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full mt-7"
                  onClick={handleSwapTokens}
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="to-token">To</Label>
                  <Select value={toToken} onValueChange={handleToTokenChange}>
                    <SelectTrigger id="to-token" className="flex items-center">
                      <img src={getTokenImage(toToken) || "/placeholder.svg"} alt={toToken} className="w-5 h-5 mr-2" />
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shaka">
                        <div className="flex items-center">
                          <img src="/shaka-coin.png" alt="Shaka" className="w-5 h-5 mr-2" />
                          SHAKA
                        </div>
                      </SelectItem>
                      <SelectItem value="banana">
                        <div className="flex items-center">
                          <img src="/shaka-banana.png" alt="Banana" className="w-5 h-5 mr-2" />
                          BANANA
                        </div>
                      </SelectItem>
                      <SelectItem value="prime">
                        <div className="flex items-center">
                          <img src="/activity-token-icon.png" alt="Prime" className="w-5 h-5 mr-2" />
                          PRIME
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" placeholder="0.00" value={amount} onChange={handleAmountChange} />
              </div>

              <div className="bg-secondary rounded-md p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Exchange Rate</span>
                  <span className="font-medium">
                    1 {getTokenLabel(fromToken)} = {CONVERSION_RATES[fromToken][toToken]} {getTokenLabel(toToken)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">You Will Receive</span>
                  <div className="flex items-center">
                    <img src={getTokenImage(toToken) || "/placeholder.svg"} alt={toToken} className="w-5 h-5 mr-2" />
                    <span className="font-bold text-lg">
                      {estimatedAmount} {getTokenLabel(toToken)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Convert Tokens
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-xs text-muted-foreground text-center">
            Note: Token conversion rates are subject to change based on network activity. A small fee may be applied to
            each conversion.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
