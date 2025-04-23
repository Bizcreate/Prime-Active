"use client"

import { useState, useEffect } from "react"
import { Bell, X, Settings, Calendar, Trophy, MessageSquare, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface Notification {
  id: string
  type: "event" | "achievement" | "social" | "system" | "challenge"
  title: string
  message: string
  time: string
  read: boolean
  image?: string
  actionUrl?: string
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationSettings, setNotificationSettings] = useState({
    events: true,
    achievements: true,
    social: true,
    challenges: true,
    system: true,
    pushEnabled: false,
  })

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "event",
        title: "New Community Event",
        message: "Join the Prime Mates Beach Cleanup this Saturday at 10 AM",
        time: "2 hours ago",
        read: false,
        image: "/placeholder.svg?height=50&width=50&query=beach+cleanup+event",
        actionUrl: "/community/events",
      },
      {
        id: "2",
        type: "achievement",
        title: "Achievement Unlocked",
        message: "You've earned the 'Social Butterfly' badge for your community engagement",
        time: "Yesterday",
        read: false,
        image: "/placeholder.svg?height=50&width=50&query=butterfly+badge",
        actionUrl: "/achievements",
      },
      {
        id: "3",
        type: "social",
        title: "New Comment",
        message: "WaveMaster commented on your recent post",
        time: "2 days ago",
        read: true,
        image: "/placeholder.svg?height=50&width=50&query=wave+rider+monkey+avatar",
        actionUrl: "/social",
      },
      {
        id: "4",
        type: "challenge",
        title: "Challenge Completed",
        message: "You've completed the 'Board Club Weekly Challenge'",
        time: "3 days ago",
        read: true,
        image: "/placeholder.svg?height=50&width=50&query=trophy+gold",
        actionUrl: "/challenges",
      },
      {
        id: "5",
        type: "system",
        title: "App Update",
        message: "Prime Active has been updated with new community features",
        time: "5 days ago",
        read: true,
        actionUrl: "/settings",
      },
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter((n) => !n.read).length)
  }, [])

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const deleteNotification = (id: string) => {
    const notif = notifications.find((n) => n.id === id)
    setNotifications(notifications.filter((n) => n.id !== id))
    if (notif && !notif.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  const toggleNotificationSetting = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    })
  }

  const requestPushPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification")
      return
    }

    if (Notification.permission === "granted") {
      setNotificationSettings({
        ...notificationSettings,
        pushEnabled: true,
      })
      return
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()

      if (permission === "granted") {
        setNotificationSettings({
          ...notificationSettings,
          pushEnabled: true,
        })

        // Send a test notification
        new Notification("Prime Active", {
          body: "Push notifications enabled!",
          icon: "/prime-mates-logo.png",
        })
      }
    }
  }

  // Get icon based on notification type
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "event":
        return <Calendar className="h-5 w-5 text-primary" />
      case "achievement":
        return <Trophy className="h-5 w-5 text-primary" />
      case "social":
        return <MessageSquare className="h-5 w-5 text-primary" />
      case "challenge":
        return <Heart className="h-5 w-5 text-primary" />
      case "system":
        return <Settings className="h-5 w-5 text-primary" />
      default:
        return <Bell className="h-5 w-5 text-primary" />
    }
  }

  return (
    <>
      <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-zinc-900 z-50 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="text-lg font-bold">Notifications</h2>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="all" className="flex-1 flex flex-col">
                <div className="px-4 pt-2">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="flex-1 overflow-auto p-4 space-y-3">
                  {notifications.length === 0 ? (
                    <div className="text-center py-10">
                      <Bell className="h-10 w-10 mx-auto mb-3 text-zinc-700" />
                      <p className="text-zinc-500">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`bg-zinc-800 rounded-lg p-3 relative ${!notification.read ? "border-l-4 border-primary" : ""}`}
                        onClick={() => {
                          if (!notification.read) markAsRead(notification.id)
                        }}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            {notification.image ? (
                              <div className="w-10 h-10 rounded-full overflow-hidden relative">
                                <Image
                                  src={notification.image || "/placeholder.svg"}
                                  alt={notification.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                                {getNotificationIcon(notification.type)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-sm">{notification.title}</h3>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 -mr-1 -mt-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-zinc-400">{notification.message}</p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-zinc-500">{notification.time}</span>
                              {notification.actionUrl && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0 text-xs text-primary"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // In a real app, this would navigate to the URL
                                    markAsRead(notification.id)
                                  }}
                                >
                                  View
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="unread" className="flex-1 overflow-auto p-4 space-y-3">
                  {notifications.filter((n) => !n.read).length === 0 ? (
                    <div className="text-center py-10">
                      <Bell className="h-10 w-10 mx-auto mb-3 text-zinc-700" />
                      <p className="text-zinc-500">No unread notifications</p>
                    </div>
                  ) : (
                    notifications
                      .filter((n) => !n.read)
                      .map((notification) => (
                        <div
                          key={notification.id}
                          className="bg-zinc-800 rounded-lg p-3 relative border-l-4 border-primary"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0">
                              {notification.image ? (
                                <div className="w-10 h-10 rounded-full overflow-hidden relative">
                                  <Image
                                    src={notification.image || "/placeholder.svg"}
                                    alt={notification.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                                  {getNotificationIcon(notification.type)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium text-sm">{notification.title}</h3>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 -mr-1 -mt-1"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteNotification(notification.id)
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-zinc-400">{notification.message}</p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-zinc-500">{notification.time}</span>
                                {notification.actionUrl && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-xs text-primary"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      // In a real app, this would navigate to the URL
                                      markAsRead(notification.id)
                                    }}
                                  >
                                    View
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </TabsContent>

                <TabsContent value="settings" className="flex-1 overflow-auto p-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Push Notifications</h3>
                      <div className="bg-zinc-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-zinc-700 p-2 rounded-full">
                              <Bell className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Push Notifications</p>
                              <p className="text-xs text-zinc-400">Receive notifications even when app is closed</p>
                            </div>
                          </div>
                          <Switch
                            checked={notificationSettings.pushEnabled}
                            onCheckedChange={() => requestPushPermission()}
                          />
                        </div>
                        <Button variant="outline" size="sm" className="w-full" onClick={requestPushPermission}>
                          {notificationSettings.pushEnabled ? "Enabled" : "Enable Push Notifications"}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Notification Types</h3>
                      <div className="space-y-3">
                        <div className="bg-zinc-800 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-zinc-700 p-2 rounded-full">
                                <Calendar className="h-4 w-4 text-primary" />
                              </div>
                              <p className="font-medium">Events</p>
                            </div>
                            <Switch
                              checked={notificationSettings.events}
                              onCheckedChange={() => toggleNotificationSetting("events")}
                            />
                          </div>
                        </div>

                        <div className="bg-zinc-800 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-zinc-700 p-2 rounded-full">
                                <Trophy className="h-4 w-4 text-primary" />
                              </div>
                              <p className="font-medium">Achievements</p>
                            </div>
                            <Switch
                              checked={notificationSettings.achievements}
                              onCheckedChange={() => toggleNotificationSetting("achievements")}
                            />
                          </div>
                        </div>

                        <div className="bg-zinc-800 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-zinc-700 p-2 rounded-full">
                                <MessageSquare className="h-4 w-4 text-primary" />
                              </div>
                              <p className="font-medium">Social</p>
                            </div>
                            <Switch
                              checked={notificationSettings.social}
                              onCheckedChange={() => toggleNotificationSetting("social")}
                            />
                          </div>
                        </div>

                        <div className="bg-zinc-800 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-zinc-700 p-2 rounded-full">
                                <Heart className="h-4 w-4 text-primary" />
                              </div>
                              <p className="font-medium">Challenges</p>
                            </div>
                            <Switch
                              checked={notificationSettings.challenges}
                              onCheckedChange={() => toggleNotificationSetting("challenges")}
                            />
                          </div>
                        </div>

                        <div className="bg-zinc-800 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-zinc-700 p-2 rounded-full">
                                <Settings className="h-4 w-4 text-primary" />
                              </div>
                              <p className="font-medium">System</p>
                            </div>
                            <Switch
                              checked={notificationSettings.system}
                              onCheckedChange={() => toggleNotificationSetting("system")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
