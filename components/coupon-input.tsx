"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TicketIcon, ChevronDown, ChevronUp, Check, X } from "lucide-react"
import { couponService } from "@/services/coupon-service"

interface CouponInputProps {
  subtotal: number
  onApplyCoupon: (code: string, discount: number) => void
  onRemoveCoupon: () => void
  productIds?: string[]
  appliedCoupon?: string
  couponDiscount?: number
}

export function CouponInput({
  subtotal,
  onApplyCoupon,
  onRemoveCoupon,
  productIds = [],
  appliedCoupon,
  couponDiscount = 0,
}: CouponInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code")
      return
    }

    const result = couponService.validateCoupon(couponCode, subtotal, productIds)

    if (!result.valid) {
      setError(result.message || "Invalid coupon")
      setSuccess(null)
      return
    }

    // Apply coupon
    onApplyCoupon(couponCode, result.discount || 0)
    setSuccess(result.message || "Coupon applied successfully!")
    setError(null)
    setCouponCode("")
  }

  const handleRemoveCoupon = () => {
    onRemoveCoupon()
    setSuccess(null)
    setError(null)
  }

  return (
    <div className="bg-zinc-800 border-l-4 border-l-[#ffc72d] p-4 mb-6 rounded-lg">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center">
          <TicketIcon className="h-5 w-5 mr-2 text-[#ffc72d]" />
          <h3 className="font-medium text-sm">Coupon Code</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-xs hover:text-[#ffc72d]">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {appliedCoupon ? (
            <div className="bg-zinc-700 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">{appliedCoupon}</p>
                    <p className="text-xs text-zinc-400">Discount: ${couponDiscount.toFixed(2)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveCoupon}
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-zinc-700 border-zinc-600"
                />
                <Button onClick={handleApplyCoupon} className="bg-[#ffc72d] text-black hover:bg-[#e6b328]">
                  Apply
                </Button>
              </div>

              {error && (
                <div className="text-red-500 text-sm flex items-center gap-1">
                  <X className="h-4 w-4" />
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-500 text-sm flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  {success}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
