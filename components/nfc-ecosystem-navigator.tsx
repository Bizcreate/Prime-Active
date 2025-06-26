import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, BarChart3, ShoppingBag, MapPin } from "lucide-react"
import Link from "next/link"

export function NFCEcosystemNavigator() {
  return (
    <Card className="bg-zinc-900 border-zinc-800 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">NFC Ecosystem</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-400 mb-4">
          Explore the Prime Mates NFC ecosystem - connecting physical merchandise to digital experiences.
        </p>

        <div className="space-y-3">
          <Link href="/architecture/nfc-ecosystem" className="block">
            <Button variant="outline" className="w-full justify-start" size="lg">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3">
                <Smartphone className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="font-medium">NFC Ecosystem Architecture</p>
                <p className="text-xs text-zinc-400">View the system overview</p>
              </div>
            </Button>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-800 rounded-lg p-3 opacity-70">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center mr-2">
                  <Smartphone className="h-3 w-3 text-blue-400" />
                </div>
                <p className="text-sm font-medium">Patch Activation</p>
              </div>
              <p className="text-xs text-zinc-500">Coming soon</p>
            </div>

            <div className="bg-zinc-800 rounded-lg p-3 opacity-70">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center mr-2">
                  <BarChart3 className="h-3 w-3 text-blue-400" />
                </div>
                <p className="text-sm font-medium">Brand Dashboard</p>
              </div>
              <p className="text-xs text-zinc-500">Coming soon</p>
            </div>

            <div className="bg-zinc-800 rounded-lg p-3 opacity-70">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center mr-2">
                  <ShoppingBag className="h-3 w-3 text-blue-400" />
                </div>
                <p className="text-sm font-medium">Patch Marketplace</p>
              </div>
              <p className="text-xs text-zinc-500">Coming soon</p>
            </div>

            <div className="bg-zinc-800 rounded-lg p-3 opacity-70">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center mr-2">
                  <MapPin className="h-3 w-3 text-blue-400" />
                </div>
                <p className="text-sm font-medium">Location Challenges</p>
              </div>
              <p className="text-xs text-zinc-500">Coming soon</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
