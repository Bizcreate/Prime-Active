"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Tag, Timer, AlertTriangle, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { TabBar } from "@/components/tab-bar"
import { merchandiseWearService, type ConnectedMerchandise } from "@/services/merchandise-wear-service"
import { formatDistanceToNow } from "date-fns"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default function MerchandiseDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [merchandise, setMerchandise] = useState<ConnectedMerchandise | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      const item = merchandiseWearService.getMerchandiseById(id)
      setMerchandise(item)
      setIsLoading(false)

      if (!item) {
        setError("Merchandise not found")
      }
    }
  }, [id])

  const handleToggleWearing = () => {
    if (!merchandise) return

    if (merchandise.isCurrentlyWorn) {
      merchandiseWearService.stopWearing(merchandise.id)
    } else {
      merchandiseWearService.startWearing(merchandise.id)
    }

    // Refresh merchandise data
    const updatedItem = merchandiseWearService.getMerchandiseById(merchandise.id)
    setMerchandise(updatedItem)
  }

  const formatWearTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} minutes`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours < 24) {
      return `${hours} hours ${remainingMinutes} minutes`
    }

    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24

    return `${days} days ${remainingHours} hours`
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-black items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="mt-4 text-zinc-400">Loading merchandise details...</p>
      </div>
    )
  }

  if (error || !merchandise) {
    return (
      <div className="flex min-h-screen flex-col bg-black p-6">
        <Link href="/merch">
          <Button variant="ghost" size="icon" className="mb-6">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-xl font-bold mb-2">Merchandise Not Found</h1>
          <p className="text-zinc-400 mb-6">
            The merchandise item you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/merch">
            <Button>Return to Merchandise</Button>
          </Link>
        </div>
      </div>
    )
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
          <h1 className="text-xl font-bold">Merchandise Details</h1>
        </div>

        <div className="bg-zinc-900 rounded-lg overflow-hidden mb-6">
          <div className="relative h-64">
            <Image
              src={merchandise.image || "/placeholder.svg"}
              alt={merchandise.productName}
              fill
              className="object-contain p-4"
            />
            {merchandise.isCurrentlyWorn && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500 text-black">Currently Wearing</Badge>
              </div>
            )}
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{merchandise.productName}</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-800 p-4 rounded-lg flex flex-col items-center">
                <div className="mb-2">
                  <Clock className="h-6 w-6 text-[#ffc72d]" />
                </div>
                <div className="text-xl font-bold">{formatWearTime(merchandise.totalWearTime)}</div>
                <div className="text-xs text-zinc-400 text-center">Total Wear Time</div>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg flex flex-col items-center">
                <div className="mb-2">
                  <Image src="/shaka-coin.png" alt="Tokens Earned" width={24} height={24} className="object-contain" />
                </div>
                <div className="text-xl font-bold text-[#ffc72d]">{merchandise.tokenRewards}</div>
                <div className="text-xs text-zinc-400 text-center">Tokens Earned</div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-zinc-400" />
                  <span className="text-sm text-zinc-400">Serial Number</span>
                </div>
                <span className="text-sm font-medium">SN{merchandise.id.split("-")[1]}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-zinc-400" />
                  <span className="text-sm text-zinc-400">Connected On</span>
                </div>
                <span className="text-sm font-medium">{new Date(merchandise.dateConnected).toLocaleDateString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Timer className="h-4 w-4 mr-2 text-zinc-400" />
                  <span className="text-sm text-zinc-400">Last Worn</span>
                </div>
                <span className="text-sm font-medium">
                  {merchandise.isCurrentlyWorn
                    ? "Currently wearing"
                    : formatDistanceToNow(new Date(merchandise.lastWorn), { addSuffix: true })}
                </span>
              </div>
            </div>

            <Button
              className="w-full"
              variant={merchandise.isCurrentlyWorn ? "destructive" : "default"}
              onClick={handleToggleWearing}
            >
              {merchandise.isCurrentlyWorn ? (
                <>
                  <Timer className="h-4 w-4 mr-2" />
                  Stop Wearing
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Start Wearing
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Wear-to-Earn Rewards</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-sm font-medium">1</span>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Wear Your Merchandise</h4>
                <p className="text-xs text-zinc-400">
                  Press the "Start Wearing" button when you put on your merchandise and "Stop Wearing" when you take it
                  off.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-sm font-medium">2</span>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Earn Tokens</h4>
                <p className="text-xs text-zinc-400">
                  Earn 1 token for every 10 minutes you wear your merchandise. The app tracks your wear time
                  automatically.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-sm font-medium">3</span>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Redeem Rewards</h4>
                <p className="text-xs text-zinc-400">
                  Use your earned tokens for discounts on future purchases, exclusive merchandise, and special events.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">NFC Verification</h2>
          <p className="text-sm text-zinc-400 mb-4">
            This merchandise item has an embedded NFC chip that verifies its authenticity. Scan the NFC tag to verify
            that this is an official Prime Mates product.
          </p>
          <Button className="w-full" variant="outline">
            <Tag className="h-4 w-4 mr-2" />
            Verify Authenticity
          </Button>
        </div>
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
