import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  unit?: string
}

export function StatCard({ icon, label, value, unit }: StatCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-800 p-2 rounded-full">{icon}</div>
          <div>
            <p className="text-xs text-zinc-400">{label}</p>
            <p className="text-lg font-semibold flex items-baseline gap-1">
              {value}
              {unit && <span className="text-xs text-zinc-400">{unit}</span>}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
