"use client"

import Link from "next/link"
import { testActivities } from "@/lib/test-data"
import { Clock, CheckCircle2, AlertCircle, PlayCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Activity, ActivityStatus } from "./MyActivities"

interface ActivityStatusOverviewProps {
  activities?: Activity[]
  isLoading?: boolean
}

export function ActivityStatusOverview({ 
  activities = [], 
  isLoading = false 
}: ActivityStatusOverviewProps) {
  // Use provided activities or fall back to test data
  const displayActivities: Activity[] = activities.length > 0 ? activities : testActivities

  const statusCounts = {
    pending: displayActivities.filter(a => a.status === "pending").length,
    "in-progress": displayActivities.filter(a => a.status === "in-progress").length,
    completed: displayActivities.filter(a => a.status === "completed").length,
    overdue: displayActivities.filter(a => a.status === "overdue").length,
    incomplete: displayActivities.filter(a => a.status === "incomplete").length,
  }

  const statusConfig = {
    pending: {
      label: "Pending",
      icon: Clock,
      color: "bg-yellow-500 dark:bg-yellow-600",
      variant: "secondary" as const
    },
    "in-progress": {
      label: "In Progress",
      icon: PlayCircle,
      color: "bg-blue-500 dark:bg-blue-600",
      variant: "default" as const
    },
    completed: {
      label: "Completed Today",
      icon: CheckCircle2,
      color: "bg-green-500 dark:bg-green-600",
      variant: "outline" as const
    },
    overdue: {
      label: "Overdue",
      icon: AlertCircle,
      color: "bg-destructive",
      variant: "destructive" as const
    },
    incomplete: {
      label: "Incomplete",
      icon: AlertCircle,
      color: "bg-orange-500 dark:bg-orange-600",
      variant: "default" as const
    },
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg">Activity Status Overview</CardTitle>
          <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm">
            <Link href="/activities">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {Object.entries(statusCounts).map(([status, count]) => {
            const config = statusConfig[status as ActivityStatus]
            const Icon = config.icon

            return (
              <Link 
                key={status} 
                href={`/activities?status=${status}`}
                className="block"
              >
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                      <div className={`p-2 sm:p-3 rounded-lg ${config.color} text-background`}>
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="text-center">
                        <p className="text-xl sm:text-2xl font-bold">{count}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">{config.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

