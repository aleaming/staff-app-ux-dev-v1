"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle, 
  Camera, 
  X, 
  Upload,
  CheckCircle2
} from "lucide-react"
import { PhotoUploader } from "./PhotoUploader"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"

export type IssueType = "damage" | "malfunction" | "maintenance" | "missing-item" | "cleaning" | "other"
export type IssuePriority = "low" | "medium" | "high"

interface IssueReportSheetProps {
  homeId: string
  homeCode: string
  homeName?: string
  activityId?: string
  onClose: () => void
}

interface Photo {
  id: string
  file: File
  preview: string
  thumbnail?: string
}

export function IssueReportSheet({
  homeId,
  homeCode,
  homeName,
  activityId,
  onClose
}: IssueReportSheetProps) {
  const [issueType, setIssueType] = useState<IssueType | "">("")
  const [location, setLocation] = useState("")
  const [itemAffected, setItemAffected] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<IssuePriority>("medium")
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const issueTypeOptions: { value: IssueType; label: string }[] = [
    { value: "damage", label: "Damage" },
    { value: "malfunction", label: "Malfunction" },
    { value: "maintenance", label: "Maintenance Needed" },
    { value: "missing-item", label: "Missing Item" },
    { value: "cleaning", label: "Cleaning Issue" },
    { value: "other", label: "Other" }
  ]

  const locationOptions = [
    "Kitchen",
    "Living Room",
    "Bedroom",
    "Bathroom",
    "Hallway",
    "Exterior",
    "Other"
  ]

  const handlePhotoAdd = (file: File, thumbnail?: string) => {
    const photoId = `photo-${Date.now()}`
    const preview = URL.createObjectURL(file)
    
    setPhotos(prev => [...prev, {
      id: photoId,
      file,
      preview,
      thumbnail
    }])
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
    if (!issueType || !location || !itemAffected || !description.trim()) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Save issue report to localStorage (in production, this would be an API call)
      const issueReport = {
        id: `issue-${Date.now()}`,
        homeId,
        homeCode,
        homeName,
        activityId,
        issueType,
        location,
        itemAffected,
        description,
        priority,
        photos: photos.map(p => ({
          id: p.id,
          fileName: p.file.name,
          size: p.file.size
        })),
        reportedAt: new Date().toISOString(),
        status: "open"
      }

      // Save to localStorage
      const issuesKey = `reported-issues-${homeId}`
      const existingIssues = typeof window !== "undefined" 
        ? JSON.parse(localStorage.getItem(issuesKey) || "[]")
        : []
      
      if (typeof window !== "undefined") {
        localStorage.setItem(issuesKey, JSON.stringify([...existingIssues, issueReport]))
      }

      // Show success message
      alert("Issue reported successfully!")
      
      // Close the sheet
      onClose()
    } catch (error) {
      console.error("Error submitting issue:", error)
      alert("Failed to submit issue. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = issueType && location && itemAffected.trim() && description.trim()

  return (
    <div className="space-y-6 pb-24">
      {/* Header Info */}
      <div>
        <p className="text-sm text-muted-foreground">
          {homeCode} {homeName && `• ${homeName}`}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Issue will be linked to current activity
        </p>
      </div>

      {/* Issue Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Issue Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={issueType} onValueChange={(value) => setIssueType(value as IssueType)}>
            <SelectTrigger>
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
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Location in Home</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Item/Area Affected */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Item/Area Affected</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="e.g., Dishwasher, Window, Door handle"
            value={itemAffected}
            onChange={(e) => setItemAffected(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
          />
        </CardContent>
      </Card>

      {/* Priority */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={priority} onValueChange={(value) => setPriority(value as IssuePriority)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="low" />
              <Label htmlFor="low" className="font-normal cursor-pointer">
                Low
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="font-normal cursor-pointer">
                Medium
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high" className="font-normal cursor-pointer">
                High
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Photos (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PhotoUploader
            onPhotoSelect={handlePhotoAdd}
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
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pb-6">
        <Button
          variant="outline"
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
      </div>
    </div>
  )
}

