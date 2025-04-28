"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Wallet } from "lucide-react"
import { useWeb3 } from "./web3-provider"
import { useToast } from "@/hooks/use-toast"

interface WalletConnectButtonProps {
  showBypass?: boolean
}

export function WalletConnectButton({ showBypass = true }: WalletConnectButtonProps) {
  const { isConnected, connect, disconnect } = useWeb3()
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const handleConnect = async () => {
    if (isConnected) {
      disconnect()
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      })
      return
    }

    try {
      setIsConnecting(true)
      await connect()
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      })
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleBypass = () => {
    if (!isConnected) {
      connect()
      toast({
        title: "Demo Mode",
        description: "Connected to demo wallet for testing.",
      })
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className={isConnected ? "bg-red-600 hover:bg-red-700" : "bg-[#ffc72d] hover:bg-[#e6b328] text-black"}
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : isConnected ? (
          "Disconnect Wallet"
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>

      {showBypass && !isConnected && (
        <Button variant="ghost" size="sm" onClick={handleBypass} className="text-xs text-zinc-500">
          Continue in Demo Mode
        </Button>
      )}
    </div>
  )
}
