import { mystService } from "./myst-service"
import { iotexService } from "./iotex-service"
import { bitcoinSignetService } from "./bitcoin-signet-service"

export interface ActivityBoost {
  id: string
  name: string
  description: string
  multiplier: number
  duration: number // in milliseconds
  networkId: string // 'mystnode', 'iotex', 'bitcoin', or 'all'
  activityType: string
  minDuration: number // minimum activity duration in seconds
  minDistance?: number // minimum distance in meters (optional)
  progress: number // 0-100
  isActive: boolean
  startTime?: number // timestamp when boost was activated
  endTime?: number // timestamp when boost will expire
}

class ActivityBoostService {
  private boosts: ActivityBoost[] = []
  private activeBoosts: ActivityBoost[] = []

  constructor() {
    this.initializeBoosts()
    this.loadState()
  }

  private initializeBoosts() {
    this.boosts = [
      {
        id: "run-5k",
        name: "5K Runner",
        description: "Run 5km to boost your MystNode earnings by 50%",
        multiplier: 1.5,
        duration: 6 * 60 * 60 * 1000, // 6 hours
        networkId: "mystnode",
        activityType: "running",
        minDuration: 20 * 60, // 20 minutes
        minDistance: 5000, // 5km
        progress: 0,
        isActive: false,
      },
      {
        id: "skate-30min",
        name: "Skate Session",
        description: "Skateboard for 30 minutes to double your IoTeX earnings",
        multiplier: 2.0,
        duration: 12 * 60 * 60 * 1000, // 12 hours
        networkId: "iotex",
        activityType: "skateboarding",
        minDuration: 30 * 60, // 30 minutes
        progress: 0,
        isActive: false,
      },
      {
        id: "surf-1h",
        name: "Wave Rider",
        description: "Surf for 1 hour to boost your Bitcoin mining by 75%",
        multiplier: 1.75,
        duration: 24 * 60 * 60 * 1000, // 24 hours
        networkId: "bitcoin",
        activityType: "surfing",
        minDuration: 60 * 60, // 60 minutes
        progress: 0,
        isActive: false,
      },
      {
        id: "bike-10k",
        name: "Cycle Power",
        description: "Bike 10km to boost all network earnings by 25%",
        multiplier: 1.25,
        duration: 8 * 60 * 60 * 1000, // 8 hours
        networkId: "all",
        activityType: "cycling",
        minDuration: 30 * 60, // 30 minutes
        minDistance: 10000, // 10km
        progress: 0,
        isActive: false,
      },
      {
        id: "hike-mountain",
        name: "Mountain Explorer",
        description: "Hike for 2 hours to boost MystNode earnings by 100%",
        multiplier: 2.0,
        duration: 48 * 60 * 60 * 1000, // 48 hours
        networkId: "mystnode",
        activityType: "hiking",
        minDuration: 2 * 60 * 60, // 2 hours
        progress: 0,
        isActive: false,
      },
    ]
  }

  public getBoosts(): ActivityBoost[] {
    return this.boosts
  }

  public getActiveBoosts(): ActivityBoost[] {
    return this.activeBoosts
  }

  public getBoostById(id: string): ActivityBoost | undefined {
    return this.boosts.find((boost) => boost.id === id)
  }

  public getActiveBoostForNetwork(networkId: string): ActivityBoost | undefined {
    // If there's an "all" network boost, it applies to all networks
    const allNetworkBoost = this.activeBoosts.find((boost) => boost.networkId === "all")

    // If there's a specific network boost, it takes precedence
    const specificNetworkBoost = this.activeBoosts.find((boost) => boost.networkId === networkId)

    // Return the specific network boost if it exists, otherwise return the "all" network boost
    return specificNetworkBoost || allNetworkBoost
  }

  public getMultiplierForNetwork(networkId: string): number {
    const boost = this.getActiveBoostForNetwork(networkId)
    return boost ? boost.multiplier : 1.0
  }

  public updateActivityProgress(activityType: string, duration: number, distance?: number) {
    // Find boosts that match this activity type
    const matchingBoosts = this.boosts.filter((boost) => boost.activityType === activityType && !boost.isActive)

    // Update progress for each matching boost
    matchingBoosts.forEach((boost) => {
      // Calculate progress based on duration
      const durationProgress = (duration / boost.minDuration) * 100

      // If there's a distance requirement, calculate progress based on that too
      let distanceProgress = 100
      if (boost.minDistance && distance) {
        distanceProgress = (distance / boost.minDistance) * 100
      }

      // Overall progress is the minimum of duration and distance progress
      const overallProgress = Math.min(durationProgress, distanceProgress)

      // Update the boost's progress
      const index = this.boosts.findIndex((b) => b.id === boost.id)
      if (index !== -1) {
        this.boosts[index].progress = Math.min(overallProgress, 100)

        // If progress is 100%, activate the boost
        if (this.boosts[index].progress >= 100) {
          this.activateBoost(boost.id)
        }
      }
    })

    this.saveState()
  }

  public activateBoost(boostId: string): boolean {
    const boostIndex = this.boosts.findIndex((boost) => boost.id === boostId)
    if (boostIndex === -1 || this.boosts[boostIndex].isActive) {
      return false
    }

    // Activate the boost
    const now = Date.now()
    this.boosts[boostIndex].isActive = true
    this.boosts[boostIndex].startTime = now
    this.boosts[boostIndex].endTime = now + this.boosts[boostIndex].duration

    // Add to active boosts
    this.activeBoosts.push({ ...this.boosts[boostIndex] })

    // Apply the boost to the appropriate service
    this.applyBoostToService(this.boosts[boostIndex])

    this.saveState()
    return true
  }

  public deactivateBoost(boostId: string): boolean {
    const activeIndex = this.activeBoosts.findIndex((boost) => boost.id === boostId)
    if (activeIndex === -1) {
      return false
    }

    // Remove from active boosts
    const boost = this.activeBoosts[activeIndex]
    this.activeBoosts.splice(activeIndex, 1)

    // Find in all boosts and reset
    const boostIndex = this.boosts.findIndex((b) => b.id === boostId)
    if (boostIndex !== -1) {
      this.boosts[boostIndex].isActive = false
      this.boosts[boostIndex].startTime = undefined
      this.boosts[boostIndex].endTime = undefined
      this.boosts[boostIndex].progress = 0
    }

    // Remove the boost from the appropriate service
    this.removeBoostFromService(boost)

    this.saveState()
    return true
  }

  public checkExpiredBoosts() {
    const now = Date.now()
    const expiredBoosts = this.activeBoosts.filter((boost) => boost.endTime && boost.endTime < now)

    expiredBoosts.forEach((boost) => {
      this.deactivateBoost(boost.id)
    })
  }

  private applyBoostToService(boost: ActivityBoost) {
    switch (boost.networkId) {
      case "mystnode":
        // Apply boost to MystNode service
        mystService.applyEarningBoost(boost.multiplier, boost.duration)
        break
      case "iotex":
        // Apply boost to IoTeX service
        iotexService.applyEarningBoost(boost.multiplier, boost.duration)
        break
      case "bitcoin":
        // Apply boost to Bitcoin Signet service
        bitcoinSignetService.applyEarningBoost(boost.multiplier, boost.duration)
        break
      case "all":
        // Apply boost to all services
        mystService.applyEarningBoost(boost.multiplier, boost.duration)
        iotexService.applyEarningBoost(boost.multiplier, boost.duration)
        bitcoinSignetService.applyEarningBoost(boost.multiplier, boost.duration)
        break
    }
  }

  private removeBoostFromService(boost: ActivityBoost) {
    switch (boost.networkId) {
      case "mystnode":
        // Remove boost from MystNode service
        mystService.removeEarningBoost()
        break
      case "iotex":
        // Remove boost from IoTeX service
        iotexService.removeEarningBoost()
        break
      case "bitcoin":
        // Remove boost from Bitcoin Signet service
        bitcoinSignetService.removeEarningBoost()
        break
      case "all":
        // Remove boost from all services
        mystService.removeEarningBoost()
        iotexService.removeEarningBoost()
        bitcoinSignetService.removeEarningBoost()
        break
    }
  }

  private saveState() {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem("activity_boosts", JSON.stringify(this.boosts))
      localStorage.setItem("active_boosts", JSON.stringify(this.activeBoosts))
    } catch (error) {
      console.error("Failed to save activity boost state:", error)
    }
  }

  private loadState() {
    if (typeof window === "undefined") return

    try {
      const boostsJson = localStorage.getItem("activity_boosts")
      const activeBoostsJson = localStorage.getItem("active_boosts")

      if (boostsJson) {
        this.boosts = JSON.parse(boostsJson)
      }

      if (activeBoostsJson) {
        this.activeBoosts = JSON.parse(activeBoostsJson)

        // Re-apply active boosts to services
        this.activeBoosts.forEach((boost) => {
          this.applyBoostToService(boost)
        })
      }
    } catch (error) {
      console.error("Failed to load activity boost state:", error)
    }
  }
}

// Create a singleton instance
export const activityBoostService = new ActivityBoostService()
