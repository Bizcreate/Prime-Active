"use client"

import { Button } from "@/components/ui/button"
import { Check, Trophy, MapPin, Share2, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function PatchSuccessPage() {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <div className="p-6">
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                initial={{
                  top: "0%",
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ["#FFD700", "#FFA500", "#FF4500", "#00BFFF", "#32CD32"][
                    Math.floor(Math.random() * 5)
                  ],
                }}
                animate={{
                  top: "100%",
                  rotate: Math.random() * 360,
                  scale: [1, Math.random() * 0.5 + 0.5],
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  ease: "easeOut",
                  delay: Math.random() * 0.5,
                }}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col items-center justify-center text-center mb-8 mt-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-4"
          >
            <Check className="h-12 w-12 text-green-500" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-bold mb-2"
          >
            Patch Activated!
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-zinc-400"
          >
            Your NFC patch is now ready to track your activities
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-zinc-900 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center">
            <div className="relative w-16 h-16 mr-3 flex-shrink-0">
              <Image src="/digital-threads.png" alt="NFC Patch" fill className="object-contain" />
            </div>
            <div>
              <h3 className="font-medium">PMBC Snow Patch</h3>
              <p className="text-xs text-zinc-400">Applied to: Snow Jacket</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                <span className="text-xs text-green-500">Active</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-4 mb-8"
        >
          <h2 className="text-lg font-bold">What's Next?</h2>

          <div className="bg-zinc-900 rounded-lg p-4">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Join a Challenge</h3>
                <p className="text-sm text-zinc-400 mb-2">
                  Participate in brand-sponsored challenges to earn exclusive rewards.
                </p>
                <Link href="/challenges/brand-challenges">
                  <Button size="sm" variant="outline" className="w-full">
                    View Challenges
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-4">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Track an Activity</h3>
                <p className="text-sm text-zinc-400 mb-2">
                  Start tracking your activities with your newly activated patch.
                </p>
                <Link href="/start-activity">
                  <Button size="sm" variant="outline" className="w-full">
                    Start Activity
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-4">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                <Share2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Share with Friends</h3>
                <p className="text-sm text-zinc-400 mb-2">Let your friends know about your new NFC-enabled gear.</p>
                <Button size="sm" variant="outline" className="w-full">
                  Share
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="/dashboard">
            <Button className="w-full bg-primary text-black hover:bg-primary/90">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
