"use client"

import { useState, useEffect, useCallback } from "react"
import { bitcoinSignetService } from "@/services/bitcoin-signet-service"

export function useBitcoinSignet() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [isNodeRunning, setIsNodeRunning] = useState(false)
  const [miningStatus, setMiningStatus] = useState({
    isRunning: false,
    hashrate: 0,
    connectedPeers: 0,
    lastBlockMined: undefined as
      | {
          height: number
          hash: string
          timestamp: number
        }
      | undefined,
  })
  const [deposits, setDeposits] = useState<
    Array<{
      txid: string
      amount: number
      status: "pending" | "confirmed" | "failed"
      timestamp: number
    }>
  >([])

  // Initialize the service
  const initialize = useCallback(
    async (
      nodeUrl: string,
      username: string,
      password: string,
      walletName = "signet_wallet",
      bip300Enabled = true,
      sidechainId = "l2labs",
      sidechainName = "LayerTwoLabs",
    ) => {
      setIsInitializing(true)

      try {
        const success = await bitcoinSignetService.initialize({
          nodeUrl,
          username,
          password,
          walletName,
          bip300Enabled,
          sidechain: {
            id: sidechainId,
            name: sidechainName,
          },
        })

        setIsInitialized(success)
        return success
      } catch (error) {
        console.error("Error initializing Bitcoin Signet service:", error)
        return false
      } finally {
        setIsInitializing(false)
      }
    },
    [],
  )

  // Start the mining node
  const startNode = useCallback(async () => {
    try {
      const success = await bitcoinSignetService.startNode()
      if (success) {
        setIsNodeRunning(true)
      }
      return success
    } catch (error) {
      console.error("Error starting Bitcoin Signet node:", error)
      return false
    }
  }, [])

  // Stop the mining node
  const stopNode = useCallback(async () => {
    try {
      const success = await bitcoinSignetService.stopNode()
      if (success) {
        setIsNodeRunning(false)
      }
      return success
    } catch (error) {
      console.error("Error stopping Bitcoin Signet node:", error)
      return false
    }
  }, [])

  // Deposit to sidechain
  const depositToSidechain = useCallback(async (amount: number) => {
    try {
      return await bitcoinSignetService.depositToSidechain(amount)
    } catch (error) {
      console.error("Error depositing to sidechain:", error)
      return { success: false, error: String(error) }
    }
  }, [])

  // Update state from service
  const updateState = useCallback(() => {
    setIsInitialized(bitcoinSignetService.isServiceInitialized?.() || false)
    setIsNodeRunning(bitcoinSignetService.isNodeRunning())
    setMiningStatus(bitcoinSignetService.getMiningStatus())
    setDeposits(bitcoinSignetService.getDeposits())
  }, [])

  // Update state periodically
  useEffect(() => {
    updateState()

    const interval = setInterval(updateState, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [updateState])

  return {
    isInitialized,
    isInitializing,
    isNodeRunning,
    miningStatus,
    deposits,
    initialize,
    startNode,
    stopNode,
    depositToSidechain,
  }
}
