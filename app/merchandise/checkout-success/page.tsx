"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"
import { TabBar } from "@/components/tab-bar"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState("")

  useEffect(() => {
    // Generate a random order number
    const randomOrderNumber = Math.floor(10000000 + Math.random() * 90000000).toString()
    setOrderNumber(randomOrderNumber)

    // Redirect to dashboard after 10 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 10000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen flex-col bg-black text-white pb-20">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle className="h-12 w-12 text-green-500" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold mb-2"
        >
          Order Confirmed!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-zinc-400 mb-6"
        >
          Thank you for your purchase. Your order has been received.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-zinc-900 rounded-lg p-6 mb-8 w-full max-w-md"
        >
          <h2 className="font-bold text-lg mb-4">Order Details</h2>
          <div className="flex justify-between mb-2">
            <span className="text-zinc-400">Order Number:</span>
            <span>{orderNumber}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-zinc-400">Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Status:</span>
            <span className="text-green-500">Confirmed</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <Link href="/merchandise">
            <Button className="w-full flex items-center justify-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
