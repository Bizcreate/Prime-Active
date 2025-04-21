"use client"

import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/components/web3-provider"
import { Wallet, Loader2 } from "lucide-react"
import { useState } from "react"

interface WalletConnectButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function WalletConnectButton({ variant = "default", size = "default", className }: WalletConnectButtonProps) {
  const { isConnected, connectWallet, disconnectWallet, address } = useWeb3()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    await connectWallet()
    setIsConnecting(false)
  }

  // Custom UI
  return isConnected ? (
    <Button variant={variant} size={size} onClick={disconnectWallet} className={className}>
      {address ? address : "Disconnect Wallet"}
    </Button>
  ) : (
    <Button variant={variant} size={size} onClick={handleConnect} disabled={isConnecting} className={className}>
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}
