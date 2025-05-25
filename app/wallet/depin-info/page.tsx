import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DePINInfoPage() {
  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center">
        <Link href="/wallet" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Wallet
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">DePIN Mining Rewards</h1>
        <p className="text-muted-foreground mt-2">
          Learn how Prime Active integrates with IoTeX and other DePIN networks to reward your activities
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>How IoTeX Mining Works</CardTitle>
          <CardDescription>Understanding the reward system and how to maximize your earnings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Base Mining Rewards</h3>
            <p className="text-sm text-muted-foreground">
              The base mining reward is 50% of the standard IoTeX mining rate. This ensures that all users receive a
              baseline reward for participating in the network.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Merchandise Wear-to-Earn Bonus</h3>
            <p className="text-sm text-muted-foreground">
              By wearing and using Prime Active merchandise with embedded NFC tags, you can earn up to a 2x multiplier
              on your base mining rewards. The more merchandise you wear and the more frequently you use it, the higher
              your multiplier will be.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Activity Bonus</h3>
            <p className="text-sm text-muted-foreground">
              Your overall activity on the platform also contributes to your mining rewards. This includes tracking
              workouts, participating in challenges, attending events, and engaging with the community. The more active
              you are, the higher your activity multiplier will be, up to 2x your base mining rewards.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Maximum Potential</h3>
            <p className="text-sm text-muted-foreground">
              By maximizing both your merchandise usage and platform activity, you can earn up to 5x the base mining
              rewards (base + 2x wear bonus + 2x activity bonus). This system rewards users who are most engaged with
              the Prime Active ecosystem.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">How often are rewards calculated?</h3>
            <p className="text-sm text-muted-foreground">
              Rewards are calculated in real-time but are distributed on a daily, weekly, or monthly basis depending on
              your preference.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">How do I increase my wear-to-earn multiplier?</h3>
            <p className="text-sm text-muted-foreground">
              Purchase and regularly use Prime Active merchandise with embedded NFC tags. Each time you scan the NFC tag
              during an activity, it contributes to your wear-to-earn status.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">What activities count toward my activity multiplier?</h3>
            <p className="text-sm text-muted-foreground">
              All tracked workouts, challenges, events, and community engagements contribute to your activity level. The
              more diverse and frequent your activities, the higher your multiplier.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Can I withdraw my IoTeX tokens?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can withdraw your earned IoTeX tokens to any compatible wallet. Go to the Wallet page and select
              "Withdraw" to transfer your tokens.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About IoTeX</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <img src="/iotex-logo.png" alt="IoTeX Logo" className="h-12 w-12" />
            <div>
              <h3 className="font-semibold">IoTeX Network</h3>
              <p className="text-sm text-muted-foreground">
                A decentralized network dedicated to powering the Internet of Trusted Things
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            IoTeX is a decentralized platform that combines blockchain, secure hardware, and confidential computing to
            empower privacy-focused devices and applications. By integrating with IoTeX, Prime Active enables you to
            earn cryptocurrency rewards for your physical activities and engagement with the platform.
          </p>

          <div className="pt-2">
            <Link
              href="https://iotex.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Learn more about IoTeX
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
