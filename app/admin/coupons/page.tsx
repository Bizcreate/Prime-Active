"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { couponService, type Coupon } from "@/services/coupon-service"
import { ArrowLeft, Plus, TicketIcon, RefreshCw } from "lucide-react"
import Link from "next/link"
import { TabBar } from "@/components/tab-bar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CouponAdminPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: "",
    type: "percentage",
    value: 10,
    description: "",
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    // Load coupons when component mounts
    setCoupons(couponService.getCoupons())
  }, [])

  const handleAddCoupon = () => {
    if (!newCoupon.code || !newCoupon.description) {
      setFormError("Please fill out all required fields")
      return
    }

    if (newCoupon.type === "free") {
      newCoupon.value = 100 // For free coupons, value is 100%
    }

    const success = couponService.addCoupon(newCoupon as Omit<Coupon, "usageCount">)

    if (success) {
      setSuccessMessage(`Coupon "${newCoupon.code}" added successfully`)
      setNewCoupon({
        code: "",
        type: "percentage",
        value: 10,
        description: "",
      })
      setCoupons(couponService.getCoupons())
    } else {
      setFormError(`Coupon with code "${newCoupon.code}" already exists`)
    }

    // Clear messages after 3 seconds
    setTimeout(() => {
      setFormError(null)
      setSuccessMessage(null)
    }, 3000)
  }

  const handleResetCouponUsage = (code: string) => {
    couponService.resetCouponUsage(code)
    setCoupons(couponService.getCoupons())
    setSuccessMessage(`Usage count for "${code}" has been reset`)

    // Clear message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  const formatCouponValue = (coupon: Coupon) => {
    switch (coupon.type) {
      case "percentage":
        return `${coupon.value}% off`
      case "fixed":
        return `$${coupon.value.toFixed(2)} off`
      case "free":
        return "100% off (FREE)"
      default:
        return `${coupon.value}`
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="sticky top-0 z-10 bg-black p-4 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Coupon Management</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Notification messages */}
        {formError && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 text-sm text-red-200">{formError}</div>
        )}

        {successMessage && (
          <div className="bg-green-900/30 border border-green-500 rounded-lg p-3 text-sm text-green-200">
            {successMessage}
          </div>
        )}

        {/* Add New Coupon */}
        <div className="bg-zinc-900 rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">Add New Coupon</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="coupon-code">Coupon Code</Label>
              <Input
                id="coupon-code"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                placeholder="FREE"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div>
              <Label htmlFor="coupon-type">Coupon Type</Label>
              <Select
                value={newCoupon.type}
                onValueChange={(value: "percentage" | "fixed" | "free") => setNewCoupon({ ...newCoupon, type: value })}
              >
                <SelectTrigger id="coupon-type" className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage Discount</SelectItem>
                  <SelectItem value="fixed">Fixed Amount Discount</SelectItem>
                  <SelectItem value="free">Free Order (100% off)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newCoupon.type !== "free" && (
              <div>
                <Label htmlFor="coupon-value">
                  {newCoupon.type === "percentage" ? "Discount Percentage" : "Discount Amount ($)"}
                </Label>
                <Input
                  id="coupon-value"
                  type="number"
                  value={newCoupon.value}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      value: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder={newCoupon.type === "percentage" ? "10" : "5.00"}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            )}

            <div>
              <Label htmlFor="coupon-description">Description</Label>
              <Input
                id="coupon-description"
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                placeholder="10% off your order"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <Button onClick={handleAddCoupon} className="w-full bg-[#ffc72d] hover:bg-[#e6b328] text-black">
              <Plus className="mr-2 h-4 w-4" />
              Add Coupon
            </Button>
          </div>
        </div>

        {/* Existing Coupons */}
        <div className="bg-zinc-900 rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">Existing Coupons</h2>

          {coupons.length === 0 ? (
            <div className="text-center py-6 text-zinc-500">
              <TicketIcon className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>No coupons found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <div key={coupon.code} className="bg-zinc-800 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{coupon.code}</h3>
                      <p className="text-sm text-zinc-400">{coupon.description}</p>
                    </div>
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleResetCouponUsage(coupon.code)}
                        title="Reset usage count"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-zinc-500 mr-2">Type:</span>
                      <span className="capitalize">{coupon.type}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-zinc-500 mr-2">Value:</span>
                      <span>{formatCouponValue(coupon)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-zinc-500 mr-2">Min Purchase:</span>
                      <span>{coupon.minPurchase ? `$${coupon.minPurchase.toFixed(2)}` : "None"}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-zinc-500 mr-2">Usage:</span>
                      <span>{coupon.usageCount} times</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
