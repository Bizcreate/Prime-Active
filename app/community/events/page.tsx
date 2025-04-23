"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Filter, Plus, Calendar } from "lucide-react"
import Link from "next/link"
import { CommunityEventCard } from "@/components/community-event-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function CommunityEventsPage() {
  const [filter, setFilter] = useState("all")

  // Mock events data
  const events = [
    {
      id: "event1",
      title: "Venice Beach Skate Jam",
      description: "Join us for a day of skating, challenges, and prizes at Venice Beach Skatepark.",
      date: "Saturday, May 4 • 2:00 PM",
      location: "Venice Beach Skatepark, CA",
      attendees: 24,
      maxAttendees: 50,
      image: "/urban-skate-session.png",
      category: "skate" as const,
    },
    {
      id: "event2",
      title: "Malibu Surf Competition",
      description:
        "Annual surf competition with categories for all skill levels. Earn exclusive NFTs for participating!",
      date: "Sunday, May 12 • 8:00 AM",
      location: "Malibu Beach, CA",
      attendees: 42,
      maxAttendees: 60,
      image: "/wave-rider.png",
      category: "surf" as const,
    },
    {
      id: "event3",
      title: "Prime Mates Board Club Meetup",
      description:
        "Monthly meetup for all Prime Mates members. Share stories, plan trips, and meet fellow board enthusiasts.",
      date: "Friday, May 17 • 7:00 PM",
      location: "The Banana Shack, Downtown",
      attendees: 18,
      image: "/prime-mates-logo.png",
      category: "general" as const,
    },
    {
      id: "event4",
      title: "Big Bear Mountain Weekend",
      description: "Weekend trip to Big Bear Mountain. Snowboarding, cabin stays, and evening activities.",
      date: "May 24-26 • All day",
      location: "Big Bear Mountain Resort",
      attendees: 12,
      maxAttendees: 20,
      image: "/winter-trail.png",
      category: "snow" as const,
    },
  ]

  const [attending, setAttending] = useState<string[]>([])

  const toggleAttend = (eventId: string) => {
    if (attending.includes(eventId)) {
      setAttending(attending.filter((id) => id !== eventId))
    } else {
      setAttending([...attending, eventId])
    }
  }

  const filteredEvents =
    filter === "all"
      ? events
      : filter === "attending"
        ? events.filter((event) => attending.includes(event.id))
        : events.filter((event) => event.category === filter)

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/community">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Community Events</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Upcoming Events</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
            <Link href="/community/events/create">
              <Button size="icon">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="all" onClick={() => setFilter("all")}>
              All
            </TabsTrigger>
            <TabsTrigger value="skate" onClick={() => setFilter("skate")}>
              Skate
            </TabsTrigger>
            <TabsTrigger value="surf" onClick={() => setFilter("surf")}>
              Surf
            </TabsTrigger>
            <TabsTrigger value="snow" onClick={() => setFilter("snow")}>
              Snow
            </TabsTrigger>
            <TabsTrigger value="attending" onClick={() => setFilter("attending")}>
              My Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredEvents.map((event) => (
              <CommunityEventCard
                key={event.id}
                title={event.title}
                description={event.description}
                date={event.date}
                location={event.location}
                attendees={event.attendees}
                maxAttendees={event.maxAttendees}
                image={event.image}
                category={event.category}
                isAttending={attending.includes(event.id)}
                onAttend={() => toggleAttend(event.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="skate" className="space-y-4">
            {filteredEvents.map((event) => (
              <CommunityEventCard
                key={event.id}
                title={event.title}
                description={event.description}
                date={event.date}
                location={event.location}
                attendees={event.attendees}
                maxAttendees={event.maxAttendees}
                image={event.image}
                category={event.category}
                isAttending={attending.includes(event.id)}
                onAttend={() => toggleAttend(event.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="surf" className="space-y-4">
            {filteredEvents.map((event) => (
              <CommunityEventCard
                key={event.id}
                title={event.title}
                description={event.description}
                date={event.date}
                location={event.location}
                attendees={event.attendees}
                maxAttendees={event.maxAttendees}
                image={event.image}
                category={event.category}
                isAttending={attending.includes(event.id)}
                onAttend={() => toggleAttend(event.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="snow" className="space-y-4">
            {filteredEvents.map((event) => (
              <CommunityEventCard
                key={event.id}
                title={event.title}
                description={event.description}
                date={event.date}
                location={event.location}
                attendees={event.attendees}
                maxAttendees={event.maxAttendees}
                image={event.image}
                category={event.category}
                isAttending={attending.includes(event.id)}
                onAttend={() => toggleAttend(event.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="attending" className="space-y-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <CommunityEventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  location={event.location}
                  attendees={event.attendees}
                  maxAttendees={event.maxAttendees}
                  image={event.image}
                  category={event.category}
                  isAttending={attending.includes(event.id)}
                  onAttend={() => toggleAttend(event.id)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-400">You haven't joined any events yet.</p>
                <Button className="mt-4" onClick={() => setFilter("all")}>
                  Browse Events
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <TabBar activeTab="community" />
    </main>
  )
}
