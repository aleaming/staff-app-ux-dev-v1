"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Save, X, Target } from "lucide-react"
import { getActivityTemplate, type ActivityType } from "@/lib/activity-templates"
import type { ActiveActivityInfo } from "@/lib/activity-utils"

interface ActivitySwitchDialogProps {
  open: boolean
  currentActivity: ActiveActivityInfo
  newActivityType: ActivityType
  newHomeCode: string
  newHomeName?: string
  onSaveAndSwitch: () => void
  onDiscardAndSwitch: () => void
  onCancel: () => void
}

export function ActivitySwitchDialog({
  open,
  currentActivity,
  newActivityType,
  newHomeCode,
  newHomeName,
  onSaveAndSwitch,
  onDiscardAndSwitch,
  onCancel
}: ActivitySwitchDialogProps) {
  const currentTemplate = getActivityTemplate(currentActivity.activityType)
  const newTemplate = getActivityTemplate(newActivityType)

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="z-[110]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Active Activity in Progress
          </DialogTitle>
          <DialogDescription>
            You already have an activity in progress. What would you like to do?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Activity Info */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Current Activity</span>
              </div>
              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                In Progress
              </Badge>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">{currentTemplate?.name}</span>
                {" "}at {currentActivity.homeCode}
                {currentActivity.homeName && ` • ${currentActivity.homeName}`}
              </p>
              <p className="text-muted-foreground">
                Progress: {currentActivity.completedTasks} of {currentActivity.totalTasks} tasks completed
              </p>
            </div>
          </div>

          {/* New Activity Info */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="font-semibold">New Activity</span>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">{newTemplate?.name}</span>
                {" "}at {newHomeCode}
                {newHomeName && ` • ${newHomeName}`}
              </p>
            </div>
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-900 dark:text-yellow-300">
              <strong>Note:</strong> Your current activity progress will be saved automatically. 
              You can return to it later from the floating activity island.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={onDiscardAndSwitch}
            className="w-full sm:w-auto"
          >
            Discard & Switch
          </Button>
          <Button
            onClick={onSaveAndSwitch}
            className="w-full sm:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            Save & Switch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

