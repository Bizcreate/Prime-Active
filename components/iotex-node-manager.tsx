"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Activity,
  Server,
  Cpu,
  HardDrive,
  Clock,
  Upload,
  Download,
  Coins,
  Play,
  Pause,
  RefreshCw,
  LinkIcon,
} from "lucide-react"
import { dePINManager } from "@/services/depin-manager"
import type { IoTeXService } from "@/services/iotex-service"
import type { W3bStreamNodeStatus, W3bStreamReward } from "@/services/w3bstream-service"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export function IoTeXNodeManager() {
  const { toast } = useToast()
  const [iotexService, setIotexService] = useState<IoTeXService | null>(null)
  const [isNodeActive, setIsNodeActive] = useState(false)
  const [nodeStatus, setNodeStatus] = useState<W3bStreamNodeStatus | null>(null)
  const [rewards, setRewards] = useState<W3bStreamReward[]>([])
  const [totalMined, setTotalMined] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("status")
  const [refreshKey, setRefreshKey] = useState(0)
  const [projectDetails, setProjectDetails] = useState<{ id: string; version: string } | null>(null)

  useEffect(() => {
    // Get IoTeX service from DePIN manager
    const service = dePINManager.getService("iotex") as IoTeXService
    if (service) {
      setIotexService(service)

      // Check if node is active
      const active = service.isNodeActive()
      setIsNodeActive(active)

      // Get node status
      const status = service.getNodeStatus()
      setNodeStatus(status)

      // Get rewards
      const rewardsList = service.getRewards()
      setRewards(rewardsList)

      // Calculate total mined
      const total = rewardsList.reduce((sum, reward) => sum + reward.amount, 0)
      setTotalMined(total)

      // Get project details
      const details = service.getProjectDetails()
      setProjectDetails(details)

      // Sync rewards with W3bStream
      service.syncRewardsWithW3bStream()
    }

    setIsLoading(false)
  }, [refreshKey])

  // Refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const toggleNode = async () => {
    if (!iotexService) return

    setIsLoading(true)

    try {
      let success

      if (isNodeActive) {
        // Stop node
        success = await iotexService.stopNode()
        if (success) {
          toast({
            title: "Node stopped",
            description: "Your IoTeX node has been stopped successfully.",
          })
        }
      } else {
        // Start node
        success = await iotexService.startNode()
        if (success) {
          toast({
            title: "Node started",
            description: "Your IoTeX node is now mining tokens.",
          })
        }
      }

      if (success) {
        setIsNodeActive(!isNodeActive)
        // Refresh data
        setRefreshKey((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error toggling node:", error)
      toast({
        title: "Error",
        description: "Failed to toggle node status. Please try again.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const formatUptime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ${seconds % 60}s`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ${minutes % 60}m`

    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h`
  }

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString()
  }

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-400">Loading node data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!iotexService) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-zinc-400 mb-4">IoTeX service not available</p>
            <Button onClick={() => setRefreshKey((prev) => prev + 1)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/iotex-logo.png" alt="IoTeX" width={32} height={32} className="rounded-full" />
            <div>
              <CardTitle className="text-lg">IoTeX Node</CardTitle>
              {projectDetails && (
                <p className="text-xs text-zinc-400">
                  W3bStream Project: {projectDetails.id} ({projectDetails.version})
                </p>
              )}
            </div>
          </div>
          <Badge variant={isNodeActive ? "default" : "outline"} className={isNodeActive ? "bg-green-600" : ""}>
            {isNodeActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-zinc-400">Total Mined</p>
            <p className="text-2xl font-bold">{totalMined.toFixed(2)} IOTX</p>
          </div>
          <Button
            onClick={toggleNode}
            variant={isNodeActive ? "destructive" : "default"}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isNodeActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop Node
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Node
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="status" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="status">
            {nodeStatus && (
              <div className="space-y-4">
                {projectDetails && (
                  <div className="bg-zinc-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <LinkIcon className="h-4 w-4 text-blue-400" />
                      <p className="text-sm">W3bStream Project</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-zinc-700">
                        General
                      </Badge>
                      <Badge variant="outline" className="bg-zinc-700">
                        Geo-location
                      </Badge>
                      <Badge variant="outline" className="bg-zinc-700">
                        Energy
                      </Badge>
                      <Badge variant="outline" className="bg-zinc-700">
                        Mobility
                      </Badge>
                      <Badge variant="outline" className="bg-zinc-700">
                        Environmental
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-zinc-400" />
                      <p className="text-sm text-zinc-400">Uptime</p>
                    </div>
                    <p className="text-lg font-medium">{formatUptime(nodeStatus.uptime)}</p>
                  </div>

                  <div className="bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-zinc-400" />
                      <p className="text-sm text-zinc-400">Data Points</p>
                    </div>
                    <p className="text-lg font-medium">{nodeStatus.dataPoints.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-zinc-800 rounded-lg p-4">
                  <p className="text-sm text-zinc-400 mb-3">Resource Usage</p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-blue-400" />
                          <p className="text-sm">CPU</p>
                        </div>
                        <p className="text-sm">{nodeStatus.cpu.toFixed(1)}%</p>
                      </div>
                      <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${nodeStatus.cpu}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-purple-400" />
                          <p className="text-sm">Memory</p>
                        </div>
                        <p className="text-sm">{nodeStatus.memory.toFixed(1)}%</p>
                      </div>
                      <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${nodeStatus.memory}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4 text-green-400" />
                          <p className="text-sm">Storage</p>
                        </div>
                        <p className="text-sm">{nodeStatus.storage.toFixed(1)}%</p>
                      </div>
                      <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${nodeStatus.storage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-800 rounded-lg p-4">
                  <p className="text-sm text-zinc-400 mb-3">Network</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-zinc-700 p-2 rounded-full">
                        <Upload className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Upload</p>
                        <p className="text-sm font-medium">{formatBytes(nodeStatus.bandwidth.up)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-zinc-700 p-2 rounded-full">
                        <Download className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Download</p>
                        <p className="text-sm font-medium">{formatBytes(nodeStatus.bandwidth.down)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-zinc-400">Last Seen</p>
                    <p className="text-sm">{formatDate(nodeStatus.lastSeen)}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rewards">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-zinc-400">Recent Rewards</p>
                <Button variant="ghost" size="sm" onClick={() => setRefreshKey((prev) => prev + 1)}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              {rewards.length === 0 ? (
                <div className="bg-zinc-800 rounded-lg p-4 text-center">
                  <p className="text-zinc-400">No rewards yet</p>
                  <p className="text-xs text-zinc-500 mt-1">Start your node to begin earning IOTX</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {rewards
                    .slice()
                    .reverse()
                    .map((reward) => (
                      <div key={reward.id} className="bg-zinc-800 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <Coins
                              className={`h-4 w-4 ${reward.type === "activity" ? "text-green-400" : "text-yellow-400"}`}
                            />
                            <div>
                              <p className="text-sm font-medium">{reward.amount.toFixed(4)} IOTX</p>
                              <p className="text-xs text-zinc-400">
                                {reward.type === "activity" ? "Activity Reward" : "Passive Mining"}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-zinc-500">{formatDate(reward.timestamp)}</p>
                        </div>
                        {reward.activityId && (
                          <p className="text-xs text-zinc-500 mt-1">
                            Activity ID: {reward.activityId.substring(0, 8)}...
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}

              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm">Mining Rate</p>
                  <p className="text-sm font-medium">{iotexService.getPassiveRate().toFixed(4)} IOTX/min</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">Estimated Daily</p>
                  <p className="text-sm font-medium">{(iotexService.getPassiveRate() * 60 * 24).toFixed(2)} IOTX/day</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm font-medium">Auto-start Node</p>
                    <p className="text-xs text-zinc-400">Start node automatically when app opens</p>
                  </div>
                  <Switch checked={false} />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Activity Notifications</p>
                    <p className="text-xs text-zinc-400">Get notified about mining rewards</p>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <p className="text-sm font-medium mb-3">Node Version</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-zinc-400">W3bStream Client</p>
                  <p className="text-sm">{nodeStatus?.version || "1.0.0"}</p>
                </div>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Advanced</p>
                <Button variant="outline" size="sm" className="w-full">
                  Reset Node Data
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
