"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { dePINManager } from "@/services/depin-manager"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

export default function WithdrawPage() {
  const [selectedNetwork, setSelectedNetwork] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [address, setAddress] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [networks, setNetworks] = useState<any[]>([])
  const [maxAmount, setMaxAmount] = useState<number>(0)
  const { toast } = useToast()

  useState(() => {
    // Load networks and balances
    const services = dePINManager.getAllServices()
    const networkData = services.map((service) => {
      const network = service.getNetwork()
      return {
        id: network.id,
        name: network.name,
        symbol: network.tokenSymbol,
        balance: service.getBalance(),
        logoUrl: network.logoUrl,
      }
    })
    setNetworks(networkData)
  }, [])

  const handleNetworkChange = (networkId: string) => {
    setSelectedNetwork(networkId)
    const network = networks.find((n) => n.id === networkId)
    if (network) {
      setMaxAmount(network.balance)
      setAmount("")
    }
  }

  const handleMaxAmount = () => {
    setAmount(maxAmount.toString())
  }

  const handleWithdraw = async () => {
    if (!selectedNetwork || !amount || !address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > maxAmount) {
      toast({
        title: "Invalid Amount",
        description: `Please enter an amount between 0 and ${maxAmount}`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real implementation, this would call the actual withdrawal function
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Testnet Mode",
        description: "Withdrawals are not available in testnet mode. This is just a simulation.",
      })
    } catch (error) {
      console.error("Error withdrawing tokens:", error)
      toast({
        title: "Error",
        description: "Failed to withdraw tokens",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md pb-16">
      <div className="flex items-center mb-6 mt-6">
        <Link href="/wallet">
          <Button variant="ghost" className="p-0 mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Withdraw Tokens</h1>
      </div>

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Testnet Mode</AlertTitle>
        <AlertDescription>
          Currently in testnet mode. Withdrawals are simulated and no real tokens will be transferred.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Withdraw DePIN Tokens</CardTitle>
          <CardDescription>Transfer your earned tokens to an external wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="network">Select Network</Label>
            <Select value={selectedNetwork} onValueChange={handleNetworkChange}>
              <SelectTrigger id="network">
                <SelectValue placeholder="Select a network" />
              </SelectTrigger>
              <SelectContent>
                {networks.map((network) => (
                  <SelectItem key={network.id} value={network.id}>
                    <div className="flex items-center gap-2">
                      <Image
                        src={network.logoUrl || "/placeholder.svg"}
                        alt={network.name}
                        width={16}
                        height={16}
                        className="rounded-full"
                      />
                      <span>
                        {network.name} ({network.symbol})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedNetwork && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="amount">Amount</Label>
                  <span className="text-xs text-zinc-400">
                    Balance: {maxAmount.toFixed(4)} {networks.find((n) => n.id === selectedNetwork)?.symbol}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <Button variant="outline" size="sm" onClick={handleMaxAmount}>
                    Max
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Destination Address</Label>
                <Input
                  id="address"
                  placeholder="Enter wallet address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="bg-zinc-800 p-3 rounded-md text-sm text-zinc-400">
                <p>
                  <strong>Note:</strong> Withdrawals may require gas fees paid in the native token of the selected
                  network.
                </p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleWithdraw}
            disabled={isLoading || !selectedNetwork || !amount || !address}
          >
            {isLoading ? "Processing..." : "Withdraw Tokens"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
