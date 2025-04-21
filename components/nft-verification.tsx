"use client"

import { useWeb3 } from "@/components/web3-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { WalletConnectButton } from "@/components/wallet-connect-button"

export function NFTVerification() {
  const { isConnected, ownedNFTs, isVerifying, verifyNFTOwnership, points, hasAccess } = useWeb3()

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">NFT Verification</h2>
          {isConnected && (
            <Button variant="outline" size="sm" onClick={verifyNFTOwnership} disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          )}
        </div>

        {!isConnected ? (
          <div className="text-center py-4">
            <p className="text-zinc-400 mb-4">Connect your wallet to verify NFT ownership</p>
            <WalletConnectButton />
          </div>
        ) : isVerifying ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <p className="text-zinc-400">Verifying NFT ownership...</p>
          </div>
        ) : ownedNFTs.length === 0 ? (
          <div className="bg-zinc-800 rounded-lg p-4 text-center">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="font-medium mb-1">No Verified NFTs</p>
            <p className="text-sm text-zinc-400 mb-4">You don't own any NFTs from the required collections.</p>
            <div className="text-xs text-zinc-500 mb-2">Required Collections:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="text-xs">
                Prime Mates Board Club
              </Badge>
              <Badge variant="outline" className="text-xs">
                Prime To The Bone
              </Badge>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium mb-1">NFT Ownership Verified</p>
              <p className="text-sm text-zinc-400">You own {ownedNFTs.length} verified NFTs</p>
            </div>

            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <p className="text-sm text-zinc-400 mb-1">Points Earned</p>
              <p className="text-3xl font-bold text-primary">{points}</p>
              <p className="text-xs text-zinc-500 mt-1">Based on your NFT ownership</p>
            </div>

            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <p className="text-sm text-zinc-400 mb-2">Reward Access</p>
              {hasAccess ? (
                <div className="flex items-center justify-center gap-2 text-green-500">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Unlocked</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-red-500">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Locked</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Your Verified NFTs</p>
              <div className="grid grid-cols-2 gap-2">
                {ownedNFTs.map((nft, index) => (
                  <div key={index} className="bg-zinc-800 rounded-lg p-2">
                    <div className="relative aspect-square rounded-md overflow-hidden mb-2">
                      <img
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.name || "NFT"}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-xs font-medium truncate">{nft.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{nft.collection}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
