"use client"

import { useState, useEffect, useCallback } from "react"

// Define the activity template interface
export interface ActivityTemplate {
  id: string
  name: string
  activityTypeId: string
  description?: string
  location?: string
  duration?: number
  distance?: number
  customFields?: Record<string, any>
  usageCount: number
  lastUsed?: Date
  createdAt: Date
}

// Hook for managing activity templates
export function useActivityTemplates() {
  const [templates, setTemplates] = useState<ActivityTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load templates from local storage on mount
  useEffect(() => {
    const loadTemplates = () => {
      setIsLoading(true)
      try {
        const storedTemplates = localStorage.getItem("activityTemplates")
        if (storedTemplates) {
          const parsedTemplates = JSON.parse(storedTemplates)
          // Convert string dates back to Date objects
          const templatesWithDates = parsedTemplates.map((template: any) => ({
            ...template,
            lastUsed: template.lastUsed ? new Date(template.lastUsed) : undefined,
            createdAt: new Date(template.createdAt),
          }))
          setTemplates(templatesWithDates)
        } else {
          setTemplates([])
        }
      } catch (error) {
        console.error("Error loading activity templates:", error)
        setTemplates([])
      } finally {
        setIsLoading(false)
      }
    }

    loadTemplates()
  }, [])

  // Save templates to local storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("activityTemplates", JSON.stringify(templates))
    }
  }, [templates, isLoading])

  // Add a new template
  const addTemplate = useCallback(
    (template: Omit<ActivityTemplate, "id" | "usageCount" | "lastUsed" | "createdAt">) => {
      const newTemplate: ActivityTemplate = {
        ...template,
        id: `template-${Date.now()}`,
        usageCount: 0,
        createdAt: new Date(),
      }
      setTemplates((prev) => [...prev, newTemplate])
      return newTemplate
    },
    [],
  )

  // Update an existing template
  const updateTemplate = useCallback(
    (id: string, updates: Partial<Omit<ActivityTemplate, "id" | "usageCount" | "lastUsed" | "createdAt">>) => {
      setTemplates((prev) => prev.map((template) => (template.id === id ? { ...template, ...updates } : template)))
    },
    [],
  )

  // Delete a template
  const deleteTemplate = useCallback((id: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== id))
  }, [])

  // Get a template by ID
  const getTemplateById = useCallback(
    (id: string | null) => {
      if (!id) return undefined
      return templates.find((template) => template.id === id)
    },
    [templates],
  )

  // Mark a template as used
  const useTemplate = useCallback((id: string | null | undefined) => {
    if (!id) return

    setTemplates((prev) =>
      prev.map((template) =>
        template.id === id
          ? {
              ...template,
              usageCount: template.usageCount + 1,
              lastUsed: new Date(),
            }
          : template,
      ),
    )
  }, [])

  // Get most used templates
  const getMostUsedTemplates = useCallback(
    (limit = 3) => {
      return [...templates]
        .filter((template) => template.usageCount > 0)
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, limit)
    },
    [templates],
  )

  return {
    templates,
    isLoading,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplateById,
    useTemplate,
    getMostUsedTemplates,
  }
}
