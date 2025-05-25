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

  constructor(config: FOAMConfig) {
    const network: DePINNetwork = {
      id: "foam",
      name: config.isTestnet ? "FOAM Testnet" : "FOAM",
      tokenSymbol: "FOAM",
      tokenName: "FOAM Token",
      logoUrl: "/foam-protocol-logo.png",
      description: "Geospatial location verification",
      enabled: false,
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
      // Extract points of interest from the activity
      const pointsOfInterest = this.extractPointsOfInterest(activity)

      if (pointsOfInterest.length === 0) {
        console.log("No points of interest found in activity")
        return true // Not an error, just no relevant data
      }

      if (this.isTestnet) {
        // Simulate POI verification and submission for testnet
        console.log(`[TESTNET] Found ${pointsOfInterest.length} points of interest`)

        let totalReward = 0

        // Process each POI
        for (const poi of pointsOfInterest) {
          // Simulate verification
          console.log(`[TESTNET] Verifying POI at ${poi.latitude}, ${poi.longitude}`)

          // Calculate reward for this POI based on confidence
          const poiReward = 0.05 * poi.confidence
          totalReward += poiReward

          console.log(`[TESTNET] POI verified, earned ${poiReward.toFixed(4)} FOAM`)
        }

        // Simulate transaction hash
        const txHash = `foam_${Date.now().toString(36)}`

        // Add reward to user's balance
        this.addReward(totalReward, activity.id, txHash)

        console.log(`[TESTNET] Total earned: ${totalReward.toFixed(4)} FOAM`)
        return true
      } else {
        // For mainnet, we would submit to the actual FOAM API
        console.log("Mainnet submission not yet implemented")
        return false
      }
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
}
