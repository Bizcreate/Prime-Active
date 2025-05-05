import { Loader2 } from "lucide-react"

export function FallbackPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h1 className="text-xl font-bold mb-2">Loading Prime Active</h1>
        <p className="text-zinc-400">Please wait while we set things up...</p>
      </div>
    </div>
  )
}
