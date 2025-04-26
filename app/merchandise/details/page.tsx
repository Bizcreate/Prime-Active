"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag, Smartphone, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PurchaseSimulator } from "@/components/purchase-simulator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabBar } from "@/components/tab-bar"

export default function MerchandiseDetailsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/merch">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Merchandise Details</h1>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="simulator" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="simulator">Simulator</TabsTrigger>
              <TabsTrigger value="nfc">NFC Features</TabsTrigger>
              <TabsTrigger value="nft">Digital Collectibles</TabsTrigger>
            </TabsList>

            <TabsContent value="simulator" className="space-y-6">
              <PurchaseSimulator />
            </TabsContent>

            <TabsContent value="nfc" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-2 text-blue-400" />
                    NFC-Enabled Merchandise
                  </CardTitle>
                  <CardDescription>Track wear time and earn rewards with embedded NFC chips</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
                    <Image src="/nfc-clothing-scan.png" alt="NFC Scanning" fill className="object-cover" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-sm font-medium text-blue-400">1</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Embedded NFC Technology</h4>
                        <p className="text-sm text-zinc-400">
                          Our NFC-enabled merchandise contains a small, durable chip that can be scanned with your
                          smartphone. The chip is waterproof and designed to last the lifetime of the product.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-sm font-medium text-blue-400">2</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Wear-to-Earn Rewards</h4>
                        <p className="text-sm text-zinc-400">
                          Each time you wear your NFC-enabled merchandise, you earn tokens that can be used for
                          discounts on future purchases or exclusive items. Simply scan the NFC tag when you put on and
                          take off your merchandise.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-sm font-medium text-blue-400">3</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Exclusive Challenges</h4>
                        <p className="text-sm text-zinc-400">
                          NFC-enabled merchandise unlocks special challenges and events. Complete these challenges while
                          wearing your merchandise to earn bonus rewards and limited-edition digital collectibles.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nft" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                    Digital Collectibles (NFTs)
                  </CardTitle>
                  <CardDescription>Own digital versions of your physical merchandise on the blockchain</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
                    <Image src="/digital-threads.png" alt="Digital Collectibles" fill className="object-cover" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-sm font-medium text-purple-400">1</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Digital Twins</h4>
                        <p className="text-sm text-zinc-400">
                          Each NFT is a unique digital representation of your physical merchandise, featuring enhanced
                          artwork and animations. These digital twins are stored on the blockchain, proving your
                          ownership.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-sm font-medium text-purple-400">2</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Enhanced Rewards</h4>
                        <p className="text-sm text-zinc-400">
                          Owning both the physical merchandise and its digital NFT counterpart provides enhanced
                          rewards. Earn up to 3x the standard points and tokens when wearing NFC-enabled merchandise
                          that has a digital twin.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-sm font-medium text-purple-400">3</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Exclusive Access</h4>
                        <p className="text-sm text-zinc-400">
                          Digital collectible owners get exclusive access to limited-edition merchandise drops, virtual
                          events, and special promotions. Your NFTs serve as membership passes to the Prime Mates
                          digital community.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Merchandise Comparison</CardTitle>
              <CardDescription>Compare the different merchandise options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-2 px-3">Feature</th>
                      <th className="text-center py-2 px-3">
                        <div className="flex flex-col items-center">
                          <ShoppingBag className="h-5 w-5 mb-1" />
                          <span>Standard</span>
                        </div>
                      </th>
                      <th className="text-center py-2 px-3">
                        <div className="flex flex-col items-center">
                          <Smartphone className="h-5 w-5 mb-1 text-blue-400" />
                          <span>NFC-Enabled</span>
                        </div>
                      </th>
                      <th className="text-center py-2 px-3">
                        <div className="flex flex-col items-center">
                          <Sparkles className="h-5 w-5 mb-1 text-purple-400" />
                          <span>NFC + NFT</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-zinc-800">
                      <td className="py-2 px-3">Physical Product</td>
                      <td className="text-center py-2 px-3">✅</td>
                      <td className="text-center py-2 px-3">✅</td>
                      <td className="text-center py-2 px-3">✅</td>
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="py-2 px-3">Wear Tracking</td>
                      <td className="text-center py-2 px-3">❌</td>
                      <td className="text-center py-2 px-3">✅</td>
                      <td className="text-center py-2 px-3">✅</td>
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="py-2 px-3">Earn Tokens</td>
                      <td className="text-center py-2 px-3">❌</td>
                      <td className="text-center py-2 px-3">✅</td>
                      <td className="text-center py-2 px-3">✅</td>
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="py-2 px-3">Digital Collectible</td>
                      <td className="text-center py-2 px-3">❌</td>
                      <td className="text-center py-2 px-3">❌</td>
                      <td className="text-center py-2 px-3">✅</td>
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="py-2 px-3">Reward Multiplier</td>
                      <td className="text-center py-2 px-3">1x</td>
                      <td className="text-center py-2 px-3">2x</td>
                      <td className="text-center py-2 px-3">3x</td>
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="py-2 px-3">Exclusive Challenges</td>
                      <td className="text-center py-2 px-3">❌</td>
                      <td className="text-center py-2 px-3">✅</td>
                      <td className="text-center py-2 px-3">✅</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Price Premium</td>
                      <td className="text-center py-2 px-3">Base Price</td>
                      <td className="text-center py-2 px-3">+15%</td>
                      <td className="text-center py-2 px-3">+20-35%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Link href="/merch">
              <Button>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse Merchandise
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
