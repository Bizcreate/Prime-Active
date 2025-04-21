"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, Check, Loader2 } from "lucide-react"
import { useWeb3 } from "@/components/web3-provider"

interface NFTVerificationProps {
  onVerified?: () => void
  onSkip?: () => void
}

export function NFTVerification({ onVerified, onSkip }: NFTVerificationProps) {
  const { isConnected, connectWallet, verifyNFTOwnership, hasAccess, ownedNFTs } = useWeb3()
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if already verified
  useEffect(() => {
    if (isConnected && hasAccess) {
      onVerified?.()
    }
  }, [isConnected, hasAccess, onVerified])

  // Handle connect and verify
  const handleConnectAndVerify = async () => {
    try {
      setIsVerifying(true)
      setError(null)

      // Connect wallet if not connected
      if (!isConnected) {
        const connected = await connectWallet()
        if (!connected) {
          setError("Failed to connect wallet. Please try again.")
          setIsVerifying(false)
          return
        }
      }

      // Verify NFT ownership
      const verified = await verifyNFTOwnership()

      if (verified) {
        onVerified?.()
      } else {
        setError("No eligible NFTs found in your wallet. You can still use the app with limited features.")
      }
    } catch (err) {
      console.error("Error during verification:", err)
      setError("An error occurred during verification. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Verify NFT Ownership
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-900/20 border border-red-900 rounded-md p-3 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {isConnected && hasAccess ? (
          <div className="bg-green-900/20 border border-green-900 rounded-md p-3 mb-4 flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-green-500">Verification successful!</p>
              <p className="text-xs text-zinc-400">
                {ownedNFTs.length} NFT{ownedNFTs.length !== 1 ? "s" : ""} found in your wallet
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-400 mb-4">
            Connect your wallet to verify NFT ownership and unlock premium features, including:
          </p>
        )}

        {!isConnected && (
          <ul className="space-y-2 mb-4">
            <li className="flex items-center gap-2 text-sm">
              <div className="bg-primary/20 p-1 rounded-full">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span>Exclusive challenges and rewards</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <div className="bg-primary/20 p-1 rounded-full">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span>Higher $ACTIVE token earning rates</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <div className="bg-primary/20 p-1 rounded-full">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span>Access to premium NFT collections</span>
            </li>
          </ul>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {!isConnected || !hasAccess ? (
          <>
            <Button className="w-full" onClick={handleConnectAndVerify} disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>Connect Wallet & Verify</>
              )}
            </Button>
            <Button variant="outline" className="w-full" onClick={onSkip} disabled={isVerifying}>
              Skip for Now
            </Button>
          </>
        ) : (
          <Button className="w-full" onClick={onVerified}>
            Continue
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
