"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Server, Clock, Upload, Download, AlertCircle, Check, Wifi, Globe } from "lucide-react"
import { useMystNode } from "@/hooks/use-myst-node"
import { LoadingScreen } from "@/components/loading-screen"
import Image from "next/image"
import Link from "next/link"

export function MystNodeDashboard() {
  const { isConnected, isRunning, balance, nodeStats, isLoading, connect, startNode, stopNode } = useMystNode()
  const [apiKey, setApiKey] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    await connect(apiKey)
    setIsConnecting(false)
  }

  const formatBytes = (bytes: number): string => {
    if (!bytes) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDuration = (ms: number): string => {
    if (!ms) return "0m"
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isConnected) {
    return (
      <div className="container max-w-lg py-8">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-zinc-800 p-2 rounded-full">
                  <Image src="/myst-logo.png" alt="Mysterium Network" width={32} height={32} className="h-8 w-8" />
                </div>
                <CardTitle className="text-lg">Connect to MystNodes</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-zinc-400">
                Share your unused internet bandwidth and earn MYST tokens. Set up your MystNode to start earning passive
                income while supporting a decentralized VPN network.
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
                MystNodes API Key
              </label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your MystNodes API key"
                className="bg-zinc-800 border-zinc-700"
              />
              <p className="text-xs text-zinc-500 mt-1">Get your API key from your MystNodes account</p>
            </div>

            <Button onClick={handleConnect} disabled={isConnecting || !apiKey} className="w-full">
              {isConnecting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <Server className="mr-2 h-4 w-4" />
                  Connect to MystNodes
                </>
              )}
            </Button>

            <div className="mt-4 text-center">
              <a
                href="https://mystnodes.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline hover:text-primary/80"
              >
                Don't have an account? Sign up on MystNodes
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-lg py-8">
      <Card className="bg-zinc-900 border-zinc-800 mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-800 p-2 rounded-full">
                <Image src="/myst-logo.png" alt="Mysterium Network" width={32} height={32} className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-lg">MystNode Dashboard</CardTitle>
                <p className="text-xs text-zinc-400">Mysterium Network</p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={
                isRunning
                  ? "bg-green-900/20 text-green-400 border-green-800"
                  : "bg-yellow-900/20 text-yellow-400 border-yellow-800"
              }
            >
              {isRunning ? "Running" : "Stopped"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="py-3 mb-4 text-center">
            <div className="text-3xl font-bold mb-1">{balance.toFixed(4)} MYST</div>
            <div className="text-sm text-zinc-400">Total Earned</div>
          </div>

          {nodeStats && isRunning && (
            <div className="bg-zinc-800 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-zinc-400" />
                  <div>
                    <div className="text-xs text-zinc-400">Uptime</div>
                    <div className="font-medium">{formatDuration(nodeStats.uptime)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-zinc-400" />
                  <div>
                    <div className="text-xs text-zinc-400">Uploaded</div>
                    <div className="font-medium">{formatBytes(nodeStats.uploadMb * 1024 * 1024)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-zinc-400" />
                  <div>
                    <div className="text-xs text-zinc-400">Downloaded</div>
                    <div className="font-medium">{formatBytes(nodeStats.downloadMb * 1024 * 1024)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-zinc-400" />
                  <div>
                    <div className="text-xs text-zinc-400">Connections</div>
                    <div className="font-medium">{nodeStats.connections}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isRunning && (
            <div className="bg-zinc-800 rounded-lg p-4 mb-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div className="text-sm">
                Your MystNode is currently inactive. Start your node to begin earning MYST tokens.
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-2">
            {isRunning ? (
              <Button onClick={stopNode} variant="destructive" className="w-full">
                <Server className="mr-2 h-4 w-4" />
                Stop Node
              </Button>
            ) : (
              <Button onClick={startNode} className="w-full">
                <Server className="mr-2 h-4 w-4" />
                Start Node
              </Button>
            )}
          </div>

          <Link href="/depin/mystnode/bandwidth" className="block mt-3">
            <Button variant="outline" className="w-full">
              <Wifi className="mr-2 h-4 w-4" />
              Bandwidth Controls
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-zinc-800 p-2 rounded-full mt-1">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Share Bandwidth</h4>
                <p className="text-sm text-zinc-400">
                  Your device shares unused internet bandwidth with the Mysterium Network, providing VPN services to
                  users around the world.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-zinc-800 p-2 rounded-full mt-1">
                <Check className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <h4 className="font-medium">Earn While You Move</h4>
                <p className="text-sm text-zinc-400">
                  Complete physical activities to boost your MYST earnings. More activity means higher earnings from
                  your MystNode.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-zinc-800 p-2 rounded-full mt-1">
                <Wifi className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium">Smart Data Usage</h4>
                <p className="text-sm text-zinc-400">
                  The node intelligently uses only your excess bandwidth and can be configured to use specific data
                  limits to avoid affecting your regular usage.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
