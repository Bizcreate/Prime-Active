"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart, Plus, Shield, Upload, Smartphone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { MerchandiseWearService, type ConnectedMerchandise } from "@/services/nfc-service"
import { useWeb3 } from "@/components/web3-provider"
import type { MerchandiseType } from "@/services/nft-minting-service"
import type { NFCMerchandiseTag } from "@/services/nfc-service"
import { useRouter } from "next/navigation"

export default function StorePage() {
  const router = useRouter()
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
  const [showNfcScanner, setShowNfcScanner] = useState(false)
  const [nfcError, setNfcError] = useState<string | null>(null)

  // NFT minting state
  const [showMintingModal, setShowMintingModal] = useState(false)
  const [mintingProduct, setMintingProduct] = useState<any>(null)
  const [mintingTransactionId, setMintingTransactionId] = useState("")
  const [selectedMerchandiseType, setSelectedMerchandiseType] = useState<MerchandiseType>("standard")
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "merchandise-type" | "payment" | "confirmation">("cart")

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
        // Add the demo product
        {
          id: "demo-product",
          name: "FREE Demo Product (Test Checkout)",
          description: "This is a free demo product to test the checkout process. No payment required.",
          price: 0.0,
          images: ["/tech-demo-interface.png"],
          category: "demo",
          bananaPoints: 50,
          rating: 5.0,
          reviews: 99,
          variants: [{ id: "demo-var1", name: "Demo Size", inStock: true }],
          hasNFC: true,
          isDemo: true,
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

  // Get demo product
  const demoProduct = products.find((product) => product.id === "demo-product")

  // Determine the best merchandise type based on cart items
  const determineBestMerchandiseType = () => {
    // Check if any items in the cart have NFC capability
    const hasNfcItems = cartItems.some((item) => item.hasNFC)

    // If there are NFC-capable items, default to the premium option
    if (hasNfcItems) {
      return "nfc+nft" as MerchandiseType
    }

    // Otherwise, default to standard
    return "standard" as MerchandiseType
  }

  // Update selected merchandise type when cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      const bestType = determineBestMerchandiseType()
      setSelectedMerchandiseType(bestType)
    }
  }, [cartItems])

  // Handle add to cart
  const handleAddToCart = (product: any, variant: string) => {
    // Calculate price based on selected merchandise type
    let price = product.price
    if (selectedMerchandiseType === "nfc") {
      price = product.price * 1.15
    } else if (selectedMerchandiseType === "nfc+nft") {
      price = product.price * 1.2
    }

    const cartItem = {
      id: `${product.id}-${variant}-${selectedMerchandiseType}`,
      productId: product.id,
      name: product.name,
      price: price,
      image: product.images[0],
      variant,
      quantity: 1,
      bananaPoints: product.bananaPoints,
      hasNFC: product.hasNFC,
      merchandiseType: selectedMerchandiseType,
      isDemo: product.isDemo || false,
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
  }

  // Handle demo checkout directly
  const handleDemoCheckout = () => {
    // Create a demo product if it doesn't exist in products array
    const demoProduct = {
      id: "demo-product",
      name: "FREE Demo Product (Test Checkout)",
      description: "This is a free demo product to test the checkout process. No payment required.",
      price: 0.0,
      images: ["/tech-demo-interface.png"],
      category: "demo",
      bananaPoints: 50,
      rating: 5.0,
      reviews: 99,
      variants: [{ id: "demo-var1", name: "Demo Size", inStock: true }],
      hasNFC: true,
      isDemo: true,
    }

    // Add to cart with demo size
    const cartItem = {
      id: `${demoProduct.id}-Demo Size-nfc+nft`,
      productId: demoProduct.id,
      name: demoProduct.name,
      price: 0,
      image: demoProduct.images[0],
      variant: "Demo Size",
      quantity: 1,
      bananaPoints: demoProduct.bananaPoints,
      hasNFC: demoProduct.hasNFC,
      merchandiseType: "nfc+nft",
      isDemo: true,
    }

    setCartItems([cartItem])
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
  const cartTotal = cartItems.reduce((total, item) => {
    // Calculate price based on merchandise type
    let itemPrice = item.price
    if (selectedMerchandiseType === "nfc" && !item.hasNFC) {
      itemPrice *= 1.15 // 15% more for adding NFC
    } else if (selectedMerchandiseType === "nfc+nft") {
      itemPrice *= item.hasNFC ? 1.2 : 1.35 // 20% more for NFT or 35% for both NFC+NFT
    }
    return total + itemPrice * item.quantity
  }, 0)

  const cartTotalBananaPoints = cartItems.reduce((total, item) => {
    // Calculate bonus points based on merchandise type
    let pointMultiplier = 1
    if (selectedMerchandiseType === "nfc") pointMultiplier = 2
    if (selectedMerchandiseType === "nfc+nft") pointMultiplier = 3
    return total + item.bananaPoints * item.quantity * pointMultiplier
  }, 0)

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

  // Handle NFC tag detection
  const handleNfcTagDetected = (tag: NFCMerchandiseTag) => {
    // Create new merchandise item
    const newItem: ConnectedMerchandise = {
      id: `merch-${Date.now()}`,
      productName: tag.productName,
      productId: tag.productId,
      image: `/prime-mates-${tag.productType}.png`,
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

    // Close scanner
    setShowNfcScanner(false)
  }

  // Handle checkout
  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true)

      // Check if this is a demo checkout
      const isDemo = cartItems.some((item) => item.isDemo)

      // If we're in the cart step, move to merchandise type selection
      if (checkoutStep === "cart") {
        // For demo products, skip directly to payment
        if (isDemo) {
          setCheckoutStep("payment")
        } else {
          // Skip the merchandise type selection if all items in cart have NFC capability
          // and we've already set the type to nfc+nft
          const allItemsHaveNFC = cartItems.every((item) => item.hasNFC)
          const anyItemHasNFC = cartItems.some((item) => item.hasNFC)

          if (anyItemHasNFC && selectedMerchandiseType === "nfc+nft") {
            // Skip directly to payment if we've already selected the premium option
            setCheckoutStep("payment")
          } else {
            setCheckoutStep("merchandise-type")
          }
        }

        setIsCheckingOut(false)
        return
      }

      // If we're in the merchandise type step, move to payment
      if (checkoutStep === "merchandise-type") {
        setCheckoutStep("payment")
        setIsCheckingOut(false)
        return
      }

      // If we're in the payment step, process the payment
      if (checkoutStep === "payment") {
        // For demo items, skip payment processing and go straight to success
        if (isDemo) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        } else {
          // Simulate payment processing for regular items
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }

        // Generate transaction ID
        const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        setMintingTransactionId(transactionId)

        // If NFT minting is selected and we have NFT-eligible items
        if (selectedMerchandiseType === "nfc+nft" && cartItems.some((item) => item.hasNFC)) {
          // Find the first NFT-eligible item to mint
          const nftItem = cartItems.find((item) => item.hasNFC)
          if (nftItem) {
            const product =
              products.find((p) => p.id === nftItem.productId) ||
              (nftItem.isDemo
                ? {
                    id: "demo-product",
                    name: nftItem.name,
                    images: [nftItem.image],
                    hasNFC: true,
                  }
                : null)

            if (product) {
              setMintingProduct(product)
              setShowMintingModal(true)
            }
          }
        }

        // Move to confirmation step
        setCheckoutStep("confirmation")
        setCheckoutSuccess(true)

        // Reset after showing success message
        setTimeout(() => {
          setCartItems([])
          setCheckoutSuccess(false)
          setShowCart(false)
          setCheckoutStep("cart")
        }, 3000)
      }
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
    setShowNfcScanner(true)
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

  // Handle merchandise type selection
  const handleMerchandiseTypeSelect = (type: MerchandiseType) => {
    setSelectedMerchandiseType(type)
  }

  // Reset checkout steps when cart is closed
  useEffect(() => {
    if (!showCart) {
      setCheckoutStep("cart")
    }
  }, [showCart])

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
                            <Button variant="ghost" size="icon">
                              Edit
                            </Button>
                            <Button variant="ghost" size="icon">
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-zinc-900 rounded-lg p-3">
                    <h3 className="text-sm font-medium mb-2">Quick Add</h3>
                    <input
                      type="text"
                      placeholder="Product Name"
                      className="w-full bg-zinc-800 rounded-md p-2 text-xs mb-2"
                      value={quickAddName}
                      onChange={(e) => setQuickAddName(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      className="w-full bg-zinc-800 rounded-md p-2 text-xs mb-2"
                      value={quickAddPrice}
                      onChange={(e) => setQuickAddPrice(e.target.value)}
                    />
                    <Button className="w-full flex items-center justify-center gap-2" onClick={handleQuickAddProduct}>
                      <Plus className="h-4 w-4" />
                      Quick Add Product
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product List */}
        {isLoading ? (
          <div className="text-center text-gray-500">Loading products...</div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filteredProducts.map((product) => (
              <motion.div variants={itemVariants} key={product.id} className="bg-zinc-900 rounded-lg p-4">
                <div className="relative w-full h-32 mb-2">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {product.isLimited && (
                    <Badge className="absolute top-2 left-2 bg-secondary text-black text-xs">Limited</Badge>
                  )}
                </div>
                <h3 className="text-sm font-bold truncate">{product.name}</h3>
                <p className="text-xs text-gray-400 truncate">{product.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-primary font-medium">${product.price.toFixed(2)}</span>
                  <Button variant="outline" size="sm" onClick={() => setSelectedProduct(product)}>
                    View
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setSelectedProduct(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-zinc-900 rounded-lg p-6 w-full max-w-md overflow-auto max-h-[90vh]"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={selectedProduct.images[0] || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h2 className="text-lg font-bold mb-2">{selectedProduct.name}</h2>
              <p className="text-sm text-gray-400 mb-4">{selectedProduct.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-primary font-medium">${selectedProduct.price.toFixed(2)}</span>
                <div className="flex items-center gap-2">
                  <Image
                    src="/shaka-banana-hand.png"
                    alt="Shaka Points"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                  <span className="text-xs text-primary font-medium">{selectedProduct.bananaPoints} Points</span>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Variants</h4>
                <div className="flex gap-2">
                  {selectedProduct.variants.map((variant) => (
                    <Badge key={variant.id} className="bg-zinc-800 text-gray-300">
                      {variant.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => handleAddToCart(selectedProduct, selectedProduct.variants[0].name)}
              >
                Add to Cart
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            className="fixed top-0 right-0 w-full max-w-md h-full bg-zinc-950 z-50 shadow-lg"
            variants={cartVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Your Cart</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowCart(false)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center text-gray-500 flex-1 flex items-center justify-center">
                  Your cart is empty.
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="relative w-20 h-20 mr-4">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold">{item.name}</h3>
                          <p className="text-xs text-gray-400">{item.variant}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.id, -1)}>
                              -
                            </Button>
                            <span className="text-sm">{item.quantity}</span>
                            <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.id, 1)}>
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                      <span className="text-primary font-medium">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {cartItems.length > 0 && (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Subtotal:</span>
                      <span className="text-primary font-medium">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Bonus Points:</span>
                      <div className="flex items-center gap-2">
                        <Image
                          src="/shaka-banana-hand.png"
                          alt="Shaka Points"
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                        <span className="text-xs text-primary font-medium">{cartTotalBananaPoints} Points</span>
                      </div>
                    </div>
                  </div>

                  {checkoutStep === "merchandise-type" && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Select Merchandise Type</h4>
                      <div className="flex gap-2">
                        <Button
                          variant={selectedMerchandiseType === "standard" ? "default" : "outline"}
                          onClick={() => handleMerchandiseTypeSelect("standard")}
                        >
                          Standard
                        </Button>
                        <Button
                          variant={selectedMerchandiseType === "nfc" ? "default" : "outline"}
                          onClick={() => handleMerchandiseTypeSelect("nfc")}
                        >
                          NFC
                        </Button>
                        <Button
                          variant={selectedMerchandiseType === "nfc+nft" ? "default" : "outline"}
                          onClick={() => handleMerchandiseTypeSelect("nfc+nft")}
                        >
                          NFC + NFT
                        </Button>
                      </div>
                    </div>
                  )}

                  {checkoutStep === "payment" && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Payment Details</h4>
                      <p className="text-xs text-gray-400">Enter your payment information below.</p>
                      {/* Payment form would go here */}
                    </div>
                  )}

                  {checkoutStep === "confirmation" && checkoutSuccess && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Order Confirmation</h4>
                      <p className="text-xs text-green-500">
                        Payment successful! Your order has been placed. Transaction ID: {mintingTransactionId}
                      </p>
                    </div>
                  )}

                  <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut}>
                    {isCheckingOut ? "Processing..." : "Checkout"}
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NFC Scanner */}
      <AnimatePresence>
        {showNfcScanner && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setShowNfcScanner(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-zinc-900 rounded-lg p-6 w-full max-w-md"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold mb-4">Scan NFC Tag</h2>
              <p className="text-sm text-gray-400 mb-4">Hold your device near the NFC tag to scan it.</p>
              {nfcError && <p className="text-sm text-red-500 mb-4">{nfcError}</p>}
              <Button className="w-full" onClick={() => setShowNfcScanner(false)}>
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NFT Minting Modal */}
      <AnimatePresence>
        {showMintingModal && mintingProduct && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setShowMintingModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-zinc-900 rounded-lg p-6 w-full max-w-md"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold mb-4">Minting NFT</h2>
              <p className="text-sm text-gray-400 mb-4">Minting your NFT for {mintingProduct.name}.</p>
              <Button className="w-full" onClick={() => setShowMintingModal(false)}>
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Demo Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-green-600 p-4 flex items-center justify-between z-50">
        <div className="flex items-center">
          <div className="bg-white rounded-full p-2 mr-3">
            <Image src="/tech-demo-interface.png" alt="Demo" width={32} height={32} className="object-contain" />
          </div>
          <div>
            <h3 className="font-bold text-black">Try Our FREE Demo Checkout</h3>
            <p className="text-xs text-green-900">Experience the full checkout process with no payment required</p>
          </div>
        </div>
        <Button onClick={handleDemoCheckout} className="bg-black hover:bg-gray-800 text-white">
          Try Demo
        </Button>
      </div>
    </div>
  )
}
