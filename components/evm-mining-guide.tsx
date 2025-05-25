"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Activity, TrendingUp, Shield, Coins } from "lucide-react"
import { EVMDePINNetworks } from "@/services/evm-depin-networks"
import Link from "next/link"

export function EVMMiningGuide() {
  const [activeTab, setActiveTab] = useState("overview")

  // Sort networks by potential profitability (this would be dynamic in a real app)
  const sortedNetworks = [...EVMDePINNetworks].sort((a, b) => {
    const profitabilityMap: Record<string, number> = {
      sweatcoin: 95,
      stepn: 90,
      walken: 85,
      fitmint: 80,
      dotmoovs: 75,
      genopets: 70,
      iotex: 65,
      metaverse: 60,
      playtoearn: 55,
    }

    return (profitabilityMap[b.id] || 0) - (profitabilityMap[a.id] || 0)
  })

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg text-white">
        <h1 className="text-2xl font-bold mb-2">EVM-Compatible DePIN Mining</h1>
        <p className="opacity-90">Earn crypto tokens by contributing your activity data to these networks</p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="networks">Networks</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>What is EVM-Compatible DePIN Mining?</CardTitle>
              <CardDescription>
                Earn tokens on Ethereum-compatible networks through your physical activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Activity-Based Mining</h3>
                  <p className="text-sm text-muted-foreground">
                    Your physical activities like walking, running, and cycling can earn you tokens
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">EVM Compatibility</h3>
                  <p className="text-sm text-muted-foreground">
                    These tokens work on Ethereum-compatible chains, making them easy to trade and use
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Secure & Private</h3>
                  <p className="text-sm text-muted-foreground">
                    Your data is shared securely and only with your permission
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Real Value</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn tokens with real market value that can be traded or used in apps
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab("networks")} className="w-full">
                Explore Networks <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="networks" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {sortedNetworks.map((network) => (
              <Card key={network.id} className="overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{network.name}</CardTitle>
                    <Badge variant="outline" className="font-mono">
                      {network.tokenSymbol}
                    </Badge>
                  </div>
                  <CardDescription>{network.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>
                      Profitability:{" "}
                      {["sweatcoin", "stepn", "walken"].includes(network.id)
                        ? "High"
                        : ["fitmint", "dotmoovs", "genopets"].includes(network.id)
                          ? "Medium"
                          : "Moderate"}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/depin/${network.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profitability" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profitability Comparison</CardTitle>
              <CardDescription>
                Compare potential earnings across different EVM-compatible DePIN networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedNetworks.slice(0, 5).map((network, index) => (
                  <div key={network.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        {network.name} ({network.tokenSymbol})
                      </span>
                      <span className="text-green-600 font-medium">{95 - index * 5}% Relative Profit</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        style={{ width: `${95 - index * 5}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {index === 0 && "Best performer for activity-based mining"}
                      {index === 1 && "Strong market adoption and token value"}
                      {index === 2 && "Good balance of accessibility and rewards"}
                      {index === 3 && "Growing user base with consistent rewards"}
                      {index === 4 && "Specialized rewards for specific activities"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
              <p className="text-sm text-muted-foreground">
                Profitability estimates are based on current market conditions, token values, and mining difficulty.
                Actual results may vary.
              </p>
              <Button onClick={() => setActiveTab("networks")} className="w-full mt-2">
                View All Networks
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
