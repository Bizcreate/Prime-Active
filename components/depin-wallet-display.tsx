"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { dePINManager } from "@/services/depin-manager"
import Image from "next/image"

interface DepiNWalletDisplayProps {
  networkId?: string
}

export function DePINWalletDisplay({ networkId }: DepiNWalletDisplayProps) {
  const [networks, setNetworks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadNetworks()
  }, [networkId])

  const loadNetworks = async () => {
    setIsLoading(true)
    try {
      if (typeof window === "undefined") {
        setNetworks([])
        return
      }

      // Get all services or filter by networkId
      const services = networkId
        ? [dePINManager.getServiceByNetworkId(networkId)].filter(Boolean)
        : dePINManager.getAllServices()

      // Filter services with non-zero balance
      const networksWithBalance = services
        .filter((service) => service.getBalance() > 0)
        .map((service) => {
          const network = service.getNetwork()
          return {
            id: network.id,
            name: network.name,
            tokenSymbol: network.tokenSymbol,
            balance: service.getBalance(),
            logoUrl: network.logoUrl,
          }
        })

      setNetworks(networksWithBalance)
    } catch (error) {
      console.error("Error loading DePIN networks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Format balance with 2 decimal places
  const formatBalance = (balance: number) => {
    return balance.toFixed(2)
  }

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg">DePIN Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (networks.length === 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg">DePIN Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-zinc-400">No tokens found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-lg">DePIN Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {networks.map((network) => (
            <div key={network.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Image
                  src={network.logoUrl || "/placeholder.svg"}
                  alt={network.tokenSymbol}
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <div>
                  <div className="font-medium">{network.tokenSymbol}</div>
                  <div className="text-xs text-zinc-400">{network.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="font-medium">{formatBalance(network.balance)}</div>
                </div>
                <Badge variant="outline" className="text-xs">
                  DePIN
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
