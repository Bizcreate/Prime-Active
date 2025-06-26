"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Filter, Calendar, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default function TokenHistoryPage() {
  const [filter, setFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockTransactions = [
        {
          id: "tx1",
          type: "earn",
          amount: 150,
          tokenType: "shaka",
          description: "Earned from wearing Prime Mates T-Shirt",
          timestamp: new Date(2023, 9, 15, 14, 30),
          category: "wear",
        },
        {
          id: "tx2",
          type: "earn",
          amount: 200,
          tokenType: "shaka",
          description: "Completed Dawn Patrol Surf challenge",
          timestamp: new Date(2023, 9, 14, 8, 45),
          category: "challenge",
        },
        {
          id: "tx3",
          type: "spend",
          amount: 300,
          tokenType: "shaka",
          description: "Redeemed for merchandise discount",
          timestamp: new Date(2023, 9, 12, 16, 20),
          category: "redeem",
        },
        {
          id: "tx4",
          type: "earn",
          amount: 50,
          tokenType: "shaka",
          description: "Daily login bonus",
          timestamp: new Date(2023, 9, 12, 9, 0),
          category: "bonus",
        },
        {
          id: "tx5",
          type: "earn",
          amount: 75,
          tokenType: "banana",
          description: "Referred a friend",
          timestamp: new Date(2023, 9, 10, 13, 15),
          category: "referral",
        },
        {
          id: "tx6",
          type: "convert",
          amount: 100,
          tokenType: "shaka",
          description: "Converted from 200 Banana Points",
          timestamp: new Date(2023, 9, 8, 11, 30),
          category: "convert",
        },
        {
          id: "tx7",
          type: "spend",
          amount: 150,
          tokenType: "shaka",
          description: "Purchased exclusive NFT",
          timestamp: new Date(2023, 9, 5, 19, 45),
          category: "purchase",
        },
      ]

      setTransactions(mockTransactions)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter transactions based on selected filter
  const filteredTransactions =
    filter === "all"
      ? transactions
      : filter === "earn"
        ? transactions.filter((tx) => tx.type === "earn")
        : filter === "spend"
          ? transactions.filter((tx) => tx.type === "spend")
          : transactions.filter((tx) => tx.category === filter)

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/wallet">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Token History</h1>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="rounded-full"
          >
            All
          </Button>
          <Button
            variant={filter === "earn" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("earn")}
            className="rounded-full"
          >
            Earned
          </Button>
          <Button
            variant={filter === "spend" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("spend")}
            className="rounded-full"
          >
            Spent
          </Button>
          <Button
            variant={filter === "wear" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("wear")}
            className="rounded-full"
          >
            Wear
          </Button>
          <Button
            variant={filter === "challenge" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("challenge")}
            className="rounded-full"
          >
            Challenges
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-400">Loading transaction history...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-zinc-900 rounded-lg p-6 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
            <h3 className="text-lg font-bold mb-2">No Transactions</h3>
            <p className="text-zinc-400 text-sm mb-4">There are no transactions matching your filters</p>
            <Button onClick={() => setFilter("all")}>Show All Transactions</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="bg-zinc-900 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      tx.type === "earn"
                        ? "bg-green-900/30 text-green-500"
                        : tx.type === "spend"
                          ? "bg-red-900/30 text-red-500"
                          : "bg-blue-900/30 text-blue-500"
                    }`}
                  >
                    {tx.type === "earn" ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : tx.type === "spend" ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{tx.description}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-zinc-500" />
                          <span className="text-xs text-zinc-500">{format(tx.timestamp, "MMM d, yyyy • h:mm a")}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`font-bold ${
                            tx.type === "earn"
                              ? "text-green-500"
                              : tx.type === "spend"
                                ? "text-red-500"
                                : "text-blue-500"
                          }`}
                        >
                          {tx.type === "earn" ? "+" : "-"}
                          {tx.amount}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <Image
                            src={tx.tokenType === "shaka" ? "/shaka-coin.png" : "/banana-icon.png"}
                            alt={tx.tokenType}
                            width={12}
                            height={12}
                          />
                          <span className="text-xs text-zinc-500">
                            {tx.tokenType === "shaka" ? "SHAKA" : "Banana Points"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          tx.category === "wear"
                            ? "border-blue-500 text-blue-500"
                            : tx.category === "challenge"
                              ? "border-purple-500 text-purple-500"
                              : tx.category === "redeem"
                                ? "border-amber-500 text-amber-500"
                                : tx.category === "bonus"
                                  ? "border-green-500 text-green-500"
                                  : tx.category === "referral"
                                    ? "border-pink-500 text-pink-500"
                                    : "border-blue-500 text-blue-500"
                        }`}
                      >
                        {tx.category.charAt(0).toUpperCase() + tx.category.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TabBar activeTab="wallet" />
    </div>
  )
}
