"use client"

import { useMemo } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Lock, LogIn, Home, LogOut } from "lucide-react"
import type { PhaseTemplate, TaskTemplate } from "@/lib/activity-templates"
import { RoomChecklist } from "./RoomChecklist"
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

interface PhaseSectionProps {
  phase: PhaseTemplate
  taskStates: Record<string, TaskState>
  locked?: boolean
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
  onTaskDeletePhoto?: (taskId: string, photoId: string) => void
  onExpandedChange?: (taskId: string | null) => void
  currentSeason?: "summer" | "winter"
  currentOccupancy?: "booking" | "empty" | "host"
  className?: string
}

export function PhaseSection({
  phase,
  taskStates,
  locked = false,
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
  onTaskDeletePhoto,
  onExpandedChange,
  currentSeason,
  currentOccupancy,
  className
}: PhaseSectionProps) {
  const phaseConfig = {
    arrive: { icon: LogIn, color: "text-primary", bgColor: "bg-white dark:bg-neutral-900" },
    during: { icon: Home, color: "text-primary", bgColor: "bg-white dark:bg-neutral-900" },
    depart: { icon: LogOut, color: "text-primary", bgColor: "bg-white dark:bg-neutral-900" }
  }

  const config = phaseConfig[phase.name]
  const PhaseIcon = config.icon

  // Calculate all tasks in this phase (including room tasks)
  const allTasks = useMemo(() => {
    const tasks: TaskTemplate[] = []
    
    if (phase.tasks) {
      tasks.push(...phase.tasks)
    }
    
    if (phase.rooms) {
      phase.rooms.forEach(room => {
        tasks.push(...room.tasks)
      })
    }
    
    return tasks
  }, [phase])

  // Filter tasks based on conditional rules
  const filteredTasks = useMemo(() => {
    return allTasks.filter(task => {
      if (!task.conditional) return true
      
      if (task.conditional.season && currentSeason) {
        if (task.conditional.season !== currentSeason) return false
      }
      
      if (task.conditional.occupancy && currentOccupancy) {
        if (task.conditional.occupancy !== currentOccupancy) return false
      }
      
      return true
    })
  }, [allTasks, currentSeason, currentOccupancy])

  // Calculate completion progress
  const { completedCount, totalCount, progressPercent } = useMemo(() => {
    const total = filteredTasks.length
    const completed = filteredTasks.filter(task => taskStates[task.id]?.completed).length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return {
      completedCount: completed,
      totalCount: total,
      progressPercent: percent
    }
  }, [filteredTasks, taskStates])

  return (
    <div className={cn("relative", className)}>
      <Accordion type="single" collapsible defaultValue={locked ? undefined : phase.id}>
        <AccordionItem value={phase.id} className={cn(
          "border rounded-lg overflow-hidden",
          locked && "opacity-60"
        )}>
          <AccordionTrigger 
            className={cn(
              "px-4 py-3 hover:no-underline",
              config.bgColor
            )}
            disabled={locked}
          >
            <div className="flex items-center gap-3 flex-1 text-left">
              <div className={cn("flex items-center justify-center", locked && "opacity-50")}>
                {locked ? (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <PhaseIcon className={cn("h-5 w-5", config.color)} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-semibold capitalize">
                    {phase.name}
                  </h3>
                  <Badge 
                    variant={progressPercent === 100 ? "default" : "secondary"}
                    className="whitespace-nowrap"
                  >
                    {completedCount}/{totalCount}
                  </Badge>
                </div>
                <div className="mt-2">
                  <Progress value={progressPercent} className="h-2" />
                </div>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-4 py-4">
            {locked ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Complete the previous phase to unlock this section
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Render rooms if present (DURING phase) */}
                {phase.rooms && phase.rooms.length > 0 && (
                  <div className="space-y-4">
                    {phase.rooms.map(room => {
                      // Filter room tasks based on conditionals
                      const filteredRoomTasks = room.tasks.filter(task => {
                        if (!task.conditional) return true
                        
                        if (task.conditional.season && currentSeason) {
                          if (task.conditional.season !== currentSeason) return false
                        }
                        
                        if (task.conditional.occupancy && currentOccupancy) {
                          if (task.conditional.occupancy !== currentOccupancy) return false
                        }
                        
                        return true
                      })

                      return (
                        <RoomChecklist
                          key={room.id}
                          room={{ ...room, tasks: filteredRoomTasks }}
                          taskStates={taskStates}
                          expandedTaskId={expandedTaskId}
                          homeId={homeId}
                          homeCode={homeCode}
                          homeName={homeName}
                          onTaskToggle={onTaskToggle}
                          onTaskPhotoAdd={onTaskPhotoAdd}
                          onTaskNotesChange={onTaskNotesChange}
                          onTaskReportIssueToggle={onTaskReportIssueToggle}
                          onTaskIssueReportChange={onTaskIssueReportChange}
                          onTaskAnnotatePhoto={onTaskAnnotatePhoto}
                          onTaskRetryUpload={onTaskRetryUpload}
                          onTaskDeletePhoto={onTaskDeletePhoto}
                          onExpandedChange={onExpandedChange}
                        />
                      )
                    })}
                  </div>
                )}

                {/* Render direct tasks if present (ARRIVE/DEPART phases) */}
                {phase.tasks && phase.tasks.length > 0 && (
                  <div className="space-y-3">
                    {phase.tasks
                      .filter(task => {
                        if (!task.conditional) return true
                        
                        if (task.conditional.season && currentSeason) {
                          if (task.conditional.season !== currentSeason) return false
                        }
                        
                        if (task.conditional.occupancy && currentOccupancy) {
                          if (task.conditional.occupancy !== currentOccupancy) return false
                        }
                        
                        return true
                      })
                      .map(task => {
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
                            onDeletePhoto={onTaskDeletePhoto ? (photoId) => onTaskDeletePhoto(task.id, photoId) : undefined}
                            onExpandedChange={(expanded) => onExpandedChange?.(expanded ? task.id : null)}
                          />
                        )
                      })}
                  </div>
                )}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

