import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import Image from "next/image"
import type { ConnectedMerchandise } from "@/services/nfc-service"

interface MerchandiseCardProps {
  item: ConnectedMerchandise
}

export function MerchandiseCard({ item }: MerchandiseCardProps) {
  const formatWearTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours < 24) {
      return `${hours}h ${remainingMinutes}m`
    }

    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24

    return `${days}d ${remainingHours}h`
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
      <div className="relative aspect-square bg-zinc-800">
        <Image src={item.image || "/placeholder.svg"} alt={item.productName} fill className="object-contain p-4" />
        {item.isCurrentlyWorn && (
          <div className="absolute top-2 right-2 bg-green-500 text-black text-xs px-2 py-0.5 rounded-full">Active</div>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium truncate">{item.productName}</h3>
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center text-xs text-zinc-400">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatWearTime(item.totalWearTime)}</span>
          </div>
          <div className="flex items-center text-xs text-[#ffc72d]">
            <Image src="/shaka-banana-hand.png" alt="Tokens" width={12} height={12} className="mr-1" />
            <span>{item.tokenRewards}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
