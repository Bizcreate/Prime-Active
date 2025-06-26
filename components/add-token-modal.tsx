"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export type TokenInfo = {
  name: string
  symbol: string
  balance: string
  value: string
  icon: string | null
  contractAddress?: string
}

interface AddTokenModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToken: (token: TokenInfo) => void
}

export function AddTokenModal({ open, onOpenChange, onAddToken }: AddTokenModalProps) {
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [tokenAddress, setTokenAddress] = useState("")
  const [tokenAmount, setTokenAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!tokenName || !tokenSymbol) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      // Simulate token verification delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create new token object
      const newToken: TokenInfo = {
        name: tokenName,
        symbol: tokenSymbol.toUpperCase(),
        balance: tokenAmount || "0",
        value: ((Number.parseFloat(tokenAmount) || 0) * 0.5).toFixed(2), // Mock value calculation
        icon: null,
        contractAddress: tokenAddress || undefined,
      }

      onAddToken(newToken)

      // Reset form
      setTokenName("")
      setTokenSymbol("")
      setTokenAddress("")
      setTokenAmount("")

      // Close modal
      onOpenChange(false)
    } catch (err) {
      console.error("Error adding token:", err)
      setError("Failed to add token. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Add Token</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Enter the token details to add it to your wallet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tokenName" className="text-right">
                Name*
              </Label>
              <Input
                id="tokenName"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                className="col-span-3 bg-zinc-800 border-zinc-700"
                placeholder="Token Name"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tokenSymbol" className="text-right">
                Symbol*
              </Label>
              <Input
                id="tokenSymbol"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                className="col-span-3 bg-zinc-800 border-zinc-700"
                placeholder="TKN"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tokenAddress" className="text-right">
                Address
              </Label>
              <Input
                id="tokenAddress"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className="col-span-3 bg-zinc-800 border-zinc-700"
                placeholder="0x..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tokenAmount" className="text-right">
                Amount
              </Label>
              <Input
                id="tokenAmount"
                type="number"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                className="col-span-3 bg-zinc-800 border-zinc-700"
                placeholder="0.0"
                min="0"
                step="0.000001"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Token"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
