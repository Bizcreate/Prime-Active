"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { dePINManager } from "@/services/depin-manager"
import { iotexService } from "@/services/iotex-service"
import { mystService } from "@/services/myst-service"
import { bitcoinSignetService } from "@/services/bitcoin-signet-service"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Server, Activity, ArrowUpRight, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Define the network colors
const NETWORK_COLORS = {
  iotex: "#00D4D5",
  mystnode: "#8B4CFC",
  bitcoin: "#F7931A",
}

export function CombinedDePINDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [networkEarnings, setNetworkEarnings] = useState<any[]>([])
  const [activeNetworks, setActiveNetworks] = useState<string[]>([])
  const [dailyEarnings, setDailyEarnings] = useState<any[]>([])
  const [activityBoosts, setActivityBoosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true)

      try {
        // Get all services
        const services = dePINManager.getAllServices()

        // Check which networks are active
        const active = services
          .filter((service) => service.isNetworkEnabled())
          .map((service) => service.getNetwork().id)
        setActiveNetworks(active)

        // Get earnings from each network
        const earnings = services.map((service) => {
          const network = service.getNetwork()
          const balance = service.getBalance ? service.getBalance() : 0
          return {
            id: network.id,
            name: network.name,
            tokenSymbol: network.tokenSymbol,
            balance,
            logoUrl: network.logoUrl,
            isActive: service.isNetworkEnabled(),
            isRunning:
              (network.id === "iotex" && iotexService.isNodeRunning()) ||
              (network.id === "mystnode" && mystService.isNodeRunning()) ||
              (network.id === "bitcoin" && bitcoinSignetService.isNodeRunning()),
          }
        })
        setNetworkEarnings(earnings)

        // Calculate total earnings (convert to USD for simplicity)
        // In a real app, you would use actual exchange rates
        const exchangeRates = {
          IOTX: 0.02, // $0.02 per IOTX
          MYST: 0.15, // $0.15 per MYST
          BTC: 50000, // $50,000 per BTC
        }

        const total = earnings.reduce((sum, network) => {
          const rate = exchangeRates[network.tokenSymbol as keyof typeof exchangeRates] || 1
          return sum + network.balance * rate
        }, 0)
        setTotalEarnings(total)

        // Generate mock daily earnings data
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        const daily = days.map((day) => {
          const data: any = { name: day }
          earnings.forEach((network) => {
            if (network.isActive) {
              // Generate random daily earnings
              data[network.id] = Math.random() * (network.id === "bitcoin" ? 0.0001 : 5)
            }
          })
          return data
        })
        setDailyEarnings(daily)

        // Generate mock activity boosts
        const boosts = [
          {
            id: 1,
            activity: "Running",
            boost: 1.5,
            description: "Run 5km to boost your MystNode earnings by 50%",
            network: "mystnode",
            isActive: true,
            progress: 75,
          },
          {
            id: 2,
            activity: "Skateboarding",
            boost: 2.0,
            description: "Skate for 30 minutes to double your IoTeX earnings",
            network: "iotex",
            isActive: false,
            progress: 0,
          },
          {
            id: 3,
            activity: "Surfing",
            boost: 1.75,
            description: "Surf for 1 hour to boost your Bitcoin mining by 75%",
            network: "bitcoin",
            isActive: false,
            progress: 0,
          },
        ]
        setActivityBoosts(boosts)
      } catch (error) {
        console.error("Error loading DePIN data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="networks">Networks</TabsTrigger>
          <TabsTrigger value="boosts">Activity Boosts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle>Total Earnings</CardTitle>
              <CardDescription>Across all DePIN networks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">{formatCurrency(totalEarnings)}</div>

              <div className="space-y-2">
                {networkEarnings.map((network) => (
                  <div key={network.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image
                        src={network.logoUrl || "/placeholder.svg"}
                        alt={network.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span>{network.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {network.balance.toFixed(4)} {network.tokenSymbol}
                      </span>
                      {network.isRunning && (
                        <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle>Daily Earnings</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyEarnings} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => {
                        const network = networkEarnings.find((n) => n.id === name)
                        return [`${value.toFixed(4)} ${network?.tokenSymbol || ""}`, network?.name || name]
                      }}
                    />
                    {networkEarnings
                      .filter((network) => network.isActive)
                      .map((network) => (
                        <Bar
                          key={network.id}
                          dataKey={network.id}
                          stackId="a"
                          fill={NETWORK_COLORS[network.id as keyof typeof NETWORK_COLORS] || "#8884d8"}
                        />
                      ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle>Active Boosts</CardTitle>
              <CardDescription>Boost your earnings with activities</CardDescription>
            </CardHeader>
            <CardContent>
              {activityBoosts.filter((boost) => boost.isActive).length > 0 ? (
                <div className="space-y-3">
                  {activityBoosts
                    .filter((boost) => boost.isActive)
                    .map((boost) => (
                      <div key={boost.id} className="bg-zinc-800 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            <span className="font-medium">{boost.activity}</span>
                          </div>
                          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50">
                            {boost.boost}x Boost
                          </Badge>
                        </div>
                        <div className="w-full bg-zinc-700 rounded-full h-2 mb-1">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${boost.progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-zinc-400">
                          <span>Progress: {boost.progress}%</span>
                          <span>Network: {networkEarnings.find((n) => n.id === boost.network)?.name}</span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-6 text-zinc-400">
                  <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No active boosts</p>
                  <p className="text-sm">Complete activities to boost your earnings</p>
                </div>
              )}

              <Button variant="outline" className="w-full mt-3" onClick={() => setActiveTab("boosts")}>
                View All Boosts
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="networks" className="space-y-4">
          {networkEarnings.map((network) => (
            <Card key={network.id} className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={network.logoUrl || "/placeholder.svg"}
                      alt={network.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <CardTitle>{network.name}</CardTitle>
                      <CardDescription>{network.tokenSymbol} Network</CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      network.isRunning
                        ? "bg-green-900/20 text-green-400 border-green-800"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700"
                    }
                  >
                    {network.isRunning ? "Running" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="py-2 mb-3">
                  <div className="text-2xl font-bold">
                    {network.balance.toFixed(4)} {network.tokenSymbol}
                  </div>
                  <div className="text-sm text-zinc-400">Total Earned</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-zinc-800 p-3 rounded-lg">
                    <div className="text-xs text-zinc-400 mb-1">Daily Average</div>
                    <div className="font-medium">
                      {(network.balance / 30).toFixed(4)} {network.tokenSymbol}
                    </div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded-lg">
                    <div className="text-xs text-zinc-400 mb-1">Status</div>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${network.isRunning ? "bg-green-400" : "bg-zinc-500"}`}
                      ></div>
                      <span className="font-medium">{network.isRunning ? "Online" : "Offline"}</span>
                    </div>
                  </div>
                </div>

                <Link href={`/depin/${network.id}`}>
                  <Button variant="outline" className="w-full">
                    Manage {network.name}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}

          {activeNetworks.length < networkEarnings.length && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="text-center">
                  <Server className="h-8 w-8 mx-auto mb-2 text-zinc-500" />
                  <h3 className="font-medium mb-1">Add More Networks</h3>
                  <p className="text-sm text-zinc-400 mb-3">Connect to more DePIN networks to maximize your earnings</p>
                  <Link href="/settings/depin">
                    <Button>Setup Networks</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="boosts" className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle>Activity Boosts</CardTitle>
              <CardDescription>Complete activities to boost your DePIN earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityBoosts.map((boost) => (
                  <div key={boost.id} className="bg-zinc-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        <span className="font-medium">{boost.activity}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          boost.isActive
                            ? "bg-primary/20 text-primary border-primary/50"
                            : "bg-zinc-700 text-zinc-400 border-zinc-600"
                        }
                      >
                        {boost.boost}x Boost
                      </Badge>
                    </div>

                    <p className="text-sm text-zinc-400 mb-3">{boost.description}</p>

                    {boost.isActive && (
                      <>
                        <div className="w-full bg-zinc-700 rounded-full h-2 mb-1">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${boost.progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-zinc-400 mb-3">
                          <span>Progress: {boost.progress}%</span>
                          <span>{boost.progress < 100 ? "In Progress" : "Completed"}</span>
                        </div>
                      </>
                    )}

                    <div className="flex items-center text-xs text-zinc-400">
                      <Image
                        src={networkEarnings.find((n) => n.id === boost.network)?.logoUrl || ""}
                        alt={boost.network}
                        width={16}
                        height={16}
                        className="rounded-full mr-1"
                      />
                      <span>Boosts {networkEarnings.find((n) => n.id === boost.network)?.name} earnings</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/start-activity">
                <Button className="w-full mt-4">Start New Activity</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle>How Boosts Work</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full mt-1">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Complete Activities</h4>
                    <p className="text-sm text-zinc-400">
                      Track your physical activities like running, skateboarding, or surfing
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full mt-1">
                    <Zap className="h-4 w-4 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">Earn Boosts</h4>
                    <p className="text-sm text-zinc-400">
                      Activities unlock earning boosts for specific DePIN networks
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full mt-1">
                    <Server className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">Increased Earnings</h4>
                    <p className="text-sm text-zinc-400">Active boosts multiply your earnings from DePIN networks</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
