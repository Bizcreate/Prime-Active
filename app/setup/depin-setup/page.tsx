"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IoTeXService } from "@/services/iotex-service"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function DePINSetupPage() {
  const { toast } = useToast()
  const [iotexService, setIotexService] = useState<IoTeXService | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNodeActive, setIsNodeActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Initialize IoTeX service
    const initIoTeX = async () => {
      try {
        // In a real app, we would get these values from environment variables or user settings
        const service = new IoTeXService({
          nodeUrl: "https://babel-api.testnet.iotex.io",
          isTestnet: true,
          apiKey: "test-key",
        })

        // For demo purposes, enable mining with a mock user ID
        await service.enableMining("user-123")

        // Check if node is active
        const nodeActive = service.isNodeActive()
        setIsNodeActive(nodeActive)

        setIotexService(service)
      } catch (error) {
        console.error("Failed to initialize IoTeX service:", error)
        toast({
          title: "Error",
          description: "Failed to initialize IoTeX service. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    initIoTeX()
  }, [toast])

  const handleToggleNode = async () => {
    if (!iotexService) return

    try {
      setIsProcessing(true)

      let success: boolean

      if (isNodeActive) {
        // Stop node
        success = await iotexService.stopNode()
        if (success) {
          setIsNodeActive(false)
          toast({
            title: "Node stopped",
            description: "Your IoTeX node has been stopped successfully.",
          })
        }
      } else {
        // Start node
        success = await iotexService.startNode()
        if (success) {
          setIsNodeActive(true)
          toast({
            title: "Node started",
            description: "Your IoTeX node is now mining tokens.",
          })
        }
      }

      if (!success) {
        toast({
          title: "Operation failed",
          description: `Failed to ${isNodeActive ? "stop" : "start"} the node.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling node:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">DePIN Setup</h1>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">DePIN Setup</h1>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                {iotexService && (
                  <Image src="/iotex-logo.png" alt="IoTeX" width={32} height={32} className="rounded-full" />
                )}
                <div>
                  <CardTitle>IoTeX DePIN Network</CardTitle>
                  <CardDescription>Connect your activities to the IoTeX blockchain</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                IoTeX is a decentralized network for Internet of Things (IoT) powered by a privacy-centric blockchain.
                By connecting your Prime Active account, you can earn IOTX tokens for your activities.
              </p>

              <div className="bg-zinc-800 p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">Node Status</h3>
                <p className="text-sm mb-3">
                  {isNodeActive ? "Your node is active and mining IOTX tokens" : "Your node is currently inactive"}
                </p>
                <Button
                  className="w-full md:w-auto"
                  variant={isNodeActive ? "destructive" : "default"}
                  onClick={handleToggleNode}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                      Processing...
                    </div>
                  ) : isNodeActive ? (
                    "Stop Node"
                  ) : (
                    "Start Node"
                  )}
                </Button>
              </div>

              {isNodeActive && (
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Mining Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-zinc-400">Current Rate</p>
                      <p className="font-medium">0.01 IOTX/min</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Today's Earnings</p>
                      <p className="font-medium">5.42 IOTX</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>IoTeX Mining Rewards</CardTitle>
              <CardDescription>Track your earnings from IoTeX mining</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Reward Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm">Base Mining Reward</p>
                      <p className="font-medium">5.00 IOTX/day</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Merch Wear-to-Earn Bonus</p>
                      <p className="font-medium text-green-500">+3.50 IOTX/day</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Activity Level Bonus</p>
                      <p className="font-medium text-green-500">+4.00 IOTX/day</p>
                    </div>
                    <div className="border-t border-zinc-700 my-2"></div>
                    <div className="flex justify-between">
                      <p className="font-medium">Total Daily Rewards</p>
                      <p className="font-medium">12.50 IOTX/day</p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Recent Earnings</h3>
                  <div className="space-y-2">
                    {[
                      { date: "May 3", amount: 12.35 },
                      { date: "May 2", amount: 11.82 },
                      { date: "May 1", amount: 12.08 },
                    ].map((entry, idx) => (
                      <div key={idx} className="flex justify-between">
                        <p className="text-sm">{entry.date}</p>
                        <p className="font-medium">{entry.amount} IOTX</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>IoTeX Settings</CardTitle>
              <CardDescription>Configure your IoTeX mining preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Passive Mining Rate</h3>
                  <p className="text-sm mb-2">
                    Set how much of your device's resources to allocate for passive mining.
                  </p>
                  <div className="flex items-center gap-2">
                    <input type="range" min="0" max="100" defaultValue="50" className="w-full" />
                    <span>50%</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Network</h3>
                  <p className="text-sm">
                    Currently connected to: {iotexService?.isTestnet ? "IoTeX Testnet" : "IoTeX Mainnet"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Disconnect IoTeX</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
