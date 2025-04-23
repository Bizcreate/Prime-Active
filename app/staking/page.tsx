"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Info, ChevronsUp, Wallet } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import NFTStaking from "@/components/nft-staking"
import { useWeb3 } from "@/components/web3-provider"
import { WalletConnectButton } from "@/components/wallet-connect-button"

export default function StakingPage() {
  const { isConnected, balance, stakingRewards, stakedNFTs } = useWeb3()
  const [showSuccess, setShowSuccess] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-[#ffc72d]">NFT Staking</h1>
        </div>

        {!isConnected && (
          <div className="bg-zinc-900 rounded-lg p-4 mb-6 text-center">
            <h2 className="font-bold text-lg mb-3 text-[#ffc72d]">Connect Wallet to Stake</h2>
            <p className="text-sm text-zinc-400 mb-4">
              Connect your wallet to start staking your NFTs and earning rewards
            </p>
            <WalletConnectButton showBypass={false} />
          </div>
        )}

        {isConnected && (
          <div className="bg-zinc-900 rounded-lg p-4 mb-6">
            <h2 className="font-bold text-lg mb-3 text-[#ffc72d]">Staking Summary</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800 p-3 rounded-lg">
                <p className="text-xs text-zinc-400">Total Staked</p>
                <p className="text-lg font-bold text-[#ffc72d]">{stakedNFTs.length} NFTs</p>
              </div>
              <div className="bg-zinc-800 p-3 rounded-lg">
                <p className="text-xs text-zinc-400">Daily Rewards</p>
                <p className="text-lg font-bold text-[#ffc72d]">+{stakingRewards / 30} $SHKA</p>
              </div>
            </div>
          </div>
        )}

        {isConnected && (
          <div className="bg-zinc-900 rounded-lg p-4 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 z-0">
              <Image src="/winding-mountain-path.png" alt="Staking Background" fill className="object-cover" />
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#ffc72d]/20 flex items-center justify-center">
                  <ChevronsUp className="h-6 w-6 text-[#ffc72d]" />
                </div>
                <div>
                  <h2 className="font-bold text-[#ffc72d]">Your Staking Rewards</h2>
                  <div className="flex items-center gap-1">
                    <Image src="/shaka-coin.png" alt="Shaka Coins" width={16} height={16} className="object-contain" />
                    <span className="text-[#ffc72d] font-medium">{stakingRewards} $SHKA available</span>
                  </div>
                </div>
              </div>
              <Button size="sm" className="bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90">
                <Wallet className="h-4 w-4 mr-2" />
                Claim All
              </Button>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="bg-green-900/20 border border-green-900 rounded-lg p-4 mb-6 flex items-start gap-3">
            <div className="bg-green-500/20 p-2 rounded-full mt-1">
              <Info className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium text-green-400 mb-1">Staking Successful!</h3>
              <p className="text-sm text-zinc-300">
                Your NFTs are now staked and earning rewards. Check back daily to see your earnings grow!
              </p>
            </div>
          </div>
        )}

        <NFTStaking onSuccess={() => setShowSuccess(true)} />

        <div className="mt-6 bg-zinc-900 rounded-lg p-4">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Info className="h-5 w-5 text-[#ffc72d]" />
            <span className="text-[#ffc72d]">Staking Benefits</span>
          </h2>
          <p className="text-sm text-zinc-400 mb-3">
            Staking your Prime Mates Board Club NFTs allows you to earn passive Shaka Coins while supporting the
            community. The longer you stake, the more rewards you earn!
          </p>
          <div className="space-y-3 mb-3">
            <div className="bg-zinc-800 p-3 rounded-lg">
              <h3 className="font-medium text-sm mb-1 text-[#ffc72d]">Staking Periods</h3>
              <p className="text-xs text-zinc-400">
                Different NFTs have different staking periods. Rarer NFTs earn more rewards but may require longer
                staking periods.
              </p>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg">
              <h3 className="font-medium text-sm mb-1 text-[#ffc72d]">Cooldown Period</h3>
              <p className="text-xs text-zinc-400">
                After unstaking, NFTs enter a cooldown period before they can be staked again. During this time, you can
                claim your earned rewards.
              </p>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg">
              <h3 className="font-medium text-sm mb-1 text-[#ffc72d]">Reward Boosts</h3>
              <p className="text-xs text-zinc-400">
                Staking multiple NFTs from the same collection provides a boost to your rewards. Stake a complete set
                for maximum benefits!
              </p>
            </div>
          </div>
          <Link href="/rewards">
            <Button variant="outline" className="w-full">
              View All Rewards
            </Button>
          </Link>
        </div>
      </div>

      <TabBar activeTab="wallet" />
    </div>
  )
}
