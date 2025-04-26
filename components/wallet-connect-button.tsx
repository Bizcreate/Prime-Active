"use client"

import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/components/web3-provider"
import { Wallet, Loader2, AlertCircle } from "lucide-react"
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
  showBypass = false,
}: WalletConnectButtonProps) {
  const { isConnected, connectWallet, disconnectWallet, address, isSimulated } = useWeb3()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    console.log("Connect button clicked")
    setIsConnecting(true)

    try {
      await connectWallet()
      // No need to check success as the state will be updated in the provider
    } catch (error) {
      console.error("Error in handleConnect:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    console.log("Disconnect button clicked")
    disconnectWallet()
  }

  // Format address for display
  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return addr.length > 10 ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : addr
  }

  console.log("WalletConnectButton render state:", { isConnected, isConnecting, address })

  // Custom UI with the correct color scheme
  return (
    <div className="flex flex-col">
      {isConnected ? (
        <Button
          variant={variant}
          size={size}
          onClick={handleDisconnect}
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
      )}
      {isSimulated && isConnected && (
        <div className="flex items-center justify-center mt-2 text-xs text-amber-400">
          <AlertCircle className="h-3 w-3 mr-1" />
          Test Mode: Simulated Wallet
        </div>
      )}
    </div>
  )
}
