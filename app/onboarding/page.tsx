"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  ChevronLeft,
  Wallet,
  SkullIcon as Skateboard,
  Snowflake,
  Waves,
  Bike,
  Footprints,
  Activity,
  MapPin,
  Heart,
  Trophy,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/web3-provider"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()
  const { isConnected, connectWallet } = useWeb3()

  // Check if connected on initial load and when connection state changes
  useEffect(() => {
    if (isConnected && step === 1) {
      // Move to next step if wallet is connected
      setTimeout(() => setStep(2), 500)
    }
  }, [isConnected, step])

  const handleConnectWallet = async () => {
    console.log("Attempting to connect wallet from onboarding page")
    setIsConnecting(true)
    try {
      const result = await connectWallet()
      console.log("Connect wallet result:", result)
      // The useEffect above will handle moving to the next step if successful
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      router.push("/setup")
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const toggleActivity = (activity: string) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== activity))
    } else {
      setSelectedActivities([...selectedActivities, activity])
    }
  }

  console.log("Onboarding page render state:", { isConnected, isConnecting, step })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 bg-black">
      <div className="w-full max-w-md mx-auto flex flex-col min-h-screen">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          {step > 1 && (
            <Button variant="ghost" size="icon" onClick={prevStep} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1 text-center">
            <span className="text-sm text-zinc-400">Step {step} of 4</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/setup")}>
            Skip
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="w-full flex justify-between mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1 rounded-full flex-1 mx-1 ${i <= step ? "bg-primary" : "bg-zinc-800"}`} />
          ))}
        </div>

        <div className="flex flex-col">
          {step === 1 && (
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl font-bold mb-2">Welcome to Prime Active</h2>
              <p className="text-zinc-400 mb-8">Let's set up your account to get started</p>

              <div className="space-y-4 mb-8">
                <Button className="w-full" onClick={nextStep}>
                  Sign Up with Email
                </Button>

                <Button
                  className="w-full bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90"
                  onClick={handleConnectWallet}
                  disabled={isConnecting || isConnected}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : isConnected ? (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Wallet Connected
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                    </>
                  )}
                </Button>
              </div>

              <p className="text-sm text-zinc-500 mb-8 text-center">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          )}

          {/* Step 2 - Activities */}
          {step === 2 && (
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl font-bold mb-2">Choose Your Favorite Activities</h2>
              <p className="text-zinc-400 mb-6">Pick your favorite activities, and we'll help you track them</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  variant={selectedActivities.includes("running") ? "default" : "outline"}
                  className="h-20 py-2 flex flex-col items-center gap-1"
                  onClick={() => toggleActivity("running")}
                >
                  <Activity className="h-6 w-6" />
                  <span>Running</span>
                </Button>

                <Button
                  variant={selectedActivities.includes("walking") ? "default" : "outline"}
                  className="h-20 py-2 flex flex-col items-center gap-1"
                  onClick={() => toggleActivity("walking")}
                >
                  <Footprints className="h-6 w-6" />
                  <span>Walking</span>
                </Button>

                <Button
                  variant={selectedActivities.includes("skateboarding") ? "default" : "outline"}
                  className="h-20 py-2 flex flex-col items-center gap-1"
                  onClick={() => toggleActivity("skateboarding")}
                >
                  <Skateboard className="h-6 w-6" />
                  <span>Skateboarding</span>
                </Button>

                <Button
                  variant={selectedActivities.includes("snowboarding") ? "default" : "outline"}
                  className="h-20 py-2 flex flex-col items-center gap-1"
                  onClick={() => toggleActivity("snowboarding")}
                >
                  <Snowflake className="h-6 w-6" />
                  <span>Snowboarding</span>
                </Button>

                <Button
                  variant={selectedActivities.includes("surfing") ? "default" : "outline"}
                  className="h-20 py-2 flex flex-col items-center gap-1"
                  onClick={() => toggleActivity("surfing")}
                >
                  <Waves className="h-6 w-6" />
                  <span>Surfing</span>
                </Button>

                <Button
                  variant={selectedActivities.includes("biking") ? "default" : "outline"}
                  className="h-20 py-2 flex flex-col items-center gap-1"
                  onClick={() => toggleActivity("biking")}
                >
                  <Bike className="h-6 w-6" />
                  <span>Biking</span>
                </Button>
              </div>

              <Button onClick={nextStep} className="mt-6">
                Continue <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Step 3 - Tracking */}
          {step === 3 && (
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl font-bold mb-2">Track Your Fitness Activity</h2>
              <p className="text-zinc-400 mb-6">We'll help you track your progress and earn rewards</p>

              <div className="bg-zinc-900 rounded-lg p-4 mb-6">
                <div className="map-container h-40 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-zinc-400">We'll track your routes and activities</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <span className="text-sm">Activity Tracking</span>
                    </div>
                    <span className="text-xs text-zinc-400">Automatic</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-sm">Location Services</span>
                    </div>
                    <span className="text-xs text-zinc-400">Required</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      <span className="text-sm">Health Data</span>
                    </div>
                    <span className="text-xs text-zinc-400">Optional</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-zinc-500 mb-8">Your data is encrypted and never shared without permission</p>

              <Button onClick={nextStep} className="mt-auto">
                Continue <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Step 4 - Rewards */}
          {step === 4 && (
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl font-bold mb-2">Earn NFTs & Rewards</h2>
              <p className="text-zinc-400 mb-6">Convert your activities into tokens and exclusive NFTs</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-900 rounded-lg p-4 text-center">
                  <div className="bg-primary/20 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Earn Tokens</h3>
                  <p className="text-xs text-zinc-400">Get $ACTIVE tokens for every activity</p>
                </div>

                <div className="bg-zinc-900 rounded-lg p-4 text-center">
                  <div className="bg-primary/20 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Collect NFTs</h3>
                  <p className="text-xs text-zinc-400">Unlock unique NFTs as you progress</p>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4 mb-8">
                <h3 className="font-medium mb-2">How It Works</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-black rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Track your activities using the app</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-black rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Earn $ACTIVE tokens based on duration and intensity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-black rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Complete challenges to unlock exclusive NFTs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-black rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <span>Trade or showcase your NFTs in the marketplace</span>
                  </li>
                </ul>
              </div>

              <Button onClick={nextStep} className="mt-auto">
                Get Started <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
