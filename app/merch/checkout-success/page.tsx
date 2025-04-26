"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { TabBar } from "@/components/tab-bar"
import { useSearchParams } from "next/navigation"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const productId = searchParams.get("productId")
  const productName = searchParams.get("productName") || "Prime Mates Merchandise"
  const productImage = searchParams.get("productImage") || "/prime-mates-tshirt.png"
  const isFree = searchParams.get("free") === "true"

  const [orderNumber, setOrderNumber] = useState("")

  useEffect(() => {
    // Generate a random order number
    const randomOrderNumber = Math.floor(10000000 + Math.random() * 90000000).toString()
    setOrderNumber(randomOrderNumber)

    // Clear cart if we have localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("prime-mates-cart")
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="flex-1 p-6">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="h-20 w-20 rounded-full bg-green-500 flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-black" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-zinc-400 mb-4">Thank you for your purchase. Your order has been confirmed.</p>
          <div className="bg-zinc-800 px-4 py-2 rounded-md">
            <p className="text-sm text-zinc-400">Order #</p>
            <p className="font-mono font-bold">{orderNumber}</p>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="flex items-center mb-6">
              <div className="relative h-20 w-20 mr-4">
                <Image src={productImage || "/placeholder.svg"} alt={productName} fill className="object-contain" />
              </div>
              <div>
                <h3 className="font-medium">{productName}</h3>
                <p className="text-sm text-zinc-400">Qty: 1</p>
                {isFree ? <p className="text-green-500 font-bold">FREE</p> : <p className="text-zinc-300">$38.99</p>}
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-zinc-400">Subtotal</span>
                <span>{isFree ? "FREE" : "$38.99"}</span>
              </div>
              {!isFree && (
                <div className="flex justify-between mb-2">
                  <span className="text-zinc-400">Shipping</span>
                  <span>$5.99</span>
                </div>
              )}
              <div className="flex justify-between font-bold mt-4 pt-4 border-t border-zinc-800">
                <span>Total</span>
                <span>{isFree ? "FREE" : "$44.98"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-sm font-medium">1</span>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Shipping Confirmation</h4>
                <p className="text-xs text-zinc-400">
                  You'll receive a shipping confirmation email when your order ships.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-sm font-medium">2</span>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Track Your Order</h4>
                <p className="text-xs text-zinc-400">You can track your order status in your account dashboard.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-sm font-medium">3</span>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Connect Your Merchandise</h4>
                <p className="text-xs text-zinc-400">
                  Once your item arrives, scan the NFC tag to connect it to your account and start earning rewards.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link href="/merch/collection">
            <Button className="w-full">
              <Tag className="h-4 w-4 mr-2" />
              View My Collection
            </Button>
          </Link>
          <Link href="/merch">
            <Button variant="outline" className="w-full">
              Continue Shopping
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
