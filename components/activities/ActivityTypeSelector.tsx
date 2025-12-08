"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2 } from "lucide-react"
import { ActivityType, getActivityTemplate } from "@/lib/activity-templates"

interface ActivityTypeSelectorProps {
  homeCode: string
  homeName?: string
  onSelect: (type: ActivityType) => void
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
  onSelect, 
  onCancel 
}: ActivityTypeSelectorProps) {
  // Show only the main activity types that have templates
  const activityTypes: ActivityType[] = [
    "provisioning",
    "deprovisioning",
    "turn",
    "maid-service",
    "meet-greet",
    "adhoc"
  ]

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
          const taskCount = template.tasks.length
          const requiredTasks = template.tasks.filter(t => t.required).length

          return (
            <Card 
              key={type}
              className="hover:bg-muted/50 transition-colors cursor-pointer overflow-hidden border-l-[6px]"
              style={{ borderLeftColor: activityColors[type] }}
              onClick={() => onSelect(type)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Title and Description */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {template.description}
                    </p>
                  </div>

                  {/* Right: Task count and time */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{taskCount} tasks</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>~{template.estimatedTotalTime} min</span>
                    </div>
                    {requiredTasks < taskCount && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {requiredTasks} required
                      </Badge>
                    )}
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

