"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { dePINManager } from "@/services/depin-manager"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Lock, ArrowRight, Check } from "lucide-react"
import { generateMockTxHash } from "@/lib/crypto-utils"
import Image from "next/image"

interface DePINNetworkTokenStakerProps {
  networkId: string
}

export function DePINNetworkTokenStaker({ networkId }: DePINNetworkTokenStakerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [network, setNetwork] = useState<any>(null)
  const [service, setService] = useState<any>(null)
  const [balance, setBalance] = useState(0)
  const [stakeAmount, setStakeAmount] = useState(0)
  const [maxStake, setMaxStake] = useState(100)
  const [isStaking, setIsStaking] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadNetworkData()
  }, [networkId])

  const loadNetworkData = async () => {
    setIsLoading(true)
    try {
      const service = dePINManager.getServiceByNetworkId(networkId)
      if (!service) {
        throw new Error(`Network ${networkId} not found`)
      }

      const network = service.getNetwork()
      const balance = service.getBalance()

      setService(service)
      setNetwork(network)
      setBalance(balance)
      setMaxStake(Math.max(100, balance * 2))
      setStakeAmount(Math.min(10, balance))
    } catch (error) {
      console.error("Error loading network data:", error)
      toast({
        title: "Error",
        description: "Failed to load network data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStakeAmountChange = (value: number[]) => {
    setStakeAmount(value[0])
  }

  const handleStake = async () => {
    if (stakeAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid stake amount",
        variant: "destructive",
      })
      return
    }

    setIsStaking(true)
    try {
      // Simulate staking delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a mock transaction hash
      const txHash = generateMockTxHash()

      // Show success message
      setIsSuccess(true)
      toast({
        title: "Staking successful",
        description: `Successfully staked ${stakeAmount} ${network.tokenSymbol}`,
      })

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
        loadNetworkData() // Refresh data
      }, 3000)
    } catch (error) {
      console.error("Error staking tokens:", error)
      toast({
        title: "Staking failed",
        description: "Failed to stake tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStaking(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Token Staking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!network) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Token Staking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lock className="h-8 w-8 mx-auto mb-4 text-zinc-500" />
            <p className="text-zinc-400">Network not found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image
            src={network.logoUrl || "/placeholder.svg"}
            alt={network.name}
            width={24}
            height={24}
            className="h-6 w-6"
          />
          {network.name} Staking
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-900/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Staking Successful!</h3>
            <p className="text-zinc-400">
              You've successfully staked {stakeAmount} {network.tokenSymbol}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-zinc-400">Available Balance</span>
                <span className="font-medium">
                  {balance} {network.tokenSymbol}
                </span>
              </div>
              <div className="p-4 bg-zinc-800 rounded-lg">
                <div className="flex justify-between mb-4">
                  <span className="text-sm">Stake Amount</span>
                  <span className="font-bold text-primary">
                    {stakeAmount} {network.tokenSymbol}
                  </span>
                </div>
                <Slider
                  value={[stakeAmount]}
                  min={0}
                  max={maxStake}
                  step={1}
                  onValueChange={handleStakeAmountChange}
                  className="mb-4"
                />
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>0 {network.tokenSymbol}</span>
                  <span>
                    {maxStake} {network.tokenSymbol}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-zinc-400">Staking Period</span>
                <span className="font-medium">30 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-400">Estimated APY</span>
                <span className="font-medium text-green-400">12.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-400">Rewards</span>
                <span className="font-medium">
                  ~{((stakeAmount * 0.125) / 12).toFixed(2)} {network.tokenSymbol}/month
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        {!isSuccess && (
          <Button
            onClick={handleStake}
            disabled={isStaking || stakeAmount <= 0}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isStaking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Staking...
              </>
            ) : (
              <>
                Stake Tokens
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
