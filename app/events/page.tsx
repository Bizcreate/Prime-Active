"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Clock,
  Star,
  Plus,
  Filter,
  CalendarDays,
  CalendarClock,
  X,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns"

export default function EventsCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  // Generate calendar days
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Mock events data
  useEffect(() => {
    setTimeout(() => {
      const mockEvents = [
        {
          id: "event1",
          title: "Banana Boardwalk",
          description: "Join us for a group skate session along the boardwalk. All skill levels welcome!",
          date: new Date(2023, 9, 15, 14, 0),
          endDate: new Date(2023, 9, 15, 16, 0),
          location: "Venice Beach Boardwalk",
          category: "skate",
          image: "/placeholder.svg?height=200&width=400&query=group+skateboarding+at+beach",
          attendees: 24,
          maxAttendees: 30,
          isAttending: true,
          organizer: "Prime Mates Board Club",
          bananaPoints: 150,
        },
        {
          id: "event2",
          title: "Dawn Patrol Surf",
          description: "Early morning surf session with the Prime Mates crew. Catch the best waves before the crowds!",
          date: new Date(2023, 9, 18, 6, 30),
          endDate: new Date(2023, 9, 18, 9, 0),
          location: "Malibu Surfrider Beach",
          category: "surf",
          image: "/placeholder.svg?height=200&width=400&query=surfers+at+dawn",
          attendees: 12,
          maxAttendees: 15,
          isAttending: false,
          organizer: "Wave Chasers",
          bananaPoints: 200,
        },
        {
          id: "event3",
          title: "Powder Day Trip",
          description:
            "Weekend trip to catch fresh powder. Transportation and lodging included for Prime Mates members.",
          date: new Date(2023, 9, 22, 7, 0),
          endDate: new Date(2023, 9, 23, 18, 0),
          location: "Big Bear Mountain",
          category: "snow",
          image: "/placeholder.svg?height=200&width=400&query=snowboarding+in+powder",
          attendees: 18,
          maxAttendees: 20,
          isAttending: true,
          organizer: "Prime Mates Board Club",
          bananaPoints: 350,
        },
        {
          id: "event4",
          title: "Skate Park Competition",
          description: "Annual Prime Mates skate competition with prizes and exclusive NFTs for winners.",
          date: new Date(2023, 9, 28, 12, 0),
          endDate: new Date(2023, 9, 28, 18, 0),
          location: "Downtown Skate Park",
          category: "skate",
          image: "/placeholder.svg?height=200&width=400&query=skate+competition",
          attendees: 45,
          maxAttendees: 50,
          isAttending: false,
          organizer: "Prime Mates Board Club",
          bananaPoints: 500,
        },
        {
          id: "event5",
          title: "Board Maintenance Workshop",
          description: "Learn how to maintain and repair your board from professional technicians.",
          date: new Date(2023, 9, 10, 15, 0),
          endDate: new Date(2023, 9, 10, 17, 0),
          location: "Prime Mates HQ",
          category: "workshop",
          image: "/placeholder.svg?height=200&width=400&query=skateboard+maintenance+workshop",
          attendees: 15,
          maxAttendees: 20,
          isAttending: true,
          organizer: "Board Tech Pros",
          bananaPoints: 100,
        },
      ]

      setEvents(mockEvents)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Get events for selected date
  const eventsForSelectedDate = events.filter((event) => isSameDay(event.date, selectedDate))

  // Filter events based on category
  const filteredEvents =
    selectedCategory === "all" ? events : events.filter((event) => event.category === selectedCategory)

  // Navigation functions
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  }

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Board Club Events</h1>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-5 w-5" />
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
          <div className="flex gap-2">
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="rounded-full"
            >
              <CalendarDays className="h-4 w-4 mr-1" />
              Calendar
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-full"
            >
              <CalendarClock className="h-4 w-4 mr-1" />
              List
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-zinc-900 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3">Event Type</h3>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                    className="rounded-full"
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedCategory === "skate" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("skate")}
                    className="rounded-full flex items-center gap-1"
                  >
                    <Image src="/shaka-icon.png" alt="Skate" width={16} height={16} className="object-contain" />
                    Skate
                  </Button>
                  <Button
                    variant={selectedCategory === "surf" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("surf")}
                    className="rounded-full"
                  >
                    Surf
                  </Button>
                  <Button
                    variant={selectedCategory === "snow" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("snow")}
                    className="rounded-full"
                  >
                    Snow
                  </Button>
                  <Button
                    variant={selectedCategory === "workshop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("workshop")}
                    className="rounded-full"
                  >
                    Workshop
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {viewMode === "calendar" && (
          <>
            {/* Calendar header */}
            <div className="bg-zinc-900 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-bold">{format(currentDate, "MMMM yyyy")}</h2>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Day names */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-zinc-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square"></div>
                ))}

                {calendarDays.map((day) => {
                  const dayEvents = events.filter((event) => isSameDay(event.date, day))
                  const hasEvents = dayEvents.length > 0
                  const isSelected = isSameDay(day, selectedDate)
                  const isCurrentMonth = isSameMonth(day, currentDate)
                  const isTodayDate = isToday(day)

                  return (
                    <motion.div
                      key={day.toString()}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer relative ${
                        isSelected ? "bg-primary text-black" : isTodayDate ? "bg-zinc-800" : "hover:bg-zinc-800"
                      } ${!isCurrentMonth ? "opacity-30" : ""}`}
                      onClick={() => setSelectedDate(day)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={`text-sm ${isSelected ? "font-bold" : ""}`}>{format(day, "d")}</span>

                      {hasEvents && (
                        <div className="flex mt-1 gap-0.5">
                          {dayEvents.slice(0, 3).map((event, i) => (
                            <div
                              key={i}
                              className={`h-1.5 w-1.5 rounded-full ${
                                event.category === "skate"
                                  ? "bg-green-500"
                                  : event.category === "surf"
                                    ? "bg-blue-500"
                                    : event.category === "snow"
                                      ? "bg-purple-500"
                                      : "bg-amber-500"
                              }`}
                            ></div>
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="text-[0.6rem] leading-none">+{dayEvents.length - 3}</span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Events for selected date */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Events for {format(selectedDate, "MMMM d, yyyy")}</h3>

              {eventsForSelectedDate.length === 0 ? (
                <div className="bg-zinc-900 rounded-lg p-6 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
                  <h3 className="text-lg font-bold mb-2">No Events</h3>
                  <p className="text-zinc-400 text-sm mb-4">There are no events scheduled for this date</p>
                  <Button>Create Event</Button>
                </div>
              ) : (
                <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="show">
                  {eventsForSelectedDate.map((event) => (
                    <motion.div
                      key={event.id}
                      className="bg-zinc-900 rounded-lg overflow-hidden"
                      variants={itemVariants}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="relative h-40">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute top-2 right-2">
                          <Badge
                            className={`
                              ${
                                event.category === "skate"
                                  ? "bg-green-500"
                                  : event.category === "surf"
                                    ? "bg-blue-500"
                                    : event.category === "snow"
                                      ? "bg-purple-500"
                                      : "bg-amber-500"
                              } text-black
                            `}
                          >
                            {event.category}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-bold text-white">{event.title}</h3>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-zinc-300 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(event.date, "h:mm a")}
                            </p>
                            <p className="text-xs text-zinc-300 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-zinc-500" />
                            <span className="text-sm">
                              {event.attendees}/{event.maxAttendees} attending
                            </span>
                          </div>
                          <div className="flex items-center gap-1 bg-primary/20 px-2 py-1 rounded-full">
                            <Image src="/banana-icon.png" alt="Banana Points" width={12} height={12} />
                            <span className="text-xs text-primary">{event.bananaPoints} points</span>
                          </div>
                        </div>
                        <Button className="w-full" variant={event.isAttending ? "outline" : "default"}>
                          {event.isAttending ? "I'm Going" : "RSVP"}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </>
        )}

        {viewMode === "list" && (
          <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="show">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden animate-pulse">
                  <div className="h-40 bg-zinc-800"></div>
                  <div className="p-4">
                    <div className="h-5 bg-zinc-800 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-zinc-800 rounded w-1/2 mb-3"></div>
                    <div className="h-10 bg-zinc-800 rounded"></div>
                  </div>
                </div>
              ))
            ) : filteredEvents.length === 0 ? (
              <div className="bg-zinc-900 rounded-lg p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
                <h3 className="text-lg font-bold mb-2">No Events</h3>
                <p className="text-zinc-400 text-sm mb-4">There are no events matching your filters</p>
                <Button onClick={() => setSelectedCategory("all")}>Show All Events</Button>
              </div>
            ) : (
              filteredEvents
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((event) => (
                  <motion.div
                    key={event.id}
                    className="bg-zinc-900 rounded-lg overflow-hidden"
                    variants={itemVariants}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="relative h-40">
                      <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute top-2 right-2">
                        <Badge
                          className={`
                            ${
                              event.category === "skate"
                                ? "bg-green-500"
                                : event.category === "surf"
                                  ? "bg-blue-500"
                                  : event.category === "snow"
                                    ? "bg-purple-500"
                                    : "bg-amber-500"
                            } text-black
                          `}
                        >
                          {event.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-bold text-white">{event.title}</h3>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-zinc-300 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(event.date, "MMM d")}
                          </p>
                          <p className="text-xs text-zinc-300 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{event.description}</p>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-zinc-500" />
                          <span className="text-sm">
                            {event.attendees}/{event.maxAttendees} attending
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-primary/20 px-2 py-1 rounded-full">
                          <Image src="/banana-icon.png" alt="Banana Points" width={12} height={12} />
                          <span className="text-xs text-primary">{event.bananaPoints} points</span>
                        </div>
                      </div>
                      <Button className="w-full" variant={event.isAttending ? "outline" : "default"}>
                        {event.isAttending ? "I'm Going" : "RSVP"}
                      </Button>
                    </div>
                  </motion.div>
                ))
            )}
          </motion.div>
        )}

        <div className="mt-6">
          <Button className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Event detail modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
            <motion.div
              className="bg-zinc-900 rounded-lg max-w-md w-full overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <div className="relative">
                <div className="h-48">
                  <Image
                    src={selectedEvent.image || "/placeholder.svg"}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50"
                  onClick={() => setSelectedEvent(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
                <div className="absolute top-2 left-2">
                  <Badge
                    className={`
                      ${
                        selectedEvent.category === "skate"
                          ? "bg-green-500"
                          : selectedEvent.category === "surf"
                            ? "bg-blue-500"
                            : selectedEvent.category === "snow"
                              ? "bg-purple-500"
                              : "bg-amber-500"
                      } text-black
                    `}
                  >
                    {selectedEvent.category}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{selectedEvent.title}</h2>
                <p className="text-zinc-400 mb-4">{selectedEvent.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Date & Time</p>
                      <p className="text-xs text-zinc-400">
                        {format(selectedEvent.date, "EEEE, MMMM d, yyyy")} • {format(selectedEvent.date, "h:mm a")} -{" "}
                        {format(selectedEvent.endDate, "h:mm a")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-xs text-zinc-400">{selectedEvent.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Attendees</p>
                      <p className="text-xs text-zinc-400">
                        {selectedEvent.attendees} going • {selectedEvent.maxAttendees - selectedEvent.attendees} spots
                        left
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Rewards</p>
                      <p className="text-xs text-zinc-400">{selectedEvent.bananaPoints} banana points for attending</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1" variant={selectedEvent.isAttending ? "outline" : "default"}>
                    {selectedEvent.isAttending ? "Cancel RSVP" : "RSVP"}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Share
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <TabBar activeTab="events" />
    </main>
  )
}
