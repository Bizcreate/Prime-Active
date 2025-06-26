"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, Check, ArrowRight, Loader2, Sparkles } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface NFCPatchActivationProps {
  onComplete?: () => void
  onCancel?: () => void
  hasNFT?: boolean
}

export function NFCPatchActivation({ onComplete, onCancel, hasNFT = false }: NFCPatchActivationProps) {
  const [step, setStep] = useState<"intro" | "scanning" | "success">("intro")
  const [isScanning, setIsScanning] = useState(false)
  const [hasNFTState, setHasNFTState] = useState(hasNFT) // State to simulate NFT availability

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleStartScan = () => {
    setStep("scanning")
    setIsScanning(true)

    // Simulate NFC scanning with proper cleanup on unmount
    const timer = setTimeout(() => {
      // Only proceed if component is still mounted
      setIsScanning(false)
      setStep("success")
      // Simulate NFT being available sometimes
      setHasNFTState(Math.random() < 0.5)
    }, 3000)

    // Store timer reference for cleanup
    timerRef.current = timer
  }

  const handleComplete = () => {
    if (onComplete) {
      onComplete()
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Image src="/digital-threads.png" alt="NFC Patch" fill className="object-contain" />
              </div>
              <h3 className="text-lg font-bold mb-2">NFC Patch Activation</h3>
              <p className="text-sm text-zinc-400 mb-6">
                Connect your NFC patch to your sports gear to start tracking your activities and earning rewards.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm">Iron the patch onto your sports gear</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm">Scan the patch with your phone</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm">Start tracking your activities</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onCancel}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-primary text-black hover:bg-primary/90" onClick={handleStartScan}>
                  Start Scanning
                </Button>
              </div>
            </motion.div>
          )}

          {step === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                <div className="absolute inset-3 bg-blue-500/30 rounded-full animate-ping animation-delay-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smartphone className="h-12 w-12 text-blue-500" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">Scanning for NFC Patch</h3>
              <p className="text-sm text-zinc-400 mb-6">Hold your phone near the NFC patch on your sports gear.</p>
              {isScanning ? (
                <div className="flex items-center justify-center mb-6">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Scanning...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center mb-6 text-yellow-500">
                  <span>No patch detected. Try again.</span>
                </div>
              )}
              <Button variant="outline" className="w-full" onClick={() => setStep("intro")}>
                Cancel
              </Button>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Patch Activated!</h3>
              <p className="text-sm text-zinc-400 mb-6">
                Your NFC patch has been successfully activated. You can now start tracking your activities and earning
                rewards.
              </p>
              <div className="bg-zinc-800 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="relative w-12 h-12 mr-3">
                    <Image src="/nfc-clothing-scan.png" alt="NFC Patch" fill className="object-contain" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">Snow Jacket Patch</h4>
                    <p className="text-xs text-zinc-400">Ready to track your snowboarding sessions</p>
                  </div>
                </div>

                {/* Show NFT badge if the item has NFT */}
                {hasNFTState && (
                  <div className="mt-3 pt-3 border-t border-zinc-700">
                    <div className="flex items-center">
                      <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
                      <p className="text-xs text-purple-400">NFT Digital Collectible Linked</p>
                    </div>
                  </div>
                )}
              </div>
              <Button className="w-full bg-primary text-black hover:bg-primary/90" onClick={handleComplete}>
                Start Tracking
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
