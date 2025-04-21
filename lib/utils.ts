import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`
  } else {
    return `${(meters / 1000).toFixed(2)}km`
  }
}

export function formatCalories(calories: number): string {
  return `${calories.toFixed(0)} kcal`
}

export function getActivityIcon(type: string): string {
  const icons = {
    walking: "🚶",
    running: "🏃",
    skateboarding: "🛹",
    longboarding: "🛹",
    surfing: "🏄",
    snowboarding: "🏂",
    bmx: "🚲",
    mountainbiking: "🚵",
    roadbiking: "🚴",
  }

  return icons[type as keyof typeof icons] || "🏃"
}

export function shortenAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function generateRandomNFTImage(seed: number): string {
  // In a real app, this would be a real NFT image URL
  return `/placeholder.svg?height=300&width=300&query=nft+${seed}`
}
