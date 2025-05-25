"use client"

import { Calendar } from "@/components/ui/calendar"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Filter,
  Camera,
  MapPin,
  Award,
  Users,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"

export default function PrimeMatesFeedPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [showComments, setShowComments] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const feedRef = useRef<HTMLDivElement>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock posts data
  useEffect(() => {
    setTimeout(() => {
      const mockPosts = [
        {
          id: "post1",
          user: {
            name: "BananaShredder",
            avatar: "/cheerful-monkey-profile.png",
            isVerified: true,
          },
          content: "Just hit a new personal best at Downtown Skatepark! Earned 150 banana points today. 🍌🛹",
          images: ["/placeholder.svg?height=400&width=600&query=skateboarding+trick+at+sunset"],
          timestamp: new Date(2023, 9, 15, 14, 30),
          likes: 24,
          comments: [
            {
              id: "comment1",
              user: {
                name: "WaveMaster",
                avatar: "/stoked-simian.png",
              },
              content: "Sick moves! 🔥",
              timestamp: new Date(2023, 9, 15, 15, 10),
            },
            {
              id: "comment2",
              user: {
                name: "PowderMonkey",
                avatar: "/stoked-snowboarder-ape.png",
              },
              content: "Those banana points adding up! Keep shredding! 🍌",
              timestamp: new Date(2023, 9, 15, 16, 5),
            },
          ],
          location: "Downtown Skatepark",
          activity: {
            type: "skate",
            duration: "1h 45m",
            distance: "5.2 miles",
            points: 150,
          },
          achievements: ["Trick Master", "Consistency King"],
        },
        {
          id: "post2",
          user: {
            name: "WaveMaster",
            avatar: "/stoked-simian.png",
            isVerified: true,
          },
          content:
            "Perfect waves this morning at Malibu! Caught the barrel of my life and earned my Banana Barrel achievement. 🍌🌊",
          images: ["/placeholder.svg?height=400&width=600&query=surfer+in+barrel+wave"],
          timestamp: new Date(2023, 9, 14, 8, 15),
          likes: 42,
          comments: [
            {
              id: "comment3",
              user: {
                name: "BananaShredder",
                avatar: "/cheerful-monkey-profile.png",
              },
              content: "That barrel looks insane! 🤙",
              timestamp: new Date(2023, 9, 14, 9, 30),
            },
          ],
          location: "Malibu Surfrider Beach",
          activity: {
            type: "surf",
            duration: "2h 30m",
            distance: "N/A",
            points: 200,
          },
          achievements: ["Barrel Rider", "Dawn Patrol"],
        },
        {
          id: "post3",
          user: {
            name: "PrimeMatesOfficial",
            avatar: "/prime-mates-logo.png",
            isVerified: true,
            isOfficial: true,
          },
          content:
            "🍌 ANNOUNCEMENT: The Banana Boardwalk event is happening this Saturday! Join us for group skating, competitions, and exclusive NFT drops. RSVP now to earn 2x banana points! 🛹",
          images: ["/placeholder.svg?height=400&width=600&query=skateboarding+event+poster+with+bananas"],
          timestamp: new Date(2023, 9, 13, 12, 0),
          likes: 89,
          comments: [
            {
              id: "comment4",
              user: {
                name: "OllieKing",
                avatar: "/rad-monkey-ollie.png",
              },
              content: "Can't wait! Will there be a best trick contest?",
              timestamp: new Date(2023, 9, 13, 12, 45),
            },
            {
              id: "comment5",
              user: {
                name: "PrimeMatesOfficial",
                avatar: "/prime-mates-logo.png",
                isOfficial: true,
              },
              content: "Yes! Best trick contest with special banana-themed prizes! 🍌🏆",
              timestamp: new Date(2023, 9, 13, 13, 10),
            },
          ],
          location: "Venice Beach Boardwalk",
          isEvent: true,
          eventDate: new Date(2023, 9, 20, 14, 0),
        },
        {
          id: "post4",
          user: {
            name: "PowderMonkey",
            avatar: "/stoked-snowboarder-ape.png",
            isVerified: true,
          },
          content:
            "First snow of the season! ❄️ Getting ready for the winter shred season. Who's joining the Prime Mates Snow Trip next month? Already earned 100 banana points just for waxing my board! 🍌",
          images: ["/placeholder.svg?height=400&width=600&query=snowboard+preparation+with+wax"],
          timestamp: new Date(2023, 9, 12, 16, 20),
          likes: 36,
          comments: [
            {
              id: "comment6",
              user: {
                name: "StreetStyler",
                avatar: "/placeholder.svg?height=100&width=100&query=street+skater+monkey+avatar",
              },
              content: "I'm in for the snow trip! Let's get those banana points! 🍌❄️",
              timestamp: new Date(2023, 9, 12, 17, 5),
            },
          ],
          location: "Prime Mates HQ",
          activity: {
            type: "snow",
            duration: "N/A",
            distance: "N/A",
            points: 100,
          },
        },
        {
          id: "post5",
          user: {
            name: "StreetStyler",
            avatar: "/placeholder.svg?height=100&width=100&query=street+skater+monkey+avatar",
            isVerified: false,
          },
          content:
            "Just got my Prime Mates NFT verified! Now I can earn 2x banana points on all my skate sessions. Check out this sick board I got with my points! 🍌🛹",
          images: ["/placeholder.svg?height=400&width=600&query=custom+skateboard+with+banana+design"],
          timestamp: new Date(2023, 9, 11, 10, 45),
          likes: 51,
          comments: [
            {
              id: "comment7",
              user: {
                name: "BananaShredder",
                avatar: "/cheerful-monkey-profile.png",
              },
              content: "That board is fire! 🔥 How many banana points did it cost?",
              timestamp: new Date(2023, 9, 11, 11, 20),
            },
            {
              id: "comment8",
              user: {
                name: "StreetStyler",
                avatar: "/placeholder.svg?height=100&width=100&query=street+skater+monkey+avatar",
              },
              content: "5000 banana points! Worth every banana! 🍌",
              timestamp: new Date(2023, 9, 11, 11, 45),
            },
          ],
          nftVerification: true,
        },
      ]

      setPosts(mockPosts)
      setIsLoading(false)
    }, 1500)
  }, [])

  // Filter posts
  const filteredPosts =
    filter === "all"
      ? posts
      : filter === "official"
        ? posts.filter((post) => post.user.isOfficial)
        : posts.filter((post) => post.activity?.type === filter)

  // Handle like post
  const handleLikePost = (postId: string) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId))
      setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: post.likes - 1 } : post)))
    } else {
      setLikedPosts([...likedPosts, postId])
      setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
    }
  }

  // Handle add comment
  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `comment-${Date.now()}`,
              user: {
                name: "You",
                avatar: "/placeholder.svg?height=100&width=100&query=cool+monkey+with+sunglasses",
              },
              content: newComment,
              timestamp: new Date(),
            },
          ],
        }
      }
      return post
    })

    setPosts(updatedPosts)
    setNewComment("")
  }

  // Pull to refresh
  const handlePullToRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/community">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Prime Mates Feed</h1>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Filter className="h-5 w-5" onClick={() => setFilter(filter === "all" ? "official" : "all")} />
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex">
            <Image
              src="/prime-mates-logo.png"
              alt="Prime Mates Board Club"
              width={100}
              height={50}
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-1 bg-primary/20 px-3 py-1 rounded-full">
            <Image src="/banana-icon.png" alt="Banana Points" width={16} height={16} className="object-contain" />
            <span className="text-xs text-primary font-medium">Board Club Feed</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="rounded-full"
          >
            All
          </Button>
          <Button
            variant={filter === "official" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("official")}
            className="rounded-full flex items-center gap-1"
          >
            <Image src="/prime-mates-logo.png" alt="Official" width={16} height={16} className="object-contain" />
            Official
          </Button>
          <Button
            variant={filter === "skate" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("skate")}
            className="rounded-full flex items-center gap-1"
          >
            <Image src="/shaka-icon.png" alt="Skate" width={16} height={16} className="object-contain" />
            Skate
          </Button>
          <Button
            variant={filter === "surf" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("surf")}
            className="rounded-full"
          >
            Surf
          </Button>
          <Button
            variant={filter === "snow" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("snow")}
            className="rounded-full"
          >
            Snow
          </Button>
        </div>

        {/* Create post button */}
        <div className="bg-zinc-900 rounded-lg p-4 mb-6 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src="/placeholder.svg?height=100&width=100&query=cool+monkey+with+sunglasses"
              alt="Your Avatar"
              fill
              className="object-cover"
            />
          </div>
          <Button variant="outline" className="flex-1 justify-start text-zinc-400">
            Share your board club activity...
          </Button>
          <Button variant="ghost" size="icon">
            <Camera className="h-5 w-5" />
          </Button>
        </div>

        {/* Pull to refresh indicator */}
        {isRefreshing && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Posts feed */}
        <div ref={feedRef}>
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-zinc-900 rounded-lg p-4 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-zinc-800 rounded-full w-10 h-10"></div>
                    <div className="space-y-2">
                      <div className="bg-zinc-800 h-4 w-24 rounded"></div>
                      <div className="bg-zinc-800 h-3 w-16 rounded"></div>
                    </div>
                  </div>
                  <div className="bg-zinc-800 h-4 w-full rounded mb-2"></div>
                  <div className="bg-zinc-800 h-4 w-3/4 rounded mb-4"></div>
                  <div className="bg-zinc-800 h-48 w-full rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="bg-zinc-800 h-8 w-20 rounded"></div>
                    <div className="bg-zinc-800 h-8 w-20 rounded"></div>
                    <div className="bg-zinc-800 h-8 w-20 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-zinc-900 rounded-lg p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
              <h3 className="text-lg font-bold mb-2">No Posts</h3>
              <p className="text-zinc-400 text-sm mb-4">There are no posts matching your filters</p>
              <Button onClick={() => setFilter("all")}>Show All Posts</Button>
            </div>
          ) : (
            <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
              {filteredPosts.map((post) => (
                <motion.div key={post.id} className="bg-zinc-900 rounded-lg overflow-hidden" variants={itemVariants}>
                  {/* Post header */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden">
                            <Image
                              src={post.user.avatar || "/placeholder.svg"}
                              alt={post.user.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {post.user.isVerified && (
                            <div className="absolute bottom-0 right-0 bg-primary rounded-full p-0.5">
                              <Image src="/shaka-icon.png" alt="Verified" width={8} height={8} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="font-medium">{post.user.name}</p>
                            {post.user.isOfficial && (
                              <Badge variant="outline" className="text-[0.6rem] py-0 h-4">
                                Official
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-zinc-500">{format(post.timestamp, "MMM d, h:mm a")}</p>
                            {post.location && (
                              <>
                                <span className="text-xs text-zinc-500">•</span>
                                <p className="text-xs text-zinc-500 flex items-center gap-0.5">
                                  <MapPin className="h-3 w-3" />
                                  {post.location}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Post content */}
                    <p className="text-sm mb-3">{post.content}</p>

                    {/* Activity stats */}
                    {post.activity && (
                      <div className="bg-zinc-800 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <Badge
                              className={`
                                ${
                                  post.activity.type === "skate"
                                    ? "bg-green-500"
                                    : post.activity.type === "surf"
                                      ? "bg-blue-500"
                                      : post.activity.type === "snow"
                                        ? "bg-purple-500"
                                        : "bg-amber-500"
                                } text-black
                              `}
                            >
                              {post.activity.type}
                            </Badge>
                            <span className="text-xs text-zinc-400">Activity</span>
                          </div>
                          <div className="flex items-center gap-1 bg-primary/20 px-2 py-0.5 rounded-full">
                            <Image src="/banana-icon.png" alt="Banana Points" width={12} height={12} />
                            <span className="text-xs text-primary">{post.activity.points} points</span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          {post.activity.duration !== "N/A" && (
                            <div className="flex-1">
                              <p className="text-xs text-zinc-400">Duration</p>
                              <p className="text-sm">{post.activity.duration}</p>
                            </div>
                          )}
                          {post.activity.distance !== "N/A" && (
                            <div className="flex-1">
                              <p className="text-xs text-zinc-400">Distance</p>
                              <p className="text-sm">{post.activity.distance}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Event info */}
                    {post.isEvent && (
                      <div className="bg-primary/10 rounded-lg p-3 mb-3 border border-primary/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <p className="text-sm font-medium">Upcoming Event</p>
                        </div>
                        <p className="text-xs mb-1">
                          {format(post.eventDate, "EEEE, MMMM d")} at {format(post.eventDate, "h:mm a")}
                        </p>
                        <p className="text-xs text-zinc-400 mb-2">{post.location}</p>
                        <Button size="sm" className="w-full">
                          RSVP
                        </Button>
                      </div>
                    )}

                    {/* NFT verification */}
                    {post.nftVerification && (
                      <div className="bg-zinc-800 rounded-lg p-3 mb-3 flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">NFT Verified</p>
                          <p className="text-xs text-zinc-400">Now earning 2x banana points</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View NFT
                        </Button>
                      </div>
                    )}

                    {/* Achievements */}
                    {post.achievements && post.achievements.length > 0 && (
                      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                        {post.achievements.map((achievement: string, index: number) => (
                          <div
                            key={index}
                            className="bg-zinc-800 rounded-full px-3 py-1 flex items-center gap-1 flex-shrink-0"
                          >
                            <Image src="/banana-icon.png" alt="Achievement" width={12} height={12} />
                            <span className="text-xs">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Post image */}
                    {post.images && post.images.length > 0 && (
                      <div className="relative h-72 rounded-lg overflow-hidden mb-3">
                        <Image
                          src={post.images[0] || "/placeholder.svg"}
                          alt="Post image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Post actions */}
                    <div className="flex justify-between items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleLikePost(post.id)}
                      >
                        <Heart
                          className={`h-5 w-5 ${likedPosts.includes(post.id) ? "fill-red-500 text-red-500" : ""}`}
                        />
                        <span>{post.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span>{post.comments.length}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Share className="h-5 w-5" />
                        <span>Share</span>
                      </Button>
                    </div>
                  </div>

                  {/* Comments section */}
                  <AnimatePresence>
                    {showComments === post.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 border-t border-zinc-800 mt-3">
                          <h4 className="text-sm font-medium mb-3">Comments</h4>

                          <div className="space-y-3 mb-3">
                            {post.comments.map((comment: any) => (
                              <div key={comment.id} className="flex gap-2">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                  <Image
                                    src={comment.user.avatar || "/placeholder.svg"}
                                    alt={comment.user.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="bg-zinc-800 rounded-lg p-2 flex-1">
                                  <div className="flex justify-between items-start">
                                    <p className="text-xs font-medium">{comment.user.name}</p>
                                    <p className="text-[0.65rem] text-zinc-500">
                                      {format(comment.timestamp, "MMM d, h:mm a")}
                                    </p>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src="/placeholder.svg?height=100&width=100&query=cool+monkey+with+sunglasses"
                                alt="Your Avatar"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 flex gap-2">
                              <Input
                                placeholder="Add a comment..."
                                className="flex-1 bg-zinc-800 border-zinc-700"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleAddComment(post.id)
                                  }
                                }}
                              />
                              <Button size="sm" onClick={() => handleAddComment(post.id)} disabled={!newComment.trim()}>
                                Post
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <TabBar activeTab="community" />
    </main>
  )
}
