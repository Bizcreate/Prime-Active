"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useActivityTypes, availableMetrics, availableCategories } from "@/services/activity-types-service"
import { ArrowLeft, Plus, X, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function ActivityTypesPage() {
  const { activityTypes, isLoading, addActivityType, updateActivityType, deleteActivityType } = useActivityTypes()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTypeId, setCurrentTypeId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    metrics: [] as string[],
  })
  const [selectedMetric, setSelectedMetric] = useState("")

  // Filter to only show custom types
  const customTypes = activityTypes.filter((type) => type.isCustom)

  const handleOpenDialog = (isEdit = false, typeId?: string) => {
    if (isEdit && typeId) {
      const type = activityTypes.find((t) => t.id === typeId)
      if (type) {
        setFormData({
          name: type.name,
          category: type.category,
          metrics: [...type.metrics],
        })
        setCurrentTypeId(typeId)
        setIsEditing(true)
      }
    } else {
      // Reset form for new activity type
      setFormData({
        name: "",
        category: "",
        metrics: [],
      })
      setCurrentTypeId(null)
      setIsEditing(false)
    }
    setIsDialogOpen(true)
  }

  const handleAddMetric = () => {
    if (selectedMetric && !formData.metrics.includes(selectedMetric)) {
      setFormData({
        ...formData,
        metrics: [...formData.metrics, selectedMetric],
      })
      setSelectedMetric("")
    }
  }

  const handleRemoveMetric = (metric: string) => {
    setFormData({
      ...formData,
      metrics: formData.metrics.filter((m) => m !== metric),
    })
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.category || formData.metrics.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      if (isEditing && currentTypeId) {
        updateActivityType(currentTypeId, formData)
        toast({
          title: "Activity type updated",
          description: `${formData.name} has been updated successfully`,
        })
      } else {
        addActivityType(formData)
        toast({
          title: "Activity type created",
          description: `${formData.name} has been added to your activity types`,
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your activity type",
        variant: "destructive",
      })
    }
  }

  const handleDelete = (typeId: string) => {
    const type = activityTypes.find((t) => t.id === typeId)
    if (type) {
      deleteActivityType(typeId)
      toast({
        title: "Activity type deleted",
        description: `${type.name} has been removed from your activity types`,
      })
    }
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-black p-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/start-activity" className="mr-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Activity Types</h1>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" /> New Type
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Default Activity Types</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activityTypes
                  .filter((type) => !type.isCustom)
                  .map((type) => (
                    <Card key={type.id} className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{type.name}</h3>
                            <p className="text-xs text-zinc-400">{type.category}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {type.metrics.map((metric) => (
                                <Badge key={metric} variant="outline" className="text-xs">
                                  {metric}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Custom Activity Types</h2>
              {customTypes.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900 rounded-lg">
                  <p className="text-zinc-400 mb-4">You haven't created any custom activity types yet</p>
                  <Button onClick={() => handleOpenDialog()}>Create Your First Activity Type</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {customTypes.map((type) => (
                    <Card key={type.id} className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{type.name}</h3>
                            <p className="text-xs text-zinc-400">{type.category}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {type.metrics.map((metric) => (
                                <Badge key={metric} variant="outline" className="text-xs">
                                  {metric}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleOpenDialog(true, type.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500"
                              onClick={() => handleDelete(type.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Activity Type" : "Create Activity Type"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Rock Climbing"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Metrics</Label>
              <div className="flex gap-2">
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 flex-1">
                    <SelectValue placeholder="Select metrics to track" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {availableMetrics
                      .filter((metric) => !formData.metrics.includes(metric))
                      .map((metric) => (
                        <SelectItem key={metric} value={metric}>
                          {metric}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={handleAddMetric} disabled={!selectedMetric}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.metrics.map((metric) => (
                  <Badge key={metric} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    {metric}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => handleRemoveMetric(metric)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{isEditing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
