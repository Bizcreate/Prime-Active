"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  ArrowLeft,
  ShoppingCart,
  Search,
  Filter,
  Star,
  Heart,
  ShoppingBag,
  Check,
  Tag,
  Clock,
  Shirt,
  Timer,
  Plus,
  Shield,
  Edit,
  Trash2,
  Upload,
  Smartphone,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { MerchandiseWearService, type ConnectedMerchandise } from "@/services/nfc-service"
import { formatDistanceToNow } from "date-fns"
import { useWeb3 } from "@/components/web3-provider"

export default function MerchPage() {
  // Store state
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)
  const [showNonNfcItems, setShowNonNfcItems] = useState(true)
  const [quickAddName, setQuickAddName] = useState("")
  const [quickAddPrice, setQuickAddPrice] = useState("")

  // Merchandise state
  const [merchandise, setMerchandise] = useState<ConnectedMerchandise[]>([])
  const [activeItems, setActiveItems] = useState<ConnectedMerchandise[]>([])
  const [totalTokens, setTotalTokens] = useState(0)

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  // NFC state
  const [isNfcScanning, setIsNfcScanning] = useState(false)
  const [nfcError, setNfcError] = useState<string | null>(null)

  // Get wallet info
  const { address } = useWeb3()

  // Check if user is admin
  useEffect(() => {
    // In a real app, this would check against a database of admin addresses
    // For demo purposes, we'll just check if the user is connected
    if (address) {
      setIsAdmin(true)
    }
  }, [address])

  // Load store products
  useEffect(() => {
    setTimeout(() => {
      const mockProducts = [
        {
          id: "product1",
          name: "Prime Mates Classic T-Shirt",
          description: "Classic black t-shirt with Prime Mates logo. Made from 100% organic cotton.",
          price: 29.99,
          images: ["/prime-mates-tshirt.png"],
          category: "apparel",
          bananaPoints: 200,
          rating: 4.8,
          reviews: 42,
          variants: [
            { id: "var1", name: "S", inStock: true },
            { id: "var2", name: "M", inStock: true },
            { id: "var3", name: "L", inStock: true },
            { id: "var4", name: "XL", inStock: true },
            { id: "var5", name: "XXL", inStock: false },
          ],
          hasNFC: true,
          featured: true,
        },
        {
          id: "product2",
          name: "Prime Mates Board Club Snapback",
          description: "Black snapback cap with embroidered Prime Mates Board Club logo. One size fits all.",
          price: 24.99,
          images: ["/prime-mates-snapback.png"],
          category: "apparel",
          bananaPoints: 150,
          rating: 4.9,
          reviews: 27,
          variants: [{ id: "var6", name: "One Size", inStock: true }],
          hasNFC: true,
        },
        {
          id: "product3",
          name: "Prime Mates Crew Jumper",
          description: "Comfortable black jumper with Prime Mates logo. Perfect for post-session warmth.",
          price: 49.99,
          images: ["/prime-mates-jumper.png"],
          category: "apparel",
          bananaPoints: 300,
          rating: 4.7,
          reviews: 35,
          variants: [
            { id: "var7", name: "S", inStock: true },
            { id: "var8", name: "M", inStock: true },
            { id: "var9", name: "L", inStock: true },
            { id: "var10", name: "XL", inStock: true },
            { id: "var11", name: "XXL", inStock: false },
          ],
          hasNFC: true,
        },
        {
          id: "product4",
          name: "Bone Shaka T-Shirt",
          description: "Black t-shirt with Prime Mates bone shaka design. Est. 2022 edition.",
          price: 32.99,
          images: ["/prime-mates-boneshaka.webp"],
          category: "apparel",
          bananaPoints: 220,
          rating: 4.8,
          reviews: 31,
          variants: [
            { id: "var12", name: "S", inStock: true },
            { id: "var13", name: "M", inStock: true },
            { id: "var14", name: "L", inStock: true },
            { id: "var15", name: "XL", inStock: true },
            { id: "var16", name: "XXL", inStock: true },
          ],
          hasNFC: true,
        },
        {
          id: "product5",
          name: "PMBC Red/Black Snapback",
          description: "Stylish black and red snapback with embroidered PMBC logo. Perfect for sunny days at the park.",
          price: 27.99,
          images: ["/pmbc-red-black-cap.jpeg"],
          category: "apparel",
          bananaPoints: 180,
          rating: 4.7,
          reviews: 23,
          variants: [{ id: "var17", name: "One Size", inStock: true }],
          hasNFC: true,
        },
        {
          id: "product6",
          name: "Skatepark Desk Mat",
          description:
            "Large desk mat featuring a colorful skatepark scene. Perfect for your home office or gaming setup.",
          price: 34.99,
          images: ["/skatepark-desk-mat.png"],
          category: "accessories",
          bananaPoints: 250,
          rating: 4.9,
          reviews: 18,
          variants: [
            { id: "var18", name: "Standard (900x400mm)", inStock: true },
            { id: "var19", name: "XL (1200x600mm)", inStock: false },
          ],
          hasNFC: false,
        },
        {
          id: "product7",
          name: "Prime Grunge T-Shirt",
          description: "White t-shirt with graffiti-style monkey and skateboard design. Limited edition.",
          price: 34.99,
          images: ["/prime-grunge-tshirt.png"],
          category: "apparel",
          bananaPoints: 230,
          rating: 4.8,
          reviews: 29,
          variants: [
            { id: "var20", name: "S", inStock: true },
            { id: "var21", name: "M", inStock: true },
            { id: "var22", name: "L", inStock: true },
            { id: "var23", name: "XL", inStock: true },
            { id: "var24", name: "XXL", inStock: false },
          ],
          hasNFC: true,
          isLimited: true,
        },
        {
          id: "product8",
          name: "Flamingo Party Shirt",
          description:
            "Vibrant blue button-up shirt with pink flamingo pattern. Perfect for beach days and summer parties.",
          price: 39.99,
          images: ["/flamingo-shirt.jpeg"],
          category: "apparel",
          bananaPoints: 280,
          rating: 4.6,
          reviews: 21,
          variants: [
            { id: "var25", name: "S", inStock: true },
            { id: "var26", name: "M", inStock: true },
            { id: "var27", name: "L", inStock: true },
            { id: "var28", name: "XL", inStock: true },
            { id: "var29", name: "XXL", inStock: true },
          ],
          hasNFC: false,
        },
        {
          id: "product9",
          name: "Prime Mates Banana Board",
          description: "Limited edition skateboard with banana graphic design. Perfect for street and park riding.",
          price: 89.99,
          images: ["/banana-board.png"],
          category: "skate",
          bananaPoints: 500,
          rating: 4.8,
          reviews: 24,
          variants: [
            { id: "var30", name: '7.75"', inStock: true },
            { id: "var31", name: '8.0"', inStock: true },
            { id: "var32", name: '8.25"', inStock: true },
            { id: "var33", name: '8.5"', inStock: false },
          ],
          isLimited: true,
          hasNFC: true,
        },
        {
          id: "product10",
          name: "Banana Barrel Surf Wax",
          description: "Premium surf wax with banana scent. Provides excellent grip in all water temperatures.",
          price: 12.99,
          images: ["/banana-surf-wax.png"],
          category: "surf",
          bananaPoints: 100,
          rating: 4.9,
          reviews: 36,
          variants: [
            { id: "var34", name: "Cold Water", inStock: true },
            { id: "var35", name: "Cool Water", inStock: true },
            { id: "var36", name: "Warm Water", inStock: true },
            { id: "var37", name: "Tropical Water", inStock: true },
          ],
          hasNFC: false,
        },
      ]

      setProducts(mockProducts)
      setIsLoading(false)
    }, 1500)
  }, [])

  // Load merchandise data
  useEffect(() => {
    // Load merchandise data
    const items = MerchandiseWearService.getConnectedMerchandise()
    setMerchandise(items)

    // Get currently worn items
    const worn = MerchandiseWearService.getCurrentlyWornItems()
    setActiveItems(worn)

    // Get total tokens
    const tokens = MerchandiseWearService.getTotalEarnedTokens()
    setTotalTokens(tokens)

    // Set up interval to refresh data
    const interval = setInterval(() => {
      const updatedItems = MerchandiseWearService.getConnectedMerchandise()
      setMerchandise(updatedItems)

      const updatedWorn = MerchandiseWearService.getCurrentlyWornItems()
      setActiveItems(updatedWorn)

      const updatedTokens = MerchandiseWearService.getTotalEarnedTokens()
      setTotalTokens(updatedTokens)
    }, 60000) // Refresh every minute

    return () => clearInterval(interval)
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
      price: product.price * 1.2,
      image: product.images[0],
      variant,
      quantity: 1,
      bananaPoints: product.bananaPoints,
      hasNFC: product.hasNFC,
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

  // Handle checkout
  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true)

      // Simulate checkout process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Add NFC items to merchandise
      const nfcItems = cartItems.filter((item) => item.hasNFC)
      if (nfcItems.length > 0) {
        // Simulate adding NFC items to merchandise
        console.log("Adding NFC items to merchandise:", nfcItems)
        // In a real app, you would add these items to the user's merchandise collection
      }

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

  // Format wear time
  const formatWearTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours < 24) {
      return `${hours}h ${remainingMinutes}m`
    }

    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24

    return `${days}d ${remainingHours}h`
  }

  // Connect NFC item
  const handleConnectNFC = async () => {
    try {
      setIsNfcScanning(true)
      setNfcError(null)

      // Check if NFC is available
      if (typeof window !== "undefined" && !("NDEFReader" in window)) {
        setNfcError("NFC is not supported on this device. Please try using a different device.")
        setIsNfcScanning(false)
        return
      }

      // Simulate NFC scanning
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate a random merchandise item
      const productTypes = ["hat", "tshirt", "hoodie", "shoes", "accessory"]
      const randomType = productTypes[Math.floor(Math.random() * productTypes.length)]

      // Get product name and image based on type
      let productName = ""
      let image = ""

      switch (randomType) {
        case "hat":
          productName = "Prime Mates Snapback"
          image = "/prime-mates-snapback.png"
          break
        case "tshirt":
          productName = "Prime Mates T-Shirt"
          image = "/prime-mates-tshirt.png"
          break
        case "hoodie":
          productName = "Prime Mates Jumper"
          image = "/prime-mates-jumper.png"
          break
        case "shoes":
          productName = "Prime Mates Sneakers"
          image = "/banana-board.png" // Placeholder
          break
        case "accessory":
          productName = "Prime Mates Wristband"
          image = "/banana-grip.png" // Placeholder
          break
      }

      // Create new merchandise item
      const newItem: ConnectedMerchandise = {
        id: `merch-${Date.now()}`,
        productName,
        productId: `prod-${Date.now()}`,
        image,
        dateConnected: new Date().toISOString(),
        lastWorn: new Date().toISOString(),
        totalWearTime: 0,
        tokenRewards: 0,
        isCurrentlyWorn: false,
        wearingSince: null,
      }

      // Add to merchandise
      MerchandiseWearService.addMerchandise(newItem)

      // Refresh merchandise list
      const items = MerchandiseWearService.getConnectedMerchandise()
      setMerchandise(items)

      setIsNfcScanning(false)
    } catch (error) {
      console.error("NFC scan error:", error)
      setNfcError("Failed to scan NFC tag. Please try again.")
      setIsNfcScanning(false)
    }
  }

  // Admin functions
  const handleAddProduct = () => {
    setEditingProduct({
      id: `product${products.length + 1}`,
      name: "",
      description: "",
      price: 29.99,
      images: ["/placeholder.svg"],
      category: "apparel",
      bananaPoints: 200,
      rating: 4.5,
      reviews: 0,
      variants: [
        { id: `var-new-1`, name: "S", inStock: true },
        { id: `var-new-2`, name: "M", inStock: true },
        { id: `var-new-3`, name: "L", inStock: true },
      ],
      hasNFC: true,
    })
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct({ ...product })
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId))
  }

  const handleSaveProduct = () => {
    if (editingProduct) {
      const existingIndex = products.findIndex((p) => p.id === editingProduct.id)

      if (existingIndex >= 0) {
        // Update existing product
        const updatedProducts = [...products]
        updatedProducts[existingIndex] = editingProduct
        setProducts(updatedProducts)
      } else {
        // Add new product
        setProducts([...products, editingProduct])
      }

      setEditingProduct(null)
    }
  }

  const handleQuickAddProduct = () => {
    const newProduct = {
      id: `product${products.length + 1}`,
      name: quickAddName,
      description: "Product description goes here.",
      price: Number.parseFloat(quickAddPrice),
      images: ["/placeholder.svg"],
      category: "apparel",
      bananaPoints: Math.round(Number.parseFloat(quickAddPrice) * 5),
      rating: 5.0,
      reviews: 0,
      variants: [
        { id: `var-new-1`, name: "S", inStock: true },
        { id: `var-new-2`, name: "M", inStock: true },
        { id: `var-new-3`, name: "L", inStock: true },
      ],
      hasNFC: true,
    }

    setProducts([...products, newProduct])
    setQuickAddName("")
    setQuickAddPrice("")
  }

  // Toggle item wearing
  const handleToggleWearing = (item: ConnectedMerchandise) => {
    if (item.isCurrentlyWorn) {
      MerchandiseWearService.stopWearing(item.id)
    } else {
      MerchandiseWearService.startWearing(item.id)
    }

    // Refresh merchandise list
    const items = MerchandiseWearService.getConnectedMerchandise()
    setMerchandise(items)

    // Get currently worn items
    const worn = MerchandiseWearService.getCurrentlyWornItems()
    setActiveItems(worn)
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
          <h1 className="text-xl font-bold">Prime Mates Merch</h1>
          {isAdmin && (
            <Button variant="ghost" size="icon" className="ml-2" onClick={() => setShowAdminPanel(!showAdminPanel)}>
              <Shield className={`h-5 w-5 ${showAdminPanel ? "text-primary" : ""}`} />
            </Button>
          )}
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
            <Image src="/shaka-banana-hand.png" alt="Shaka Points" width={16} height={16} className="object-contain" />
            <span className="text-xs text-primary font-medium">Earn Points with Purchases</span>
          </div>
        </div>

        {/* Admin Panel */}
        <AnimatePresence>
          {showAdminPanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Admin Panel</h2>
                  <Badge className="bg-primary text-black">Admin Only</Badge>
                </div>

                <div className="space-y-4">
                  <Button className="w-full flex items-center justify-center gap-2" onClick={handleAddProduct}>
                    <Plus className="h-4 w-4" />
                    Add New Product
                  </Button>

                  <div className="bg-zinc-900 rounded-lg p-3">
                    <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Upload className="h-3 w-3 mr-1" />
                        Bulk Import
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Smartphone className="h-3 w-3 mr-1" />
                        NFC Manager
                      </Button>
                    </div>
                  </div>

                  <div className="bg-zinc-900 rounded-lg p-3">
                    <h3 className="text-sm font-medium mb-2">Product Management</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {products.slice(0, 5).map((product) => (
                        <div key={product.id} className="flex items-center justify-between bg-zinc-800 p-2 rounded">
                          <div className="flex items-center">
                            <div className="w-8 h-8 relative mr-2">
                              <Image
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <span className="text-xs truncate max-w-[120px]">{product.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {products.length > 5 && (
                        <div className="text-center text-xs text-zinc-500 pt-1">
                          + {products.length - 5} more products
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-zinc-900 rounded-lg p-3 mt-3">
                    <h3 className="text-sm font-medium mb-2">Quick Add Product</h3>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Input
                        placeholder="Product name"
                        className="text-xs"
                        value={quickAddName}
                        onChange={(e) => setQuickAddName(e.target.value)}
                      />
                      <Input
                        placeholder="Price"
                        type="number"
                        className="text-xs"
                        value={quickAddPrice}
                        onChange={(e) => setQuickAddPrice(e.target.value)}
                      />
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={handleQuickAddProduct}
                      disabled={!quickAddName || !quickAddPrice}
                    >
                      Add Product
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs defaultValue="store" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="store">Store</TabsTrigger>
            <TabsTrigger value="mymerch">My Merch</TabsTrigger>
          </TabsList>

          <TabsContent value="store" className="space-y-6">
            <div className="relative">
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
                  className="overflow-hidden"
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
                      <Button
                        variant={selectedCategory === "accessories" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory("accessories")}
                        className="rounded-full"
                      >
                        Accessories
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Featured Products */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold">Featured Products</h2>
              <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                  <div className="bg-zinc-900 rounded-lg overflow-hidden animate-pulse">
                    <div className="h-60 bg-zinc-800"></div>
                    <div className="p-4">
                      <div className="h-5 bg-zinc-800 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-zinc-800 rounded w-1/2 mb-4"></div>
                      <div className="h-8 bg-zinc-800 rounded"></div>
                    </div>
                  </div>
                ) : (
                  filteredProducts
                    .filter((product) => product.featured)
                    .map((product) => (
                      <div
                        key={product.id}
                        className="bg-zinc-900 rounded-lg overflow-hidden"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="relative h-60">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-contain p-4"
                          />
                          {product.isLimited && (
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-primary text-black">Limited Edition</Badge>
                            </div>
                          )}
                          {product.hasNFC && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-blue-500 text-white">NFC</Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg">{product.name}</h3>
                          <p className="text-zinc-400 text-sm mb-3">{product.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-lg">${(product.price * 1.2).toFixed(2)}</p>
                              <div className="flex items-center gap-1 bg-primary/20 px-2 py-0.5 rounded-full">
                                <Image src="/shaka-banana-hand.png" alt="Shaka Points" width={12} height={12} />
                                <span className="text-xs text-primary">{product.bananaPoints}</span>
                              </div>
                            </div>
                            <Button size="sm">View Details</Button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* All Products */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold">All Products</h2>
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
                        {product.hasNFC && (
                          <div className="absolute top-2 left-2 ml-24">
                            <Badge className="bg-blue-500 text-white">NFC</Badge>
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
                          <p className="font-bold">${(product.price * 1.2).toFixed(2)}</p>
                          <div className="flex items-center gap-1 bg-primary/20 px-2 py-0.5 rounded-full">
                            <Image src="/shaka-banana-hand.png" alt="Shaka Points" width={10} height={10} />
                            <span className="text-[0.65rem] text-primary">{product.bananaPoints}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="mymerch" className="space-y-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-900 p-4 rounded-lg flex flex-col items-center">
                <div className="mb-2">
                  <Tag className="h-6 w-6 text-[#ffc72d]" />
                </div>
                <div className="text-2xl font-bold">{merchandise.length}</div>
                <div className="text-xs text-zinc-400">Connected Items</div>
              </div>

              <div className="bg-zinc-900 p-4 rounded-lg flex flex-col items-center">
                <div className="mb-2">
                  <Image src="/shaka-coin.png" alt="Tokens Earned" width={24} height={24} className="object-contain" />
                </div>
                <div className="text-2xl font-bold text-[#ffc72d]">{totalTokens}</div>
                <div className="text-xs text-zinc-400">Tokens Earned</div>
              </div>
            </div>

            {activeItems.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-3">Currently Wearing</h2>
                <div className="space-y-3">
                  {activeItems.map((item) => (
                    <div key={item.id} className="bg-zinc-900 rounded-lg p-4 flex items-center">
                      <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.productName}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.productName}</h3>
                        <div className="flex items-center text-xs text-green-500">
                          <Timer className="h-3 w-3 mr-1" />
                          <span>
                            Wearing for{" "}
                            {formatDistanceToNow(new Date(item.wearingSince || Date.now()), { addSuffix: false })}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-2" onClick={() => handleToggleWearing(item)}>
                        Stop
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-medium">My Items</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-zinc-800 px-3 py-1.5 rounded-full">
                    <label htmlFor="show-non-nfc" className="text-xs text-zinc-400 mr-2">
                      Show non-NFC items
                    </label>
                    <div className={`w-8 h-4 rounded-full relative ${showNonNfcItems ? "bg-primary" : "bg-zinc-600"}`}>
                      <div
                        className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
                          showNonNfcItems ? "left-[18px]" : "left-0.5"
                        }`}
                      />
                      <input
                        type="checkbox"
                        id="show-non-nfc"
                        checked={showNonNfcItems}
                        onChange={(e) => setShowNonNfcItems(e.target.checked)}
                        className="sr-only"
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90"
                    onClick={handleConnectNFC}
                    disabled={isNfcScanning}
                  >
                    {isNfcScanning ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-1" />
                        Connect New
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {nfcError && (
                <div className="bg-red-900/20 border border-red-900 rounded-md p-3 mb-4 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-500">{nfcError}</p>
                </div>
              )}

              {merchandise.length === 0 ? (
                <div className="bg-zinc-900 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shirt className="h-8 w-8 text-zinc-500" />
                  </div>
                  <h3 className="font-medium mb-2">No Items Connected</h3>
                  <p className="text-sm text-zinc-400 mb-4">
                    Connect your Prime Active merchandise to start earning rewards for wearing it.
                  </p>
                  <Button
                    className="w-full bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90"
                    onClick={handleConnectNFC}
                    disabled={isNfcScanning}
                  >
                    {isNfcScanning ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Scanning NFC Tag...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Connect Merchandise
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {merchandise
                    .filter((item) => showNonNfcItems || item.productId.startsWith("prod-"))
                    .map((item) => (
                      <div key={item.id} className="bg-zinc-900 rounded-lg p-4 flex items-center">
                        <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.productName}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.productName}</h3>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-zinc-500">
                              {item.isCurrentlyWorn ? (
                                <span className="text-green-500">Currently wearing</span>
                              ) : (
                                <span>
                                  Last worn {formatDistanceToNow(new Date(item.lastWorn), { addSuffix: true })}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center text-xs text-[#ffc72d]">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatWearTime(item.totalWearTime)}</span>
                            </div>
                          </div>
                        </div>
                        {!item.isCurrentlyWorn && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2"
                            onClick={() => handleToggleWearing(item)}
                          >
                            Wear
                          </Button>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="bg-zinc-900 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-3">How Wear-to-Earn Works</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Connect Your Merch</h4>
                    <p className="text-xs text-zinc-400">
                      Use the NFC scanner to connect your Prime Mates merchandise to your account.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Wear Your Merch</h4>
                    <p className="text-xs text-zinc-400">
                      Press the "Wear" button when you put on your merchandise and "Stop" when you take it off.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Earn Rewards</h4>
                    <p className="text-xs text-zinc-400">
                      Earn 1 token for every 10 minutes you wear your connected merchandise. Tokens can be used for
                      discounts and exclusive items!
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                {selectedProduct.hasNFC && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-500 text-white">NFC Enabled</Badge>
                  </div>
                )}
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

                {selectedProduct.hasNFC && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-3 mb-6">
                    <h3 className="text-sm font-medium text-blue-400 mb-1">NFC Enabled Merchandise</h3>
                    <p className="text-xs text-zinc-300">
                      This item has an embedded NFC chip. Connect it to the app to earn tokens for wearing it!
                    </p>
                  </div>
                )}

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
                    <p className="text-2xl font-bold">${(selectedProduct.price * 1.2).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/20 px-3 py-1 rounded-full">
                    <Image src="/shaka-banana-hand.png" alt="Shaka Points" width={16} height={16} />
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
                            {item.hasNFC && (
                              <div className="absolute top-1 right-1">
                                <Badge className="bg-blue-500 text-white text-xs px-1 py-0">NFC</Badge>
                              </div>
                            )}
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
                          <span className="font-bold">${(cartTotal * 1.2).toFixed(2)}</span>
                          <div className="flex items-center gap-1 text-xs text-primary">
                            <Image src="/shaka-banana-hand.png" alt="Shaka Points" width={12} height={12} />
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

      {/* Admin Product Editor Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-zinc-900 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">
                    {editingProduct.id.includes("new") ? "Add New Product" : "Edit Product"}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setEditingProduct(null)}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Product Name</label>
                    <Input
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">Description</label>
                    <textarea
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-sm"
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      rows={3}
                      placeholder="Enter product description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Price ($)</label>
                      <Input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, price: Number.parseFloat(e.target.value) })
                        }
                        placeholder="29.99"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-1">Banana Points</label>
                      <Input
                        type="number"
                        value={editingProduct.bananaPoints}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, bananaPoints: Number.parseInt(e.target.value) })
                        }
                        placeholder="200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">Category</label>
                    <select
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-sm"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    >
                      <option value="apparel">Apparel</option>
                      <option value="skate">Skate</option>
                      <option value="surf">Surf</option>
                      <option value="snow">Snow</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasNFC"
                      checked={editingProduct.hasNFC}
                      onChange={(e) => setEditingProduct({ ...editingProduct, hasNFC: e.target.checked })}
                      className="rounded border-zinc-700"
                    />
                    <label htmlFor="hasNFC" className="text-sm">
                      NFC Enabled
                    </label>

                    <input
                      type="checkbox"
                      id="isLimited"
                      checked={editingProduct.isLimited}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isLimited: e.target.checked })}
                      className="rounded border-zinc-700 ml-4"
                    />
                    <label htmlFor="isLimited" className="text-sm">
                      Limited Edition
                    </label>

                    <input
                      type="checkbox"
                      id="featured"
                      checked={editingProduct.featured}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                      className="rounded border-zinc-700 ml-4"
                    />
                    <label htmlFor="featured" className="text-sm">
                      Featured
                    </label>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">Variants</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto bg-zinc-800 p-2 rounded-md">
                      {editingProduct.variants.map((variant: any, index: number) => (
                        <div key={variant.id} className="flex items-center space-x-2">
                          <Input
                            value={variant.name}
                            onChange={(e) => {
                              const updatedVariants = [...editingProduct.variants]
                              updatedVariants[index].name = e.target.value
                              setEditingProduct({ ...editingProduct, variants: updatedVariants })
                            }}
                            className="flex-1"
                            placeholder="Variant name"
                          />
                          <input
                            type="checkbox"
                            checked={variant.inStock}
                            onChange={(e) => {
                              const updatedVariants = [...editingProduct.variants]
                              updatedVariants[index].inStock = e.target.checked
                              setEditingProduct({ ...editingProduct, variants: updatedVariants })
                            }}
                            className="rounded border-zinc-700"
                          />
                          <label className="text-xs">In Stock</label>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => {
                              const updatedVariants = editingProduct.variants.filter((_: any, i: number) => i !== index)
                              setEditingProduct({ ...editingProduct, variants: updatedVariants })
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => {
                          const updatedVariants = [...editingProduct.variants]
                          updatedVariants.push({
                            id: `var-new-${Date.now()}`,
                            name: "",
                            inStock: true,
                          })
                          setEditingProduct({ ...editingProduct, variants: updatedVariants })
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Variant
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800">
                    <Button className="w-full" onClick={handleSaveProduct}>
                      {editingProduct.id.includes("new") ? "Add Product" : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <TabBar activeTab="merch" />
    </div>
  )
}
