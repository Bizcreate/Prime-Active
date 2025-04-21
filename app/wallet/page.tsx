"use client"

import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { NFTCard } from "@/components/nft-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownLeft, Award, Wallet, ExternalLink, Copy, Shield, Trophy } from "lucide-react"
import { useWeb3 } from "@/components/web3-provider"
import { shortenAddress, generateRandomNFTImage } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function WalletPage() {
  const { address, balance, isConnected, ownedNFTs, points, hasAccess } = useWeb3()

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Wallet</h1>
          <Button variant="outline" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Your Balance</h2>
            {isConnected && (
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <span>{shortenAddress(address || "")}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold">
                {balance} <span className="text-primary">ETH</span>
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-zinc-400">≈ $245.00 USD</p>
                {hasAccess && (
                  <div className="flex items-center gap-1 bg-zinc-800 px-2 py-0.5 rounded-full">
                    <Trophy className="h-3 w-3 text-primary" />
                    <span className="text-xs">{points} Points</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4" />
              Send
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowDownLeft className="h-4 w-4" />
              Receive
            </Button>
          </div>
        </div>

        <Tabs defaultValue="nfts" className="mb-6">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="nfts">NFT Collection</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="nfts" className="space-y-4">
            {isConnected && ownedNFTs.length > 0 && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Verified NFTs
                  </h3>
                  <Badge variant="success" className="text-xs">
                    {ownedNFTs.length} Verified
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {ownedNFTs.map((nft, index) => (
                    <NFTCard
                      key={index}
                      id={nft.tokenId}
                      name={nft.name || `NFT #${nft.tokenId}`}
                      image={nft.image || generateRandomNFTImage(Number(nft.tokenId))}
                      rarity="legendary"
                      activity={nft.collection}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <NFTCard
                id="nft-1"
                name="Step Master"
                image={generateRandomNFTImage(1)}
                rarity="rare"
                activity="Walking"
              />
              <NFTCard
                id="nft-2"
                name="Skate Legend"
                image={generateRandomNFTImage(2)}
                rarity="epic"
                activity="Skateboarding"
              />
              <NFTCard
                id="nft-3"
                name="Morning Runner"
                image={generateRandomNFTImage(3)}
                rarity="rare"
                activity="Running"
              />
              <NFTCard
                id="nft-4"
                name="Snow Rider"
                image={generateRandomNFTImage(4)}
                rarity="legendary"
                activity="Snowboarding"
              />
              <NFTCard
                id="nft-5"
                name="Wave Catcher"
                image={generateRandomNFTImage(5)}
                rarity="uncommon"
                activity="Surfing"
              />
              <NFTCard
                id="nft-6"
                name="Mountain Biker"
                image={generateRandomNFTImage(6)}
                rarity="common"
                activity="Mountain Biking"
              />
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-green-500/20 p-2 rounded-full mr-3">
                  <Award className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Activity Reward</h3>
                  <p className="text-xs text-zinc-400">Morning Run</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-medium text-green-500">+125 $ACTIVE</p>
                  <p className="text-xs text-zinc-400">Today, 8:45 AM</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-green-500/20 p-2 rounded-full mr-3">
                  <Award className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Challenge Completed</h3>
                  <p className="text-xs text-zinc-400">Early Bird Challenge</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-medium text-green-500">+250 $ACTIVE</p>
                  <p className="text-xs text-zinc-400">Yesterday, 7:30 AM</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-green-500/20 p-2 rounded-full mr-3">
                  <Award className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Activity Reward</h3>
                  <p className="text-xs text-zinc-400">Skate Session</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-medium text-green-500">+85 $ACTIVE</p>
                  <p className="text-xs text-zinc-400">Feb 20, 4:15 PM</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <TabBar activeTab="wallet" />
    </main>
  )
}
