import { Skeleton } from "@/components/ui/skeleton"
import { TabBar } from "@/components/tab-bar"

export default function ActivityHistoryLoading() {
  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-10 rounded-full mr-2" />
          <Skeleton className="h-8 w-40" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>

        <div className="mb-6">
          <Skeleton className="h-8 w-40 mb-3" />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-3 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="flex flex-col items-center">
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <TabBar activeTab="activities" />
    </main>
  )
}
