"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Calendar, Trophy, ExternalLink } from "lucide-react"
import Image from "next/image"

interface BrandPartnershipCardProps {
  brand: {
    name: string
    logo: string
    description: string
    partnershipLevel: "official" | "community" | "upcoming"
  }
  challenge?: {
    title: string
    description: string
    location?: string
    participants?: number
    date?: string
    reward?: string
    completed?: boolean
  }
  onJoin?: () => void
}

export function BrandPartnershipCard({ brand, challenge, onJoin }: BrandPartnershipCardProps) {
  return (
    <Card className="bg-zinc-900 overflow-hidden">
      <div className="relative h-24 bg-gradient-to-r from-zinc-800 to-zinc-900">
        <div className="absolute left-4 bottom-0 transform translate-y-1/2">
          <div className="relative w-16 h-16 bg-zinc-800 rounded-full p-2 border-4 border-zinc-900">
            <Image src={brand.logo || "/placeholder.svg"} alt={brand.name} fill className="object-contain" />
          </div>
        </div>
        {brand.partnershipLevel === "official" && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary text-black">Official Partner</Badge>
          </div>
        )}
        {brand.partnershipLevel === "community" && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-blue-600">Community Partner</Badge>
          </div>
        )}
      </div>
      <CardHeader className="pt-12 pb-2">
        <CardTitle>{brand.name}</CardTitle>
        <CardDescription>{brand.description}</CardDescription>
      </CardHeader>
      {challenge && (
        <CardContent>
          <div className="bg-zinc-800 rounded-lg p-3 mb-3">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center mr-3 flex-shrink-0">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{challenge.title}</h4>
                <p className="text-xs text-zinc-400 mb-2">{challenge.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {challenge.location && (
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-zinc-500" />
                      <span>{challenge.location}</span>
                    </div>
                  )}
                  {challenge.participants !== undefined && (
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1 text-zinc-500" />
                      <span>{challenge.participants} participants</span>
                    </div>
                  )}
                  {challenge.date && (
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-zinc-500" />
                      <span>{challenge.date}</span>
                    </div>
                  )}
                  {challenge.reward && (
                    <div className="flex items-center col-span-2">
                      <Trophy className="h-3 w-3 mr-1 text-primary" />
                      <span className="text-primary">{challenge.reward}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              View Profile
            </Button>
            {challenge.completed ? (
              <Badge className="bg-green-600">Completed</Badge>
            ) : (
              <Button size="sm" onClick={onJoin} className="bg-primary text-black hover:bg-primary/90">
                Join Challenge
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
