"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Clock, Shirt, Star, Timer, AlertTriangle, Share2, QrCode } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { merchandiseWearService, type ConnectedMerchandise } from "@/services/merchandise-wear-service"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { TabBar } from "@/components/tab-bar"

export default function MerchandiseItemPage() {
  const [merchandise, setMerchandise] = useState<ConnectedMerchandise | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id as string

  // Load merchandise data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Add a slight delay to simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get merchandise by ID
        const item = merchandiseWearService.getMerchandiseById(id)

        if (!item) {
          setError("Merchandise not found")
          return
        }

        setMerchandise(item)
      } catch (error) {
        console.error("Error loading merchandise data:", error)
        setError("Failed to load merchandise data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id])

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
  const handleToggleWearing = () => {
    if (!merchandise) return

    try {
      if (merchandise.isCurrentlyWorn) {
        merchandiseWearService.stopWearing(merchandise.id)
        toast({
          title: "Stopped wearing",
          description: `You've stopped wearing ${merchandise.productName}`,
        })
      } else {
        merchandiseWearService.startWearing(merchandise.id)
        toast({
          title: "Started wearing",
          description: `You're now wearing ${merchandise.productName}`,
        })
      }

      // Refresh merchandise data
      const updatedItem = merchandiseWearService.getMerchandiseById(id)
      setMerchandise(updatedItem || null)
    } catch (error) {
      console.error("Error toggling wear status:", error)
      toast({
        title: "Error",
        description: "Failed to update wear status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle share
  const handleShare = () => {
    if (!merchandise) return

    if (navigator.share) {
      navigator
        .share({
          title: `Check out my ${merchandise.productName}`,
          text: `I've been wearing my ${merchandise.productName} for ${formatWearTime(merchandise.totalWearTime)}!`,
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Error sharing:", error)
        })
    } else {
      toast({
        title: "Share",
        description: "Sharing is not supported on this device",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-black pb-20">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Link href="/merch/collection">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Merchandise Details</h1>
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-400">Loading merchandise details...</p>
          </div>
        </div>

        <TabBar activeTab="merch" />
      </div>
    )
  }

  if (error || !merchandise) {
    return (
      <div className="flex min-h-screen flex-col bg-black pb-20">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Link href="/merch/collection">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Merchandise Details</h1>
          </div>

          <div className="bg-red-900/20 rounded-lg p-6 text-center">
            <div className="bg-red-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">Merchandise Not Found</h3>
            <p className="text-zinc-400 text-sm mb-4">
              {error || "The merchandise item you're looking for doesn't exist or has been removed."}
            </p>
            <Link href="/merch/collection">
              <Button className="bg-[#ffc72d] hover:bg-[#e6b328] text-black">Return to Collection</Button>
            </Link>
          </div>
        </div>

        <TabBar activeTab="merch" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/merch/collection">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Merchandise Details</h1>

          <div className="ml-auto">
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Product Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden mb-6 bg-zinc-900">
          <Image
            src={merchandise.image || "/placeholder.svg?height=400&width=400&query=merchandise"}
            alt={merchandise.productName}
            fill
            className="object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold">{merchandise.productName}</h2>
            <div className="flex gap-1">
              {merchandise.hasNFC && <Badge className="bg-blue-500 text-white">NFC</Badge>}
              {merchandise.hasNFT && <Badge className="bg-purple-500 text-white">NFT</Badge>}
            </div>
          </div>
          <p className="text-zinc-400 text-sm mb-4">
            Connected {formatDistanceToNow(new Date(merchandise.dateConnected), { addSuffix: true })}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-zinc-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-zinc-500" />
                <span className="text-sm text-zinc-400">Total Wear Time</span>
              </div>
              <p className="text-lg font-bold">{formatWearTime(merchandise.totalWearTime)}</p>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-4 w-4 text-zinc-500" />
                <span className="text-sm text-zinc-400">Tokens Earned</span>
              </div>
              <p className="text-lg font-bold">{merchandise.tokenRewards} SHAKA</p>
            </div>
          </div>

          <div className="bg-zinc-800 p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Shirt className="h-4 w-4 text-zinc-500" />
              <span className="text-sm text-zinc-400">Wear Status</span>
            </div>
            <p className="text-lg font-bold">
              {merchandise.isCurrentlyWorn ? (
                <>
                  Wearing since{" "}
                  {formatDistanceToNow(new Date(merchandise.wearingSince || new Date()), { addSuffix: true })}
                </>
              ) : (
                "Not currently worn"
              )}
            </p>
          </div>

          <Button
            variant={merchandise.isCurrentlyWorn ? "destructive" : "default"}
            className={`w-full ${!merchandise.isCurrentlyWorn ? "bg-[#ffc72d] hover:bg-[#e6b328] text-black" : ""}`}
            onClick={handleToggleWearing}
          >
            {merchandise.isCurrentlyWorn ? "Stop Wearing" : "Start Wearing"}
          </Button>
        </div>

        {/* Wear to Earn Info */}
        <Card className="bg-zinc-900 border-0 mb-6">
          <CardContent className="p-4">
            <h3 className="font-bold mb-2">Wear to Earn</h3>
            <p className="text-sm text-zinc-400 mb-3">
              Earn SHAKA tokens by wearing your merchandise. The longer you wear, the more you earn!
            </p>
            <div className="flex items-center gap-2 text-sm mb-2">
              <Timer className="h-4 w-4 text-zinc-500" />
              <span>1 SHAKA token per 10 minutes of wear time</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-zinc-500" />
              <span>Bonus rewards for wearing multiple items</span>
            </div>
          </CardContent>
        </Card>

        {/* NFC Info */}
        {merchandise.hasNFC && (
          <Card className="bg-zinc-900 border-0 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <QrCode className="h-5 w-5 text-blue-500" />
                <h3 className="font-bold">NFC Connected</h3>
              </div>
              <p className="text-sm text-zinc-400 mb-3">
                This item has an NFC tag that verifies its authenticity and enables wear tracking.
              </p>
              <div className="bg-zinc-800 p-3 rounded-lg">
                <p className="text-sm">
                  Product ID: <span className="text-zinc-400">{merchandise.productId}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* NFT Info */}
        {merchandise.hasNFT && (
          <Card className="bg-zinc-900 border-0">
            <CardContent className="p-4">
              <h3 className="font-bold mb-2">NFT Benefits</h3>
              <p className="text-sm text-zinc-400 mb-3">
                This merchandise is linked to an NFT, providing additional benefits and digital ownership.
              </p>
              <Link href="/wallet">
                <Button variant="outline" className="w-full">
                  View in Wallet
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
