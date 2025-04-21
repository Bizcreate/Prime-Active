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

export default function WalletPage() {
  const { isConnected, address, balance, ownedNFTs } = useWeb3()
  const [activeTab, setActiveTab] = useState("tokens")

  // Mock data for tokens and NFTs
  const tokens = [
    {
      name: "Shaka Coin",
      symbol: "SHKA",
      balance: "1,250.00",
      value: "125.00",
    },
    {
      name: "Prime Active",
      symbol: "ACTIVE",
      balance: "500.00",
      value: "50.00",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      balance: "0.05",
      value: "125.00",
    },
  ]

  const nfts = [
    {
      id: "1",
      name: "Prime Mates Surfer",
      image: "/surfing-monkey.png",
      collection: "Prime Mates Board Club",
    },
    {
      id: "2",
      name: "Prime Mates Skater",
      image: "/skateboarding-monkey.png",
      collection: "Prime Mates Board Club",
    },
    {
      id: "3",
      name: "Banana Boarder",
      image: "/snowboarding-monkey.png",
      collection: "Prime Mates Board Club",
    },
    {
      id: "4",
      name: "Digital Athlete",
      image: "/abstract-digital-art.png",
      collection: "Prime Active Collection",
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
              <WalletDisplay address={address} balance={balance} />
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
                <div className="text-2xl font-bold text-yellow-500">1,250</div>
                <div className="text-xs text-zinc-400">Shaka Coins</div>
              </div>
              <div className="bg-zinc-900 p-4 rounded-lg flex flex-col items-center">
                <div className="mb-2">
                  <Image
                    src="/shaka-banana.png"
                    alt="Banana Points"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div className="text-2xl font-bold text-yellow-500">42</div>
                <div className="text-xs text-zinc-400">Banana Points</div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Assets</h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={activeTab === "tokens" ? "default" : "outline"}
                  onClick={() => setActiveTab("tokens")}
                >
                  Tokens
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "nfts" ? "default" : "outline"}
                  onClick={() => setActiveTab("nfts")}
                >
                  NFTs
                </Button>
              </div>
            </div>

            {activeTab === "tokens" ? (
              <div className="space-y-3">
                {tokens.map((token, index) => (
                  <div key={index} className="bg-zinc-900 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mr-3">
                        {token.symbol === "SHKA" ? (
                          <Image
                            src="/shaka-coin.png"
                            alt={token.symbol}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold">
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
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {nfts.map((nft, index) => (
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
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-sm truncate">{nft.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{nft.collection}</p>
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
            )}
          </>
        )}
      </div>

      <TabBar activeTab="wallet" />
    </main>
  )
}
