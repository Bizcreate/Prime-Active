"use client"

import { useEffect } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { TabBar } from "@/components/tab-bar"

export default function DemoCheckoutSuccessPage() {
  const { setAppliedCoupon, setCouponDiscount } = useCart()

  // Reset coupon on mount
  useEffect(() => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
  }, [setAppliedCoupon, setCouponDiscount])

  return (
    <div className="flex flex-col min-h-screen bg-black text-white pb-20">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-6">
          <Check className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Free Demo Order Complete!</h1>
        <p className="text-zinc-400 mb-8 max-w-md">
          Your free demo order has been processed successfully. This is a demonstration of the checkout flow.
        </p>

        <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Prime Mates Classic T-Shirt</span>
              <span>FREE</span>
            </div>

            <div className="flex justify-between text-zinc-400">
              <span>Coupon Applied:</span>
              <span>FREE</span>
            </div>

            <div className="flex justify-between text-zinc-400">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>

            <div className="border-t border-zinc-800 pt-4 flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-green-500">FREE</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 w-full max-w-md">
          <Link href="/dashboard" className="block w-full">
            <Button className="w-full bg-[#ffc72d] hover:bg-[#e6b328] text-black">Return to Dashboard</Button>
          </Link>

          <Link href="/merch" className="block w-full">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
