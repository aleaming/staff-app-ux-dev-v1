"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
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
    issueType?: "damage" | "malfunction" | "maintenance" | "missing-item" | "cleaning"
    location?: string
    itemAffected?: string
    priority?: "urgent" | "high" | "medium" | "low"
  }
}

interface RoomChecklistProps {
  room: RoomTemplate
  phaseName?: string
  taskStates: Record<string, TaskState>
  expandedTaskId?: string | null
  homeId?: string
  homeCode?: string
  homeName?: string
  onTaskToggle: (taskId: string) => void
  onTaskPhotoAdd: (taskId: string, file: File, thumbnail?: string) => void
  onTaskNotesChange: (taskId: string, notes: string) => void
  onTaskReportIssueToggle: (taskId: string) => void
  onTaskIssueReportChange: (taskId: string, report: TaskState["issueReport"]) => void
  onTaskAnnotatePhoto: (taskId: string, photoId: string) => void
  onTaskRetryUpload: (taskId: string, photoId: string) => void
  onExpandedChange?: (taskId: string | null) => void
  className?: string
}

export function RoomChecklist({
  room,
  phaseName,
  taskStates,
  expandedTaskId,
  homeId,
  homeCode,
  homeName,
  onTaskToggle,
  onTaskPhotoAdd,
  onTaskNotesChange,
  onTaskReportIssueToggle,
  onTaskIssueReportChange,
  onTaskAnnotatePhoto,
  onTaskRetryUpload,
  onExpandedChange,
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
    <div 
      className={cn("space-y-3", className)}
      data-room-id={room.id}
      data-room-code={room.code}
      data-room-name={room.name}
      data-room-location={room.location}
      data-room-phase-name={phaseName}
    >
      {/* Room Divider Header */}
      <div className="flex items-center gap-3 py-2 border-b">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm">{room.name}</h4>
            {room.location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {room.location}
              </span>
            )}
          </div>
        </div>
        <Badge variant={progressPercent === 100 ? "default" : "secondary"} className="text-xs">
          {completedCount}/{totalCount}
        </Badge>
      </div>
      
      {/* Tasks */}
      <div className="space-y-3">
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
              isExpanded={expandedTaskId === task.id}
              homeId={homeId}
              homeCode={homeCode}
              homeName={homeName}
              onToggleComplete={() => onTaskToggle(task.id)}
              onAddPhoto={(file, thumbnail) => onTaskPhotoAdd(task.id, file, thumbnail)}
              onNotesChange={(notes) => onTaskNotesChange(task.id, notes)}
              onToggleReportIssue={() => onTaskReportIssueToggle(task.id)}
              onIssueReportChange={(report) => onTaskIssueReportChange(task.id, report)}
              onAnnotatePhoto={(photoId) => onTaskAnnotatePhoto(task.id, photoId)}
              onRetryUpload={(photoId) => onTaskRetryUpload(task.id, photoId)}
              onExpandedChange={(expanded) => onExpandedChange?.(expanded ? task.id : null)}
            />
          )
        })}
      </div>
    </div>
  )
}
