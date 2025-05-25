"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, ShoppingBag, CreditCard, ShoppingCart, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import { TabBar } from "@/components/tab-bar"
import { merchandiseSyncService } from "@/services/merchandise-sync-service"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [syncResults, setSyncResults] = useState<{
    merchandiseCount: number
    nftCount: number
    lastMerchandiseId?: string
    lastNftId?: string
  }>({ merchandiseCount: 0, nftCount: 0 })
  const [error, setError] = useState<string | null>(null)
  const [redirectCountdown, setRedirectCountdown] = useState(5)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const searchParams = useSearchParams()
  const isFreeOrder = searchParams.get("free") === "true"
  const { toast } = useToast()
  const [hasNFTs, setHasNFTs] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Simulate loading order details
    setTimeout(() => {
      try {
        // Get cart items from localStorage
        const savedCart = localStorage.getItem("cartItems")
        let cartItems = []

        try {
          if (savedCart) {
            cartItems = JSON.parse(savedCart)
          }
        } catch (e) {
          console.error("Failed to parse cart items", e)
          setError("Failed to load cart items. Please contact support.")
          setIsLoading(false)
          return
        }

        // Create order details
        const orderDetails = {
          orderId: `ORD-${Math.floor(Math.random() * 1000000)}`,
          date: new Date().toISOString(),
          items: cartItems,
          total: cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0),
          shipping:
            cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0) > 50 ? 0 : 5.99,
          discount: isFreeOrder
            ? cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0)
            : 0,
        }

        setOrderDetails(orderDetails)

        // Sync merchandise with wallet and merch page
        if (cartItems.length > 0) {
          try {
            const { merchandise, nfts, lastMerchandiseId, lastNftId } =
              merchandiseSyncService.syncMerchandiseAfterPurchase(cartItems)

            setSyncResults({
              merchandiseCount: merchandise.length,
              nftCount: nfts.length,
              lastMerchandiseId,
              lastNftId,
            })

            // Show toast notifications
            if (merchandise.length > 0) {
              toast({
                title: "Merchandise Added",
                description: `${merchandise.length} item(s) added to your merchandise collection.`,
                duration: 5000,
              })
            }

            if (nfts.length > 0) {
              toast({
                title: "NFTs Minted",
                description: `${nfts.length} NFT(s) have been minted to your wallet.`,
                duration: 5000,
              })
              setHasNFTs(true)
            }
          } catch (e) {
            console.error("Error syncing merchandise:", e)
            setError("There was an error processing your merchandise. Please contact support.")
          }
        }

        setIsLoading(false)

        // Clear cart
        localStorage.removeItem("cartItems")
      } catch (e) {
        console.error("Error processing order:", e)
        setError("There was an error processing your order. Please contact support.")
        setIsLoading(false)
      }
    }, 1500)
  }, [isFreeOrder, toast])

  // Countdown effect for auto-redirect
  useEffect(() => {
    if (!isLoading && !error) {
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setIsRedirecting(true)

            // Redirect to the merchandise collection page
            if (syncResults.merchandiseCount > 0) {
              router.push(`/merch/collection?highlight=${syncResults.lastMerchandiseId}`)
            } else if (hasNFTs) {
              router.push(`/wallet?highlight=${syncResults.lastNftId}`)
            } else {
              router.push("/merch")
            }

            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isLoading, error, router, hasNFTs, syncResults])

  // Function to handle manual redirect
  const handleViewMerchandise = () => {
    setIsRedirecting(true)
    router.push(
      `/merch/collection${syncResults.lastMerchandiseId ? `?highlight=${syncResults.lastMerchandiseId}` : ""}`,
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Order Confirmation</h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-400">Processing your order...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
            <p className="text-zinc-300 mb-4">{error}</p>
            <Link href="/store">
              <Button variant="outline" className="w-full">
                Return to Store
              </Button>
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-zinc-900 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-zinc-400 mb-4">
                {isFreeOrder
                  ? "Your free order has been confirmed and will be processed shortly."
                  : "Your order has been confirmed and will be processed shortly."}
              </p>
              <div className="bg-zinc-800 rounded-lg p-3 inline-block">
                <p className="text-sm text-zinc-400">Order ID</p>
                <p className="font-mono font-bold">{orderDetails.orderId}</p>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {orderDetails.items.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="text-zinc-400 text-sm">Size: {item.variant}</p>
                      {item.merchandiseType && (
                        <p className="text-zinc-400 text-sm">Type: {item.merchandiseType.toUpperCase()}</p>
                      )}
                      <div className="flex justify-between mt-1">
                        <span className="text-zinc-400 text-sm">Qty: {item.quantity}</span>
                        <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Subtotal:</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Shipping:</span>
                  <span>${orderDetails.shipping.toFixed(2)}</span>
                </div>
                {isFreeOrder && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount (FREE):</span>
                    <span>-${orderDetails.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-zinc-800">
                  <span>Total:</span>
                  <span>${(orderDetails.total + orderDetails.shipping - orderDetails.discount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 mt-8">
              {/* Auto-redirect notification */}
              <div className="bg-primary/10 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isRedirecting ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-primary text-black flex items-center justify-center font-bold">
                      {redirectCountdown}
                    </div>
                  )}
                  <span className="text-sm">
                    {isRedirecting
                      ? "Redirecting to your merchandise collection..."
                      : `Redirecting to merchandise collection in ${redirectCountdown} seconds...`}
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={handleViewMerchandise} disabled={isRedirecting}>
                  View Now
                </Button>
              </div>

              {/* Merchandise Added Section */}
              <div className="bg-zinc-900 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">Merchandise Added</h2>
                </div>
                <p className="text-zinc-400 mb-6">
                  Your merchandise items have been added to your collection. You can now track wear time and earn
                  tokens!
                </p>
                <Button
                  className="w-full bg-primary text-black hover:bg-primary/90"
                  onClick={handleViewMerchandise}
                  disabled={isRedirecting}
                >
                  {isRedirecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    "View My Merchandise"
                  )}
                </Button>
              </div>

              {/* NFTs Minted Section - Only show if NFTs were minted */}
              {hasNFTs && (
                <div className="bg-zinc-900 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">NFTs Minted</h2>
                  </div>
                  <p className="text-zinc-400 mb-6">
                    Your NFTs have been minted and added to your wallet. View them in your wallet.
                  </p>
                  <Link href="/wallet">
                    <Button className="w-full bg-primary text-black hover:bg-primary/90" disabled={isRedirecting}>
                      {isRedirecting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Redirecting...
                        </>
                      ) : (
                        "View in Wallet"
                      )}
                    </Button>
                  </Link>
                </div>
              )}

              <div className="space-y-4 mt-6">
                <Link href="/store">
                  <Button variant="outline" className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" /> Continue Shopping
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full">
                    Return to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <TabBar activeTab="merch" />
    </div>
  )
}
