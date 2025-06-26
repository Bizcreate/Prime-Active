"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TabBar } from "@/components/tab-bar"
import Link from "next/link"
import { ArrowLeft, MapPin, Trophy, Camera, Users, Flame } from "lucide-react"

export default function CreateChallengePage() {
  const [challengeType, setChallengeType] = useState("trick")
  const [duration, setDuration] = useState(3) // days
  const [reward, setReward] = useState(100) // PRIME tokens
  const [isLocationBased, setIsLocationBased] = useState(true)
  const [isNftReward, setIsNftReward] = useState(false)
  const [participantLimit, setParticipantLimit] = useState(10)

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-4">
        <div className="flex items-center mb-6">
          <Link href="/challenges">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Create Challenge</h1>
        </div>

        <div className="space-y-6">
          {/* Challenge Type */}
          <div>
            <Label className="text-sm text-zinc-400">Challenge Type</Label>
            <Select value={challengeType} onValueChange={setChallengeType}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800">
                <SelectValue placeholder="Select challenge type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="trick">Trick Challenge</SelectItem>
                <SelectItem value="distance">Distance Challenge</SelectItem>
                <SelectItem value="photo">Photo Challenge</SelectItem>
                <SelectItem value="skate">Game of SKATE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Challenge Name */}
          <div>
            <Label htmlFor="name" className="text-sm text-zinc-400">
              Challenge Name
            </Label>
            <Input id="name" placeholder="Enter challenge name" className="bg-zinc-900 border-zinc-800" />
          </div>

          {/* Challenge Description */}
          <div>
            <Label htmlFor="description" className="text-sm text-zinc-400">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your challenge..."
              className="bg-zinc-900 border-zinc-800 resize-none h-24"
            />
          </div>

          {/* Location Based */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#ffc72d]" />
              <div>
                <p className="font-medium">Location Based</p>
                <p className="text-xs text-zinc-400">Require participants to be at a specific location</p>
              </div>
            </div>
            <Switch checked={isLocationBased} onCheckedChange={setIsLocationBased} />
          </div>

          {/* Location Selection (if location based) */}
          {isLocationBased && (
            <div>
              <Label className="text-sm text-zinc-400">Select Location</Label>
              <Select>
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <SelectValue placeholder="Choose a location" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="downtown">Downtown Skatepark</SelectItem>
                  <SelectItem value="beach">Sunset Beach</SelectItem>
                  <SelectItem value="mountain">Mountain Trail</SelectItem>
                  <SelectItem value="prime">Prime Mates Surf Spot</SelectItem>
                  <SelectItem value="shaka">Shaka Point</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Challenge Duration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm text-zinc-400">Duration (days)</Label>
              <span className="text-sm font-medium">{duration} days</span>
            </div>
            <Slider
              value={[duration]}
              min={1}
              max={14}
              step={1}
              onValueChange={(value) => setDuration(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>1 day</span>
              <span>7 days</span>
              <span>14 days</span>
            </div>
          </div>

          {/* Participant Limit */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#ffc72d]" />
                <Label className="text-sm">Participant Limit</Label>
              </div>
              <span className="text-sm font-medium">{participantLimit} users</span>
            </div>
            <Slider
              value={[participantLimit]}
              min={2}
              max={50}
              step={1}
              onValueChange={(value) => setParticipantLimit(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>2</span>
              <span>25</span>
              <span>50</span>
            </div>
          </div>

          {/* Verification Method */}
          <div>
            <Label className="text-sm text-zinc-400">Verification Method</Label>
            <Select>
              <SelectTrigger className="bg-zinc-900 border-zinc-800">
                <SelectValue placeholder="How will participants verify completion?" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="photo">Photo/Video Submission</SelectItem>
                <SelectItem value="gps">GPS Tracking</SelectItem>
                <SelectItem value="witness">Witness Verification</SelectItem>
                <SelectItem value="community">Community Voting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reward Settings */}
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#ffc72d]" />
              Reward Settings
            </h3>

            {/* Token Reward */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm">$PRIME Token Reward</Label>
                <span className="text-sm font-medium">{reward} $PRIME</span>
              </div>
              <Slider
                value={[reward]}
                min={0}
                max={500}
                step={10}
                onValueChange={(value) => setReward(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>0</span>
                <span>250</span>
                <span>500</span>
              </div>
            </div>

            {/* XP Reward */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-[#ffc72d]" />
                  <p className="text-sm">XP Reward</p>
                </div>
                <p className="text-sm font-medium">+100 XP</p>
              </div>
            </div>

            {/* NFT Reward */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">NFT Reward</p>
                <p className="text-xs text-zinc-400">Mint a special NFT for winners</p>
              </div>
              <Switch checked={isNftReward} onCheckedChange={setIsNftReward} />
            </div>

            {isNftReward && (
              <div className="mt-4 p-3 bg-zinc-800 rounded-lg flex items-center gap-3">
                <div className="h-12 w-12 bg-zinc-700 rounded-lg flex items-center justify-center">
                  <Camera className="h-6 w-6 text-zinc-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Upload NFT Image</p>
                  <p className="text-xs text-zinc-400">PNG, JPG or GIF, max 10MB</p>
                </div>
                <Button size="sm" variant="outline">
                  Upload
                </Button>
              </div>
            )}
          </div>

          {/* Create Button */}
          <Button className="w-full bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90">Create Challenge</Button>
        </div>
      </div>

      <TabBar activeTab="challenges" />
    </div>
  )
}
