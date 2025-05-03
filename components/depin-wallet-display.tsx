"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { dePINManager } from "@/services/depin-manager"
import Link from "next/link"
import Image from "next/image"

export function DePINWalletDisplay() {
  const [balances, setBalances] = useState<Map<string, number>>(new Map())
  const [networks, setNetworks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load all networks and balances
    const services = dePINManager.getAllServices()
    const networkData = services.map((service) => service.getNetwork())
    const balanceData = dePINManager.getTotalBalance()

    setNetworks(networkData)
    setBalances(balanceData)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Filter to only show networks with non-zero balances
  const networksWithBalance = networks.filter((network) => (balances.get(network.id) || 0) > 0)

  if (networksWithBalance.length === 0) {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium text-zinc-400 mb-2">DePIN Tokens</h3>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4 text-center text-zinc-500">
            <p className="py-2">No DePIN tokens earned yet</p>
            <Link href="/settings/depin">
              <Button variant="outline" size="sm" className="mt-2">
                Enable Mining
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-zinc-400">DePIN Tokens</h3>
        <Link href="/wallet/depin">
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
            View All
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        {networksWithBalance.map((network) => (
          <Card key={network.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-zinc-800 p-2 rounded-full">
                  <Image
                    src={network.logoUrl || "/placeholder.svg"}
                    alt={network.tokenSymbol}
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{network.name}</p>
                  <p className="text-xs text-zinc-500">{network.tokenSymbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{balances.get(network.id)?.toFixed(2) || "0.00"}</p>
                <p className="text-xs text-zinc-500">{network.tokenSymbol}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
