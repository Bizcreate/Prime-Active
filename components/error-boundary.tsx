"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Caught in error boundary:", error)
      setError(error.error)
      setHasError(true)
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [])

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
        <div className="bg-zinc-900 rounded-lg p-6 max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-900/20 p-3 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
            <p className="text-zinc-400 mb-4">{error?.message || "The application encountered an unexpected error."}</p>
            <Button onClick={() => window.location.reload()} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Reload Application
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
