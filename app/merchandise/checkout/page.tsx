"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { TabBar } from "@/components/tab-bar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { appliedCoupon, couponDiscount } = useCart()

  const [cartItems, setCartItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
    cardExpiry: "",
    cardCvc: "",
  })

  // Load cart items from localStorage
  useEffect(() => {
    setIsLoading(true)
    try {
      const savedCart = localStorage.getItem("cartItems")
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart items:", error)
      toast({
        title: "Error",
        description: "Failed to load your cart items",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const discountedSubtotal = Math.max(0, subtotal - couponDiscount)
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = discountedSubtotal + shipping
  const isFreeOrder = couponDiscount >= subtotal

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (
      !formData.name ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zip ||
      !formData.country
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive",
      })
      return
    }

    // If not a free order, validate payment info
    if (!isFreeOrder && (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc)) {
      toast({
        title: "Missing Payment Information",
        description: "Please fill out all payment fields",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Clear cart
    localStorage.removeItem("cartItems")

    // Show success message
    toast({
      title: "Order Placed!",
      description: "Your order has been successfully placed",
      variant: "success",
    })

    // Redirect to success page
    router.push("/merchandise/checkout-success")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-black text-white">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Link href="/merchandise/cart">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Checkout</h1>
          </div>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-black text-white">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Link href="/merchandise">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Checkout</h1>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="h-16 w-16 text-zinc-700 mb-4" />
            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-zinc-400 mb-6">You need to add items to your cart before checking out.</p>
            <Link href="/merchandise">
              <Button>Shop Now</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/merchandise/cart">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-zinc-900 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.name}</h3>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="text-zinc-400 text-xs">
                      Size: {item.variant} • Qty: {item.quantity}
                    </p>
                    <p className="text-zinc-400 text-xs">Type: {item.merchandiseType}</p>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
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
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                {isFreeOrder ? <span className="text-green-500">FREE</span> : <span>${total.toFixed(2)}</span>}
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-zinc-900 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700"
                  required
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
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700"
                    required
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
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information - Only show if not free */}
          {!isFreeOrder && (
            <div className="bg-zinc-900 rounded-lg p-4">
              <h2 className="font-bold text-lg mb-4">Payment Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardExpiry">Expiration Date</Label>
                    <Input
                      id="cardExpiry"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardCvc">CVC</Label>
                    <Input
                      id="cardCvc"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Place Order Button */}
          <Button
            type="submit"
            className="w-full bg-[#ffc72d] hover:bg-[#e6b328] text-black py-6"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>{isFreeOrder ? "Complete Free Order" : "Place Order"}</>
            )}
          </Button>
        </form>
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
