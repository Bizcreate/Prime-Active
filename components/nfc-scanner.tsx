"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, X, CheckCircle, AlertTriangle } from "lucide-react"
import Image from "next/image"

export interface NFCMerchandiseTag {
  id: string
  productId: string
  productName: string
  productType: string
  serialNumber: string
  manufacturingDate: string
}

interface NFCScannerProps {
  onTagDetected: (tag: NFCMerchandiseTag) => void
  onCancel: () => void
}

export function NFCScanner({ onTagDetected, onCancel }: NFCScannerProps) {
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [detectedTag, setDetectedTag] = useState<NFCMerchandiseTag | null>(null)

  // Start scanning when component mounts
  useEffect(() => {
    startScanning()
    return () => {
      // Clean up any resources if needed
    }
  }, [])

  // Simulate scanning progress
  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 5
        })
      }, 150)

      // Simulate tag detection after a random time
      const detectionTimeout = setTimeout(
        () => {
          const randomProductTypes = ["tshirt", "snapback", "jumper", "board", "wristband"]
          const randomProductType = randomProductTypes[Math.floor(Math.random() * randomProductTypes.length)]

          const mockTag: NFCMerchandiseTag = {
            id: `nfc-${Date.now()}`,
            productId: `prod-${Math.floor(Math.random() * 10000)}`,
            productName: `Prime Mates ${randomProductType.charAt(0).toUpperCase() + randomProductType.slice(1)}`,
            productType: randomProductType,
            serialNumber: `PM${Math.floor(Math.random() * 10000)}`,
            manufacturingDate: new Date().toISOString(),
          }

          setDetectedTag(mockTag)
          setScanning(false)
          clearInterval(interval)
          setProgress(100)
        },
        Math.random() * 3000 + 2000,
      ) // Between 2-5 seconds

      return () => {
        clearInterval(interval)
        clearTimeout(detectionTimeout)
      }
    }
  }, [scanning])

  const startScanning = () => {
    setScanning(true)
    setError(null)
    setProgress(0)
    setDetectedTag(null)

    // Check if browser supports NFC
    if (typeof window !== "undefined" && !("NDEFReader" in window)) {
      setError("NFC is not supported on this device. Please try using a different device.")
      setScanning(false)
      return
    }
  }

  const handleConfirm = () => {
    if (detectedTag) {
      onTagDetected(detectedTag)
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
      <div className="relative h-12 bg-zinc-800 flex items-center justify-center">
        <h3 className="font-medium">NFC Scanner</h3>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-6">
        {error ? (
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">NFC Error</h3>
            <p className="text-sm text-red-400 mb-4">{error}</p>
            <Button onClick={startScanning}>Try Again</Button>
          </div>
        ) : detectedTag ? (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">NFC Tag Detected!</h3>

            <div className="bg-zinc-800 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-3">
                <div className="relative w-16 h-16 mr-3">
                  <Image
                    src={`/prime-mates-${detectedTag.productType}.png`}
                    alt={detectedTag.productName}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      ;(e.target as HTMLImageElement).src = "/prime-mates-tshirt.png"
                    }}
                  />
                </div>
                <div className="text-left">
                  <h4 className="font-medium">{detectedTag.productName}</h4>
                  <p className="text-xs text-zinc-500">Serial: {detectedTag.serialNumber}</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-zinc-400 mb-4">
              This merchandise has been detected and is ready to be connected to your account.
            </p>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={startScanning}>
                Scan Again
              </Button>
              <Button className="flex-1" onClick={handleConfirm}>
                Connect Item
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <Smartphone className="h-16 w-16 text-zinc-700" />
                {scanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-lg font-medium mb-2">Scanning for NFC Tag</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Hold your phone near the NFC tag on your merchandise to connect it.
            </p>

            <div className="w-full bg-zinc-800 rounded-full h-2 mb-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-zinc-500 mb-4">
              <span>Scanning...</span>
              <span>{progress}%</span>
            </div>

            <Button variant="outline" onClick={onCancel} disabled={false}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
