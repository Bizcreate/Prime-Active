import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

interface ChallengeCardProps {
  title: string
  description: string
  reward: string
  timeLeft: string
  sponsored?: boolean
}

export function ChallengeCard({ title, description, reward, timeLeft, sponsored }: ChallengeCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4 pt-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-white">{title}</h3>
          {sponsored && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Sponsored</span>}
        </div>
        <p className="text-sm text-zinc-400 mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-primary">
            <Trophy className="h-4 w-4" />
            <span className="font-medium">{reward}</span>
          </div>
          <div className="text-xs text-zinc-500">{timeLeft}</div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">Join Challenge</Button>
      </CardFooter>
    </Card>
  )
}
