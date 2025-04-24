"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Copy, ExternalLink, Plus, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useWeb3 } from "@/components/web3-provider"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { WalletDisplay } from "@/components/wallet-display"
import Image from "next/image"
import NFTStaking from "@/components/nft-staking"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function WalletPage() {
  const { isConnected, address, balance, ownedNFTs, stakingRewards } = useWeb3()
  const [activeTab, setActiveTab] = useState("tokens")
  const [showStaking, setShowStaking] = useState(false)

  // Mock data for tokens
  const tokens = [
    {
      name: "Shaka Coin",
      symbol: "SHKA",
      balance: balance.toString(),
      value: (balance * 0.1).toFixed(2), // Assuming 1 SHKA = $0.1
      icon: "/shaka-coin.png",
    },
    {
      name: "Prime Active",
      symbol: "ACTIVE",
      balance: "500.00",
      value: "50.00",
      icon: null,
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      balance: "0.05",
      value: "125.00",
      icon: null,
    },
  ]

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Wallet</h1>
        </div>

        {!isConnected ? (
          <div className="bg-zinc-900 rounded-lg p-6 text-center">
            <Image
              src="/prime-mates-logo.png"
              alt="Prime Mates Board Club"
              width={150}
              height={75}
              className="object-contain mx-auto mb-4"
            />
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-zinc-400 mb-4">
              Connect your wallet to view your tokens, NFTs, and access exclusive features
            </p>
            <WalletConnectButton />
          </div>
        ) : (
          <>
            <div className="bg-zinc-900 rounded-lg p-4 mb-6">
              <WalletDisplay />
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Address
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-900 p-4 rounded-lg flex flex-col items-center">
                <div className="mb-2">
                  <Image src="/shaka-coin.png" alt="Shaka Coins" width={48} height={48} className="object-contain" />
                </div>
                <div className="text-2xl font-bold text-[#ffc72d]">{balance}</div>
                <div className="text-xs text-zinc-400">Shaka Coins</div>
              </div>
              <div className="bg-zinc-900 p-4 rounded-lg flex flex-col items-center">
                <div className="mb-2">
                  <Image
                    src="/shaka-banana.png"
                    alt="Staking Rewards"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div className="text-2xl font-bold text-[#ffc72d]">{stakingRewards}</div>
                <div className="text-xs text-zinc-400">Staking Rewards</div>
              </div>
            </div>

            <Tabs defaultValue="tokens" className="w-full mb-6">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="tokens" onClick={() => setShowStaking(false)}>
                  Tokens
                </TabsTrigger>
                <TabsTrigger value="nfts" onClick={() => setShowStaking(false)}>
                  NFTs
                </TabsTrigger>
                <TabsTrigger value="staking" onClick={() => setShowStaking(true)}>
                  Staking
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tokens">
                <div className="space-y-3">
                  {tokens.map((token, index) => (
                    <div key={index} className="bg-zinc-900 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mr-3">
                          {token.icon ? (
                            <Image
                              src={token.icon || "/placeholder.svg"}
                              alt={token.symbol}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#ffc72d] flex items-center justify-center text-black font-bold">
                              {token.symbol.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{token.name}</p>
                          <p className="text-xs text-zinc-500">{token.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{token.balance}</p>
                        <p className="text-xs text-zinc-500">${token.value}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Token
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="nfts">
                <div className="grid grid-cols-2 gap-3">
                  {ownedNFTs.map((nft, index) => (
                    <div key={index} className="bg-zinc-900 rounded-lg overflow-hidden">
                      <div className="relative aspect-square">
                        <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                        {nft.collection === "Prime Mates Board Club" && (
                          <div className="absolute top-2 left-2">
                            <Image
                              src="/prime-mates-logo.png"
                              alt="Prime Mates"
                              width={30}
                              height={15}
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div
                          className={`absolute top-2 right-2 bg-${nft.rarity === "legendary" ? "[#ffc72d]" : nft.rarity === "epic" ? "purple-600" : nft.rarity === "rare" ? "blue-600" : "zinc-600"} text-black text-xs px-2 py-0.5 rounded-full`}
                        >
                          {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-sm truncate">{nft.name}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-zinc-500 truncate">{nft.collection}</p>
                          <div className="flex items-center gap-1">
                            <Image
                              src="/shaka-coin.png"
                              alt="Rewards"
                              width={12}
                              height={12}
                              className="object-contain"
                            />
                            <span className="text-xs text-[#ffc72d]">+{nft.stakingRewards}/day</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link href="/marketplace" className="col-span-2">
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Browse NFTs
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="staking">
                <NFTStaking onSuccess={() => console.log("Staking successful")} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      <TabBar activeTab="wallet" />
    </main>
  )
}
