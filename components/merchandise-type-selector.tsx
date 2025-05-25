"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Smartphone, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export type MerchandiseType = "standard" | "nfc" | "nfc+nft"

interface MerchandiseTypeSelectorProps {
  onSelect?: (type: MerchandiseType) => void
  selectedType: MerchandiseType
  productHasNFC?: boolean
  productPrice?: number
}

export function MerchandiseTypeSelector({
  onSelect = () => {},
  selectedType,
  productHasNFC = false,
  productPrice = 0,
}: MerchandiseTypeSelectorProps) {
  const [showInfo, setShowInfo] = useState<MerchandiseType | null>(null)
  const [localSelectedType, setLocalSelectedType] = useState<MerchandiseType>(selectedType)

  // Add notification when downgrading
  const [showDowngradeWarning, setShowDowngradeWarning] = useState(false)
  const [previousType, setPreviousType] = useState<MerchandiseType>(selectedType)

  // Calculate prices
  const standardPrice = productPrice
  const nfcPrice = productPrice * 1.2 // Always 20% more
  const nftPrice = productPrice * 1.3 // Always 30% more

  const handleTypeChange = (value: string) => {
    const newType = value as MerchandiseType

    // Check if downgrading
    if (
      (previousType === "nfc+nft" && (newType === "nfc" || newType === "standard")) ||
      (previousType === "nfc" && newType === "standard")
    ) {
      // Store the attempted new type temporarily
      setLocalSelectedType(newType)
      setShowDowngradeWarning(true)
    } else {
      setLocalSelectedType(newType)
      onSelect(newType)
      setPreviousType(newType)
    }
  }

  return (
    <div className="space-y-4 w-full">
      <h3 className="text-sm font-medium mb-2">Merchandise Type</h3>
      <RadioGroup value={localSelectedType} onValueChange={handleTypeChange} className="space-y-3">
        <div className="flex items-start">
          <RadioGroupItem value="nfc+nft" id="nfc-nft" className="mt-1 border-[#ffc72d]" />
          <div className="ml-2">
            <div className="flex items-center">
              <Label htmlFor="nfc-nft" className="font-medium flex items-center">
                NFC + NFT
                <Sparkles className="h-3.5 w-3.5 ml-1 text-purple-400" />
                <span className="ml-1.5 text-[#ffc72d] text-xs font-semibold">PREMIUM</span>
              </Label>
            </div>
            <p className="text-xs text-zinc-400">All NFC features plus a digital collectible NFT</p>
            <p className="text-xs font-medium mt-1 text-[#ffc72d]">${(nftPrice || 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="flex items-start">
          <RadioGroupItem value="nfc" id="nfc" className="mt-1" />
          <div className="ml-2">
            <div className="flex items-center">
              <Label htmlFor="nfc" className="font-medium flex items-center">
                NFC-Enabled
                <Smartphone className="h-3.5 w-3.5 ml-1 text-[#ffc72d]" />
              </Label>
              {productHasNFC && <span className="text-xs ml-2 text-[#ffc72d]">Included</span>}
            </div>
            <p className="text-xs text-zinc-400">Track wearing time and earn tokens</p>
            <p className="text-xs font-medium mt-1">${(nfcPrice || 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="flex items-start">
          <RadioGroupItem value="standard" id="standard" className="mt-1" />
          <div className="ml-2">
            <Label htmlFor="standard" className="font-medium">
              Standard
            </Label>
            <p className="text-xs text-zinc-400">Regular merchandise without special features</p>
            <p className="text-xs font-medium mt-1">${(standardPrice || 0).toFixed(2)}</p>
          </div>
        </div>
      </RadioGroup>

      {showDowngradeWarning && (
        <div className="mt-4 bg-amber-900/30 border border-amber-900/50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-amber-400 mb-2">Downgrade Confirmation</h4>
          <p className="text-xs text-zinc-300 mb-3">
            You are about to downgrade your merchandise type. This will remove features and potentially reduce the value
            of your purchase.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs flex-1"
              onClick={() => setShowDowngradeWarning(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="text-xs flex-1 bg-amber-600 hover:bg-amber-700"
              onClick={() => {
                // Apply the new selection that was attempted
                const newType =
                  localSelectedType === previousType
                    ? previousType === "nfc+nft"
                      ? "nfc"
                      : "standard"
                    : localSelectedType

                setLocalSelectedType(newType)
                onSelect(newType)
                setPreviousType(newType)
                setShowDowngradeWarning(false)
              }}
            >
              Confirm Downgrade
            </Button>
          </div>
        </div>
      )}

      {showInfo && (
        <div className="bg-zinc-800 p-3 rounded-md mt-3 text-xs">
          {showInfo === "nfc" && (
            <>
              <h4 className="font-medium mb-1">About NFC-Enabled Merchandise</h4>
              <p className="text-zinc-400 mb-2">
                NFC-enabled merchandise contains an embedded NFC chip that can be scanned with your phone. This allows
                you to:
              </p>
              <ul className="list-disc pl-4 text-zinc-400 space-y-1">
                <li>Track how long you wear your merchandise</li>
                <li>Earn tokens for wearing time (1 token per 10 minutes)</li>
                <li>Verify your participation in challenges</li>
                <li>Access exclusive content and experiences</li>
              </ul>
            </>
          )}

          {showInfo === "nfc+nft" && (
            <>
              <h4 className="font-medium mb-1">About NFC + NFT Merchandise</h4>
              <p className="text-zinc-400 mb-2">
                In addition to all NFC features, this option includes a digital NFT collectible that:
              </p>
              <ul className="list-disc pl-4 text-zinc-400 space-y-1">
                <li>Represents your physical merchandise on the blockchain</li>
                <li>Can be displayed in your digital wallet</li>
                <li>Provides proof of authenticity</li>
                <li>May increase in value over time</li>
                <li>Grants access to exclusive NFT-holder events</li>
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
