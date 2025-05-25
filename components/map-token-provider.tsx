"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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

export function MapTokenProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/mapbox-token")

        if (!response.ok) {
          throw new Error(`Failed to fetch Mapbox token: ${response.status}`)
        }

        const data = await response.json()
        setToken(data.token)
      } catch (err) {
        console.error("Error fetching Mapbox token:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    }

    fetchToken()
  }, [])

  return <MapTokenContext.Provider value={{ token, isLoading, error }}>{children}</MapTokenContext.Provider>
}

export function useMapToken() {
  return useContext(MapTokenContext)
}
