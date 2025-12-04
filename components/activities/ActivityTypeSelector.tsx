"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Wrench, 
  LogOut, 
  Handshake, 
  Sparkles, 
  Package, 
  RefreshCw,
  Clock,
  CheckCircle2
} from "lucide-react"
import { ActivityType, getActivityTemplate } from "@/lib/activity-templates"

interface ActivityTypeSelectorProps {
  homeCode: string
  homeName?: string
  onSelect: (type: ActivityType) => void
  onCancel?: () => void
}

const activityIcons: Record<string, typeof Wrench> = {
  "adhoc": Wrench,
  "deprovisioning": LogOut,
  "meet-greet": Handshake,
  "maid-service": Sparkles,
  "provisioning": Package,
  "turn": RefreshCw,
  "quality-check": CheckCircle2,
  "mini-maid": Sparkles,
  "touch-up": Sparkles,
  "additional-greet": Handshake,
  "bag-drop": Package,
  "service-recovery": Wrench,
  "home-viewing": Handshake,
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

      <div className="grid gap-4 md:grid-cols-2">
        {activityTypes.map((type) => {
          const template = getActivityTemplate(type)
          const Icon = activityIcons[type]
          const taskCount = template.tasks.length
          const requiredTasks = template.tasks.filter(t => t.required).length

          return (
            <Card 
              key={type}
              className="hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onSelect(type)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{taskCount} tasks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>~{template.estimatedTotalTime} min</span>
                  </div>
                </div>
                {requiredTasks < taskCount && (
                  <Badge variant="secondary" className="mt-2">
                    {requiredTasks} required
                  </Badge>
                )}
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

