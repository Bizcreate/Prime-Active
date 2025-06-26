"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Star, ShoppingCart, Shield, Smartphone, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { TabBar } from "@/components/tab-bar"
import { MerchandiseTypeSelector } from "@/components/merchandise-type-selector"
import { useWeb3 } from "@/components/web3-provider"
import { motion, AnimatePresence } from "framer-motion"

export type MerchandiseType = "standard" | "nfc" | "nfc+nft"

export default function MerchandiseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { address } = useWeb3()
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [selectedMerchandiseType, setSelectedMerchandiseType] = useState<MerchandiseType>("nfc+nft")
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showAddedToCart, setShowAddedToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  // Handle scroll to show/hide floating button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowFloatingButton(true)
      } else {
        setShowFloatingButton(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Load product data
  useEffect(() => {
    const fetchProduct = async () => {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a network request
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock product data
      const mockProduct = {
        id: params.id,
        name: "Prime Mates Classic T-Shirt",
        description: "Classic black t-shirt with Prime Mates logo. Made from 100% organic cotton.",
        price: 35.99,
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
        details: [
          "100% organic cotton",
          "Screen printed logo",
          "Machine washable",
          "Designed in California",
          "Made in USA",
        ],
        nfcFeatures: [
          "Track wearing time",
          "Earn tokens for wearing",
          "Verify authenticity",
          "Access exclusive challenges",
          "Connect with other wearers",
        ],
        nftFeatures: [
          "Digital collectible version",
          "Proof of ownership",
          "Exclusive community access",
          "Future airdrops eligibility",
          "Resellable on NFT marketplaces",
        ],
      }

      setProduct(mockProduct)
      setIsLoading(false)
    }

    fetchProduct()
  }, [params.id])

  // Calculate product price based on merchandise type
  const getProductPrice = (basePrice: number, merchandiseType: MerchandiseType): number => {
    let price = basePrice

    if (merchandiseType === "nfc") {
      price = basePrice * 1.2 // 20% more for NFC
    } else if (merchandiseType === "nfc+nft") {
      price = basePrice * 1.3 // 30% more for NFC+NFT
    }

    return price
  }

  // Calculate product points based on merchandise type
  const getProductPoints = (basePoints: number, merchandiseType: MerchandiseType): number => {
    let points = basePoints

    if (merchandiseType === "nfc") {
      points = basePoints * 2 // 2x points for NFC
    } else if (merchandiseType === "nfc+nft") {
      points = basePoints * 3 // 3x points for NFC+NFT
    }

    return points
  }

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      // Select the first in-stock variant if none selected
      const firstInStockVariant = product.variants.find((v: any) => v.inStock)
      if (firstInStockVariant) {
        setSelectedVariant(firstInStockVariant.name)
      } else {
        return // No in-stock variants
      }
    }

    setIsAddingToCart(true)

    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Show success message
    setIsAddingToCart(false)
    setShowAddedToCart(true)

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowAddedToCart(false)
    }, 3000)

    // Navigate to cart page
    router.push("/merchandise/cart")
  }

  // Handle buy now
  const handleBuyNow = async () => {
    await handleAddToCart()
    // Navigate directly to checkout
    router.push("/merchandise/checkout")
  }

  // Toggle wishlist
  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  // Handle selecting a variant
  const handleSelectVariant = (variantName: string) => {
    console.log("Selecting variant:", variantName)
    setSelectedVariant(variantName)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-black">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Link href="/merchandise">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Product Details</h1>
          </div>

          <div className="animate-pulse">
            <div className="h-80 bg-zinc-800 rounded-lg mb-6"></div>
            <div className="h-8 bg-zinc-800 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/2 mb-6"></div>
            <div className="h-6 bg-zinc-800 rounded mb-4"></div>
            <div className="h-6 bg-zinc-800 rounded mb-4"></div>
            <div className="h-6 bg-zinc-800 rounded mb-4"></div>
            <div className="h-10 bg-zinc-800 rounded mb-2"></div>
            <div className="h-10 bg-zinc-800 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-black">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Link href="/merchandise">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Product Not Found</h1>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 text-center">
            <p className="text-zinc-400 mb-4">The product you're looking for could not be found.</p>
            <Link href="/merchandise">
              <Button>Back to Merchandise</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/merchandise">
            <Button variant="outline" size="sm" className="mr-2 flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Shop</span>
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Product Details</h1>
        </div>

        <div className="relative h-96 mb-6 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-lg overflow-hidden shadow-lg">
          <Image src={product.images[0] || "/placeholder.svg"} alt={product.name} fill className="object-contain p-4" />
          <div className="absolute top-4 left-4">
            <Badge className="bg-[#ffc72d] text-black">NFC Enabled</Badge>
          </div>
          <button
            className="absolute top-4 right-4 bg-black/50 rounded-full p-2"
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-6 w-6 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-2">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
            <span className="text-sm mr-1">{product.rating}</span>
            <span className="text-sm text-zinc-500">({product.reviews} reviews)</span>
          </div>
          <p className="text-zinc-300 mb-4">{product.description}</p>

          {/* NFC Information Box */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-lg p-4 mb-6 shadow-md border-l-4 border-[#ffc72d]">
            <h3 className="text-[#ffc72d] font-medium mb-2 flex items-center">
              <Smartphone className="h-5 w-5 mr-2" />
              NFC Enabled Merchandise
            </h3>
            <p className="text-sm text-zinc-300 mb-3">
              This item has an embedded NFC chip. Connect it to the app to earn tokens for wearing it!
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-zinc-900/50 rounded p-2">
                <p className="text-xs text-[#ffc72d] font-medium mb-1">Track Wearing Time</p>
                <p className="text-xs text-zinc-400">Earn 1 token per 10 minutes of wear time</p>
              </div>
              <div className="bg-zinc-900/50 rounded p-2">
                <p className="text-xs text-[#ffc72d] font-medium mb-1">Verify Authenticity</p>
                <p className="text-xs text-zinc-400">Prove your merchandise is genuine</p>
              </div>
            </div>
          </div>

          {/* NFT Information Box */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-lg p-4 mb-6 shadow-md border-l-4 border-purple-400">
            <h3 className="text-purple-400 font-medium mb-2 flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              NFT Digital Collectible Option
            </h3>
            <p className="text-sm text-zinc-300 mb-3">
              Upgrade to include a digital NFT collectible of your merchandise, minted when you purchase!
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-zinc-900/50 rounded p-2">
                <p className="text-xs text-purple-400 font-medium mb-1">Digital Ownership</p>
                <p className="text-xs text-zinc-400">Own a digital version of your physical item</p>
              </div>
              <div className="bg-zinc-900/50 rounded p-2">
                <p className="text-xs text-purple-400 font-medium mb-1">Exclusive Access</p>
                <p className="text-xs text-zinc-400">Unlock special features and communities</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant: any) => (
                <Button
                  key={variant.id}
                  variant={selectedVariant === variant.name ? "default" : "outline"}
                  size="sm"
                  disabled={!variant.inStock}
                  onClick={() => handleSelectVariant(variant.name)}
                  className={`${!variant.inStock ? "opacity-50" : ""} min-w-[3rem]`}
                >
                  {variant.name} {!variant.inStock && "(Out of Stock)"}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Select Merchandise Type</h3>
            <MerchandiseTypeSelector
              onSelect={setSelectedMerchandiseType}
              selectedType={selectedMerchandiseType}
              productHasNFC={product.hasNFC}
              productPrice={product.price}
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-zinc-400">Price</p>
              <p className="text-2xl font-bold">
                ${getProductPrice(product.price, selectedMerchandiseType).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#ffc72d]/20 px-3 py-1 rounded-full">
              <Image src="/shaka-banana-hand.png" alt="Shaka Points" width={16} height={16} />
              <span className="text-sm text-[#ffc72d] font-medium">
                +{getProductPoints(product.bananaPoints, selectedMerchandiseType)} points
              </span>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isAddingToCart || !product.variants.some((v: any) => v.inStock)}
            >
              {isAddingToCart ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⟳</span> Adding...
                </span>
              ) : (
                <span className="flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                </span>
              )}
            </Button>
            <Button
              className="flex-1 bg-[#ffc72d] hover:bg-[#e6b328] text-black"
              onClick={handleBuyNow}
              disabled={isAddingToCart || !product.variants.some((v: any) => v.inStock)}
            >
              Buy Now
            </Button>
          </div>

          {showAddedToCart && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-green-900/20 border border-green-900/30 rounded-lg p-3 mb-6 flex items-center"
            >
              <div className="w-6 h-6 bg-green-900/50 rounded-full flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-green-500 text-sm">Added to cart!</span>
            </motion.div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Product Details</h3>
              <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                {product.details.map((detail: string, index: number) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>

            {selectedMerchandiseType === "nfc" || selectedMerchandiseType === "nfc+nft" ? (
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Smartphone className="h-5 w-5 mr-2 text-[#ffc72d]" />
                  NFC Features
                </h3>
                <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                  {product.nfcFeatures.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {selectedMerchandiseType === "nfc+nft" ? (
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                  NFT Features
                </h3>
                <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                  {product.nftFeatures.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-lg p-4 shadow-md border-l-4 border-[#ffc72d]">
              <div className="flex items-center mb-3">
                <Shield className="h-5 w-5 text-[#ffc72d] mr-2" />
                <h3 className="text-lg font-medium">Authenticity Guarantee</h3>
              </div>
              <p className="text-sm text-zinc-400">
                All Prime Mates merchandise is guaranteed authentic. NFC-enabled items can be verified through the app
                to ensure authenticity and track ownership.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back Button */}
      <AnimatePresence>
        {showFloatingButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Link href="/merchandise">
              <Button className="bg-[#ffc72d] hover:bg-[#e6b328] text-black shadow-lg flex items-center gap-2 px-4 py-2 rounded-full">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Shop</span>
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <TabBar activeTab="merch" />
    </div>
  )
}
