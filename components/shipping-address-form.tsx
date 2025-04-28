"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { shippingService, type ShippingAddress } from "@/services/shipping-service"

interface ShippingAddressFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (address: ShippingAddress) => void
  initialAddress?: ShippingAddress
}

export function ShippingAddressForm({ isOpen, onClose, onSubmit, initialAddress }: ShippingAddressFormProps) {
  const [address, setAddress] = useState<ShippingAddress>({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    phone: "",
    email: "",
  })

  // Load initial address if provided
  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress)
    }
  }, [initialAddress])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save address to service
    shippingService.saveAddress(address)
    // Call onSubmit callback
    onSubmit(address)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold">Shipping Address</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={address.name}
              onChange={handleChange}
              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Street Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              value={address.address}
              onChange={handleChange}
              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={address.city}
                onChange={handleChange}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-1">
                State/Province
              </label>
              <input
                type="text"
                id="state"
                name="state"
                required
                value={address.state}
                onChange={handleChange}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="zip" className="block text-sm font-medium mb-1">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                required
                value={address.zip}
                onChange={handleChange}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">
                Country
              </label>
              <select
                id="country"
                name="country"
                required
                value={address.country}
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
              value={address.phone || ""}
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
              value={address.email || ""}
              onChange={handleChange}
              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Address
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
