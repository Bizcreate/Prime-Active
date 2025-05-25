"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Search, Filter, Heart, Star, Sparkles, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import { merchandiseService, type MerchandiseProduct } from "@/services/merchandise-service"
import { useCart } from "@/contexts/cart-context"

export default function StorePage() {
  const [products, setProducts] = useState<MerchandiseProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150])
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const router = useRouter()
  const { toast } = useToast()
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToCart } = useCart()

  // Load products
  useEffect(() => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const allProducts = merchandiseService.getAllProducts()
      setProducts(allProducts)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter products
  const filteredProducts = products
    .filter((product) => {
      const categoryMatch = selectedCategory === "all" || product.category === selectedCategory
      const searchMatch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]

      // Badge filters
      const badgeMatch =
        selectedBadges.length === 0 ||
        selectedBadges.every((badge) => {
          switch (badge) {
            case "new":
              return product.isNew
            case "limited":
              return product.isLimited
            case "nfc":
              return product.hasNFC
            case "featured":
              return product.featured
            default:
              return true
          }
        })

      return categoryMatch && searchMatch && priceMatch && badgeMatch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) // featured
      }
    })

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
  }

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handle toggle wishlist
  const handleToggleWishlist = (e: React.MouseEvent, product: MerchandiseProduct) => {
    e.stopPropagation()

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
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
    }
  }

  // Handle product click
  const handleProductClick = (product: MerchandiseProduct) => {
    router.push(`/store/${product.id}`)
  }

  // Categories
  const categories = [
    { id: "all", name: "All" },
    { id: "apparel", name: "Apparel" },
    { id: "accessories", name: "Accessories" },
    { id: "skate", name: "Skate" },
    { id: "surf", name: "Surf" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/merch">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Prime Mates Store</h1>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search products..."
              className="pl-10 bg-zinc-900 border-zinc-800"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expanded Filter Options */}
        {showFilters && (
          <div className="p-4 mb-6 bg-zinc-900 rounded-lg border border-zinc-800">
            <h3 className="font-medium mb-4">Filters</h3>

            {/* Price Range */}
            <div className="mb-4">
              <h4 className="text-sm mb-2">Price Range</h4>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs">${priceRange[0]}</span>
                <div className="flex-1 relative h-1 bg-zinc-800 rounded-full">
                  <div
                    className="absolute h-1 bg-[#ffc72d] rounded-full"
                    style={{
                      left: `${(priceRange[0] / 150) * 100}%`,
                      right: `${100 - (priceRange[1] / 150) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-xs">${priceRange[1]}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs py-1 h-7" onClick={() => setPriceRange([0, 30])}>
                  Under $30
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs py-1 h-7"
                  onClick={() => setPriceRange([30, 60])}
                >
                  $30-$60
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs py-1 h-7"
                  onClick={() => setPriceRange([60, 150])}
                >
                  $60+
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="mb-4">
              <h4 className="text-sm mb-2">Features</h4>
              <div className="flex flex-wrap gap-2">
                {["New", "Limited", "NFC", "Featured"].map((badge) => (
                  <Badge
                    key={badge}
                    variant={selectedBadges.includes(badge.toLowerCase()) ? "default" : "outline"}
                    className={`cursor-pointer ${selectedBadges.includes(badge.toLowerCase()) ? "bg-[#ffc72d] text-black hover:bg-[#e6b328]" : ""}`}
                    onClick={() => {
                      if (selectedBadges.includes(badge.toLowerCase())) {
                        setSelectedBadges(selectedBadges.filter((b) => b !== badge.toLowerCase()))
                      } else {
                        setSelectedBadges([...selectedBadges, badge.toLowerCase()])
                      }
                    }}
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-4">
              <h4 className="text-sm mb-2">Sort By</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "featured", label: "Featured" },
                  { id: "price-low", label: "Price: Low to High" },
                  { id: "price-high", label: "Price: High to Low" },
                  { id: "rating", label: "Rating" },
                  { id: "newest", label: "Newest" },
                ].map((option) => (
                  <Button
                    key={option.id}
                    variant={sortBy === option.id ? "default" : "outline"}
                    size="sm"
                    className={`text-xs py-1 h-7 ${sortBy === option.id ? "bg-[#ffc72d] text-black hover:bg-[#e6b328]" : ""}`}
                    onClick={() => setSortBy(option.id)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPriceRange([0, 150])
                setSelectedBadges([])
                setSortBy("featured")
                setSearchQuery("")
                setSelectedCategory("all")
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Categories */}
        <div className="overflow-x-auto mb-6">
          <div className="flex space-x-2 min-w-max">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={selectedCategory === category.id ? "bg-[#ffc72d] text-black hover:bg-[#e6b328]" : ""}
                onClick={() => handleCategorySelect(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-zinc-900 animate-pulse h-48">
                <CardContent className="p-0"></CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-12 w-12 mx-auto text-zinc-700 mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-zinc-400 mb-6">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="bg-zinc-900 border-0 overflow-hidden cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <CardContent className="p-0">
                  <div className="relative h-40 w-full bg-zinc-800">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {product.isNew && <Badge className="bg-[#ffc72d] text-black">New</Badge>}
                      {product.isLimited && <Badge className="bg-purple-600">Limited</Badge>}
                      {product.hasNFC && <Badge className="bg-blue-600">NFC</Badge>}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 left-2 h-8 w-8 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
                      onClick={(e) => handleToggleWishlist(e, product)}
                    >
                      <Heart
                        className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-white"}`}
                      />
                    </Button>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1 line-clamp-1">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-[#ffc72d] font-bold">${product.price.toFixed(2)}</p>
                      <div className="flex items-center text-xs text-zinc-400">
                        <Star className="h-3 w-3 mr-1 text-[#ffc72d]" />
                        {product.rating}
                      </div>
                    </div>
                    <div className="flex items-center mt-1">
                      <Image src="/shaka-banana-hand.png" alt="Banana Points" width={12} height={12} />
                      <span className="text-xs text-[#ffc72d] ml-1">{product.bananaPoints} pts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-[#ffc72d]" /> Featured Items
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {products
              .filter((product) => product.featured)
              .slice(0, 2)
              .map((product) => (
                <Card
                  key={product.id}
                  className="bg-zinc-900 border-0 overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <CardContent className="p-0">
                    <div className="relative h-40 w-full bg-zinc-800">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-60"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-bold text-white">{product.name}</h3>
                        <p className="text-[#ffc72d]">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
