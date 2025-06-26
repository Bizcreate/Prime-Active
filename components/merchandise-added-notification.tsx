"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface MerchandiseAddedNotificationProps {
  merchandiseId?: string
}

export function MerchandiseAddedNotification({ merchandiseId }: MerchandiseAddedNotificationProps) {
  const router = useRouter()

  const handleViewMerchandise = () => {
    if (merchandiseId) {
      router.push(`/merch/collection?highlight=${merchandiseId}`)
    } else {
      router.push("/merch/collection")
    }
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#ffc72d]/20 flex items-center justify-center">
          <ShoppingBag className="h-6 w-6 text-[#ffc72d]" />
        </div>
        <h2 className="text-xl font-bold">Merchandise Added</h2>
      </div>
      <p className="text-zinc-400 mb-6">
        Your merchandise items have been added to your collection. You can now track wear time and earn tokens!
      </p>
      <Button className="w-full bg-[#ffc72d] hover:bg-[#e6b328] text-black" onClick={handleViewMerchandise}>
        View My Merchandise
      </Button>
    </div>
  )
}
