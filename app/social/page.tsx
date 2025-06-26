"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PostCard } from "@/components/post-card"
import Link from "next/link"
import { Search, Plus, TrendingUp, Filter, Users, Sparkles } from "lucide-react"
import { AppShell } from "@/components/app-shell"

// Mock data for posts
const mockPosts = [
  {
    id: "post1",
    username: "BananaShredder",
    avatar: "/cheerful-monkey-profile.png",
    time: "2h ago",
    content: "Just hit a new personal best at Downtown Skatepark! Earned 150 banana points today. 🍌🛹",
    image: "/sunset-ollie.png",
    likes: 24,
    comments: 8,
    location: "Downtown Skatepark",
    activity: {
      type: "skate",
      duration: "1h 45m",
      distance: "5.2 miles",
      points: 150,
    },
    verified: true,
  },
  {
    id: "post2",
    username: "WaveMaster",
    avatar: "/stoked-simian.png",
    time: "5h ago",
    content:
      "Perfect waves this morning at Malibu! Caught the barrel of my life and earned my Banana Barrel achievement. 🍌🌊",
    image: "/barrel-rider.png",
    likes: 42,
    comments: 12,
    location: "Malibu Surfrider Beach",
    activity: {
      type: "surf",
      duration: "2h 30m",
      distance: "N/A",
      points: 200,
    },
    verified: true,
  },
  {
    id: "post3",
    username: "PrimeMatesOfficial",
    avatar: "/prime-mates-logo.png",
    time: "1d ago",
    content:
      "🍌 ANNOUNCEMENT: The Banana Boardwalk event is happening this Saturday! Join us for group skating, competitions, and exclusive NFT drops. RSVP now to earn 2x banana points! 🛹",
    image: "/banana-shred.png",
    likes: 89,
    comments: 34,
    location: "Venice Beach Boardwalk",
    isOfficial: true,
    isEvent: true,
  },
  {
    id: "post4",
    username: "PowderMonkey",
    avatar: "/stoked-snowboarder-ape.png",
    time: "2d ago",
    content:
      "First snow of the season! ❄️ Getting ready for the winter shred season. Who's joining the Prime Mates Snow Trip next month?",
    image: "/waxing-snowboard-closeup.png",
    likes: 36,
    comments: 15,
    location: "Prime Mates HQ",
    activity: {
      type: "snow",
      duration: "N/A",
      distance: "N/A",
      points: 100,
    },
    verified: true,
  },
]

export default function SocialPage() {
  const [filter, setFilter] = useState("all")
  const [posts, setPosts] = useState(mockPosts)
  const [isLoading, setIsLoading] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null)
  const feedRef = useRef<HTMLDivElement>(null)

  // Filter posts based on selected filter
  const filteredPosts =
    filter === "all"
      ? posts
      : filter === "official"
        ? posts.filter((post) => post.isOfficial)
        : posts.filter((post) => post.activity?.type === filter)

  // Handle like post
  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return { ...post, likes: post.likes + 1 }
        }
        return post
      }),
    )
  }

  // Handle comment submission
  const handleSubmitComment = (postId: string) => {
    if (!commentText.trim()) return

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return { ...post, comments: post.comments + 1 }
        }
        return post
      }),
    )

    setCommentText("")
    setActiveCommentPost(null)
  }

  // Load more posts when scrolling to bottom
  const handleScroll = () => {
    if (feedRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = feedRef.current
      if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) {
        loadMorePosts()
      }
    }
  }

  // Simulate loading more posts
  const loadMorePosts = () => {
    setIsLoading(true)
    setTimeout(() => {
      setPosts([...posts, ...mockPosts.slice(0, 2)])
      setIsLoading(false)
    }, 1000)
  }

  // Add scroll event listener
  useEffect(() => {
    const currentFeedRef = feedRef.current
    if (currentFeedRef) {
      currentFeedRef.addEventListener("scroll", handleScroll)
    }
    return () => {
      if (currentFeedRef) {
        currentFeedRef.removeEventListener("scroll", handleScroll)
      }
    }
  }, [posts, isLoading])

  return (
    <AppShell>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Social Feed</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Filter className="h-5 w-5" />
            </Button>
            <Link href="/social/create-post">
              <Button size="icon" className="rounded-full bg-[#ffc72d] text-black">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full bg-zinc-800 rounded-full py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={`rounded-full px-6 ${
              filter === "all" ? "bg-white text-black" : "bg-zinc-800 text-white border-zinc-700"
            }`}
          >
            All
          </Button>
          <Button
            variant={filter === "trending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("trending")}
            className={`rounded-full px-6 flex items-center gap-1 ${
              filter === "trending" ? "bg-white text-black" : "bg-zinc-800 text-white border-zinc-700"
            }`}
          >
            <TrendingUp className="h-3 w-3" />
            Trending
          </Button>
          <Button
            variant={filter === "official" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("official")}
            className={`rounded-full px-6 flex items-center gap-1 ${
              filter === "official" ? "bg-white text-black" : "bg-zinc-800 text-white border-zinc-700"
            }`}
          >
            <Sparkles className="h-3 w-3" />
            Official
          </Button>
          <Button
            variant={filter === "skate" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("skate")}
            className={`rounded-full px-6 ${
              filter === "skate" ? "bg-white text-black" : "bg-zinc-800 text-white border-zinc-700"
            }`}
          >
            Skate
          </Button>
          <Button
            variant={filter === "surf" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("surf")}
            className={`rounded-full px-6 ${
              filter === "surf" ? "bg-white text-black" : "bg-zinc-800 text-white border-zinc-700"
            }`}
          >
            Surf
          </Button>
          <Button
            variant={filter === "snow" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("snow")}
            className={`rounded-full px-6 ${
              filter === "snow" ? "bg-white text-black" : "bg-zinc-800 text-white border-zinc-700"
            }`}
          >
            Snow
          </Button>
        </div>

        {/* Posts Feed */}
        <div ref={feedRef} className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
          {filteredPosts.length === 0 ? (
            <div className="bg-zinc-900 rounded-lg p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
              <h3 className="text-lg font-bold mb-2">No Posts</h3>
              <p className="text-zinc-400 text-sm mb-4">There are no posts matching your filters</p>
              <Button onClick={() => setFilter("all")}>Show All Posts</Button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="space-y-2">
                <PostCard
                  username={post.username}
                  avatar={post.avatar}
                  time={post.time}
                  content={post.content}
                  image={post.image}
                  likes={post.likes}
                  comments={post.comments}
                  onLike={() => handleLikePost(post.id)}
                  onComment={() => setActiveCommentPost(post.id === activeCommentPost ? null : post.id)}
                  location={post.location}
                  activity={post.activity}
                  isOfficial={post.isOfficial}
                  isEvent={post.isEvent}
                  verified={post.verified}
                />

                {/* Comment section */}
                {activeCommentPost === post.id && (
                  <div className="bg-zinc-800 rounded-lg p-3 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/stylish-macaque.png" alt="Your avatar" />
                      <AvatarFallback>YA</AvatarFallback>
                    </Avatar>
                    <Input
                      placeholder="Add a comment..."
                      className="flex-1 bg-zinc-700 border-zinc-600"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSubmitComment(post.id)
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      className="bg-[#ffc72d] text-black hover:bg-[#ffc72d]/90"
                      onClick={() => handleSubmitComment(post.id)}
                      disabled={!commentText.trim()}
                    >
                      Post
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ffc72d]"></div>
            </div>
          )}
        </div>
      </div>

      <TabBar activeTab="social" />
    </AppShell>
  )
}
