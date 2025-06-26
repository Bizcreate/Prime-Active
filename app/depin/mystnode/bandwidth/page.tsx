import { MystBandwidthControls } from "@/components/myst-bandwidth-controls"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MystBandwidthPage() {
  return (
    <div className="container max-w-lg py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/depin/mystnode">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Bandwidth Controls</h1>
      </div>

      <MystBandwidthControls />
    </div>
  )
}
