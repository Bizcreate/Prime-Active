"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, User, Wallet, Heart, LogOut, Bell, Shield, Moon, Calendar } from "lucide-react"
import Link from "next/link"
import { TabBar } from "@/components/tab-bar"
import { useWeb3 } from "@/components/web3-provider"
import { NFTVerification } from "@/components/nft-verification"
import { Badge } from "@/components/ui/badge"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import Image from "next/image"

export default function ProfilePage() {
  const { address, isConnected, disconnectWallet, points, hasAccess } = useWeb3()

  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <Image
              src="/prime-mates-logo.png"
              alt="Prime Mates Board Club"
              width={150}
              height={75}
              className="object-contain mb-4"
            />
            <div className="h-24 w-24 rounded-full bg-zinc-800 flex items-center justify-center mb-3 mx-auto">
              <User className="h-12 w-12 text-zinc-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-1">Fathoni Ali</h2>
          <p className="text-zinc-400 text-sm">@fathoni • Joined April 2023</p>

          {isConnected && hasAccess && (
            <Badge variant="success" className="mt-2">
              Verified Prime Mate
            </Badge>
          )}

          {isConnected && (
            <div className="mt-2 flex items-center gap-1 bg-banana/10 px-3 py-1 rounded-full">
              <Image src="/banana-icon.png" alt="Banana Points" width={16} height={16} className="object-contain" />
              <span className="text-xs text-primary">{points} Banana Points</span>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <div className="text-center">
              <p className="text-xl font-bold">175</p>
              <p className="text-xs text-zinc-400">cm</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">67</p>
              <p className="text-xs text-zinc-400">kg</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">31</p>
              <p className="text-xs text-zinc-400">yrs</p>
            </div>
          </div>
        </div>

        <div className="banana-card p-4 mb-6">
          <h2 className="text-lg font-medium mb-3 flex items-center">
            <Image src="/shaka-icon.png" alt="Shaka" width={24} height={24} className="mr-2 shaka-animation" />
            Board Club Status
          </h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Prime Mate</p>
              <p className="text-xs text-zinc-400">Active Member</p>
            </div>
            <div className="bg-primary/20 px-3 py-1 rounded-full">
              <p className="text-xs text-primary font-medium">Level 3</p>
            </div>
          </div>
          <div className="mt-3 bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full" style={{ width: "65%" }}></div>
          </div>
          <p className="text-xs text-zinc-400 mt-1 text-right">65% to Level 4</p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Connected Accounts</h2>
            <div className="space-y-3">
              {isConnected ? (
                <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-zinc-800 p-2 rounded-full">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Web3 Wallet</p>
                      <p className="text-xs text-zinc-400">{address}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={disconnectWallet}>
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-zinc-800 p-2 rounded-full">
                      <Wallet className="h-5 w-5 text-zinc-500" />
                    </div>
                    <div>
                      <p className="font-medium">Web3 Wallet</p>
                      <p className="text-xs text-zinc-400">Not connected</p>
                    </div>
                  </div>
                  <WalletConnectButton variant="ghost" size="sm" />
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <Heart className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium">Health Data</p>
                    <p className="text-xs text-zinc-400">Connected</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Disconnect
                </Button>
              </div>
            </div>
          </div>

          {isConnected && (
            <div className="mb-6">
              <NFTVerification />
            </div>
          )}

          <div>
            <h2 className="text-lg font-medium mb-4">Activity</h2>
            <div className="space-y-3">
              <Link
                href="/profile/activity-history"
                className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Activity History</p>
                    <p className="text-xs text-zinc-400">View your past activities and achievements</p>
                  </div>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Settings</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-xs text-zinc-400">Manage notification settings</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <Moon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-xs text-zinc-400">Toggle dark mode</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <Link
                href="/settings/notifications"
                className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Notification Settings</p>
                    <p className="text-xs text-zinc-400">Manage notification preferences</p>
                  </div>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Privacy & Security</h2>
            <div className="space-y-3">
              <Link href="/settings/privacy" className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Privacy Settings</p>
                    <p className="text-xs text-zinc-400">Manage privacy settings</p>
                  </div>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="destructive" className="w-full flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </div>

      <TabBar activeTab="profile" />
    </main>
  )
}
