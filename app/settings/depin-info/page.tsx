"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function DePINInfoPage() {
  return (
    <div className="container max-w-md pb-16">
      <div className="flex items-center mb-6 mt-6">
        <Link href="/settings/depin">
          <Button variant="ghost" className="p-0 mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">About DePIN Mining</h1>
      </div>

      <div className="space-y-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>What is DePIN?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400">
              DePIN (Decentralized Physical Infrastructure Networks) allows you to earn cryptocurrency tokens by
              contributing data from your device to decentralized networks.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2 text-zinc-400">
              <li>Enable one or more DePIN networks in settings</li>
              <li>Your app shares anonymous activity and location data with these networks</li>
              <li>This data helps build decentralized infrastructure</li>
              <li>You earn tokens as rewards</li>
              <li>Tokens can be viewed in your wallet</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Supported Networks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-800 p-2 rounded-full">
                <Image
                  src="/placeholder.svg?key=20i99"
                  alt="Helium Mobile"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              </div>
              <div>
                <h3 className="font-medium">Helium Mobile ($MOBILE)</h3>
                <p className="text-sm text-zinc-400">Decentralized wireless network</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-zinc-800 p-2 rounded-full">
                <Image src="/placeholder.svg?key=0bbdn" alt="IoTeX" width={32} height={32} className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-medium">IoTeX ($IOTX)</h3>
                <p className="text-sm text-zinc-400">Blockchain for Internet of Things</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-zinc-800 p-2 rounded-full">
                <Image src="/placeholder.svg?key=ilnpk" alt="FOAM" width={32} height={32} className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-medium">FOAM ($FOAM)</h3>
                <p className="text-sm text-zinc-400">Geospatial location verification</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Privacy & Battery</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400 mb-2">DePIN mining is designed to be:</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>Privacy-preserving (data is anonymized)</li>
              <li>Battery-efficient (minimal impact)</li>
              <li>Fully optional (enable only what you want)</li>
            </ul>
          </CardContent>
        </Card>

        <Link href="/settings/depin">
          <Button className="w-full">Manage DePIN Networks</Button>
        </Link>
      </div>
    </div>
  )
}
