"use client"

import { useState, useEffect, useCallback } from "react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useActivityTypes } from "@/services/activity-types-service"
import { useActivityTemplates } from "@/services/activity-templates-service"
import { ArrowLeft, Plus, Activity, Footprints, Bike, Snowflake, Skull, WavesIcon as Wave } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { merchandiseWearService, type ConnectedMerchandise } from "@/services/merchandise-wear-service"

export default function StartActivityPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { activityTypes, isLoading: loadingTypes } = useActivityTypes()
  const {
    templates,
    isLoading: loadingTemplates,
    getTemplateById,
    useTemplate,
    getMostUsedTemplates,
  } = useActivityTemplates()
  const { toast } = useToast()
  const [selectedType, setSelectedType] = useState("")
  const [activityName, setActivityName] = useState("")
  const [location, setLocation] = useState("")
  const [mostUsedTemplates, setMostUsedTemplates] = useState([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [availableMerchandise, setAvailableMerchandise] = useState<ConnectedMerchandise[]>([])
  const [selectedMerchandise, setSelectedMerchandise] = useState<string[]>([])

  // Memoize the function to get most used templates to prevent recreation on each render
  const fetchMostUsedTemplates = useCallback(() => {
    return getMostUsedTemplates(3)
  }, [getMostUsedTemplates])

  // Initialize most used templates once when component mounts
  useEffect(() => {
    setMostUsedTemplates(fetchMostUsedTemplates())
  }, [fetchMostUsedTemplates])

  // Handle URL parameters separately from the most used templates
  useEffect(() => {
    // Check if a template ID was provided in the URL
    const templateId = searchParams.get("template")
    if (templateId) {
      const template = getTemplateById(templateId)
      if (template) {
        setSelectedType(template.activityTypeId)
        setActivityName(template.name)
        setLocation(template.location || "")
        setSelectedTemplateId(templateId)
      }
    }

    // Check if an activity type was provided in the URL
    const activityType = searchParams.get("type")
    if (activityType && !templateId) {
      setSelectedType(activityType)
    }
  }, [searchParams, getTemplateById])

  // Use the template when selectedTemplateId changes
  useTemplate(selectedTemplateId || undefined)

  // Fetch available merchandise
  useEffect(() => {
    // Only fetch merchandise once when component mounts
    const merchandise = merchandiseWearService.getConnectedMerchandise()
    setAvailableMerchandise(merchandise)
  }, []) // Empty dependency array means this runs once on mount

  // Toggle merchandise selection
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
    if (!selectedType) {
      toast({
        title: "Select an activity type",
        description: "Please select an activity type to continue",
        variant: "destructive",
      })
      return
    }

    // Start wearing selected merchandise
    selectedMerchandise.forEach((id) => {
      merchandiseWearService.startWearing(id)
    })

    // In a real app, this would start tracking the activity
    toast({
      title: "Activity started",
      description: `${activityName || getActivityTypeName(selectedType)} tracking has begun${selectedMerchandise.length > 0 ? " with your gear" : ""}`,
    })

    // Navigate to activity tracking page with merchandise info
    router.push(
      `/activity-tracking?type=${selectedType}&name=${encodeURIComponent(activityName)}&location=${encodeURIComponent(location)}&merchandise=${encodeURIComponent(JSON.stringify(selectedMerchandise))}`,
    )
  }

  const getActivityTypeName = (id: string) => {
    const type = activityTypes.find((type) => type.id === id)
    return type ? type.name : "Unknown"
  }

  // Get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "running":
        return <Activity className="h-6 w-6" />
      case "walking":
        return <Footprints className="h-6 w-6" />
      case "cycling":
      case "biking":
        return <Bike className="h-6 w-6" />
      case "snowboarding":
        return <Snowflake className="h-6 w-6" />
      case "skateboarding":
        return <Skull className="h-6 w-6" />
      case "surfing":
        return <Wave className="h-6 w-6" />
      default:
        return <Activity className="h-6 w-6" />
    }
  }

  // Group activity types by category
  const groupedTypes = activityTypes.reduce(
    (acc, type) => {
      if (!acc[type.category]) {
        acc[type.category] = []
      }
      acc[type.category].push(type)
      return acc
    },
    {} as Record<string, typeof activityTypes>,
  )

  // Handle template selection
  const handleTemplateSelect = useCallback((template: any) => {
    setSelectedType(template.activityTypeId)
    setActivityName(template.name)
    setLocation(template.location || "")
    setSelectedTemplateId(template.id)
    // Don't update mostUsedTemplates here to avoid the infinite loop
  }, [])

  // Get popular activity types
  const popularActivityTypes = [
    { id: "running", name: "Running" },
    { id: "walking", name: "Walking" },
    { id: "skateboarding", name: "Skateboarding" },
    { id: "snowboarding", name: "Snowboarding" },
    { id: "surfing", name: "Surfing" },
    { id: "cycling", name: "Biking" },
  ]

  return (
    <AppShell>
      <div className="min-h-screen bg-black p-6 pb-20">
        <div className="flex items-center mb-6">
          <Link href="/dashboard" className="mr-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Start Activity</h1>
        </div>

        {loadingTypes || loadingTemplates ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs defaultValue="popular">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="types">All Types</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="popular">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {popularActivityTypes.map((type) => (
                    <Card
                      key={type.id}
                      className={`bg-zinc-900 border-zinc-800 cursor-pointer transition-colors ${
                        selectedType === type.id ? "border-primary" : ""
                      }`}
                      onClick={() => setSelectedType(type.id)}
                    >
                      <CardContent className="p-4 flex flex-col items-center justify-center h-24">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                            selectedType === type.id ? "bg-primary text-black" : "bg-zinc-800"
                          }`}
                        >
                          {getActivityIcon(type.id)}
                        </div>
                        <span className="text-sm font-medium">{type.name}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="types">
                <div className="space-y-6">
                  {Object.entries(groupedTypes).map(([category, types]) => (
                    <div key={category}>
                      <h2 className="text-lg font-semibold mb-3">{category}</h2>
                      <div className="grid grid-cols-2 gap-3">
                        {types.map((type) => (
                          <Card
                            key={type.id}
                            className={`bg-zinc-900 border-zinc-800 cursor-pointer transition-colors ${
                              selectedType === type.id ? "border-primary" : ""
                            }`}
                            onClick={() => setSelectedType(type.id)}
                          >
                            <CardContent className="p-4 flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  selectedType === type.id ? "bg-primary text-black" : "bg-zinc-800"
                                }`}
                              >
                                {/* Icon would go here - using placeholder */}
                                <span className="text-lg">{type.name.charAt(0)}</span>
                              </div>
                              <div>
                                <h3 className="font-medium">{type.name}</h3>
                                <p className="text-xs text-zinc-400">{type.metrics.slice(0, 3).join(" • ")}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        <Link href="/activity-types">
                          <Card className="bg-zinc-900 border-zinc-800 cursor-pointer h-full">
                            <CardContent className="p-4 flex items-center justify-center h-full">
                              <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-2">
                                  <Plus className="h-5 w-5" />
                                </div>
                                <span className="text-sm">Custom Type</span>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="templates">
                {templates.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-zinc-400 mb-4">You don't have any templates yet</p>
                    <Link href="/activity-templates">
                      <Button>Create Your First Template</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {mostUsedTemplates.length > 0 && (
                      <div>
                        <h2 className="text-lg font-semibold mb-3">Most Used</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {mostUsedTemplates.map((template) => (
                            <Card
                              key={template.id}
                              className="bg-zinc-900 border-zinc-800 cursor-pointer"
                              onClick={() => handleTemplateSelect(template)}
                            >
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{template.name}</h3>
                                    <p className="text-xs text-zinc-400">
                                      {getActivityTypeName(template.activityTypeId)}
                                    </p>
                                  </div>
                                  <div className="bg-zinc-800 px-2 py-1 rounded text-xs">
                                    Used {template.usageCount}x
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h2 className="text-lg font-semibold mb-3">All Templates</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {templates.map((template) => (
                          <Card
                            key={template.id}
                            className="bg-zinc-900 border-zinc-800 cursor-pointer"
                            onClick={() => handleTemplateSelect(template)}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{template.name}</h3>
                                  <p className="text-xs text-zinc-400">
                                    {getActivityTypeName(template.activityTypeId)}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        <Link href="/activity-templates">
                          <Card className="bg-zinc-900 border-zinc-800 cursor-pointer h-full">
                            <CardContent className="p-4 flex items-center justify-center h-full">
                              <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-2">
                                  <Plus className="h-5 w-5" />
                                </div>
                                <span className="text-sm">New Template</span>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Wearable Merchandise Section - Only show if there's merchandise and an activity is selected */}
            {availableMerchandise.length > 0 && selectedType && (
              <div className="mt-4 mb-4">
                <h2 className="text-lg font-semibold mb-3">Wear Your Gear</h2>
                <p className="text-sm text-zinc-400 mb-4">Select items to wear during this activity to earn tokens</p>

                <div className="grid grid-cols-1 gap-3">
                  {availableMerchandise.map((item) => (
                    <Card
                      key={item.id}
                      className={`bg-zinc-900 border-zinc-800 cursor-pointer transition-colors ${
                        selectedMerchandise.includes(item.id) ? "border-primary" : ""
                      }`}
                      onClick={() => toggleMerchandiseSelection(item.id)}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md bg-zinc-800 overflow-hidden">
                          {item.image && (
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.productName}</h3>
                          <p className="text-xs text-zinc-400">
                            {item.isCurrentlyWorn ? "Currently worn" : "Not worn"}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedMerchandise.includes(item.id)
                              ? "border-primary bg-primary text-black"
                              : "border-zinc-600"
                          }`}
                        >
                          {selectedMerchandise.includes(item.id) && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Only show the start button if an activity type is selected */}
            {selectedType && (
              <div className="mt-4 sticky bottom-20 left-0 right-0 z-10">
                <Button className="w-full py-6 text-lg" onClick={handleStartActivity}>
                  Start {getActivityTypeName(selectedType)}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}
