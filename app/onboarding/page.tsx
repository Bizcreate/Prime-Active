"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, Activity, MapPin, Bell, Check, Trophy, Target } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const ACTIVITY_TYPES = [
  { id: "running", name: "Running", emoji: "🏃‍♂️", color: "bg-green-500" },
  { id: "cycling", name: "Cycling", emoji: "🚴‍♂️", color: "bg-blue-500" },
  { id: "swimming", name: "Swimming", emoji: "🏊‍♂️", color: "bg-cyan-500" },
  { id: "skateboarding", name: "Skateboarding", emoji: "🛹", color: "bg-orange-500" },
  { id: "surfing", name: "Surfing", emoji: "🏄‍♂️", color: "bg-teal-500" },
  { id: "snowboarding", name: "Snowboarding", emoji: "🏂", color: "bg-purple-500" },
]

const CLOTHING_ITEMS = [
  {
    id: "prime-hoodie",
    name: "Prime Active Hoodie",
    image: "/pmbc-black-hoodie.png",
    bonus: 1.2,
    nfc: true,
  },
  {
    id: "prime-tshirt",
    name: "Prime Active T-Shirt",
    image: "/pmbc-black-tshirt.png",
    bonus: 1.1,
    nfc: true,
  },
  {
    id: "prime-cap",
    name: "Prime Active Cap",
    image: "/pmbc-classic-snapback.png",
    bonus: 1.15,
    nfc: true,
  },
  {
    id: "prime-shoes",
    name: "Prime Active Shoes",
    image: "/banana-grip.png",
    bonus: 1.3,
    nfc: true,
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [selectedClothing, setSelectedClothing] = useState<string[]>([])
  const [permissions, setPermissions] = useState({
    location: false,
    notifications: false,
  })
  const router = useRouter()
  const { signInDemo } = useAuth() // Fixed function name
  const { toast } = useToast()

  const progress = (step / 5) * 100

  const toggleActivity = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId],
    )
  }

  const toggleClothing = (clothingId: string) => {
    setSelectedClothing((prev) =>
      prev.includes(clothingId) ? prev.filter((id) => id !== clothingId) : [...prev, clothingId],
    )
  }

  const requestLocationPermission = async () => {
    try {
      navigator.geolocation.getCurrentPosition(
        () => {
          setPermissions((prev) => ({ ...prev, location: true }))
          toast({
            title: "Location enabled",
            description: "We can now track your outdoor activities",
          })
        },
        () => {
          toast({
            title: "Location access denied",
            description: "You can enable this later in settings",
            variant: "destructive",
          })
        },
      )
    } catch (error) {
      console.log("Location permission denied")
    }
  }

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission()
      setPermissions((prev) => ({ ...prev, notifications: permission === "granted" }))
      if (permission === "granted") {
        toast({
          title: "Notifications enabled",
          description: "You'll get activity reminders and achievements",
        })
      }
    } catch (error) {
      console.log("Notification permission denied")
    }
  }

  const calculateTotalBonus = () => {
    return selectedClothing.reduce((total, clothingId) => {
      const item = CLOTHING_ITEMS.find((c) => c.id === clothingId)
      return total + (item ? item.bonus - 1 : 0)
    }, 1)
  }

  const handleComplete = async () => {
    try {
      await signInDemo()
      toast({
        title: "Welcome to Prime Active!",
        description: "Your fitness journey begins now",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Demo login error:", error)
      toast({
        title: "Setup complete!",
        description: "Redirecting to dashboard...",
      })
      router.push("/dashboard")
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 relative mx-auto">
          <Image src="/prime-mates-logo.png" alt="Prime Active Logo" fill className="object-contain" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Prime Active</h1>
          <p className="text-zinc-400 text-lg">Track your activities, earn rewards, and stay motivated</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-2">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <Activity className="h-6 w-6 text-green-400" />
          </div>
          <p className="text-sm text-zinc-300">Track Activities</p>
        </div>
        <div className="space-y-2">
          <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="h-6 w-6 text-yellow-400" />
          </div>
          <p className="text-sm text-zinc-300">Earn Rewards</p>
        </div>
        <div className="space-y-2">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
            <Target className="h-6 w-6 text-blue-400" />
          </div>
          <p className="text-sm text-zinc-300">Hit Goals</p>
        </div>
      </div>

      <Button
        onClick={() => setStep(2)}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
        size="lg"
      >
        Get Started
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      <div className="text-center">
        <Button variant="ghost" onClick={handleComplete} className="text-zinc-400 hover:text-white">
          Try Demo Instead
        </Button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">What activities do you do?</h2>
        <p className="text-zinc-400">Select all that apply - you can change this later</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ACTIVITY_TYPES.map((activity) => (
          <Card
            key={activity.id}
            className={`cursor-pointer transition-all border-2 ${
              selectedActivities.includes(activity.id)
                ? "border-yellow-400 bg-yellow-400/10"
                : "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"
            }`}
            onClick={() => toggleActivity(activity.id)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">{activity.emoji}</div>
              <p className="font-medium text-white">{activity.name}</p>
              {selectedActivities.includes(activity.id) && <Check className="h-5 w-5 text-yellow-400 mx-auto mt-2" />}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => setStep(1)}
          className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={() => setStep(3)}
          disabled={selectedActivities.length === 0}
          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Do you have Prime Active gear?</h2>
        <p className="text-zinc-400">Select any items you own to boost your rewards</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CLOTHING_ITEMS.map((item) => (
          <Card
            key={item.id}
            className={`cursor-pointer transition-all border-2 ${
              selectedClothing.includes(item.id)
                ? "border-yellow-400 bg-yellow-400/10"
                : "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"
            }`}
            onClick={() => toggleClothing(item.id)}
          >
            <CardContent className="p-3">
              <div className="aspect-square relative mb-2 rounded-lg overflow-hidden">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <p className="text-sm font-medium text-white text-center">{item.name}</p>
              <div className="flex items-center justify-center mt-1 space-x-1">
                <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                  +{Math.round((item.bonus - 1) * 100)}%
                </Badge>
                {item.nfc && (
                  <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                    NFC
                  </Badge>
                )}
              </div>
              {selectedClothing.includes(item.id) && <Check className="h-5 w-5 text-yellow-400 mx-auto mt-2" />}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedClothing.length > 0 && (
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-green-400 font-medium">
              Total Bonus: +{Math.round((calculateTotalBonus() - 1) * 100)}% rewards
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => setStep(2)}
          className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={() => setStep(4)} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Enable Permissions</h2>
        <p className="text-zinc-400">Help us provide the best tracking experience</p>
      </div>

      <div className="space-y-4">
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Location Access</p>
                  <p className="text-sm text-zinc-400">Track distance and routes</p>
                </div>
              </div>
              <Button
                onClick={requestLocationPermission}
                variant={permissions.location ? "default" : "outline"}
                size="sm"
                className={permissions.location ? "bg-green-500 hover:bg-green-600" : "border-zinc-600"}
              >
                {permissions.location ? <Check className="h-4 w-4" /> : "Enable"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Bell className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Notifications</p>
                  <p className="text-sm text-zinc-400">Activity reminders and achievements</p>
                </div>
              </div>
              <Button
                onClick={requestNotificationPermission}
                variant={permissions.notifications ? "default" : "outline"}
                size="sm"
                className={permissions.notifications ? "bg-green-500 hover:bg-green-600" : "border-zinc-600"}
              >
                {permissions.notifications ? <Check className="h-4 w-4" /> : "Enable"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => setStep(3)}
          className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={() => setStep(5)} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <Check className="h-10 w-10 text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">You're All Set!</h2>
          <p className="text-zinc-400">Ready to start tracking your activities and earning rewards</p>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-medium text-white">Your Selected Activities:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedActivities.map((activityId) => {
                const activity = ACTIVITY_TYPES.find((a) => a.id === activityId)
                return activity ? (
                  <Badge key={activityId} variant="secondary" className="bg-yellow-400/20 text-yellow-400">
                    {activity.emoji} {activity.name}
                  </Badge>
                ) : null
              })}
            </div>
          </CardContent>
        </Card>

        {selectedClothing.length > 0 && (
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-medium text-white">Your Prime Active Gear:</h3>
              <div className="space-y-2">
                {selectedClothing.map((clothingId) => {
                  const item = CLOTHING_ITEMS.find((c) => c.id === clothingId)
                  return item ? (
                    <div key={clothingId} className="flex items-center justify-between">
                      <span className="text-zinc-300">{item.name}</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        +{Math.round((item.bonus - 1) * 100)}%
                      </Badge>
                    </div>
                  ) : null
                })}
              </div>
              <div className="pt-2 border-t border-zinc-700">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-white">Total Bonus:</span>
                  <Badge className="bg-green-500 text-white">+{Math.round((calculateTotalBonus() - 1) * 100)}%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleComplete}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
          size="lg"
        >
          Start Using Prime Active
        </Button>

        <div className="text-center">
          <Button variant="ghost" onClick={() => setStep(4)} className="text-zinc-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-md mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-zinc-400 text-center">Step {step} of 5</p>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </div>
    </div>
  )
}
