"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Smartphone, Sparkles, Server, ShoppingBag, BarChart3, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { TabBar } from "@/components/tab-bar"
import { motion } from "framer-motion"

export default function NFCEcosystemPage() {
  const [activeSection, setActiveSection] = useState<string>("overview")

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/architecture">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">NFC Ecosystem</h1>
        </div>

        <div className="mb-6">
          <div className="relative w-full h-48 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg overflow-hidden mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/nfc-ecosystem-diagram.png"
                alt="NFC Ecosystem Diagram"
                width={300}
                height={200}
                className="object-contain"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h2 className="text-lg font-bold text-white">Prime Mates NFC Ecosystem</h2>
              <p className="text-sm text-zinc-300">Connecting physical merchandise to digital experiences</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            <Button
              variant={activeSection === "overview" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection("overview")}
              className="text-xs"
            >
              Overview
            </Button>
            <Button
              variant={activeSection === "components" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection("components")}
              className="text-xs"
            >
              Components
            </Button>
            <Button
              variant={activeSection === "flow" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection("flow")}
              className="text-xs"
            >
              Data Flow
            </Button>
          </div>

          {activeSection === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-4"
            >
              <div className="bg-zinc-900 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">NFC Ecosystem Overview</h3>
                <p className="text-sm text-zinc-400 mb-3">
                  The Prime Mates NFC Ecosystem connects physical merchandise with digital experiences through embedded
                  NFC chips, creating a seamless bridge between the real world and the blockchain.
                </p>
                <p className="text-sm text-zinc-400">
                  Users can earn rewards for wearing their Prime Mates gear, verify authenticity, and own digital
                  collectibles that represent their physical items.
                </p>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Key Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-blue-900/30 rounded-full p-1.5 mr-3 mt-0.5">
                      <Clock className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Wear-to-Earn</h4>
                      <p className="text-xs text-zinc-400">Earn tokens for wearing your NFC-enabled merchandise</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-900/30 rounded-full p-1.5 mr-3 mt-0.5">
                      <ShoppingBag className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Authenticity Verification</h4>
                      <p className="text-xs text-zinc-400">Verify your merchandise is genuine with a simple scan</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-purple-900/30 rounded-full p-1.5 mr-3 mt-0.5">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Digital Collectibles</h4>
                      <p className="text-xs text-zinc-400">
                        Own NFT versions of your physical merchandise with exclusive benefits
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeSection === "components" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-4"
            >
              <div className="bg-zinc-900 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Ecosystem Components</h3>
                <ul className="space-y-4">
                  <li className="border-b border-zinc-800 pb-3">
                    <div className="flex items-center mb-2">
                      <Smartphone className="h-5 w-5 text-blue-400 mr-2" />
                      <h4 className="font-medium">NFC-Enabled Merchandise</h4>
                    </div>
                    <p className="text-sm text-zinc-400">
                      Physical products with embedded NFC chips that can be scanned with a smartphone.
                    </p>
                  </li>
                  <li className="border-b border-zinc-800 pb-3">
                    <div className="flex items-center mb-2">
                      <Server className="h-5 w-5 text-green-400 mr-2" />
                      <h4 className="font-medium">Blockchain Integration</h4>
                    </div>
                    <p className="text-sm text-zinc-400">
                      Secure storage of ownership records and minting of NFTs for digital collectibles.
                    </p>
                  </li>
                  <li className="border-b border-zinc-800 pb-3">
                    <div className="flex items-center mb-2">
                      <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
                      <h4 className="font-medium">NFT Marketplace</h4>
                    </div>
                    <p className="text-sm text-zinc-400">
                      Platform for viewing, trading, and showcasing digital collectibles tied to physical merchandise.
                    </p>
                  </li>
                  <li>
                    <div className="flex items-center mb-2">
                      <BarChart3 className="h-5 w-5 text-orange-400 mr-2" />
                      <h4 className="font-medium">Analytics Dashboard</h4>
                    </div>
                    <p className="text-sm text-zinc-400">
                      Tools for brands to track engagement, rewards, and customer behavior with NFC merchandise.
                    </p>
                  </li>
                </ul>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Implementation Status</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-green-900/30 flex items-center justify-center mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">NFC-Enabled Merchandise</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-green-900/30 flex items-center justify-center mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">NFT Integration</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-yellow-900/30 flex items-center justify-center mr-2">
                      <span className="text-[10px] text-yellow-500 font-medium">Soon</span>
                    </div>
                    <span className="text-sm">Patch Activation Flow</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-yellow-900/30 flex items-center justify-center mr-2">
                      <span className="text-[10px] text-yellow-500 font-medium">Soon</span>
                    </div>
                    <span className="text-sm">Brand Dashboard</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-yellow-900/30 flex items-center justify-center mr-2">
                      <span className="text-[10px] text-yellow-500 font-medium">Soon</span>
                    </div>
                    <span className="text-sm">Patch Marketplace</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeSection === "flow" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-4"
            >
              <div className="bg-zinc-900 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Data Flow</h3>
                <ol className="space-y-4">
                  <li className="flex">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs text-blue-400 font-medium">1</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Purchase</h4>
                      <p className="text-xs text-zinc-400">
                        User purchases NFC-enabled merchandise (with optional NFT) from the Prime Mates store.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs text-blue-400 font-medium">2</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Registration</h4>
                      <p className="text-xs text-zinc-400">
                        User scans the NFC tag with their phone to register the item to their account.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs text-blue-400 font-medium">3</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">NFT Minting</h4>
                      <p className="text-xs text-zinc-400">
                        If NFT option was selected, a digital collectible is minted on the blockchain to represent
                        ownership.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs text-blue-400 font-medium">4</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Wear Tracking</h4>
                      <p className="text-xs text-zinc-400">
                        User wears the item during activities and activates tracking in the app.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs text-blue-400 font-medium">5</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Reward Distribution</h4>
                      <p className="text-xs text-zinc-400">
                        App records activity data and awards tokens based on wear time (1 token per 10 minutes).
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs text-blue-400 font-medium">6</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Challenge Verification</h4>
                      <p className="text-xs text-zinc-400">
                        Data is used to verify challenge completion and earn additional rewards.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </motion.div>
          )}
        </div>

        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium mb-3">Coming Soon</h3>
          <div className="space-y-3">
            <div className="bg-zinc-800 p-3 rounded-lg opacity-70">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-900/30 rounded-full flex items-center justify-center mr-3">
                  <Smartphone className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h4 className="font-medium">Patch Activation Flow</h4>
                  <p className="text-xs text-zinc-400">Activate NFC patches on your existing gear</p>
                </div>
              </div>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg opacity-70">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-900/30 rounded-full flex items-center justify-center mr-3">
                  <BarChart3 className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h4 className="font-medium">Brand Dashboard</h4>
                  <p className="text-xs text-zinc-400">Analytics and management for partner brands</p>
                </div>
              </div>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg opacity-70">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-900/30 rounded-full flex items-center justify-center mr-3">
                  <ShoppingBag className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h4 className="font-medium">Patch Marketplace</h4>
                  <p className="text-xs text-zinc-400">Browse and purchase NFC patches for your gear</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TabBar activeTab="none" />
    </div>
  )
}
