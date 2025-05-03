"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Activity, Settings, Clock, Check } from "lucide-react"
import { dePINManager } from "@/services/depin-manager"
import type { DePINNetwork, DePINReward } from "@/services/depin-types"
import Link from "next/link"
import Image from "next/image"

export default function DePINNetworkDetailPage() {
  const params = useParams()
  const router = useRouter()
  const networkId = params.networkId as string

  const [network, setNetwork] = useState<DePINNetwork | null>(null)
  const [rewards, setRewards] = useState<DePINReward[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalEarned, setTotalEarned] = useState(0)

  useEffect(() => {
    const loadNetworkData = () => {
      const service = dePINManager.getService(networkId)

      if (!service) {
        router.push("/settings/depin")
        return
      }

      setNetwork(service.getNetwork())
      setRewards(service.getRewards())
      setTotalEarned(service.getBalance())
      setIsLoading(false)
    }

    loadNetworkData()
  }, [networkId, router])

  if (isLoading) {
    return (
      <div className="container max-w-md py-8">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!network) {
    return (
      <div className="container max-w-md py-8">
        <div className="text-center">
          <p>Network not found</p>
          <Link href="/settings/depin">
            <Button className="mt-4">Back to DePIN Networks</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-md pb-16">
      <div className="flex items-center mb-6 mt-6">
        <Link href="/settings/depin">
          <Button variant="ghost" className="p-0 mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
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
            <h1 className="text-2xl font-bold">{network.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">{network.tokenSymbol}</span>
              <Badge variant={network.enabled ? "default" : "outline"}>{network.enabled ? "Active" : "Inactive"}</Badge>
            </div>
          </div>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Total Earned</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="text-4xl font-bold">{totalEarned.toFixed(4)}</div>
            <div className="text-xl ml-2">{network.tokenSymbol}</div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mb-6">
        <Link href={`/depin/${networkId}/activity`} className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            <Activity className="h-4 w-4" />
            Activity
          </Button>
        </Link>
        <Link href={`/depin/${networkId}/settings`} className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Rewards</h2>

      {rewards.length === 0 ? (
        <div className="bg-zinc-900 p-4 rounded-lg text-center text-zinc-400">
          <p>No rewards earned yet</p>
          <p className="text-sm mt-2">Start tracking activities to earn {network.tokenSymbol}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rewards.slice(0, 10).map((reward, index) => (
            <div key={index} className="bg-zinc-900 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                {reward.status === "confirmed" ? (
                  <div className="bg-green-900/20 p-2 rounded-full">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                ) : (
                  <div className="bg-yellow-900/20 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                )}
                <div>
                  <div className="font-medium">
                    {reward.amount.toFixed(4)} {network.tokenSymbol}
                  </div>
                  <div className="text-xs text-zinc-400">{new Date(reward.timestamp).toLocaleString()}</div>
                </div>
              </div>
              <Badge variant={reward.status === "confirmed" ? "default" : "outline"}>
                {reward.status === "confirmed" ? "Confirmed" : "Pending"}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {rewards.length > 10 && (
        <div className="mt-4 text-center">
          <Link href={`/depin/${networkId}/rewards`}>
            <Button variant="link">View All Rewards</Button>
          </Link>
        </div>
      )}

      <div className="mt-8 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
        <h3 className="font-medium mb-2">About {network.name}</h3>
        <p className="text-sm text-zinc-400 mb-4">
          {network.description}. By contributing your activity data, you help build decentralized infrastructure and
          earn {network.tokenSymbol} tokens as rewards.
        </p>
        <Link href={`/depin/${networkId}/info`}>
          <Button variant="outline" size="sm" className="w-full">
            Learn More
          </Button>
        </Link>
      </div>
    </div>
  )
}
