import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, Users, MapPin, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function CommunityHub() {
  return (
    <div className="space-y-4">
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <div className="relative h-24">
          <Image src="/prime-mates-logo.png" alt="Prime Mates Board Club" fill className="object-contain p-4" />
        </div>
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-2">Prime Mates Community</h2>
          <p className="text-sm text-zinc-400 mb-4">
            Connect with fellow board enthusiasts, join events, and earn rewards together.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <Link href="/community/chat">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </Button>
            </Link>
            <Link href="/community/events">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Events
              </Button>
            </Link>
            <Link href="/community/groups">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Users className="h-4 w-4" />
                Groups
              </Button>
            </Link>
            <Link href="/map">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Spots
              </Button>
            </Link>
          </div>

          <div className="bg-zinc-800 rounded-lg p-3 flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-full">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Community Challenges</p>
              <p className="text-xs text-zinc-400">Complete activities together to earn bonus rewards</p>
            </div>
            <Link href="/challenges/community" className="ml-auto">
              <Button size="sm">Join</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <h3 className="font-bold mb-2">Active Members</h3>
            <div className="flex -space-x-2 mb-3">
              <Avatar className="border-2 border-black h-8 w-8">
                <AvatarImage src="/mystical-forest-spirit.png" />
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-black h-8 w-8">
                <AvatarImage src="/wave-rider-profile.png" />
                <AvatarFallback>WH</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-black h-8 w-8">
                <AvatarImage src="/diverse-woman-portrait.png" />
                <AvatarFallback>SQ</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-black h-8 w-8">
                <AvatarImage src="/focused-marathoner.png" />
                <AvatarFallback>FM</AvatarFallback>
              </Avatar>
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-zinc-800 border-2 border-black text-xs">
                +24
              </div>
            </div>
            <Link href="/community/members">
              <Button variant="outline" size="sm" className="w-full">
                View All
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <h3 className="font-bold mb-2">Upcoming</h3>
            <div className="mb-3">
              <p className="text-sm">Venice Beach Jam</p>
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <Calendar className="h-3 w-3" />
                <span>Tomorrow, 2PM</span>
              </div>
            </div>
            <Link href="/community/events">
              <Button variant="outline" size="sm" className="w-full">
                View Events
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
