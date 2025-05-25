"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DePINNetworksManager } from "@/components/depin-networks-manager"
import { DePINDocumentation } from "@/components/depin-documentation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { BarChart2 } from "lucide-react"

export default function DePINSettingsPage() {
  const [userId, setUserId] = useState<string>("")

  useEffect(() => {
    // In a real app, you would get the user ID from your auth system
    // For now, we'll generate a random one if not already stored
    const storedUserId = localStorage.getItem("userId")
    if (storedUserId) {
      setUserId(storedUserId)
    } else {
      const newUserId = `user_${Date.now().toString(36)}`
      localStorage.setItem("userId", newUserId)
      setUserId(newUserId)
    }
  }, [])

  if (!userId) {
    return (
      <div className="container max-w-md py-8">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-md pb-16">
      <div className="flex items-center mb-6 mt-6">
        <Link href="/settings">
          <Button variant="ghost" className="p-0 mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">DePIN Networks</h1>
      </div>

      <Link href="/depin/dashboard">
        <Button variant="outline" className="w-full mb-4">
          <BarChart2 className="mr-2 h-4 w-4" />
          View Combined DePIN Dashboard
        </Button>
      </Link>

      <Tabs defaultValue="networks">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="networks">Networks</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="networks">
          <DePINNetworksManager userId={userId} />
        </TabsContent>

        <TabsContent value="docs">
          <DePINDocumentation />
        </TabsContent>
      </Tabs>
    </div>
  )
}
