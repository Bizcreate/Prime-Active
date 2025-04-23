import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Award, Zap, Users, Wallet, Activity, MapPin } from "lucide-react"
import { Logo } from "@/components/logo"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Logo size="md" withText variant="default" />
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-primary">
              Login
            </Link>
            <Link href="/onboarding">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black to-zinc-900 py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/banana-board-stickers.png')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />

        <div className="container relative mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
                Move, Shred, <span className="text-primary">Earn</span>
              </h1>
              <p className="mb-8 text-xl text-zinc-400">
                Track your activities, earn rewards, and join the Prime Mates Board Club community. Convert your active
                lifestyle into digital assets.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="gap-2">
                  Download App <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  Learn More
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-zinc-400">Earn NFTs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-zinc-400">Track Activities</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-zinc-400">Join Community</span>
                </div>
              </div>
            </div>

            <div className="relative mx-auto aspect-[4/5] w-full max-w-xs md:max-w-md">
              <div className="absolute left-0 top-0 h-full w-full rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-xl" />
              <div className="absolute left-4 top-4 h-full w-full rounded-2xl border border-primary/20 bg-black/80 shadow-lg" />
              <div className="absolute left-2 top-2 h-full w-full overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
                <Image
                  src="/fitness-journey-dashboard.png"
                  alt="Prime Active App"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-zinc-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Prime Active rewards you for your physical activities. The more you move, the more you earn.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-primary/50 hover:bg-zinc-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Track Activities</h3>
              <p className="text-zinc-400">
                Record your skateboarding, surfing, snowboarding, walking, running, and other activities automatically.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-primary/50 hover:bg-zinc-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Earn Rewards</h3>
              <p className="text-zinc-400">
                Convert your activities into Banana Points and Shaka Coins. Unlock exclusive NFTs and digital assets.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-primary/50 hover:bg-zinc-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Discover Spots</h3>
              <p className="text-zinc-400">
                Find the best skateparks, surf spots, and trails. Check in to earn bonus rewards and meet other members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Screenshots */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">App Features</h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Explore the Prime Active app and discover all the features designed to enhance your active lifestyle.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <div className="relative aspect-[9/16] w-full max-w-[220px] overflow-hidden rounded-3xl border border-zinc-800 shadow-lg">
              <Image src="/dashboard-screenshot.png" alt="Dashboard" fill className="object-cover" priority />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <p className="text-center font-medium text-white">Activity Dashboard</p>
              </div>
            </div>

            <div className="relative aspect-[9/16] w-full max-w-[220px] overflow-hidden rounded-3xl border border-zinc-800 shadow-lg">
              <Image src="/rewards-screenshot.png" alt="Rewards" fill className="object-cover" priority />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <p className="text-center font-medium text-white">Rewards Gallery</p>
              </div>
            </div>

            <div className="relative aspect-[9/16] w-full max-w-[220px] overflow-hidden rounded-3xl border border-zinc-800 shadow-lg">
              <Image src="/wallet-screenshot.png" alt="Wallet" fill className="object-cover" priority />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <p className="text-center font-medium text-white">Digital Wallet</p>
              </div>
            </div>

            <div className="relative aspect-[9/16] w-full max-w-[220px] overflow-hidden rounded-3xl border border-zinc-800 shadow-lg">
              <Image src="/map-screenshot.png" alt="Map" fill className="object-cover" priority />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <p className="text-center font-medium text-white">Spot Finder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NFT Showcase */}
      <section className="bg-zinc-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Exclusive NFTs</h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Earn unique Prime Mates NFTs by completing challenges and reaching milestones.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="nft-card rounded-xl p-4">
              <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg">
                <Image src="/skateboarding-monkey.png" alt="Skateboarding Monkey NFT" fill className="object-cover" />
              </div>
              <h3 className="mb-1 text-lg font-bold text-white">Skateboarding Monkey</h3>
              <p className="text-sm text-zinc-400">Earned by completing skateboarding challenges</p>
            </div>

            <div className="nft-card rounded-xl p-4">
              <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg">
                <Image src="/surfing-monkey.png" alt="Surfing Monkey NFT" fill className="object-cover" />
              </div>
              <h3 className="mb-1 text-lg font-bold text-white">Surfing Monkey</h3>
              <p className="text-sm text-zinc-400">Earned by completing surfing challenges</p>
            </div>

            <div className="nft-card rounded-xl p-4">
              <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg">
                <Image src="/snowboarding-monkey.png" alt="Snowboarding Monkey NFT" fill className="object-cover" />
              </div>
              <h3 className="mb-1 text-lg font-bold text-white">Snowboarding Monkey</h3>
              <p className="text-sm text-zinc-400">Earned by completing snowboarding challenges</p>
            </div>

            <div className="nft-card rounded-xl p-4">
              <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg">
                <Image src="/banana-shredder.png" alt="Banana Shredder NFT" fill className="object-cover" />
              </div>
              <h3 className="mb-1 text-lg font-bold text-white">Banana Shredder</h3>
              <p className="text-sm text-zinc-400">Exclusive NFT for top performers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">What Our Users Say</h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Join thousands of active users who are already earning rewards with Prime Active.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image src="/wave-rider-profile.png" alt="Jake S." fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Jake S.</h3>
                  <p className="text-sm text-zinc-400">Surfer</p>
                </div>
              </div>
              <p className="text-zinc-400">
                "I've earned 3 exclusive NFTs just by hitting the waves! The app tracks my sessions perfectly and the
                rewards are awesome. Love being part of the Prime Mates community."
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image src="/urban-skater-motion.png" alt="Mia T." fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Mia T.</h3>
                  <p className="text-sm text-zinc-400">Skateboarder</p>
                </div>
              </div>
              <p className="text-zinc-400">
                "Prime Active has connected me with other skaters in my area. I've discovered new spots and earned
                Banana Points that I've used to get exclusive gear. It's a game-changer!"
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image src="/powder-day-shred.png" alt="Alex R." fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Alex R.</h3>
                  <p className="text-sm text-zinc-400">Snowboarder</p>
                </div>
              </div>
              <p className="text-zinc-400">
                "I've staked my Snowboarding Monkey NFT and earn passive Shaka Coins while I'm not on the slopes. The
                app has made my winter activities even more rewarding!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/20 via-black to-primary/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Ready to Activate and Earn?</h2>
            <p className="mb-10 text-xl text-zinc-400">
              Download the Prime Active app today and start converting your activities into digital rewards.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2">
                Download for iOS <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                Download for Android <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Logo size="md" withText variant="default" />
              <p className="mt-4 text-sm text-zinc-400">
                Move, shred, and earn rewards with the Prime Mates Board Club community.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-bold text-white">Features</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Activity Tracking
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Digital Rewards
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    NFT Collection
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Community Challenges
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Spot Finder
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-bold text-white">Company</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <Link href="#" className="hover:text-primary">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-bold text-white">Legal</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-500">
            <p>© {new Date().getFullYear()} Prime Mates Board Club. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
