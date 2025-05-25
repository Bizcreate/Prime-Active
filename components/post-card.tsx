"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, MapPin, Clock, Award, Calendar, CheckCircle } from "lucide-react"
import { useState } from "react"

interface ActivityType {
  type: string
  duration: string
  distance: string
  points: number
}

interface PostCardProps {
  username: string
  avatar: string
  time: string
  content: string
  image?: string
  likes: number
  comments: number
  onLike?: () => void
  onComment?: () => void
  location?: string
  activity?: ActivityType
  isOfficial?: boolean
  isEvent?: boolean
  verified?: boolean
}

export function PostCard({
  username,
  avatar,
  time,
  content,
  image,
  likes,
  comments,
  onLike,
  onComment,
  location,
  activity,
  isOfficial,
  isEvent,
  verified,
}: PostCardProps) {
  const [liked, setLiked] = useState(false)

  const handleLike = () => {
    if (!liked) {
      setLiked(true)
      onLike?.()
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={username} />
              <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {verified && (
              <div className="absolute -bottom-1 -right-1 bg-[#ffc72d] rounded-full p-0.5">
                <CheckCircle className="h-3 w-3 text-black" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <p className="font-medium text-sm">{username}</p>
              {isOfficial && (
                <Badge variant="outline" className="text-[0.6rem] py-0 h-4">
                  Official
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="h-3 w-3" />
              <span>{time}</span>
              {location && (
                <>
                  <span>•</span>
                  <MapPin className="h-3 w-3" />
                  <span>{location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm mb-2">{content}</p>

        {/* Activity stats */}
        {activity && (
          <div className="bg-zinc-800 rounded-lg p-2 mb-2 text-xs">
            <div className="flex items-center justify-between mb-1">
              <Badge
                className={`
                  ${
                    activity.type === "skate"
                      ? "bg-green-500"
                      : activity.type === "surf"
                        ? "bg-blue-500"
                        : activity.type === "snow"
                          ? "bg-purple-500"
                          : "bg-amber-500"
                  } text-black text-[0.6rem]
                `}
              >
                {activity.type}
              </Badge>
              <div className="flex items-center gap-1 bg-[#ffc72d]/20 px-2 py-0.5 rounded-full">
                <Award className="h-3 w-3 text-[#ffc72d]" />
                <span className="text-[#ffc72d]">{activity.points} pts</span>
              </div>
            </div>
            <div className="flex gap-3">
              {activity.duration !== "N/A" && (
                <div className="flex-1">
                  <p className="text-zinc-400">Duration</p>
                  <p>{activity.duration}</p>
                </div>
              )}
              {activity.distance !== "N/A" && (
                <div className="flex-1">
                  <p className="text-zinc-400">Distance</p>
                  <p>{activity.distance}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Event info */}
        {isEvent && (
          <div className="bg-[#ffc72d]/10 rounded-lg p-2 mb-2 border border-[#ffc72d]/30 text-xs">
            <div className="flex items-center gap-1 mb-1">
              <Calendar className="h-3 w-3 text-[#ffc72d]" />
              <p className="font-medium">Upcoming Event</p>
            </div>
            <p className="text-zinc-300">Saturday, Oct 15 at 2:00 PM</p>
            <p className="text-zinc-400">{location}</p>
          </div>
        )}

        {/* Post image */}
        {image && (
          <div className="relative h-48 rounded-lg overflow-hidden mb-2">
            <img src={image || "/placeholder.svg"} alt="Post" className="w-full h-full object-cover" />
          </div>
        )}
      </CardContent>

      <CardFooter className="p-2 pt-0 border-t border-zinc-800">
        <div className="flex justify-between w-full">
          <button
            className={`flex items-center gap-1 ${liked ? "text-red-500" : "text-zinc-400 hover:text-red-500"}`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
            <span className="text-xs">{likes}</span>
          </button>
          <button className="flex items-center gap-1 text-zinc-400 hover:text-primary" onClick={onComment}>
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{comments}</span>
          </button>
          <button className="flex items-center gap-1 text-zinc-400 hover:text-primary">
            <Share2 className="h-4 w-4" />
            <span className="text-xs">Share</span>
          </button>
        </div>
      </CardFooter>
    </Card>
  )
}
