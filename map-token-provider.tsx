"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// Create a context for the map token
interface MapTokenContextType {
  token: string | null
  isLoading: boolean
  error: Error | null
}

const MapTokenContext = createContext<MapTokenContextType>({
  token: null,
  isLoading: true,
  error: null,
})

// Provider component
export function MapTokenProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch("/api/mapbox-token")
        if (!response.ok) {
          throw new Error("Failed to fetch map token")
        }
        const data = await response.json()
        setToken(data.token)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchToken()
  }, [])

  return <MapTokenContext.Provider value={{ token, isLoading, error }}>{children}</MapTokenContext.Provider>
}

// Hook to use the map token
export function useMapToken() {
  return useContext(MapTokenContext)
}
