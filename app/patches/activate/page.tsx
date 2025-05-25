"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check, Info } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

export default function PatchActivationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedGear, setSelectedGear] = useState<string | null>(null)
  const [selectedPatch, setSelectedPatch] = useState<string | null>("patch1")

  const gearOptions = [
    { id: "jacket", name: "Snow Jacket", image: "/snow-jacket-mockup.png" },
    { id: "board", name: "Snowboard", image: "/snowboard-mockup.png" },
    { id: "helmet", name: "Helmet", image: "/helmet-mockup.png" },
    { id: "boots", name: "Boots", image: "/boots-mockup.png" },
    { id: "other", name: "Other Gear", image: "/gear-mockup.png" },
  ]

  const patches = [
    {
      id: "patch1",
      name: "PMBC Snow Patch",
      image: "/digital-threads.png",
      description: "Track snowboarding activities",
    },
    {
      id: "patch2",
      name: "PMBC Surf Patch",
      image: "/digital-threads.png",
      description: "Track surfing activities",
    },
    {
      id: "patch3",
      name: "PMBC Skate Patch",
      image: "/digital-threads.png",
      description: "Track skateboarding activities",
    },
  ]

  const selectedPatchData = patches.find((p) => p.id === selectedPatch) || patches[0]

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      // Complete the process
      router.push("/patches/success")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push("/patches")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Activate NFC Patch</h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2 z-0"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                i <= step ? "bg-primary text-black" : "bg-zinc-800 text-zinc-500"
              } ${i < step ? "ring-2 ring-primary ring-offset-2 ring-offset-black" : ""}`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Patch */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold mb-4">Select Your Patch</h2>
              <p className="text-sm text-zinc-400 mb-6">Choose the NFC patch you want to activate.</p>

              <div className="space-y-3 mb-8">
                {patches.map((patch) => (
                  <div
                    key={patch.id}
                    className={`p-4 rounded-lg flex items-center ${
                      selectedPatch === patch.id ? "bg-primary/20 border border-primary" : "bg-zinc-900"
                    }`}
                    onClick={() => setSelectedPatch(patch.id)}
                  >
                    <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                      <Image src={patch.image || "/placeholder.svg"} alt={patch.name} fill className="object-contain" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{patch.name}</h3>
                      <p className="text-xs text-zinc-400">{patch.description}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border ${
                        selectedPatch === patch.id ? "border-primary bg-primary" : "border-zinc-700 bg-transparent"
                      } flex items-center justify-center`}
                    >
                      {selectedPatch === patch.id && <Check className="h-3 w-3 text-black" />}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="w-full bg-primary text-black hover:bg-primary/90"
                onClick={handleNext}
                disabled={!selectedPatch}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Select Gear */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold mb-4">Select Your Gear</h2>
              <p className="text-sm text-zinc-400 mb-6">Choose the gear you want to apply the patch to.</p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {gearOptions.map((gear) => (
                  <div
                    key={gear.id}
                    className={`p-4 rounded-lg flex flex-col items-center ${
                      selectedGear === gear.id ? "bg-primary/20 border border-primary" : "bg-zinc-900"
                    }`}
                    onClick={() => setSelectedGear(gear.id)}
                  >
                    <div className="relative w-16 h-16 mb-2">
                      <Image src={gear.image || "/placeholder.svg"} alt={gear.name} fill className="object-contain" />
                    </div>
                    <h3 className="font-medium text-center">{gear.name}</h3>
                    <div
                      className={`w-5 h-5 rounded-full border mt-2 ${
                        selectedGear === gear.id ? "border-primary bg-primary" : "border-zinc-700 bg-transparent"
                      } flex items-center justify-center`}
                    >
                      {selectedGear === gear.id && <Check className="h-3 w-3 text-black" />}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="w-full bg-primary text-black hover:bg-primary/90"
                onClick={handleNext}
                disabled={!selectedGear}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 3: Preparation Instructions */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold mb-4">Prepare Your Gear</h2>
              <p className="text-sm text-zinc-400 mb-6">Follow these steps to prepare your gear for the NFC patch.</p>

              <div className="bg-zinc-900 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                    <Image
                      src={selectedPatchData.image || "/placeholder.svg"}
                      alt={selectedPatchData.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedPatchData.name}</h3>
                    <p className="text-xs text-zinc-400">For: {gearOptions.find((g) => g.id === selectedGear)?.name}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-sm">1</span>
                    </div>
                    <div>
                      <p className="text-sm">Clean the area where you want to apply the patch</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Make sure the surface is clean, dry, and free of dirt or oils
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-sm">2</span>
                    </div>
                    <div>
                      <p className="text-sm">Choose a flat, accessible area</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        The patch works best on flat surfaces that are easily accessible for scanning
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-sm">3</span>
                    </div>
                    <div>
                      <p className="text-sm">Preheat your iron to medium heat (no steam)</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        The patch requires heat to adhere properly to your gear
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 mb-8 flex">
                <Info className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-300">
                  The NFC patch is waterproof and designed to withstand extreme conditions. It will continue to function
                  in snow, water, and during high-impact activities.
                </p>
              </div>

              <Button className="w-full bg-primary text-black hover:bg-primary/90" onClick={handleNext}>
                I'm Ready
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 4: Application Instructions */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold mb-4">Apply Your Patch</h2>
              <p className="text-sm text-zinc-400 mb-6">Follow these steps to apply the NFC patch to your gear.</p>

              <div className="space-y-6 mb-8">
                <div className="bg-zinc-900 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Step 1: Position the Patch</h3>
                  <div className="relative h-40 mb-3 bg-zinc-800 rounded-lg overflow-hidden">
                    <Image src="/patch-positioning.png" alt="Position the patch" fill className="object-contain" />
                  </div>
                  <p className="text-sm text-zinc-400">
                    Place the patch face down on your gear in the desired location. Make sure it's positioned correctly
                    before applying heat.
                  </p>
                </div>

                <div className="bg-zinc-900 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Step 2: Apply Heat</h3>
                  <div className="relative h-40 mb-3 bg-zinc-800 rounded-lg overflow-hidden">
                    <Image src="/patch-ironing.png" alt="Apply heat with iron" fill className="object-contain" />
                  </div>
                  <p className="text-sm text-zinc-400">
                    Place a thin cloth over the patch and press with the iron for 30-45 seconds. Apply firm, even
                    pressure.
                  </p>
                </div>

                <div className="bg-zinc-900 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Step 3: Let Cool</h3>
                  <div className="relative h-40 mb-3 bg-zinc-800 rounded-lg overflow-hidden">
                    <Image src="/patch-cooling.png" alt="Let the patch cool" fill className="object-contain" />
                  </div>
                  <p className="text-sm text-zinc-400">
                    Allow the patch to cool completely before handling. This ensures proper adhesion to your gear.
                  </p>
                </div>
              </div>

              <Button className="w-full bg-primary text-black hover:bg-primary/90" onClick={handleNext}>
                Patch Applied
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 5: Activation */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold mb-4">Activate Your Patch</h2>
              <p className="text-sm text-zinc-400 mb-6">
                Now that you've applied your patch, let's activate it with your phone.
              </p>

              <div className="bg-zinc-900 rounded-lg p-6 mb-8 text-center">
                <div className="w-24 h-24 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-4 relative">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping"></div>
                  <Image
                    src="/smartphone-scan.png"
                    alt="Scan with smartphone"
                    width={48}
                    height={48}
                    className="z-10"
                  />
                </div>
                <h3 className="font-medium mb-2">Scan Your Patch</h3>
                <p className="text-sm text-zinc-400 mb-6">
                  Hold your phone near the patch you just applied to scan and activate it.
                </p>
                <div className="bg-zinc-800 rounded-lg p-3 text-left mb-4">
                  <p className="text-xs text-zinc-400">
                    <strong>Tip:</strong> Make sure NFC is enabled on your phone. The patch should be detected
                    automatically when your phone is close to it.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="animate-pulse text-blue-400 text-sm">Waiting for NFC patch...</div>
                </div>
              </div>

              <Button className="w-full bg-primary text-black hover:bg-primary/90" onClick={handleNext}>
                Simulate Successful Scan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
