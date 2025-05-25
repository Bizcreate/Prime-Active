"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Check, Coins } from "lucide-react"
import Image from "next/image"
import { useWeb3 } from "@/components/web3-provider"

interface TokenPaymentOptionsProps {
  totalAmount: number
  onApplyTokens: (tokenAmount: number, discountAmount: number) => void
  onResetTokens: () => void
  balance?: number
}

export function TokenPaymentOptions({
  totalAmount = 0,
  onApplyTokens,
  onResetTokens,
  balance: externalBalance,
}: TokenPaymentOptionsProps) {
  const { balance: walletBalance = 0 } = useWeb3()
  const [showOptions, setShowOptions] = useState(false)
  const [tokenAmount, setTokenAmount] = useState(0)
  const [appliedTokens, setAppliedTokens] = useState(0)

  // Use external balance if provided, otherwise use wallet balance
  const balance = typeof externalBalance === "number" ? externalBalance : walletBalance

  // Token value in USD (10 cents per token)
  const TOKEN_VALUE = 0.1

  // Maximum tokens that can be used (up to 50% of order value)
  // Ensure we have valid numbers and avoid division by zero
  const safeTotal = typeof totalAmount === "number" && !isNaN(totalAmount) && totalAmount > 0 ? totalAmount : 0
  const safeBalance = typeof balance === "number" && !isNaN(balance) ? balance : 0
  const maxTokens = Math.min(safeBalance, Math.floor(safeTotal / TOKEN_VALUE / 2) || 0)

  // Reset when total changes
  useEffect(() => {
    setTokenAmount(0)
    setAppliedTokens(0)
  }, [totalAmount])

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setTokenAmount(value[0])
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setTokenAmount(Math.min(value, maxTokens))
  }

  // Apply tokens
  const handleApplyTokens = () => {
    const discountAmount = tokenAmount * TOKEN_VALUE
    onApplyTokens(tokenAmount, discountAmount)
    setAppliedTokens(tokenAmount)
  }

  // Reset tokens
  const handleResetTokens = () => {
    setTokenAmount(0)
    setAppliedTokens(0)
    onResetTokens()
  }

  return (
    <Card className="bg-zinc-800 border-l-4 border-l-[#ffc72d] p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Image src="/shaka-banana-hand.png" alt="Tokens" width={20} height={20} className="mr-2" />
          <h3 className="font-medium text-sm">Pay with Tokens</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowOptions(!showOptions)}
          className="text-xs hover:text-[#ffc72d]"
        >
          {showOptions ? "Hide Options" : "Show Options"}
        </Button>
      </div>

      {showOptions ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Available Tokens:</span>
            <span className="font-medium text-[#ffc72d]">{safeBalance}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Maximum Usable:</span>
            <span>{maxTokens} tokens (up to 50% of order)</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Select Amount:</span>
              <span>
                {tokenAmount} tokens = ${(tokenAmount * TOKEN_VALUE).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Slider
                value={[tokenAmount]}
                max={maxTokens || 1}
                step={1}
                onValueChange={handleSliderChange}
                className="flex-1"
              />
              <Input
                type="number"
                value={tokenAmount}
                onChange={handleInputChange}
                min={0}
                max={maxTokens || 0}
                className="w-20"
              />
            </div>
          </div>

          {appliedTokens > 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-green-500">
                <Check className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {appliedTokens} tokens applied (${(appliedTokens * TOKEN_VALUE).toFixed(2)})
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleResetTokens}>
                Remove
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleApplyTokens}
              disabled={tokenAmount === 0 || safeBalance === 0}
              className="w-full bg-[#ffc72d] text-black hover:bg-[#e6b328]"
            >
              <Coins className="h-4 w-4 mr-2" />
              Apply Tokens
            </Button>
          )}
        </div>
      ) : (
        <div className="text-sm text-zinc-400">
          Use your earned tokens for discounts on merchandise. 1 token = $0.10 USD.
        </div>
      )}
    </Card>
  )
}
