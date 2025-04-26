"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export interface ShippingDetails {
  name: string
  email: string
  address: string
  city: string
  zip: string
  country: string
  state?: string
  phone?: string
}

interface ShippingDetailsFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (details: ShippingDetails) => void
  productName?: string
  initialDetails?: Partial<ShippingDetails>
}

export function ShippingDetailsForm({
  isOpen,
  onClose,
  onSubmit,
  productName = "merchandise",
  initialDetails = {},
}: ShippingDetailsFormProps) {
  const [details, setDetails] = useState<ShippingDetails>({
    name: initialDetails.name || "",
    email: initialDetails.email || "",
    address: initialDetails.address || "",
    city: initialDetails.city || "",
    zip: initialDetails.zip || "",
    country: initialDetails.country || "",
    state: initialDetails.state || "",
    phone: initialDetails.phone || "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingDetails, string>>>({})

  const handleChange = (field: keyof ShippingDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }))
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingDetails, string>> = {}
    let isValid = true

    // Required fields
    const requiredFields: (keyof ShippingDetails)[] = ["name", "email", "address", "city", "zip", "country"]
    requiredFields.forEach((field) => {
      if (!details[field]) {
        newErrors[field] = "This field is required"
        isValid = false
      }
    })

    // Email validation
    if (details.email && !/^\S+@\S+\.\S+$/.test(details.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(details)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl">Shipping Information</DialogTitle>
          <DialogDescription>Enter your shipping details to receive your {productName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <Label htmlFor="name" className="text-right pt-2">
              Name
            </Label>
            <div className="col-span-3">
              <Input
                id="name"
                value={details.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <Label htmlFor="email" className="text-right pt-2">
              Email
            </Label>
            <div className="col-span-3">
              <Input
                id="email"
                type="email"
                value={details.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <Label htmlFor="address" className="text-right pt-2">
              Address
            </Label>
            <div className="col-span-3">
              <Input
                id="address"
                value={details.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <Label htmlFor="city" className="text-right pt-2">
              City
            </Label>
            <div className="col-span-3">
              <Input
                id="city"
                value={details.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <Label htmlFor="state" className="text-right pt-2">
              State
            </Label>
            <div className="col-span-3">
              <Input id="state" value={details.state} onChange={(e) => handleChange("state", e.target.value)} />
            </div>

            <Label htmlFor="zip" className="text-right pt-2">
              ZIP
            </Label>
            <div className="col-span-3">
              <Input
                id="zip"
                value={details.zip}
                onChange={(e) => handleChange("zip", e.target.value)}
                className={errors.zip ? "border-red-500" : ""}
              />
              {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
            </div>

            <Label htmlFor="country" className="text-right pt-2">
              Country
            </Label>
            <div className="col-span-3">
              <Input
                id="country"
                value={details.country}
                onChange={(e) => handleChange("country", e.target.value)}
                className={errors.country ? "border-red-500" : ""}
              />
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>

            <Label htmlFor="phone" className="text-right pt-2">
              Phone
            </Label>
            <div className="col-span-3">
              <Input
                id="phone"
                type="tel"
                value={details.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">
              Continue to Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
