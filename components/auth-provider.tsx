"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

// Rate limiting state
let lastSignupAttempt = 0
const SIGNUP_COOLDOWN = 2000 // 2 seconds

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        throw new Error("Invalid email or password. Please check your credentials and try again.")
      }
      throw error
    }
  }

  const signUp = async (email: string, password: string, username: string) => {
    // Check rate limiting
    const now = Date.now()
    if (now - lastSignupAttempt < SIGNUP_COOLDOWN) {
      const waitTime = Math.ceil((SIGNUP_COOLDOWN - (now - lastSignupAttempt)) / 1000)
      throw new Error(`Please wait ${waitTime} seconds before trying again`)
    }

    lastSignupAttempt = now

    try {
      // Use the API route instead of direct Supabase call
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error codes
        if (data.code === "EMAIL_EXISTS") {
          throw new Error("An account with this email already exists. Please try logging in instead.")
        }
        if (data.code === "USERNAME_EXISTS") {
          throw new Error("This username is already taken. Please choose a different one.")
        }
        throw new Error(data.error || "Signup failed")
      }

      // If successful, sign in the user
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second
      await signIn(email, password)
    } catch (error: any) {
      console.error("Signup error:", error)

      // Handle specific error types
      if (error.message?.includes("rate limit") || error.message?.includes("wait")) {
        throw new Error("Please wait a moment before trying again")
      }

      // Re-throw the error with the original message
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
