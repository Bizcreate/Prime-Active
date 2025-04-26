"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
  Loader2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { merchandiseWearService, type ConnectedMerchandise } from "@/services/merchandise-wear-service"
import { formatDistanceToNow } from "date-fns"
import { useWeb3 } from "@/components/web3-provider"
import type { ShippingDetails } from "@/components/shipping-details-form"
import { MerchandiseTypeSelector, type MerchandiseType } from "@/components/merchandise-type-selector"
import { useRouter } from "next/navigation"
import { useWishlist } from "@/hooks/use-wishlist"

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
  const [selectedMerchandiseType, setSelectedMerchandiseType] = useState<MerchandiseType>("nfc+nft")
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)

  // Merchandise state
  const [merchandise, setMerchandise] = useState<ConnectedMerchandise[]>([])
  const [activeItems, setActiveItems] = useState<ConnectedMerchandise[]>([])
  const [totalTokens, setTotalTokens] = useState(0)

  // Admin state
  const [isAdmin, setIsAdmin] = useState(true) // Set to true by default for demo
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [showProductEditor, setShowProductEditor] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [productImage, setProductImage] = useState<string | null>(null)

  // NFC state
  const [isNfcScanning, setIsNfcScanning] = useState(false)
  const [nfcError, setNfcError] = useState<string | null>(null)

  // Checkout state
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "payment" | "confirmation">("cart")
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null)
  const [showShippingForm, setShowShippingForm] = useState(false)
  const [tokenDiscount, setTokenDiscount] = useState(0)
  const [tokensUsed, setTokensUsed] = useState(0)

  // Get wallet info
  const { address, balance, updateBalance } = useWeb3()

  // Router
  const router = useRouter()

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
    const items = merchandiseWearService.getConnectedMerchandise()
    setMerchandise(items)

    // Get currently worn items
    const worn = merchandiseWearService.getCurrentlyWornItems()
    setActiveItems(worn)

    // Get total tokens
    const tokens = merchandiseWearService.getTotalEarnedTokens()
    setTotalTokens(tokens)

    // Set up interval to refresh data
    const interval = setInterval(() => {
      const updatedItems = merchandiseWearService.getConnectedMerchandise()
      setMerchandise(updatedItems)

      const updatedWorn = merchandiseWearService.getCurrentlyWornItems()
      setActiveItems(updatedWorn)

      const updatedTokens = merchandiseWearService.getTotalEarnedTokens()
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

  // Calculate product price based on merchandise type
  const getProductPrice = (product: any, merchandiseType: MerchandiseType): number => {
    let price = product.price

    if (merchandiseType === "nfc") {
      price = product.hasNFC ? price : price * 1.2 // 20% more if adding NFC
    } else if (merchandiseType === "nfc+nft") {
      price = product.hasNFC ? price * 1.3 : price * 1.5 // 30% more for NFT or 50% for both
    }

    return price
  }

  // Calculate product points based on merchandise type
  const getProductPoints = (product: any, merchandiseType: MerchandiseType): number => {
    let points = product.bananaPoints

    if (merchandiseType === "nfc") {
      points = points * 2 // 2x points for NFC
    } else if (merchandiseType === "nfc+nft") {
      points = points * 3 // 3x points for NFC+NFT
    }

    return points
  }

  // Update the handleAddToCart function to include merchandise type
  const handleAddToCart = (product: any, variant: string, merchandiseType: MerchandiseType = "nfc+nft") => {
    const price = getProductPrice(product, merchandiseType)
    const points = getProductPoints(product, merchandiseType)

    const cartItem = {
      id: `${product.id}-${variant}-${merchandiseType}`,
      productId: product.id,
      name: product.name,
      price: price,
      image: product.images[0],
      variant,
      quantity: 1,
      bananaPoints: points,
      hasNFC: product.hasNFC,
      merchandiseType,
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
    setSelectedVariant(null)
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

  // Add this near the other hooks
  const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  // Handle toggle wishlist
  const handleToggleWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    if (isInWishlist(productId)) {
      removeFromWishlist(productId)
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
    }
  }

  // Calculate cart total
  const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartTotalBananaPoints = cartItems.reduce((total, item) => total + item.bananaPoints * item.quantity, 0)

  // Apply token discount
  const cartTotal = cartSubtotal - tokenDiscount

  // Shipping cost calculation
  const shippingCost = cartSubtotal > 50 ? 0 : 5.99

  // Final total with shipping
  const finalTotal = cartTotal + shippingCost

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

      // Add purchased items to merchandise inventory
      const nfcItems = cartItems.filter((item) => item.merchandiseType === "nfc" || item.merchandiseType === "nfc+nft")
      if (nfcItems.length > 0) {
        for (const item of nfcItems) {
          // Create a new merchandise item
          const newItem: ConnectedMerchandise = {
            id: `merch-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            productName: item.name,
            productId: item.productId,
            image: item.image,
            dateConnected: new Date().toISOString(),
            lastWorn: null,
            totalWearTime: 0,
            tokenRewards: 0,
            isCurrentlyWorn: false,
            wearingSince: null,
            hasNFC: true,
            hasNFT: item.merchandiseType === "nfc+nft",
          }

          // Add to merchandise service
          merchandiseWearService.addMerchandise(newItem)
        }

        // Refresh merchandise list
        const items = merchandiseWearService.getConnectedMerchandise()
        setMerchandise(items)
      }

      // Deduct tokens if used
      if (tokensUsed > 0) {
        // In a real app, you would call a smart contract to burn tokens
        console.log(`Burning ${tokensUsed} tokens for a discount of $${tokenDiscount.toFixed(2)}`)
        updateBalance(balance - tokensUsed)
      }

      // Success
      setCheckoutSuccess(true)
      setCartItems([])
      setTokenDiscount(0)
      setTokensUsed(0)

      // Reset after showing success message
      setTimeout(() => {
        setCheckoutSuccess(false)
        setShowCart(false)
        setCheckoutStep("cart")
        setShippingDetails(null)
      }, 3000)
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsCheckingOut(false)
    }
  }

  // Handle shipping details submission
  const handleShippingSubmit = (details: ShippingDetails) => {
    setShippingDetails(details)
    setShowShippingForm(false)
    setCheckoutStep("payment")
  }

  // Handle apply tokens for discount
  const handleApplyTokens = (tokenAmount: number, discountAmount: number) => {
    setTokenDiscount(discountAmount)
    setTokensUsed(tokenAmount)
  }

  // Handle reset token discount
  const handleResetTokens = () => {
    setTokenDiscount(0)
    setTokensUsed(0)
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
        hasNFC: true,
        hasNFT: Math.random() > 0.5,
      }

      // Add to merchandise
      merchandiseWearService.addMerchandise(newItem)

      // Refresh merchandise list
      const items = merchandiseWearService.getConnectedMerchandise()
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
    const newProduct = {
      id: `product${Date.now()}`,
      name: "",
      description: "",
      price: 29.99,
      images: ["/placeholder.svg"],
      category: "apparel",
      bananaPoints: 200,
      rating: 5.0,
      reviews: 0,
      variants: [
        { id: `var-new-1-${Date.now()}`, name: "S", inStock: true },
        { id: `var-new-2-${Date.now()}`, name: "M", inStock: true },
        { id: `var-new-3-${Date.now()}`, name: "L", inStock: true },
      ],
      hasNFC: true,
      featured: false,
      isLimited: false,
    }

    setEditingProduct(newProduct)
    setShowProductEditor(true)
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct({ ...product })
    setProductImage(product.images[0])
    setShowProductEditor(true)
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId))
  }

  const handleSaveProduct = () => {
    if (editingProduct) {
      // Make sure we have an image
      const productToSave = {
        ...editingProduct,
        images: [productImage || "/placeholder.svg"],
      }

      const existingIndex = products.findIndex((p) => p.id === productToSave.id)

      if (existingIndex >= 0) {
        // Update existing product
        const updatedProducts = [...products]
        updatedProducts[existingIndex] = productToSave
        setProducts(updatedProducts)
      } else {
        // Add new product
        setProducts([...products, productToSave])
      }

      setEditingProduct(null)
      setProductImage(null)
      setShowProductEditor(false)
    }
  }

  const handleQuickAddProduct = () => {
    if (!quickAddName || !quickAddPrice) return

    const newProduct = {
      id: `product${Date.now()}`,
      name: quickAddName,
      description: "Product description goes here.",
      price: Number.parseFloat(quickAddPrice),
      images: ["/placeholder.svg"],
      category: "apparel",
      bananaPoints: Math.round(Number.parseFloat(quickAddPrice) * 5),
      rating: 5.0,
      reviews: 0,
      variants: [
        { id: `var-new-1-${Date.now()}`, name: "S", inStock: true },
        { id: `var-new-2-${Date.now()}`, name: "M", inStock: true },
        { id: `var-new-3-${Date.now()}`, name: "L", inStock: true },
      ],
      hasNFC: true,
    }

    setProducts([...products, newProduct])
    setQuickAddName("")
    setQuickAddPrice("")
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProductImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Toggle item wearing
  const handleToggleWearing = (item: ConnectedMerchandise) => {
    if (item.isCurrentlyWorn) {
      merchandiseWearService.stopWearing(item.id)
    } else {
      merchandiseWearService.startWearing(item.id)
    }

    // Refresh merchandise list
    const items = merchandiseWearService.getConnectedMerchandise()
    setMerchandise(items)

    // Get currently worn items
    const worn = merchandiseWearService.getCurrentlyWornItems()
    setActiveItems(worn)
  }

  // Update merchandise type for cart item
  const handleUpdateMerchandiseType = (itemId: string, type: MerchandiseType) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        // Calculate new price based on type
        let priceMultiplier = 1
        if (type === "nfc") priceMultiplier = 1.2 // Update to 20%
        if (type === "nfc+nft") priceMultiplier = 1.3 // Update to 30%

        // Get base price from product
        const product = products.find((p) => p.id === item.productId)
        const basePrice = product ? product.price : item.price

        return {
          ...item,
          merchandiseType: type,
          price: basePrice * priceMultiplier,
        }
      }
      return item
    })

    setCartItems(updatedCartItems)
  }

  // Add variant to product
  const handleAddVariant = () => {
    if (editingProduct) {
      const newVariant = {
        id: `var-${Date.now()}`,
        name: "New Variant",
        inStock: true,
      }

      setEditingProduct({
        ...editingProduct,
        variants: [...(editingProduct.variants || []), newVariant],
      })
    }
  }

  // Remove variant from product
  const handleRemoveVariant = (variantId: string) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        variants: editingProduct.variants.filter((v: any) => v.id !== variantId),
      })
    }
  }

  // Update variant
  const handleUpdateVariant = (variantId: string, field: string, value: any) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        variants: editingProduct.variants.map((v: any) => (v.id === variantId ? { ...v, [field]: value } : v)),
      })
    }
  }

  // Handle selecting a variant without closing the modal
  const handleSelectVariant = (e: React.MouseEvent, variantName: string) => {
    e.stopPropagation() // Stop event propagation to prevent modal from closing
    setSelectedVariant(variantName)
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
          <div className="ml-auto flex items-center gap-1">
            <Link href="/merch/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative" onClick={() => setShowCart(true)}>
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-black text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex">
            <Image
              src="/shaka-banana-hand.png"
              alt="Prime Mates Board Club"
              width={50}
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
                        <Image
                          src="/shaka-banana-hand.png"
                          alt="Skate"
                          width={16}
                          height={16}
                          className="object-contain"
                        />
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
                              <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
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
                    >
                      <div className="relative h-40" onClick={() => setSelectedProduct(product)}>
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
                      <div className="p-3">
                        <h3 className="font-bold text-lg truncate">{product.name}</h3>
                        <p className="text-zinc-400 text-sm truncate mb-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
                            <div className="flex items-center gap-1 bg-primary/20 px-2 py-0.5 rounded-full">
                              <Image src="/shaka-banana-hand.png" alt="Shaka Points" width={12} height={12} />
                              <span className="text-xs text-primary">{product.bananaPoints}</span>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => setSelectedProduct(product)}>
                            View
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="mymerch" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">My Merchandise</h2>
              <Button size="sm" onClick={handleConnectNFC} disabled={isNfcScanning}>
                {isNfcScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Connect NFC
                  </>
                )}
              </Button>
            </div>

            {nfcError && (
              <div className="bg-red-900 rounded-lg p-4 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {nfcError}
              </div>
            )}

            {merchandise.length === 0 ? (
              <div className="bg-zinc-900 rounded-lg p-6 text-center">
                <Tag className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
                <h3 className="text-lg font-bold mb-2">No Merchandise Connected</h3>
                <p className="text-zinc-400 text-sm mb-4">Connect your Prime Mates merchandise to earn rewards</p>
                <Button onClick={handleConnectNFC} disabled={isNfcScanning}>
                  Connect NFC
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {merchandise.map((item) => (
                  <div key={item.id} className="bg-zinc-900 rounded-lg p-4 border-l-4 border-l-[#ffc72d]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded-full overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{item.productName}</h3>
                          <p className="text-zinc-500 text-sm">
                            Connected {formatDistanceToNow(new Date(item.dateConnected), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-500 text-white">NFC</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-zinc-500" />
                        <span>{formatWearTime(item.totalWearTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shirt className="h-4 w-4 text-zinc-500" />
                        <span>
                          {item.isCurrentlyWorn ? (
                            <>
                              Wearing since{" "}
                              {formatDistanceToNow(new Date(item.wearingSince || new Date()), { addSuffix: true })}
                            </>
                          ) : (
                            "Not currently worn"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-zinc-500" />
                        <span>{item.tokenRewards} Tokens</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-zinc-500" />
                        <span>Earn tokens by wearing</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => handleToggleWearing(item)}
                      disabled={item.isCurrentlyWorn && activeItems.length > 3}
                    >
                      {item.isCurrentlyWorn ? "Stop Wearing" : "Start Wearing"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.preventDefault()
              setSelectedProduct(null)
            }}
          >
            <motion.div
              className="bg-zinc-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative"
              variants={modalVariants}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <div className="relative h-60 mb-4">
                <Image
                  src={selectedProduct.images[0] || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  fill
                  className="object-contain p-4"
                />
                {selectedProduct.isLimited && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary text-black">Limited Edition</Badge>
                  </div>
                )}
                {selectedProduct.hasNFC && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-blue-500 text-white">NFC</Badge>
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
              <p className="text-zinc-400 mb-4">{selectedProduct.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-bold">${selectedProduct.price.toFixed(2)}</p>
                  <div className="flex items-center gap-1 bg-primary/20 px-2 py-0.5 rounded-full">
                    <Image src="/shaka-banana-hand.png" alt="Shaka Points" width={12} height={12} />
                    <span className="text-xs text-primary">{selectedProduct.bananaPoints}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Heart
                    className={`h-5 w-5 ${isInWishlist(selectedProduct.id) ? "text-red-500 fill-red-500" : "text-zinc-500"}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleWishlist(selectedProduct.id)
                    }}
                  />
                  <span className="text-sm text-zinc-500">
                    {selectedProduct.rating}
                    <Star className="inline-block h-4 w-4 ml-1 mb-0.5" /> ({selectedProduct.reviews})
                  </span>
                </div>
              </div>

              {/* Variant Selector */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-bold mb-2">Select Variant:</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedProduct.variants.map((variant) => (
                      <Button
                        key={variant.id}
                        variant={selectedVariant === variant.name ? "default" : "outline"}
                        size="sm"
                        disabled={!variant.inStock}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setSelectedVariant(variant.name)
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                      >
                        {variant.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Merchandise Type Selector */}
              <MerchandiseTypeSelector
                selectedType={selectedMerchandiseType}
                onSelect={setSelectedMerchandiseType}
                productHasNFC={selectedProduct?.hasNFC || false}
                productPrice={selectedProduct?.price || 0}
              />

              {/* Add to Cart Button */}
              <Button
                onClick={() => {
                  if (selectedVariant) {
                    handleAddToCart(selectedProduct, selectedVariant, selectedMerchandiseType)
                  } else if (selectedProduct.variants && selectedProduct.variants.length > 0) {
                    // Auto-select first in-stock variant if none selected
                    const firstInStockVariant = selectedProduct.variants.find((v) => v.inStock)
                    if (firstInStockVariant) {
                      handleAddToCart(selectedProduct, firstInStockVariant.name, selectedMerchandiseType)
                    }
                  }
                }}
                disabled={selectedProduct.variants && selectedProduct.variants.length > 0 && !selectedVariant}
                className="w-full bg-[#ffc72d] hover:bg-[#e6b328] text-black mt-4"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rest of the component implementation */}
      <TabBar activeTab="merch" />
    </div>
  )
}
