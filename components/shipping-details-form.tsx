"\"use client"

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

export interface ShippingAddress {
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
  onSubmit: (address: ShippingAddress) => void
  productName?: string
  initialDetails?: Partial<ShippingAddress>
}

export function ShippingAddressForm({
  isOpen,
  onClose,
  onSubmit,
  productName = "merchandise",
  initialDetails = {},
}: ShippingDetailsFormProps) {
  const [details, setDetails] = useState<ShippingAddress>({
    name: initialDetails.name || "",
    email: initialDetails.email || "",
    address: initialDetails.address || "",
    city: initialDetails.city || "",
    zip: initialDetails.zip || "",
    country: initialDetails.country || "",
    state: initialDetails.state || "",
    phone: initialDetails.phone || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(details)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl">Shipping Information</DialogTitle>
          <DialogDescription>Enter your shipping details to receive your {productName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              required
              value={details.name}
              onChange={handleChange}
              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
            />
          </div>

          <div>
            <Label htmlFor="address">Street Address</Label>
            <Input
              type="text"
              id="address"
              name="address"
              required
              value={details.address}
              onChange={handleChange}
              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                type="text"
                id="city"
                name="city"
                required
                value={details.city}
                onChange={handleChange}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
              />
            </div>
            <div>
              <Label htmlFor="state">State/Province</Label>
              <Input
                type="text"
                id="state"
                name="state"
                required
                value={details.state}
                onChange={handleChange}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zip">ZIP/Postal Code</Label>
              <Input
                type="text"
                id="zip"
                name="zip"
                required
                value={details.zip}
                onChange={handleChange}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                name="country"
                required
                value={details.country}
                onChange={handleChange}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone Number (optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={details.phone || ""}
              onChange={handleChange}
              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email (optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={details.email || ""}
              onChange={handleChange}
              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
            />
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

export type ShippingDetails = ShippingAddress
