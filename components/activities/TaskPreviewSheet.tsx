"use client"

import { useMemo } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { List, Clock, CheckCircle2 } from "lucide-react"
import { getActivityTemplate, type ActivityType, type TaskTemplate } from "@/lib/activity-templates"

interface TaskPreviewSheetProps {
  activityType: ActivityType
  activityName: string
  children?: React.ReactNode
}

export function TaskPreviewSheet({ 
  activityType, 
  activityName,
  children 
}: TaskPreviewSheetProps) {
  // Get the activity template and extract all tasks
  const { tasks, totalTime, taskCount } = useMemo(() => {
    const template = getActivityTemplate(activityType)
    const allTasks: TaskTemplate[] = []
    
    // If the template has phases, extract tasks from each phase
    if (template.phases && template.phases.length > 0) {
      template.phases.forEach(phase => {
        // Add phase-level tasks
        if (phase.tasks) {
          allTasks.push(...phase.tasks)
        }
        // Add room-level tasks if rooms exist
        if (phase.rooms) {
          phase.rooms.forEach(room => {
            if (room.tasks) {
              allTasks.push(...room.tasks)
            }
          })
        }
      })
    } else if (template.tasks) {
      // Direct tasks array
      allTasks.push(...template.tasks)
    }
    
    // Sort by order if available
    allTasks.sort((a, b) => (a.order || 0) - (b.order || 0))
    
    // Calculate total estimated time
    const totalMinutes = allTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0)
    
    return {
      tasks: allTasks,
      totalTime: totalMinutes,
      taskCount: allTasks.length
    }
  }, [activityType])

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <List className="h-4 w-4" />
            Preview all {activityName} tasks
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[70vh] max-h-[70vh]">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <List className="h-5 w-5" />
            {activityName} Tasks
          </SheetTitle>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="secondary" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {taskCount} tasks
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              ~{formatTime(totalTime)}
            </Badge>
          </div>
        </SheetHeader>
        
        <div className="overflow-y-auto h-[calc(70vh-120px)] mt-4 pr-2">
          {tasks.length > 0 ? (
            <ol className="space-y-3">
              {tasks.map((task, index) => (
                <li 
                  key={task.id} 
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{task.name}</p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <List className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tasks found for this activity type</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

