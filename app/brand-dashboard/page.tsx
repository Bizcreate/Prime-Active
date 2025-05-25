"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MapPin, Filter, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// This is a mock brand dashboard to demonstrate the concept
export default function BrandDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // Mock data for the dashboard
  const brandData = {
    name: "RipCurl",
    logo: "/abstract-wave-logo.png",
    stats: {
      totalUsers: 1248,
      activePatches: 876,
      challengeParticipants: 432,
      averageSessionsPerWeek: 3.2,
      topLocations: [
        { name: "Bondi Beach, Australia", count: 87 },
        { name: "Pipeline, Hawaii", count: 64 },
        { name: "Malibu, California", count: 52 },
      ],
      recentActivities: [
        {
          user: "Sarah W.",
          avatar: "/wave-rider-profile.png",
          activity: "Surfing",
          location: "Bondi Beach",
          duration: "1h 45m",
          date: "Today",
        },
        {
          user: "Mike T.",
          avatar: "/contemplative-man.png",
          activity: "Surfing",
          location: "Malibu Point",
          duration: "2h 10m",
          date: "Yesterday",
        },
        {
          user: "Emma L.",
          avatar: "/diverse-woman-portrait.png",
          activity: "Surfing",
          location: "Bells Beach",
          duration: "1h 30m",
          date: "2 days ago",
        },
      ],
      challengeStats: {
        active: 3,
        completed: 8,
        totalParticipants: 432,
        completionRate: 68,
      },
      topChallenges: [
        {
          name: "Summer Surf Series",
          participants: 128,
          completionRate: 72,
        },
        {
          name: "Dawn Patrol Challenge",
          participants: 96,
          completionRate: 64,
        },
        {
          name: "Big Wave Hunter",
          participants: 48,
          completionRate: 42,
        },
      ],
      engagementChart: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        data: [120, 150, 180, 210, 250, 320],
      },
      demographicData: {
        ageGroups: [
          { group: "18-24", percentage: 35 },
          { group: "25-34", percentage: 45 },
          { group: "35-44", percentage: 15 },
          { group: "45+", percentage: 5 },
        ],
        genderSplit: [
          { gender: "Male", percentage: 65 },
          { gender: "Female", percentage: 35 },
        ],
        activityLevel: [
          { level: "Casual", percentage: 30 },
          { level: "Regular", percentage: 45 },
          { level: "Dedicated", percentage: 25 },
        ],
      },
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center">
              <div className="relative w-10 h-10 mr-3">
                <Image
                  src={brandData.logo || "/placeholder.svg"}
                  alt={brandData.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-bold">{brandData.name} Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Overview</h2>
          <div className="flex items-center bg-zinc-900 rounded-lg">
            <Button
              variant={selectedPeriod === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod("week")}
              className="text-xs"
            >
              Week
            </Button>
            <Button
              variant={selectedPeriod === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod("month")}
              className="text-xs"
            >
              Month
            </Button>
            <Button
              variant={selectedPeriod === "year" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod("year")}
              className="text-xs"
            >
              Year
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-zinc-900">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 mb-1">Total Users</span>
                <span className="text-2xl font-bold">{brandData.stats.totalUsers}</span>
                <span className="text-xs text-green-500 mt-1">+12% this month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 mb-1">Active Patches</span>
                <span className="text-2xl font-bold">{brandData.stats.activePatches}</span>
                <span className="text-xs text-green-500 mt-1">+8% this month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 mb-1">Challenge Participants</span>
                <span className="text-2xl font-bold">{brandData.stats.challengeParticipants}</span>
                <span className="text-xs text-green-500 mt-1">+15% this month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 mb-1">Avg. Sessions/Week</span>
                <span className="text-2xl font-bold">{brandData.stats.averageSessionsPerWeek}</span>
                <span className="text-xs text-green-500 mt-1">+5% this month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="engagement" className="mb-6">
          <TabsList className="bg-zinc-900 mb-4">
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>

          <TabsContent value="engagement">
            <Card className="bg-zinc-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 relative">
                  {/* Mock chart - in a real app, use a chart library */}
                  <div className="absolute inset-0 flex items-end justify-between px-4">
                    {brandData.stats.engagementChart.data.map((value, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="w-8 bg-primary rounded-t-sm"
                          style={{ height: `${(value / 320) * 100}%` }}
                        ></div>
                        <span className="text-xs mt-2">{brandData.stats.engagementChart.labels[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges">
            <Card className="bg-zinc-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Challenge Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-zinc-800 p-3 rounded-lg">
                    <div className="text-xs text-zinc-500 mb-1">Active Challenges</div>
                    <div className="text-xl font-bold">{brandData.stats.challengeStats.active}</div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded-lg">
                    <div className="text-xs text-zinc-500 mb-1">Completed Challenges</div>
                    <div className="text-xl font-bold">{brandData.stats.challengeStats.completed}</div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded-lg">
                    <div className="text-xs text-zinc-500 mb-1">Total Participants</div>
                    <div className="text-xl font-bold">{brandData.stats.challengeStats.totalParticipants}</div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded-lg">
                    <div className="text-xs text-zinc-500 mb-1">Completion Rate</div>
                    <div className="text-xl font-bold">{brandData.stats.challengeStats.completionRate}%</div>
                  </div>
                </div>

                <h3 className="text-sm font-medium mb-2">Top Performing Challenges</h3>
                <div className="space-y-3">
                  {brandData.stats.topChallenges.map((challenge, index) => (
                    <div key={index} className="bg-zinc-800 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{challenge.name}</span>
                        <span className="text-xs bg-zinc-700 px-2 py-1 rounded-full">
                          {challenge.participants} participants
                        </span>
                      </div>
                      <div className="w-full bg-zinc-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${challenge.completionRate}%` }}></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-zinc-500">Completion Rate</span>
                        <span className="text-xs font-medium">{challenge.completionRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demographics">
            <Card className="bg-zinc-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">User Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-3">Age Distribution</h3>
                    <div className="space-y-3">
                      {brandData.stats.demographicData.ageGroups.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-xs mb-1">
                            <span>{item.group}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-zinc-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${item.percentage}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-3">Gender Split</h3>
                    <div className="space-y-3">
                      {brandData.stats.demographicData.genderSplit.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-xs mb-1">
                            <span>{item.gender}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-zinc-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${item.percentage}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-3">Activity Level</h3>
                    <div className="space-y-3">
                      {brandData.stats.demographicData.activityLevel.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-xs mb-1">
                            <span>{item.level}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-zinc-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${item.percentage}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations">
            <Card className="bg-zinc-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Popular Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-60 mb-4 bg-zinc-800 rounded-lg overflow-hidden">
                  <Image src="/world-map-dots.png" alt="Activity Map" fill className="object-cover opacity-70" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm bg-black/70 px-3 py-1 rounded-full">Interactive map in full version</span>
                  </div>
                </div>

                <h3 className="text-sm font-medium mb-2">Top Locations</h3>
                <div className="space-y-3">
                  {brandData.stats.topLocations.map((location, index) => (
                    <div key={index} className="bg-zinc-800 p-3 rounded-lg flex items-center">
                      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center mr-3">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{location.name}</div>
                        <div className="text-xs text-zinc-500">{location.count} activities</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {brandData.stats.recentActivities.map((activity, index) => (
              <div key={index} className="bg-zinc-900 p-4 rounded-lg flex items-center">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={activity.avatar || "/placeholder.svg"}
                    alt={activity.user}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-xs text-zinc-500">{activity.date}</span>
                  </div>
                  <div className="text-sm text-zinc-400">
                    {activity.activity} at {activity.location} • {activity.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline">View All Data</Button>
          <Button className="bg-primary text-black hover:bg-primary/90">Create New Challenge</Button>
        </div>
      </div>
    </div>
  )
}
