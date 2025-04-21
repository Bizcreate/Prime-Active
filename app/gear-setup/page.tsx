"use client"

import { Button } from "@/components/ui/button"
import { GearCard } from "@/components/gear-card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Scan, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

export default function GearSetupPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Gear Setup</h1>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Your Boards</h2>
            <Button size="sm" variant="ghost" className="flex items-center gap-1">
              <Scan className="h-4 w-4" />
              Scan NFC
            </Button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <GearCard name="Daily Cruiser" type="skate" brand="Boosted" model="Mini X" active />
              <div className="absolute top-3 right-3 flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-zinc-800">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-zinc-800 text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <GearCard name="Powder Day" type="snow" brand="Burton" model="Custom X" />
              <div className="absolute top-3 right-3 flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-zinc-800">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-zinc-800 text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <GearCard name="Beach Rider" type="surf" brand="Channel Islands" model="Fever" />
              <div className="absolute top-3 right-3 flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-zinc-800">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-zinc-800 text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4 border-dashed flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Board
          </Button>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Add New Board</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Board Name</label>
              <Input placeholder="e.g. City Cruiser" className="bg-zinc-900 border-zinc-800" />
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Board Type</label>
              <select className="w-full h-10 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
                <option value="skate">Skateboard</option>
                <option value="snow">Snowboard</option>
                <option value="surf">Surfboard</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Brand</label>
              <Input placeholder="e.g. Boosted" className="bg-zinc-900 border-zinc-800" />
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Model</label>
              <Input placeholder="e.g. Mini X" className="bg-zinc-900 border-zinc-800" />
            </div>

            <div className="pt-2">
              <Button className="w-full">Save Board</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
