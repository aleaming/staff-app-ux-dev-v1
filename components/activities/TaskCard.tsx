"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PhotoUploader, type PhotoUploaderHandle } from "./PhotoUploader"
import { PhotoGallery } from "./PhotoGallery"
import { PhotoAnnotationDialog } from "./PhotoAnnotation"
import { useHapticFeedback } from "@/components/haptic/HapticProvider"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { findNodeByLocation } from "@/lib/property/location-matcher"
import { findNodeByItemName, type MatchResult } from "@/lib/property/item-matcher"
import { getPropertyHierarchy } from "@/lib/test-data"
import { ItemDetailsSheet } from "@/components/property/ItemDetailsSheet"
import type { PropertyHierarchyNode, PropertyIssue } from "@/lib/test-data"
import { 
  AlertCircle, 
  Info, 
  Camera, 
  CheckCircle2,
  Clock,
  Upload,
  AlertTriangle,
  Package,
  Lock,
  Plug,
  Pin,
  Settings,
  Search,
  Sparkles,
  ClipboardCheck,
  ShieldCheck,
  Power,
  Trash2,
  FileText,
  Wind,
  ChevronDown,
  ChevronUp,
  Eye,
  MessageSquare,
  PlayCircle,
  Hand,
  MessageCircle,
  Eraser,
  Minus,
  Scissors,
  Unlock,
  Video,
  Truck,
  StickyNote
} from "lucide-react"
import type { TaskTemplate, TaskAction } from "@/lib/activity-templates"
import type { PhotoAnnotation } from "./PhotoAnnotation"

interface Photo {
  id: string
  url?: string
  localPath: string
  status: "uploaded" | "in-queue" | "failed"
  uploadedAt?: Date
  annotations?: PhotoAnnotation[]
  thumbnail?: string
}

interface TaskIssueReport {
  issueType?: "damage" | "malfunction" | "maintenance" | "missing-item" | "cleaning"
  location?: string
  itemAffected?: string
  priority?: "urgent" | "high" | "medium" | "low"
}

interface TaskCardProps {
  task: TaskTemplate
  completed: boolean
  photos: Photo[]
  notes: string
  canComplete: boolean // Whether dependencies are met
  reportIssue?: boolean
  issueReport?: TaskIssueReport
  isExpanded?: boolean // Control expansion from parent
  homeId?: string // For property hierarchy lookup
  homeCode?: string // For breadcrumbs
  homeName?: string // For breadcrumbs
  onToggleComplete: (completed: boolean) => void
  onAddPhoto: (file: File, thumbnail?: string) => void
  onNotesChange: (notes: string) => void
  onToggleReportIssue?: (reportIssue: boolean) => void
  onIssueReportChange?: (issueReport: TaskIssueReport) => void
  onAnnotatePhoto?: (photoId: string, annotations: PhotoAnnotation[]) => void
  onRetryUpload?: (photoId: string) => void
  onExpandedChange?: (expanded: boolean) => void
}

export function TaskCard({
  task,
  completed,
  photos = [],
  notes,
  canComplete,
  reportIssue = false,
  issueReport = {},
  isExpanded: controlledIsExpanded,
  homeId,
  homeCode,
  homeName,
  onToggleComplete,
  onAddPhoto,
  onNotesChange,
  onToggleReportIssue,
  onIssueReportChange,
  onAnnotatePhoto,
  onRetryUpload,
  onExpandedChange
}: TaskCardProps) {
  const { trigger } = useHapticFeedback()
  const [annotatingPhotoId, setAnnotatingPhotoId] = useState<string | null>(null)
  const [internalIsExpanded, setInternalIsExpanded] = useState(!completed)
  const [cameraAnimating, setCameraAnimating] = useState(false)
  const photoUploaderRef = useRef<PhotoUploaderHandle>(null)
  const photoCount = photos?.length || 0
  const [selectedItem, setSelectedItem] = useState<PropertyHierarchyNode | null>(null)
  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<Array<{ label: string; href?: string }>>([])
  const [itemIssue, setItemIssue] = useState<PropertyIssue | undefined>(undefined)
  const [itemSheetOpen, setItemSheetOpen] = useState(false)
  const [taskNameMatch, setTaskNameMatch] = useState<MatchResult | null>(null)

  // Check if task name matches a blueprint item
  useEffect(() => {
    if (!homeId || !task.name) {
      setTaskNameMatch(null)
      return
    }
    
    const hierarchy = getPropertyHierarchy(homeId)
    if (!hierarchy) {
      setTaskNameMatch(null)
      return
    }
    
    const match = findNodeByItemName(hierarchy, task.name)
    setTaskNameMatch(match)
  }, [homeId, task.name])

  // Handle location click to open item details
  const handleLocationClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!task.location || !homeId) {
      return
    }
    
    const hierarchy = getPropertyHierarchy(homeId)
    if (!hierarchy) {
      toast.info("Property information not available")
      return
    }
    
    const match = findNodeByLocation(hierarchy, task.location)
    if (!match) {
      toast.info(`Location "${task.location}" not found in property blueprint`)
      return
    }
    
    setSelectedItem(match.node)
    setItemBreadcrumbs(match.breadcrumbs)
    setItemIssue(undefined) // Could load issue data here if needed
    setItemSheetOpen(true)
  }

  // Handle task name click to open item details
  const handleTaskNameClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    
    if (!taskNameMatch || !homeId) {
      return
    }
    
    setSelectedItem(taskNameMatch.node)
    setItemBreadcrumbs(taskNameMatch.breadcrumbs)
    setItemIssue(undefined) // Could load issue data here if needed
    setItemSheetOpen(true)
  }

  // Check if location is clickable (has homeId and location exists)
  const isLocationClickable = homeId && task.location
  // Check if task name is clickable (has homeId and matches a blueprint item)
  const isTaskNameClickable = homeId && taskNameMatch !== null

  // Use controlled or internal state
  const isExpanded = controlledIsExpanded !== undefined ? controlledIsExpanded : internalIsExpanded

  // Auto-collapse when task is completed (only for internal state)
  useEffect(() => {
    if (completed && controlledIsExpanded === undefined) {
      setInternalIsExpanded(false)
    }
  }, [completed, controlledIsExpanded])
  const uploadedPhotos = photos?.filter(p => p.status === "uploaded").length || 0
  const queuedPhotos = photos?.filter(p => p.status === "in-queue").length || 0
  const failedPhotos = photos?.filter(p => p.status === "failed").length || 0

  const handleToggleComplete = (checked: boolean) => {
    // If trying to complete the task
    if (checked) {
      // Check if photos are required but none have been uploaded
      if (task.photoRequired && uploadedPhotos === 0) {
        trigger('warning')
        
        // Show brief toast notification
        toast.warning("Photo required to complete task", {
          duration: 2500,
        })
        
        // Animate camera button
        setCameraAnimating(true)
        
        // Auto-open camera after brief delay
        setTimeout(() => {
          photoUploaderRef.current?.triggerUpload()
          setCameraAnimating(false)
        }, 400)
        
        return
      }
      // Success haptic for task completion
      trigger('success')
    } else {
      // Light haptic for unchecking
      trigger('light')
    }
    // Otherwise proceed with completion
    onToggleComplete(checked)
  }

  const handleAnnotate = (photoId: string) => {
    setAnnotatingPhotoId(photoId)
  }

  const handleSaveAnnotations = (annotations: PhotoAnnotation[]) => {
    if (annotatingPhotoId && onAnnotatePhoto) {
      onAnnotatePhoto(annotatingPhotoId, annotations)
    }
    setAnnotatingPhotoId(null)
  }

  const annotatingPhoto = annotatingPhotoId 
    ? photos?.find(p => p.id === annotatingPhotoId)
    : null

  // Get action icon based on task action type
  const getActionIcon = (action?: TaskAction) => {
    if (!action) return null
    
    const iconMap: Record<TaskAction, React.ReactNode> = {
      "Check": <ClipboardCheck className="h-4 w-4 text-blue-500" />,
      "Bag and tag": <Package className="h-4 w-4 text-purple-500" />,
      "Seal": <Lock className="h-4 w-4 text-orange-500" />,
      "Prepare For Guest": <ShieldCheck className="h-4 w-4 text-green-500" />,
      "Connect": <Plug className="h-4 w-4 text-blue-500" />,
      "Leave out": <Pin className="h-4 w-4 text-yellow-500" />,
      "Set": <Settings className="h-4 w-4 text-gray-500" />,
      "Troubleshoot": <Search className="h-4 w-4 text-red-500" />,
      "Sweep": <Sparkles className="h-4 w-4 text-blue-400" />,
      "Quality check": <CheckCircle2 className="h-4 w-4 text-green-500" />,
      "Secure": <Lock className="h-4 w-4 text-red-500" />,
      "Turn off": <Power className="h-4 w-4 text-gray-500" />,
      "Empty": <Trash2 className="h-4 w-4 text-gray-500" />,
      "Fill out": <FileText className="h-4 w-4 text-blue-500" />,
      "Vacuum": <Wind className="h-4 w-4 text-purple-500" />,
      "Test": <ClipboardCheck className="h-4 w-4 text-blue-500" />,
      "Verify": <CheckCircle2 className="h-4 w-4 text-green-500" />,
      "Photograph": <Camera className="h-4 w-4 text-purple-500" />,
      "Show": <Eye className="h-4 w-4 text-blue-500" />,
      "Explain": <MessageSquare className="h-4 w-4 text-green-500" />,
      "Demonstrate": <PlayCircle className="h-4 w-4 text-purple-500" />,
      "Review": <ClipboardCheck className="h-4 w-4 text-blue-500" />,
      "Welcome": <Hand className="h-4 w-4 text-green-500" />,
      "Answer Questions": <MessageCircle className="h-4 w-4 text-blue-500" />,
      "Collect": <Package className="h-4 w-4 text-blue-500" />,
      "Deliver": <Truck className="h-4 w-4 text-green-500" />,
      "Clear": <Eraser className="h-4 w-4 text-blue-500" />,
      "Remove": <Minus className="h-4 w-4 text-red-500" />,
      "Unribbon": <Scissors className="h-4 w-4 text-purple-500" />,
      "Unseal": <Unlock className="h-4 w-4 text-orange-500" />,
      "Video": <Video className="h-4 w-4 text-blue-500" />,
      "Note": <StickyNote className="h-4 w-4 text-yellow-500" />
    }
    
    return iconMap[action] || null
  }

  const getPhotoStatusBadge = (status: Photo["status"]) => {
    switch (status) {
      case "uploaded":
        return (
          <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs">
            Uploaded
          </Badge>
        )
      case "in-queue":
        return (
          <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 text-xs">
            In Queue
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 text-xs">
            Failed
          </Badge>
        )
    }
  }

  return (
    <Card className={`transition-colors ${completed ? "bg-white dark:bg-neutral-950/30 border-green-200 dark:border-green-800" : ""}`}>
      <CardContent className="px-3 pt-3 pb-3">
        <div className="space-y-4">
          {/* Task Header - Always visible */}
          <div className="flex items-start gap-2">
            <Checkbox
              id={`task-${task.id}`}
              checked={completed}
              onCheckedChange={(checked) => handleToggleComplete(checked === true)}
              disabled={!canComplete}
              className="h-6 w-6"
            />
            <div className="flex-1 min-w-0 flex items-start gap-2">
              <label 
                htmlFor={`task-${task.id}`}
                className={`font-medium text-base cursor-pointer flex-1 ${completed ? "text-muted-foreground" : ""}`}
              >
                {task.name}
              </label>
              {/* Photo indicator in collapsed state */}
              {photoCount > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                  <Camera className="h-4 w-4" />
                  <span className="text-xs">{photoCount}</span>
                </div>
              )}
            </div>
            {/* Expand/Collapse toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6"
              onClick={() => {
                const newExpanded = !isExpanded
                if (controlledIsExpanded === undefined) {
                  setInternalIsExpanded(newExpanded)
                }
                onExpandedChange?.(newExpanded)
              }}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Expandable Content */}
          {isExpanded && (
            <>
              {/* Task Details */}
              <div className="pl-8">
                <p className="text-sm text-muted-foreground mb-2">
                  {task.description}
                </p>
                <div className="flex items-center justify-start gap-3 text-xs text-muted-foreground flex-wrap">
                  {task.action && (
                    <Badge variant="outline" className="text-xs">
                      {task.action}
                    </Badge>
                  )}
                  {isTaskNameClickable && taskNameMatch && (
                    <button
                      onClick={handleTaskNameClick}
                      className="text-xs text-primary hover:text-primary/80 underline transition-colors flex items-center gap-1"
                    >
                      <Package className="h-3 w-3" />
                      {taskNameMatch.node.label}
                    </button>
                  )}
                  {task.location && (
                    isLocationClickable ? (
                      <button
                        onClick={handleLocationClick}
                        className="text-xs text-primary hover:text-primary/80 underline transition-colors flex items-center gap-1"
                      >
                        <Pin className="h-3 w-3" />
                        {task.location}
                      </button>
                    ) : (
                      <span className="text-xs">
                        <Pin className="h-3 w-3 inline mr-1" />
                        {task.location}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Photo Section */}
              {task.photoRequired && (
                <div className="space-y-2 pl-8">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-blue-700">
                      Photos ({photoCount})
                    </span>
                  </div>

                  {/* Photo Gallery */}
                  {photos && photos.length > 0 && (
                    <PhotoGallery
                      photos={photos}
                      onAnnotate={onAnnotatePhoto ? handleAnnotate : undefined}
                      onRetryUpload={onRetryUpload}
                    />
                  )}

                  {/* Add Photo Button */}
                  <div className={cn(cameraAnimating && "animate-bounce")}>
                    <PhotoUploader
                      ref={photoUploaderRef}
                      onPhotoSelect={onAddPhoto}
                      multiple={true}
                      currentCount={photoCount}
                    >
                      <Button 
                        variant="outline" 
                        className={cn(
                          "w-full gap-2",
                          cameraAnimating && "ring-2 ring-orange-500 ring-offset-2"
                        )}
                      >
                        <Camera className={cn("h-4 w-4", cameraAnimating && "animate-pulse")} />
                        {task.photoRequired ? "Add Photo (Required)" : "Add Photo"}
                      </Button>
                    </PhotoUploader>
                  </div>

                  {/* Photo Status Summary */}
                  {photos && photos.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {uploadedPhotos > 0 && (
                        <span className="text-green-600">{uploadedPhotos} uploaded</span>
                      )}
                      {queuedPhotos > 0 && (
                        <span className="text-yellow-600">{queuedPhotos} in queue</span>
                      )}
                      {failedPhotos > 0 && (
                        <span className="text-red-600">{failedPhotos} failed</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Notes Section */}
              <div className="space-y-1 pl-8">
                <label htmlFor={`notes-${task.id}`} className="text-xs font-medium">
                  Notes (Optional)
                </label>
                <Textarea
                  id={`notes-${task.id}`}
                  placeholder="Add notes about this task if needed..."
                  value={notes}
                  onChange={(e) => onNotesChange(e.target.value)}
                  rows={2}
                  className="text-xs"
                />
                
                {/* Report Issue Toggle - Always visible */}
                {onToggleReportIssue && (
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md border">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <Label htmlFor={`report-issue-${task.id}`} className="text-sm font-medium cursor-pointer">
                        Issue Report
                      </Label>
                    </div>
                    <Switch
                      id={`report-issue-${task.id}`}
                      checked={reportIssue}
                      onCheckedChange={onToggleReportIssue}
                    />
                  </div>
                )}
              </div>

              {/* Issue Report Fields - Show when toggle is active */}
              {reportIssue && onIssueReportChange && (
                <div className="space-y-3 p-3 ml-8 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <Label className="text-sm font-semibold">Issue Report Details</Label>
                  </div>

                  {/* Issue Type */}
                  <div className="space-y-1.5">
                    <Label htmlFor={`issue-type-${task.id}`} className="text-xs">Issue Type</Label>
                    <Select
                      value={issueReport.issueType || ""}
                      onValueChange={(value) => onIssueReportChange({
                        ...issueReport,
                        issueType: value as TaskIssueReport["issueType"]
                      })}
                    >
                      <SelectTrigger id={`issue-type-${task.id}`} className="h-8 text-sm">
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="damage">Damage</SelectItem>
                        <SelectItem value="malfunction">Malfunction</SelectItem>
                        <SelectItem value="maintenance">Maintenance Needed</SelectItem>
                        <SelectItem value="missing-item">Missing Item</SelectItem>
                        <SelectItem value="cleaning">Cleaning Issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <Label htmlFor={`issue-location-${task.id}`} className="text-xs">Location</Label>
                    <Select
                      value={issueReport.location || ""}
                      onValueChange={(value) => onIssueReportChange({
                        ...issueReport,
                        location: value
                      })}
                    >
                      <SelectTrigger id={`issue-location-${task.id}`} className="h-8 text-sm">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kitchen">Kitchen</SelectItem>
                        <SelectItem value="Living Room">Living Room</SelectItem>
                        <SelectItem value="Bedroom">Bedroom</SelectItem>
                        <SelectItem value="Bathroom">Bathroom</SelectItem>
                        <SelectItem value="Hallway">Hallway</SelectItem>
                        <SelectItem value="Exterior">Exterior</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Item Affected */}
                  <div className="space-y-1.5">
                    <Label htmlFor={`item-affected-${task.id}`} className="text-xs">Item/Area Affected</Label>
                    <Input
                      id={`item-affected-${task.id}`}
                      placeholder="e.g., Dishwasher, Window"
                      value={issueReport.itemAffected || ""}
                      onChange={(e) => onIssueReportChange({
                        ...issueReport,
                        itemAffected: e.target.value
                      })}
                      className="h-8 text-sm"
                    />
                  </div>

                  {/* Priority */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Priority</Label>
                    <RadioGroup
                      value={issueReport.priority || "medium"}
                      onValueChange={(value) => onIssueReportChange({
                        ...issueReport,
                        priority: value as TaskIssueReport["priority"]
                      })}
                    >
                      <div className="flex items-start space-x-2 py-0.5">
                        <RadioGroupItem value="urgent" id={`priority-urgent-${task.id}`} className="mt-0.5" />
                        <Label htmlFor={`priority-urgent-${task.id}`} className="text-xs font-normal cursor-pointer flex flex-col">
                          <span className="font-medium">Urgent</span>
                          <span className="text-muted-foreground">Safety hazard</span>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2 py-0.5">
                        <RadioGroupItem value="high" id={`priority-high-${task.id}`} className="mt-0.5" />
                        <Label htmlFor={`priority-high-${task.id}`} className="text-xs font-normal cursor-pointer flex flex-col">
                          <span className="font-medium">High</span>
                          <span className="text-muted-foreground">Affects guest stay</span>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2 py-0.5">
                        <RadioGroupItem value="medium" id={`priority-medium-${task.id}`} className="mt-0.5" />
                        <Label htmlFor={`priority-medium-${task.id}`} className="text-xs font-normal cursor-pointer flex flex-col">
                          <span className="font-medium">Medium</span>
                          <span className="text-muted-foreground">Should be addressed</span>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2 py-0.5">
                        <RadioGroupItem value="low" id={`priority-low-${task.id}`} className="mt-0.5" />
                        <Label htmlFor={`priority-low-${task.id}`} className="text-xs font-normal cursor-pointer flex flex-col">
                          <span className="font-medium">Low</span>
                          <span className="text-muted-foreground">Minor issue</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Warning if dependencies not met */}
              {!canComplete && !completed && (
                <div className="p-2 ml-8 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-700 mt-0.5" />
                    <p className="text-xs text-yellow-800">
                      Complete previous tasks first
                    </p>
                  </div>
                </div>
              )}

              {/* Completion Indicator */}
              {completed && (
                <div className="flex items-center gap-2 text-sm text-green-700 pl-8">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Task completed</span>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>

      {/* Photo Annotation Dialog */}
      {annotatingPhoto && (
        <PhotoAnnotationDialog
          photoUrl={annotatingPhoto.localPath}
          annotations={annotatingPhoto.annotations || []}
          onSave={handleSaveAnnotations}
          onClose={() => setAnnotatingPhotoId(null)}
          open={annotatingPhotoId !== null}
        />
      )}

      {/* Item Details Sheet */}
      {selectedItem && (
        <ItemDetailsSheet
          item={selectedItem}
          breadcrumbs={itemBreadcrumbs}
          issue={itemIssue}
          onClose={() => {
            setSelectedItem(null)
            setItemBreadcrumbs([])
            setItemIssue(undefined)
            setItemSheetOpen(false)
          }}
          onReportIssue={() => {
            // Could open issue report sheet here if needed
            toast.info("Issue reporting from task location coming soon")
          }}
        />
      )}
    </Card>
  )
}

