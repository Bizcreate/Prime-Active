import { Card, CardContent } from "@/components/ui/card"
import { Coins } from "lucide-react"

interface TokenCardProps {
  amount: string
  change?: {
    value: string
    positive: boolean
  }
}

export function TokenCard({ amount, change }: TokenCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-full">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">$ACTIVE Balance</p>
              <p className="text-xl font-bold">{amount}</p>
            </div>
          </div>
          {change && (
            <div className={`text-xs ${change.positive ? "text-green-500" : "text-red-500"}`}>
              {change.positive ? "+" : ""}
              {change.value}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
