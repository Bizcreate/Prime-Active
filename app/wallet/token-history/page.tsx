"use client"

import { useState } from "react"
import { ArrowLeft, ArrowDown, ArrowUp, ArrowLeftRight, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock transaction data
const TRANSACTIONS = [
  {
    id: "tx-001",
    type: "staking",
    action: "stake",
    token: "shaka",
    tokenName: "SHAKA",
    icon: "/shaka-coin.png",
    amount: 250,
    timestamp: new Date("2023-04-28T14:32:00"),
    status: "completed",
  },
  {
    id: "tx-002",
    type: "conversion",
    action: "convert",
    token: "shaka",
    tokenName: "SHAKA",
    toToken: "banana",
    toTokenName: "BANANA",
    icon: "/shaka-coin.png",
    amount: 100,
    receivedAmount: 500,
    timestamp: new Date("2023-04-27T09:15:00"),
    status: "completed",
  },
  {
    id: "tx-003",
    type: "activity",
    action: "earn",
    token: "prime",
    tokenName: "PRIME",
    icon: "/activity-token-icon.png",
    amount: 15,
    activity: "Mountain Biking Challenge",
    timestamp: new Date("2023-04-26T16:45:00"),
    status: "completed",
  },
  {
    id: "tx-004",
    type: "purchase",
    action: "spend",
    token: "banana",
    tokenName: "BANANA",
    icon: "/shaka-banana.png",
    amount: 300,
    item: "Exclusive Board Club NFT",
    timestamp: new Date("2023-04-25T11:20:00"),
    status: "completed",
  },
  {
    id: "tx-005",
    type: "reward",
    action: "earn",
    token: "shaka",
    tokenName: "SHAKA",
    icon: "/shaka-coin.png",
    amount: 50,
    source: "Daily Check-in",
    timestamp: new Date("2023-04-24T08:00:00"),
    status: "completed",
  },
  {
    id: "tx-006",
    type: "staking",
    action: "claim",
    token: "banana",
    tokenName: "BANANA",
    icon: "/shaka-banana.png",
    amount: 45,
    timestamp: new Date("2023-04-23T19:12:00"),
    status: "completed",
  },
  {
    id: "tx-007",
    type: "transfer",
    action: "send",
    token: "shaka",
    tokenName: "SHAKA",
    icon: "/shaka-coin.png",
    amount: 75,
    recipient: "SurfMonkey123",
    timestamp: new Date("2023-04-22T14:30:00"),
    status: "completed",
  },
  {
    id: "tx-008",
    type: "transfer",
    action: "receive",
    token: "prime",
    tokenName: "PRIME",
    icon: "/activity-token-icon.png",
    amount: 10,
    sender: "BananaBoarder42",
    timestamp: new Date("2023-04-21T10:45:00"),
    status: "completed",
  },
]

export default function TokenHistoryPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [filter, setFilter] = useState({
    types: ["staking", "conversion", "activity", "purchase", "reward", "transfer"],
    tokens: ["shaka", "banana", "prime"],
  })

  const getFilteredTransactions = () => {
    return TRANSACTIONS.filter((tx) => {
      // Filter by transaction type
      if (!filter.types.includes(tx.type)) return false

      // Filter by token
      if (!filter.tokens.includes(tx.token)) return false

      // Filter by tab selection
      if (activeTab === "all") return true
      if (activeTab === "earned" && (tx.action === "earn" || tx.action === "claim" || tx.action === "receive"))
        return true
      if (
        activeTab === "spent" &&
        (tx.action === "spend" || tx.action === "stake" || tx.action === "send" || tx.action === "convert")
      )
        return true

      return false
    })
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const toggleTokenFilter = (token: string) => {
    setFilter((prev) => {
      if (prev.tokens.includes(token)) {
        return { ...prev, tokens: prev.tokens.filter((t) => t !== token) }
      } else {
        return { ...prev, tokens: [...prev.tokens, token] }
      }
    })
  }

  const toggleTypeFilter = (type: string) => {
    setFilter((prev) => {
      if (prev.types.includes(type)) {
        return { ...prev, types: prev.types.filter((t) => t !== type) }
      } else {
        return { ...prev, types: [...prev.types, type] }
      }
    })
  }

  const getActionIcon = (tx: any) => {
    switch (tx.action) {
      case "earn":
      case "claim":
      case "receive":
        return <ArrowDown className="h-4 w-4 text-green-500" />
      case "spend":
      case "stake":
      case "send":
        return <ArrowUp className="h-4 w-4 text-red-500" />
      case "convert":
        return <ArrowLeftRight className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getActionColor = (tx: any) => {
    switch (tx.action) {
      case "earn":
      case "claim":
      case "receive":
        return "text-green-600"
      case "spend":
      case "stake":
      case "send":
        return "text-red-600"
      case "convert":
        return "text-blue-600"
      default:
        return ""
    }
  }

  const getTransactionDescription = (tx: any) => {
    switch (tx.type) {
      case "staking":
        if (tx.action === "stake") {
          return `Staked ${tx.tokenName}`
        } else {
          return `Claimed ${tx.tokenName} rewards`
        }
      case "conversion":
        return `Converted to ${tx.toTokenName}`
      case "activity":
        return tx.activity
      case "purchase":
        return tx.item
      case "reward":
        return tx.source
      case "transfer":
        if (tx.action === "send") {
          return `Sent to ${tx.recipient}`
        } else {
          return `Received from ${tx.sender}`
        }
      default:
        return ""
    }
  }

  return (
    <div className="container max-w-md pb-16">
      <div className="flex items-center justify-between mb-6 mt-6">
        <div className="flex items-center">
          <Button variant="ghost" className="p-0 mr-2" asChild>
            <a href="/wallet">
              <ArrowLeft className="h-6 w-6" />
            </a>
          </Button>
          <h1 className="text-2xl font-bold">Token History</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Token</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filter.tokens.includes("shaka")}
              onCheckedChange={() => toggleTokenFilter("shaka")}
            >
              SHAKA
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter.tokens.includes("banana")}
              onCheckedChange={() => toggleTokenFilter("banana")}
            >
              BANANA
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter.tokens.includes("prime")}
              onCheckedChange={() => toggleTokenFilter("prime")}
            >
              PRIME
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filter.types.includes("staking")}
              onCheckedChange={() => toggleTypeFilter("staking")}
            >
              Staking
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter.types.includes("conversion")}
              onCheckedChange={() => toggleTypeFilter("conversion")}
            >
              Conversions
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter.types.includes("activity")}
              onCheckedChange={() => toggleTypeFilter("activity")}
            >
              Activities
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter.types.includes("purchase")}
              onCheckedChange={() => toggleTypeFilter("purchase")}
            >
              Purchases
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter.types.includes("reward")}
              onCheckedChange={() => toggleTypeFilter("reward")}
            >
              Rewards
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter.types.includes("transfer")}
              onCheckedChange={() => toggleTypeFilter("transfer")}
            >
              Transfers
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="earned">Earned</TabsTrigger>
          <TabsTrigger value="spent">Spent</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {getFilteredTransactions().length > 0 ? (
          getFilteredTransactions().map((tx) => (
            <Card key={tx.id} className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <img src={tx.icon || "/placeholder.svg"} alt={tx.tokenName} className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</div>
                      <div className="text-xs text-muted-foreground">{getTransactionDescription(tx)}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold flex items-center ${getActionColor(tx)}`}>
                        {getActionIcon(tx)}
                        {tx.action === "convert" ? `${tx.amount} → ${tx.receivedAmount}` : tx.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">{formatDate(tx.timestamp)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">No transactions match your filters</div>
        )}
      </div>
    </div>
  )
}
