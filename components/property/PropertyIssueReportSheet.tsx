"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { CLOSE_ALL_SHEETS_EVENT } from "@/lib/sheet-utils"
import { CheckCircle2, Flag, Upload } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PhotoUploader } from "@/components/activities/PhotoUploader"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"
import type { PropertyHierarchyNode, PropertyIssueType, PropertyIssuePriority } from "@/lib/test-data"

interface Photo {
  id: string
  file: File
  preview: string
  thumbnail?: string
}

interface PropertyIssueReportSheetProps {
  item?: PropertyHierarchyNode // Optional - if not provided, it's a general home/activity issue
  breadcrumbs: Array<{ label: string; href?: string }>
  homeId?: string // Required when item is not provided
  homeCode?: string
  homeName?: string
  activityId?: string // Optional - for activity-specific issues
  onClose: () => void
  onSubmit?: (issue: {
    itemId?: string
    type: PropertyIssueType
    description: string
    priority: PropertyIssuePriority
    photos: Photo[]
  }) => void
}

export function PropertyIssueReportSheet({
  item,
  breadcrumbs,
  homeId,
  homeCode,
  homeName,
  activityId,
  onClose,
  onSubmit
}: PropertyIssueReportSheetProps) {
  const [issueType, setIssueType] = useState<PropertyIssueType | undefined>(undefined)
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<PropertyIssuePriority>("medium")
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Close sheet when navigation occurs
  useEffect(() => {
    window.addEventListener(CLOSE_ALL_SHEETS_EVENT, onClose)
    return () => window.removeEventListener(CLOSE_ALL_SHEETS_EVENT, onClose)
  }, [onClose])

  const issueTypeOptions: { value: PropertyIssueType; label: string }[] = [
    { value: "not-working", label: "Not Working" },
    { value: "damaged", label: "Damaged" },
    { value: "missing", label: "Missing" },
    { value: "needs-cleaning", label: "Needs Cleaning" }
  ]

  const priorityOptions: { value: PropertyIssuePriority; label: string; description: string }[] = [
    { value: "urgent", label: "Urgent", description: "Safety hazard" },
    { value: "high", label: "High", description: "Affects guest stay" },
    { value: "medium", label: "Medium", description: "Should be addressed" },
    { value: "low", label: "Low", description: "Minor issue" }
  ]

  const handlePhotoAdd = (file: File, thumbnail?: string) => {
    if (photos.length >= 5) {
      toast.error("Maximum 5 photos allowed")
      return
    }
    const photoId = `photo-${Date.now()}-${Math.random()}`
    const preview = URL.createObjectURL(file)
    setPhotos(prev => [...prev, { id: photoId, file, preview, thumbnail }])
  }

  const handlePhotoRemove = (photoId: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === photoId)
      if (photo) {
        URL.revokeObjectURL(photo.preview)
      }
      return prev.filter(p => p.id !== photoId)
    })
  }

  const handleSubmit = async () => {
    if (!issueType || !description.trim() || photos.length === 0) {
      toast.error("Please fill in all required fields and add at least one photo")
      return
    }

    const selectedIssueType = issueType as PropertyIssueType

    setIsSubmitting(true)

    try {
      // Generate ticket number: ISS-{timestamp in base36}
      const ticketNumber = `ISS-${Date.now().toString(36).toUpperCase()}`
      
      const queueKey = item 
        ? `property-issue-queue-${item.id.split("-")[0]}`
        : `property-issue-queue-${homeId || 'general'}`

      if (!isOnline) {
        // Queue for offline submission
        const existingQueue = typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem(queueKey) || "[]")
          : []
        
        const queuedIssue = {
          ticketNumber,
          itemId: item ? item.id : undefined,
          homeId,
          homeCode,
          homeName,
          activityId,
          type: selectedIssueType,
          description: description.trim(),
          priority,
          photos: photos.map(p => ({
            id: p.id,
            fileName: p.file.name,
            size: p.file.size
          })),
          timestamp: new Date().toISOString()
        }

        if (typeof window !== "undefined") {
          localStorage.setItem(queueKey, JSON.stringify([...existingQueue, queuedIssue]))
        }

        toast.success(`Issue #${ticketNumber} queued for submission when connection is restored`)
        onClose()
        return
      }

      // If onSubmit callback is provided, use it (for property browser)
      if (onSubmit) {
        onSubmit({
          itemId: item?.id,
          type: selectedIssueType,
          description: description.trim(),
          priority,
          photos
        })
        toast.success(`Issue #${ticketNumber} created successfully!`)
      } else {
        // Otherwise, save directly to localStorage (for Quick Links)
        const issueData = {
          id: `issue-${Date.now()}-${Math.random()}`,
          ticketNumber,
          itemId: item?.id,
          homeId,
          homeCode,
          homeName,
          activityId,
          reporterName: "Staff Member", // In production, get from auth
          reportedDate: new Date(),
          description: description.trim(),
          status: "open" as const,
          priority,
          type: selectedIssueType,
          photos: photos.map(p => ({
            id: p.id,
            url: p.preview, // In production, upload to server
            fileName: p.file.name
          }))
        }

        // Save to appropriate localStorage key
        if (item && homeId) {
          // Property item issue
          const issuesKey = `property-issues-${homeId}`
          const existing = typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem(issuesKey) || "[]")
            : []
          
          if (typeof window !== "undefined") {
            localStorage.setItem(issuesKey, JSON.stringify([...existing, issueData]))
          }
        } else if (homeId) {
          // General home issue
          const issuesKey = `home-issues-${homeId}`
          const existing = typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem(issuesKey) || "[]")
            : []
          
          if (typeof window !== "undefined") {
            localStorage.setItem(issuesKey, JSON.stringify([...existing, issueData]))
          }
        }
        toast.success(`Issue #${ticketNumber} created successfully!`)
      }
      onClose()
    } catch (error) {
      console.error("Error submitting issue:", error)
      toast.error("Failed to submit issue. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = !!issueType && description.trim().length > 0 && photos.length > 0

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent side="bottom" className="max-h-[82vh] overflow-y-auto pb-48">
        <SheetHeader>
          <SheetTitle className="text-left">Report Issue</SheetTitle>
          <div className="mt-2 space-y-1">
            <Breadcrumbs items={breadcrumbs} />
            {item && (
              <div className="font-medium text-base text-left">{item.label}</div>
            )}
            {!item && homeCode && (
              <div className="font-medium text-sm text-left">
                {homeCode} {homeName && `• ${homeName}`}
              </div>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4 text-left">
          {/* Offline Indicator */}
          {!isOnline && (
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-sm text-yellow-800 dark:text-yellow-200">
              You are offline. This issue will be queued and submitted when connection is restored.
            </div>
          )}

          {/* Issue Type */}
          <div className="space-y-2">
            <Label htmlFor="issue-type">Issue Type *</Label>
            <Select 
              value={issueType || ""} 
              onValueChange={(value) => setIssueType(value as PropertyIssueType)}
            >
              <SelectTrigger id="issue-type">
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {issueTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="min-h-[100px]"
            />
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <Label>Priority</Label>
            <RadioGroup value={priority} onValueChange={(value) => setPriority(value as PropertyIssuePriority)}>
              {priorityOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-2 py-1">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                  <Label htmlFor={option.value} className="font-normal cursor-pointer flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Photos */}
          <div className="space-y-3">
            <Label>Photos (Required)</Label>
            <p className="text-xs text-muted-foreground">At least 1 photo is required (max 5)</p>
            <PhotoUploader
              onPhotoSelect={handlePhotoAdd}
              multiple={true}
              maxPhotos={5}
              currentCount={photos.length}
            />
            
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
                    <img
                      src={photo.preview}
                      alt="Issue photo"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 dark:bg-black/70 text-background opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handlePhotoRemove(photo.id)}
                      aria-label="Remove photo"
                    >
                      <span className="sr-only">Remove</span>
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="mt-6 gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Submit Issue
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

