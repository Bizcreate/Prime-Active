"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react"
import Image from "next/image"
import { useWeb3 } from "@/components/web3-provider"
import { NFTMintingService, type MintingRequest, type MintingResult } from "@/services/nft-minting-service"

interface NFTMintingModalProps {
  isOpen: boolean
  onClose: () => void
  product?: any // Changed from productData to product to match how it's called in store page
  transactionId: string
  nfcId?: string
}

export function NFTMintingModal({ isOpen, onClose, product, transactionId, nfcId }: NFTMintingModalProps) {
  const { address } = useWeb3()
  const [minting, setMinting] = useState(false)
  const [mintingResult, setMintingResult] = useState<MintingResult | null>(null)
  const [mintingStep, setMintingStep] = useState<"preparing" | "minting" | "complete" | "error">("preparing")
  const [progress, setProgress] = useState(0)

  // Create a productData object from the product prop
  const productData = product
    ? {
        id: product.id || `product-${Date.now()}`,
        name: product.name || "Product",
        image: product.images?.[0] || "/placeholder.svg",
        price: product.price || 0,
      }
    : null

  // Start minting process
  const handleStartMinting = async () => {
    if (!address || !productData) {
      setMintingStep("error")
      setMintingResult({
        success: false,
        errorMessage: !address ? "Wallet not connected." : "Product data is missing.",
      })
      return
    }

    setMinting(true)
    setMintingStep("minting")
    setProgress(10)

    try {
      // Create minting request
      const mintingRequest: MintingRequest = {
        productId: productData.id,
        productName: productData.name,
        productImage: productData.image,
        recipientAddress: address,
        merchandiseType: "nfc+nft",
        transactionId,
        nfcId,
      }

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      // Create and process minting request
      const requestId = NFTMintingService.createMintingRequest(mintingRequest)
      const result = await NFTMintingService.processMintingRequest(requestId)

      // Clear interval and set final result
      clearInterval(progressInterval)
      setProgress(100)
      setMintingResult(result)
      setMintingStep(result.success ? "complete" : "error")
    } catch (error) {
      console.error("Error during minting:", error)
      setMintingStep("error")
      setMintingResult({
        success: false,
        errorMessage: "An unexpected error occurred during minting.",
      })
    } finally {
      setMinting(false)
    }
  }

  // Auto-start minting when modal opens
  useEffect(() => {
    if (isOpen && address && !minting && !mintingResult && productData) {
      handleStartMinting()
    }
  }, [isOpen, address, minting, mintingResult, productData])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setMintingStep("preparing")
        setMintingResult(null)
        setProgress(0)
      }, 300)
    }
  }, [isOpen])

  // If no product data, show an error
  if (!productData && mintingStep !== "error") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>Product data is missing. Cannot mint NFT.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle>Minting Digital Collectible</DialogTitle>
          <DialogDescription>Creating a digital NFT to represent your physical merchandise purchase.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          {mintingStep === "preparing" && (
            <div className="text-center">
              <Info className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Preparing to Mint</h3>
              <p className="text-sm text-zinc-400 mb-4">
                We're about to create a digital collectible NFT for your purchase.
              </p>
              <Button onClick={handleStartMinting} disabled={!address || !productData}>
                Start Minting
              </Button>
            </div>
          )}

          {mintingStep === "minting" && productData && (
            <div className="text-center w-full">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src={productData.image || "/placeholder.svg"}
                  alt={productData.name}
                  fill
                  className="object-contain rounded-lg opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
              </div>

              <h3 className="text-lg font-medium mb-2">Minting in Progress</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Please wait while we mint your digital collectible on the blockchain.
              </p>

              <div className="w-full bg-zinc-800 rounded-full h-2 mb-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-zinc-500">{progress}% complete</p>
            </div>
          )}

          {mintingStep === "complete" && mintingResult?.success && (
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Minting Successful!</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Your digital collectible has been successfully minted and added to your wallet.
              </p>

              <div className="bg-zinc-800 rounded-lg p-4 mb-4 w-full">
                <div className="flex items-center mb-3">
                  <div className="relative w-16 h-16 mr-3">
                    <Image
                      src={productData?.image || "/placeholder.svg"}
                      alt={mintingResult.nftMetadata?.name || "NFT"}
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{mintingResult.nftMetadata?.name}</h4>
                    <p className="text-xs text-zinc-500">Token ID: {mintingResult.tokenId}</p>
                  </div>
                </div>

                <div className="text-xs text-zinc-500 break-all">
                  <p className="mb-1">Transaction: {mintingResult.transactionHash}</p>
                  {nfcId && <p>Linked to NFC ID: {nfcId}</p>}
                </div>
              </div>

              <Button onClick={onClose} className="w-full">
                View in Wallet
              </Button>
            </div>
          )}

          {mintingStep === "error" && (
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Minting Failed</h3>
              <p className="text-sm text-red-400 mb-4">
                {mintingResult?.errorMessage || "There was an error minting your NFT. Please try again."}
              </p>
              <Button onClick={handleStartMinting} className="mb-2" disabled={!address || !productData}>
                Try Again
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <p className="text-xs text-zinc-500 mb-4 sm:mb-0">
            NFTs are minted on the Polygon network for energy efficiency.
          </p>
          {mintingStep !== "complete" && mintingStep !== "error" && (
            <Button variant="outline" onClick={onClose} disabled={minting}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
