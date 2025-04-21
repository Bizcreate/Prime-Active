"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Filter,
  Calendar,
  Activity,
  SkullIcon as Skateboard,
  Snowflake,
  Waves,
  Footprints,
} from "lucide-react"
import Link from "next/link"

export default function ActivitiesPage() {
  const [filter, setFilter] = useState("all")

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Activities</h1>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="all" onClick={() => setFilter("all")}>
              All
            </TabsTrigger>
            <TabsTrigger value="today" onClick={() => setFilter("today")}>
              Today
            </TabsTrigger>
            <TabsTrigger value="week" onClick={() => setFilter("week")}>
              This Week
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
              <Calendar className="h-4 w-4" />
              <span>February 2023</span>
            </div>

            {/* Activity Item */}
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-zinc-800 p-2 rounded-full">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Morning Run</h3>
                    <span className="text-xs text-zinc-400">Today, 7:30 AM</span>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <p className="text-xs text-zinc-400">Distance</p>
                      <p className="text-sm">5.2 km</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Duration</p>
                      <p className="text-sm">32:15</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Calories</p>
                      <p className="text-sm">327 kcal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Item */}
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-zinc-800 p-2 rounded-full">
                  <Skateboard className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Skate Session</h3>
                    <span className="text-xs text-zinc-400">Yesterday, 4:15 PM</span>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <p className="text-xs text-zinc-400">Distance</p>
                      <p className="text-sm">3.8 km</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Duration</p>
                      <p className="text-sm">45:30</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Calories</p>
                      <p className="text-sm">285 kcal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Item */}
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-zinc-800 p-2 rounded-full">
                  <Footprints className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Evening Walk</h3>
                    <span className="text-xs text-zinc-400">Feb 20, 6:30 PM</span>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <p className="text-xs text-zinc-400">Distance</p>
                      <p className="text-sm">3.1 km</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Duration</p>
                      <p className="text-sm">38:45</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Calories</p>
                      <p className="text-sm">195 kcal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2 mt-6">
              <Calendar className="h-4 w-4" />
              <span>January 2023</span>
            </div>

            {/* Activity Item */}
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-zinc-800 p-2 rounded-full">
                  <Snowflake className="h-5 w-5 text-blue-300" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Snowboarding</h3>
                    <span className="text-xs text-zinc-400">Jan 28, 10:15 AM</span>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <p className="text-xs text-zinc-400">Distance</p>
                      <p className="text-sm">12.5 km</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Duration</p>
                      <p className="text-sm">2:15:30</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Calories</p>
                      <p className="text-sm">850 kcal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Item */}
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-zinc-800 p-2 rounded-full">
                  <Waves className="h-5 w-5 text-cyan-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Surfing</h3>
                    <span className="text-xs text-zinc-400">Jan 15, 8:00 AM</span>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <p className="text-xs text-zinc-400">Distance</p>
                      <p className="text-sm">N/A</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Duration</p>
                      <p className="text-sm">1:30:00</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Calories</p>
                      <p className="text-sm">620 kcal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            {/* Today's activities would be shown here */}
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-zinc-800 p-2 rounded-full">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Morning Run</h3>
                    <span className="text-xs text-zinc-400">Today, 7:30 AM</span>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <p className="text-xs text-zinc-400">Distance</p>
                      <p className="text-sm">5.2 km</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Duration</p>
                      <p className="text-sm">32:15</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Calories</p>
                      <p className="text-sm">327 kcal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="week" className="space-y-4">
            {/* This week's activities would be shown here */}
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-zinc-800 p-2 rounded-full">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Morning Run</h3>
                    <span className="text-xs text-zinc-400">Today, 7:30 AM</span>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <p className="text-xs text-zinc-400">Distance</p>
                      <p className="text-sm">5.2 km</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Duration</p>
                      <p className="text-sm">32:15</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Calories</p>
                      <p className="text-sm">327 kcal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-zinc-800 p-2 rounded-full">
                  <Skateboard className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Skate Session</h3>
                    <span className="text-xs text-zinc-400">Yesterday, 4:15 PM</span>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <p className="text-xs text-zinc-400">Distance</p>
                      <p className="text-sm">3.8 km</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Duration</p>
                      <p className="text-sm">45:30</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Calories</p>
                      <p className="text-sm">285 kcal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <TabBar activeTab="activities" />
    </main>
  )
}
