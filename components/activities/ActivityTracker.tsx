"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { TaskCard } from "./TaskCard"
import { ProgressIndicator } from "./ProgressIndicator"
import { UploadQueue } from "./UploadQueue"
import { HomeAccess } from "@/components/homes/HomeAccess"
import { HomeEssentials } from "@/components/homes/HomeEssentials"
import { HomeRules } from "@/components/homes/HomeRules"
import { HomeMedia } from "@/components/homes/HomeMedia"
import { PropertyBrowser } from "@/components/property/PropertyBrowser"
import { PropertyInfoCard } from "./PropertyInfoCard"
import { PhaseSection } from "./PhaseSection"
import { getActivityTemplate, type ActivityType, type TaskTemplate } from "@/lib/activity-templates"
import type { PhotoAnnotation } from "./PhotoAnnotation"
import { getActiveActivity, clearActiveActivity } from "@/lib/activity-utils"
import { ActivitySwitchDialog } from "./ActivitySwitchDialog"
import { downloadActivityPDF, type ActivityPDFData } from "@/lib/pdf-generator"
import { testHomes, testBookings } from "@/lib/test-data"
import { getUserEmail } from "@/lib/auth"
import { toast } from "sonner"
import {
  CheckCircle2,
  Clock,
  Save,
  ArrowLeft,
  AlertCircle,
  Home,
  Menu
} from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"

export interface Photo {
  id: string
  url?: string
  localPath: string
  status: "uploaded" | "in-queue" | "failed"
  uploadedAt?: Date
  annotations?: PhotoAnnotation[]
  thumbnail?: string
  fileName?: string
  size?: number
}

interface TaskIssueReport {
  issueType?: "damage" | "malfunction" | "maintenance" | "missing-item" | "cleaning" | "other"
  location?: string
  itemAffected?: string
  priority?: "low" | "medium" | "high"
}

interface TaskState {
  id: string
  completed: boolean
  photos: Photo[]
  notes: string
  completedAt?: Date
  reportIssue?: boolean
  issueReport?: TaskIssueReport
}

interface ActivityTrackerProps {
  activityType: ActivityType
  homeId: string
  homeCode: string
  homeName?: string
  bookingId?: string
  activityId?: string // If editing existing activity
}

export function ActivityTracker({
  activityType,
  homeId,
  homeCode,
  homeName,
  bookingId,
  activityId
}: ActivityTrackerProps) {
  // Get template, optionally loading property-specific data for provisioning
  const template = getActivityTemplate(activityType, homeCode)
  if (!template) {
    // Handle invalid activity type
    return <div className="text-center py-8">Activity type not found.</div>
  }

  const storageKey = activityId 
    ? `activity-${activityId}` 
    : `activity-tracker-draft-${homeId}-${activityType}`

  // Get all tasks from template (including phase tasks)
  const getAllTasks = (): TaskTemplate[] => {
    if (template.phases) {
      const tasks: TaskTemplate[] = []
      template.phases.forEach(phase => {
        if (phase.tasks) {
          tasks.push(...phase.tasks)
        }
        if (phase.rooms) {
          phase.rooms.forEach(room => {
            tasks.push(...room.tasks)
          })
        }
      })
      return tasks
    }
    return template.tasks
  }

  // Initialize task states from template
  const [taskStates, setTaskStates] = useState<Record<string, TaskState>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        return JSON.parse(saved)
      }
    }
    // Initialize from template (either tasks or phase-based)
    const initial: Record<string, TaskState> = {}
    const allTasks = getAllTasks()
    allTasks.forEach(task => {
      initial[task.id] = {
        id: task.id,
        completed: false,
        photos: [],
        notes: "",
        reportIssue: false,
        issueReport: {}
      }
    })
    return initial
  })

  const [activityNotes, setActivityNotes] = useState("")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [homeSheetOpen, setHomeSheetOpen] = useState(false)
  const [showSwitchDialog, setShowSwitchDialog] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  
  // Phase-based activity state
  const [currentSeason, setCurrentSeason] = useState<"summer" | "winter">(
    new Date().getMonth() >= 4 && new Date().getMonth() <= 9 ? "summer" : "winter"
  )
  const [currentOccupancy, setCurrentOccupancy] = useState<"booking" | "empty" | "host">("booking")

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check for existing active activity on mount
  useEffect(() => {
    if (!isMounted) return
    
    const activeActivity = getActiveActivity()
    
    if (activeActivity && activeActivity.storageKey !== storageKey) {
      // There's a different activity active - show dialog
      setShowSwitchDialog(true)
    }
  }, [storageKey, isMounted]) // Check when storageKey changes and after mount

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveToLocalStorage()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [taskStates, activityNotes])

  // Save on unmount and clear closed flag on mount
  useEffect(() => {
    // Clear the "closed" flag when activity is opened/resumed
    if (typeof window !== "undefined") {
      const closedKey = `activity-closed-${homeId}-${activityType}`
      localStorage.removeItem(closedKey)

      // Store activity metadata (bookingId, etc.)
      const metaKey = `activity-meta-${homeId}-${activityType}`
      const metadata = {
        bookingId: bookingId || null,
        homeCode,
        homeName
      }
      localStorage.setItem(metaKey, JSON.stringify(metadata))
    }

    return () => {
      saveToLocalStorage()
    }
  }, [homeId, activityType, bookingId, homeCode, homeName])

  const saveToLocalStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(taskStates))
      setLastSaved(new Date())
    }
  }

  const handleSaveProgress = () => {
    saveToLocalStorage()
    toast.success("Progress saved successfully!", {
      description: "Your activity progress has been saved.",
      duration: 3000,
    })
  }

  const toggleTaskComplete = (taskId: string, completed: boolean) => {
    setTaskStates(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        completed,
        completedAt: completed ? new Date() : undefined
      }
    }))
    saveToLocalStorage()
  }

  const addPhotoToTask = async (taskId: string, file: File, thumbnail?: string) => {
    const photoId = `${taskId}-${Date.now()}`

    const photo: Photo = {
      id: photoId,
      localPath: URL.createObjectURL(file),
      status: "in-queue",
      fileName: file.name,
      size: file.size,
      thumbnail
    }

    setTaskStates(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        photos: [...(prev[taskId]?.photos || []), photo]
      }
    }))
    saveToLocalStorage()

    // Simulate upload (in real app, this would be an API call)
    setTimeout(() => {
      setTaskStates(prev => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          photos: (prev[taskId]?.photos || []).map(p => 
            p.id === photoId 
              ? { ...p, status: "uploaded" as const, uploadedAt: new Date() }
              : p
          )
        }
      }))
      saveToLocalStorage()
    }, 2000)
  }

  const annotatePhoto = (taskId: string, photoId: string, annotations: PhotoAnnotation[]) => {
    setTaskStates(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        photos: (prev[taskId]?.photos || []).map(p => 
          p.id === photoId 
            ? { ...p, annotations }
            : p
        )
      }
    }))
    saveToLocalStorage()
  }

  const retryPhotoUpload = (taskId: string, photoId: string) => {
    setTaskStates(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        photos: (prev[taskId]?.photos || []).map(p => 
          p.id === photoId 
            ? { ...p, status: "in-queue" as const }
            : p
        )
      }
    }))
    saveToLocalStorage()

    // Retry upload
    setTimeout(() => {
      setTaskStates(prev => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          photos: (prev[taskId]?.photos || []).map(p => 
            p.id === photoId 
              ? { ...p, status: "uploaded" as const, uploadedAt: new Date() }
              : p
          )
        }
      }))
      saveToLocalStorage()
    }, 2000)
  }

  const updateTaskNotes = (taskId: string, notes: string) => {
    setTaskStates(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        notes
      }
    }))
    saveToLocalStorage()
  }

  const toggleReportIssue = (taskId: string, reportIssue: boolean) => {
    setTaskStates(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        reportIssue,
        issueReport: reportIssue ? (prev[taskId].issueReport || {}) : undefined
      }
    }))
    saveToLocalStorage()
  }

  const updateIssueReport = (taskId: string, issueReport: TaskIssueReport | undefined) => {
    setTaskStates(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        issueReport
      }
    }))
    saveToLocalStorage()
  }

  const canCompleteTask = (taskId: string): boolean => {
    const allTasks = getAllTasks()
    const task = allTasks.find(t => t.id === taskId)
    if (!task || !task.dependencies || task.dependencies.length === 0) {
      return true
    }
    return task.dependencies.every(depId => taskStates[depId]?.completed)
  }

  const completedTasks = Object.values(taskStates).filter(t => t.completed).length
  const allTasks = getAllTasks()
  const totalTasks = allTasks.length
  const allTasksCompleted = completedTasks === totalTasks

  const totalPhotos = Object.values(taskStates).reduce((sum, task) => sum + (task.photos?.length || 0), 0)
  const uploadedPhotos = Object.values(taskStates).reduce(
    (sum, task) => sum + (task.photos?.filter(p => p.status === "uploaded").length || 0),
    0
  )

  const requiredTasks = allTasks.filter(t => t.required)
  const completedRequiredTasks = requiredTasks.filter(t => taskStates[t.id]?.completed).length
  const allRequiredCompleted = completedRequiredTasks === requiredTasks.length

  const handleCompleteActivity = async () => {
    if (!allRequiredCompleted) {
      alert("Please complete all required tasks before completing the activity.")
      return
    }

    setIsGeneratingPDF(true)

    try {
      // Get home data
      const home = testHomes.find(h => h.id === homeId)
      
      // Get weather data
      let weatherData: ActivityPDFData["weather"] | undefined
      if (home?.coordinates) {
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${home.coordinates.lat}&longitude=${home.coordinates.lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
          )
          const data = await response.json()
          if (data.current) {
            const getWeatherCondition = (code: number): string => {
              if (code === 0) return "Clear sky"
              if (code === 1) return "Mainly clear"
              if (code === 2) return "Partly cloudy"
              if (code === 3) return "Overcast"
              if (code <= 49) return "Fog"
              if (code <= 59) return "Drizzle"
              if (code <= 69) return "Rain"
              if (code <= 79) return "Snow"
              if (code <= 99) return "Thunderstorm"
              return "Unknown"
            }
            
            weatherData = {
              temperature: Math.round(data.current.temperature_2m),
              condition: getWeatherCondition(data.current.weather_code),
              humidity: data.current.relative_humidity_2m,
              windSpeed: Math.round(data.current.wind_speed_10m)
            }
          }
        } catch (error) {
          console.error("Error fetching weather:", error)
        }
      }

      // Get staff info
      const completedBy = getUserEmail() || "Staff Member"
      const assignedTo = "Alex" // In production, get from activity data

      // Prepare task data for PDF (use allTasks to support phase-based activities)
      const allTasksList = getAllTasks()
      const tasksForPDF = allTasksList.map(task => ({
        id: task.id,
        name: task.name,
        completed: taskStates[task.id]?.completed || false,
        notes: taskStates[task.id]?.notes || undefined,
        photos: (taskStates[task.id]?.photos || []).map(photo => ({
          id: photo.id,
          fileName: photo.fileName,
          uploadedAt: photo.uploadedAt,
          annotations: photo.annotations
        }))
      }))

      // Get damages data
      const damages = home?.damages || []

      // Check for damage updates in localStorage (from DamagesSheet)
      const damageUpdatesKey = `damage-updates-${homeId}`
      let damageUpdates: ActivityPDFData["damageUpdates"] = undefined
      if (typeof window !== "undefined") {
        const savedDamageUpdates = localStorage.getItem(damageUpdatesKey)
        if (savedDamageUpdates) {
          try {
            const updates = JSON.parse(savedDamageUpdates)
            damageUpdates = updates.map((update: any) => ({
              damageId: update.damageId,
              description: update.description,
              notes: update.notes,
              photosAdded: update.photosAdded
            }))
          } catch (error) {
            console.error("Error parsing damage updates:", error)
          }
        }
      }

      // Check for booking/activity adjustments in localStorage
      const bookingNotesKey = `booking-notes-${homeId}`
      const activityAdjustmentsKey = `activity-adjustments-${homeId}`
      let bookingNotes: string[] | undefined = undefined
      let activityAdjustments: string[] | undefined = undefined
      if (typeof window !== "undefined") {
        const savedBookingNotes = localStorage.getItem(bookingNotesKey)
        const savedActivityAdjustments = localStorage.getItem(activityAdjustmentsKey)
        if (savedBookingNotes) {
          try {
            bookingNotes = JSON.parse(savedBookingNotes)
          } catch (error) {
            console.error("Error parsing booking notes:", error)
          }
        }
        if (savedActivityAdjustments) {
          try {
            activityAdjustments = JSON.parse(savedActivityAdjustments)
          } catch (error) {
            console.error("Error parsing activity adjustments:", error)
          }
        }
      }

      // Prepare PDF data
      const pdfData: ActivityPDFData = {
        activityType,
        homeId,
        homeCode,
        homeName,
        homeAddress: home?.address,
        homeCoordinates: home?.coordinates,
        assignedTo,
        completedBy,
        tasks: tasksForPDF,
        activityNotes,
        damages: damages.filter(d => d.status !== "resolved"),
        damageUpdates,
        weather: weatherData,
        bookingNotes,
        activityAdjustments,
        completedAt: new Date(),
        completedTasks,
        totalTasks,
        totalPhotos: Object.values(taskStates).reduce((sum, task) => sum + (task.photos?.length || 0), 0)
      }

      // Generate and download PDF
      await downloadActivityPDF(pdfData)
      
      // In real app, this would save to API
      console.log("Completing activity:", {
        activityType,
        homeId,
        taskStates,
        activityNotes
      })

      // Clear draft
      if (typeof window !== "undefined") {
        localStorage.removeItem(storageKey)
      }

      // Redirect to activity detail or home page
      window.location.href = `/homes/${homeId}`
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Activity completed, but there was an error generating the PDF report.")
      
      // Still clear and redirect even if PDF fails
      if (typeof window !== "undefined") {
        localStorage.removeItem(storageKey)
      }
      window.location.href = `/homes/${homeId}`
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Get booking data if bookingId is provided
  const booking = bookingId ? testBookings.find(b => b.bookingId === bookingId) : null

  // Build breadcrumbs
  const breadcrumbs = booking
    ? [
        { label: "Bookings", href: "/bookings" },
        { label: bookingId || "Booking", href: `/bookings/${booking.id}` },
        { label: homeCode, href: `/homes/${homeId}` },
        { label: template.name }
      ]
    : [
        { label: "Homes", href: "/homes" },
        { label: homeCode, href: `/homes/${homeId}` },
        { label: template.name }
      ]

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Home Menubar */}
      <Sheet open={homeSheetOpen} onOpenChange={setHomeSheetOpen}>
        <div className="flex items-center gap-2 border rounded-lg p-2 bg-muted/50">
          <Home className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium flex-1">{homeCode} {homeName && `• ${homeName}`}</span>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Menu className="h-4 w-4" />
              View Home Info
            </Button>
          </SheetTrigger>
        </div>

        <SheetContent side="bottom" className="h-[calc(100vh-8rem)] max-h-[calc(100vh-4rem)]">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              {homeCode} {homeName && `• ${homeName}`}
            </SheetTitle>
          </SheetHeader>
          
          <Tabs defaultValue="essentials" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5 mb-4">
              <TabsTrigger value="browse">Browse</TabsTrigger>
              <TabsTrigger value="access">Access</TabsTrigger>
              <TabsTrigger value="essentials">Essentials</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="browse" className="mt-0">
                <PropertyBrowser homeId={homeId} homeCode={homeCode} homeName={homeName} />
              </TabsContent>

              <TabsContent value="access" className="mt-0">
                <HomeAccess homeCode={homeCode} />
              </TabsContent>

              <TabsContent value="essentials" className="mt-0">
                <HomeEssentials homeCode={homeCode} />
              </TabsContent>

              <TabsContent value="rules" className="mt-0">
                <HomeRules homeCode={homeCode} />
              </TabsContent>

              <TabsContent value="media" className="mt-0">
                <HomeMedia homeCode={homeCode} />
              </TabsContent>
            </div>
          </Tabs>
        </SheetContent>
      </Sheet>

      {/* Header */}
      <div className="bg-background border-b pb-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold">{template.name}</h1>
              <p className="text-sm text-muted-foreground">
                {homeCode} {homeName && `• ${homeName}`}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            In Progress
          </Badge>
        </div>

        <ProgressIndicator
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          completedPhotos={uploadedPhotos}
          totalPhotos={totalPhotos}
        />

        {lastSaved && (
          <p className="text-xs text-muted-foreground mt-2">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Upload Queue */}
      {(() => {
        const allPhotos = Object.values(taskStates).flatMap(t => t.photos || [])
        const queuedPhotos = allPhotos
          .filter(p => p && (p.status === "in-queue" || p.status === "failed"))
          .map(p => ({
            id: p.id,
            taskId: Object.keys(taskStates).find(tid => 
              taskStates[tid]?.photos?.some(ph => ph.id === p.id)
            ) || "",
            taskName: getAllTasks().find(t => 
              taskStates[t.id]?.photos?.some(ph => ph.id === p.id)
            )?.name || "Unknown",
            fileName: p.fileName || "photo.jpg",
            size: p.size || 0,
            status: p.status === "failed" ? "failed" as const : 
                   p.status === "uploaded" ? "uploaded" as const :
                   "pending" as const
          }))

        if (queuedPhotos.length === 0) return null

        return (
          <UploadQueue
            queue={queuedPhotos}
            onRetry={(photoId) => {
              // Find and retry the photo
              Object.keys(taskStates).forEach(tid => {
                const photo = taskStates[tid].photos.find(p => p.id === photoId)
                if (photo) {
                  retryPhotoUpload(tid, photoId)
                }
              })
            }}
            onCancel={(photoId) => {
              // Remove photo from task
              setTaskStates(prev => {
                const newStates = { ...prev }
                Object.keys(newStates).forEach(tid => {
                  newStates[tid] = {
                    ...newStates[tid],
                    photos: (newStates[tid]?.photos || []).filter(p => p.id !== photoId)
                  }
                })
                return newStates
              })
              saveToLocalStorage()
            }}
            onClearCompleted={() => {
              // This would clear completed uploads from queue
            }}
          />
        )
      })()}

      {/* Property Metadata Card (for phase-based activities) */}
      {template.metadata && (
        <PropertyInfoCard 
          metadata={template.metadata} 
          defaultOpen={false}
          className="mb-6"
        />
      )}

      {/* Tasks List - Phase-based or Regular */}
      {template.phases ? (
        // Phase-based rendering (Provisioning with phases)
        <div className="space-y-6 md:space-y-4">
          {template.phases
            .sort((a, b) => a.order - b.order)
            .map((phase, index) => {
              // Check if previous phase is completed (for locking)
              const previousPhase = index > 0 ? template.phases![index - 1] : null
              const previousPhaseTasks = previousPhase 
                ? (previousPhase.tasks || []).concat(
                    ...(previousPhase.rooms?.map(r => r.tasks) || [])
                  )
                : []
              const previousPhaseCompleted = previousPhaseTasks.length === 0 || 
                previousPhaseTasks.every(t => taskStates[t.id]?.completed)
              
              return (
                <PhaseSection
                  key={phase.id}
                  phase={phase}
                  taskStates={taskStates}
                  locked={!previousPhaseCompleted}
                  onTaskToggle={(taskId) => toggleTaskComplete(taskId, !taskStates[taskId]?.completed)}
                  onTaskPhotoAdd={(taskId, file, thumbnail) => addPhotoToTask(taskId, file, thumbnail)}
                  onTaskNotesChange={(taskId, notes) => updateTaskNotes(taskId, notes)}
                  onTaskReportIssueToggle={(taskId) => toggleReportIssue(taskId, !taskStates[taskId]?.reportIssue)}
                  onTaskIssueReportChange={(taskId, report) => updateIssueReport(taskId, report)}
                  onTaskAnnotatePhoto={(taskId, photoId) => {
                    // This needs the full annotations array
                    const photo = taskStates[taskId]?.photos.find(p => p.id === photoId)
                    if (photo && photo.annotations) {
                      annotatePhoto(taskId, photoId, photo.annotations)
                    }
                  }}
                  onTaskRetryUpload={(taskId, photoId) => retryPhotoUpload(taskId, photoId)}
                  currentSeason={currentSeason}
                  currentOccupancy={currentOccupancy}
                />
              )
            })}
        </div>
      ) : (
        // Regular task-based rendering (all other activity types)
        <div className="space-y-6 md:space-y-4">
          {template.tasks
            .sort((a, b) => a.order - b.order)
            .map((task) => {
              const taskState = taskStates[task.id]
              const canComplete = canCompleteTask(task.id)

              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  completed={taskState?.completed || false}
                  photos={taskState?.photos || []}
                  notes={taskState?.notes || ""}
                  canComplete={canComplete}
                  reportIssue={taskState?.reportIssue || false}
                  issueReport={taskState?.issueReport || {}}
                  onToggleComplete={(completed) => toggleTaskComplete(task.id, completed)}
                  onAddPhoto={(file, thumbnail) => addPhotoToTask(task.id, file, thumbnail)}
                  onNotesChange={(notes) => updateTaskNotes(task.id, notes)}
                  onToggleReportIssue={(reportIssue) => toggleReportIssue(task.id, reportIssue)}
                  onIssueReportChange={(issueReport) => updateIssueReport(task.id, issueReport)}
                  onAnnotatePhoto={(photoId, annotations) => annotatePhoto(task.id, photoId, annotations)}
                  onRetryUpload={(photoId) => retryPhotoUpload(task.id, photoId)}
                />
              )
            })}
        </div>
      )}

      {/* Activity Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add any general notes about this activity..."
            value={activityNotes}
            onChange={(e) => {
              setActivityNotes(e.target.value)
              saveToLocalStorage()
            }}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 sm:gap-4 pb-6">
        <Button
          variant="outline"
          onClick={handleSaveProgress}
          className="flex-1"
        >
          <Save className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Save Progress</span>
          <span className="sm:hidden">Save</span>
        </Button>
        <Button
          onClick={handleCompleteActivity}
          disabled={!allRequiredCompleted || isGeneratingPDF}
          className="flex-1"
        >
          {isGeneratingPDF ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              <span className="hidden sm:inline">Generating PDF...</span>
              <span className="sm:hidden">PDF...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Complete Activity</span>
              <span className="sm:hidden">Complete</span>
            </>
          )}
        </Button>
      </div>

      {/* Completion Warning */}
      {!allRequiredCompleted && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-700 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 mb-1">
                  Complete all required tasks
                </p>
                <p className="text-sm text-yellow-800">
                  {requiredTasks.length - completedRequiredTasks} required task(s) remaining
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Switch Dialog */}
      {isMounted && showSwitchDialog && (() => {
        const activeActivity = getActiveActivity()
        if (!activeActivity || activeActivity.storageKey === storageKey) {
          return null
        }
        
        return (
          <ActivitySwitchDialog
            open={showSwitchDialog}
            currentActivity={activeActivity}
            newActivityType={activityType}
            newHomeCode={homeCode}
            newHomeName={homeName}
            onSaveAndSwitch={() => {
              clearActiveActivity(activeActivity.storageKey)
              setShowSwitchDialog(false)
            }}
            onDiscardAndSwitch={() => {
              clearActiveActivity(activeActivity.storageKey)
              setShowSwitchDialog(false)
            }}
            onCancel={() => {
              setShowSwitchDialog(false)
              // Navigate back to home page
              window.location.href = `/homes/${homeId}`
            }}
          />
        )
      })()}
    </div>
  )
}

