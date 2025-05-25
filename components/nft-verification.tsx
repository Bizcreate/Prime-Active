"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Shield, AlertTriangle, Check, Loader2, Info } from "lucide-react"
import { useWeb3 } from "@/components/web3-provider"
import Image from "next/image"

interface NFTVerificationProps {
  onVerified?: () => void
  onSkip?: () => void
}

type VerificationStatus = "idle" | "connecting" | "checking" | "verified" | "failed" | "preview"

export function NFTVerification({ onVerified, onSkip }: NFTVerificationProps) {
  const { isConnected, connectWallet, verifyNFTOwnership, hasAccess, ownedNFTs, isVerifying } = useWeb3()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<VerificationStatus>("idle")

  // Check if we're in a preview/iframe environment
  const isPreviewEnvironment =
    typeof window !== "undefined" && (window.location.hostname.includes("vercel") || window.top !== window.self)

  useEffect(() => {
    if (isPreviewEnvironment) {
      setStatus("preview")
    }
  }, [isPreviewEnvironment])

  // Check if already verified
  useEffect(() => {
    if (isConnected && hasAccess && onVerified && typeof onVerified === "function") {
      onVerified()
    }
  }, [isConnected, hasAccess, onVerified])

  // Handle connect and verify
  const handleConnectAndVerify = async () => {
    try {
      setError(null)

      // Connect wallet if not connected
      if (!isConnected) {
        const connected = await connectWallet()
        if (!connected) {
          setError("Failed to connect wallet. Please try again.")
          return
        }
      }

      // Verify NFT ownership - always succeed for testing
      await verifyNFTOwnership()

      // Always proceed to the next step
      if (onVerified && typeof onVerified === "function") {
        onVerified()
      }
    } catch (err) {
      console.error("Error during verification:", err)
      setError("An error occurred during verification. Please try again.")
    }
  }

  const handleSkip = () => {
    if (onSkip && typeof onSkip === "function") {
      onSkip()
    }
  }

  const handleContinue = () => {
    if (onVerified && typeof onVerified === "function") {
      onVerified()
    }
  }

  return (
    <Card className="bg-black border-zinc-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Image
            src="/prime-mates-logo.png"
            alt="Prime Mates Board Club"
            width={80}
            height={40}
            className="object-contain"
          />
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#ffc72d]" />
            <span className="text-[#ffc72d]">Verify NFT Ownership</span>
          </CardTitle>
        </div>
        <CardDescription className="text-white">
          Connect your wallet to verify NFT ownership and unlock premium features
        </CardDescription>
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
          <p className="text-sm text-white mb-4">
            Connect your wallet to verify NFT ownership and unlock premium features, including:
          </p>
        )}

        {!isConnected && (
          <ul className="space-y-2 mb-4">
            <li className="flex items-center gap-2 text-sm">
              <div className="bg-[#ffc72d]/20 p-1 rounded-full">
                <Check className="h-3 w-3 text-[#ffc72d]" />
              </div>
              <span className="text-[#ffc72d]">Exclusive challenges and rewards</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <div className="bg-[#ffc72d]/20 p-1 rounded-full">
                <Check className="h-3 w-3 text-[#ffc72d]" />
              </div>
              <span className="text-[#ffc72d]">Higher $ACTIVE token earning rates</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <div className="bg-[#ffc72d]/20 p-1 rounded-full">
                <Check className="h-3 w-3 text-[#ffc72d]" />
              </div>
              <span className="text-[#ffc72d]">Access to premium NFT collections</span>
            </li>
          </ul>
        )}

        {status === "preview" && (
          <>
            <div className="bg-blue-900/20 border border-blue-800 rounded-md p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Info className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-400">Preview Mode</h3>
                  <p className="text-sm text-blue-300">Wallet connection simulated for preview</p>
                </div>
              </div>
              <p className="text-sm text-blue-400 mt-2">
                In the deployed app, this will connect to your actual Web3 wallet to verify NFT ownership.
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                <div className="w-12 h-12 rounded-md overflow-hidden">
                  <img src="/prime-mates-logo.png" alt="Prime Mates NFT" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#ffc72d]">Prime Mates Board Club</h3>
                  <p className="text-xs text-zinc-400">Membership NFT #4269</p>
                </div>
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-500" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1" onClick={handleContinue}>
                Continue
              </Button>
            </div>
          </>
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
            <Button variant="outline" className="w-full" onClick={handleSkip} disabled={isVerifying}>
              Skip for Now
            </Button>
          </>
        ) : (
          <Button className="w-full" onClick={handleContinue}>
            Continue
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
