"use client"

import { useAddress, useDisconnect, useConnectionStatus, useWallet, useBalance } from "@thirdweb-dev/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Wallet, ExternalLink, Copy, LogOut, RefreshCw } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export function ThirdwebEVMWallet() {
  const address = useAddress()
  const connectionStatus = useConnectionStatus()
  const disconnect = useDisconnect()
  const wallet = useWallet()
  const [copied, setCopied] = useState(false)
  const [selectedTab, setSelectedTab] = useState("tokens")
  const [refreshing, setRefreshing] = useState(false)

  // Get balances for top tokens
  const sweatBalance = useBalance("0x1234567890123456789012345678901234567890") // Replace with actual SWEAT token address
  const fittBalance = useBalance("0x0987654321098765432109876543210987654321") // Replace with actual FITT token address
  const iotxBalance = useBalance("0x6789012345678901234567890123456789012345") // Replace with actual IOTX token address

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

  const refreshBalances = async () => {
    setRefreshing(true)
    // In a real app, you would refresh balances here
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  if (connectionStatus !== "connected" || !address) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            EVM Wallet
          </CardTitle>
          <CardDescription>Connect your wallet to manage EVM tokens</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="bg-zinc-800 p-4 rounded-full mb-4">
            <Wallet className="h-12 w-12 text-zinc-400" />
          </div>
          <p className="text-zinc-400 mb-4">No wallet connected</p>
          <Button>Connect Wallet</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          EVM Wallet
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

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
          </TabsList>
          <TabsContent value="tokens" className="space-y-3 mt-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">DePIN Tokens</h3>
              <Button variant="ghost" size="sm" onClick={refreshBalances} disabled={refreshing}>
                <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>

            {/* SWEAT Token */}
            <div className="flex justify-between items-center p-3 bg-zinc-800 rounded-md">
              <div className="flex items-center gap-2">
                <img src="/sweatcoin-inspired-logo.png" alt="SWEAT" className="h-5 w-5 rounded-full" />
                <span>SWEAT</span>
              </div>
              {sweatBalance.isLoading ? (
                <Skeleton className="h-4 w-16" />
              ) : (
                <span className="font-medium">{sweatBalance.data?.displayValue || "0.00"}</span>
              )}
            </div>

            {/* FITT Token */}
            <div className="flex justify-between items-center p-3 bg-zinc-800 rounded-md">
              <div className="flex items-center gap-2">
                <img src="/fitmint-logo.png" alt="FITT" className="h-5 w-5 rounded-full" />
                <span>FITT</span>
              </div>
              {fittBalance.isLoading ? (
                <Skeleton className="h-4 w-16" />
              ) : (
                <span className="font-medium">{fittBalance.data?.displayValue || "0.00"}</span>
              )}
            </div>

            {/* IOTX Token */}
            <div className="flex justify-between items-center p-3 bg-zinc-800 rounded-md">
              <div className="flex items-center gap-2">
                <img src="/iotex-logo.png" alt="IOTX" className="h-5 w-5 rounded-full" />
                <span>IOTX</span>
              </div>
              {iotxBalance.isLoading ? (
                <Skeleton className="h-4 w-16" />
              ) : (
                <span className="font-medium">{iotxBalance.data?.displayValue || "0.00"}</span>
              )}
            </div>
          </TabsContent>
          <TabsContent value="nfts" className="mt-3">
            <div className="text-center py-8 text-zinc-400">
              <p>No NFTs found</p>
              <p className="text-xs mt-1">NFTs will appear here once you earn them</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="space-y-3">
        <Button variant="outline" className="w-full flex items-center gap-2" onClick={viewOnExplorer}>
          <ExternalLink className="h-4 w-4" />
          View on Explorer
        </Button>

        <Button variant="destructive" className="w-full flex items-center gap-2" onClick={disconnect}>
          <LogOut className="h-4 w-4" />
          Disconnect Wallet
        </Button>
      </CardFooter>
    </Card>
  )
}
