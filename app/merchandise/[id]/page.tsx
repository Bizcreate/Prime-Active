"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Timer, Play, Pause, Trash2 } from "lucide-react"
import Link from "next/link"
import { MerchandiseWearService, type ConnectedMerchandise } from "@/services/nfc-service"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function MerchandiseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [item, setItem] = useState<ConnectedMerchandise | null>(null)
  const [isWearing, setIsWearing] = useState(false)
  const [wearTime, setWearTime] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    // Load merchandise data
    const items = MerchandiseWearService.getConnectedMerchandise()
    const foundItem = items.find((m) => m.id === params.id)

    if (foundItem) {
      setItem(foundItem)
      setIsWearing(foundItem.isCurrentlyWorn)
      setWearTime(formatWearTime(foundItem.totalWearTime))
    } else {
      // Item not found, redirect to merchandise page
      router.push("/merchandise")
    }

    // Set up interval to refresh data
    const interval = setInterval(() => {
      const updatedItems = MerchandiseWearService.getConnectedMerchandise()
      const updatedItem = updatedItems.find((m) => m.id === params.id)

      if (updatedItem) {
        setItem(updatedItem)
        setIsWearing(updatedItem.isCurrentlyWorn)
        setWearTime(formatWearTime(updatedItem.totalWearTime))
      }
    }, 10000) // Refresh every 10 seconds

    return () => clearInterval(interval)
  }, [params.id, router])

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

  const toggleWearing = () => {
    if (!item) return

    if (isWearing) {
      // Stop wearing
      const updatedItem = MerchandiseWearService.stopWearing(item.id)
      if (updatedItem) {
        setItem(updatedItem)
        setIsWearing(false)
        setWearTime(formatWearTime(updatedItem.totalWearTime))
      }
    } else {
      // Start wearing
      const updatedItem = MerchandiseWearService.startWearing(item.id)
      if (updatedItem) {
        setItem(updatedItem)
        setIsWearing(true)
      }
    }
  }

  const handleDelete = () => {
    if (!item) return

    MerchandiseWearService.removeMerchandise(item.id)
    router.push("/merchandise")
  }

  if (!item) {
    return (
      <main className="flex min-h-screen flex-col bg-black p-6">
        <div className="flex items-center mb-6">
          <Link href="/merchandise">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Item Details</h1>
        </div>

        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/merchandise">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Item Details</h1>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 mb-6">
          <div className="relative w-40 h-40 mx-auto mb-4">
            <Image src={item.image || "/placeholder.svg"} alt={item.productName} fill className="object-contain" />
          </div>

          <h2 className="text-xl font-bold text-center mb-1">{item.productName}</h2>
          <p className="text-zinc-500 text-sm text-center mb-4">Serial: {item.serialNumber}</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-zinc-800 p-3 rounded-lg text-center">
              <Clock className="h-5 w-5 text-[#ffc72d] mx-auto mb-1" />
              <p className="text-sm text-zinc-400">Total Wear Time</p>
              <p className="font-medium">{wearTime}</p>
            </div>

            <div className="bg-zinc-800 p-3 rounded-lg text-center">
              <Image
                src="/shaka-coin.png"
                alt="Tokens Earned"
                width={20}
                height={20}
                className="object-contain mx-auto mb-1"
              />
              <p className="text-sm text-zinc-400">Tokens Earned</p>
              <p className="font-medium text-[#ffc72d]">{item.tokenRewards}</p>
            </div>
          </div>

          <Button
            onClick={toggleWearing}
            className={`w-full ${
              isWearing ? "bg-red-600 hover:bg-red-700" : "bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90"
            }`}
          >
            {isWearing ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop Wearing
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Wearing
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Item Details</h3>

          <div className="bg-zinc-900 rounded-lg p-4">
            <div className="flex justify-between py-2 border-b border-zinc-800">
              <span className="text-zinc-400">Product Type</span>
              <span className="capitalize">{item.productType}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-zinc-800">
              <span className="text-zinc-400">Connected On</span>
              <span>{new Date(item.connectionDate).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-zinc-800">
              <span className="text-zinc-400">Last Worn</span>
              <span>
                {isWearing ? "Currently wearing" : formatDistanceToNow(new Date(item.lastWorn), { addSuffix: true })}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-zinc-400">Reward Rate</span>
              <span className="text-[#ffc72d]">1 token per 10 minutes</span>
            </div>
          </div>

          {isWearing && (
            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
              <div className="flex items-start">
                <Timer className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-500 mb-1">Currently tracking wear time</p>
                  <p className="text-xs text-zinc-400">
                    You've been wearing this item for{" "}
                    {item.wearingSince
                      ? formatDistanceToNow(new Date(item.wearingSince), { addSuffix: false })
                      : "a few moments"}
                    . Keep wearing to earn more tokens!
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full text-red-500 hover:text-red-400 hover:bg-red-950"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove Item
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disconnect this merchandise from your account. You can always reconnect it later by scanning the
              NFC tag again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
