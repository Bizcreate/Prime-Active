"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"

export default function WishlistPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { wishlistItems, removeFromWishlist, clearWishlist, moveToCart } = useWishlist()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleMoveToCart = (productId: string) => {
    moveToCart(productId)
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
      duration: 3000,
    })
  }

  const handleRemoveItem = (productId: string) => {
    removeFromWishlist(productId)
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist",
      duration: 3000,
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/merch">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">My Wishlist</h1>
          <Button variant="ghost" size="icon" className="ml-auto relative" onClick={() => router.push("/merch/cart")}>
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-bold">Saved Items</h2>
          </div>
          {wishlistItems.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearWishlist}>
              Clear All
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900 rounded-lg p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-zinc-800 rounded-md"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-zinc-800 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-zinc-800 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-zinc-900 rounded-lg p-6 text-center">
            <Heart className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
            <h3 className="text-lg font-bold mb-2">Your wishlist is empty</h3>
            <p className="text-zinc-400 text-sm mb-4">Save items you like for future purchases</p>
            <Button onClick={() => router.push("/merch")}>Browse Products</Button>
          </div>
        ) : (
          <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="show">
            {wishlistItems.map((item) => (
              <motion.div key={item.id} className="bg-zinc-900 rounded-lg p-4" variants={itemVariants}>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    {item.isLimited && (
                      <div className="absolute top-1 left-1">
                        <Badge className="bg-primary text-black text-xs px-1 py-0">Limited</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base">{item.name}</h3>
                    <p className="text-zinc-400 text-sm mb-1 line-clamp-1">{item.description}</p>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">${item.price.toFixed(2)}</p>
                      {item.hasNFC && <Badge className="bg-blue-500 text-white text-xs">NFC</Badge>}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Image src="/shaka-banana-hand.png" alt="Shaka Points" width={12} height={12} />
                      <span className="text-xs text-primary">{item.bananaPoints} points</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      className="bg-[#ffc72d] text-black hover:bg-[#e6b328]"
                      onClick={() => handleMoveToCart(item.id)}
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-400"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {wishlistItems.length > 0 && (
          <div className="mt-6">
            <Button
              className="w-full bg-[#ffc72d] text-black hover:bg-[#e6b328]"
              onClick={() => {
                wishlistItems.forEach((item) => moveToCart(item.id))
                toast({
                  title: "Added all to cart",
                  description: "All items have been added to your cart",
                  duration: 3000,
                })
                router.push("/merch/cart")
              }}
            >
              Add All to Cart
            </Button>
          </div>
        )}
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
