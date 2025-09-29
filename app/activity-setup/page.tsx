"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, MapPin, Clock, Target, Play, Shirt, Zap, Check } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import Image from "next/image"

const ACTIVITY_TYPES = [
  {
    id: "running",
    name: "Running",
    emoji: "🏃‍♂️",
    description: "Track your runs and earn rewards",
    color: "bg-green-500",
    estimatedCalories: "300-500 cal/hour",
  },
  {
    id: "cycling",
    name: "Cycling",
    emoji: "🚴‍♂️",
    description: "Bike rides and cycling adventures",
    color: "bg-blue-500",
    estimatedCalories: "400-600 cal/hour",
  },
  {
    id: "swimming",
    name: "Swimming",
    emoji: "🏊‍♂️",
    description: "Pool and open water swimming",
    color: "bg-cyan-500",
    estimatedCalories: "400-700 cal/hour",
  },
  {
    id: "skateboarding",
    name: "Skateboarding",
    emoji: "🛹",
    description: "Street and park skateboarding",
    color: "bg-orange-500",
    estimatedCalories: "250-400 cal/hour",
  },
  {
    id: "surfing",
    name: "Surfing",
    emoji: "🏄‍♂️",
    description: "Catch waves and ride the ocean",
    color: "bg-teal-500",
    estimatedCalories: "200-400 cal/hour",
  },
  {
    id: "snowboarding",
    name: "Snowboarding",
    emoji: "🏂",
    description: "Hit the slopes and shred powder",
    color: "bg-purple-500",
    estimatedCalories: "300-500 cal/hour",
  },
]

const DURATION_OPTIONS = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
]

const INTENSITY_LEVELS = [
  { id: "light", name: "Light", description: "Easy pace, can hold conversation", color: "bg-green-500" },
  { id: "moderate", name: "Moderate", description: "Comfortable effort, slightly breathless", color: "bg-yellow-500" },
  { id: "vigorous", name: "Vigorous", description: "Hard effort, difficult to talk", color: "bg-red-500" },
]

// Mock clothing items
const MOCK_CLOTHING = [
  {
    id: "prime-tshirt-1",
    name: "Prime Active T-Shirt",
    type: "shirt",
    image: "/prime-mates-tshirt.png",
    hasNFC: true,
    bonusMultiplier: 1.2,
    description: "NFC-enabled performance tee",
  },
  {
    id: "prime-hoodie-1",
    name: "Prime Active Hoodie",
    type: "hoodie",
    image: "/prime-mates-jumper.png",
    hasNFC: true,
    bonusMultiplier: 1.3,
    description: "Premium hoodie with activity tracking",
  },
  {
    id: "prime-cap-1",
    name: "Prime Active Cap",
    type: "hat",
    image: "/prime-mates-snapback.png",
    hasNFC: false,
    bonusMultiplier: 1.1,
    description: "Classic snapback cap",
  },
]

export default function ActivitySetupPage() {
  const [step, setStep] = useState(1)
  const [selectedActivity, setSelectedActivity] = useState<string>("")
  const [duration, setDuration] = useState(30)
  const [intensity, setIntensity] = useState("moderate")
  const [location, setLocation] = useState("")
  const [selectedClothing, setSelectedClothing] = useState<string[]>([])
  const [cryptoMining, setCryptoMining] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  // Initialize from URL params only once on mount
  useEffect(() => {
    const activityFromUrl = searchParams.get("activity")
    if (activityFromUrl && ACTIVITY_TYPES.find((a) => a.id === activityFromUrl)) {
      setSelectedActivity(activityFromUrl)
      setStep(2)
    }
  }, []) // Empty dependency array - only run once on mount

  const selectedActivityData = ACTIVITY_TYPES.find((a) => a.id === selectedActivity)

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivity(activityId)
    setStep(2)
  }

  const toggleClothing = (clothingId: string) => {
    setSelectedClothing((prev) =>
      prev.includes(clothingId) ? prev.filter((id) => id !== clothingId) : [...prev, clothingId],
    )
  }

  const calculateBonusMultiplier = () => {
    return selectedClothing.reduce((total, clothingId) => {
      const item = MOCK_CLOTHING.find((c) => c.id === clothingId)
      return total + (item ? item.bonusMultiplier - 1 : 0)
    }, 1)
  }

  const handleStartActivity = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const activityData = {
        type: selectedActivity,
        duration,
        intensity,
        location,
        clothing: selectedClothing,
        cryptoMining,
        bonusMultiplier: calculateBonusMultiplier(),
        startTime: new Date().toISOString(),
      }

      // Navigate to activity tracking
      const params = new URLSearchParams({
        activity: selectedActivity,
        duration: duration.toString(),
        intensity,
        location: location || "Unknown",
        clothing: JSON.stringify(selectedClothing),
        crypto: cryptoMining.toString(),
      })

      router.push(`/activity-tracking?${params.toString()}`)
    } catch (error) {
      console.error("Failed to start activity:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Choose Your Activity</h1>
        <p className="text-zinc-400">Select what you want to track today</p>
      </div>

      <div className="grid gap-4">
        {ACTIVITY_TYPES.map((activity) => (
          <Card
            key={activity.id}
            className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer transition-colors"
            onClick={() => handleActivitySelect(activity.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{activity.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{activity.name}</h3>
                  <p className="text-sm text-zinc-400">{activity.description}</p>
                  <Badge variant="secondary" className="mt-1 text-xs bg-zinc-700 text-zinc-300">
                    {activity.estimatedCalories}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">Setup {selectedActivityData?.name}</h1>
          <p className="text-zinc-400">Configure your activity details</p>
        </div>
      </div>

      {selectedActivityData && (
        <Card className="border-zinc-700 bg-zinc-800/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{selectedActivityData.emoji}</div>
              <div>
                <h3 className="font-semibold text-white">{selectedActivityData.name}</h3>
                <p className="text-sm text-zinc-400">{selectedActivityData.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-white">
            <Clock className="w-4 h-4 inline mr-2" />
            Duration
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DURATION_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={duration === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setDuration(option.value)}
                className={
                  duration === option.value
                    ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                    : "border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-white">
            <Target className="w-4 h-4 inline mr-2" />
            Intensity
          </label>
          <div className="space-y-2">
            {INTENSITY_LEVELS.map((level) => (
              <Card
                key={level.id}
                className={`border cursor-pointer transition-colors ${
                  intensity === level.id
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"
                }`}
                onClick={() => setIntensity(level.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{level.name}</p>
                      <p className="text-sm text-zinc-400">{level.description}</p>
                    </div>
                    {intensity === level.id && <div className="w-2 h-2 bg-yellow-400 rounded-full" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-white">
            <MapPin className="w-4 h-4 inline mr-2" />
            Location (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Central Park, Local Gym"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      <Button
        onClick={() => setStep(3)}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
        size="lg"
      >
        Continue to Gear Selection
      </Button>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">Select Your Gear</h1>
          <p className="text-zinc-400">Wearing Prime Active gear boosts your rewards</p>
        </div>
      </div>

      {/* Crypto Mining Toggle */}
      <Card className="border-zinc-700 bg-zinc-800/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="font-medium text-white">Crypto Mining</p>
                <p className="text-sm text-zinc-400">Earn IOTX tokens while exercising</p>
              </div>
            </div>
            <Switch
              checked={cryptoMining}
              onCheckedChange={setCryptoMining}
              className="data-[state=checked]:bg-yellow-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clothing Selection */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Shirt className="h-5 w-5" />
          Prime Active Gear
        </h3>
        <div className="space-y-3">
          {MOCK_CLOTHING.map((item) => (
            <Card
              key={item.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedClothing.includes(item.id)
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"
              }`}
              onClick={() => toggleClothing(item.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-zinc-700 rounded-lg overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{item.name}</h4>
                      {item.hasNFC && <Badge className="bg-blue-500/20 text-blue-400 text-xs">NFC</Badge>}
                    </div>
                    <p className="text-sm text-zinc-400">{item.description}</p>
                    <p className="text-xs text-green-400 mt-1">
                      +{Math.round((item.bonusMultiplier - 1) * 100)}% bonus rewards
                    </p>
                  </div>
                  {selectedClothing.includes(item.id) && <Check className="h-5 w-5 text-yellow-400" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bonus Summary */}
      {selectedClothing.length > 0 && (
        <Card className="border-green-500/50 bg-green-500/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-400">Total Bonus Multiplier</p>
                <p className="text-sm text-zinc-400">{selectedClothing.length} items selected</p>
              </div>
              <div className="text-2xl font-bold text-green-400">{calculateBonusMultiplier().toFixed(1)}x</div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => setStep(4)}
          className="flex-1 border-zinc-600 text-zinc-300 hover:bg-zinc-800"
        >
          Skip Gear
        </Button>
        <Button onClick={() => setStep(4)} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
          Continue
        </Button>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => setStep(3)} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">Ready to Start!</h1>
          <p className="text-zinc-400">Review your activity setup</p>
        </div>
      </div>

      {/* Activity Summary */}
      <Card className="border-zinc-700 bg-zinc-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            {selectedActivityData && (
              <>
                <div className="text-2xl">{selectedActivityData.emoji}</div>
                <div>
                  <h3>{selectedActivityData.name}</h3>
                  <p className="text-sm text-zinc-400 font-normal">
                    {duration} minutes • {intensity} intensity
                  </p>
                </div>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {location && (
            <div>
              <p className="text-sm font-medium text-zinc-300">Location:</p>
              <p className="text-zinc-400">{location}</p>
            </div>
          )}

          {selectedClothing.length > 0 && (
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-2">Selected Gear:</p>
              <div className="flex flex-wrap gap-2">
                {selectedClothing.map((clothingId) => {
                  const item = MOCK_CLOTHING.find((c) => c.id === clothingId)
                  return item ? (
                    <Badge key={clothingId} className="bg-yellow-400/20 text-yellow-400">
                      {item.name}
                    </Badge>
                  ) : null
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-700">
            <div>
              <p className="text-sm text-zinc-400">Expected Rewards</p>
              <p className="font-medium text-green-400">
                {Math.round(duration * 2 * calculateBonusMultiplier())} Banana Points
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">Bonus Multiplier</p>
              <p className="font-medium text-yellow-400">{calculateBonusMultiplier().toFixed(1)}x</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleStartActivity}
        disabled={isLoading}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
        size="lg"
      >
        {isLoading ? (
          "Starting Activity..."
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Start {selectedActivityData?.name}
          </>
        )}
      </Button>
    </div>
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <Card className="border-zinc-800 bg-zinc-900 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-white">Authentication Required</CardTitle>
            <CardDescription className="text-zinc-400">Please log in to track your activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-md mx-auto p-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </div>
  )
}
