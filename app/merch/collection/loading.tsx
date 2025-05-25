import { Loader2 } from "lucide-react"

export default function CollectionLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#ffc72d]" />
        <p className="text-lg font-medium">Loading your collection...</p>
      </div>
    </div>
  )
}
