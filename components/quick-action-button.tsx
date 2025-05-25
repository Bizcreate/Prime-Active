"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface QuickActionButtonProps {
  position?: "bottom-right" | "top-right"
  size?: "sm" | "md" | "lg"
}

export function QuickActionButton({ position = "bottom-right", size = "md" }: QuickActionButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const buttonSizes = {
    sm: "h-10 w-10",
    md: "h-14 w-14",
    lg: "h-16 w-16",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-7 w-7",
  }

  const positions = {
    "bottom-right": "bottom-24 right-6",
    "top-right": "top-20 right-6",
  }

  const startActivity = (type: string) => {
    setIsOpen(false)
    router.push(`/start-activity?type=${type}`)
  }

  return (
    <>
      <div className={`fixed ${positions[position]} z-50`}>
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          className={`bg-primary text-black ${buttonSizes[size]} rounded-full flex items-center justify-center shadow-lg`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className={iconSizes[size]} /> : <Play className={iconSizes[size]} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed ${position === "bottom-right" ? "bottom-40" : "top-36"} right-6 z-50 bg-zinc-900 rounded-lg shadow-xl p-3 border border-zinc-800 w-48`}
          >
            <h3 className="text-sm font-medium mb-2 px-2">Start Activity</h3>
            <div className="space-y-1">
              {["walking", "running", "cycling", "skateboarding", "surfing", "snowboarding"].map((activity) => (
                <button
                  key={activity}
                  className="w-full text-left px-2 py-2 text-sm rounded-md hover:bg-zinc-800 flex items-center gap-2"
                  onClick={() => startActivity(activity)}
                >
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="capitalize">{activity}</span>
                </button>
              ))}
              <button
                className="w-full text-left px-2 py-2 text-sm rounded-md hover:bg-zinc-800 flex items-center gap-2 mt-2 border-t border-zinc-800 pt-2"
                onClick={() => {
                  setIsOpen(false)
                  router.push("/merch/wear-to-earn")
                }}
              >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Wear to Earn</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
