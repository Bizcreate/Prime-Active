"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { EVMDePINNetworks } from "@/services/evm-depin-networks"
import { ThirdwebEVMWallet } from "@/app/wallet/thirdweb-evm-wallet"
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function DePINSetupPage() {
  const [enabledNetworks, setEnabledNetworks] = useState<Record<string, boolean>>({
    iotex: true,
  })
  const [walletConnected, setWalletConnected] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)

  const handleNetworkToggle = (networkId: string) => {
    setEnabledNetworks((prev) => ({
      ...prev,
      [networkId]: !prev[networkId],
    }))
  }

  const handleSetupComplete = () => {
    // In a real app, this would save the configuration
    setSetupComplete(true)
  }

  return (
    <div className="container max-w-md pb-16">
      <h1 className="text-2xl font-bold my-6">DePIN Network Setup</h1>

      {setupComplete ? (
        <Card className="mb-6 border-green-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <CardTitle>Setup Complete</CardTitle>
            </div>
            <CardDescription>Your DePIN networks are ready to use</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              You've successfully set up the following networks:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {Object.entries(enabledNetworks)
                  .filter(([_, enabled]) => enabled)
                  .map(([networkId]) => {
                    const network = EVMDePINNetworks.find((n) => n.id === networkId)
                    return (
                      <li key={networkId}>
                        {network?.name} ({network?.tokenSymbol})
                      </li>
                    )
                  })}
              </ul>
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/activity-tracking" className="w-full">
              <Button className="w-full">
                Start Earning Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>Connect your Thirdweb wallet to receive tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <ThirdwebEVMWallet />
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Networks</CardTitle>
              <CardDescription>Choose which networks you want to mine tokens from</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {EVMDePINNetworks.filter((network) => ["iotex"].includes(network.id)).map((network) => (
                <div key={network.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={network.logoUrl || "/placeholder.svg"}
                      alt={network.name}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/digital-token.png"
                      }}
                    />
                    <div>
                      <p className="font-medium">{network.name}</p>
                      <p className="text-xs text-muted-foreground">{network.tokenSymbol}</p>
                    </div>
                  </div>
                  <Switch
                    checked={enabledNetworks[network.id] || false}
                    onCheckedChange={() => handleNetworkToggle(network.id)}
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSetupComplete} className="w-full">
                Complete Setup
              </Button>
            </CardFooter>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <CardTitle>Account Requirements</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">IoTeX</h3>
              <p className="text-sm text-muted-foreground">
                No additional account needed. Your Thirdweb wallet will work directly with the IoTeX network.
              </p>
            </div>

            <div className="pt-2">
              <p className="text-sm font-medium">Thirdweb Wallet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your Thirdweb wallet is already set up in the Prime Active app. Make sure it's connected to the Ethereum
                mainnet for compatibility with all tokens.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
