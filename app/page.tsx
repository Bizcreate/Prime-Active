"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SplashScreen } from "@/components/splash-screen"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  // Check if this is the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited")
    if (hasVisited) {
      setShowSplash(false)
    } else {
      localStorage.setItem("hasVisited", "true")
    }
  }, [])

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-black">
        <div className="w-full max-w-md mx-auto flex flex-col min-h-screen">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="mb-8">
              <Image
                src="/prime-mates-logo.png"
                alt="Prime Mates Board Club"
                width={300}
                height={150}
                className="object-contain"
              />
            </div>

            <h1 className="text-3xl font-bold mt-4 mb-2 text-center">Move, Shred, Earn</h1>
            <p className="text-zinc-400 mb-8 text-center">
              Track your activities, earn rewards, and join the Prime Mates community
            </p>

            <div className="w-full space-y-4 mt-4">
              <Link href="/onboarding">
                <Button className="w-full">Get Started</Button>
              </Link>

              <Link href="/login">
                <Button variant="outline" className="w-full">
                  I Already Have an Account
                </Button>
              </Link>
            </div>

            <div className="mt-12 space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Track Any Activity</h2>
                <p className="text-zinc-400 text-sm">Walking, running, skateboarding, surfing, biking and more</p>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Earn While Moving</h2>
                <p className="text-zinc-400 text-sm">Convert your activities into tokens and exclusive NFTs</p>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Join the Board Club</h2>
                <p className="text-zinc-400 text-sm">Connect with other board enthusiasts and compete in challenges</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
