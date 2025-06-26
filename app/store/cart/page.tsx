"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart, Trash, CreditCard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { TabBar } from "@/components/tab-bar"
import { ShippingAddressForm } from "@/components/shipping-address-form"
import { shippingService, type ShippingAddress } from "@/services/shipping-service"
import { NFTMintingService } from "@/services/nft-minting-service"

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [showShippingForm, setShowShippingForm] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    setIsLoading(true)
    const savedCart = localStorage.getItem("cartItems")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart items from localStorage", e)
      }
    }
    setIsLoading(false)
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  // Load saved shipping address
  useEffect(() => {
    const savedAddress = shippingService.getSavedAddress()
    if (savedAddress) {
      setShippingAddress(savedAddress)
    }
  }, [])

  // Handle update cart quantity
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
  }

  // Handle remove item
  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId))
  }

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  const cartTotalBananaPoints = cartItems.reduce((total, item) => {
    let pointMultiplier = 1
    // Safely access merchandiseType with a default value
    const merchandiseType = item.merchandiseType || "standard"
    if (merchandiseType === "nfc") pointMultiplier = 2
    if (merchandiseType === "nfc+nft") pointMultiplier = 3
    return total + (item.bananaPoints || 10) * item.quantity * pointMultiplier
  }, 0)

  // Apply coupon
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "FREE") {
      setDiscount(cartTotal)
    } else if (couponCode.toUpperCase() === "PRIME10") {
      setDiscount(cartTotal * 0.1)
    } else if (couponCode.toUpperCase() === "BOARD20") {
      setDiscount(cartTotal * 0.2)
    } else {
      setDiscount(0)
    }
  }

  const handleShippingAddressSubmit = (address: ShippingAddress) => {
    setShippingAddress(address)
    setShowShippingForm(false)
  }

  // Handle checkout
  const handleCheckout = async () => {
    // Check if shipping address is added
    if (!shippingAddress) {
      setShowShippingForm(true)
      return
    }

    setIsCheckingOut(true)

    // Simulate checkout process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Process the order and mint NFTs if applicable
    try {
      // For each item that has NFT capability, mint an NFT
      const nftItems = cartItems.filter((item) => item.merchandiseType === "nfc+nft")

      for (const item of nftItems) {
        const nftMetadata = {
          name: item.name,
          description: `${item.name} - ${item.variant} - Limited Edition`,
          image: item.image,
          attributes: [
            { trait_type: "Product Type", value: "Merchandise" },
            { trait_type: "Collection", value: "Prime Mates Merchandise" },
            { trait_type: "Variant", value: item.variant || "Standard" },
          ],
          collection: "Prime Mates Merchandise",
          rarity: "common",
          owner: "0x1234567890123456789012345678901234567890",
        }

        // Mint the NFT
        NFTMintingService.mintNFT(nftMetadata)
      }

      // Clear the cart after successful checkout
      localStorage.removeItem("cartItems")

      // If free coupon used, go to special demo page
      if (discount >= cartTotal) {
        router.push("/store/checkout-success?free=true")
      } else {
        // Navigate to regular checkout success page
        router.push("/store/checkout-success")
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      setIsCheckingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-black">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Link href="/store">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Your Cart</h1>
          </div>
          <div className="animate-pulse">
            <div className="h-24 bg-zinc-800 rounded-lg mb-4"></div>
            <div className="h-24 bg-zinc-800 rounded-lg mb-4"></div>
            <div className="h-24 bg-zinc-800 rounded-lg mb-4"></div>
            <div className="h-12 bg-zinc-800 rounded-lg mb-4"></div>
            <div className="h-12 bg-zinc-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/store">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Your Cart</h1>
          <div className="ml-auto flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm">{cartItems.length} items</span>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-zinc-900 rounded-lg p-8 max-w-md mx-auto">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
              <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-zinc-400 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link href="/store">
                <Button className="w-full">Browse Products</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Shipping Address Section */}
            <div className="bg-zinc-900 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Shipping Address</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowShippingForm(true)}>
                  {shippingAddress ? "Edit" : "Add"}
                </Button>
              </div>

              {shippingAddress ? (
                <div className="text-sm text-zinc-400">
                  <p>{shippingAddress.name}</p>
                  <p>{shippingAddress.address}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                  </p>
                  <p>{shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-sm text-zinc-400">No shipping address added yet.</p>
              )}
            </div>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-900 rounded-lg p-4 flex items-center"
                >
                  <div className="relative w-16 h-16 mr-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold">{item.name}</h3>
                    <p className="text-xs text-zinc-400">
                      {item.variant} • {item.merchandiseType ? item.merchandiseType.toUpperCase() : "STANDARD"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                      >
                        -
                      </Button>
                      <span className="text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-500 hover:text-red-500"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-zinc-900 rounded-lg p-4 mb-6">
              {/* Coupon code input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded p-2 text-sm"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button size="sm" onClick={handleApplyCoupon}>
                  Apply
                </Button>
              </div>

              <div className="flex justify-between mb-2">
                <span className="text-zinc-400">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between mb-2 text-green-500">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span className="text-zinc-400">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-zinc-400">Tax</span>
                <span>${((cartTotal - discount) * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-zinc-800 my-2"></div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${Math.max(0, (cartTotal - discount) * 1.08).toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 bg-primary/10 p-2 rounded-md">
                <Image src="/shaka-banana-hand.png" alt="Shaka Points" width={16} height={16} />
                <span className="text-xs text-primary">You'll earn {cartTotalBananaPoints} Banana Points</span>
              </div>
            </div>

            <Button
              className="w-full mb-4 flex items-center justify-center gap-2"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⟳</span> Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Proceed to Checkout
                </span>
              )}
            </Button>

            <Link href="/store">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </>
        )}
      </div>
      <TabBar activeTab="merch" />
      {/* Shipping Address Form */}
      <ShippingAddressForm
        isOpen={showShippingForm}
        onClose={() => setShowShippingForm(false)}
        onSubmit={handleShippingAddressSubmit}
        initialAddress={shippingAddress || undefined}
      />
    </div>
  )
}
