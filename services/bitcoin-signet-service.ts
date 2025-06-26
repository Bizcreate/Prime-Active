import { layerTwoLabsService } from "./layer-two-labs-service"
import { BaseDePINService } from "./base-depin-service"
import type { DePINNetwork, DePINServiceConfig, ActivityData } from "./depin-types"

// Bitcoin Signet node configuration
interface SignetNodeConfig {
  nodeUrl: string
  username: string
  password: string
  walletName: string
  bip300Enabled: boolean
  sidechain: {
    id: string
    name: string
  }
}

// Mining status interface
interface SignetMiningStatus {
  isRunning: boolean
  hashrate: number
  connectedPeers: number
  lastBlockMined?: {
    height: number
    hash: string
    timestamp: number
  }
}

// Sidechain deposit interface
interface SidechainDeposit {
  txid: string
  amount: number
  status: "pending" | "confirmed" | "failed"
  timestamp: number
}

class BitcoinSignetService extends BaseDePINService {
  private config: SignetNodeConfig | null = null
  private isInitialized = false
  private _isNodeRunning = false
  private miningStatus: SignetMiningStatus = {
    isRunning: false,
    hashrate: 0,
    connectedPeers: 0,
  }
  private deposits: SidechainDeposit[] = []
  private storageKeyPrefix = "btc_signet_"
  private miningActive = false
  private hashRate = 0
  private blocksFound = 0

  constructor() {
    const bitcoinNetwork: DePINNetwork = {
      id: "bitcoin-signet",
      name: "Bitcoin Signet",
      description: "Bitcoin testnet for sidechain development",
      tokenSymbol: "sBTC",
      tokenName: "Signet Bitcoin",
      logoUrl: "/bitcoin-logo.png",
      category: "compute",
      status: "active",
    }

    const config: DePINServiceConfig = {
      apiUrl: "https://signet-api.bitcoin.org",
      options: {
        rewardInterval: 600000, // 10 minutes (Bitcoin block time)
        minActivityForReward: 1,
      },
    }

    super(bitcoinNetwork, config)
    this.loadState()
  }

  // Initialize the service with configuration
  public async initialize(config: SignetNodeConfig): Promise<boolean> {
    try {
      // Validate configuration
      if (!config.nodeUrl || !config.username || !config.password) {
        console.error("Invalid Bitcoin Signet node configuration")
        return false
      }

      // Test connection to the node
      const connectionTest = await this.testNodeConnection(config)
      if (!connectionTest.success) {
        console.error("Failed to connect to Bitcoin Signet node:", connectionTest.error)
        return false
      }

      this.config = config
      this.isInitialized = true
      this.saveState()

      console.log("Bitcoin Signet service initialized successfully")

      // Check if BIP300/301 is supported
      if (config.bip300Enabled) {
        const bip300Support = await this.checkBIP300Support()
        if (!bip300Support.supported) {
          console.warn("BIP300/301 not fully supported by the node:", bip300Support.message)
        } else {
          console.log("BIP300/301 support confirmed")
        }
      }

      return true
    } catch (error) {
      console.error("Error initializing Bitcoin Signet service:", error)
      return false
    }
  }

  // Test connection to the node
  private async testNodeConnection(config: SignetNodeConfig): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${config.nodeUrl}/rest/chaininfo.json`, {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa(`${config.username}:${config.password}`),
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        return { success: false, error: await response.text() }
      }

      const chainInfo = await response.json()
      if (chainInfo.chain !== "signet") {
        return { success: false, error: "Node is not on signet network" }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  }

  // Check if the node supports BIP300/301
  private async checkBIP300Support(): Promise<{ supported: boolean; message?: string }> {
    if (!this.isInitialized || !this.config) {
      return { supported: false, message: "Service not initialized" }
    }

    try {
      // Check if the node has the BIP300 methods
      const methods = ["getdrivechaininfo", "createwithdrawal", "listsidechains"]

      for (const method of methods) {
        const response = await this.callRPC(method)
        if (response.error) {
          return { supported: false, message: `Method ${method} not supported` }
        }
      }

      return { supported: true }
    } catch (error) {
      return { supported: false, message: String(error) }
    }
  }

  // Start the mining node
  public async startNode(): Promise<boolean> {
    if (!this.isInitialized || !this.config) {
      console.error("Service not initialized")
      return false
    }

    try {
      // Call the node's mining start method
      const response = await this.callRPC("generatetoaddress", [1, await this.getSignetAddress()])

      if (response.error) {
        console.error("Failed to start mining:", response.error)
        return false
      }

      this._isNodeRunning = true
      this.miningStatus.isRunning = true
      this.saveState()

      // Start polling for status updates
      this.startStatusPolling()

      console.log("Bitcoin Signet mining started successfully")
      return true
    } catch (error) {
      console.error("Error starting Bitcoin Signet mining:", error)
      return false
    }
  }

  // Stop the mining node
  public async stopNode(): Promise<boolean> {
    if (!this.isInitialized || !this.config) {
      console.error("Service not initialized")
      return false
    }

    try {
      // There's no direct "stop mining" RPC in Bitcoin Core
      // Instead, we'll just update our state
      this._isNodeRunning = false
      this.miningStatus.isRunning = false
      this.saveState()

      // Stop polling for status updates
      this.stopStatusPolling()

      console.log("Bitcoin Signet mining stopped successfully")
      return true
    } catch (error) {
      console.error("Error stopping Bitcoin Signet mining:", error)
      return false
    }
  }

  // Check if the node is running
  public isNodeRunning(): boolean {
    return this._isNodeRunning
  }

  // Get the current mining status
  public getMiningStatus(): SignetMiningStatus {
    return { ...this.miningStatus }
  }

  // Get a signet address for mining rewards
  private async getSignetAddress(): Promise<string> {
    if (!this.isInitialized || !this.config) {
      throw new Error("Service not initialized")
    }

    try {
      // First, ensure the wallet exists
      await this.callRPC("loadwallet", [this.config.walletName]).catch(() => {
        // If wallet doesn't exist, create it
        return this.callRPC("createwallet", [this.config.walletName])
      })

      // Get a new address from the wallet
      const response = await this.callRPC("getnewaddress", ["mining_rewards", "bech32"])

      if (response.error) {
        throw new Error(`Failed to get address: ${response.error.message}`)
      }

      return response.result
    } catch (error) {
      console.error("Error getting signet address:", error)
      throw error
    }
  }

  // Deposit to sidechain (BIP300/301)
  public async depositToSidechain(amount: number): Promise<{ success: boolean; txid?: string; error?: string }> {
    if (!this.isInitialized || !this.config || !this.config.bip300Enabled) {
      return { success: false, error: "Service not initialized or BIP300 not enabled" }
    }

    try {
      // Check if the sidechain is available
      const sidechainsResponse = await this.callRPC("listsidechains")

      if (sidechainsResponse.error) {
        return { success: false, error: `Failed to list sidechains: ${sidechainsResponse.error.message}` }
      }

      const sidechains = sidechainsResponse.result
      const targetSidechain = sidechains.find((sc: any) => sc.id === this.config?.sidechain.id)

      if (!targetSidechain) {
        return { success: false, error: `Sidechain ${this.config.sidechain.id} not found` }
      }

      // Create a deposit transaction
      const depositResponse = await this.callRPC("createsidechaindeposit", [
        this.config.sidechain.id,
        amount,
        await this.getSignetAddress(), // Refund address if needed
      ])

      if (depositResponse.error) {
        return { success: false, error: `Failed to create deposit: ${depositResponse.error.message}` }
      }

      const txid = depositResponse.result.txid

      // Record the deposit
      const deposit: SidechainDeposit = {
        txid,
        amount,
        status: "pending",
        timestamp: Date.now(),
      }

      this.deposits.push(deposit)
      this.saveState()

      // Notify LayerTwoLabs service about the deposit
      await this.notifyLayerTwoLabsOfDeposit(deposit)

      return { success: true, txid }
    } catch (error) {
      console.error("Error depositing to sidechain:", error)
      return { success: false, error: String(error) }
    }
  }

  // Get all deposits
  public getDeposits(): SidechainDeposit[] {
    return [...this.deposits]
  }

  // Update deposit status
  public async updateDepositStatus(txid: string): Promise<boolean> {
    if (!this.isInitialized || !this.config) {
      return false
    }

    try {
      // Find the deposit
      const depositIndex = this.deposits.findIndex((d) => d.txid === txid)
      if (depositIndex === -1) {
        return false
      }

      // Check transaction status
      const txResponse = await this.callRPC("gettransaction", [txid])

      if (txResponse.error) {
        return false
      }

      const tx = txResponse.result

      // Update status based on confirmations
      if (tx.confirmations >= 1) {
        this.deposits[depositIndex].status = "confirmed"
        this.saveState()
        return true
      }

      return false
    } catch (error) {
      console.error("Error updating deposit status:", error)
      return false
    }
  }

  // Notify LayerTwoLabs service about a deposit
  private async notifyLayerTwoLabsOfDeposit(deposit: SidechainDeposit): Promise<void> {
    if (!layerTwoLabsService.isServiceInitialized()) {
      console.log("LayerTwoLabs service not initialized, skipping notification")
      return
    }

    try {
      // This would be a custom integration point with LayerTwoLabs
      // For now, we'll just log it
      console.log("Notifying LayerTwoLabs of deposit:", deposit)

      // In a real implementation, you would call a specific API endpoint
      // or method in the LayerTwoLabs service
    } catch (error) {
      console.error("Error notifying LayerTwoLabs of deposit:", error)
    }
  }

  // Call RPC method on the Bitcoin node
  private async callRPC(method: string, params: any[] = []): Promise<any> {
    if (!this.isInitialized || !this.config) {
      throw new Error("Service not initialized")
    }

    try {
      const response = await fetch(this.config.nodeUrl, {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${this.config.username}:${this.config.password}`),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "1.0",
          id: "signet-" + Date.now(),
          method,
          params,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error calling RPC method ${method}:`, error)
      return { error: { code: -1, message: String(error) } }
    }
  }

  // Start polling for status updates
  private statusPollingInterval: any = null
  private startStatusPolling(): void {
    if (this.statusPollingInterval) {
      clearInterval(this.statusPollingInterval)
    }

    this.statusPollingInterval = setInterval(async () => {
      if (!this._isNodeRunning) {
        this.stopStatusPolling()
        return
      }

      try {
        // Update mining status
        await this.updateMiningStatus()

        // Update deposit statuses
        const pendingDeposits = this.deposits.filter((d) => d.status === "pending")
        for (const deposit of pendingDeposits) {
          await this.updateDepositStatus(deposit.txid)
        }
      } catch (error) {
        console.error("Error in status polling:", error)
      }
    }, 30000) // Poll every 30 seconds
  }

  // Stop polling for status updates
  private stopStatusPolling(): void {
    if (this.statusPollingInterval) {
      clearInterval(this.statusPollingInterval)
      this.statusPollingInterval = null
    }
  }

  // Update mining status
  private async updateMiningStatus(): Promise<void> {
    if (!this.isInitialized || !this.config) {
      return
    }

    try {
      // Get network info
      const networkInfoResponse = await this.callRPC("getnetworkinfo")
      if (!networkInfoResponse.error) {
        this.miningStatus.connectedPeers = networkInfoResponse.result.connections
      }

      // Get mining info
      const miningInfoResponse = await this.callRPC("getmininginfo")
      if (!miningInfoResponse.error) {
        this.miningStatus.hashrate = miningInfoResponse.result.networkhashps
      }

      // Get latest block info
      const blockchainInfoResponse = await this.callRPC("getblockchaininfo")
      if (!blockchainInfoResponse.error) {
        const height = blockchainInfoResponse.result.blocks
        const hash = blockchainInfoResponse.result.bestblockhash

        // Get block details to get timestamp
        const blockResponse = await this.callRPC("getblock", [hash])
        if (!blockResponse.error) {
          this.miningStatus.lastBlockMined = {
            height,
            hash,
            timestamp: blockResponse.result.time * 1000, // Convert to milliseconds
          }
        }
      }

      this.saveState()
    } catch (error) {
      console.error("Error updating mining status:", error)
    }
  }

  // Save state to local storage
  private saveState(): void {
    if (typeof window === "undefined") return

    try {
      // Save initialization status
      localStorage.setItem(`${this.storageKeyPrefix}initialized`, String(this.isInitialized))

      // Save node running status
      localStorage.setItem(`${this.storageKeyPrefix}nodeRunning`, String(this._isNodeRunning))

      // Save mining status
      localStorage.setItem(`${this.storageKeyPrefix}miningStatus`, JSON.stringify(this.miningStatus))

      // Save deposits
      localStorage.setItem(`${this.storageKeyPrefix}deposits`, JSON.stringify(this.deposits))

      // Save config (excluding sensitive data)
      if (this.config) {
        const safeConfig = {
          nodeUrl: this.config.nodeUrl,
          walletName: this.config.walletName,
          bip300Enabled: this.config.bip300Enabled,
          sidechain: this.config.sidechain,
          // Don't save username/password
        }
        localStorage.setItem(`${this.storageKeyPrefix}config`, JSON.stringify(safeConfig))
      }

      // Save mining active status
      localStorage.setItem(`${this.storageKeyPrefix}miningActive`, String(this.miningActive))

      // Save hash rate
      localStorage.setItem(`${this.storageKeyPrefix}hashRate`, String(this.hashRate))

      // Save blocks found
      localStorage.setItem(`${this.storageKeyPrefix}blocksFound`, String(this.blocksFound))
    } catch (error) {
      console.error("Error saving Bitcoin Signet state:", error)
    }
  }

  // Load state from local storage
  private loadState(): void {
    if (typeof window === "undefined") return

    try {
      // Load initialization status
      const initialized = localStorage.getItem(`${this.storageKeyPrefix}initialized`)
      this.isInitialized = initialized === "true"

      // Load node running status
      const nodeRunning = localStorage.getItem(`${this.storageKeyPrefix}nodeRunning`)
      this._isNodeRunning = nodeRunning === "true"

      // Load mining status
      const miningStatusJson = localStorage.getItem(`${this.storageKeyPrefix}miningStatus`)
      if (miningStatusJson) {
        this.miningStatus = JSON.parse(miningStatusJson)
      }

      // Load deposits
      const depositsJson = localStorage.getItem(`${this.storageKeyPrefix}deposits`)
      if (depositsJson) {
        this.deposits = JSON.parse(depositsJson)
      }

      // Load config (partial, without sensitive data)
      const configJson = localStorage.getItem(`${this.storageKeyPrefix}config`)
      if (configJson) {
        const partialConfig = JSON.parse(configJson)
        // Note: username/password need to be provided again on initialization
        this.config = partialConfig as SignetNodeConfig
      }

      // Load mining active status
      const miningActive = localStorage.getItem(`${this.storageKeyPrefix}miningActive`)
      this.miningActive = miningActive === "true"

      // Load hash rate
      const hashRate = localStorage.getItem(`${this.storageKeyPrefix}hashRate`)
      this.hashRate = hashRate ? Number.parseFloat(hashRate) : 0

      // Load blocks found
      const blocksFound = localStorage.getItem(`${this.storageKeyPrefix}blocksFound`)
      this.blocksFound = blocksFound ? Number.parseInt(blocksFound, 10) : 0

      // If node was running when state was saved, restart status polling
      if (this._isNodeRunning) {
        this.startStatusPolling()
      }
    } catch (error) {
      console.error("Error loading Bitcoin Signet state:", error)
    }
  }

  public async startMining(): Promise<boolean> {
    try {
      console.log("Starting Bitcoin Signet mining...")
      this.miningActive = true
      this.hashRate = Math.random() * 1000 + 100 // Simulate hash rate

      // Start mining interval
      setInterval(() => this.checkForBlocks(), 60000) // Check every minute

      this.saveState()
      return true
    } catch (error) {
      console.error("Failed to start Bitcoin mining:", error)
      return false
    }
  }

  public async stopMining(): Promise<boolean> {
    this.miningActive = false
    this.hashRate = 0
    this.saveState()
    return true
  }

  private checkForBlocks(): void {
    if (!this.miningActive) return

    // Simulate finding blocks (very low probability)
    const blockFound = Math.random() < 0.001 // 0.1% chance per minute

    if (blockFound) {
      this.blocksFound++
      const reward = 6.25 // Bitcoin block reward (testnet)
      this.addReward(reward, `block-${this.blocksFound}`)
      console.log(`Found Bitcoin Signet block! Reward: ${reward} sBTC`)
    }

    // Activity-based mining boost
    const activityBoost = Math.random() * 0.01 // Small random reward
    if (activityBoost > 0.005) {
      this.addReward(activityBoost, `activity-boost-${Date.now()}`)
    }
  }

  public async submitActivityData(activity: ActivityData): Promise<boolean> {
    if (!this.miningActive) return false

    // Boost mining based on activity
    const boost = this.calculateMiningBoost(activity)
    if (boost > 0) {
      this.addReward(boost, activity.id)
      console.log(`Bitcoin mining activity boost: ${boost.toFixed(6)} sBTC`)
    }

    return true
  }

  private calculateMiningBoost(activity: ActivityData): number {
    // Higher activity = better mining rewards
    const durationHours = activity.duration / 3600
    const boost = durationHours * 0.001 // 0.001 sBTC per hour of activity

    return Math.min(boost, 0.01) // Cap at 0.01 sBTC
  }

  public getMiningStats() {
    return {
      isActive: this.miningActive,
      hashRate: this.hashRate,
      blocksFound: this.blocksFound,
      totalEarnings: this.getBalance(),
    }
  }
}

export const bitcoinSignetService = new BitcoinSignetService()
