"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { PermissionRequest } from "@/components/permission-request"
import { NFTVerification } from "@/components/nft-verification"
import Link from "next/link"
import { useRouter } from "next/navigation"

enum SetupStep {
  Permissions = 0,
  NFTVerification = 1,
  Complete = 2,
}

export default function SetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<SetupStep>(SetupStep.Permissions)

  const handlePermissionsGranted = () => {
    setCurrentStep(SetupStep.NFTVerification)
  }

  const handleVerificationComplete = () => {
    setCurrentStep(SetupStep.Complete)
  }

  const handleSkipVerification = () => {
    setCurrentStep(SetupStep.Complete)
  }

  const handleComplete = () => {
    router.push("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Setup Prime Active</h1>
        </div>

        {/* Progress indicator */}
        <div className="w-full flex justify-between mb-8">
          {[SetupStep.Permissions, SetupStep.NFTVerification, SetupStep.Complete].map((step) => (
            <div
              key={step}
              className={`h-1 rounded-full flex-1 mx-1 ${step <= currentStep ? "bg-primary" : "bg-zinc-800"}`}
            />
          ))}
        </div>

        {currentStep === SetupStep.Permissions && <PermissionRequest onPermissionGranted={handlePermissionsGranted} />}

        {currentStep === SetupStep.NFTVerification && (
          <NFTVerification onVerified={handleVerificationComplete} onSkip={handleSkipVerification} />
        )}

        {currentStep === SetupStep.Complete && (
          <div className="bg-zinc-900 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChevronRight className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">You're All Set!</h2>
            <p className="text-zinc-400 mb-6">
              Prime Active is ready to track your activities and help you earn rewards.
            </p>
            <Button className="w-full" onClick={handleComplete}>
              Get Started
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
