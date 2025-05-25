"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, ExternalLink, Copy, LogOut } from "lucide-react"
import { useState } from "react"
import { useWeb3 } from "@/components/web3-provider"
import Image from "next/image"

export function WalletDisplay() {
  const { address, disconnectWallet, balance } = useWeb3()
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const viewOnExplorer = () => {
    if (address) {
      // This is for Ethereum mainnet - adjust for other networks
      window.open(`https://etherscan.io/address/${address}`, "_blank")
    }
  }

  if (!address) {
    return null
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-[#ffc72d]" />
          Connected Wallet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-4">
          <div className="bg-zinc-800 p-3 rounded-full mb-3">
            <Wallet className="h-8 w-8 text-[#ffc72d]" />
          </div>
          <p className="font-medium">Web3 Wallet</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-zinc-400">{address}</p>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}>
              <Copy className="h-3 w-3" />
            </Button>
            {copied && <span className="text-xs text-green-500">Copied!</span>}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Image src="/shaka-coin.png" alt="Shaka Coins" width={24} height={24} className="object-contain" />
          <span className="text-xl font-bold text-[#ffc72d]">{balance} $SHKA</span>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full flex items-center gap-2" onClick={viewOnExplorer}>
            <ExternalLink className="h-4 w-4" />
            View on Explorer
          </Button>

          <Button variant="destructive" className="w-full flex items-center gap-2" onClick={disconnectWallet}>
            <LogOut className="h-4 w-4" />
            Disconnect Wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
