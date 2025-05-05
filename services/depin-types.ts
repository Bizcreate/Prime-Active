export interface DePINNetwork {
  id: string
  name: string
  description: string
  tokenSymbol: string
  tokenName: string
  logoUrl: string
  website?: string
  category: "move-to-earn" | "location" | "compute" | "storage" | "other"
  status: "active" | "inactive" | "coming-soon"
  chainId?: number
  enabled?: boolean
}

export interface DePINServiceConfig {
  apiKey?: string
  apiUrl?: string
  webhookUrl?: string
  options?: Record<string, any>
}

export interface Reward {
  amount: number
  timestamp: number
  txHash?: string
  activityId?: string
}

export interface ActivityData {
  id: string
  type: string
  startTime: number
  endTime: number
  distance: number
  duration: number
  calories: number
  steps: number
  locations: LocationPoint[]
}

export interface LocationPoint {
  latitude: number
  longitude: number
  timestamp: number
  accuracy?: number
  altitude?: number
  speed?: number
}
