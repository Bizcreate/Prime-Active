import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-black">
      <div className="w-full max-w-md mx-auto flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center">
          <Logo size="lg" withText />

          <h1 className="text-3xl font-bold mt-8 mb-2 text-center">Move, Burn, Earn</h1>
          <p className="text-zinc-400 mb-8 text-center">Track your activities, earn rewards, and collect NFTs</p>

          <div className="w-full space-y-4 mt-4">
            <Link href="/onboarding">
              <Button className="w-full">Get Started</Button>
            </Link>

            <Link href="/login">
              <Button variant="outline" className="w-full">
                I Already Have an Account
              </Button>
            </Link>
          </div>

          <div className="mt-12 space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Track Any Activity</h2>
              <p className="text-zinc-400 text-sm">Walking, running, skateboarding, surfing, biking and more</p>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Earn While Moving</h2>
              <p className="text-zinc-400 text-sm">Convert your activities into tokens and exclusive NFTs</p>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Join the Community</h2>
              <p className="text-zinc-400 text-sm">Connect with other movers and compete in challenges</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
