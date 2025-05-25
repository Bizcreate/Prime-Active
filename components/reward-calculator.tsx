"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator } from "lucide-react"

export function RewardCalculator() {
  // PoW state
  const [cpuCores, setCpuCores] = useState(4)
  const [cpuSpeed, setCpuSpeed] = useState(3.5)
  const [gpuMemory, setGpuMemory] = useState(8)
  const [gpuHashrate, setGpuHashrate] = useState(30)
  const [powHours, setPowHours] = useState(12)

  // PoS state
  const [stakeAmount, setStakeAmount] = useState(1000)
  const [stakeDuration, setStakeDuration] = useState(30)

  // Results state
  const [powResults, setPowResults] = useState({
    dailyReward: 0,
    monthlyReward: 0,
    yearlyReward: 0,
  })

  const [posResults, setPosResults] = useState({
    dailyReward: 0,
    monthlyReward: 0,
    yearlyReward: 0,
  })

  const calculatePowRewards = () => {
    // Simple formula for demonstration purposes
    const hashPower = cpuCores * cpuSpeed * 10 + gpuMemory * gpuHashrate * 5
    const hoursMultiplier = powHours / 24

    const dailyReward = (hashPower * 0.01 * hoursMultiplier).toFixed(2)
    const monthlyReward = (Number.parseFloat(dailyReward) * 30).toFixed(2)
    const yearlyReward = (Number.parseFloat(dailyReward) * 365).toFixed(2)

    setPowResults({
      dailyReward: Number.parseFloat(dailyReward),
      monthlyReward: Number.parseFloat(monthlyReward),
      yearlyReward: Number.parseFloat(yearlyReward),
    })
  }

  const calculatePosRewards = () => {
    // Simple formula for demonstration purposes
    const apy = 12 // 12% APY

    const dailyReward = ((stakeAmount * (apy / 100)) / 365).toFixed(2)
    const monthlyReward = (Number.parseFloat(dailyReward) * 30).toFixed(2)
    const yearlyReward = (Number.parseFloat(dailyReward) * 365).toFixed(2)

    setPosResults({
      dailyReward: Number.parseFloat(dailyReward),
      monthlyReward: Number.parseFloat(monthlyReward),
      yearlyReward: Number.parseFloat(yearlyReward),
    })
  }

  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <Tabs defaultValue="pow">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="pow">Proof of Work (Mining)</TabsTrigger>
          <TabsTrigger value="pos">Proof of Stake</TabsTrigger>
        </TabsList>

        <TabsContent value="pow" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="cpu-cores">CPU Cores</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="cpu-cores"
                  min={1}
                  max={32}
                  step={1}
                  value={[cpuCores]}
                  onValueChange={(value) => setCpuCores(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center font-medium">{cpuCores}</span>
              </div>
            </div>

            <div>
              <Label htmlFor="cpu-speed">CPU Speed (GHz)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="cpu-speed"
                  min={1}
                  max={5}
                  step={0.1}
                  value={[cpuSpeed]}
                  onValueChange={(value) => setCpuSpeed(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center font-medium">{cpuSpeed}</span>
              </div>
            </div>

            <div>
              <Label htmlFor="gpu-memory">GPU Memory (GB)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="gpu-memory"
                  min={0}
                  max={24}
                  step={1}
                  value={[gpuMemory]}
                  onValueChange={(value) => setGpuMemory(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center font-medium">{gpuMemory}</span>
              </div>
            </div>

            <div>
              <Label htmlFor="gpu-hashrate">GPU Hashrate (MH/s)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="gpu-hashrate"
                  min={0}
                  max={100}
                  step={1}
                  value={[gpuHashrate]}
                  onValueChange={(value) => setGpuHashrate(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center font-medium">{gpuHashrate}</span>
              </div>
            </div>

            <div>
              <Label htmlFor="pow-hours">Mining Hours per Day</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="pow-hours"
                  min={1}
                  max={24}
                  step={1}
                  value={[powHours]}
                  onValueChange={(value) => setPowHours(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center font-medium">{powHours}</span>
              </div>
            </div>

            <div className="flex items-end">
              <Button onClick={calculatePowRewards} className="w-full gap-2">
                <Calculator className="h-4 w-4" />
                Calculate Rewards
              </Button>
            </div>
          </div>

          {powResults.dailyReward > 0 && (
            <div className="mt-6 rounded-lg border border-zinc-800 bg-black p-4">
              <h4 className="mb-4 text-lg font-medium text-white">Estimated Rewards</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-md bg-zinc-900 p-3 text-center">
                  <p className="text-sm text-zinc-500">Daily</p>
                  <p className="text-2xl font-bold text-primary">{powResults.dailyReward} TOKENS</p>
                </div>
                <div className="rounded-md bg-zinc-900 p-3 text-center">
                  <p className="text-sm text-zinc-500">Monthly</p>
                  <p className="text-2xl font-bold text-primary">{powResults.monthlyReward} TOKENS</p>
                </div>
                <div className="rounded-md bg-zinc-900 p-3 text-center">
                  <p className="text-sm text-zinc-500">Yearly</p>
                  <p className="text-2xl font-bold text-primary">{powResults.yearlyReward} TOKENS</p>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-zinc-500">
                Estimates are based on current network difficulty and token price. Actual rewards may vary.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pos" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="stake-amount">Stake Amount (TOKENS)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="stake-amount"
                  type="number"
                  min={0}
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Number.parseFloat(e.target.value) || 0)}
                  className="flex-1"
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500">Enter the amount of tokens you plan to stake</p>
            </div>

            <div>
              <Label htmlFor="stake-duration">Staking Duration (Days)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="stake-duration"
                  min={1}
                  max={365}
                  step={1}
                  value={[stakeDuration]}
                  onValueChange={(value) => setStakeDuration(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center font-medium">{stakeDuration}</span>
              </div>
            </div>

            <div className="flex items-end">
              <Button onClick={calculatePosRewards} className="w-full gap-2">
                <Calculator className="h-4 w-4" />
                Calculate Rewards
              </Button>
            </div>
          </div>

          {posResults.dailyReward > 0 && (
            <div className="mt-6 rounded-lg border border-zinc-800 bg-black p-4">
              <h4 className="mb-4 text-lg font-medium text-white">Estimated Rewards</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-md bg-zinc-900 p-3 text-center">
                  <p className="text-sm text-zinc-500">Daily</p>
                  <p className="text-2xl font-bold text-primary">{posResults.dailyReward} TOKENS</p>
                </div>
                <div className="rounded-md bg-zinc-900 p-3 text-center">
                  <p className="text-sm text-zinc-500">Monthly</p>
                  <p className="text-2xl font-bold text-primary">{posResults.monthlyReward} TOKENS</p>
                </div>
                <div className="rounded-md bg-zinc-900 p-3 text-center">
                  <p className="text-sm text-zinc-500">Yearly</p>
                  <p className="text-2xl font-bold text-primary">{posResults.yearlyReward} TOKENS</p>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-zinc-500">
                Estimates are based on current network conditions and token price. Actual rewards may vary.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
