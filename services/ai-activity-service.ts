import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export interface ActivityAnalysis {
  performance: string
  suggestions: string[]
  achievements: string[]
  motivationalMessage: string
  nextGoals: string[]
}

export class AIActivityService {
  static async analyzeActivity(activity: {
    type: string
    duration: number
    distance?: number
    calories: number
    heartRate?: number[]
    pace?: number
  }): Promise<ActivityAnalysis> {
    try {
      const prompt = `
Analyze this fitness activity and provide insights:

Activity Type: ${activity.type}
Duration: ${activity.duration} minutes
Distance: ${activity.distance || "N/A"} km
Calories Burned: ${activity.calories}
Average Pace: ${activity.pace || "N/A"} min/km

Please provide:
1. Performance analysis (2-3 sentences)
2. 3 specific improvement suggestions
3. 2-3 achievements they unlocked
4. A motivational message
5. 2-3 next goals to work towards

Format as JSON with keys: performance, suggestions, achievements, motivationalMessage, nextGoals
`

      const { text } = await generateText({
        model: groq("llama-3.1-70b-versatile"),
        prompt,
        temperature: 0.7,
      })

      // Parse the AI response
      const analysis = JSON.parse(text)
      return analysis
    } catch (error) {
      console.error("Error analyzing activity:", error)
      // Fallback response
      return {
        performance: "Great workout! You're making excellent progress.",
        suggestions: [
          "Try increasing your duration by 10% next time",
          "Focus on maintaining consistent pace",
          "Consider adding interval training",
        ],
        achievements: [
          "Consistency Champion - Another workout completed!",
          "Calorie Crusher - Burned significant calories",
        ],
        motivationalMessage: "Every step forward is progress. Keep pushing your limits!",
        nextGoals: ["Increase workout duration", "Improve average pace", "Try a new activity type"],
      }
    }
  }

  static async generatePersonalizedChallenge(userProfile: {
    level: number
    preferredActivities: string[]
    recentPerformance: any[]
    goals: string[]
  }): Promise<{
    title: string
    description: string
    requirements: string[]
    rewards: string
    difficulty: "easy" | "medium" | "hard"
  }> {
    try {
      const prompt = `
Create a personalized fitness challenge for this user:

Level: ${userProfile.level}
Preferred Activities: ${userProfile.preferredActivities.join(", ")}
Goals: ${userProfile.goals.join(", ")}

Create a challenge that:
- Matches their fitness level
- Uses their preferred activities
- Helps achieve their goals
- Is achievable but challenging

Format as JSON with keys: title, description, requirements (array), rewards, difficulty
`

      const { text } = await generateText({
        model: groq("llama-3.1-70b-versatile"),
        prompt,
        temperature: 0.8,
      })

      return JSON.parse(text)
    } catch (error) {
      console.error("Error generating challenge:", error)
      return {
        title: "Weekly Activity Boost",
        description: "Complete multiple activities this week to earn bonus rewards",
        requirements: ["Complete 3 different activity types", "Total 150 minutes of activity", "Burn 800+ calories"],
        rewards: "50 Banana Points + 5 Shaka Tokens",
        difficulty: "medium" as const,
      }
    }
  }

  static async generateNFTDescription(attributes: {
    background: string
    clothing: string
    accessories: string[]
    activity: string
    rarity: string
  }): Promise<string> {
    try {
      const prompt = `
Create an engaging NFT description for a Prime Mates Board Club character:

Background: ${attributes.background}
Clothing: ${attributes.clothing}
Accessories: ${attributes.accessories.join(", ")}
Activity: ${attributes.activity}
Rarity: ${attributes.rarity}

Write a creative 2-3 sentence description that captures the character's personality and connection to board sports culture. Make it fun and engaging.
`

      const { text } = await generateText({
        model: groq("llama-3.1-70b-versatile"),
        prompt,
        temperature: 0.9,
      })

      return text.trim()
    } catch (error) {
      console.error("Error generating NFT description:", error)
      return "A legendary Prime Mate ready to shred the streets and waves with style and determination."
    }
  }
}
