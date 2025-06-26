"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useBitcoinSignet } from "@/hooks/use-bitcoin-signet"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Server, Activity, Bitcoin, Database, Link } from "lucide-react"

export function BitcoinSignetDashboard() {
  const [nodeUrl, setNodeUrl] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [depositAmount, setDepositAmount] = useState(0.01)
  const {
    isInitialized,
    isInitializing,
    isNodeRunning,
    miningStatus,
    deposits,
    initialize,
    startNode,
    stopNode,
    depositToSidechain,
  } = useBitcoinSignet()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")

  // Handle initialization
  const handleInitialize = async () => {
    if (!nodeUrl) {
      toast({
        title: "Node URL Required",
        description: "Please enter your Bitcoin Signet node URL.",
        variant: "destructive",
      })
      return
    }

    if (!username || !password) {
      toast({
        title: "Credentials Required",
        description: "Please enter your node username and password.",
        variant: "destructive",
      })
      return
    }

    // Initialize the service
    const success = await initialize(nodeUrl, username, password)

    if (success) {
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Bitcoin Signet node.",
      })
      // Clear password for security
      setPassword("")
    } else {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Bitcoin Signet node. Check your credentials and try again.",
        variant: "destructive",
      })
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  // Format hashrate
  const formatHashrate = (hashrate: number) => {
    if (hashrate < 1000) {
      return `${hashrate.toFixed(2)} H/s`
    } else if (hashrate < 1000000) {
      return `${(hashrate / 1000).toFixed(2)} KH/s`
    } else if (hashrate < 1000000000) {
      return `${(hashrate / 1000000).toFixed(2)} MH/s`
    } else {
      return `${(hashrate / 1000000000).toFixed(2)} GH/s`
    }
  }

  // Handle deposit to sidechain
  const handleDeposit = async () => {
    if (depositAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      })
      return
    }

    const result = await depositToSidechain(depositAmount)

    if (result.success) {
      toast({
        title: "Deposit Initiated",
        description: `Successfully initiated deposit of ${depositAmount} BTC to sidechain.`,
      })
    } else {
      toast({
        title: "Deposit Failed",
        description: result.error || "Failed to deposit to sidechain.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bitcoin className="h-5 w-5 text-[#F7931A]" />
          Bitcoin Signet Mining
        </CardTitle>
        <CardDescription>Mine on Bitcoin Signet with BIP300/301 support</CardDescription>
      </CardHeader>
      <CardContent>
        {!isInitialized ? (
          <div className="space-y-4">
            <p className="text-sm text-zinc-400">
              Connect to your Bitcoin Signet node with BIP300/301 support to start mining and interacting with the
              LayerTwoLabs sidechain.
            </p>

            <div className="space-y-3">
              <div>
                <label htmlFor="nodeUrl" className="text-sm font-medium block mb-1">
                  Node URL
                </label>
                <Input
                  id="nodeUrl"
                  placeholder="http://localhost:38332"
                  value={nodeUrl}
                  onChange={(e) => setNodeUrl(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div>
                <label htmlFor="username" className="text-sm font-medium block mb-1">
                  RPC Username
                </label>
                <Input
                  id="username"
                  placeholder="Enter your RPC username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium block mb-1">
                  RPC Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your RPC password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <Button onClick={handleInitialize} disabled={isInitializing} className="w-full">
                {isInitializing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect to Node"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 bg-zinc-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mining">Mining</TabsTrigger>
              <TabsTrigger value="sidechain">Sidechain</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-800 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400 mb-1">Node Status</div>
                  <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-[#F7931A]" />
                    <span className="text-xl font-bold">{isNodeRunning ? "Running" : "Stopped"}</span>
                  </div>
                </div>

                <div className="bg-zinc-800 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400 mb-1">Connected Peers</div>
                  <div className="flex items-center gap-2">
                    <Link className="h-5 w-5 text-blue-400" />
                    <span className="text-xl font-bold">{miningStatus.connectedPeers}</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800 p-3 rounded-lg">
                <div className="text-xs text-zinc-400 mb-2">Mining Status</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    <span className="font-medium">{formatHashrate(miningStatus.hashrate)}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${isNodeRunning ? "bg-green-900/20 text-green-400 border-green-800" : "bg-red-900/20 text-red-400 border-red-800"}`}
                  >
                    {isNodeRunning ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              {miningStatus.lastBlockMined && (
                <div className="bg-zinc-800 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400 mb-2">Last Block Mined</div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Height:</span>
                      <span className="font-medium">{miningStatus.lastBlockMined.height}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Time:</span>
                      <span className="font-medium">{formatTimestamp(miningStatus.lastBlockMined.timestamp)}</span>
                    </div>
                    <div className="text-xs text-zinc-500 truncate">Hash: {miningStatus.lastBlockMined.hash}</div>
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <Button
                  onClick={isNodeRunning ? stopNode : startNode}
                  variant={isNodeRunning ? "destructive" : "default"}
                  className="w-full"
                >
                  {isNodeRunning ? (
                    <>
                      <Server className="h-4 w-4 mr-2" />
                      Stop Mining
                    </>
                  ) : (
                    <>
                      <Server className="h-4 w-4 mr-2" />
                      Start Mining
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="mining" className="space-y-4">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Mining Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Status:</span>
                    <Badge
                      variant="outline"
                      className={`${isNodeRunning ? "bg-green-900/20 text-green-400 border-green-800" : "bg-red-900/20 text-red-400 border-red-800"}`}
                    >
                      {isNodeRunning ? "Mining" : "Idle"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Hashrate:</span>
                    <span className="font-medium">{formatHashrate(miningStatus.hashrate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Connected Peers:</span>
                    <span className="font-medium">{miningStatus.connectedPeers}</span>
                  </div>
                  {miningStatus.lastBlockMined && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span>Last Block Height:</span>
                        <span className="font-medium">{miningStatus.lastBlockMined.height}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Last Block Time:</span>
                        <span className="font-medium">{formatTimestamp(miningStatus.lastBlockMined.timestamp)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-medium mb-2">BIP300/301 Status</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
                    Enabled
                  </Badge>
                  <span className="text-xs text-zinc-400">Drivechain support active</span>
                </div>
                <p className="text-sm text-zinc-400 mb-3">
                  Your node is configured to work with the LayerTwoLabs Bitcoin Signet node implementing BIP300/301
                  drivechain technology.
                </p>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-[#F7931A]" />
                  <span className="text-sm">Connected to LayerTwoLabs sidechain</span>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={isNodeRunning ? stopNode : startNode}
                  variant={isNodeRunning ? "destructive" : "default"}
                  className="w-full"
                >
                  {isNodeRunning ? (
                    <>
                      <Server className="h-4 w-4 mr-2" />
                      Stop Mining
                    </>
                  ) : (
                    <>
                      <Server className="h-4 w-4 mr-2" />
                      Start Mining
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="sidechain" className="space-y-4">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-medium mb-2">LayerTwoLabs Sidechain</h3>
                <p className="text-sm text-zinc-400 mb-3">
                  Deposit Bitcoin to the LayerTwoLabs sidechain to participate in activity mining and earn rewards.
                </p>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="depositAmount" className="text-sm font-medium block mb-1">
                      Deposit Amount (BTC)
                    </label>
                    <Input
                      id="depositAmount"
                      type="number"
                      min="0.001"
                      step="0.001"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number.parseFloat(e.target.value))}
                      className="bg-zinc-700 border-zinc-600"
                    />
                  </div>

                  <Button onClick={handleDeposit} className="w-full" disabled={!isNodeRunning}>
                    Deposit to Sidechain
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Recent Deposits</h3>
                  <Badge>{deposits.length}</Badge>
                </div>

                {deposits.length === 0 ? (
                  <div className="bg-zinc-800 p-4 rounded-lg text-center text-zinc-400 text-sm">
                    No deposits yet. Make your first deposit to the sidechain.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {deposits.map((deposit) => (
                      <div key={deposit.txid} className="bg-zinc-800 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Bitcoin className="h-4 w-4 text-[#F7931A]" />
                            <span className="font-medium">{deposit.amount} BTC</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              deposit.status === "confirmed"
                                ? "bg-green-900/20 text-green-400 border-green-800"
                                : deposit.status === "failed"
                                  ? "bg-red-900/20 text-red-400 border-red-800"
                                  : "bg-yellow-900/20 text-yellow-400 border-yellow-800"
                            }
                          >
                            {deposit.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-zinc-400">{formatTimestamp(deposit.timestamp)}</div>
                        <div className="text-xs text-zinc-500 truncate mt-1">TXID: {deposit.txid}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
