"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [showExistingUserMessage, setShowExistingUserMessage] = useState(false)
  const { signUp } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowExistingUserMessage(false)

    if (cooldownTime > 0) {
      toast({
        title: "Please wait",
        description: `Try again in ${cooldownTime} seconds`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password, username)
      toast({
        title: "Account created successfully!",
        description: "Welcome to Prime Mates Board Club! You're now logged in.",
      })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Signup error:", error)

      if (error.message?.includes("already exists") || error.message?.includes("already been registered")) {
        setShowExistingUserMessage(true)
        toast({
          title: "Account already exists",
          description: "An account with this email already exists. Please try logging in instead.",
          variant: "destructive",
        })
      } else if (error.message?.includes("username") && error.message?.includes("taken")) {
        toast({
          title: "Username unavailable",
          description: "This username is already taken. Please choose a different one.",
          variant: "destructive",
        })
      } else if (error.message?.includes("wait")) {
        // Start cooldown timer
        let timeLeft = 3
        setCooldownTime(timeLeft)
        const timer = setInterval(() => {
          timeLeft -= 1
          setCooldownTime(timeLeft)
          if (timeLeft <= 0) {
            clearInterval(timer)
            setCooldownTime(0)
          }
        }, 1000)

        toast({
          title: "Please wait",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Signup failed",
          description: error.message || "Please check your information and try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = email && password && username && password.length >= 6
  const isDisabled = isLoading || cooldownTime > 0 || !isFormValid

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-black">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8 flex justify-center">
          <Image
            src="/prime-mates-logo.png"
            alt="Prime Mates Board Club"
            width={200}
            height={100}
            className="object-contain"
          />
        </div>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-xl">Create an Account</CardTitle>
            <CardDescription>Join Prime Mates Board Club and start earning rewards</CardDescription>
          </CardHeader>

          {showExistingUserMessage && (
            <div className="mx-6 mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Account Already Exists</span>
              </div>
              <p className="text-sm text-amber-300 mt-1">
                An account with this email already exists.{" "}
                <Link href="/login" className="underline hover:text-amber-200">
                  Click here to login instead
                </Link>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="coolrider"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-zinc-800 border-zinc-700"
                  disabled={isLoading}
                />
                <div className="flex items-center gap-2 text-xs">
                  {password.length >= 6 ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-zinc-500" />
                  )}
                  <span className={password.length >= 6 ? "text-green-500" : "text-zinc-500"}>
                    Password must be at least 6 characters
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isDisabled}>
                {isLoading ? "Creating account..." : cooldownTime > 0 ? `Wait ${cooldownTime}s` : "Sign Up"}
              </Button>
              <div className="text-center text-sm text-zinc-400">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
