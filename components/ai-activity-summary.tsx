"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AIActivityService, type ActivityAnalysis } from "@/services/ai-activity-service"
import { Loader2, Brain, Target, Trophy, Zap } from "lucide-react"

interface AIActivitySummaryProps {
  activity: {
    type: string
    duration: number
    distance?: number
    calories: number
    pace?: number
  }
}

export function AIActivitySummary({ activity }: AIActivitySummaryProps) {
  const [analysis, setAnalysis] = useState<ActivityAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeActivity = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await AIActivityService.analyzeActivity(activity)
      setAnalysis(result)
    } catch (err) {
      setError("Failed to analyze activity")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Auto-analyze when component mounts
    analyzeActivity()
  }, [])

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span>AI analyzing your activity...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="py-4">
          <div className="text-center">
            <p className="text-red-400 mb-2">{error}</p>
            <Button onClick={analyzeActivity} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) return null

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Performance Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Analysis */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Performance
          </h4>
          <p className="text-sm text-zinc-300">{analysis.performance}</p>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Achievements Unlocked
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.achievements.map((achievement, index) => (
              <Badge key={index} variant="outline" className="bg-yellow-900/20 text-yellow-400 border-yellow-800">
                {achievement}
              </Badge>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            Improvement Tips
          </h4>
          <ul className="space-y-1">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-zinc-300 flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        {/* Motivational Message */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <p className="text-sm font-medium text-primary">{analysis.motivationalMessage}</p>
        </div>

        {/* Next Goals */}
        <div>
          <h4 className="font-semibold mb-2">Next Goals</h4>
          <div className="space-y-1">
            {analysis.nextGoals.map((goal, index) => (
              <div key={index} className="text-sm text-zinc-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                {goal}
              </div>
            ))}
          </div>
        </div>

        <Button onClick={analyzeActivity} variant="outline" size="sm" className="w-full">
          <Brain className="h-4 w-4 mr-2" />
          Re-analyze Activity
        </Button>
      </CardContent>
    </Card>
  )
}
