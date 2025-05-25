"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TabBar } from "@/components/tab-bar"
import {
  ArrowLeft,
  Clock,
  Shirt,
  Star,
  Timer,
  Smartphone,
  Plus,
  Loader2,
  AlertTriangle,
  ShoppingBag,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { merchandiseWearService, type ConnectedMerchandise } from "@/services/merchandise-wear-service"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export default function MerchandiseCollectionPage() {
  const [merchandise, setMerchandise] = useState<ConnectedMerchandise[]>([])
  const [activeItems, setActiveItems] = useState<ConnectedMerchandise[]>([])
  const [totalTokens, setTotalTokens] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isNfcScanning, setIsNfcScanning] = useState(false)
  const [nfcError, setNfcError] = useState<string | null>(null)
  const [newItemHighlight, setNewItemHighlight] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const highlightId = searchParams?.get("highlight")

  // Load merchandise data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setNfcError(null)

        // Add a slight delay to simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Load merchandise data
        const items = merchandiseWearService.getConnectedMerchandise()

        // Ensure we have at least some demo items if none exist
        if (!items || items.length === 0 || items.length < 3) {
          merchandiseWearService.addDemoItems()
        }

        const updatedItems = merchandiseWearService.getConnectedMerchandise()
        setMerchandise(updatedItems || [])

        // Get currently worn items
        const worn = merchandiseWearService.getCurrentlyWornItems()
        setActiveItems(worn || [])

        // Get total tokens
        const tokens = merchandiseWearService.getTotalEarnedTokens()
        setTotalTokens(tokens || 0)

        // Check if we should highlight a new item
        if (highlightId) {
          setNewItemHighlight(highlightId)

          // Clear the highlight after 5 seconds
          setTimeout(() => {
            setNewItemHighlight(null)
          }, 5000)
        }
      } catch (error) {
        console.error("Error loading merchandise data:", error)
        toast({
          title: "Error",
          description: "Failed to load merchandise data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [highlightId, toast])

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
  const handleToggleWearing = (item: ConnectedMerchandise) => {
    try {
      if (item.isCurrentlyWorn) {
        merchandiseWearService.stopWearing(item.id)
        toast({
          title: "Stopped wearing",
          description: `You've stopped wearing ${item.productName}`,
        })
      } else {
        merchandiseWearService.startWearing(item.id)
        toast({
          title: "Started wearing",
          description: `You're now wearing ${item.productName}`,
        })
      }

      // Refresh merchandise list
      const items = merchandiseWearService.getConnectedMerchandise()
      setMerchandise(items || [])

      // Get currently worn items
      const worn = merchandiseWearService.getCurrentlyWornItems()
      setActiveItems(worn || [])
    } catch (error) {
      console.error("Error toggling wear status:", error)
      toast({
        title: "Error",
        description: "Failed to update wear status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Connect NFC item
  const handleConnectNFC = async () => {
    try {
      setIsNfcScanning(true)
      setNfcError(null)

      // Check if NFC is available
      if (typeof window !== "undefined" && !("NDEFReader" in window)) {
        setNfcError("NFC is not supported on this device. Please try using a different device.")
        setIsNfcScanning(false)
        return
      }

      // Simulate NFC scanning
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate a random merchandise item
      const productTypes = ["hat", "tshirt", "hoodie", "shoes", "accessory"]
      const randomType = productTypes[Math.floor(Math.random() * productTypes.length)]

      // Get product name and image based on type
      let productName = ""
      let image = ""

      switch (randomType) {
        case "hat":
          productName = "Prime Mates Snapback"
          image = "/prime-mates-snapback.png"
          break
        case "tshirt":
          productName = "Prime Mates T-Shirt"
          image = "/prime-mates-tshirt.png"
          break
        case "hoodie":
          productName = "Prime Mates Jumper"
          image = "/prime-mates-jumper.png"
          break
        case "shoes":
          productName = "Prime Mates Sneakers"
          image = "/banana-board.png" // Placeholder
          break
        case "accessory":
          productName = "Prime Mates Wristband"
          image = "/banana-grip.png" // Placeholder
          break
      }

      // Create new merchandise item
      const newItem: ConnectedMerchandise = {
        id: `merch-${Date.now()}`,
        productName,
        productId: `prod-${Date.now()}`,
        image,
        dateConnected: new Date().toISOString(),
        lastWorn: new Date().toISOString(),
        totalWearTime: 0,
        tokenRewards: 0,
        isCurrentlyWorn: false,
        wearingSince: null,
        hasNFC: true,
        hasNFT: Math.random() > 0.5,
      }

      // Add to merchandise
      merchandiseWearService.addMerchandise(newItem)

      // Refresh merchandise list
      const items = merchandiseWearService.getConnectedMerchandise()
      setMerchandise(items || [])

      // Highlight the new item
      setNewItemHighlight(newItem.id)
      setTimeout(() => setNewItemHighlight(null), 5000)

      toast({
        title: "NFC Connected",
        description: `${productName} has been added to your collection!`,
      })

      setIsNfcScanning(false)
    } catch (error) {
      console.error("NFC scan error:", error)
      setNfcError("Failed to scan NFC tag. Please try again.")
      setIsNfcScanning(false)

      toast({
        title: "Connection Failed",
        description: "Failed to connect NFC tag. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleItemClick = (itemId: string) => {
    router.push(`/merch/${itemId}`)
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

          <div className="ml-auto">
            <Button size="sm" onClick={handleConnectNFC} disabled={isNfcScanning}>
              {isNfcScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Connect NFC
                </>
              )}
            </Button>
          </div>
        </div>

        {nfcError && (
          <div className="bg-red-900 rounded-lg p-4 text-sm flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4" />
            {nfcError}
          </div>
        )}

        {/* Stats card */}
        <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-l-4 border-l-[#ffc72d] mb-6">
          <CardContent className="p-4">
            <h2 className="font-bold mb-3">Wear Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-zinc-400">Active Items</div>
                <div className="text-xl font-bold">{activeItems?.length || 0}</div>
              </div>
              <div>
                <div className="text-sm text-zinc-400">Tokens Earned</div>
                <div className="text-xl font-bold">{totalTokens}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-400">Loading your collection...</p>
          </div>
        ) : !merchandise || merchandise.length === 0 ? (
          <div className="bg-zinc-900 rounded-lg p-6 text-center">
            <div className="bg-zinc-800 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Smartphone className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">No Merchandise Connected</h3>
            <p className="text-zinc-400 text-sm mb-4">Connect your Prime Mates merchandise to earn rewards</p>
            <div className="flex flex-col gap-3">
              <Button className="bg-[#ffc72d] hover:bg-[#e6b328] text-black" onClick={handleConnectNFC}>
                <Smartphone className="mr-2 h-4 w-4" />
                Connect NFC Item
              </Button>
              <Link href="/store">
                <Button variant="outline" className="w-full">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {merchandise.map((item) => (
              <motion.div
                key={item.id}
                initial={newItemHighlight === item.id ? { scale: 0.9, opacity: 0 } : false}
                animate={newItemHighlight === item.id ? { scale: 1, opacity: 1 } : false}
                className={`bg-zinc-900 rounded-lg p-4 border-l-4 border-l-[#ffc72d] ${
                  newItemHighlight === item.id ? "ring-2 ring-[#ffc72d] ring-opacity-50" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => handleItemClick(item.id)}
                  >
                    <div className="w-12 h-12 relative rounded-full overflow-hidden bg-zinc-800">
                      <Image
                        src={item.image || "/placeholder.svg?height=48&width=48&query=merchandise"}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">{item.productName}</h3>
                      <p className="text-zinc-500 text-sm">
                        Connected {formatDistanceToNow(new Date(item.dateConnected), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {item.hasNFC && <Badge className="bg-blue-500 text-white">NFC</Badge>}
                    {item.hasNFT && <Badge className="bg-purple-500 text-white">NFT</Badge>}
                    {newItemHighlight === item.id && <Badge className="bg-green-500 text-white">NEW</Badge>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-zinc-500" />
                    <span>{formatWearTime(item.totalWearTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shirt className="h-4 w-4 text-zinc-500" />
                    <span>
                      {item.isCurrentlyWorn ? (
                        <>
                          Wearing since{" "}
                          {formatDistanceToNow(new Date(item.wearingSince || new Date()), { addSuffix: true })}
                        </>
                      ) : (
                        "Not currently worn"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-zinc-500" />
                    <span>{item.tokenRewards} Tokens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-zinc-500" />
                    <span>Earn tokens by wearing</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant={item.isCurrentlyWorn ? "destructive" : "outline"}
                    className={`flex-1 ${item.isCurrentlyWorn ? "" : "hover:bg-[#ffc72d] hover:text-black"}`}
                    onClick={() => handleToggleWearing(item)}
                  >
                    {item.isCurrentlyWorn ? "Stop Wearing" : "Start Wearing"}
                  </Button>

                  <Link href={`/merch/${item.id}`}>
                    <Button variant="outline" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
