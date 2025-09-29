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

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signInDemo } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signIn(email, password)
      toast({
        title: "Login successful",
        description: "Welcome back to Prime Mates Board Club!",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    try {
      await signInDemo()
      toast({
        title: "Demo login successful",
        description: "Welcome to the Prime Mates demo!",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Demo login failed",
        description: error.message || "Something went wrong with demo login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setEmail("demo@primemates.com")
    setPassword("demo123")
  }

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
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>Sign in to your Prime Mates account</CardDescription>
          </CardHeader>

          {/* Demo Credentials Info */}
          <div className="px-6 mb-4">
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-zinc-300 mb-2">Demo Credentials</h3>
              <div className="text-xs text-zinc-400 space-y-1">
                <div>Email: demo@primemates.com</div>
                <div>Password: demo123</div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillDemoCredentials}
                  className="text-xs bg-transparent"
                >
                  Fill Demo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="text-xs bg-transparent"
                >
                  Quick Demo Login
                </Button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Login"}
              </Button>
              <div className="text-center text-sm text-zinc-400">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
