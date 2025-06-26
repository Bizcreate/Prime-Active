"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { AppShell } from "@/components/app-shell"
import { ArrowLeft, ArrowRight, Check, Shirt, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { merchandiseWearService, type ConnectedMerchandise } from "@/services/merchandise-wear-service"
import { dePINManager } from "@/services/depin-manager"

const ACTIVITY_TYPES = [
  { id: "skateboarding", name: "Skateboarding", icon: "🛹", color: "bg-orange-500" },
  { id: "surfing", name: "Surfing", icon: "🏄‍♂️", color: "bg-blue-500" },
  { id: "snowboarding", name: "Snowboarding", icon: "🏂", color: "bg-cyan-500" },
  { id: "running", name: "Running", icon: "🏃‍♂️", color: "bg-green-500" },
  { id: "cycling", name: "Cycling", icon: "🚴‍♂️", color: "bg-yellow-500" },
  { id: "walking", name: "Walking", icon: "🚶‍♂️", color: "bg-purple-500" },
]

export default function ActivitySetupPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [step, setStep] = useState(1)
  const [selectedActivity, setSelectedActivity] = useState("")
  const [selectedMerchandise, setSelectedMerchandise] = useState<string[]>([])
  const [availableMerchandise, setAvailableMerchandise] = useState<ConnectedMerchandise[]>([])
  const [depinEnabled, setDepinEnabled] = useState(true)
  const [depinNetworks, setDepinNetworks] = useState<any[]>([])

  useEffect(() => {
    // Get activity type from URL if provided
    const activityType = searchParams.get("type")
    if (activityType) {
      setSelectedActivity(activityType)
      setStep(2)
    }

    // Load available merchandise
    const merchandise = merchandiseWearService.getConnectedMerchandise()
    setAvailableMerchandise(merchandise)

    // Load DePIN networks
    const networks = dePINManager.getAllServices()
    const enabledNetworks = networks.filter((network) => network.isNetworkEnabled())
    setDepinNetworks(enabledNetworks)
  }, [searchParams])

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivity(activityId)
    setStep(2)
  }

  const toggleMerchandiseSelection = (id: string) => {
    setSelectedMerchandise((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleStartActivity = () => {
    if (!selectedActivity) {
      toast({
        title: "Select an activity",
        description: "Please select an activity type to continue",
        variant: "destructive",
      })
      return
    }

    // Start wearing selected merchandise
    selectedMerchandise.forEach((id) => {
      merchandiseWearService.startWearing(id)
    })

    // Navigate to activity tracking with all the setup data
    const params = new URLSearchParams({
      type: selectedActivity,
      merchandise: JSON.stringify(selectedMerchandise),
      depin: depinEnabled.toString(),
    })

    router.push(`/activity-tracking?${params.toString()}`)
  }

  const getActivityType = (id: string) => {
    return ACTIVITY_TYPES.find((type) => type.id === id)
  }

  const selectedActivityType = getActivityType(selectedActivity)

  return (
    <AppShell>
      <div className="min-h-screen bg-black p-6 pb-20">
        <div className="flex items-center mb-6">
          <Link href={step === 1 ? "/dashboard" : "#"} onClick={step > 1 ? () => setStep(step - 1) : undefined}>
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">
            {step === 1 ? "Choose Activity" : step === 2 ? "Select Gear" : "Ready to Start"}
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-black" : "bg-zinc-800"}`}
            >
              {step > 1 ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? "bg-primary" : "bg-zinc-800"}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-black" : "bg-zinc-800"}`}
            >
              {step > 2 ? <Check className="h-4 w-4" /> : "2"}
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? "bg-primary" : "bg-zinc-800"}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-black" : "bg-zinc-800"}`}
            >
              {step > 3 ? <Check className="h-4 w-4" /> : "3"}
            </div>
          </div>
        </div>

        {/* Step 1: Activity Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">What activity are you doing?</h2>
            <div className="grid grid-cols-2 gap-3">
              {ACTIVITY_TYPES.map((activity) => (
                <Card
                  key={activity.id}
                  className={`bg-zinc-900 border-zinc-800 cursor-pointer transition-all hover:border-zinc-600 ${
                    selectedActivity === activity.id ? "border-primary ring-2 ring-primary/20" : ""
                  }`}
                  onClick={() => handleActivitySelect(activity.id)}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center h-24">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${activity.color}`}>
                      <span className="text-2xl">{activity.icon}</span>
                    </div>
                    <span className="text-sm font-medium">{activity.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Gear Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              {selectedActivityType && (
                <>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedActivityType.color}`}
                  >
                    <span className="text-xl">{selectedActivityType.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{selectedActivityType.name}</h2>
                    <p className="text-sm text-zinc-400">Select your gear to earn bonus tokens</p>
                  </div>
                </>
              )}
            </div>

            {/* DePIN Mining Toggle */}
            {depinNetworks.length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <h3 className="font-medium">Crypto Mining</h3>
                    </div>
                    <Switch checked={depinEnabled} onCheckedChange={setDepinEnabled} />
                  </div>
                  <p className="text-sm text-zinc-400 mb-3">
                    {depinEnabled
                      ? "Earn cryptocurrency tokens while you exercise"
                      : "Mining disabled for this activity"}
                  </p>
                  {depinEnabled && (
                    <div className="flex flex-wrap gap-2">
                      {depinNetworks.map((service) => {
                        const network = service.getNetwork()
                        return (
                          <Badge key={network.id} variant="outline" className="flex items-center gap-1">
                            <Image
                              src={network.logoUrl || "/placeholder.svg"}
                              alt={network.name}
                              width={16}
                              height={16}
                            />
                            <span>{network.name}</span>
                          </Badge>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Merchandise Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Shirt className="h-5 w-5" />
                Wear Your Gear
              </h3>
              {availableMerchandise.length === 0 ? (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6 text-center">
                    <p className="text-zinc-400 mb-4">No connected merchandise found</p>
                    <Link href="/merch/collection">
                      <Button variant="outline">Browse Collection</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {availableMerchandise.map((item) => (
                    <Card
                      key={item.id}
                      className={`bg-zinc-900 border-zinc-800 cursor-pointer transition-all hover:border-zinc-600 ${
                        selectedMerchandise.includes(item.id) ? "border-primary ring-2 ring-primary/20" : ""
                      }`}
                      onClick={() => toggleMerchandiseSelection(item.id)}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md bg-zinc-800 overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg?height=48&width=48&query=merchandise"}
                            alt={item.productName}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-xs text-zinc-400">
                            {item.hasNFC ? "NFC Enabled" : "Standard"} • Earn bonus tokens
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedMerchandise.includes(item.id)
                              ? "border-primary bg-primary text-black"
                              : "border-zinc-600"
                          }`}
                        >
                          {selectedMerchandise.includes(item.id) && <Check className="h-4 w-4" />}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>
                Skip Gear Selection
              </Button>
              <Button className="flex-1" onClick={() => setStep(3)}>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Ready to Start */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {selectedActivityType && (
                    <>
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedActivityType.color}`}
                      >
                        <span className="text-2xl">{selectedActivityType.icon}</span>
                      </div>
                      <div>
                        <h2 className="text-xl">{selectedActivityType.name}</h2>
                        <p className="text-sm text-zinc-400 font-normal">Ready to start tracking</p>
                      </div>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Gear */}
                {selectedMerchandise.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Selected Gear:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMerchandise.map((id) => {
                        const item = availableMerchandise.find((m) => m.id === id)
                        return item ? (
                          <Badge key={id} variant="outline" className="flex items-center gap-1">
                            <Shirt className="h-3 w-3" />
                            {item.productName}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                )}

                {/* Mining Status */}
                {depinEnabled && depinNetworks.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Crypto Mining:</h4>
                    <div className="flex flex-wrap gap-2">
                      {depinNetworks.map((service) => {
                        const network = service.getNetwork()
                        return (
                          <Badge key={network.id} variant="outline" className="flex items-center gap-1 text-green-400">
                            <Zap className="h-3 w-3" />
                            {network.name} Active
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Expected Rewards */}
                <div className="bg-zinc-800 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Expected Rewards:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Base Rewards:</span>
                      <span>Banana Points + Shaka Tokens</span>
                    </div>
                    {selectedMerchandise.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Gear Bonus:</span>
                        <span className="text-green-400">+{selectedMerchandise.length * 20}% tokens</span>
                      </div>
                    )}
                    {depinEnabled && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Crypto Mining:</span>
                        <span className="text-yellow-400">IOTX tokens</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full py-6 text-lg" onClick={handleStartActivity}>
              Start {selectedActivityType?.name}
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
