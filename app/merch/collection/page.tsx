"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Clock, Smartphone, Sparkles, Timer, Trophy, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { TabBar } from "@/components/tab-bar"
import { nfcMerchandiseService, type MerchandiseItem } from "@/services/nfc-merchandise-service"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default function MerchandiseCollectionPage() {
  const [items, setItems] = useState<MerchandiseItem[]>([])
  const [activeItems, setActiveItems] = useState<MerchandiseItem[]>([])
  const [totalTokens, setTotalTokens] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; item?: MerchandiseItem } | null>(
    null,
  )

  useEffect(() => {
    // Load merchandise data
    const merchandiseItems = nfcMerchandiseService.getAllItems()
    setItems(merchandiseItems)

    // Get currently worn items
    const worn = nfcMerchandiseService.getCurrentlyWornItems()
    setActiveItems(worn)

    // Get total tokens
    const tokens = nfcMerchandiseService.getTotalTokensEarned()
    setTotalTokens(tokens)
  }, [])

  // Format wear time
  const formatWearTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours < 24) {
      return `${hours}h ${remainingMinutes}m`
    }

    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24

    return `${days}d ${remainingHours}h`
  }

  // Toggle item wearing
  const handleToggleWearing = (item: MerchandiseItem) => {
    if (item.isCurrentlyWorn) {
      const tokensEarned = nfcMerchandiseService.stopWearing(item.id)
      if (tokensEarned > 0) {
        setScanResult({
          success: true,
          message: `You earned ${tokensEarned} tokens for wearing this item!`,
        })
      }
    } else {
      nfcMerchandiseService.startWearing(item.id)
    }

    // Refresh data
    const merchandiseItems = nfcMerchandiseService.getAllItems()
    setItems(merchandiseItems)
    const worn = nfcMerchandiseService.getCurrentlyWornItems()
    setActiveItems(worn)
    const tokens = nfcMerchandiseService.getTotalTokensEarned()
    setTotalTokens(tokens)
  }

  // Scan NFC
  const handleScanNFC = async () => {
    setIsScanning(true)
    setScanResult(null)

    try {
      const result = await nfcMerchandiseService.scanNFC()

      if (result) {
        setScanResult({
          success: true,
          message: "NFC tag scanned successfully!",
          item: result,
        })

        // Refresh data
        const merchandiseItems = nfcMerchandiseService.getAllItems()
        setItems(merchandiseItems)
      } else {
        setScanResult({
          success: false,
          message: "No NFC tag detected. Please try again.",
        })
      }
    } catch (error) {
      setScanResult({
        success: false,
        message: "Error scanning NFC tag. Please try again.",
      })
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/merch">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">My Collection</h1>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-l-4 border-[#ffc72d]">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-2">
                  <Smartphone className="h-5 w-5 text-[#ffc72d]" />
                </div>
                <div className="text-2xl font-bold">{items.length}</div>
                <div className="text-xs text-zinc-400">Connected Items</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-l-4 border-[#ffc72d]">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-2">
                  <Image src="/shaka-coin.png" alt="Tokens" width={20} height={20} />
                </div>
                <div className="text-2xl font-bold text-[#ffc72d]">{totalTokens}</div>
                <div className="text-xs text-zinc-400">Tokens Earned</div>
              </CardContent>
            </Card>
          </div>

          <Button
            className="w-full bg-[#ffc72d] hover:bg-[#e6b328] text-black"
            onClick={handleScanNFC}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scanning NFC Tag...
              </>
            ) : (
              <>
                <Smartphone className="h-4 w-4 mr-2" />
                Scan NFC Tag
              </>
            )}
          </Button>

          {scanResult && (
            <Card
              className={
                scanResult.success
                  ? "bg-green-900/20 border-l-4 border-green-500"
                  : "bg-red-900/20 border-l-4 border-red-500"
              }
            >
              <CardContent className="p-4">
                <div className="flex items-start">
                  {scanResult.success ? (
                    <div className="w-8 h-8 rounded-full bg-green-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                      <Trophy className="h-4 w-4 text-green-500" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                      <Smartphone className="h-4 w-4 text-red-500" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium mb-1">{scanResult.success ? "Success!" : "Scan Failed"}</h4>
                    <p className="text-sm text-zinc-400">{scanResult.message}</p>
                    {scanResult.item && (
                      <div className="mt-2 flex items-center">
                        <div className="relative w-10 h-10 mr-2">
                          <Image
                            src={scanResult.item.image || "/placeholder.svg"}
                            alt={scanResult.item.name}
                            fill
                            className="object-contain rounded"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{scanResult.item.name}</p>
                          <Badge
                            className={scanResult.item.type === "nfc+nft" ? "bg-purple-500" : "bg-[#ffc72d] text-black"}
                          >
                            {scanResult.item.type === "nfc+nft" ? "NFC+NFT" : "NFC"}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeItems.length > 0 && (
            <div>
              <h2 className="text-lg font-medium mb-3">Currently Wearing</h2>
              <div className="space-y-3">
                {activeItems.map((item) => (
                  <Card
                    key={item.id}
                    className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-l-4 border-[#ffc72d]"
                  >
                    <CardContent className="p-4 flex items-center">
                      <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="flex items-center text-xs text-green-500">
                          <Timer className="h-3 w-3 mr-1" />
                          <span>
                            Wearing for{" "}
                            {formatDistanceToNow(new Date(item.wearingSince || Date.now()), { addSuffix: false })}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-2" onClick={() => handleToggleWearing(item)}>
                        Stop
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-medium mb-3">My Items</h2>
            {items.length === 0 ? (
              <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-l-4 border-[#ffc72d]">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="h-8 w-8 text-zinc-500" />
                  </div>
                  <h3 className="font-medium mb-2">No Items Connected</h3>
                  <p className="text-sm text-zinc-400 mb-4">
                    Connect your Prime Active merchandise to start earning rewards for wearing it.
                  </p>
                  <Button
                    className="w-full bg-[#ffc72d] hover:bg-[#e6b328] text-black"
                    onClick={handleScanNFC}
                    disabled={isScanning}
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      "Scan NFC Tag"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {items
                  .filter((item) => !item.isCurrentlyWorn)
                  .map((item) => (
                    <Card
                      key={item.id}
                      className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-l-4 border-[#ffc72d]"
                    >
                      <CardContent className="p-4 flex items-center">
                        <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                          {item.type === "nfc+nft" && (
                            <div className="absolute -top-1 -right-1">
                              <Badge className="bg-purple-500 text-white text-xs px-1 py-0">NFT</Badge>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-medium">{item.name}</h3>
                            {item.type === "nfc+nft" && <Sparkles className="h-3 w-3 ml-1 text-purple-400" />}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-zinc-500">
                              {item.lastWorn ? (
                                <span>
                                  Last worn {formatDistanceToNow(new Date(item.lastWorn), { addSuffix: true })}
                                </span>
                              ) : (
                                <span>Never worn</span>
                              )}
                            </div>
                            <div className="flex items-center text-xs text-[#ffc72d]">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatWearTime(item.totalWearTime)}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-2" onClick={() => handleToggleWearing(item)}>
                          Wear
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>

          <Card className="border-l-4 border-[#ffc72d] bg-gradient-to-br from-zinc-900 to-zinc-950">
            <CardHeader>
              <CardTitle>Wear-to-Earn Stats</CardTitle>
              <CardDescription>Your merchandise earning statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Total Wear Time:</span>
                  <span className="font-medium">
                    {formatWearTime(items.reduce((total, item) => total + item.totalWearTime, 0))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Total Tokens Earned:</span>
                  <span className="font-medium text-[#ffc72d]">{totalTokens}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Wear Sessions:</span>
                  <span className="font-medium">{items.reduce((total, item) => total + item.wearCount, 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">NFT-Backed Items:</span>
                  <span className="font-medium">
                    {items.filter((item) => item.type === "nfc+nft").length} / {items.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
