import { BaseDePINService } from "./base-depin-service"
import type { ActivityData, DePINNetwork, DePINServiceConfig } from "./depin-types"

interface STEPNConfig extends DePINServiceConfig {
  walletAddress?: string
  nftSneakerId?: string
}

export class STEPNService extends BaseDePINService {
  private walletAddress: string | null = null
  private nftSneakerId: string | null = null
  private energyAvailable = 0
  private lastEnergyUpdate = 0

  constructor(config: STEPNConfig) {
    const network: DePINNetwork = {
      id: "stepn",
      name: "STEPN",
      tokenSymbol: "GMT",
      tokenName: "Green Metaverse Token",
      logoUrl: "/stepn-logo-generic.png",
      description: "Move-to-earn NFT game with EVM compatibility",
      enabled: false,
    }

    super(network, config)
    this.walletAddress = config.walletAddress || null
    this.nftSneakerId = config.nftSneakerId || null

    // Initialize energy
    this.resetEnergy()
  }

  private resetEnergy(): void {
    // STEPN typically gives users 2 energy points per day
    this.energyAvailable = 2
    this.lastEnergyUpdate = Date.now()
  }

  public async enableMining(userId: string): Promise<boolean> {
    try {
      this.userId = userId

      // Check if user has NFT sneakers
      const hasNFT = await this.checkNFTSneakers()

      if (hasNFT) {
        this.isEnabled = true
        this.saveState()
        console.log("STEPN mining enabled for user:", userId)
        return true
      } else {
        console.error("Failed to enable STEPN mining: No NFT sneakers found")
        return false
      }
    } catch (error) {
      console.error("Failed to enable STEPN mining:", error)
      return false
    }
  }

  private async checkNFTSneakers(): Promise<boolean> {
    try {
      // In a real implementation, you would check if the user has NFT sneakers
      // in their wallet or allow them to mint/purchase one

      // For demo purposes, we'll simulate having an NFT
      if (!this.nftSneakerId) {
        this.nftSneakerId = `sneaker_${Date.now().toString(36)}`
      }

      // Simulate successful NFT check
      return true
    } catch (error) {
      console.error("Error checking NFT sneakers:", error)
      return false
    }
  }

  public async disableMining(): Promise<boolean> {
    try {
      this.isEnabled = false
      this.saveState()
      console.log("STEPN mining disabled")
      return true
    } catch (error) {
      console.error("Failed to disable STEPN mining:", error)
      return false
    }
  }

  public async submitActivityData(activity: ActivityData): Promise<boolean> {
    if (!this.isEnabled || !this.userId || !this.nftSneakerId) return false

    try {
      // Update energy
      this.updateEnergy()

      // Check if user has enough energy
      if (this.energyAvailable <= 0) {
        console.log("No energy available for STEPN mining")
        return false
      }

      // Calculate energy used for this activity
      const energyUsed = this.calculateEnergyUsed(activity)

      if (energyUsed > this.energyAvailable) {
        console.log(`Not enough energy: have ${this.energyAvailable}, need ${energyUsed}`)
        return false
      }

      // Submit activity to STEPN
      const result = await this.submitToSTEPN(activity, energyUsed)

      if (result.success) {
        // Deduct energy
        this.energyAvailable -= energyUsed

        // Add rewards
        this.addReward(result.gstReward, activity.id, result.txHash)

        // GMT rewards are rarer and based on luck
        if (result.gmtReward > 0) {
          this.addReward(result.gmtReward, activity.id, result.gmtTxHash)
        }

        console.log(`Used ${energyUsed} energy on STEPN, earned ${result.gstReward} GST and ${result.gmtReward} GMT`)
        return true
      } else {
        console.error("Failed to submit activity to STEPN:", result.error)
        return false
      }
    } catch (error) {
      console.error("Failed to submit activity data to STEPN:", error)
      return false
    }
  }

  private updateEnergy(): void {
    // STEPN typically regenerates 25% of max energy every 6 hours
    const now = Date.now()
    const hoursPassed = (now - this.lastEnergyUpdate) / (1000 * 60 * 60)

    // Each 6 hours adds 0.5 energy (up to max of 2)
    const energyToAdd = Math.floor(hoursPassed / 6) * 0.5

    if (energyToAdd > 0) {
      this.energyAvailable = Math.min(2, this.energyAvailable + energyToAdd)
      this.lastEnergyUpdate = now
    }
  }

  private calculateEnergyUsed(activity: ActivityData): number {
    // STEPN typically uses energy based on duration
    // 1 energy point is about 5 minutes of optimal speed movement

    const durationMinutes = activity.duration / 60
    return Math.min(this.energyAvailable, Math.ceil(durationMinutes / 5))
  }

  private async submitToSTEPN(
    activity: ActivityData,
    energyUsed: number,
  ): Promise<{
    success: boolean
    gstReward: number
    gmtReward: number
    txHash?: string
    gmtTxHash?: string
    error?: string
  }> {
    try {
      // In a real implementation, you would call the STEPN API
      // to submit activity data and receive rewards

      // Simulated API call
      console.log(`Submitting activity to STEPN using ${energyUsed} energy`)

      // Calculate GST reward (typically 5-10 GST per energy)
      const baseReward = 5 + Math.random() * 5
      const gstReward = baseReward * energyUsed

      // GMT rewards are rare and based on luck
      // Only about 1% chance to get GMT rewards
      const gmtLucky = Math.random() < 0.01
      const gmtReward = gmtLucky ? 1 + Math.random() * 2 : 0

      // Simulate transaction hashes
      const txHash = `stepn_${Date.now().toString(36)}`
      const gmtTxHash = gmtReward > 0 ? `stepn_gmt_${Date.now().toString(36)}` : undefined

      return {
        success: true,
        gstReward,
        gmtReward,
        txHash,
        gmtTxHash,
      }
    } catch (error) {
      console.error("Error submitting to STEPN:", error)
      return {
        success: false,
        gstReward: 0,
        gmtReward: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}
