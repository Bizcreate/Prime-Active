"use client"

import { useState, useEffect } from "react"

// Define the activity type interface
export interface ActivityType {
  id: string
  name: string
  category: string
  metrics: string[]
  icon?: string
  isCustom: boolean
  createdAt: Date
}

// Default activity types
const defaultActivityTypes: ActivityType[] = [
  {
    id: "running",
    name: "Running",
    category: "Cardio",
    metrics: ["Distance", "Pace", "Calories", "Heart Rate"],
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: "walking",
    name: "Walking",
    category: "Cardio",
    metrics: ["Steps", "Distance", "Calories"],
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: "cycling",
    name: "Cycling",
    category: "Cardio",
    metrics: ["Distance", "Speed", "Elevation", "Calories"],
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: "skateboarding",
    name: "Skateboarding",
    category: "Board Sports",
    metrics: ["Duration", "Tricks", "Distance"],
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: "surfing",
    name: "Surfing",
    category: "Board Sports",
    metrics: ["Duration", "Waves Caught", "Max Wave Height"],
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: "snowboarding",
    name: "Snowboarding",
    category: "Board Sports",
    metrics: ["Runs", "Distance", "Max Speed", "Elevation"],
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: "weightlifting",
    name: "Weightlifting",
    category: "Strength",
    metrics: ["Sets", "Reps", "Weight", "Rest Time"],
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: "lagree",
    name: "Lagree",
    category: "Flexibility",
    metrics: ["Duration", "Poses", "Breathing Rate"],
    isCustom: false,
    createdAt: new Date(),
  },
]

// Available metrics for custom activity types
export const availableMetrics = [
  "Distance",
  "Duration",
  "Pace",
  "Speed",
  "Calories",
  "Heart Rate",
  "Steps",
  "Elevation",
  "Reps",
  "Sets",
  "Weight",
  "Rest Time",
  "Tricks",
  "Waves Caught",
  "Max Wave Height",
  "Runs",
  "Max Speed",
  "Poses",
  "Breathing Rate",
  "Jumps",
  "Flips",
  "Spins",
  "Laps",
  "Strokes",
]

// Available categories
export const availableCategories = [
  "Cardio",
  "Strength",
  "Flexibility",
  "Board Sports",
  "Water Sports",
  "Winter Sports",
  "Team Sports",
  "Combat Sports",
  "Mind & Body",
  "Other",
]

// Hook for managing activity types
export function useActivityTypes() {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load activity types from local storage on mount
  useEffect(() => {
    const loadActivityTypes = () => {
      setIsLoading(true)
      try {
        const storedTypes = localStorage.getItem("activityTypes")
        if (storedTypes) {
          const parsedTypes = JSON.parse(storedTypes)
          // Convert string dates back to Date objects
          const typesWithDates = parsedTypes.map((type: any) => ({
            ...type,
            createdAt: new Date(type.createdAt),
          }))
          setActivityTypes(typesWithDates)
        } else {
          // If no stored types, use defaults
          setActivityTypes(defaultActivityTypes)
          // Save defaults to local storage
          localStorage.setItem("activityTypes", JSON.stringify(defaultActivityTypes))
        }
      } catch (error) {
        console.error("Error loading activity types:", error)
        setActivityTypes(defaultActivityTypes)
      } finally {
        setIsLoading(false)
      }
    }

    loadActivityTypes()
  }, [])

  // Save activity types to local storage whenever they change
  useEffect(() => {
    if (activityTypes.length > 0 && !isLoading) {
      localStorage.setItem("activityTypes", JSON.stringify(activityTypes))
    }
  }, [activityTypes, isLoading])

  // Add a new activity type
  const addActivityType = (activityType: Omit<ActivityType, "id" | "isCustom" | "createdAt">) => {
    const newType: ActivityType = {
      ...activityType,
      id: `custom-${Date.now()}`,
      isCustom: true,
      createdAt: new Date(),
    }
    setActivityTypes((prev) => [...prev, newType])
    return newType
  }

  // Update an existing activity type
  const updateActivityType = (id: string, updates: Partial<Omit<ActivityType, "id" | "isCustom" | "createdAt">>) => {
    setActivityTypes((prev) => prev.map((type) => (type.id === id ? { ...type, ...updates } : type)))
  }

  // Delete an activity type
  const deleteActivityType = (id: string) => {
    // Only allow deletion of custom types
    setActivityTypes((prev) => prev.filter((type) => !(type.id === id && type.isCustom)))
  }

  // Get an activity type by ID
  const getActivityTypeById = (id: string) => {
    return activityTypes.find((type) => type.id === id)
  }

  return {
    activityTypes,
    isLoading,
    addActivityType,
    updateActivityType,
    deleteActivityType,
    getActivityTypeById,
  }
}
