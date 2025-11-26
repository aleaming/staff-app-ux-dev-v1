"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin } from "lucide-react"
import type { RoomTemplate, TaskTemplate } from "@/lib/activity-templates"
import { TaskCard } from "./TaskCard"
import type { Photo } from "./ActivityTracker"
import { cn } from "@/lib/utils"

interface TaskState {
  id: string
  completed: boolean
  photos: Photo[]
  notes: string
  completedAt?: Date
  reportIssue?: boolean
  issueReport?: {
    issueType?: "damage" | "malfunction" | "maintenance" | "missing-item" | "cleaning" | "other"
    location?: string
    itemAffected?: string
    priority?: "low" | "medium" | "high"
  }
}

interface RoomChecklistProps {
  room: RoomTemplate
  taskStates: Record<string, TaskState>
  onTaskToggle: (taskId: string) => void
  onTaskPhotoAdd: (taskId: string, file: File, thumbnail?: string) => void
  onTaskNotesChange: (taskId: string, notes: string) => void
  onTaskReportIssueToggle: (taskId: string) => void
  onTaskIssueReportChange: (taskId: string, report: TaskState["issueReport"]) => void
  onTaskAnnotatePhoto: (taskId: string, photoId: string) => void
  onTaskRetryUpload: (taskId: string, photoId: string) => void
  className?: string
}

export function RoomChecklist({
  room,
  taskStates,
  onTaskToggle,
  onTaskPhotoAdd,
  onTaskNotesChange,
  onTaskReportIssueToggle,
  onTaskIssueReportChange,
  onTaskAnnotatePhoto,
  onTaskRetryUpload,
  className
}: RoomChecklistProps) {
  // Calculate room progress
  const { completedCount, totalCount, progressPercent } = useMemo(() => {
    const total = room.tasks.length
    const completed = room.tasks.filter(task => taskStates[task.id]?.completed).length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return {
      completedCount: completed,
      totalCount: total,
      progressPercent: percent
    }
  }, [room.tasks, taskStates])

  return (
    <Card className={cn("border-l-4 border-l-blue-300", className)}>
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {room.code}
              </Badge>
              <h4 className="font-semibold text-base">{room.name}</h4>
            </div>
            <Badge variant={progressPercent === 100 ? "default" : "secondary"}>
              {completedCount}/{totalCount}
            </Badge>
          </div>
          
          {room.location && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{room.location}</span>
            </div>
          )}
          
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-0">
        {room.tasks.map(task => {
          const state = taskStates[task.id] || {
            id: task.id,
            completed: false,
            photos: [],
            notes: "",
            reportIssue: false
          }

          return (
            <TaskCard
              key={task.id}
              task={task}
              completed={state.completed}
              photos={state.photos || []}
              notes={state.notes || ""}
              canComplete={!task.dependencies || task.dependencies.every(depId => taskStates[depId]?.completed)}
              reportIssue={state.reportIssue}
              issueReport={state.issueReport}
              onToggleComplete={() => onTaskToggle(task.id)}
              onAddPhoto={(file, thumbnail) => onTaskPhotoAdd(task.id, file, thumbnail)}
              onNotesChange={(notes) => onTaskNotesChange(task.id, notes)}
              onToggleReportIssue={() => onTaskReportIssueToggle(task.id)}
              onIssueReportChange={(report) => onTaskIssueReportChange(task.id, report)}
              onAnnotatePhoto={(photoId) => onTaskAnnotatePhoto(task.id, photoId)}
              onRetryUpload={(photoId) => onTaskRetryUpload(task.id, photoId)}
            />
          )
        })}
      </CardContent>
    </Card>
  )
}

