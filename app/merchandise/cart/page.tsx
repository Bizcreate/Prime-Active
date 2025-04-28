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
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

type MerchandiseType = "standard" | "nfc" | "nfc+nft"

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { appliedCoupon, couponDiscount, selectedType, setAppliedCoupon, setCouponDiscount, setSelectedType } =
    useCart()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  // Save cart items to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
    }
  }, [cartItems, isLoading])

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
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  // Apply coupon discount
  const discountedSubtotal = Math.max(0, subtotal - couponDiscount)
  const total = discountedSubtotal + shipping

  const bananaPoints = cartItems.reduce((total, item) => total + item.bananaPoints * item.quantity, 0)

  const handleProceedToCheckout = () => {
    router.push("/merchandise/checkout")
  }

  const handleApplyCoupon = (code: string, discount: number) => {
    setAppliedCoupon(code)
    setCouponDiscount(discount)
    toast({
      title: "Coupon Applied",
      description: `Coupon ${code} has been applied to your order.`,
      variant: "success",
    })
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your order.",
      variant: "default",
    })
  }

  const handleUpdateQuantity = (itemId: string, change: number) => {
    const updatedCartItems = cartItems
      .map((item) => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
        }
        return item
      })
      .filter(Boolean) as any[]

    setCartItems(updatedCartItems)
    toast({
      title: "Cart Updated",
      description: "Your cart has been updated.",
      variant: "default",
    })
  }

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId))
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
      variant: "default",
    })
  }

  // Check if order is free
  const isFreeOrder = couponDiscount >= subtotal

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-auto pb-20">
      <div className="sticky top-0 z-10 bg-black p-4 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center">
          <Link href="/merchandise">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Your Cart</h1>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-24 bg-zinc-800 rounded-lg animate-pulse"></div>
            <div className="h-24 bg-zinc-800 rounded-lg animate-pulse"></div>
            <div className="h-24 bg-zinc-800 rounded-lg animate-pulse"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="h-16 w-16 text-zinc-700 mb-4" />
            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-zinc-400 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/merchandise">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 bg-zinc-900 p-4 rounded-lg">
                <div className="relative w-24 h-24 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h2 className="font-bold text-lg">{item.name}</h2>
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <p className="text-zinc-400 text-sm">Size: {item.variant}</p>
                  <p className="text-zinc-400 text-sm">Type: {item.merchandiseType}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-400"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupon Input */}
            <CouponInput
              subtotal={subtotal}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              productIds={cartItems.map((item) => item.productId)}
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
              className="w-full bg-[#ffc72d] hover:bg-[#e6b328] text-black py-6"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              {isFreeOrder ? "Proceed to Free Checkout" : "Proceed to Checkout"}
            </Button>
          </div>
        )}
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
