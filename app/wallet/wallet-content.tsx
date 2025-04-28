"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { WagmiProvider, createConfig, http } from "wagmi"
import { mainnet } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TrendingUp, ArrowLeftRight } from "lucide-react"
import Link from "next/link"
import { Clock, Award, ArrowDown, Layers } from "lucide-react"

// Create wagmi config
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
})

// Create a client
const queryClient = new QueryClient()

// Add this component to your existing wallet content
export function TokenFeaturesGrid() {
  const features = [
    {
      icon: <ArrowLeftRight className="h-5 w-5" />,
      title: "Convert",
      description: "Exchange between token types",
      href: "/wallet/token-conversion",
      color: "bg-blue-500",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Stake",
      description: "Earn rewards by staking",
      href: "/wallet/staking",
      color: "bg-green-500",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "History",
      description: "View transaction history",
      href: "/wallet/token-history",
      color: "bg-purple-500",
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: "Earn",
      description: "Ways to earn tokens",
      href: "/wallet/earn",
      color: "bg-amber-500",
    },
    {
      icon: <ArrowDown className="h-5 w-5" />,
      title: "Receive",
      description: "Get tokens from others",
      href: "/wallet/receive",
      color: "bg-pink-500",
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: "NFTs",
      description: "View your NFT collection",
      href: "/wallet/nfts",
      color: "bg-indigo-500",
    },
  ]

  return (
    <div className="mt-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">Token Management</h2>
      <div className="grid grid-cols-3 gap-3">
        {features.map((feature, i) => (
          <Link key={i} href={feature.href} passHref>
            <Card className="cursor-pointer hover:bg-secondary transition-colors">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-full ${feature.color} text-white flex items-center justify-center mb-2`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-medium text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function WalletContent() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="grid gap-4">
          <Card className="bg-gray-900">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/shaka-coin.png" alt="ACTIVE token" width={48} height={48} className="rounded-full" />
                <div>
                  <h3 className="text-xl font-bold">ACTIVE</h3>
                  <p className="text-gray-400 text-sm">Prime Active Token</p>
                </div>
              </div>
              <div className="text-3xl font-bold">250</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/shaka-coin.png" alt="SHAKA token" width={48} height={48} className="rounded-full" />
                <div>
                  <h3 className="text-xl font-bold">SHAKA</h3>
                  <p className="text-gray-400 text-sm">Shaka Tokens</p>
                </div>
              </div>
              <div className="text-3xl font-bold">75</div>
            </CardContent>
          </Card>
        </div>

        {/* Token Features */}
        <TokenFeaturesGrid />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
