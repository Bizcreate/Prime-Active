"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ImageIcon, MapPin, Activity, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { LocationShare } from "@/components/location-share"

export default function CreatePostPage() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [shareActivity, setShareActivity] = useState(true)
  const [shareLocation, setShareLocation] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; lat: number; lng: number } | null>(null)

  // Mock user data
  const user = {
    name: "John Doe",
    username: "johndoe",
    avatar: "/diverse-online-profiles.png",
  }

  // Mock recent activity
  const recentActivity = {
    type: "running",
    distance: "5.2 km",
    duration: "32:15",
    calories: "327",
    time: "Today, 7:30 AM",
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      alert("Please enter some content for your post")
      return
    }

    // In a real app, this would submit the post to an API
    alert("Post created successfully!")
    router.push("/social")
  }

  const handleImageUpload = () => {
    // In a real app, this would open a file picker
    // For demo purposes, we'll just set a placeholder image
    setImage("/misty-morning-trail.png")
  }

  const removeImage = () => {
    setImage(null)
  }

  const handleLocationSelect = (location: { name: string; lat: number; lng: number }) => {
    setSelectedLocation(location)
    setShowLocationPicker(false)
    setShareLocation(true)
  }

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/social">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Create Post</h1>
          </div>
          <Button size="sm" onClick={handleSubmit} disabled={!content.trim()}>
            Post
          </Button>
        </div>

        {showLocationPicker ? (
          <LocationShare onSelect={handleLocationSelect} onCancel={() => setShowLocationPicker(false)} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-zinc-400">@{user.username}</p>
              </div>
            </div>

            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-transparent border-none text-lg min-h-[120px] resize-none focus-visible:ring-0 p-0"
            />

            {image && (
              <div className="relative rounded-lg overflow-hidden">
                <img src={image || "/placeholder.svg"} alt="Post" className="w-full h-auto rounded-lg" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {selectedLocation && (
              <div className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="text-sm">{selectedLocation.name}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedLocation(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {shareActivity && recentActivity && (
              <div className="bg-zinc-900 rounded-lg p-3">
                <p className="text-xs text-zinc-400 mb-2">Share Recent Activity</p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-zinc-400">Type</p>
                    <p className="text-sm capitalize">{recentActivity.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Distance</p>
                    <p className="text-sm">{recentActivity.distance}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Duration</p>
                    <p className="text-sm">{recentActivity.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Calories</p>
                    <p className="text-sm">{recentActivity.calories} kcal</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={handleImageUpload}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setShowLocationPicker(true)}
                >
                  <MapPin className="h-5 w-5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                  <Activity className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="share-activity" className="text-sm">
                  Share Activity Details
                </label>
                <Switch id="share-activity" checked={shareActivity} onCheckedChange={setShareActivity} />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="share-location" className="text-sm">
                  Share Location
                </label>
                <Switch
                  id="share-location"
                  checked={shareLocation || !!selectedLocation}
                  onCheckedChange={(checked) => {
                    setShareLocation(checked)
                    if (!checked) setSelectedLocation(null)
                    if (checked && !selectedLocation) setShowLocationPicker(true)
                  }}
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
