"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useActivityTypes } from "@/services/activity-types-service"
import { useActivityTemplates } from "@/services/activity-templates-service"
import { ArrowLeft, Plus, Edit, Trash2, Copy } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export default function ActivityTemplatesPage() {
  const router = useRouter()
  const { activityTypes, isLoading: loadingTypes } = useActivityTypes()
  const { templates, isLoading: loadingTemplates, addTemplate, updateTemplate, deleteTemplate } = useActivityTemplates()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    activityTypeId: "",
    description: "",
    location: "",
    duration: "",
    distance: "",
  })

  const handleOpenDialog = (isEdit = false, templateId?: string) => {
    if (isEdit && templateId) {
      const template = templates.find((t) => t.id === templateId)
      if (template) {
        setFormData({
          name: template.name,
          activityTypeId: template.activityTypeId,
          description: template.description || "",
          location: template.location || "",
          duration: template.duration ? String(template.duration) : "",
          distance: template.distance ? String(template.distance) : "",
        })
        setCurrentTemplateId(templateId)
        setIsEditing(true)
      }
    } else {
      // Reset form for new template
      setFormData({
        name: "",
        activityTypeId: "",
        description: "",
        location: "",
        duration: "",
        distance: "",
      })
      setCurrentTemplateId(null)
      setIsEditing(false)
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.activityTypeId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const templateData = {
        name: formData.name,
        activityTypeId: formData.activityTypeId,
        description: formData.description || undefined,
        location: formData.location || undefined,
        duration: formData.duration ? Number(formData.duration) : undefined,
        distance: formData.distance ? Number(formData.distance) : undefined,
      }

      if (isEditing && currentTemplateId) {
        updateTemplate(currentTemplateId, templateData)
        toast({
          title: "Template updated",
          description: `${formData.name} has been updated successfully`,
        })
      } else {
        addTemplate(templateData)
        toast({
          title: "Template created",
          description: `${formData.name} has been added to your templates`,
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your template",
        variant: "destructive",
      })
    }
  }

  const handleDelete = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      deleteTemplate(templateId)
      toast({
        title: "Template deleted",
        description: `${template.name} has been removed from your templates`,
      })
    }
  }

  const handleUseTemplate = (templateId: string) => {
    router.push(`/start-activity?template=${templateId}`)
  }

  const handleDuplicate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      const newTemplate = addTemplate({
        name: `${template.name} (Copy)`,
        activityTypeId: template.activityTypeId,
        description: template.description,
        location: template.location,
        duration: template.duration,
        distance: template.distance,
        customFields: template.customFields,
      })
      toast({
        title: "Template duplicated",
        description: `${template.name} has been duplicated`,
      })
    }
  }

  const getActivityTypeName = (id: string) => {
    const type = activityTypes.find((type) => type.id === id)
    return type ? type.name : "Unknown"
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
            <h1 className="text-xl font-bold">Activity Templates</h1>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" /> New Template
          </Button>
        </div>

        {loadingTypes || loadingTemplates ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {templates.length === 0 ? (
              <div className="text-center py-12 bg-zinc-900 rounded-lg">
                <p className="text-zinc-400 mb-4">You haven't created any templates yet</p>
                <Button onClick={() => handleOpenDialog()}>Create Your First Template</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates.map((template) => (
                  <Card key={template.id} className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-xs text-zinc-400">{getActivityTypeName(template.activityTypeId)}</p>
                          {template.description && <p className="text-sm mt-2 text-zinc-300">{template.description}</p>}
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-zinc-400">
                            {template.location && <span>📍 {template.location}</span>}
                            {template.duration && <span>⏱️ {template.duration} min</span>}
                            {template.distance && <span>📏 {template.distance} km</span>}
                          </div>
                          {template.usageCount > 0 && (
                            <p className="text-xs mt-2 text-zinc-500">Used {template.usageCount} times</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUseTemplate(template.id)}
                            title="Use Template"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDuplicate(template.id)}
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenDialog(true, template.id)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleDelete(template.id)}
                            title="Delete"
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
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Template" : "Create Template"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Morning Run"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activityType">Activity Type</Label>
              <Select
                value={formData.activityTypeId}
                onValueChange={(value) => setFormData({ ...formData, activityTypeId: value })}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select an activity type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {activityTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add notes or details about this template"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., City Park"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="30"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  placeholder="5.0"
                  className="bg-zinc-800 border-zinc-700"
                />
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
