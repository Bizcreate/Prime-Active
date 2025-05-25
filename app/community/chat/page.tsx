"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Send, ImageIcon, Smile, MapPin } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useWeb3 } from "@/components/web3-provider"
import Image from "next/image"

// Mock data for chat messages
const INITIAL_MESSAGES = [
  {
    id: "msg1",
    user: {
      name: "Alex Rider",
      username: "alexrider",
      avatar: "/mystical-forest-spirit.png",
    },
    text: "Just found an awesome new skate spot near Venice Beach! Anyone want to meet up tomorrow?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    location: "Venice Beach, CA",
  },
  {
    id: "msg2",
    user: {
      name: "Wave Hunter",
      username: "wavehunter",
      avatar: "/wave-rider-profile.png",
    },
    text: "The waves are perfect at Malibu today! Earned 50 banana points this morning 🍌",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
  },
  {
    id: "msg3",
    user: {
      name: "Prime Mates Official",
      username: "primemates",
      avatar: "/prime-mates-logo.png",
      verified: true,
    },
    text: "New Board Club challenge dropping tomorrow! Get your boards ready for a chance to earn exclusive NFTs and 500 banana points! 🏄‍♂️🛹🏂",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
]

export default function CommunityChat() {
  const { isConnected, address } = useWeb3()
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [newMessage, setNewMessage] = useState("")
  const [activeChannel, setActiveChannel] = useState("general")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: `msg${Date.now()}`,
      user: {
        name: "You",
        username: "user",
        avatar: "/prime-mates-logo.png",
      },
      text: newMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const channels = [
    { id: "general", name: "General", unread: 0 },
    { id: "skate", name: "Skate Crew", unread: 3 },
    { id: "surf", name: "Surf Squad", unread: 1 },
    { id: "snow", name: "Snow Team", unread: 0 },
    { id: "challenges", name: "Challenges", unread: 2 },
  ]

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <div className="flex flex-col h-screen">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/community">
              <Button variant="ghost" size="icon" className="mr-1">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Prime Mates Chat</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 px-2 py-1 rounded-full">
              <span className="text-xs text-primary font-medium">
                {channels.find((c) => c.id === activeChannel)?.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Channels sidebar */}
          <div className="w-64 border-r border-zinc-800 p-4 hidden md:block">
            <h2 className="text-lg font-bold mb-4">Channels</h2>
            <div className="space-y-2">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${
                    activeChannel === channel.id ? "bg-zinc-800" : "hover:bg-zinc-900"
                  }`}
                  onClick={() => setActiveChannel(channel.id)}
                >
                  <span># {channel.name}</span>
                  {channel.unread > 0 && (
                    <span className="bg-primary text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {channel.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <h2 className="text-lg font-bold mt-6 mb-4">Direct Messages</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-zinc-900 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/mystical-forest-spirit.png" alt="Alex Rider" />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <span>Alex Rider</span>
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-zinc-900 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/wave-rider-profile.png" alt="Wave Hunter" />
                  <AvatarFallback>WH</AvatarFallback>
                </Avatar>
                <span>Wave Hunter</span>
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-zinc-900 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/diverse-woman-portrait.png" alt="Snow Queen" />
                  <AvatarFallback>SQ</AvatarFallback>
                </Avatar>
                <span>Snow Queen</span>
              </button>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message.user.avatar || "/placeholder.svg"} alt={message.user.name} />
                    <AvatarFallback>{message.user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{message.user.name}</span>
                      {message.user.verified && (
                        <span className="bg-primary/20 text-primary text-xs px-1 rounded">Official</span>
                      )}
                      <span className="text-xs text-zinc-500">{formatTime(message.timestamp)}</span>
                    </div>
                    <p className="text-sm mt-1">{message.text}</p>
                    {message.location && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-zinc-400">
                        <MapPin className="h-3 w-3 text-primary" />
                        <span>{message.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-zinc-800">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="bg-zinc-900 border-zinc-800"
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-zinc-500 flex items-center">
                  <span>Powered by Prime Mates Board Club</span>
                  <Image src="/banana-icon.png" alt="Banana" width={16} height={16} className="ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <TabBar activeTab="community" />
      </div>
    </main>
  )
}
