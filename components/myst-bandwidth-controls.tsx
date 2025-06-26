"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AlertCircle, Save, DownloadCloud, UploadCloud } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BandwidthSettings {
  enabled: boolean
  maxUploadMbps: number
  maxDownloadMbps: number
  dailyDataCapGB: number
  monthlyDataCapGB: number
  scheduleEnabled: boolean
  schedule: {
    [key: string]: {
      enabled: boolean
      startHour: number
      endHour: number
    }
  }
  priorityMode: "balanced" | "performance" | "economy"
}

const DEFAULT_SETTINGS: BandwidthSettings = {
  enabled: true,
  maxUploadMbps: 10,
  maxDownloadMbps: 5,
  dailyDataCapGB: 5,
  monthlyDataCapGB: 100,
  scheduleEnabled: false,
  schedule: {
    monday: { enabled: true, startHour: 22, endHour: 6 },
    tuesday: { enabled: true, startHour: 22, endHour: 6 },
    wednesday: { enabled: true, startHour: 22, endHour: 6 },
    thursday: { enabled: true, startHour: 22, endHour: 6 },
    friday: { enabled: true, startHour: 22, endHour: 6 },
    saturday: { enabled: true, startHour: 20, endHour: 8 },
    sunday: { enabled: true, startHour: 20, endHour: 8 },
  },
  priorityMode: "balanced",
}

export function MystBandwidthControls() {
  const [settings, setSettings] = useState<BandwidthSettings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("limits")
  const [usageStats, setUsageStats] = useState({
    dailyUsageGB: 0,
    monthlyUsageGB: 0,
    uploadedToday: 0,
    downloadedToday: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    // Load settings
    const loadSettings = () => {
      setIsLoading(true)
      try {
        const savedSettings = localStorage.getItem("myst_bandwidth_settings")
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings))
        }

        // Simulate loading usage stats
        setUsageStats({
          dailyUsageGB: Math.random() * 2,
          monthlyUsageGB: Math.random() * 50,
          uploadedToday: Math.random() * 1.5,
          downloadedToday: Math.random() * 0.8,
        })
      } catch (error) {
        console.error("Failed to load bandwidth settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      // Save settings to localStorage
      localStorage.setItem("myst_bandwidth_settings", JSON.stringify(settings))

      // Simulate API call to MystNodes
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Your bandwidth settings have been updated",
      })
    } catch (error) {
      console.error("Failed to save bandwidth settings:", error)
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleBandwidth = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, enabled }))
  }

  const handleToggleSchedule = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, scheduleEnabled: enabled }))
  }

  const handleDayToggle = (day: string, enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          enabled,
        },
      },
    }))
  }

  const handleTimeChange = (day: string, field: "startHour" | "endHour", value: number) => {
    setSettings((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [field]: value,
        },
      },
    }))
  }

  const handlePriorityChange = (mode: "balanced" | "performance" | "economy") => {
    setSettings((prev) => ({ ...prev, priorityMode: mode }))
  }

  const formatTime = (hour: number): string => {
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 === 0 ? 12 : hour % 12
    return `${displayHour}:00 ${period}`
  }

  const getDayName = (day: string): string => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Bandwidth Controls</CardTitle>
            <Switch checked={settings.enabled} onCheckedChange={handleToggleBandwidth} />
          </div>
          <CardDescription>Manage how your MystNode uses your internet connection</CardDescription>
        </CardHeader>
        <CardContent>
          {!settings.enabled ? (
            <div className="bg-zinc-800 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div className="text-sm">
                Bandwidth controls are disabled. Your MystNode will use your connection without restrictions.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-800 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400 mb-1">Daily Usage</div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{usageStats.dailyUsageGB.toFixed(2)} GB</div>
                    <div className="text-xs text-zinc-400">
                      of {settings.dailyDataCapGB} GB (
                      {Math.round((usageStats.dailyUsageGB / settings.dailyDataCapGB) * 100)}%)
                    </div>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, (usageStats.dailyUsageGB / settings.dailyDataCapGB) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-zinc-800 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400 mb-1">Monthly Usage</div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{usageStats.monthlyUsageGB.toFixed(2)} GB</div>
                    <div className="text-xs text-zinc-400">
                      of {settings.monthlyDataCapGB} GB (
                      {Math.round((usageStats.monthlyUsageGB / settings.monthlyDataCapGB) * 100)}%)
                    </div>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(100, (usageStats.monthlyUsageGB / settings.monthlyDataCapGB) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="limits">Limits</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="priority">Priority</TabsTrigger>
                </TabsList>

                <TabsContent value="limits" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="upload-speed">Upload Speed Limit</Label>
                        <span className="text-sm">{settings.maxUploadMbps} Mbps</span>
                      </div>
                      <Slider
                        id="upload-speed"
                        min={1}
                        max={100}
                        step={1}
                        value={[settings.maxUploadMbps]}
                        onValueChange={(value) => setSettings((prev) => ({ ...prev, maxUploadMbps: value[0] }))}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="download-speed">Download Speed Limit</Label>
                        <span className="text-sm">{settings.maxDownloadMbps} Mbps</span>
                      </div>
                      <Slider
                        id="download-speed"
                        min={1}
                        max={100}
                        step={1}
                        value={[settings.maxDownloadMbps]}
                        onValueChange={(value) => setSettings((prev) => ({ ...prev, maxDownloadMbps: value[0] }))}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="daily-cap">Daily Data Cap</Label>
                        <span className="text-sm">{settings.dailyDataCapGB} GB</span>
                      </div>
                      <Slider
                        id="daily-cap"
                        min={1}
                        max={50}
                        step={1}
                        value={[settings.dailyDataCapGB]}
                        onValueChange={(value) => setSettings((prev) => ({ ...prev, dailyDataCapGB: value[0] }))}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="monthly-cap">Monthly Data Cap</Label>
                        <span className="text-sm">{settings.monthlyDataCapGB} GB</span>
                      </div>
                      <Slider
                        id="monthly-cap"
                        min={10}
                        max={1000}
                        step={10}
                        value={[settings.monthlyDataCapGB]}
                        onValueChange={(value) => setSettings((prev) => ({ ...prev, monthlyDataCapGB: value[0] }))}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label htmlFor="schedule-toggle">Enable Schedule</Label>
                    <Switch
                      id="schedule-toggle"
                      checked={settings.scheduleEnabled}
                      onCheckedChange={handleToggleSchedule}
                    />
                  </div>

                  {settings.scheduleEnabled && (
                    <div className="space-y-3">
                      <p className="text-sm text-zinc-400">
                        Set when your MystNode should be active. Outside these hours, your node will not share
                        bandwidth.
                      </p>

                      {Object.keys(settings.schedule).map((day) => (
                        <div key={day} className="bg-zinc-800 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={settings.schedule[day].enabled}
                                onCheckedChange={(checked) => handleDayToggle(day, checked)}
                                size="sm"
                              />
                              <span className="font-medium">{getDayName(day)}</span>
                            </div>
                            {settings.schedule[day].enabled && (
                              <span className="text-xs text-zinc-400">
                                {formatTime(settings.schedule[day].startHour)} -{" "}
                                {formatTime(settings.schedule[day].endHour)}
                              </span>
                            )}
                          </div>

                          {settings.schedule[day].enabled && (
                            <div className="grid grid-cols-2 gap-3 mt-2">
                              <div>
                                <Label htmlFor={`${day}-start`} className="text-xs">
                                  Start Time
                                </Label>
                                <select
                                  id={`${day}-start`}
                                  className="w-full bg-zinc-700 border-zinc-600 rounded-md text-sm mt-1 p-1"
                                  value={settings.schedule[day].startHour}
                                  onChange={(e) => handleTimeChange(day, "startHour", Number.parseInt(e.target.value))}
                                >
                                  {Array.from({ length: 24 }).map((_, i) => (
                                    <option key={i} value={i}>
                                      {formatTime(i)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <Label htmlFor={`${day}-end`} className="text-xs">
                                  End Time
                                </Label>
                                <select
                                  id={`${day}-end`}
                                  className="w-full bg-zinc-700 border-zinc-600 rounded-md text-sm mt-1 p-1"
                                  value={settings.schedule[day].endHour}
                                  onChange={(e) => handleTimeChange(day, "endHour", Number.parseInt(e.target.value))}
                                >
                                  {Array.from({ length: 24 }).map((_, i) => (
                                    <option key={i} value={i}>
                                      {formatTime(i)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="priority" className="space-y-4">
                  <div className="space-y-3">
                    <p className="text-sm text-zinc-400">
                      Choose how your MystNode should prioritize your internet connection.
                    </p>

                    <div
                      className={`bg-zinc-800 p-3 rounded-lg cursor-pointer ${
                        settings.priorityMode === "balanced" ? "border border-primary" : ""
                      }`}
                      onClick={() => handlePriorityChange("balanced")}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium">Balanced</div>
                        {settings.priorityMode === "balanced" && (
                          <div className="w-4 h-4 rounded-full bg-primary"></div>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400">
                        Share bandwidth while maintaining good performance for your own usage.
                      </p>
                    </div>

                    <div
                      className={`bg-zinc-800 p-3 rounded-lg cursor-pointer ${
                        settings.priorityMode === "performance" ? "border border-primary" : ""
                      }`}
                      onClick={() => handlePriorityChange("performance")}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium">Performance</div>
                        {settings.priorityMode === "performance" && (
                          <div className="w-4 h-4 rounded-full bg-primary"></div>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400">
                        Prioritize your own internet usage. MystNode will only use bandwidth when you're not active.
                      </p>
                    </div>

                    <div
                      className={`bg-zinc-800 p-3 rounded-lg cursor-pointer ${
                        settings.priorityMode === "economy" ? "border border-primary" : ""
                      }`}
                      onClick={() => handlePriorityChange("economy")}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium">Economy</div>
                        {settings.priorityMode === "economy" && <div className="w-4 h-4 rounded-full bg-primary"></div>}
                      </div>
                      <p className="text-sm text-zinc-400">
                        Maximize earnings by sharing as much bandwidth as possible within your set limits.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button onClick={saveSettings} disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle>Current Usage</CardTitle>
          <CardDescription>Today's bandwidth usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-800 p-2 rounded-full">
                <UploadCloud className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-zinc-400">Uploaded</div>
                <div className="font-medium">{usageStats.uploadedToday.toFixed(2)} GB</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-zinc-800 p-2 rounded-full">
                <DownloadCloud className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <div className="text-xs text-zinc-400">Downloaded</div>
                <div className="font-medium">{usageStats.downloadedToday.toFixed(2)} GB</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Current Status</div>
              <div
                className={`px-2 py-0.5 rounded-full text-xs ${
                  settings.enabled ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {settings.enabled ? "Active" : "Paused"}
              </div>
            </div>
            <div className="text-xs text-zinc-400">
              {settings.enabled
                ? `Sharing bandwidth at up to ${settings.maxUploadMbps} Mbps upload and ${settings.maxDownloadMbps} Mbps download`
                : "Bandwidth sharing is currently paused"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
