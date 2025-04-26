"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, ExternalLink, Share2, Send, Shield, Award, Zap, Clock } from "lucide-react"
import Link from "next/link"
import { useWeb3 } from "@/components/web3-provider"
import Image from "next/image"
import { NFTTransferModal } from "@/components/nft-transfer-modal"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

export default function NFTDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { ownedNFTs, stakedNFTs } = useWeb3()
  const [nft, setNft] = useState<any>(null)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isStaked, setIsStaked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find the NFT in either owned or staked NFTs
    const id = params.id as string
    let foundNFT = ownedNFTs.find((n) => n.id === id)
    let staked = false

    if (!foundNFT) {
      foundNFT = stakedNFTs.find((n) => n.id === id)
      staked = !!foundNFT
    }

    if (foundNFT) {
      setNft(foundNFT)
      setIsStaked(staked)
    } else {
      // If NFT not found, redirect to wallet
      router.push("/wallet")
    }

    setLoading(false)
  }, [params.id, ownedNFTs, stakedNFTs, router])

  if (loading || !nft) {
    return (
      <main className="flex min-h-screen flex-col bg-black p-6">
        <div className="flex items-center mb-6">
          <Link href="/wallet">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Loading NFT...</h1>
        </div>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-lg bg-zinc-800 h-64 w-64 mb-4"></div>
            <div className="h-4 bg-zinc-800 rounded w-48 mb-2"></div>
            <div className="h-3 bg-zinc-800 rounded w-32"></div>
          </div>
        </div>
      </main>
    )
  }

  // Define benefits based on NFT rarity
  const benefits = {
    common: [
      { icon: <Shield className="h-4 w-4" />, name: "Basic Access", description: "Access to standard features" },
      { icon: <Award className="h-4 w-4" />, name: "Community Access", description: "Join the PMBC community" },
    ],
    uncommon: [
      { icon: <Shield className="h-4 w-4" />, name: "Basic Access", description: "Access to standard features" },
      { icon: <Award className="h-4 w-4" />, name: "Community Access", description: "Join the PMBC community" },
      { icon: <Zap className="h-4 w-4" />, name: "10% Bonus", description: "10% bonus on all rewards" },
    ],
    rare: [
      { icon: <Shield className="h-4 w-4" />, name: "Basic Access", description: "Access to standard features" },
      { icon: <Award className="h-4 w-4" />, name: "Community Access", description: "Join the PMBC community" },
      { icon: <Zap className="h-4 w-4" />, name: "15% Bonus", description: "15% bonus on all rewards" },
      { icon: <Clock className="h-4 w-4" />, name: "Early Access", description: "Early access to new features" },
    ],
    epic: [
      { icon: <Shield className="h-4 w-4" />, name: "Basic Access", description: "Access to standard features" },
      { icon: <Award className="h-4 w-4" />, name: "Community Access", description: "Join the PMBC community" },
      { icon: <Zap className="h-4 w-4" />, name: "25% Bonus", description: "25% bonus on all rewards" },
      { icon: <Clock className="h-4 w-4" />, name: "Early Access", description: "Early access to new features" },
      {
        icon: <Image src="/shaka-banana-hand.png" alt="Exclusive" width={16} height={16} />,
        name: "Exclusive Challenges",
        description: "Access to exclusive challenges",
      },
    ],
    legendary: [
      { icon: <Shield className="h-4 w-4" />, name: "Basic Access", description: "Access to standard features" },
      { icon: <Award className="h-4 w-4" />, name: "Community Access", description: "Join the PMBC community" },
      { icon: <Zap className="h-4 w-4" />, name: "50% Bonus", description: "50% bonus on all rewards" },
      { icon: <Clock className="h-4 w-4" />, name: "Early Access", description: "Early access to new features" },
      {
        icon: <Image src="/shaka-banana-hand.png" alt="Exclusive" width={16} height={16} />,
        name: "Exclusive Challenges",
        description: "Access to exclusive challenges",
      },
      {
        icon: <Image src="/shaka-coin.png" alt="Rewards" width={16} height={16} />,
        name: "Daily Rewards",
        description: "Daily Shaka Coin rewards",
      },
    ],
  }

  // Get benefits based on NFT rarity
  const nftBenefits = benefits[nft.rarity as keyof typeof benefits] || benefits.common

  // Define attributes based on NFT name
  const getAttributes = () => {
    // In a real app, these would come from the NFT metadata
    if (nft.name.includes("420")) {
      return [
        { trait_type: "Background", value: "Blue" },
        { trait_type: "Fur", value: "Orange" },
        { trait_type: "Hair", value: "Green Mohawk" },
        { trait_type: "Clothes", value: "Flamingo Shirt" },
        { trait_type: "Accessory", value: "Skateboard" },
        { trait_type: "Mouth", value: "Cigar" },
      ]
    } else if (nft.name.includes("721")) {
      return [
        { trait_type: "Background", value: "Purple" },
        { trait_type: "Fur", value: "Brown" },
        { trait_type: "Hair", value: "Dreadlocks" },
        { trait_type: "Clothes", value: "Military Jacket" },
        { trait_type: "Accessory", value: "Sandwich Board" },
        { trait_type: "Eyes", value: "Ski Goggles" },
      ]
    } else if (nft.name.includes("1337")) {
      return [
        { trait_type: "Background", value: "Gradient" },
        { trait_type: "Fur", value: "Gray" },
        { trait_type: "Head", value: "Horns" },
        { trait_type: "Clothes", value: "Blue Wetsuit" },
        { trait_type: "Accessory", value: "Surfboard" },
        { trait_type: "Eyes", value: "Broken Glasses" },
      ]
    } else if (nft.name.includes("888")) {
      return [
        { trait_type: "Background", value: "Blue" },
        { trait_type: "Fur", value: "Pink Face" },
        { trait_type: "Hair", value: "Dreadlocks" },
        { trait_type: "Clothes", value: "Brown Jacket" },
        { trait_type: "Accessory", value: "Skateboard" },
        { trait_type: "Eyes", value: "Bulging" },
        { trait_type: "Mouth", value: "Cigar" },
      ]
    }

    return [
      { trait_type: "Collection", value: "Prime Mates Board Club" },
      { trait_type: "Rarity", value: nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1) },
    ]
  }

  const attributes = getAttributes()

  const rarityColors = {
    common: "bg-zinc-600",
    uncommon: "bg-green-600",
    rare: "bg-blue-600",
    epic: "bg-purple-600",
    legendary: "bg-[#ffc72d]",
  }

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/wallet">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">NFT Details</h1>
        </div>

        <div className="bg-zinc-900 rounded-lg overflow-hidden mb-6">
          <div className="relative aspect-square">
            <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
            <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded-md">
              <Image src="/prime-mates-logo.png" alt="Prime Mates" width={30} height={15} className="object-contain" />
            </div>
            <div
              className={`absolute top-2 right-2 ${
                rarityColors[nft.rarity as keyof typeof rarityColors]
              } text-black text-xs px-2 py-0.5 rounded-full`}
            >
              {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
            </div>
          </div>

          <div className="p-4">
            <h2 className="text-xl font-bold">{nft.name}</h2>
            <p className="text-sm text-zinc-400">{nft.collection}</p>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setIsTransferModalOpen(true)}
                disabled={isStaked}
              >
                <Send className="h-4 w-4 mr-2" />
                Transfer
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on OpenSea
              </Button>
            </div>

            {isStaked && (
              <div className="mt-4 bg-zinc-800 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Staking Progress</span>
                  <span className="text-xs text-zinc-400">{nft.stakingProgress}% Complete</span>
                </div>
                <Progress value={nft.stakingProgress} className="h-2" />
                <div className="flex justify-between text-xs text-zinc-400 mt-2">
                  <span>Staked: {new Date(nft.stakedAt).toLocaleDateString()}</span>
                  <span>Unlocks: {new Date(nft.unlockAt).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium mb-3">Benefits</h3>
          <div className="space-y-3">
            {nftBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className="mt-0.5 mr-3 h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[#ffc72d]">
                  {benefit.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{benefit.name}</p>
                  <p className="text-xs text-zinc-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium mb-3">Attributes</h3>
          <div className="grid grid-cols-2 gap-2">
            {attributes.map((attr, index) => (
              <div key={index} className="bg-zinc-800 rounded-md p-2">
                <p className="text-xs text-zinc-400">{attr.trait_type}</p>
                <p className="font-medium text-sm">{attr.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-3">Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 text-[#ffc72d]">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Minted</p>
                  <p className="text-xs text-zinc-400">Mar 2022</p>
                </div>
              </div>
              <Badge variant="outline">Genesis</Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 text-[#ffc72d]">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Transferred to you</p>
                  <p className="text-xs text-zinc-400">2 months ago</p>
                </div>
              </div>
              <Badge variant="outline">Transfer</Badge>
            </div>

            {isStaked && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 text-[#ffc72d]">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Staked</p>
                      <p className="text-xs text-zinc-400">{new Date(nft.stakedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant="outline">Staking</Badge>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <NFTTransferModal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} nft={nft} />

      <TabBar activeTab="wallet" />
    </main>
  )
}
