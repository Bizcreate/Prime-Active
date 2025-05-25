"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ShoppingBag, Heart, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import { merchandiseService } from "@/services/merchandise-service"

// This would normally come from a database or API
const mockUsers = {
  user1: { name: "SurfMonkey", avatar: "/pmbc-surfer.png" },
  user2: { name: "SkateKing", avatar: "/pmbc-skater.png" },
  guest: { name: "Board Enthusiast", avatar: "/prime-mates-logo.png" },
}

export default function SharedWishlistPage() {
  const [sharedItems, setSharedItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const searchParams = useSearchParams()
  const userId = searchParams.get("id") || "guest"
  const { wishlist, addToWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  useEffect(() => {
    setIsLoading(true)

    // Simulate API call to get user data
    setTimeout(() => {
      setUserData(mockUsers[userId as keyof typeof mockUsers] || mockUsers.guest)

      // Generate some random items for the shared wishlist
      // In a real app, this would come from the database
      const allProducts = merchandiseService.getAllProducts()
      const randomProducts = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 5)

      setSharedItems(randomProducts)
      setIsLoading(false)
    }, 1000)
  }, [userId])

  const handleAddToWishlist = (product: any) => {
    if (!isInWishlist(product.id)) {
      addToWishlist({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.images[0],
        bananaPoints: product.bananaPoints,
        hasNFC: product.hasNFC,
        isLimited: product.isLimited,
        category: product.category,
      })
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    } else {
      toast({
        title: "Already in wishlist",
        description: `${product.name} is already in your wishlist.`,
      })
    }
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
          <h1 className="text-xl font-bold">Shared Wishlist</h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 rounded-full bg-zinc-800 animate-pulse mb-4"></div>
            <div className="h-6 w-32 bg-zinc-800 animate-pulse mb-8"></div>
            <div className="w-full grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-zinc-800 animate-pulse rounded-md"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* User Info */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 bg-zinc-900">
                <Image
                  src={userData?.avatar || "/prime-mates-logo.png"}
                  alt="User Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-bold mb-1">{userData?.name}'s Wishlist</h2>
              <p className="text-zinc-400 text-sm mb-4">
                {sharedItems.length} items · ${sharedItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)} total
                value
              </p>

              <div className="flex space-x-3 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => {
                    // This would navigate to the user's profile in a real app
                    toast({
                      title: "Profile view",
                      description: `Viewing ${userData?.name}'s profile`,
                    })
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#ffc72d] text-black hover:bg-[#e6b328]"
                  onClick={() => {
                    // Add all items to the user's wishlist
                    sharedItems.forEach((product) => {
                      if (!isInWishlist(product.id)) {
                        addToWishlist({
                          id: product.id,
                          name: product.name,
                          description: product.description,
                          price: product.price,
                          image: product.images[0],
                          bananaPoints: product.bananaPoints,
                          hasNFC: product.hasNFC,
                          isLimited: product.isLimited,
                          category: product.category,
                        })
                      }
                    })

                    toast({
                      title: "Added to your wishlist",
                      description: `${sharedItems.length} items added to your wishlist.`,
                    })
                  }}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Copy Wishlist
                </Button>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="grid grid-cols-1 gap-4">
              {sharedItems.map((product) => (
                <Card key={product.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-3">
                    <div className="flex">
                      <div className="relative w-20 h-20 bg-zinc-800 rounded-md overflow-hidden mr-3">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                            <p className="text-[#ffc72d] font-bold mb-1">${product.price.toFixed(2)}</p>
                            <div className="flex items-center">
                              <Image src="/shaka-banana-hand.png" alt="Banana Points" width={12} height={12} />
                              <span className="text-xs text-[#ffc72d] ml-1">{product.bananaPoints} pts</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            {product.isNew && <Badge className="bg-[#ffc72d] text-black">New</Badge>}
                            {product.isLimited && <Badge className="bg-purple-600">Limited</Badge>}
                            {product.hasNFC && <Badge className="bg-blue-600">NFC</Badge>}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs flex-1"
                            onClick={() => handleAddToWishlist(product)}
                          >
                            <Heart className="h-3 w-3 mr-1" />
                            Add to My Wishlist
                          </Button>
                          <Link href={`/store/${product.id}`}>
                            <Button
                              variant="default"
                              size="sm"
                              className="text-xs bg-[#ffc72d] text-black hover:bg-[#e6b328]"
                            >
                              <ShoppingBag className="h-3 w-3 mr-1" />
                              View Item
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
