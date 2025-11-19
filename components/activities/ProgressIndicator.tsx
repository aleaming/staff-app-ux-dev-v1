"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Camera } from "lucide-react"

interface ProgressIndicatorProps {
  completedTasks: number
  totalTasks: number
  completedPhotos: number
  totalPhotos: number
  estimatedTimeRemaining?: number
}

export function ProgressIndicator({
  completedTasks,
  totalTasks,
  completedPhotos,
  totalPhotos,
  estimatedTimeRemaining
}: ProgressIndicatorProps) {
  const taskProgress = (completedTasks / totalTasks) * 100
  const photoProgress = totalPhotos > 0 ? (completedPhotos / totalPhotos) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Task Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Tasks: {completedTasks} of {totalTasks}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {Math.round(taskProgress)}%
          </span>
        </div>
        <Progress value={taskProgress} className="h-2" />
      </div>

      {/* Photo Progress */}
      {totalPhotos > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Photos: {completedPhotos} of {totalPhotos}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {Math.round(photoProgress)}%
            </span>
          </div>
          <Progress value={photoProgress} className="h-2" />
        </div>
      )}

      {/* Time Estimate */}
      {estimatedTimeRemaining !== undefined && estimatedTimeRemaining > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>~{estimatedTimeRemaining} min remaining</span>
        </div>
      )}

      {/* Completion Badge */}
      {completedTasks === totalTasks && (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          All tasks completed
        </Badge>
      )}
    </div>
  )
}

