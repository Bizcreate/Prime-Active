import { BaseDePINService } from "./base-depin-service"
import type { ActivityData, DePINNetwork, DePINServiceConfig, LocationPoint } from "./depin-types"

interface FOAMConfig extends DePINServiceConfig {
  verificationEndpoint?: string
  poiEndpoint?: string
  isTestnet?: boolean
}

interface POI {
  latitude: number
  longitude: number
  timestamp: number
  accuracy?: number
  name?: string
  category?: string
  confidence: number
}

export class FOAMService extends BaseDePINService {
  private verificationEndpoint: string
  private poiEndpoint: string
  private isTestnet: boolean
  private apiKey: string | null = null
  private verifiedPOIs: string[] = []

  constructor(config: FOAMConfig) {
    const network: DePINNetwork = {
      id: "foam",
      name: config.isTestnet ? "FOAM Testnet" : "FOAM",
      tokenSymbol: "FOAM",
      tokenName: "FOAM Token",
      logoUrl: "/foam-protocol-logo.png",
      description: "Geospatial location verification",
      enabled: false,
      category: "location",
      status: "active",
    }

    super(network, config)

    this.isTestnet = config.isTestnet || false

    // Use testnet or mainnet endpoints
    if (this.isTestnet) {
      this.verificationEndpoint = config.verificationEndpoint || "https://testnet-api.foam.space/verify"
      this.poiEndpoint = config.poiEndpoint || "https://testnet-api.foam.space/poi"
    } else {
      this.verificationEndpoint = config.verificationEndpoint || "https://api.foam.space/verify"
      this.poiEndpoint = config.poiEndpoint || "https://api.foam.space/poi"
    }
  }

  public async connect(apiKey: string, userId: string): Promise<boolean> {
    try {
      // Verify API key with FOAM
      const response = await fetch(`${this.config.apiUrl}/v1/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        this.apiKey = apiKey
        this.userId = userId
        this.saveState()
        return true
      }

      return false
    } catch (error) {
      console.error("Failed to connect to FOAM:", error)
      return false
    }
  }

  public async enableMining(userId: string): Promise<boolean> {
    try {
      this.userId = userId

      // FOAM doesn't require explicit device registration
      // Just set the flag and save state
      this.isEnabled = true
      this.saveState()

      console.log(`Enabled FOAM ${this.isTestnet ? "Testnet" : "Mainnet"} for user ${userId}`)
      return true
    } catch (error) {
      console.error("Failed to enable FOAM mining:", error)
      return false
    }
  }

  public async disableMining(): Promise<boolean> {
    try {
      this.isEnabled = false
      this.saveState()
      return true
    } catch (error) {
      console.error("Failed to disable FOAM mining:", error)
      return false
    }
  }

  public async submitActivityData(activity: ActivityData): Promise<boolean> {
    if (!this.isEnabled || !this.userId) return false

    try {
      if (!this.apiKey || !activity.locationData) {
        return false
      }

      // Submit location data for verification
      const response = await fetch(`${this.config.apiUrl}/v1/poi/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          userId: this.userId,
          activityId: activity.id,
          coordinates: activity.locationData.coordinates,
          timestamp: activity.startTime,
          accuracy: activity.locationData.accuracy,
        }),
      })

      if (response.ok) {
        const result = await response.json()

        // Add reward for location verification
        const reward = this.calculateLocationReward(activity)
        this.addReward(reward, activity.id)

        console.log(`Added FOAM reward: ${reward.toFixed(4)} FOAM`)
        return true
      }

      return false
    } catch (error) {
      console.error("Failed to submit data to FOAM:", error)
      return false
    }
  }

  private extractPointsOfInterest(activity: ActivityData): POI[] {
    // This is a simplified algorithm to extract points of interest
    const pointsOfInterest: POI[] = []
    const locations = activity.locations

    // If the activity has few locations, just use the start and end
    if (locations.length < 10) {
      if (locations.length > 0) {
        pointsOfInterest.push(this.locationToPOI(locations[0]))
      }
      if (locations.length > 1) {
        pointsOfInterest.push(this.locationToPOI(locations[locations.length - 1]))
      }
      return pointsOfInterest
    }

    // Look for places where the user stayed in one place for a while
    let lastLat = locations[0].latitude
    let lastLng = locations[0].longitude
    let stationaryStart = locations[0].timestamp
    let stationaryCount = 1
    let stationaryIndex = 0

    for (let i = 1; i < locations.length; i++) {
      const loc = locations[i]
      const distance = this.calculateDistance(lastLat, lastLng, loc.latitude, loc.longitude)

      // If the user hasn't moved much
      if (distance < 0.05) {
        // Less than 50 meters
        stationaryCount++
      } else {
        // If they were stationary for a while, add a POI
        if (stationaryCount >= 5 && loc.timestamp - stationaryStart > 300000) {
          // 5 minutes
          const stationaryLoc = locations[stationaryIndex]
          pointsOfInterest.push(this.locationToPOI(stationaryLoc, 0.9)) // High confidence for stationary points
        }

        // Reset
        stationaryStart = loc.timestamp
        stationaryCount = 1
        stationaryIndex = i
      }

      lastLat = loc.latitude
      lastLng = loc.longitude
    }

    // Check if the end location is a POI
    if (stationaryCount >= 5) {
      const stationaryLoc = locations[stationaryIndex]
      pointsOfInterest.push(this.locationToPOI(stationaryLoc, 0.9))
    }

    return pointsOfInterest
  }

  private locationToPOI(location: LocationPoint, confidence = 0.7): POI {
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: location.timestamp,
      accuracy: location.accuracy,
      confidence: confidence,
    }
  }

  private calculateLocationReward(activity: ActivityData): number {
    // Reward based on distance traveled and location accuracy
    const distanceKm = (activity.distance || 0) / 1000
    const baseReward = distanceKm * 0.1 // 0.1 FOAM per km

    return Math.min(baseReward, 5) // Cap at 5 FOAM per activity
  }

  public getVerifiedPOIs(): string[] {
    return this.verifiedPOIs
  }
}

// export const foamService = new FOAMService()
