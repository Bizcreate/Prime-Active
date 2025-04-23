"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart, Search, Filter, Star, Heart, ShoppingBag, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export default function MerchandiseStorePage() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])

  // Add state for checkout process
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  // Mock products data
  useEffect(() => {
    setTimeout(() => {
      const mockProducts = [
        {
          id: "product1",
          name: "Prime Mates Banana Board",
          description: "Limited edition skateboard with banana graphic design. Perfect for street and park riding.",
          price: 89.99,
          images: ["/banana-board.png"],
          category: "skate",
          bananaPoints: 500,
          rating: 4.8,
          reviews: 24,
          variants: [
            { id: "var1", name: '7.75"', inStock: true },
            { id: "var2", name: '8.0"', inStock: true },
            { id: "var3", name: '8.25"', inStock: true },
            { id: "var4", name: '8.5"', inStock: false },
          ],
          isLimited: true,
        },
        {
          id: "product2",
          name: "Banana Barrel Surf Wax",
          description: "Premium surf wax with banana scent. Provides excellent grip in all water temperatures.",
          price: 12.99,
          images: ["/banana-surf-wax.png"],
          category: "surf",
          bananaPoints: 100,
          rating: 4.9,
          reviews: 36,
          variants: [
            { id: "var5", name: "Cold Water", inStock: true },
            { id: "var6", name: "Cool Water", inStock: true },
            { id: "var7", name: "Warm Water", inStock: true },
            { id: "var8", name: "Tropical Water", inStock: true },
          ],
        },
        {
          id: "product3",
          name: "Prime Mates Hoodie",
          description: "Comfortable hoodie with embroidered Prime Mates logo. Perfect for post-session warmth.",
          price: 59.99,
          images: ["/black-hoodie-abstract-ape.png"],
          category: "apparel",
          bananaPoints: 300,
          rating: 4.7,
          reviews: 42,
          variants: [
            { id: "var9", name: "S", inStock: true },
            { id: "var10", name: "M", inStock: true },
            { id: "var11", name: "L", inStock: true },
            { id: "var12", name: "XL", inStock: true },
            { id: "var13", name: "XXL", inStock: false },
          ],
        },
        {
          id: "product4",
          name: "Banana Grip Tape",
          description: "High-quality grip tape with banana pattern. Provides excellent grip and durability.",
          price: 14.99,
          images: ["/banana-grip.png"],
          category: "skate",
          bananaPoints: 75,
          rating: 4.6,
          reviews: 18,
          variants: [
            { id: "var14", name: "Standard", inStock: true },
            { id: "var15", name: "Extra Grippy", inStock: true },
          ],
        },
        {
          id: "product5",
          name: "Prime Mates Beanie",
          description: "Warm beanie with embroidered Prime Mates logo. Perfect for cold weather sessions.",
          price: 24.99,
          images: ["/black-beanie-abstract-monkey.png"],
          category: "apparel",
          bananaPoints: 150,
          rating: 4.9,
          reviews: 27,
          variants: [{ id: "var16", name: "One Size", inStock: true }],
        },
        {
          id: "product6",
          name: "Banana Wax Comb",
          description: "Wax comb with banana-shaped handle. Perfect for removing old wax from your surfboard.",
          price: 9.99,
          images: ["/placeholder.svg?key=76xp7"],
          category: "surf",
          bananaPoints: 50,
          rating: 4.5,
          reviews: 12,
          variants: [
            { id: "var17", name: "Standard", inStock: true },
            { id: "var18", name: "Pro", inStock: true },
          ],
        },
        {
          id: "product7",
          name: "Prime Mates Snowboard Stomp Pad",
          description: "Banana-shaped stomp pad for your snowboard. Provides excellent grip for your back foot.",
          price: 19.99,
          images: ["/placeholder.svg?key=s6785"],
          category: "snow",
          bananaPoints: 100,
          rating: 4.7,
          reviews: 15,
          variants: [
            { id: "var19", name: "Yellow", inStock: true },
            { id: "var20", name: "Black", inStock: true },
          ],
        },
        {
          id: "product8",
          name: "Prime Mates T-Shirt",
          description: "Comfortable t-shirt with Prime Mates logo. Made from 100% organic cotton.",
          price: 29.99,
          images: ["/placeholder.svg?key=bg33b"],
          category: "apparel",
          bananaPoints: 200,
          rating: 4.8,
          reviews: 31,
          variants: [
            { id: "var21", name: "S", inStock: true },
            { id: "var22", name: "M", inStock: true },
            { id: "var23", name: "L", inStock: true },
            { id: "var24", name: "XL", inStock: true },
            { id: "var25", name: "XXL", inStock: true },
          ],
        },
      ]

      setProducts(mockProducts)
      setIsLoading(false)
    }, 1500)
  }, [])

  // Filter products
  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === "all" || product.category === selectedCategory
    const searchMatch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return categoryMatch && searchMatch
  })

  // Handle add to cart
  const handleAddToCart = (product: any, variant: string) => {
    const cartItem = {
      id: `${product.id}-${variant}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      variant,
      quantity: 1,
      bananaPoints: product.bananaPoints,
    }

    const existingItemIndex = cartItems.findIndex((item) => item.id === cartItem.id)

    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems]
      updatedCartItems[existingItemIndex].quantity += 1
      setCartItems(updatedCartItems)
    } else {
      setCartItems([...cartItems, cartItem])
    }

    setSelectedProduct(null)
    setShowCart(true)
  }

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

  // Handle toggle wishlist
  const handleToggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId))
    } else {
      setWishlist([...wishlist, productId])
    }
  }

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartTotalBananaPoints = cartItems.reduce((total, item) => total + item.bananaPoints * item.quantity, 0)

  // Animation variants
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

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  }

  const cartVariants = {
    hidden: { x: "100%", opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  // Add this function
  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true)

      // Simulate checkout process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Success
      setCheckoutSuccess(true)
      setCartItems([])

      // Reset after showing success message
      setTimeout(() => {
        setCheckoutSuccess(false)
        setShowCart(false)
      }, 3000)
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Prime Mates Store</h1>
          <Button variant="ghost" size="icon" className="ml-auto relative" onClick={() => setShowCart(true)}>
            <ShoppingCart className="h-5 w-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-black text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex">
            <Image
              src="/prime-mates-logo.png"
              alt="Prime Mates Board Club"
              width={100}
              height={50}
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-1 bg-primary/20 px-3 py-1 rounded-full">
            <Image src="/banana-icon.png" alt="Banana Points" width={16} height={16} className="object-contain" />
            <span className="text-xs text-primary font-medium">Earn Points with Purchases</span>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search products..."
            className="pl-9 bg-zinc-900 border-zinc-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-zinc-900 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3">Categories</h3>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                    className="rounded-full"
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedCategory === "skate" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("skate")}
                    className="rounded-full flex items-center gap-1"
                  >
                    <Image src="/shaka-icon.png" alt="Skate" width={16} height={16} className="object-contain" />
                    Skate
                  </Button>
                  <Button
                    variant={selectedCategory === "surf" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("surf")}
                    className="rounded-full"
                  >
                    Surf
                  </Button>
                  <Button
                    variant={selectedCategory === "snow" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("snow")}
                    className="rounded-full"
                  >
                    Snow
                  </Button>
                  <Button
                    variant={selectedCategory === "apparel" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("apparel")}
                    className="rounded-full"
                  >
                    Apparel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs defaultValue="products" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden animate-pulse">
                    <div className="h-40 bg-zinc-800"></div>
                    <div className="p-3">
                      <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-zinc-800 rounded w-1/2 mb-2"></div>
                      <div className="h-6 bg-zinc-800 rounded mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-zinc-900 rounded-lg p-6 text-center">
                <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
                <h3 className="text-lg font-bold mb-2">No Products Found</h3>
                <p className="text-zinc-400 text-sm mb-4">Try adjusting your search or filters</p>
                <Button
                  onClick={() => {
                    setSelectedCategory("all")
                    setSearchQuery("")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-2 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    className="bg-zinc-900 rounded-lg overflow-hidden"
                    variants={itemVariants}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="relative h-40">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.isLimited && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-primary text-black">Limited Edition</Badge>
                        </div>
                      )}
                      <button
                        className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleWishlist(product.id)
                        }}
                      >
                        <Heart
                          className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`}
                        />
                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-xs ml-1">{product.rating}</span>
                        </div>
                        <span className="text-xs text-zinc-500">({product.reviews})</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="font-bold">${product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-1 bg-primary/20 px-2 py-0.5 rounded-full">
                          <Image src="/banana-icon.png" alt="Banana Points" width={10} height={10} />
                          <span className="text-[0.65rem] text-primary">{product.bananaPoints}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="rewards">
            <div className="bg-zinc-900 rounded-lg p-6 text-center">
              <Image src="/banana-icon.png" alt="Banana Points" width={48} height={48} className="mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-2">Banana Points Rewards</h3>
              <p className="text-zinc-400 text-sm mb-4">Use your banana points to redeem exclusive merchandise</p>
              <Button>View Rewards</Button>
            </div>
          </TabsContent>

          <TabsContent value="wishlist">
            {wishlist.length === 0 ? (
              <div className="bg-zinc-900 rounded-lg p-6 text-center">
                <Heart className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
                <h3 className="text-lg font-bold mb-2">Your Wishlist is Empty</h3>
                <p className="text-zinc-400 text-sm mb-4">Save items you love to your wishlist</p>
                <Button onClick={() => document.querySelector('[data-value="products"]')?.click()}>
                  Browse Products
                </Button>
              </div>
            ) : (
              <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="show">
                {products
                  .filter((product) => wishlist.includes(product.id))
                  .map((product) => (
                    <motion.div
                      key={product.id}
                      className="bg-zinc-900 rounded-lg overflow-hidden"
                      variants={itemVariants}
                    >
                      <div className="flex">
                        <div className="relative h-24 w-24 flex-shrink-0">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3 flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                            <button className="text-red-500" onClick={() => handleToggleWishlist(product.id)}>
                              <Heart className="h-4 w-4 fill-red-500" />
                            </button>
                          </div>
                          <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{product.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="font-bold">${product.price.toFixed(2)}</p>
                            <Button size="sm" className="h-8 text-xs" onClick={() => setSelectedProduct(product)}>
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-zinc-900 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <div className="relative h-64">
                <Image
                  src={selectedProduct.images[0] || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
                <button
                  className="absolute top-4 right-4 bg-black/50 rounded-full p-2"
                  onClick={() => setSelectedProduct(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
                  <button
                    className="bg-zinc-800 rounded-full p-2"
                    onClick={() => handleToggleWishlist(selectedProduct.id)}
                  >
                    <Heart
                      className={`h-5 w-5 ${wishlist.includes(selectedProduct.id) ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm ml-1">{selectedProduct.rating}</span>
                  </div>
                  <span className="text-sm text-zinc-500">({selectedProduct.reviews} reviews)</span>
                </div>
                <p className="text-zinc-300 mb-6">{selectedProduct.description}</p>

                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Variants</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.variants.map((variant: any) => (
                      <Button
                        key={variant.id}
                        variant="outline"
                        size="sm"
                        disabled={!variant.inStock}
                        onClick={() => handleAddToCart(selectedProduct, variant.name)}
                        className={`${!variant.inStock ? "opacity-50" : ""}`}
                      >
                        {variant.name} {!variant.inStock && "(Out of Stock)"}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-zinc-400">Price</p>
                    <p className="text-2xl font-bold">${selectedProduct.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/20 px-3 py-1 rounded-full">
                    <Image src="/banana-icon.png" alt="Banana Points" width={16} height={16} />
                    <span className="text-sm text-primary font-medium">+{selectedProduct.bananaPoints} points</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    const inStockVariant = selectedProduct.variants.find((v: any) => v.inStock)
                    if (inStockVariant) {
                      handleAddToCart(selectedProduct, inStockVariant.name)
                    }
                  }}
                  disabled={!selectedProduct.variants.some((v: any) => v.inStock)}
                >
                  Add to Cart
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Shopping Cart Slide-in */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 bg-black/80 z-50 flex justify-end">
            <motion.div
              className="bg-zinc-900 w-full max-w-md h-full overflow-y-auto"
              variants={cartVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Your Cart</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowCart(false)}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-zinc-700" />
                    <h3 className="text-lg font-bold mb-2">Your Cart is Empty</h3>
                    <p className="text-zinc-400 text-sm mb-6">Add some awesome products to your cart</p>
                    <Button onClick={() => setShowCart(false)}>Continue Shopping</Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="bg-zinc-800 rounded-lg p-3 flex">
                          <div className="relative h-20 w-20 flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <h3 className="font-medium text-sm">{item.name}</h3>
                            <p className="text-xs text-zinc-400">Variant: {item.variant}</p>
                            <div className="flex justify-between items-center mt-2">
                              <p className="font-bold">${item.price.toFixed(2)}</p>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleUpdateQuantity(item.id, -1)}
                                >
                                  <span className="sr-only">Decrease</span>-
                                </Button>
                                <span className="w-6 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleUpdateQuantity(item.id, 1)}
                                >
                                  <span className="sr-only">Increase</span>+
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-zinc-800 rounded-lg p-4 mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-zinc-400">Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-zinc-400">Shipping</span>
                        <span>Calculated at checkout</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-zinc-700">
                        <span className="font-bold">Total</span>
                        <div className="text-right">
                          <span className="font-bold">${cartTotal.toFixed(2)}</span>
                          <div className="flex items-center gap-1 text-xs text-primary">
                            <Image src="/banana-icon.png" alt="Banana Points" width={12} height={12} />
                            <span>+{cartTotalBananaPoints} points</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {checkoutSuccess && (
                      <div className="bg-green-900/20 border border-green-900 rounded-md p-3 mb-4 flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <p className="text-sm text-green-500">
                          Order placed successfully! You've earned {cartTotalBananaPoints} Banana Points.
                        </p>
                      </div>
                    )}

                    <Button className="w-full mb-3" onClick={handleCheckout} disabled={isCheckingOut}>
                      {isCheckingOut ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Proceed to Checkout"
                      )}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setShowCart(false)}>
                      Continue Shopping
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
