"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { dePINManager } from "@/services/depin-manager"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Power, PowerOff, RefreshCw, Info } from "lucide-react"
import Image from "next/image"

interface IoTeXNodeManagerProps {
  userId?: string
}

export function IoTeXNodeManager({ userId = "default_user" }: IoTeXNodeManagerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [service, setService] = useState<any>(null)
  const [nodeStatus, setNodeStatus] = useState("Inactive")
  const [isNodeActive, setIsNodeActive] = useState(false)
  const [passiveRate, setPassiveRate] = useState(0.5)
  const [isStarting, setIsStarting] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [rewards, setRewards] = useState<any[]>([])
  const [totalMined, setTotalMined] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    loadNodeData()
  }, [userId])

  const loadNodeData = async () => {
    setIsLoading(true)
    try {
      // Get IoTeX service
      const iotexService = dePINManager.getServiceByNetworkId("iotex")
      if (!iotexService) {
        throw new Error("IoTeX service not found")
      }

      // Initialize if needed
      if (!iotexService.isServiceEnabled()) {
        await iotexService.enableMining(userId)
      }

      // Get node status
      const status = iotexService.getNodeStatus()
      const active = iotexService.isNodeActive()
      const rate = iotexService.getPassiveRate()
      const nodeRewards = iotexService.getRewards()

      setService(iotexService)
      setNodeStatus(status)
      setIsNodeActive(active)
      setPassiveRate(rate)
      setRewards(nodeRewards)
      setTotalMined(nodeRewards.reduce((total, reward) => total + reward.amount, 0))
    } catch (error) {
      console.error("Error loading node data:", error)
      toast({
        title: "Error",
        description: "Failed to load node data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartNode = async () => {
    if (!service) return

    setIsStarting(true)
    try {
      const success = await service.startNode()
      if (success) {
        setNodeStatus("Active")
        setIsNodeActive(true)
        toast({
          title: "Node Started",
          description: "Your IoTeX node is now active and mining",
        })
      } else {
        throw new Error("Failed to start node")
      }
    } catch (error) {
      console.error("Error starting node:", error)
      toast({
        title: "Error",
        description: "Failed to start node",
        variant: "destructive",
      })
    } finally {
      setIsStarting(false)
    }
  }

  const handleStopNode = async () => {
    if (!service) return

    setIsStopping(true)
    try {
      const success = await service.stopNode()
      if (success) {
        setNodeStatus("Inactive")
        setIsNodeActive(false)
        toast({
          title: "Node Stopped",
          description: "Your IoTeX node has been stopped",
        })
      } else {
        throw new Error("Failed to stop node")
      }
    } catch (error) {
      console.error("Error stopping node:", error)
      toast({
        title: "Error",
        description: "Failed to stop node",
        variant: "destructive",
      })
    } finally {
      setIsStopping(false)
    }
  }

  const handlePassiveRateChange = (value: number[]) => {
    if (!service) return
    const newRate = value[0]
    setPassiveRate(newRate)
    service.setPassiveRate(newRate)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatTxHash = (hash: string) => {
    if (!hash) return "N/A"
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`
  }

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>IoTeX Node Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!service) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>IoTeX Node Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-zinc-400">IoTeX service not available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Image src="/iotex-logo.png" alt="IoTeX" width={24} height={24} className="h-6 w-6" />
            IoTeX Node Manager
          </CardTitle>
          <Badge variant={isNodeActive ? "default" : "outline"} className="ml-2">
            {nodeStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
          <div>
            <h3 className="font-medium">Node Status</h3>
            <p className="text-sm text-zinc-400">W3bStream Connection</p>
          </div>
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${isNodeActive ? "bg-green-500 animate-pulse" : "bg-zinc-500"}`}
            ></div>
            <span className={isNodeActive ? "text-green-500" : "text-zinc-500"}>
              {isNodeActive ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <div className="p-4 bg-zinc-800 rounded-lg">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">Passive Mining Rate</h3>
            <span className="text-primary font-bold">{passiveRate} IOTX/hr</span>
          </div>
          <Slider
            value={[passiveRate]}
            min={0.1}
            max={2}
            step={0.1}
            onValueChange={handlePassiveRateChange}
            disabled={!isNodeActive}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-zinc-400">
            <span>0.1 IOTX/hr</span>
            <span>2.0 IOTX/hr</span>
          </div>
        </div>

        <div className="p-4 bg-zinc-800 rounded-lg">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">Mining Summary</h3>
            <Button variant="ghost" size="sm" className="h-7 px-2" onClick={loadNodeData}>
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-zinc-900 rounded-lg">
              <p className="text-xs text-zinc-400 mb-1">Total Mined</p>
              <div className="flex items-center">
                <Image src="/iotex-logo.png" alt="IOTX" width={16} height={16} className="mr-1" />
                <span className="font-bold">{totalMined.toFixed(2)} IOTX</span>
              </div>
            </div>
            <div className="p-3 bg-zinc-900 rounded-lg">
              <p className="text-xs text-zinc-400 mb-1">Daily Estimate</p>
              <div className="flex items-center">
                <Image src="/iotex-logo.png" alt="IOTX" width={16} height={16} className="mr-1" />
                <span className="font-bold">{isNodeActive ? (passiveRate * 24).toFixed(2) : "0.00"} IOTX</span>
              </div>
            </div>
          </div>
        </div>

        {rewards.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Recent Rewards</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {rewards.slice(0, 5).map((reward) => (
                <div key={reward.id} className="p-2 bg-zinc-800 rounded-lg text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400">{formatDate(reward.timestamp)}</span>
                    <span className="font-medium text-primary">+{reward.amount.toFixed(2)} IOTX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">TX: {formatTxHash(reward.txHash || "")}</span>
                    <span className="text-zinc-400">{reward.activityId ? "Activity Reward" : "Passive Mining"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-900/20 border border-blue-900 rounded-md p-3 flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-300">
            <p className="mb-1">Your node contributes to the IoTeX W3bStream network while earning IOTX tokens.</p>
            <p>Running the node helps validate activity data and secure the network.</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {isNodeActive ? (
          <Button onClick={handleStopNode} disabled={isStopping} className="w-full bg-red-600 hover:bg-red-700">
            {isStopping ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Stopping...
              </>
            ) : (
              <>
                <PowerOff className="mr-2 h-4 w-4" />
                Stop Node
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleStartNode} disabled={isStarting} className="w-full bg-green-600 hover:bg-green-700">
            {isStarting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Power className="mr-2 h-4 w-4" />
                Start Node
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
