"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AppShell } from "@/components/app-shell"
import { TabBar } from "@/components/tab-bar"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Activity, Zap, BarChart3 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type NetworkStatus = {
  network: string
  status: string
  earnings: number
  tokenSymbol: string
  logoUrl: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [networks, setNetworks] = useState<NetworkStatus[]>([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNetworkStatus = async () => {
      if (!user) return

      try {
        // Get active nodes
        const { data: nodes } = await supabase.from("depin_nodes").select("*").eq("user_id", user.id)

        // Get rewards summary
        const { data: rewards } = await supabase.rpc("get_user_depin_earnings", {
          user_id: user.id,
        })

        // Map network logos
        const networkLogos: Record<string, string> = {
          iotex: "/iotex-logo.png",
          myst: "/myst-logo.png",
          helium: "/helium-mobile-logo.png",
          foam: "/foam-protocol-logo.png",
        }

        // Create network status objects
        const networkStatus: NetworkStatus[] = []

        // Add IoTeX
        const iotexNode = nodes?.find((n) => n.network_name === "iotex")
        const iotexRewards = rewards?.find((r) => r.network_name === "iotex")
        networkStatus.push({
          network: "IoTeX",
          status: iotexNode ? "Active" : "Inactive",
          earnings: iotexRewards?.total_amount || 0,
          tokenSymbol: "IOTX",
          logoUrl: networkLogos.iotex,
        })

        // Add Myst
        const mystNode = nodes?.find((n) => n.network_name === "myst")
        const mystRewards = rewards?.find((r) => r.network_name === "myst")
        networkStatus.push({
          network: "Mysterium",
          status: mystNode ? "Active" : "Inactive",
          earnings: mystRewards?.total_amount || 0,
          tokenSymbol: "MYST",
          logoUrl: networkLogos.myst,
        })

        // Calculate total earnings (convert to USD for simplicity)
        const tokenPrices: Record<string, number> = {
          IOTX: 0.025,
          MYST: 0.35,
          MOBILE: 0.01,
          FOAM: 0.05,
        }

        let total = 0
        rewards?.forEach((r) => {
          total += (r.total_amount || 0) * (tokenPrices[r.token_symbol] || 0)
        })

        setNetworks(networkStatus)
        setTotalEarnings(total)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching network status:", error)
        setIsLoading(false)
      }
    }

    fetchNetworkStatus()
  }, [user])

  const activateNetwork = async (network: string) => {
    if (!user) return

    try {
      if (network === "IoTeX") {
        const response = await fetch("/api/iotex/start-mining", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        })

        if (response.ok) {
          toast({
            title: "IoTeX mining activated",
            description: "You'll earn IOTX tokens for your activities",
          })

          // Update networks list
          setNetworks((prev) => prev.map((n) => (n.network === "IoTeX" ? { ...n, status: "Active" } : n)))
        }
      }
    } catch (error) {
      console.error(`Failed to activate ${network}:`, error)
      toast({
        title: `Failed to activate ${network}`,
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  return (
    <AppShell>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">DePIN Networks</h1>
        </div>

        <Card className="mb-6 border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle>Mining Dashboard</CardTitle>
            <CardDescription>Earn tokens from decentralized networks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-4">
              <div className="text-sm text-zinc-400">Total Earnings (USD)</div>
              <div className="text-3xl font-bold">${totalEarnings.toFixed(2)}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-zinc-800 p-3 rounded-lg flex flex-col items-center">
                <Activity className="h-5 w-5 text-primary mb-1" />
                <div className="text-sm text-zinc-400">Active Networks</div>
                <div className="font-medium">{networks.filter((n) => n.status === "Active").length}</div>
              </div>
              <div className="bg-zinc-800 p-3 rounded-lg flex flex-col items-center">
                <Zap className="h-5 w-5 text-primary mb-1" />
                <div className="text-sm text-zinc-400">Total Rewards</div>
                <div className="font-medium">{networks.reduce((acc, n) => acc + n.earnings, 0).toFixed(2)} tokens</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-lg font-medium mb-4">Your Networks</h2>

        <div className="space-y-4">
          {networks.map((network) => (
            <Card key={network.network} className="border-zinc-800 bg-zinc-900">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Image
                    src={network.logoUrl || "/placeholder.svg"}
                    alt={network.network}
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <CardTitle className="text-lg">{network.network}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-zinc-400">Status</div>
                  <div className={`text-sm ${network.status === "Active" ? "text-green-500" : "text-zinc-400"}`}>
                    {network.status}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-zinc-400">Earnings</div>
                  <div className="text-sm">
                    {network.earnings.toFixed(2)} {network.tokenSymbol}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {network.status === "Active" ? (
                  <Link href={`/depin/${network.network.toLowerCase()}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="default"
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => activateNetwork(network.network)}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Activate Mining
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <TabBar activeTab="wallet" />
    </AppShell>
  )
}
