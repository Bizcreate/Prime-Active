"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, RefreshCw, ArrowUpRight } from "lucide-react"
import { dePINManager } from "@/services/depin-manager"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

interface TokenBalance {
  networkId: string
  symbol: string
  name: string
  balance: number
  logoUrl: string
  explorerUrl?: string
}

export function MultiChainWallet() {
  const [tokens, setTokens] = useState<TokenBalance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTestnet, setIsTestnet] = useState(true)
  const [walletAddress, setWalletAddress] = useState<string>("0x1234...5678")
  const { toast } = useToast()

  useEffect(() => {
    loadTokenBalances()
  }, [])

  const loadTokenBalances = async () => {
    setIsLoading(true)
    try {
      // Get all services
      const services = dePINManager.getAllServices()

      // Get current testnet mode
      setIsTestnet(dePINManager.isInTestnetMode())

      // Map services to token balances
      const balances: TokenBalance[] = services.map((service) => {
        const network = service.getNetwork()
        return {
          networkId: network.id,
          symbol: network.tokenSymbol,
          name: network.tokenName,
          balance: service.getBalance(),
          logoUrl: network.logoUrl,
          explorerUrl: getExplorerUrl(network.id, isTestnet),
        }
      })

      setTokens(balances)
    } catch (error) {
      console.error("Error loading token balances:", error)
      toast({
        title: "Error",
        description: "Failed to load token balances",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getExplorerUrl = (networkId: string, isTestnet: boolean): string => {
    // Return the appropriate block explorer URL for each network
    switch (networkId) {
      case "iotex":
        return isTestnet ? "https://testnet.iotexscan.io/address/" : "https://iotexscan.io/address/"
      case "helium_mobile":
        return isTestnet ? "https://testnet-explorer.helium.com/accounts/" : "https://explorer.helium.com/accounts/"
      case "foam":
        return isTestnet ? "https://testnet.etherscan.io/address/" : "https://etherscan.io/address/"
      default:
        return "#"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copied",
          description: "Address copied to clipboard",
        })
      })
      .catch((err) => {
        console.error("Failed to copy:", err)
      })
  }

  const toggleNetworkMode = () => {
    const newMode = !isTestnet
    dePINManager.setTestnetMode(newMode)
    setIsTestnet(newMode)
    toast({
      title: newMode ? "Testnet Mode" : "Mainnet Mode",
      description: `Switched to ${newMode ? "testnet" : "mainnet"} mode`,
    })
    loadTokenBalances()
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">DePIN Tokens</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={isTestnet ? "outline" : "default"}>{isTestnet ? "Testnet" : "Mainnet"}</Badge>
          <Button variant="ghost" size="icon" onClick={loadTokenBalances}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-zinc-400">No tokens found</p>
            <Button className="mt-4" onClick={() => loadTokenBalances()}>
              Refresh
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">Wallet:</span>
                <span className="text-sm">{walletAddress}</span>
                <button onClick={() => copyToClipboard(walletAddress)} className="text-zinc-400">
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <Button variant="outline" size="sm" onClick={toggleNetworkMode}>
                Switch to {isTestnet ? "Mainnet" : "Testnet"}
              </Button>
            </div>

            <div className="space-y-3">
              {tokens.map((token) => (
                <div key={token.networkId} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Image
                      src={token.logoUrl || "/placeholder.svg"}
                      alt={token.symbol}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-xs text-zinc-400">{token.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-medium">{token.balance.toFixed(4)}</div>
                      <div className="text-xs text-zinc-400">{isTestnet ? "Testnet" : "Mainnet"}</div>
                    </div>
                    {token.explorerUrl && token.explorerUrl !== "#" && (
                      <a
                        href={`${token.explorerUrl}${walletAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <Link href="/depin/withdraw">
                <Button className="w-full flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4" />
                  Withdraw Tokens
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
