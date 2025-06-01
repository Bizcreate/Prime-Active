"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  Watch,
  TrendingUp,
  Zap,
  CheckCircle,
  Activity,
  Mountain,
  Bike,
  Mail,
  Calendar,
  FileText,
  Waves,
  Coins,
  Users,
  Wifi,
  WifiOff,
  Database,
  PieChart,
  AlertTriangle,
} from "lucide-react"
import { PDFDownloadButton } from "../components/pdf-download-button"

export default function PrimeXWatchRoadmap() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isMeetingOpen, setIsMeetingOpen] = useState(false)
  const [isExecutiveOpen, setIsExecutiveOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Thank you for your interest! We will contact you within 24 hours.")
    setIsContactOpen(false)
  }

  const handleMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Meeting request submitted! We will send you a calendar invite shortly.")
    setIsMeetingOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-purple-600/20 text-purple-300 border-purple-500/30">Partnership Roadmap</Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">PrimeX Watch</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">Move-to-Earn Meets Board Culture</p>
            <p className="text-lg text-gray-400 mb-8">
              The World's First Web3 Smartwatch for Skaters, Surfers, and Snowboarders
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Badge variant="outline" className="border-blue-500 text-blue-300">
                Bitcoin
              </Badge>
              <Badge variant="outline" className="border-green-500 text-green-300">
                Kaspa
              </Badge>
              <Badge variant="outline" className="border-purple-500 text-purple-300">
                IoTeX
              </Badge>
              <Badge variant="outline" className="border-yellow-500 text-yellow-300">
                Dogecoin
              </Badge>
              <Badge variant="outline" className="border-orange-500 text-orange-300">
                B² Network
              </Badge>
              <Badge variant="outline" className="border-cyan-500 text-cyan-300">
                TON
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => scrollToSection("project-overview")}
              >
                View Roadmap Details <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Dialog open={isExecutiveOpen} onOpenChange={setIsExecutiveOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <FileText className="mr-2 h-5 w-5" />
                    Executive Summary
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>PrimeX Watch - Executive Summary</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      <strong>Project:</strong> PrimeX Watch - Custom-branded Web3 smart wearable developed in
                      collaboration between WatchX and Prime Mates Board Club.
                    </p>
                    <p className="text-gray-300">
                      <strong>Target Market:</strong> Skaters, surfers, and snowboarders seeking activity-to-earn
                      rewards through real-world movement.
                    </p>
                    <p className="text-gray-300">
                      <strong>Technology:</strong> Multi-chain integration (Bitcoin, Kaspa, IoTeX, Dogecoin, B² Network,
                      TON) with NFT mechanics and Prime Active app connectivity.
                    </p>
                    <p className="text-gray-300">
                      <strong>Timeline:</strong> Fast-track development from June to October 2025, with Genesis Edition
                      launch in September.
                    </p>
                    <p className="text-gray-300">
                      <strong>Partnership Portal:</strong> https://v0-PrimeX-watchX-Vercel.app/
                    </p>
                    <PDFDownloadButton className="w-full bg-purple-600 hover:bg-purple-700" />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Prime Mates Community Metrics */}
      <section id="community-metrics" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Prime Mates Community</h2>
            <p className="text-xl text-gray-300">Established Web3 community ready for PrimeX Watch</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-slate-700/50 border-slate-600 text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">8,888</h3>
                <p className="text-gray-300">Prime Mates NFT Holders</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600 text-center">
              <CardContent className="p-6">
                <Activity className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">92%</h3>
                <p className="text-gray-300">Daily Active Users</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600 text-center">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">45K</h3>
                <p className="text-gray-300">Discord Members</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600 text-center">
              <CardContent className="p-6">
                <Coins className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">$2.3M</h3>
                <p className="text-gray-300">Total Trading Volume</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white text-center">Community Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">NFT Holder Retention</span>
                      <span className="text-white font-bold">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Web3 App Usage</span>
                      <span className="text-white font-bold">74%</span>
                    </div>
                    <Progress value={74} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Action Sports Participation</span>
                      <span className="text-white font-bold">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Early Adopter Rate</span>
                      <span className="text-white font-bold">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button onClick={() => scrollToSection("project-overview")} className="bg-blue-600 hover:bg-blue-700">
              View Project Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section id="project-overview" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Project Overview</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              PrimeX Watch connects directly to your Prime Active app to track real-world activity and reward users with
              cryptocurrency, NFTs, and exclusive perks
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Core Features</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Web3-Enabled Smartwatch</h4>
                    <p className="text-gray-300">
                      Co-branded WatchX hardware with Prime Mates styling, digital skins, and limited edition variants
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Activity-to-Earn</h4>
                    <p className="text-gray-300">
                      Convert steps, distance, location data, or time spent skating/surfing/snowboarding into rewards
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Multi-Crypto Rewards</h4>
                    <p className="text-gray-300">
                      Earn across 6 different blockchains based on daily activity thresholds
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Offline Syncing</h4>
                    <p className="text-gray-300">
                      Supports remote and mountain locations with background sync and device caching
                    </p>
                  </div>
                </div>
              </div>
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700" onClick={() => scrollToSection("tokenomics")}>
                View Tokenomics <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-6 text-center">
                  <Mountain className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h4 className="font-bold text-white mb-2">Snowboarding</h4>
                  <p className="text-gray-300 text-sm">Track runs, jumps, and mountain sessions</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-6 text-center">
                  <Activity className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h4 className="font-bold text-white mb-2">Skateboarding</h4>
                  <p className="text-gray-300 text-sm">Detect tricks and log street sessions</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-6 text-center">
                  <Waves className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                  <h4 className="font-bold text-white mb-2">Surfing</h4>
                  <p className="text-gray-300 text-sm">Wave tracking and surf session analytics</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-6 text-center">
                  <Bike className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h4 className="font-bold text-white mb-2">BMX</h4>
                  <p className="text-gray-300 text-sm">Air time and rotation tracking</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics Breakdown */}
      <section id="tokenomics" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Tokenomics Breakdown</h2>
            <p className="text-xl text-gray-300">Detailed reward distribution rates for each blockchain</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChart className="h-6 w-6 text-green-400" />
                  Daily Activity Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-white font-medium">Kaspa (KAS)</span>
                    </div>
                    <span className="text-gray-300">0.5-2.0 KAS/day</span>
                  </div>
                  <div className="text-xs text-gray-400 ml-5">
                    • 5,000+ steps: 0.5 KAS
                    <br />• 10,000+ steps: 1.0 KAS
                    <br />• 15,000+ steps: 2.0 KAS
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <span className="text-white font-medium">IoTeX (IOTX)</span>
                    </div>
                    <span className="text-gray-300">10-50 IOTX/km</span>
                  </div>
                  <div className="text-xs text-gray-400 ml-5">
                    • Distance-based rewards
                    <br />• Bonus for action sports activities
                    <br />• 2x multiplier for Prime Mates holders
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-white font-medium">Dogecoin (DOGE)</span>
                    </div>
                    <span className="text-gray-300">0.1-1.0 DOGE/day</span>
                  </div>
                  <div className="text-xs text-gray-400 ml-5">
                    • Streak bonuses (7, 30, 90 days)
                    <br />• Community challenges
                    <br />• Social sharing rewards
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-6 w-6 text-orange-400" />
                  Premium & Mining Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                      <span className="text-white font-medium">Bitcoin (BTC)</span>
                    </div>
                    <span className="text-gray-300">0.000001-0.00001 BTC*</span>
                  </div>
                  <div className="text-xs text-gray-400 ml-5">
                    • Virtual mining via B² Network
                    <br />• Fitness-powered mining rigs
                    <br />• Weekly payouts based on activity
                    <br />• *Subject to funding and mining equipment availability
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                      <span className="text-white font-medium">TON</span>
                    </div>
                    <span className="text-gray-300">0.1-5.0 TON</span>
                  </div>
                  <div className="text-xs text-gray-400 ml-5">
                    • Premium challenges
                    <br />• Event participation
                    <br />• Leaderboard rewards
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <span className="text-white font-medium">Prime Token</span>
                    </div>
                    <span className="text-gray-300">100-1000 PRIME</span>
                  </div>
                  <div className="text-xs text-gray-400 ml-5">
                    • Referral rewards (500 PRIME)
                    <br />• In-app utility and governance
                    <br />• Exclusive merchandise access
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-white text-center flex items-center justify-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  Reward Rate Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300 text-sm">
                  <strong>Bitcoin Mining Rewards:</strong> Rates are subject to available funding, mining equipment
                  procurement, and network difficulty. Initial rates may be lower during bootstrap phase.
                </p>
                <p className="text-gray-300 text-sm">
                  <strong>All Reward Rates:</strong> Token distribution rates may be adjusted based on treasury
                  sustainability, user adoption, and market conditions to ensure long-term ecosystem health.
                </p>
                <p className="text-gray-300 text-sm">
                  <strong>Funding Dependent:</strong> Premium mining features require additional infrastructure
                  investment and may be phased in over time based on partnership funding milestones.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button onClick={() => scrollToSection("offline-syncing")} className="bg-green-600 hover:bg-green-700">
              View Offline Features <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Offline Syncing Details */}
      <section id="offline-syncing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Offline Adventure Mode</h2>
            <p className="text-xl text-gray-300">Track activities anywhere - mountains, waves, or streets</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <WifiOff className="h-6 w-6 text-red-400" />
                  Offline Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300 text-sm">• GPS tracking without internet connection</p>
                <p className="text-gray-300 text-sm">• Local data storage up to 30 days</p>
                <p className="text-gray-300 text-sm">• Motion sensors for trick detection</p>
                <p className="text-gray-300 text-sm">• Battery optimization for extended sessions</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-6 w-6 text-blue-400" />
                  Data Caching
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300 text-sm">• Encrypted local session storage</p>
                <p className="text-gray-300 text-sm">• Automatic compression algorithms</p>
                <p className="text-gray-300 text-sm">• Duplicate session prevention</p>
                <p className="text-gray-300 text-sm">• Data integrity verification</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wifi className="h-6 w-6 text-green-400" />
                  Background Sync
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300 text-sm">• Automatic sync when connection restored</p>
                <p className="text-gray-300 text-sm">• Priority queue for reward processing</p>
                <p className="text-gray-300 text-sm">• Conflict resolution for overlapping data</p>
                <p className="text-gray-300 text-sm">• Real-time reward calculation</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-900/50 to-green-900/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white text-center">Remote Location Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-white mb-3">Mountain Adventures</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Ski resort tracking without cell towers</li>
                      <li>• Backcountry snowboarding sessions</li>
                      <li>• Altitude and weather data logging</li>
                      <li>• Emergency location beacons</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-3">Ocean & Street Sessions</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Surf sessions in remote breaks</li>
                      <li>• Skate spots without WiFi coverage</li>
                      <li>• BMX park sessions with poor signal</li>
                      <li>• Urban exploration tracking</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button onClick={() => scrollToSection("revenue-sharing")} className="bg-purple-600 hover:bg-purple-700">
              View Revenue Model <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Revenue Sharing Model */}
      <section id="revenue-sharing" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Revenue Sharing Model</h2>
            <p className="text-xl text-gray-300">Partnership terms and profit distribution</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Hardware Revenue Split</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded">
                  <span className="text-gray-300">WatchX (Manufacturing & Hardware)</span>
                  <span className="text-white font-bold">60%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded">
                  <span className="text-gray-300">Prime Mates (Software & Marketing)</span>
                  <span className="text-white font-bold">40%</span>
                </div>
                <div className="mt-4 p-4 bg-blue-900/30 rounded border border-blue-500/30">
                  <h4 className="font-bold text-white mb-2">Genesis Edition Projections</h4>
                  <p className="text-gray-300 text-sm">• 5,000 units at $299 each</p>
                  <p className="text-gray-300 text-sm">• Total revenue: $1,495,000</p>
                  <p className="text-gray-300 text-sm">• WatchX share: $897,000</p>
                  <p className="text-gray-300 text-sm">• Prime Mates share: $598,000</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/50 to-blue-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white">Ecosystem Revenue Split</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                    <span className="text-gray-300">NFT Sales</span>
                    <span className="text-white font-bold">10/90</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                    <span className="text-gray-300">Premium Subscriptions</span>
                    <span className="text-white font-bold">10/90</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                    <span className="text-gray-300">Sponsored Challenges</span>
                    <span className="text-white font-bold">10/90</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                    <span className="text-gray-300">Merchandise & Skins</span>
                    <span className="text-white font-bold">10/90</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-green-900/30 rounded border border-green-500/30">
                  <h4 className="font-bold text-white mb-2">Year 1 Projections</h4>
                  <p className="text-gray-300 text-sm">• NFT sales: $500K (WatchX: $50K)</p>
                  <p className="text-gray-300 text-sm">• Subscriptions: $300K (WatchX: $30K)</p>
                  <p className="text-gray-300 text-sm">• Sponsorships: $200K (WatchX: $20K)</p>
                  <p className="text-gray-300 text-sm">• Total ecosystem: $1M+ (WatchX: $100K)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white text-center">Partnership Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-white mb-3">WatchX Responsibilities (60% Hardware, 10% Ecosystem)</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Hardware manufacturing and quality control</li>
                      <li>• Supply chain management and logistics</li>
                      <li>• Technical support for hardware issues</li>
                      <li>• Warranty and repair services</li>
                      <li>• Hardware API development and maintenance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-3">
                      Prime Mates Responsibilities (40% Hardware, 90% Ecosystem)
                    </h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Software development and app maintenance</li>
                      <li>• Blockchain integration and smart contracts</li>
                      <li>• Community management and marketing</li>
                      <li>• NFT creation and marketplace operations</li>
                      <li>• Customer acquisition and retention</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button onClick={() => scrollToSection("technical-architecture")} className="bg-blue-600 hover:bg-blue-700">
              View Technical Architecture <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section id="technical-architecture" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Technical Architecture</h2>
            <p className="text-xl text-gray-300">Multi-chain integration and data flow visualization</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-600 p-8">
              <div className="space-y-8">
                {/* Data Flow Diagram */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-6">Data Flow Architecture</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    {/* PrimeX Watch */}
                    <div className="bg-purple-900/50 p-4 rounded-lg border border-purple-500/30">
                      <Watch className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <h4 className="font-bold text-white text-sm">PrimeX Watch</h4>
                      <p className="text-gray-300 text-xs">Sensor Data Collection</p>
                    </div>

                    <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />

                    {/* Prime Active App */}
                    <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-500/30">
                      <Activity className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <h4 className="font-bold text-white text-sm">Prime Active App</h4>
                      <p className="text-gray-300 text-xs">Data Processing & Analytics</p>
                    </div>

                    <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />

                    {/* Blockchain APIs */}
                    <div className="bg-green-900/50 p-4 rounded-lg border border-green-500/30">
                      <Zap className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <h4 className="font-bold text-white text-sm">Blockchain APIs</h4>
                      <p className="text-gray-300 text-xs">Multi-chain Rewards</p>
                    </div>
                  </div>
                </div>

                {/* Blockchain Integration */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 text-center">Blockchain Integration Layer</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-orange-900/30 p-3 rounded border border-orange-500/30 text-center">
                      <h4 className="font-bold text-orange-300 text-sm">Bitcoin Network</h4>
                      <p className="text-gray-400 text-xs">B² Network Integration</p>
                    </div>
                    <div className="bg-green-900/30 p-3 rounded border border-green-500/30 text-center">
                      <h4 className="font-bold text-green-300 text-sm">Kaspa Network</h4>
                      <p className="text-gray-400 text-xs">Fast Transaction Layer</p>
                    </div>
                    <div className="bg-purple-900/30 p-3 rounded border border-purple-500/30 text-center">
                      <h4 className="font-bold text-purple-300 text-sm">IoTeX Network</h4>
                      <p className="text-gray-400 text-xs">IoT Device Integration</p>
                    </div>
                    <div className="bg-yellow-900/30 p-3 rounded border border-yellow-500/30 text-center">
                      <h4 className="font-bold text-yellow-300 text-sm">Dogecoin Network</h4>
                      <p className="text-gray-400 text-xs">Community Rewards</p>
                    </div>
                    <div className="bg-cyan-900/30 p-3 rounded border border-cyan-500/30 text-center">
                      <h4 className="font-bold text-cyan-300 text-sm">TON Network</h4>
                      <p className="text-gray-400 text-xs">Premium Features</p>
                    </div>
                    <div className="bg-red-900/30 p-3 rounded border border-red-500/30 text-center">
                      <h4 className="font-bold text-red-300 text-sm">Prime Token</h4>
                      <p className="text-gray-400 text-xs">Ecosystem Utility</p>
                    </div>
                  </div>
                </div>

                {/* Smart Contract Flow */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 text-center">Smart Contract Workflow</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-700/50 p-4 rounded border border-slate-500/30">
                      <h4 className="font-bold text-white text-sm mb-2">1. Activity Validation</h4>
                      <p className="text-gray-300 text-xs">• GPS verification</p>
                      <p className="text-gray-300 text-xs">• Motion pattern analysis</p>
                      <p className="text-gray-300 text-xs">• Anti-cheat mechanisms</p>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded border border-slate-500/30">
                      <h4 className="font-bold text-white text-sm mb-2">2. Reward Calculation</h4>
                      <p className="text-gray-300 text-xs">• Activity type multipliers</p>
                      <p className="text-gray-300 text-xs">• NFT holder bonuses</p>
                      <p className="text-gray-300 text-xs">• Streak calculations</p>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded border border-slate-500/30">
                      <h4 className="font-bold text-white text-sm mb-2">3. Token Distribution</h4>
                      <p className="text-gray-300 text-xs">• Multi-chain payouts</p>
                      <p className="text-gray-300 text-xs">• Gas optimization</p>
                      <p className="text-gray-300 text-xs">• Batch processing</p>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded border border-slate-500/30">
                      <h4 className="font-bold text-white text-sm mb-2">4. NFT Minting</h4>
                      <p className="text-gray-300 text-xs">• Session metadata</p>
                      <p className="text-gray-300 text-xs">• Achievement tracking</p>
                      <p className="text-gray-300 text-xs">• Rarity algorithms</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button onClick={() => scrollToSection("roadmap")} className="bg-green-600 hover:bg-green-700">
              View Development Roadmap <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Accelerated Roadmap */}
      <section id="roadmap" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Development Roadmap</h2>
            <p className="text-xl text-gray-300">Fast-track development from June to October 2025</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">June 2025 - Partnership Finalization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-gray-300 text-sm">• Confirm WatchX co-branded hardware & UI/UX design</p>
                  <p className="text-gray-300 text-sm">• Define data points mapped to token rewards</p>
                  <p className="text-gray-300 text-sm">• Finalize token reward tiers per activity level per chain</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">July 2025 - MVP Development</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-gray-300 text-sm">• Integrate WatchX wearable API into Prime Active app</p>
                  <p className="text-gray-300 text-sm">• Implement reward distribution smart contracts</p>
                  <p className="text-gray-300 text-sm">• Build NFT minting logic: sessions → digital collectibles</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">August 2025 - Closed Beta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-gray-300 text-sm">• Release to Prime Mates NFT holders and key testers</p>
                  <p className="text-gray-300 text-sm">• Onboard crypto wallets (TON, Kaspa, Doge, IoTeX)</p>
                  <p className="text-gray-300 text-sm">• Launch referral challenge for early users</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">September 2025 - Public Launch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-gray-300 text-sm">• Limited run of Genesis Edition PrimeX Watches</p>
                  <p className="text-gray-300 text-sm">• Full app rollout with multi-chain reward engine</p>
                  <p className="text-gray-300 text-sm">• Enable daily mining with in-app fitness activity</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30 p-8">
                <h3 className="text-2xl font-bold text-white mb-4">October 2025 - Scaling & Events</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-gray-300 text-sm mb-2">
                      • Launch major surf/skate/snow event with token-based entry
                    </p>
                    <p className="text-gray-300 text-sm">• Enable smart token burn or use for in-app store</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm mb-2">• Introduce partner-sponsored watch skins & missions</p>
                    <p className="text-gray-300 text-sm">• Launch DAO-style voting for community-led features</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button onClick={() => scrollToSection("next-steps")} className="bg-blue-600 hover:bg-blue-700">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section id="next-steps" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Next Steps</h2>
            <p className="text-xl text-gray-300">Let's bring PrimeX Watch to life</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Partnership Discussion</h3>
                <p className="text-gray-300">Finalize WatchX co-branded hardware design and technical specifications</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Development Kickoff</h3>
                <p className="text-gray-300">
                  Begin API integration and smart contract development for multi-chain rewards
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Genesis Launch</h3>
                <p className="text-gray-300">Launch limited edition PrimeX Watch with full Web3 integration</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Dialog open={isMeetingOpen} onOpenChange={setIsMeetingOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule Partnership Meeting
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-600 text-white">
                  <DialogHeader>
                    <DialogTitle>Schedule Partnership Meeting</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleMeetingSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" placeholder="WatchX" className="bg-slate-700 border-slate-600" required />
                    </div>
                    <div>
                      <Label htmlFor="contact-name">Contact Name</Label>
                      <Input
                        id="contact-name"
                        placeholder="Your name"
                        className="bg-slate-700 border-slate-600"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@watchx.com"
                        className="bg-slate-700 border-slate-600"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferred-date">Preferred Meeting Date</Label>
                      <Input id="preferred-date" type="date" className="bg-slate-700 border-slate-600" required />
                    </div>
                    <div>
                      <Label htmlFor="meeting-notes">Meeting Notes</Label>
                      <Textarea
                        id="meeting-notes"
                        placeholder="Topics you'd like to discuss..."
                        className="bg-slate-700 border-slate-600"
                        rows={3}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                      Schedule Meeting
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 border-t border-slate-700">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Launch PrimeX Watch?</h3>
          <p className="text-gray-300 mb-4">Let's create the future of Web3 action sports wearables together</p>
          <p className="text-sm text-gray-400 mb-6">Partnership Portal: https://v0-PrimeX-watchX-Vercel.app/</p>
          <div className="flex justify-center gap-4">
            <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Prime Mates Team
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-600 text-white">
                <DialogHeader>
                  <DialogTitle>Contact Prime Mates Board Club</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" className="bg-slate-700 border-slate-600" required />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="your@email.com"
                      className="bg-slate-700 border-slate-600"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-name">Company</Label>
                    <Input id="company-name" placeholder="WatchX" className="bg-slate-700 border-slate-600" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your interest in the PrimeX Watch partnership..."
                      className="bg-slate-700 border-slate-600"
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    Send Message
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <PDFDownloadButton className="bg-purple-600 hover:bg-purple-700" />
          </div>
        </div>
      </footer>
    </div>
  )
}
