"use client"

import { useState, useEffect, useCallback } from "react"
import { mystService } from "@/services/myst-service"
import { useToast } from "@/hooks/use-toast"

export function useMystNode() {
  const [isConnected, setIsConnected] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [balance, setBalance] = useState(0)
  const [earningRate, setEarningRate] = useState(0)
  const [nodeStats, setNodeStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load initial state
  useEffect(() => {
    if (typeof window === "undefined") return

    const loadState = async () => {
      setIsLoading(true)
      try {
        // Check if node is already connected
        const userId = mystService.getUserId()
        setIsConnected(!!userId)

        // Check if node is running
        setIsRunning(mystService.isNodeRunning())

        // Get balance
        setBalance(mystService.getBalance())

        // Get earning rate
        setEarningRate(mystService.getPassiveRate())

        // Get node stats if running
        if (mystService.isNodeRunning()) {
          const stats = await mystService.getNodeStats()
          setNodeStats(stats)
        }
      } catch (error) {
        console.error("Error loading MystNode state:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadState()

    // Set up an interval to refresh data
    const interval = setInterval(() => {
      if (mystService.isNodeRunning()) {
        setBalance(mystService.getBalance())
        mystService.getNodeStats().then(setNodeStats)
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Connect to MystNodes
  const connect = useCallback(
    async (apiKey: string) => {
      setIsLoading(true)
      try {
        // Generate a user ID if not already connected
        const userId = mystService.getUserId() || `user_${Date.now().toString(36)}`

        // Connect to MystNodes
        const success = await mystService.connect(apiKey, userId)

        if (success) {
          setIsConnected(true)
          toast({
            title: "Connected to MystNodes",
            description: "Your account has been successfully connected",
          })
          return true
        } else {
          toast({
            title: "Connection Failed",
            description: "Could not connect to MystNodes",
            variant: "destructive",
          })
          return false
        }
      } catch (error) {
        console.error("Error connecting to MystNodes:", error)
        toast({
          title: "Connection Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  // Start MystNode
  const startNode = useCallback(async () => {
    setIsLoading(true)
    try {
      const success = await mystService.startNode()

      if (success) {
        setIsRunning(true)
        const stats = await mystService.getNodeStats()
        setNodeStats(stats)
        toast({
          title: "MystNode Started",
          description: "Your node is now running and earning MYST tokens",
        })
        return true
      } else {
        toast({
          title: "Start Failed",
          description: "Could not start MystNode",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Error starting MystNode:", error)
      toast({
        title: "Start Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Stop MystNode
  const stopNode = useCallback(async () => {
    setIsLoading(true)
    try {
      const success = await mystService.stopNode()

      if (success) {
        setIsRunning(false)
        setNodeStats({ status: "offline" })
        toast({
          title: "MystNode Stopped",
          description: "Your node has been stopped",
        })
        return true
      } else {
        toast({
          title: "Stop Failed",
          description: "Could not stop MystNode",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Error stopping MystNode:", error)
      toast({
        title: "Stop Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  return {
    isConnected,
    isRunning,
    balance,
    earningRate,
    nodeStats,
    isLoading,
    connect,
    startNode,
    stopNode,
  }
}
