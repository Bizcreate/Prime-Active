export interface DePINNetwork {
  id: string
  name: string
  description: string
  tokenSymbol: string
  tokenName: string
  logoUrl: string
  website: string
  category: "move-to-earn" | "location" | "compute" | "storage" | "other"
  status: "active" | "inactive" | "coming-soon"
}

export interface DePINServiceConfig {
  apiKey?: string
  apiUrl?: string
  webhookUrl?: string
  options?: Record<string, any>
}

export interface DePINReward {
  networkId: string
  amount: number
  timestamp: number
  txHash?: string
  activityId?: string
  status: "pending" | "confirmed" | "failed"
}

export interface ActivityData {
  id: string
  type: string
  startTime: number
  endTime: number
  distance?: number
  duration?: number
  calories?: number
  steps?: number
  locations?: LocationPoint[]
  metadata?: Record<string, any>
}

export interface LocationPoint {
  latitude: number
  longitude: number
  timestamp: number
  accuracy?: number
  altitude?: number
  speed?: number
}

export interface DePINServiceStatus {
  isActive: boolean
  lastSync?: number
  error?: string
  nodeId?: string
  version?: string
}

export interface DePINTokenBalance {
  networkId: string
  balance: number
  symbol: string
  name: string
  lastUpdated: number
}

export interface DePINStakingInfo {
  networkId: string
  stakedAmount: number
  rewards: number
  apy: number
  lockPeriod: number
  unlockDate?: number
}
