import type React from "react"
/**
 * Very small shadcn-style Skeleton util.
 * Usage: <Skeleton className="h-4 w-40" />
 */
import { cn } from "@/lib/utils"

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-zinc-700/50", className)} {...props} />
}
