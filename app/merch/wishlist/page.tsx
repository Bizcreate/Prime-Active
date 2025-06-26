"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Heart, ShoppingBag, Trash } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useWishlist } from "@/hooks/use-wishlist"
import { useRouter } from "next/navigation"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/merch">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Wishlist</h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-400">Loading your wishlist...</p>
          </div>
        ) : !wishlist || wishlist.length === 0 ? (
          <div className="bg-zinc-900 rounded-lg p-6 text-center">
            <div className="bg-zinc-800 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">Your Wishlist is Empty</h3>
            <p className="text-zinc-400 text-sm mb-4">Save items to your wishlist while you shop</p>
            <Link href="/merch">
              <Button className="bg-[#ffc72d] hover:bg-[#e6b328] text-black">Shop Now</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((item) => (
              <Card key={item.id} className="bg-zinc-900 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-start">
                    <div className="relative h-24 w-24 flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="p-3 flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium mb-1">{item.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-zinc-400 text-sm mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-[#ffc72d]">${item.price.toFixed(2)}</div>
                        <Button
                          size="sm"
                          className="bg-[#ffc72d] hover:bg-[#e6b328] text-black"
                          onClick={() => router.push(`/merch/item/${item.id}`)}
                        >
                          <ShoppingBag className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Wishlist Sharing */}
      {wishlist.length > 0 && (
        <div className="mt-8 p-6">
          <h2 className="text-lg font-bold mb-4">Share Your Wishlist</h2>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <p className="text-sm text-zinc-400 mb-4">
                Share your wishlist with friends and fellow board enthusiasts.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => {
                    const url = `${window.location.origin}/merch/shared-wishlist?id=${encodeURIComponent("guest")}`
                    navigator.clipboard.writeText(url)
                    alert("Link copied")
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                  Copy Link
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => {
                    const text = `Check out my Prime Mates Board Club wishlist! ${wishlist.length} products worth $${wishlist.reduce((sum, item) => sum + item.price, 0).toFixed(2)}`
                    const url = `${window.location.origin}/merch/shared-wishlist?id=${encodeURIComponent("guest")}`

                    // Mock sharing - in a real app, you'd use the Web Share API
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
                      "_blank",
                    )
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                  Twitter
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => {
                    const text = `Check out my Prime Mates Board Club wishlist! ${wishlist.length} products worth $${wishlist.reduce((sum, item) => sum + item.price, 0).toFixed(2)}`
                    const url = `${window.location.origin}/merch/shared-wishlist?id=${encodeURIComponent("guest")}`

                    // Mock sharing - in a real app, you'd use the Web Share API
                    window.open(`https://www.instagram.com/`, "_blank")
                    alert("Copy your wishlist link to share on Instagram")
                    navigator.clipboard.writeText(url)
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  Instagram
                </Button>
              </div>

              <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-md">
                <div>
                  <p className="text-sm font-medium">Your Wishlist Stats</p>
                  <p className="text-xs text-zinc-400">
                    {wishlist.length} items · ${wishlist.reduce((sum, item) => sum + item.price, 0).toFixed(2)} total
                    value
                  </p>
                </div>
                <div>
                  <Button
                    size="sm"
                    className="bg-[#ffc72d] text-black hover:bg-[#e6b328]"
                    onClick={() => {
                      alert("Add all to cart functionality not implemented")
                    }}
                  >
                    Add All to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <TabBar activeTab="merch" />
    </div>
  )
}
