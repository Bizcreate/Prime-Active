"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface NFTTransferModalProps {
  isOpen: boolean
  onClose: () => void
  nft: any
}

export function NFTTransferModal({ isOpen, onClose, nft }: NFTTransferModalProps) {
  const [recipientAddress, setRecipientAddress] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  const handleTransfer = async () => {
    if (!recipientAddress) {
      setStatus("error")
      setErrorMessage("Please enter a recipient address")
      return
    }

    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      setStatus("error")
      setErrorMessage("Please enter a valid Ethereum address")
      return
    }

    setStatus("loading")

    try {
      // Simulate transfer delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, this would call a smart contract function
      // For now, we'll just simulate success
      setStatus("success")

      // After successful transfer, redirect to wallet after a short delay
      setTimeout(() => {
        onClose()
        router.push("/wallet")
      }, 2000)
    } catch (error) {
      setStatus("error")
      setErrorMessage("Transfer failed. Please try again.")
    }
  }

  const resetModal = () => {
    setStatus("idle")
    setRecipientAddress("")
    setErrorMessage("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer NFT</DialogTitle>
          <DialogDescription>Send your NFT to another wallet address. This action cannot be undone.</DialogDescription>
        </DialogHeader>

        {status === "idle" && (
          <>
            <div className="flex items-center space-x-4 py-2">
              <div className="relative h-16 w-16 rounded-md overflow-hidden">
                <Image src={nft?.image || "/placeholder.svg"} alt={nft?.name || "NFT"} fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-medium">{nft?.name}</h3>
                <p className="text-sm text-zinc-400">{nft?.collection}</p>
              </div>
            </div>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="sm:justify-between">
              <Button variant="ghost" onClick={resetModal}>
                Cancel
              </Button>
              <Button onClick={handleTransfer} className="bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90">
                Transfer NFT
              </Button>
            </DialogFooter>
          </>
        )}

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 text-[#ffc72d] animate-spin mb-4" />
            <h3 className="font-medium text-lg">Processing Transfer</h3>
            <p className="text-sm text-zinc-400 text-center mt-2">
              Please wait while we process your transfer. This may take a moment.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="font-medium text-lg">Transfer Successful!</h3>
            <p className="text-sm text-zinc-400 text-center mt-2">
              Your NFT has been successfully transferred to {recipientAddress.slice(0, 6)}...
              {recipientAddress.slice(-4)}
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="font-medium text-lg">Transfer Failed</h3>
            <p className="text-sm text-red-400 text-center mt-2">{errorMessage}</p>
            <Button onClick={() => setStatus("idle")} className="mt-4">
              Try Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
