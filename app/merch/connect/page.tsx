"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Smartphone, Check, AlertCircle } from "lucide-react"
import Link from "next/link"
import { TabBar } from "@/components/tab-bar"
import Image from "next/image"
import { MerchandiseWearService } from "@/services/nfc-service"

export default function ConnectMerchandisePage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<null | { success: boolean; message: string }>(null)
  const [nfcSupported, setNfcSupported] = useState<boolean | null>(null)
  const [detectedItem, setDetectedItem] = useState<any>(null)

  useEffect(() => {
    // Check if NFC is supported
    if (typeof window !== "undefined") {
      if ("NDEFReader" in window) {
        setNfcSupported(true)
      } else {
        setNfcSupported(false)
      }
    }
  }, [])

  const startScan = async () => {
    setIsScanning(true)
    setScanResult(null)
    setDetectedItem(null)

    try {
      // Simulate NFC scanning
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate successful scan
      const mockItem = {
        id: `nfc-${Date.now()}`,
        productName: "Prime Mates Hoodie",
        productId: "product3",
        image: "/black-hoodie-abstract-ape.png",
        dateConnected: new Date().toISOString(),
        lastWorn: new Date().toISOString(),
        totalWearTime: 0,
        tokenRewards: 0,
        isCurrentlyWorn: false,
        wearingSince: null,
      }

      setDetectedItem(mockItem)
      setScanResult({ success: true, message: "NFC tag detected!" })
    } catch (error) {
      console.error("Scan error:", error)
      setScanResult({ success: false, message: "Failed to scan NFC tag. Please try again." })
    } finally {
      setIsScanning(false)
    }
  }

  const connectItem = () => {
    if (detectedItem) {
      // Add item to connected merchandise
      MerchandiseWearService.addMerchandise(detectedItem)

      // Navigate to merchandise page
      window.location.href = "/merch"
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/merch">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Connect Merchandise</h1>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/prime-mates-logo.png"
              alt="Prime Mates Board Club"
              width={150}
              height={75}
              className="object-contain"
            />
          </div>
          <h2 className="text-lg font-bold text-center mb-2">Connect Your Merchandise</h2>
          <p className="text-sm text-zinc-400 text-center mb-6">
            Scan the NFC tag embedded in your Prime Mates merchandise to connect it to your account and start earning
            rewards.
          </p>

          {nfcSupported === false && (
            <div className="bg-yellow-900/20 border border-yellow-900 rounded-md p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-500 mb-1">NFC Not Supported</h3>
                  <p className="text-xs text-zinc-300">
                    Your device doesn't support NFC scanning. Please try using a different device or contact support for
                    assistance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!detectedItem ? (
            <div className="bg-zinc-800 rounded-lg p-8 flex flex-col items-center justify-center">
              {isScanning ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 relative">
                    <Smartphone className="h-8 w-8 text-blue-500" />
                    <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping"></div>
                  </div>
                  <h3 className="font-medium mb-2">Scanning...</h3>
                  <p className="text-sm text-zinc-400 text-center mb-4">
                    Hold your phone near the NFC tag on your merchandise
                  </p>
                  <Button variant="outline" onClick={() => setIsScanning(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-zinc-700 flex items-center justify-center mb-4">
                    <Smartphone className="h-8 w-8 text-zinc-400" />
                  </div>
                  <h3 className="font-medium mb-2">Ready to Scan</h3>
                  <p className="text-sm text-zinc-400 text-center mb-4">
                    Tap the button below to start scanning for NFC tags
                  </p>
                  <Button onClick={startScan} disabled={nfcSupported === false}>
                    Start Scanning
                  </Button>
                </>
              )}

              {scanResult && (
                <div
                  className={`mt-4 p-3 rounded-md w-full text-sm ${
                    scanResult.success
                      ? "bg-green-900/20 border border-green-900 text-green-500"
                      : "bg-red-900/20 border border-red-900 text-red-500"
                  }`}
                >
                  {scanResult.message}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-zinc-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Item Detected</h3>
                  <p className="text-sm text-zinc-400">Ready to connect to your account</p>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4 mb-6 flex items-center">
                <div className="relative w-16 h-16 mr-4">
                  <Image
                    src={detectedItem.image || "/placeholder.svg"}
                    alt={detectedItem.productName}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{detectedItem.productName}</h3>
                  <p className="text-xs text-zinc-400 mb-1">Prime Mates Official Merchandise</p>
                  <div className="flex items-center text-xs text-primary">
                    <Image src="/banana-icon.png" alt="Rewards" width={12} height={12} className="mr-1" />
                    <span>Earn tokens for wearing this item</span>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={connectItem}>
                Connect Item
              </Button>
            </div>
          )}
        </div>

        <div className="bg-zinc-900 rounded-lg p-6">
          <h3 className="font-medium mb-3">How It Works</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-sm font-medium">1</span>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Scan NFC Tag</h4>
                <p className="text-xs text-zinc-400">
                  Hold your phone near the NFC tag embedded in your Prime Mates merchandise.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-sm font-medium">2</span>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Connect to Account</h4>
                <p className="text-xs text-zinc-400">
                  Once detected, connect the item to your account to start tracking wear time.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-sm font-medium">3</span>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Earn Rewards</h4>
                <p className="text-xs text-zinc-400">
                  Earn tokens for every minute you wear your connected merchandise. The longer you wear it, the more you
                  earn!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TabBar activeTab="merch" />
    </main>
  )
}
