"use client"

import { useAddress, useDisconnect, useConnectionStatus, useWallet } from "@thirdweb-dev/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, ExternalLink, Copy, LogOut } from "lucide-react"
import { useState } from "react"

export function ThirdwebWallet() {
  const address = useAddress()
  const connectionStatus = useConnectionStatus()
  const disconnect = useDisconnect()
  const wallet = useWallet()
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  const viewOnExplorer = () => {
    if (address) {
      // This is for Ethereum mainnet - adjust for other networks
      window.open(`https://etherscan.io/address/${address}`, "_blank")
    }
  }

  if (connectionStatus !== "connected" || !address) {
    return null
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Connected Wallet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-4">
          <div className="bg-zinc-800 p-3 rounded-full mb-3">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <p className="font-medium">{wallet?.getMeta().name || "Web3 Wallet"}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-zinc-400">{formatAddress(address)}</p>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}>
              <Copy className="h-3 w-3" />
            </Button>
            {copied && <span className="text-xs text-green-500">Copied!</span>}
          </div>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full flex items-center gap-2" onClick={viewOnExplorer}>
            <ExternalLink className="h-4 w-4" />
            View on Explorer
          </Button>

          <Button variant="destructive" className="w-full flex items-center gap-2" onClick={disconnect}>
            <LogOut className="h-4 w-4" />
            Disconnect Wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
