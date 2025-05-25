"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { CouponInput } from "@/components/coupon-input"
import { useCart } from "@/contexts/cart-context"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

type MerchandiseType = "standard" | "nfc" | "nfc+nft"

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const {
    appliedCoupon,
    couponDiscount,
    selectedType,
    cartItems,
    setAppliedCoupon,
    setCouponDiscount,
    setSelectedType,
    setCartItems,
  } = useCart()

  // Initialize cart with a default item if empty
  useEffect(() => {
    if (cartItems.length === 0) {
      // Add a default test item
      setCartItems([
        {
          id: "prime-tshirt-1",
          name: "Prime Mates Classic T-Shirt",
          size: "L",
          color: "Black",
          price: pricing[selectedType],
          image: "/prime-mates-tshirt.png",
        },
      ])
    }
  }, [cartItems.length, selectedType, setCartItems])

  // Product pricing based on type
  const pricing = {
    standard: 29.99,
    nfc: 35.99,
    "nfc+nft": 38.99,
  }

  // Product descriptions
  const descriptions = {
    standard: "Regular merchandise without special features",
    nfc: "Track wearing time and earn tokens",
    "nfc+nft": "All NFC features plus a digital collectible NFT",
  }

  const shipping = 5.99
  const subtotal = pricing[selectedType]

  // Apply coupon discount
  const discountedSubtotal = Math.max(0, subtotal - couponDiscount)
  const total = discountedSubtotal + shipping

  const bananaPoints = selectedType === "nfc+nft" ? 600 : selectedType === "nfc" ? 400 : 200

  const handleProceedToCheckout = () => {
    setIsProcessing(true)

    // Show processing toast
    toast({
      title: "Processing your order...",
      description: "Please wait while we prepare your checkout.",
    })

    // Simulate a network request
    setTimeout(() => {
      setIsProcessing(false)

      // Determine the correct route based on whether it's a free order
      const checkoutRoute = isFreeOrder ? "/merch/demo-checkout-success" : "/merch/checkout"

      // Navigate to the appropriate page
      router.push(checkoutRoute)
    }, 1500)
  }

  const handleApplyCoupon = (code: string, discount: number) => {
    setAppliedCoupon(code)
    setCouponDiscount(discount)

    // Show success toast
    toast({
      title: "Coupon applied!",
      description: `Coupon "${code}" has been applied to your order.`,
      variant: "success",
    })
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponDiscount(0)

    toast({
      title: "Coupon removed",
      description: "The coupon has been removed from your order.",
    })
  }

  // Check if order is free
  const isFreeOrder = couponDiscount >= subtotal

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-auto pb-20">
      <div className="sticky top-0 z-10 bg-black p-4 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center">
          <Link href="/merch">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Your Cart</h1>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-6">
          {/* Product */}
          <div className="flex gap-4">
            <div className="relative w-24 h-24 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0">
              <Image src="/prime-mates-tshirt.png" alt="Prime Mates T-Shirt" fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg">Prime Mates Classic T-Shirt</h2>
              <p className="text-zinc-400 text-sm">Size: L</p>
              <p className="text-zinc-400 text-sm">Color: Black</p>
            </div>
          </div>

          {/* Type Selection */}
          <div className="bg-zinc-900 rounded-lg p-4 space-y-4">
            <h3 className="font-medium">Select Type</h3>

            {/* NFC + NFT Option */}
            <div
              className={`flex items-start p-3 rounded-lg cursor-pointer ${
                selectedType === "nfc+nft" ? "bg-zinc-800 border border-[#ffc72d]" : "bg-zinc-800/50"
              }`}
              onClick={() => setSelectedType("nfc+nft")}
            >
              <div className="mr-3 mt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedType === "nfc+nft" ? "border-[#ffc72d]" : "border-zinc-600"
                  }`}
                >
                  {selectedType === "nfc+nft" && <div className="w-3 h-3 rounded-full bg-[#ffc72d]"></div>}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-[#ffc72d] mr-2">●</span>
                  <h4 className="font-medium">NFC + NFT</h4>
                  <span className="ml-2 px-2 py-0.5 bg-purple-900/50 text-purple-300 text-xs rounded-full">
                    PREMIUM
                  </span>
                </div>
                <p className="text-sm text-zinc-400 mt-1">{descriptions["nfc+nft"]}</p>
                <p className="font-bold mt-1">${pricing["nfc+nft"].toFixed(2)}</p>
              </div>
            </div>

            {/* NFC-Enabled Option */}
            <div
              className={`flex items-start p-3 rounded-lg cursor-pointer ${
                selectedType === "nfc" ? "bg-zinc-800 border border-[#ffc72d]" : "bg-zinc-800/50"
              }`}
              onClick={() => setSelectedType("nfc")}
            >
              <div className="mr-3 mt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedType === "nfc" ? "border-[#ffc72d]" : "border-zinc-600"
                  }`}
                >
                  {selectedType === "nfc" && <div className="w-3 h-3 rounded-full bg-[#ffc72d]"></div>}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-[#ffc72d] mr-2">●</span>
                  <h4 className="font-medium">NFC-Enabled</h4>
                  <span className="ml-2 px-2 py-0.5 bg-yellow-900/50 text-yellow-300 text-xs rounded-full">
                    Included
                  </span>
                </div>
                <p className="text-sm text-zinc-400 mt-1">{descriptions["nfc"]}</p>
                <p className="font-bold mt-1">${pricing["nfc"].toFixed(2)}</p>
              </div>
            </div>

            {/* Standard Option */}
            <div
              className={`flex items-start p-3 rounded-lg cursor-pointer ${
                selectedType === "standard" ? "bg-zinc-800 border border-[#ffc72d]" : "bg-zinc-800/50"
              }`}
              onClick={() => setSelectedType("standard")}
            >
              <div className="mr-3 mt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedType === "standard" ? "border-[#ffc72d]" : "border-zinc-600"
                  }`}
                >
                  {selectedType === "standard" && <div className="w-3 h-3 rounded-full bg-[#ffc72d]"></div>}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Standard</h4>
                <p className="text-sm text-zinc-400 mt-1">{descriptions["standard"]}</p>
                <p className="font-bold mt-1">${pricing["standard"].toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Coupon Input */}
          <CouponInput
            subtotal={subtotal}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            productIds={["product1"]}
            appliedCoupon={appliedCoupon || undefined}
            couponDiscount={couponDiscount}
          />

          {/* Order Summary */}
          <div className="bg-zinc-900 rounded-lg p-4">
            <h3 className="font-medium mb-4">Order Summary</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Coupon Discount ({appliedCoupon}):</span>
                  <span>-${Math.min(couponDiscount, subtotal).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-400">Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total Banana Points:</span>
                <span className="text-[#ffc72d]">{bananaPoints}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                {isFreeOrder ? <span className="text-green-500">FREE</span> : <span>${total.toFixed(2)}</span>}
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="bg-zinc-900 rounded-lg p-4">
            <h3 className="font-medium mb-2">Shipping Details</h3>
            <p className="text-sm text-zinc-400">Standard shipping (3-5 business days)</p>
            <p className="text-sm text-zinc-400 mt-1">Free shipping on orders over $50</p>
          </div>

          {/* Checkout Button */}
          <Button
            onClick={handleProceedToCheckout}
            disabled={isProcessing}
            className="w-full bg-[#ffc72d] hover:bg-[#e6b328] text-black py-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            {isProcessing ? "Processing..." : isFreeOrder ? "Proceed to Free Checkout" : "Proceed to Checkout"}
          </Button>
        </div>
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
