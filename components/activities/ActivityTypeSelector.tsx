"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ActivityType, getActivityTemplate } from "@/lib/activity-templates"
import { Play, Eye } from "lucide-react"

interface AssignedActivity {
  id: string
  type: ActivityType
}

interface ActivityTypeSelectorProps {
  homeCode: string
  homeName?: string
  assignedActivities?: AssignedActivity[]
  onSelect: (type: ActivityType) => void
  onView?: (type: ActivityType, activityId: string) => void
  onCancel?: () => void
}

// Activity colors matching CSS variables from globals.css
const activityColors: Record<ActivityType, string> = {
  "provisioning": "var(--activity-provisioning)",
  "deprovisioning": "var(--activity-deprovision)",
  "turn": "var(--activity-turn)",
  "maid-service": "var(--activity-maid)",
  "meet-greet": "var(--activity-greet)",
  "adhoc": "var(--activity-adhoc)",
  "quality-check": "var(--activity-quality-check)",
  "mini-maid": "var(--activity-mini-maid)",
  "touch-up": "var(--activity-touch-up)",
  "additional-greet": "var(--activity-additional-greet)",
  "bag-drop": "var(--activity-bag-drop)",
  "service-recovery": "var(--activity-service-recovery)",
  "home-viewing": "var(--activity-viewing)",
}

export function ActivityTypeSelector({ 
  homeCode, 
  homeName, 
  assignedActivities = [],
  onSelect,
  onView,
  onCancel 
}: ActivityTypeSelectorProps) {
  // Show only the main activity types that have templates
  const activityTypes: ActivityType[] = [
    "adhoc",
    "provisioning",
    "deprovisioning",
    "turn",
    "maid-service",
    "meet-greet"
  ]

  // Check if an activity type is assigned to this home
  const getAssignedActivity = (type: ActivityType) => {
    return assignedActivities.find(a => a.type === type)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Start Activity</h2>
        <p className="text-muted-foreground">
          {homeCode} {homeName && `• ${homeName}`}
        </p>
      </div>

      <div className="grid gap-3">
        {activityTypes.map((type) => {
          const template = getActivityTemplate(type)
          const isAdhoc = type === "adhoc"
          const assignedActivity = getAssignedActivity(type)
          const hasAssignedActivity = !!assignedActivity

          // For non-adhoc activities without assignments, show disabled state
          const isClickable = isAdhoc || hasAssignedActivity

          return (
            <Card 
              key={type}
              className={`overflow-hidden border-l-[6px] transition-colors ${
                isClickable 
                  ? "hover:bg-muted/50 cursor-pointer" 
                  : "opacity-50 cursor-not-allowed"
              }`}
              style={{ borderLeftColor: activityColors[type] }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {template.description}
                    </p>
                  </div>
                  
                  {/* Action button */}
                  <div className="flex-shrink-0">
                    {isAdhoc ? (
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelect(type)
                        }}
                        className="gap-1.5"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Start
                      </Button>
                    ) : hasAssignedActivity ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (onView && assignedActivity) {
                            onView(type, assignedActivity.id)
                          } else {
                            onSelect(type)
                          }
                        }}
                        className="gap-1.5"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {onCancel && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}

