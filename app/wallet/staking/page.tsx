"use client"

import { useState } from "react"
import { ArrowLeft, Lock, Unlock, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { CircularProgress } from "@/components/circular-progress"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const STAKING_OPTIONS = [
  {
    id: "shaka-stake",
    token: "shaka",
    name: "SHAKA",
    icon: "/shaka-coin.png",
    apy: 12,
    minLockPeriod: 7,
    maxLockPeriod: 90,
    balance: 1250.0,
    staked: 500.0,
    rewards: 14.38,
  },
  {
    id: "banana-stake",
    token: "banana",
    name: "BANANA",
    icon: "/shaka-banana.png",
    apy: 18,
    minLockPeriod: 14,
    maxLockPeriod: 120,
    balance: 450.0,
    staked: 200.0,
    rewards: 9.62,
  },
  {
    id: "prime-stake",
    token: "prime",
    name: "PRIME",
    icon: "/activity-token-icon.png",
    apy: 24,
    minLockPeriod: 30,
    maxLockPeriod: 180,
    balance: 75.0,
    staked: 25.0,
    rewards: 1.55,
  },
]

export default function TokenStakingPage() {
  const [activeTab, setActiveTab] = useState("shaka-stake")
  const [amount, setAmount] = useState("")
  const [lockPeriod, setLockPeriod] = useState(30)
  const [isStaking, setIsStaking] = useState(false)

  const activeOption = STAKING_OPTIONS.find((option) => option.id === activeTab)

  const calculateReward = () => {
    if (!activeOption || !amount || isNaN(Number(amount))) return "0.00"

    const principal = Number(amount)
    const apr = activeOption.apy / 100
    const periodInYears = lockPeriod / 365
    const reward = principal * apr * periodInYears

    return reward.toFixed(2)
  }

  const handleStake = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to stake",
        variant: "destructive",
      })
      return
    }

    if (Number(amount) > activeOption.balance) {
      toast({
        title: "Insufficient balance",
        description: `You don't have enough ${activeOption.name} tokens`,
        variant: "destructive",
      })
      return
    }

    setIsStaking(true)

    // Simulate staking process
    setTimeout(() => {
      toast({
        title: "Tokens staked successfully",
        description: `You've staked ${amount} ${activeOption.name} for ${lockPeriod} days`,
        variant: "default",
      })
      setIsStaking(false)
      setAmount("")
    }, 1500)
  }

  const handleSetMaxAmount = () => {
    setAmount(activeOption.balance.toString())
  }

  return (
    <div className="container max-w-md pb-16">
      <div className="flex items-center mb-6 mt-6">
        <Button variant="ghost" className="p-0 mr-2" asChild>
          <a href="/wallet">
            <ArrowLeft className="h-6 w-6" />
          </a>
        </Button>
        <h1 className="text-2xl font-bold">Token Staking</h1>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {STAKING_OPTIONS.map((option) => (
          <Card
            key={option.id}
            className={`p-3 cursor-pointer transition-all ${activeTab === option.id ? "border-primary" : ""}`}
            onClick={() => setActiveTab(option.id)}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <img src={option.icon || "/placeholder.svg"} alt={option.name} className="w-10 h-10 mb-2" />
              <span className="font-semibold text-sm">{option.name}</span>
              <div className="text-xs text-green-600 font-bold mt-1">{option.apy}% APY</div>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="stake" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stake">Stake</TabsTrigger>
          <TabsTrigger value="unstake">Unstake</TabsTrigger>
        </TabsList>
        <TabsContent value="stake">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <img src={activeOption.icon || "/placeholder.svg"} alt={activeOption.name} className="w-6 h-6 mr-2" />
                  {activeOption.name} Staking
                </CardTitle>
                <Badge variant="outline" className="bg-green-50">
                  {activeOption.apy}% APY
                </Badge>
              </div>
              <CardDescription>Stake your tokens to earn passive rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Available Balance</span>
                <span className="font-medium">
                  {activeOption.balance.toFixed(2)} {activeOption.name}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="stake-amount">Stake Amount</Label>
                  <Button variant="ghost" size="sm" className="h-5 text-xs py-0 px-2" onClick={handleSetMaxAmount}>
                    MAX
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="stake-amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <span className="text-gray-500">{activeOption.name}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Lock Period</Label>
                  <span className="text-sm font-medium">{lockPeriod} days</span>
                </div>
                <Slider
                  min={activeOption.minLockPeriod}
                  max={activeOption.maxLockPeriod}
                  step={1}
                  value={[lockPeriod]}
                  onValueChange={(values) => setLockPeriod(values[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Min: {activeOption.minLockPeriod} days</span>
                  <span>Max: {activeOption.maxLockPeriod} days</span>
                </div>
              </div>

              <div className="bg-secondary rounded-md p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    Lock period
                  </span>
                  <span className="font-medium">{lockPeriod} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    Estimated reward
                  </span>
                  <span className="font-bold text-green-600">
                    +{calculateReward()} {activeOption.name}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleStake} disabled={isStaking || !amount || Number(amount) <= 0}>
                {isStaking ? "Processing..." : "Stake Now"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="unstake">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <img src={activeOption.icon || "/placeholder.svg"} alt={activeOption.name} className="w-6 h-6 mr-2" />
                Staked {activeOption.name}
              </CardTitle>
              <CardDescription>View and manage your staked tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center py-4">
                <CircularProgress
                  value={activeOption.staked}
                  maxValue={activeOption.staked + activeOption.balance}
                  size={140}
                  strokeWidth={12}
                  bgStrokeWidth={12}
                  progressColor="hsl(var(--primary))"
                  bgColor="hsl(var(--secondary))"
                  textClassName="text-2xl font-bold"
                  suffix={` ${activeOption.name}`}
                />

                <div className="mt-4 text-center">
                  <div className="text-sm text-muted-foreground">Currently Staked</div>
                  <div className="text-xl font-bold">
                    {activeOption.staked.toFixed(2)} {activeOption.name}
                  </div>
                </div>
              </div>

              <div className="bg-secondary rounded-md p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Earned rewards</span>
                  <span className="font-bold text-green-600">
                    +{activeOption.rewards.toFixed(2)} {activeOption.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center">
                    <Unlock className="w-4 h-4 mr-1" />
                    Unlock date
                  </span>
                  <span className="font-medium">May 29, 2024</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full" variant="outline">
                Claim Rewards
              </Button>
              <Button className="w-full" variant="destructive">
                Unstake Tokens
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Staking Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <img src="/shaka-coin.png" alt="Shaka" className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-medium">SHAKA Rewards</div>
                  <div className="text-xs text-muted-foreground">Earned from staking</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">+14.38</div>
                <div className="text-xs text-green-600">+0.12 daily</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <img src="/shaka-banana.png" alt="Banana" className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-medium">BANANA Rewards</div>
                  <div className="text-xs text-muted-foreground">Earned from staking</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">+9.62</div>
                <div className="text-xs text-green-600">+0.09 daily</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <img src="/activity-token-icon.png" alt="Prime" className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-medium">PRIME Rewards</div>
                  <div className="text-xs text-muted-foreground">Earned from staking</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">+1.55</div>
                <div className="text-xs text-green-600">+0.02 daily</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
