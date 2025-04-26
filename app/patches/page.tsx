"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/tab-bar"
import { ArrowLeft, Plus, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useWeb3 } from "@/components/web3-provider"
import { NFCEcosystemNavigator } from "@/components/nfc-ecosystem-navigator"

interface Patch {
  id: string
  name: string
  image: string
  description: string
  claimed: boolean
  applied: boolean
  appliedTo?: string
  brand?: string
  brandLogo?: string
}

interface Brand {
  id: string
  name: string
  logo: string
  description: string
  partnershipLevel: "official" | "community" | "upcoming"
}

export default function PatchesPage() {
  const { address, balance, ownedNFTs } = useWeb3()
  const [patches, setPatches] = useState<Patch[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [eligiblePatches, setEligiblePatches] = useState(0)
  const [claimedPatches, setClaimedPatches] = useState(0)
  const [appliedPatches, setAppliedPatches] = useState(0)
  const [selectedPatch, setSelectedPatch] = useState<Patch | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Mock data for user's patches
  const userPatches = [
    {
      id: "patch1",
      name: "Snow Jacket Patch",
      image: "/digital-threads.png",
      gear: "Snow Jacket",
      status: "active",
      lastUsed: "2 days ago",
      activities: 12,
    },
    {
      id: "patch2",
      name: "Skateboard Patch",
      image: "/digital-threads.png",
      gear: "Skateboard",
      status: "active",
      lastUsed: "Yesterday",
      activities: 8,
    },
  ]

  // Load patches and brands data
  useEffect(() => {
    // Mock data for patches
    const mockPatches: Patch[] = [
      {
        id: "patch1",
        name: "PMBC Snow Patch",
        image: "/digital-threads.png",
        description: "Official Prime Mates Board Club patch for snow gear. Track your rides and earn rewards.",
        claimed: true,
        applied: true,
        appliedTo: "Burton Snow Jacket",
        brand: "Burton",
        brandLogo: "/abstract-snowboard-design.png",
      },
      {
        id: "patch2",
        name: "PMBC Surf Patch",
        image: "/digital-threads.png",
        description: "Official Prime Mates Board Club patch for surf gear. Track your sessions and earn rewards.",
        claimed: true,
        applied: false,
      },
      {
        id: "patch3",
        name: "PMBC Skate Patch",
        image: "/digital-threads.png",
        description: "Official Prime Mates Board Club patch for skate gear. Track your sessions and earn rewards.",
        claimed: false,
        applied: false,
      },
      {
        id: "patch4",
        name: "RipCurl x PMBC Patch",
        image: "/digital-threads.png",
        description: "Limited edition RipCurl x Prime Mates Board Club patch. Exclusive to RipCurl partnership.",
        claimed: false,
        applied: false,
        brand: "RipCurl",
        brandLogo: "/abstract-wave-logo.png",
      },
      {
        id: "patch5",
        name: "Nike SB x PMBC Patch",
        image: "/digital-threads.png",
        description: "Limited edition Nike SB x Prime Mates Board Club patch. Exclusive to Nike SB partnership.",
        claimed: false,
        applied: false,
        brand: "Nike SB",
        brandLogo: "/stylized-swoosh.png",
      },
    ]

    // Mock data for brands
    const mockBrands: Brand[] = [
      {
        id: "brand1",
        name: "RipCurl",
        logo: "/abstract-wave-logo.png",
        description: "Official partner for surf gear. Exclusive patches and challenges available.",
        partnershipLevel: "official",
      },
      {
        id: "brand2",
        name: "Burton",
        logo: "/abstract-snowboard-design.png",
        description: "Official partner for snow gear. Exclusive patches and challenges available.",
        partnershipLevel: "official",
      },
      {
        id: "brand3",
        name: "Nike SB",
        logo: "/stylized-swoosh.png",
        description: "Community partner for skate gear. Limited edition patches available.",
        partnershipLevel: "community",
      },
      {
        id: "brand4",
        name: "Billabong",
        logo: "/abstract-wave-logo.png",
        description: "Upcoming partner for surf gear. Partnership launching soon.",
        partnershipLevel: "upcoming",
      },
      {
        id: "brand5",
        name: "Vans",
        logo: "/classic-vans-sidestripe.png",
        description: "Upcoming partner for skate gear. Partnership launching soon.",
        partnershipLevel: "upcoming",
      },
    ]

    setPatches(mockPatches)
    setBrands(mockBrands)

    // Calculate stats
    const claimed = mockPatches.filter((p) => p.claimed).length
    const applied = mockPatches.filter((p) => p.applied).length

    // Calculate eligible patches based on NFT holdings (1 patch per NFT)
    const eligible = Math.min(10, ownedNFTs.length)

    setClaimedPatches(claimed)
    setAppliedPatches(applied)
    setEligiblePatches(eligible)
  }, [ownedNFTs.length])

  const handleClaimPatch = (patchId: string) => {
    setPatches(
      patches.map((patch) => {
        if (patch.id === patchId) {
          return { ...patch, claimed: true }
        }
        return patch
      }),
    )
    setClaimedPatches(claimedPatches + 1)
  }

  const handleApplyPatch = (patch: Patch) => {
    setSelectedPatch(patch)
    setIsScanning(true)

    // Simulate NFC scanning
    setTimeout(() => {
      setIsScanning(false)
      setShowSuccess(true)

      // Update patch status
      setPatches(
        patches.map((p) => {
          if (p.id === patch.id) {
            return { ...p, applied: true, appliedTo: "Custom Snow Jacket" }
          }
          return p
        }),
      )
      setAppliedPatches(appliedPatches + 1)

      // Hide success message after a few seconds
      setTimeout(() => {
        setShowSuccess(false)
        setSelectedPatch(null)
      }, 3000)
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">My NFC Patches</h1>
          </div>
          <Link href="/patches/activate">
            <Button className="bg-primary text-black hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1" />
              Add Patch
            </Button>
          </Link>
        </div>

        {userPatches.length > 0 ? (
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-bold">Your Patches</h2>
            {userPatches.map((patch) => (
              <div key={patch.id} className="bg-zinc-900 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="relative w-16 h-16 mr-3 flex-shrink-0">
                    <Image src={patch.image || "/placeholder.svg"} alt={patch.name} fill className="object-contain" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{patch.name}</h3>
                    <p className="text-sm text-zinc-400">Applied to: {patch.gear}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span className="text-xs text-green-500">Active</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{patch.activities}</div>
                    <div className="text-xs text-zinc-400">Activities</div>
                    <div className="text-xs text-zinc-500 mt-1">Last used {patch.lastUsed}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-lg p-6 text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
              <Tag className="h-6 w-6 text-zinc-500" />
            </div>
            <h3 className="font-medium mb-2">No Patches Yet</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Add your first NFC patch to start tracking your activities with your gear.
            </p>
            <Link href="/patches/activate">
              <Button className="bg-primary text-black hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-1" />
                Add Your First Patch
              </Button>
            </Link>
          </div>
        )}

        <NFCEcosystemNavigator />
      </div>

      <TabBar activeTab="merch" />
    </div>
  )
}
