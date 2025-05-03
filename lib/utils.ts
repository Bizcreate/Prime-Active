import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters.toFixed(0)} m`
  }
  return `${(meters / 1000).toFixed(2)} km`
}

export function formatCalories(calories: number): string {
  return `${calories.toFixed(0)} kcal`
}

export function generateRandomNFTImage(seed: number): string {
  const patterns = [
    "abstract-digital-art.png",
    "abstract-nft-duo.png",
    "digital-art-launch.png",
    "chromatic-flow.png",
    "kaleidoscopic-shapes.png",
    "abstract-golden-shape.png",
    "ethereal-crystal-entity.png",
    "cyber-simian.png",
  ]

  const index = (seed || Date.now()) % patterns.length
  return `/${patterns[index]}`
}
