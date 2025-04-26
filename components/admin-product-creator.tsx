"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, Plus, Trash2, Save, X, Upload, Tag, Smartphone } from "lucide-react"
import Image from "next/image"

interface Variant {
  id: string
  name: string
  inStock: boolean
}

interface ProductData {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  bananaPoints: number
  rating: number
  reviews: number
  variants: Variant[]
  hasNFC: boolean
  isLimited: boolean
  featured: boolean
}

interface AdminProductCreatorProps {
  initialProduct?: ProductData
  onSave: (product: ProductData) => void
  onCancel: () => void
}

export function AdminProductCreator({ initialProduct, onSave, onCancel }: AdminProductCreatorProps) {
  const defaultProduct: ProductData = {
    id: `product-${Date.now()}`,
    name: "",
    description: "",
    price: 29.99,
    images: ["/placeholder.svg"],
    category: "apparel",
    bananaPoints: 200,
    rating: 5.0,
    reviews: 0,
    variants: [
      { id: `var-${Date.now()}-1`, name: "S", inStock: true },
      { id: `var-${Date.now()}-2`, name: "M", inStock: true },
      { id: `var-${Date.now()}-3`, name: "L", inStock: true },
    ],
    hasNFC: true,
    isLimited: false,
    featured: false,
  }

  const [product, setProduct] = useState<ProductData>(initialProduct || defaultProduct)
  const [productImage, setProductImage] = useState<string | null>(initialProduct?.images[0] || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageUrl = event.target.result as string
          setProductImage(imageUrl)
          setProduct({
            ...product,
            images: [imageUrl],
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Add variant
  const handleAddVariant = () => {
    const newVariant = {
      id: `var-${Date.now()}`,
      name: "New Variant",
      inStock: true,
    }

    setProduct({
      ...product,
      variants: [...product.variants, newVariant],
    })
  }

  // Remove variant
  const handleRemoveVariant = (variantId: string) => {
    setProduct({
      ...product,
      variants: product.variants.filter((v) => v.id !== variantId),
    })
  }

  // Update variant
  const handleUpdateVariant = (variantId: string, field: string, value: any) => {
    setProduct({
      ...product,
      variants: product.variants.map((v) => (v.id === variantId ? { ...v, [field]: value } : v)),
    })
  }

  // Handle save
  const handleSave = () => {
    // Ensure we have an image
    const finalProduct = {
      ...product,
      images: [productImage || "/placeholder.svg"],
    }
    onSave(finalProduct)
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-lg p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Tag className="mr-2 h-5 w-5 text-[#ffc72d]" />
          {initialProduct ? "Edit Product" : "Create New Product"}
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-5">
        {/* Product Image */}
        <div className="relative h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg flex items-center justify-center overflow-hidden">
          {productImage ? (
            <Image src={productImage || "/placeholder.svg"} alt="Product" fill className="object-contain p-4" />
          ) : (
            <div className="text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 text-zinc-600" />
              <p className="text-sm text-zinc-500">No image selected</p>
            </div>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-2 right-2 bg-[#ffc72d] text-black hover:bg-[#e6b328]"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-1" /> Upload Image
          </Button>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="product-name" className="text-zinc-300">
              Product Name
            </Label>
            <Input
              id="product-name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              placeholder="Enter product name"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div>
            <Label htmlFor="product-description" className="text-zinc-300">
              Description
            </Label>
            <Textarea
              id="product-description"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              placeholder="Enter product description"
              rows={3}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product-price" className="text-zinc-300">
                Price ($)
              </Label>
              <Input
                id="product-price"
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: Number.parseFloat(e.target.value) })}
                placeholder="29.99"
                step="0.01"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div>
              <Label htmlFor="product-points" className="text-zinc-300">
                Banana Points
              </Label>
              <Input
                id="product-points"
                type="number"
                value={product.bananaPoints}
                onChange={(e) => setProduct({ ...product, bananaPoints: Number.parseInt(e.target.value) })}
                placeholder="200"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="product-category" className="text-zinc-300">
              Category
            </Label>
            <Select value={product.category} onValueChange={(value) => setProduct({ ...product, category: value })}>
              <SelectTrigger id="product-category" className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="apparel">Apparel</SelectItem>
                <SelectItem value="skate">Skate</SelectItem>
                <SelectItem value="surf">Surf</SelectItem>
                <SelectItem value="snow">Snow</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="has-nfc"
                checked={product.hasNFC}
                onCheckedChange={(checked) => setProduct({ ...product, hasNFC: checked })}
              />
              <Label htmlFor="has-nfc" className="flex items-center text-zinc-300">
                <Smartphone className="h-3.5 w-3.5 mr-1 text-[#ffc72d]" />
                NFC
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is-limited"
                checked={product.isLimited}
                onCheckedChange={(checked) => setProduct({ ...product, isLimited: checked })}
              />
              <Label htmlFor="is-limited" className="text-zinc-300">
                Limited
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is-featured"
                checked={product.featured}
                onCheckedChange={(checked) => setProduct({ ...product, featured: checked })}
              />
              <Label htmlFor="is-featured" className="text-zinc-300">
                Featured
              </Label>
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-zinc-300">Variants</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddVariant}
                className="border-[#ffc72d] text-[#ffc72d]"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Variant
              </Button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {product.variants.map((variant) => (
                <div key={variant.id} className="flex items-center gap-2 bg-zinc-800 p-2 rounded">
                  <Input
                    value={variant.name}
                    onChange={(e) => handleUpdateVariant(variant.id, "name", e.target.value)}
                    className="flex-1 h-8 text-sm bg-zinc-700 border-zinc-600"
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`in-stock-${variant.id}`}
                      checked={variant.inStock}
                      onCheckedChange={(checked) => handleUpdateVariant(variant.id, "inStock", checked)}
                      className="h-4 w-7"
                    />
                    <Label htmlFor={`in-stock-${variant.id}`} className="text-xs text-zinc-300">
                      In Stock
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500"
                    onClick={() => handleRemoveVariant(variant.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#ffc72d] hover:bg-[#e6b328] text-black"
            onClick={handleSave}
            disabled={!product.name || !product.description}
          >
            <Save className="h-4 w-4 mr-1" />
            {initialProduct ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </div>
    </div>
  )
}
