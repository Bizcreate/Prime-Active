import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2 } from "lucide-react"

interface PostCardProps {
  username: string
  avatar: string
  time: string
  content: string
  image?: string
  likes: number
  comments: number
}

export function PostCard({ username, avatar, time, content, image, likes, comments }: PostCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarImage src={avatar || "/placeholder.svg"} alt={username} />
            <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{username}</p>
            <p className="text-xs text-zinc-500">{time}</p>
          </div>
        </div>
        <p className="text-sm mb-3">{content}</p>
        {image && (
          <div className="rounded-lg overflow-hidden mb-3">
            <img src={image || "/placeholder.svg"} alt="Post" className="w-full h-auto" />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-2 border-t border-zinc-800">
        <div className="flex justify-between w-full">
          <button className="flex items-center gap-1 text-zinc-400 hover:text-primary">
            <Heart className="h-4 w-4" />
            <span className="text-xs">{likes}</span>
          </button>
          <button className="flex items-center gap-1 text-zinc-400 hover:text-primary">
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
