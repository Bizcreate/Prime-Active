"use client"

import { useState, useEffect } from "react"
import { NFCService, type NFCMerchandiseTag } from "@/services/nfc-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Smartphone, AlertCircle } from "lucide-react"

interface NFCScannerProps {
  onTagDetected: (tag: NFCMerchandiseTag) => void
  onCancel: () => void
}

export function NFCScanner({ onTagDetected, onCancel }: NFCScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [compatibilityInfo, setCompatibilityInfo] = useState(NFCService.getDeviceCompatibilityInfo())

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const scanTag = async () => {
      try {
        setIsScanning(true)
        setError(null)

        // For demo/preview purposes, simulate a successful scan after 3 seconds
        if (!compatibilityInfo.isCompatible) {
          timeoutId = setTimeout(() => {
            const simulatedTag: NFCMerchandiseTag = {
              id: `tag_${Math.random().toString(36).substring(2, 11)}`,
              productId: `prod_${Math.random().toString(36).substring(2, 11)}`,
              productType: "hoodie",
              productName: "Board Club Hoodie",
              serialNumber: `SN${Math.floor(Math.random() * 1000000)}`,
              manufactureDate: new Date().toISOString(),
              isAuthentic: true,
            }
            onTagDetected(simulatedTag)
            setIsScanning(false)
          }, 3000)
          return
        }

        const tag = await NFCService.scanNFCTag()
        if (tag) {
          onTagDetected(tag)
        } else {
          setError("No NFC tag detected. Please try again.")
        }
      } catch (err: any) {
        setError(err.message || "Failed to scan NFC tag")
      } finally {
        setIsScanning(false)
      }
    }

    scanTag()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [onTagDetected, compatibilityInfo.isCompatible])

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {!compatibilityInfo.isCompatible && (
            <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-800 rounded-lg text-left w-full">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-500 mb-1">NFC compatibility warning</p>
                  <p className="text-xs text-zinc-400">
                    {compatibilityInfo.reason}. For this demo, we'll simulate NFC scanning.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="relative mb-6">
            {isScanning ? (
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Smartphone className="h-12 w-12 text-primary" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-dashed animate-[spin_3s_linear_infinite]"></div>
              </div>
            ) : error ? (
              <div className="w-32 h-32 rounded-full bg-red-900/20 flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center">
                <Smartphone className="h-12 w-12 text-primary" />
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold mb-2">
            {isScanning ? "Scanning for NFC Tag..." : error ? "Scanning Failed" : "Ready to Scan"}
          </h2>

          <p className="text-zinc-400 mb-6">
            {isScanning
              ? "Hold your phone near the NFC tag on your merchandise"
              : error
                ? error
                : "Tap the button below to start scanning for your Prime Active merchandise"}
          </p>

          {isScanning ? (
            <Button disabled className="w-full mb-3">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Scanning...
            </Button>
          ) : (
            <Button
              onClick={() => {
                setIsScanning(true)
                setError(null)
                // Restart the scanning process
                setTimeout(() => {
                  const simulatedTag: NFCMerchandiseTag = {
                    id: `tag_${Math.random().toString(36).substring(2, 11)}`,
                    productId: `prod_${Math.random().toString(36).substring(2, 11)}`,
                    productType: "hoodie",
                    productName: "Board Club Hoodie",
                    serialNumber: `SN${Math.floor(Math.random() * 1000000)}`,
                    manufactureDate: new Date().toISOString(),
                    isAuthentic: true,
                  }
                  onTagDetected(simulatedTag)
                  setIsScanning(false)
                }, 3000)
              }}
              className="w-full mb-3 bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90"
            >
              {error ? "Try Again" : "Start Scanning"}
            </Button>
          )}

          <Button variant="outline" onClick={onCancel} className="w-full">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
