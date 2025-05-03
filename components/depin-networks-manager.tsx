"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info, ChevronRight, Settings, Activity } from "lucide-react"
import { dePINManager } from "@/services/depin-manager"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

interface DePINNetworksManagerProps {
  userId: string
}

export function DePINNetworksManager({ userId }: DePINNetworksManagerProps) {
  const [networks, setNetworks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [rewards, setRewards] = useState<Map<string, number>>(new Map())
  const { toast } = useToast()

  useEffect(() => {
    // Load all networks
    const services = dePINManager.getAllServices()
    const networkData = services.map((service) => ({
      ...service.getNetwork(),
      isEnabled: service.isNetworkEnabled(),
    }))

    // Get rewards for each network
    const rewardData = new Map<string, number>()
    services.forEach((service) => {
      rewardData.set(service.getNetwork().id, service.getBalance())
    })

    setNetworks(networkData)
    setRewards(rewardData)
    setIsLoading(false)
  }, [])

  const handleToggleNetwork = async (networkId: string, enabled: boolean) => {
    try {
      let success

      if (enabled) {
        success = await dePINManager.enableNetwork(networkId, userId)
      } else {
        success = await dePINManager.disableNetwork(networkId)
      }

      if (success) {
        setNetworks((prev) => prev.map((network) => (network.id === networkId ? { ...network, enabled } : network)))

        toast({
          title: enabled ? "Network Enabled" : "Network Disabled",
          description: `${networks.find((n) => n.id === networkId)?.name} mining has been ${enabled ? "enabled" : "disabled"}.`,
        })
      } else {
        toast({
          title: "Error",
          description: `Failed to ${enabled ? "enable" : "disable"} network.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling network:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">DePIN Networks</h2>
        <Link href="/settings/depin-info">
          <Button variant="outline" size="sm" className="gap-2">
            <Info className="h-4 w-4" />
            Learn More
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {networks.map((network) => (
          <Card key={network.id} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <Image
                      src={network.logoUrl || "/placeholder.svg"}
                      alt={network.name}
                      width={32}
                      height={32}
                      className="h-8 w-8"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {network.name}
                      <Badge variant={network.enabled ? "default" : "outline"} className="text-xs">
                        {network.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-zinc-400">
                      {network.tokenSymbol} - {network.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={network.enabled}
                  onCheckedChange={(checked) => handleToggleNetwork(network.id, checked)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-400">Earned:</span>
                  <span className="font-medium">
                    {(rewards.get(network.id) || 0).toFixed(4)} {network.tokenSymbol}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/depin/${network.id}/activity`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Activity className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/depin/${network.id}/settings`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/depin/${network.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
        <h3 className="font-medium mb-2">About DePIN Mining</h3>
        <p className="text-sm text-zinc-400 mb-4">
          DePIN (Decentralized Physical Infrastructure Networks) allows you to earn cryptocurrency tokens by
          contributing data from your activities to decentralized networks.
        </p>
        <Link href="/settings/depin-info">
          <Button variant="outline" size="sm" className="w-full">
            Learn More
          </Button>
        </Link>
      </div>
    </div>
  )
}
