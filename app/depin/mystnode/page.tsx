"use client"

import { MystNodeDashboard } from "@/components/myst-node-dashboard"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MystNodePage() {
  return (
    <div className="container max-w-md">
      <div className="py-4">
        <Link href="/settings/depin">
          <Button variant="ghost" className="p-0">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      <MystNodeDashboard />
    </div>
  )
}
