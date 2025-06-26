"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface DePINTokensProps {
  userId?: string
}

export function DePINTokens({ userId = "default-user" }: DePINTokensProps) {
  const [tokens, setTokens] = useState([
    {
      id: "iotx",
      name: "IoTeX",
      symbol: "IOTX",
      balance: 128.45,
      logo: "/iotex-logo.png",
      isActive: true,
    },
    {
      id: "mobile",
      name: "Helium Mobile",
      symbol: "MOBILE",
      balance: 0,
      logo: "/helium-mobile-logo.png",
      isActive: false,
    },
    {
      id: "foam",
      name: "FOAM Protocol",
      symbol: "FOAM",
      balance: 45.2,
      logo: "/foam-protocol-logo.png",
      isActive: true,
    },
  ])

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">DePIN Tokens</h3>

        <div className="space-y-3">
          {tokens.map((token) => (
            <div key={token.id} className="flex items-center justify-between p-2 bg-zinc-800 rounded-md">
              <div className="flex items-center gap-2">
                <Image
                  src={token.logo || "/placeholder.svg"}
                  alt={token.name}
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <div>
                  <p className="font-medium text-sm">{token.name}</p>
                  <p className="text-xs text-zinc-400">{token.symbol}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium">{token.balance.toFixed(2)}</p>
                <Badge
                  variant="outline"
                  className={
                    token.isActive
                      ? "bg-green-900/20 text-green-400 border-green-800 text-xs"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 text-xs"
                  }
                >
                  {token.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Button variant="outline" size="sm" className="w-full">
            Manage DePIN Networks
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
