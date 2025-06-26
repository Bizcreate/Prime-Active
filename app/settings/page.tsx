"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, User, Wallet, Bell, Shield, Moon, Smartphone, Globe, HelpCircle } from "lucide-react"
import Link from "next/link"
import { TabBar } from "@/components/tab-bar"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black pb-20">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-3">Account</h2>
            <div className="space-y-2">
              <Link href="/settings/profile" className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <span>Profile Information</span>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>

              <Link href="/settings/wallet" className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <span>Wallet & Payments</span>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-3">Preferences</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <span>Notifications</span>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <Moon className="h-5 w-5 text-primary" />
                  </div>
                  <span>Dark Mode</span>
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
                  <span>Notification Settings</span>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-3">Privacy & Security</h2>
            <div className="space-y-2">
              <Link href="/settings/privacy" className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <span>Privacy Settings</span>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>

              <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <span>Location Services</span>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <span>Device Permissions</span>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-3">Support</h2>
            <div className="space-y-2">
              <Link href="/help" className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <HelpCircle className="h-5 w-5 text-primary" />
                  </div>
                  <span>Help Center</span>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>

              <Link href="/terms" className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <span>Terms & Privacy Policy</span>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>

          <Separator />

          <div className="pt-4">
            <Button variant="destructive" className="w-full">
              Log Out
            </Button>
          </div>
        </div>
      </div>

      <TabBar activeTab="profile" />
    </main>
  )
}
