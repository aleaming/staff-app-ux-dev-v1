"use client"

import { useEffect, useState } from "react"
import { testActivities, testBookings, testHomes } from "@/lib/test-data"
import { getIncompleteActivities } from "@/lib/activity-utils"
import type { Activity } from "@/lib/test-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package,
  Handshake,
  RefreshCw,
  X,
  AlertCircle,
  Clock,
  Pause
} from "lucide-react"
import Link from "next/link"

const activityTypeConfig = {
  "provisioning": { label: "Provisioning", icon: Package, color: "var(--activity-provisioning)" },
  "meet-greet": { label: "Meet & Greet", icon: Handshake, color: "var(--activity-greet)" },
  "turn": { label: "Turn", icon: RefreshCw, color: "var(--activity-turn)" },
  "deprovision": { label: "Deprovision", icon: X, color: "var(--activity-deprovision)" },
  "ad-hoc": { label: "Ad-hoc", icon: AlertCircle, color: "var(--activity-adhoc)" },
}

// Map test-data activity types to template activity types
const activityTypeToTemplateType: Record<string, string> = {
  "provisioning": "provisioning",
  "meet-greet": "meet-greet",
  "turn": "turn",
  "deprovision": "deprovisioning",
  "ad-hoc": "adhoc",
}

const statusConfig = {
  "pending": { label: "Pending", variant: "secondary" as const },
  "in-progress": { label: "In Progress", variant: "default" as const },
  "completed": { label: "Completed", variant: "outline" as const },
  "overdue": { label: "Overdue", variant: "destructive" as const },
  "incomplete": { label: "Incomplete", variant: "secondary" as const },
}

export default function ActivitiesPage() {
  const [incompleteActivities, setIncompleteActivities] = useState<Activity[]>([])

  useEffect(() => {
    const incomplete = getIncompleteActivities()
    setIncompleteActivities(incomplete)
  }, [])

  // Filter activities by category
  const startedActivities = [...incompleteActivities, ...testActivities.filter(a => a.status === "in-progress")]
  const myActivities = testActivities.filter(a => a.assignedTo === "Alex" && a.status !== "completed")
  const allActivities = testActivities

  const renderActivity = (activity: Activity) => {
    const typeConfig = activityTypeConfig[activity.type as keyof typeof activityTypeConfig]
    const statusInfo = statusConfig[activity.status as keyof typeof statusConfig]

    if (!typeConfig || !statusInfo) return null

    const TypeIcon = typeConfig.icon
    const home = testHomes.find(h => h.code === activity.homeCode)
    const booking = activity.bookingId ? testBookings.find(b => b.bookingId === activity.bookingId) : null
    const timeString = activity.scheduledTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })

    return (
      <div key={activity.id} className="pb-4 last:pb-0">
        <Card className="hover:bg-white/80 dark:hover:bg-black/50 transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="space-y-4">
              {/* Top Section: Icon, Title, and Right Side Info */}
              <div className="flex items-start justify-between gap-4 mb-3">
                {/* Left: Icon and Title */}
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  {/* Icon */}
                  <div className="p-1.5 rounded-lg text-background flex-shrink-0" style={{ backgroundColor: typeConfig.color }}>
                    <TypeIcon className="h-4 w-4" />
                  </div>

                  {/* Title and Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg">{activity.title}</h3>
                    <div className="gap-1">
                      <div className="text-sm text-muted-foreground">
                        <Link
                          href={`/homes/${home?.id || activity.homeCode}`}
                          className="underline hover:text-primary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {activity.homeCode}
                        </Link>
                      </div>
                      {activity.homeName && (
                        <div className="text-sm text-muted-foreground mb-2">
                          {activity.homeName}
                        </div>
                      )}
                      {activity.bookingId && booking && (
                        <div className="text-xs text-muted-foreground italic">
                          Booking:{" "}
                          <Link
                            href={`/bookings/${booking.id}`}
                            className="underline hover:text-primary transition-colors"
                          >
                            {activity.bookingId}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Status Badges, Time */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <Badge
                    variant={statusInfo.variant}
                    className={`whitespace-nowrap ${activity.status === 'incomplete' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800' : ''}`}
                  >
                    {activity.status === 'incomplete' && <Pause className="h-3 w-3 mr-1" />}
                    {statusInfo.label}
                  </Badge>
                  {activity.priority === "high" && (
                    <Badge variant="destructive" className="text-xs whitespace-nowrap">
                      High Priority
                    </Badge>
                  )}

                  <div className="text-sm text-muted-foreground pr-1">
                    <span>{timeString}</span>
                  </div>
                </div>
              </div>

              {/* Bottom: Activity Details or Resume Activity Button */}
              {activity.status === "incomplete" ? (
                <Link href={`/homes/${home?.id || activity.homeCode}/activities/${activityTypeToTemplateType[activity.type]}/track${activity.bookingId ? `?bookingId=${activity.bookingId}` : ''}`}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full h-12 rounded-lg font-medium text-base gap-2"
                  >
                    <Pause className="h-4 w-4" />
                    Resume Activity
                  </Button>
                </Link>
              ) : activity.status === "pending" ? (
                <Link href={`/activities/${activity.id}`}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full h-12 rounded-lg font-medium text-base"
                  >
                    Activity Details
                  </Button>
                </Link>
              ) : (
                <Link href={`/activities/${activity.id}`}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full h-12 rounded-lg font-medium text-base"
                  >
                    Activity Details
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
      <div className="space-y-8">


        {/* Started Activities */}
        {startedActivities.length > 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold mb-1">Started Activities</h2>
              <p className="text-sm text-muted-foreground">Activities you've begun working on, and are active.</p>
            </div>
            <div className="flex flex-col">
              {startedActivities.map(renderActivity)}
            </div>
          </div>
        )}

        {/* My Activities */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-1">My Activities</h2>
            <p className="text-sm text-muted-foreground">Activities assigned to you</p>
          </div>
          <div className="flex flex-col">
            {myActivities.length > 0 ? (
              myActivities.map(renderActivity)
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No activities assigned to you
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* All Activities */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-1">All Activities</h2>
            <p className="text-sm text-muted-foreground">Complete list of all activities in the system</p>
          </div>
          <div className="flex flex-col">
            {allActivities.map(renderActivity)}
          </div>
        </div>
      </div>
    </div>
  )
}

