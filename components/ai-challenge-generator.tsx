"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIActivityService } from "@/services/ai-activity-service"
import { Loader2, Sparkles, Target, Gift } from "lucide-react"

interface Challenge {
  title: string
  description: string
  requirements: string[]
  rewards: string
  difficulty: "easy" | "medium" | "hard"
}

export function AIChallengeGenerator() {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const generateChallenge = async () => {
    setIsLoading(true)

    try {
      // Mock user profile - in real app, get from user context
      const userProfile = {
        level: 3,
        preferredActivities: ["skateboarding", "surfing", "running"],
        recentPerformance: [],
        goals: ["improve endurance", "try new activities", "earn more tokens"],
      }

      const newChallenge = await AIActivityService.generatePersonalizedChallenge(userProfile)
      setChallenge(newChallenge)
    } catch (error) {
      console.error("Error generating challenge:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-900/20 text-green-400 border-green-800"
      case "medium":
        return "bg-yellow-900/20 text-yellow-400 border-yellow-800"
      case "hard":
        return "bg-red-900/20 text-red-400 border-red-800"
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700"
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Challenge Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!challenge && !isLoading && (
          <div className="text-center py-4">
            <p className="text-zinc-400 mb-4">
              Generate a personalized challenge based on your activity history and goals
            </p>
            <Button onClick={generateChallenge} className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Challenge
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>AI creating your challenge...</span>
            </div>
          </div>
        )}

        {challenge && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{challenge.title}</h3>
              <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                {challenge.difficulty.toUpperCase()}
              </Badge>
            </div>

            <p className="text-zinc-300">{challenge.description}</p>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                Requirements
              </h4>
              <ul className="space-y-1">
                {challenge.requirements.map((req, index) => (
                  <li key={index} className="text-sm text-zinc-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Gift className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">Rewards</span>
              </div>
              <p className="text-sm text-primary">{challenge.rewards}</p>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">Accept Challenge</Button>
              <Button onClick={generateChallenge} variant="outline">
                <Sparkles className="h-4 w-4 mr-2" />
                New Challenge
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
