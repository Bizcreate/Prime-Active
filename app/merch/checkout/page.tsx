"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, ShoppingBag, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { TabBar } from "@/components/tab-bar"
import { Separator } from "@/components/ui/separator"
import { TokenPaymentOptions } from "@/components/token-payment-options"
import { CouponInput } from "@/components/coupon-input"
import { couponService } from "@/services/coupon-service"
import { useCart } from "@/contexts/cart-context"

export default function CheckoutPage() {
  const router = useRouter()
  const { appliedCoupon, couponDiscount, selectedType, setAppliedCoupon, setCouponDiscount } = useCart()

  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  })
  const [step, setStep] = useState<"shipping" | "payment">("shipping")
  const [tokensToUse, setTokensToUse] = useState(0)
  const [tokenDiscount, setTokenDiscount] = useState(0)

  // Mock cart data
  const cartItem = {
    id: "1",
    name: "Prime Mates Classic T-Shirt",
    size: "L",
    price: selectedType === "standard" ? 29.99 : selectedType === "nfc" ? 35.99 : 38.99,
    quantity: 1,
    image: "/prime-mates-tshirt.png",
    type: selectedType.toUpperCase(),
    bananaPoints: selectedType === "nfc+nft" ? 600 : selectedType === "nfc" ? 400 : 200,
    productId: "product1",
  }

  const shipping = 5.99
  const subtotal = cartItem.price

  // Apply discounts in the correct order
  const afterCouponDiscount = Math.max(0, subtotal - couponDiscount)
  const afterTokenDiscount = Math.max(0, afterCouponDiscount - tokenDiscount)
  const total = afterTokenDiscount + shipping

  // Free order check
  const isFreeOrder = total <= shipping

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
    window.scrollTo(0, 0)
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Apply the coupon in the service if one is used
      if (appliedCoupon) {
        couponService.applyCoupon(appliedCoupon)
      }

      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reset cart state after successful order
      setAppliedCoupon(null)
      setCouponDiscount(0)

      // Redirect to success page
      router.push("/merch/checkout-success")
    } catch (error) {
      console.error("Order processing error:", error)
      setIsProcessing(false)
    }
  }

  const handleBackToShipping = () => {
    setStep("shipping")
    window.scrollTo(0, 0)
  }

  const handleApplyCoupon = (code: string, discount: number) => {
    setAppliedCoupon(code)
    setCouponDiscount(discount)
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
  }

  const handleApplyTokens = (tokenAmount: number, discountAmount: number) => {
    setTokensToUse(tokenAmount)
    setTokenDiscount(discountAmount)
  }

  const handleResetTokens = () => {
    setTokensToUse(0)
    setTokenDiscount(0)
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20 overflow-auto">
      <div className="sticky top-0 z-10 bg-black p-6">
        <div className="flex items-center mb-6">
          <Link href="/merch/cart">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "shipping" ? "bg-[#ffc72d] text-black" : "bg-zinc-700"
              }`}
            >
              <Truck className="h-4 w-4" />
            </div>
            <div className={`h-1 w-10 ${step === "payment" ? "bg-[#ffc72d]" : "bg-zinc-700"}`}></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "payment" ? "bg-[#ffc72d] text-black" : "bg-zinc-700"
              }`}
            >
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <p className="text-sm text-zinc-400">Step {step === "shipping" ? "1" : "2"} of 2</p>
        </div>

        {step === "shipping" ? (
          <form onSubmit={handleContinueToPayment} className="space-y-6">
            <div className="bg-zinc-900 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-4">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              <div className="flex items-start gap-3 mb-4">
                <div className="relative w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden">
                  <Image src={cartItem.image || "/placeholder.svg"} alt={cartItem.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{cartItem.name}</h3>
                  <p className="text-sm text-zinc-400">Size: {cartItem.size}</p>
                  <p className="text-sm text-zinc-400">Type: {cartItem.type}</p>
                  <div className="flex items-center mt-1">
                    <p className="font-medium">${cartItem.price.toFixed(2)}</p>
                    <p className="text-sm text-zinc-400 ml-2">Qty: {cartItem.quantity}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-zinc-400">Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <p>Coupon Discount ({appliedCoupon})</p>
                    <p>-${Math.min(couponDiscount, subtotal).toFixed(2)}</p>
                  </div>
                )}
                {tokenDiscount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <p>Token Discount</p>
                    <p>-${tokenDiscount.toFixed(2)}</p>
                  </div>
                )}
                <div className="flex justify-between">
                  <p className="text-zinc-400">Shipping</p>
                  <p>${shipping.toFixed(2)}</p>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <p>Total</p>
                  {isFreeOrder ? <p className="text-green-500">FREE</p> : <p>${total.toFixed(2)}</p>}
                </div>
                <div className="flex items-center gap-1 bg-[#ffc72d]/20 px-3 py-1 rounded-full mt-2 w-fit">
                  <Image src="/shaka-banana-hand.png" alt="Shaka Points" width={16} height={16} />
                  <span className="text-sm text-[#ffc72d] font-medium">+{cartItem.bananaPoints} points</span>
                </div>
              </div>
            </div>

            {/* Coupon Input */}
            <CouponInput
              subtotal={subtotal}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              productIds={[cartItem.productId]}
              appliedCoupon={appliedCoupon || undefined}
              couponDiscount={couponDiscount}
            />

            {/* Token Payment Options */}
            <TokenPaymentOptions
              totalAmount={afterCouponDiscount}
              onApplyTokens={handleApplyTokens}
              onResetTokens={handleResetTokens}
            />

            <Button type="submit" className="w-full bg-[#ffc72d] hover:bg-[#e6b328] text-black">
              Continue to {isFreeOrder ? "Complete Order" : "Payment"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            <div className="bg-zinc-900 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-4">Payment Information</h2>

              {isFreeOrder ? (
                <div className="bg-green-900/30 border border-green-500 rounded-lg p-4 text-center">
                  <h3 className="text-green-500 font-bold text-lg mb-2">FREE ORDER</h3>
                  <p className="text-sm text-zinc-300">
                    Your order is completely free! No payment information required.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required={!isFreeOrder}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required={!isFreeOrder}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        required={!isFreeOrder}
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        name="cvc"
                        placeholder="123"
                        value={formData.cvc}
                        onChange={handleInputChange}
                        required={!isFreeOrder}
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-zinc-900 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              <div className="flex items-start gap-3 mb-4">
                <div className="relative w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden">
                  <Image src={cartItem.image || "/placeholder.svg"} alt={cartItem.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{cartItem.name}</h3>
                  <p className="text-sm text-zinc-400">Size: {cartItem.size}</p>
                  <p className="text-sm text-zinc-400">Type: {cartItem.type}</p>
                  <div className="flex items-center mt-1">
                    <p className="font-medium">${cartItem.price.toFixed(2)}</p>
                    <p className="text-sm text-zinc-400 ml-2">Qty: {cartItem.quantity}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-zinc-400">Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <p>Coupon Discount ({appliedCoupon})</p>
                    <p>-${Math.min(couponDiscount, subtotal).toFixed(2)}</p>
                  </div>
                )}
                {tokenDiscount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <p>Token Discount</p>
                    <p>-${tokenDiscount.toFixed(2)}</p>
                  </div>
                )}
                <div className="flex justify-between">
                  <p className="text-zinc-400">Shipping</p>
                  <p>${shipping.toFixed(2)}</p>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <p>Total</p>
                  {isFreeOrder ? <p className="text-green-500">FREE</p> : <p>${total.toFixed(2)}</p>}
                </div>
                <div className="flex items-center gap-1 bg-[#ffc72d]/20 px-3 py-1 rounded-full mt-2 w-fit">
                  <Image src="/shaka-banana-hand.png" alt="Shaka Points" width={16} height={16} />
                  <span className="text-sm text-[#ffc72d] font-medium">+{cartItem.bananaPoints} points</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={handleBackToShipping}>
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#ffc72d] hover:bg-[#e6b328] text-black"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⟳</span> Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2" /> {isFreeOrder ? "Complete Order" : "Place Order"}
                  </span>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
