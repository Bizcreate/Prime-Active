"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ExternalLink, Info } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface MerchandiseNFTDisplayProps {
  nftImage: string
  nftName: string
  tokenId?: string
  contractAddress?: string
  attributes?: Array<{ trait_type: string; value: string }>
  onViewInWallet?: () => void
}

export function MerchandiseNFTDisplay({
  nftImage,
  nftName,
  tokenId = "#12345",
  contractAddress = "0x1234...5678",
  attributes = [],
  onViewInWallet,
}: MerchandiseNFTDisplayProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-none overflow-hidden shadow-lg">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/60 z-10"></div>
        <div className="relative aspect-square bg-gradient-to-br from-purple-900/20 to-zinc-900">
          <Image src={nftImage || "/placeholder.svg"} alt={nftName} fill className="object-contain p-4" />
          <div className="absolute top-2 right-2 z-20">
            <div className="bg-zinc-800/80 text-purple-400 text-xs px-2 py-0.5 rounded-full flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              NFT
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="absolute bottom-2 right-2 z-20 bg-zinc-800/80 rounded-full p-1.5"
          >
            <Info className="h-4 w-4 text-zinc-300" />
          </button>
        </div>
      </div>
      <CardContent className="p-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-white">{nftName}</h3>
          <span className="text-xs text-zinc-400">{tokenId}</span>
        </div>
        <button
          onClick={onViewInWallet}
          className="mt-2 w-full text-xs flex items-center justify-center gap-1 bg-[#ffc72d]/10 hover:bg-[#ffc72d]/20 text-[#ffc72d] py-1.5 px-2 rounded-md transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          View in Wallet
        </button>
      </CardContent>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 border-t border-zinc-800 mt-1">
              <h4 className="text-xs font-medium text-zinc-400 mb-2">NFT Details</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Contract</span>
                  <span className="text-zinc-300">{contractAddress}</span>
                </div>
                {attributes.map((attr, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-zinc-500">{attr.trait_type}</span>
                    <span className="text-zinc-300">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
