import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Shirt, Scan, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function WearToEarnPage() {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wear-to-Earn</h1>
        <p className="text-muted-foreground mt-2">Earn rewards by wearing your Prime Active merchandise</p>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>How Wear-to-Earn Works</CardTitle>
            <CardDescription>
              Scan your NFC-enabled merchandise during activities to earn additional rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
              <Shirt className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-semibold">1. Wear Your Gear</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Put on your NFC-enabled Prime Active merchandise before starting your activity
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
              <Scan className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-semibold">2. Scan NFC Tag</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Use the app to scan the NFC tag in your merchandise at the start and end of your activity
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-semibold">3. Earn More Rewards</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Boost your IoTeX mining rewards and earn exclusive merchandise tokens
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>IoTeX Mining Boost</CardTitle>
            <CardDescription>Increase your IoTeX mining rewards by wearing Prime Active merchandise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Base Mining Reward</span>
              <span>5 IOTX / day</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">With Wear-to-Earn Boost</span>
              <span className="font-bold text-green-600">Up to 15 IOTX / day</span>
            </div>

            <div className="bg-muted p-4 rounded-lg mt-4">
              <p className="text-sm">
                Your wear-to-earn status can multiply your base IoTeX mining rewards by up to 2x, allowing you to earn
                significantly more cryptocurrency for your activities.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/wallet/depin-info" className="w-full">
              <Button className="w-full">
                View Mining Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Wear-to-Earn Status</CardTitle>
            <CardDescription>Current multiplier based on your merchandise usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Current Multiplier</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">1.6x</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Active Merchandise</span>
              <span>3 items</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Last Scan</span>
              <span>Today, 2:45 PM</span>
            </div>

            <div className="bg-muted p-4 rounded-lg mt-4">
              <p className="text-sm">
                Scan your merchandise more frequently and use more items simultaneously to increase your multiplier.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/merch/collection" className="w-full">
              <Button variant="outline" className="w-full">
                View Your Collection
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Featured Wear-to-Earn Merchandise</CardTitle>
            <CardDescription>Shop for NFC-enabled merchandise to boost your rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Prime Threads Hoodie",
                  image: "/pmbc-prime-threads-hoodie.png",
                  price: "75.00",
                  boost: "0.4x",
                },
                { name: "Black Snapback", image: "/pmbc-black-pink-snapback.png", price: "35.00", boost: "0.2x" },
                {
                  name: "Green Don't Fade Tee",
                  image: "/pmbc-green-dont-fade-tshirt.png",
                  price: "45.00",
                  boost: "0.3x",
                },
                { name: "Pink Dad Hat", image: "/pmbc-pink-dad-hat.png", price: "30.00", boost: "0.2x" },
              ].map((item, i) => (
                <div key={i} className="bg-muted rounded-lg overflow-hidden flex flex-col">
                  <div className="relative h-40 w-full">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm">${item.price}</span>
                      <Badge variant="outline" className="bg-green-50">
                        +{item.boost}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/merch" className="w-full">
              <Button variant="outline" className="w-full">
                Shop All Merchandise
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
