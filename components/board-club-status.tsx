import Image from "next/image"
import { Progress } from "@/components/ui/progress"

interface BoardClubStatusProps {
  memberStatus?: string
  memberLevel?: string
  progress?: number
}

export function BoardClubStatus({
  memberStatus = "Active Member",
  memberLevel = "Prime Mate",
  progress = 75,
}: BoardClubStatusProps) {
  return (
    <div className="bg-black rounded-xl p-6 border border-zinc-800">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-[#ffc72d] rounded-md flex items-center justify-center">
          <Image src="/shaka-banana-hand.png" alt="Shaka Banana Hand" width={32} height={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Board Club Status</h3>
        </div>
      </div>

      <div className="mb-2">
        <h4 className="text-2xl font-bold text-white">{memberLevel}</h4>
        <p className="text-zinc-400">{memberStatus}</p>
      </div>

      <Progress value={progress} className="h-2 bg-zinc-800">
        <div className="h-full bg-[#ffc72d] rounded-full" style={{ width: `${progress}%` }} />
      </Progress>
    </div>
  )
}
