"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Activity, Trophy } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/onboarding")
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-zinc-400">Loading Prime Active...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <Card className="bg-zinc-900 border-zinc-800 max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
            <Zap className="h-10 w-10 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Prime Active</h1>
            <p className="text-zinc-400">Track activities, earn rewards, stay active</p>
          </div>
          <div className="flex items-center justify-center space-x-6 text-zinc-400">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span className="text-sm">Track</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span className="text-sm">Earn</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span className="text-sm">Reward</span>
            </div>
          </div>
          <Link href="/onboarding">
            <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium">Get Started</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
