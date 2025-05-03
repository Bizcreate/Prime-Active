"use client"

import { useState } from "react"
import { EVMMiningGuide } from "@/components/evm-mining-guide"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Wallet, Activity, Zap } from "lucide-react"
import Link from "next/link"

export default function EVMMiningPage() {
  const [walletConnected, setWalletConnected] = useState(false)

  const handleConnectWallet = () => {
    // In a real app, this would connect to MetaMask or another wallet
    setWalletConnected(true)
  }

  return (
    <div className="container max-w-md pb-16">
      <h1 className="text-2xl font-bold my-6">EVM Token Mining</h1>

      {!walletConnected ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Connect an EVM-compatible wallet to start earning tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You'll need an Ethereum-compatible wallet like MetaMask to receive your earned tokens.
            </p>
            <div className="flex items-center justify-center p-6 border border-dashed rounded-lg">
              <Wallet className="h-12 w-12 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleConnectWallet} className="w-full">
              Connect Wallet
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mb-6 border-green-500">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Wallet Connected</CardTitle>
              <div className="bg-green-100 p-1 rounded-full">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <CardDescription>0x71C7...F3a2</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tokens">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="tokens">Tokens</TabsTrigger>
                <TabsTrigger value="nfts">NFTs</TabsTrigger>
              </TabsList>
              <TabsContent value="tokens" className="space-y-2 mt-2">
                <div className="flex justify-between items-center p-3 bg-secondary rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1 rounded-full">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>SWEAT</span>
                  </div>
                  <span className="font-medium">0.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-1 rounded-full">
                      <Zap className="h-4 w-4 text-green-600" />
                    </div>
                    <span>WLKN</span>
                  </div>
                  <span className="font-medium">0.00</span>
                </div>
              </TabsContent>
              <TabsContent value="nfts" className="mt-2">
                <div className="text-center py-4 text-muted-foreground">No NFTs found</div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Link href="/settings/depin" className="w-full">
              <Button variant="outline" className="w-full">
                Manage Wallet
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}

      <EVMMiningGuide />

      <div className="mt-6">
        <Link href="/activity-tracking">
          <Button className="w-full">
            Start Earning Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
