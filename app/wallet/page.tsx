"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Wallet, Copy, ExternalLink, Plus, Loader2, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useWeb3 } from "@/components/web3-provider"
import { NFTCard } from "@/components/nft-card"
import { NFTMintingService } from "@/services/nft-minting-service"
import type { NFTMetadata } from "@/types/nft-types"
import { MerchandiseNFTCard } from "@/components/merchandise-nft-card"
import { AddTokenModal, type TokenInfo } from "@/components/add-token-modal"

export default function WalletPage() {
  const { isConnected, connectWallet, address, balance, ownedNFTs, stakingRewards } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [merchandiseNFTs, setMerchandiseNFTs] = useState<NFTMetadata[]>([])
  const [tokens, setTokens] = useState<TokenInfo[]>([
    {
      name: "Shaka Coin",
      symbol: "SHAKA",
      balance: balance.toString(),
      value: (balance * 0.1).toFixed(2), // Assuming 1 SHAKA = $0.1
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
  ])
  const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState(false)

  // Load merchandise NFTs
  useEffect(() => {
    if (address) {
      try {
        const nfts = NFTMintingService.getMintedNFTsByOwner(address) || []
        // Ensure each NFT has a rarity property
        const validatedNfts = nfts.map((nft) => ({
          ...nft,
          rarity: nft.rarity || "common",
        }))
        setMerchandiseNFTs(validatedNfts)
      } catch (error) {
        console.error("Error loading NFTs:", error)
        setMerchandiseNFTs([])
      }
    }
  }, [address])

  // Update Shaka token balance when balance changes
  useEffect(() => {
    setTokens((prev) =>
      prev.map((token) =>
        token.symbol === "SHAKA"
          ? {
              ...token,
              balance: balance.toString(),
              value: (balance * 0.1).toFixed(2),
            }
          : token,
      ),
    )
  }, [balance])

  const handleConnectWallet = async () => {
    setIsLoading(true)
    try {
      await connectWallet()
      // The state will be updated in the provider
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  const handleAddToken = (newToken: TokenInfo) => {
    setTokens((prev) => [...prev, newToken])
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
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
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-zinc-900 rounded-full p-6 mb-6">
              <Wallet className="h-12 w-12 text-zinc-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-zinc-400 text-center mb-6 max-w-xs">
              Connect your wallet to view your NFTs, tokens, and track your rewards.
            </p>
            <Button
              onClick={handleConnectWallet}
              disabled={isLoading}
              className="bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-zinc-900 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-zinc-800 rounded-full p-2 mr-3">
                    <Wallet className="h-6 w-6 text-[#ffc72d]" />
                  </div>
                  <div>
                    <h2 className="font-bold">My Wallet</h2>
                    <div className="flex items-center">
                      <p className="text-sm text-zinc-400">{formatAddress(address || "")}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                        onClick={handleCopyAddress}
                        title="Copy address"
                      >
                        {isCopied ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3 text-zinc-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="icon" title="View on explorer">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800 rounded-lg p-4">
                  <p className="text-sm text-zinc-400 mb-1">Balance</p>
                  <div className="flex items-center">
                    <Image src="/shaka-coin.png" alt="SHAKA" width={20} height={20} className="mr-2" />
                    <p className="text-xl font-bold">{balance} SHAKA</p>
                  </div>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                  <p className="text-sm text-zinc-400 mb-1">Staking Rewards</p>
                  <div className="flex items-center">
                    <Image src="/shaka-coin.png" alt="SHAKA" width={20} height={20} className="mr-2" />
                    <p className="text-xl font-bold">{stakingRewards} / day</p>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="nfts" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="nfts">NFTs</TabsTrigger>
                <TabsTrigger value="merchandise">Merchandise</TabsTrigger>
                <TabsTrigger value="tokens">Tokens</TabsTrigger>
              </TabsList>

              <TabsContent value="nfts" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {ownedNFTs.length === 0 ? (
                    <div className="col-span-2 bg-zinc-900 rounded-lg p-6 text-center">
                      <div className="bg-zinc-800 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Image
                          src="/shaka-banana-hand.png"
                          alt="No NFTs"
                          width={32}
                          height={32}
                          className="opacity-50"
                        />
                      </div>
                      <h3 className="font-bold mb-2">No NFTs Found</h3>
                      <p className="text-zinc-400 text-sm mb-4">
                        You don't have any NFTs in your wallet yet. Visit the marketplace to get some!
                      </p>
                      <Link href="/marketplace">
                        <Button className="bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90">Browse Marketplace</Button>
                      </Link>
                    </div>
                  ) : (
                    ownedNFTs.map((nft) => <NFTCard key={nft.id} nft={nft} />)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="merchandise" className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold">Merchandise NFTs</h2>
                  <Link href="/store">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Shop More
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {merchandiseNFTs.length === 0 ? (
                    <div className="col-span-2 bg-zinc-900 rounded-lg p-6 text-center">
                      <div className="bg-zinc-800 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Image
                          src="/shaka-banana-hand.png"
                          alt="No Merchandise NFTs"
                          width={32}
                          height={32}
                          className="opacity-50"
                        />
                      </div>
                      <h3 className="font-bold mb-2">No Merchandise NFTs</h3>
                      <p className="text-zinc-400 text-sm mb-4">
                        You haven't minted any merchandise NFTs yet. Purchase NFC+NFT merchandise to get started!
                      </p>
                      <Link href="/store">
                        <Button className="bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90">Shop Merchandise</Button>
                      </Link>
                    </div>
                  ) : (
                    merchandiseNFTs.map((nft) => (
                      <div key={nft?.id || Math.random().toString()} className="col-span-1">
                        <MerchandiseNFTCard
                          nft={
                            nft || {
                              id: Math.random().toString(),
                              name: "Unknown NFT",
                              image: "/placeholder.svg",
                              rarity: "common",
                              collection: "Unknown Collection",
                            }
                          }
                        />
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="tokens" className="space-y-6">
                <div className="space-y-4">
                  {tokens.map((token, index) => (
                    <div key={index} className="bg-zinc-900 rounded-lg p-4 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mr-3">
                        {token.icon ? (
                          <Image src={token.icon || "/placeholder.svg"} alt={token.symbol} width={24} height={24} />
                        ) : (
                          <div
                            className={`w-8 h-8 rounded-full ${
                              token.symbol === "ETH" ? "bg-[#627eea] text-white" : "bg-[#ffc72d] text-black"
                            } flex items-center justify-center font-bold`}
                          >
                            {token.symbol.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{token.name}</h3>
                        <p className="text-xs text-zinc-500">{token.symbol}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{token.balance}</p>
                        <p className="text-xs text-zinc-500">${token.value}</p>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" className="w-full" onClick={() => setIsAddTokenModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Token
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <AddTokenModal
              open={isAddTokenModalOpen}
              onOpenChange={setIsAddTokenModalOpen}
              onAddToken={handleAddToken}
            />
          </>
        )}
      </div>

      <TabBar activeTab="wallet" />
    </div>
  )
}
