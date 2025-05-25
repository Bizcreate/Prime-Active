"use client"

import { useState } from "react"
import { ArrowLeft, CheckCircle2, Clock, Flame, Calendar, Gift, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for earning opportunities
const DAILY_TASKS = [
  {
    id: "task-1",
    title: "Daily Check-in",
    description: "Sign in to the app once per day",
    reward: 10,
    rewardToken: "shaka",
    tokenName: "SHAKA",
    tokenIcon: "/shaka-coin.png",
    completed: true,
    progress: 100,
    required: 1,
    current: 1,
  },
  {
    id: "task-2",
    title: "Track an Activity",
    description: "Complete and track any activity today",
    reward: 20,
    rewardToken: "shaka",
    tokenName: "SHAKA",
    tokenIcon: "/shaka-coin.png",
    completed: false,
    progress: 0,
    required: 1,
    current: 0,
  },
  {
    id: "task-3",
    title: "Visit the Marketplace",
    description: "Browse the NFT marketplace",
    reward: 5,
    rewardToken: "shaka",
    tokenName: "SHAKA",
    tokenIcon: "/shaka-coin.png",
    completed: false,
    progress: 0,
    required: 1,
    current: 0,
  },
  {
    id: "task-4",
    title: "Share on Social",
    description: "Create a post on the social feed",
    reward: 15,
    rewardToken: "shaka",
    tokenName: "SHAKA",
    tokenIcon: "/shaka-coin.png",
    completed: false,
    progress: 0,
    required: 1,
    current: 0,
  },
]

const WEEKLY_CHALLENGES = [
  {
    id: "challenge-1",
    title: "Complete 5 Activities",
    description: "Track 5 different activities this week",
    reward: 50,
    rewardToken: "banana",
    tokenName: "BANANA",
    tokenIcon: "/shaka-banana.png",
    completed: false,
    progress: 60,
    required: 5,
    current: 3,
    daysLeft: 4,
  },
  {
    id: "challenge-2",
    title: "Visit 3 Map Locations",
    description: "Check-in at 3 different spots on the map",
    reward: 75,
    rewardToken: "banana",
    tokenName: "BANANA",
    tokenIcon: "/shaka-banana.png",
    completed: false,
    progress: 33,
    required: 3,
    current: 1,
    daysLeft: 4,
  },
  {
    id: "challenge-3",
    title: "Complete a Board Club Challenge",
    description: "Finish any active Board Club challenge",
    reward: 100,
    rewardToken: "banana",
    tokenName: "BANANA",
    tokenIcon: "/shaka-banana.png",
    completed: false,
    progress: 0,
    required: 1,
    current: 0,
    daysLeft: 4,
  },
]

const SPECIAL_EVENTS = [
  {
    id: "event-1",
    title: "Mountain Clean-up Day",
    description: "Join the community clean-up event",
    date: "May 5, 2023",
    reward: 5,
    rewardToken: "prime",
    tokenName: "PRIME",
    tokenIcon: "/activity-token-icon.png",
    location: "Mt. Wilson Trails",
    participants: 24,
  },
  {
    id: "event-2",
    title: "Surf Competition",
    description: "Participate in or attend the surf competition",
    date: "May 12, 2023",
    reward: 10,
    rewardToken: "prime",
    tokenName: "PRIME",
    tokenIcon: "/activity-token-icon.png",
    location: "Sunset Beach",
    participants: 42,
  },
  {
    id: "event-3",
    title: "Digital Art Contest",
    description: "Submit a digital art piece for the Board Club",
    date: "May 20, 2023",
    reward: 15,
    rewardToken: "prime",
    tokenName: "PRIME",
    tokenIcon: "/activity-token-icon.png",
    location: "Online",
    participants: 16,
  },
]

export default function TokenEarnPage() {
  const [activeTab, setActiveTab] = useState("daily")

  const calculateTotalPotential = (tasks: any[]) => {
    return tasks.reduce((total, task) => {
      if (!task.completed) {
        return total + task.reward
      }
      return total
    }, 0)
  }

  const tasksDailyPotential = calculateTotalPotential(DAILY_TASKS)
  const challengesPotential = calculateTotalPotential(WEEKLY_CHALLENGES)

  return (
    <div className="container max-w-md pb-16">
      <div className="flex items-center mb-6 mt-6">
        <Button variant="ghost" className="p-0 mr-2" asChild>
          <a href="/wallet">
            <ArrowLeft className="h-6 w-6" />
          </a>
        </Button>
        <h1 className="text-2xl font-bold">Earn Tokens</h1>
      </div>

      <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Daily
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-1">
            <Flame className="h-4 w-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Daily Tasks</CardTitle>
                  <CardDescription>Complete tasks to earn SHAKA tokens</CardDescription>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Gift className="h-3.5 w-3.5" />
                  <span>{tasksDailyPotential} available</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {DAILY_TASKS.map((task) => (
                <div key={task.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${task.completed ? "bg-green-100" : "bg-secondary"}`}
                  >
                    <CheckCircle2
                      className={`h-5 w-5 ${task.completed ? "text-green-600" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div className="flex-1 mr-3">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium text-sm">{task.title}</div>
                      <div className="flex items-center">
                        <img src={task.tokenIcon || "/placeholder.svg"} alt={task.tokenName} className="w-4 h-4 mr-1" />
                        <span className="text-sm font-bold">+{task.reward}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">{task.description}</div>
                    {task.completed ? (
                      <div className="text-xs text-green-600 font-medium">Completed</div>
                    ) : (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Progress value={task.progress} className="h-1.5 flex-grow mr-2" />
                        <span>
                          {task.current}/{task.required}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-amber-500" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• Complete all daily tasks for a bonus reward at the end of the week</p>
              <p>• Tasks reset every day at midnight in your local timezone</p>
              <p>• Streak bonuses are awarded for completing all tasks multiple days in a row</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Weekly Challenges</CardTitle>
                  <CardDescription>Complete challenges to earn BANANA tokens</CardDescription>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Gift className="h-3.5 w-3.5" />
                  <span>{challengesPotential} available</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {WEEKLY_CHALLENGES.map((challenge) => (
                <div key={challenge.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{challenge.title}</div>
                    <div className="flex items-center">
                      <img
                        src={challenge.tokenIcon || "/placeholder.svg"}
                        alt={challenge.tokenName}
                        className="w-4 h-4 mr-1"
                      />
                      <span className="text-sm font-bold">+{challenge.reward}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{challenge.description}</div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Progress value={challenge.progress} className="h-1.5 w-32 mr-2" />
                      <span>
                        {challenge.current}/{challenge.required}
                      </span>
                    </div>
                    <div className="text-xs flex items-center text-amber-600">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {challenge.daysLeft} days left
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Challenges
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <div className="space-y-6">
            {SPECIAL_EVENTS.map((event) => (
              <Card key={event.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{event.title}</CardTitle>
                    <div className="flex items-center">
                      <img src={event.tokenIcon || "/placeholder.svg"} alt={event.tokenName} className="w-4 h-4 mr-1" />
                      <span className="text-sm font-bold">+{event.reward}</span>
                    </div>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 mr-2 text-muted-foreground"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 mr-2 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>{event.participants} participants</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="default" className="w-full">
                    Sign Up
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
