"use client"

import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/components/web3-provider"
import { Wallet, Loader2 } from "lucide-react"
import { useState } from "react"

interface WalletConnectButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showBypass?: boolean
}

export function WalletConnectButton({
  variant = "default",
  size = "default",
  className,
  showBypass = false, // Not used anymore since we're simulating directly
}: WalletConnectButtonProps) {
  const { isConnected, connectWallet, disconnectWallet, address } = useWeb3()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    await connectWallet()
    setIsConnecting(false)
  }

  // Format address for display
  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return addr.length > 10 ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : addr
  }

  // Custom UI with the correct color scheme
  return isConnected ? (
    <Button
      variant={variant}
      size={size}
      onClick={disconnectWallet}
      className={`bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90 ${className}`}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {address ? formatAddress(address) : "Disconnect"}
    </Button>
  ) : (
    <Button
      variant={variant}
      size={size}
      onClick={handleConnect}
      disabled={isConnecting}
      className={`bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90 ${className}`}
    >
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
