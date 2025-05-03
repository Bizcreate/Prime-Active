export interface DePINNetwork {
  id: string
  name: string
  tokenSymbol: string
  tokenName: string
  logoUrl: string
  description: string
  enabled: boolean
}

export interface DePINReward {
  networkId: string
  amount: number
  timestamp: number
  txHash?: string
  status: "pending" | "confirmed"
  activityId?: string
}

export interface LocationPoint {
  latitude: number
  longitude: number
  timestamp: number
  accuracy?: number
  altitude?: number
  speed?: number
}

export interface ActivityData {
  id: string
  type: string
  startTime: number
  endTime: number
  locations: LocationPoint[]
  distance: number
  duration: number
  userId: string
}

export interface DePINServiceConfig {
  apiKey: string
  apiEndpoint?: string
  networkId?: string
  options?: Record<string, any>
}
