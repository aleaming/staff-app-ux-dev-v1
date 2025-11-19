"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { testActivities, testHomes, testBookings } from "@/lib/test-data"
import { getIncompleteActivities } from "@/lib/activity-utils"
import {
  AlertCircle,
  Package,
  Handshake,
  RefreshCw,
  X,
  Pause
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export type ActivityType = "provisioning" | "meet-greet" | "turn" | "deprovision" | "ad-hoc"
export type ActivityStatus = "pending" | "in-progress" | "completed" | "overdue" | "incomplete"

export interface Activity {
  id: string
  type: ActivityType
  title: string
  homeCode: string
  homeName?: string
  bookingId?: string
  scheduledTime: Date
  status: ActivityStatus
  priority?: "high" | "normal"
}

interface MyActivitiesProps {
  activities?: Activity[]
  isLoading?: boolean
}

// Map test-data activity types to template activity types
const activityTypeToTemplateType: Record<string, string> = {
  "provisioning": "provisioning",
  "meet-greet": "meet-greet",
  "turn": "turn",
  "deprovision": "deprovisioning",
  "ad-hoc": "adhoc",
}

const activityTypeConfig = {
  "provisioning": { label: "Provisioning", icon: Package, color: "bg-blue-500" },
  "meet-greet": { label: "Meet & Greet", icon: Handshake, color: "bg-green-500" },
  "turn": { label: "Turn", icon: RefreshCw, color: "bg-orange-500" },
  "deprovision": { label: "Deprovision", icon: X, color: "bg-red-500" },
  "ad-hoc": { label: "Ad-hoc", icon: AlertCircle, color: "bg-purple-500" },
}

const statusConfig = {
  "pending": { label: "Pending", variant: "secondary" as const },
  "in-progress": { label: "In Progress", variant: "default" as const },
  "completed": { label: "Completed", variant: "outline" as const },
  "overdue": { label: "Overdue", variant: "destructive" as const },
  "incomplete": { label: "Incomplete", variant: "secondary" as const },
}

export function MyActivities({ activities = [], isLoading = false }: MyActivitiesProps) {
  const [incompleteActivities, setIncompleteActivities] = useState<Activity[]>([])

  // Load incomplete activities on mount
  useEffect(() => {
    const incomplete = getIncompleteActivities()
    setIncompleteActivities(incomplete)
  }, [])

  // Use provided activities or fall back to test data, and merge with incomplete activities
  const baseActivities: Activity[] = activities.length > 0 ? activities : testActivities
  const displayActivities: Activity[] = [...baseActivities, ...incompleteActivities]

  // Separate activities into active and completed
  const activeActivities = displayActivities.filter(a => a.status !== "completed")
  const completedActivities = displayActivities.filter(a => a.status === "completed")

  if (isLoading) {
    return (
      <div>
        <div className="py-4 sm:py-6">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="py-4 sm:py-6 pt-0">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderActivity = (activity: Activity) => {
              const typeConfig = activityTypeConfig[activity.type]
              const statusInfo = statusConfig[activity.status]

              // Skip activities with invalid types
              if (!typeConfig || !statusInfo) {
                console.warn(`Invalid activity type or status: ${activity.type}, ${activity.status}`)
                return null
              }

              const TypeIcon = typeConfig.icon
              const timeString = activity.scheduledTime.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit' 
              })
              
              // Get home for linking
              const home = testHomes.find(h => h.code === activity.homeCode)

              // Get booking internal ID for linking
              const booking = activity.bookingId ? testBookings.find(b => b.bookingId === activity.bookingId) : null

    return (
      <div key={activity.id} className="pb-4 last:pb-0">
        <Card className="hover:bg-white/80 dark:hover:bg-black/50 transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="space-y-4">
              {/* Top Section: Icon, Title, and Right Side Info */}
              <div className="flex items-start justify-between gap-4">
                {/* Left: Icon and Title */}
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  {/* Icon */}
                  <div className={`p-1.5 rounded-lg ${typeConfig.color} text-background flex-shrink-0`}>
                    <TypeIcon className="h-4 w-4" />
                  </div>
                  {/* Title and Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base">{activity.title}</h3>
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
                        <div className="text-xs text-muted-foreground italic mb-3">
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

              {/* Bottom: Start/Resume Activity Button */}
              {activity.status === "pending" && (
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
              {activity.status === "incomplete" && (
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
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      {displayActivities.length === 0 ? (
        <div>
          <div className="py-4 sm:py-6">
            <h2 className="text-base sm:text-lg font-semibold">My Activities</h2>
          </div>
          <div className="py-4 sm:py-6 pt-0">
            <div className="text-center py-6 sm:py-8">
              <p className="text-sm sm:text-base text-muted-foreground">No activities scheduled</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Your upcoming activities will appear here
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Active Activities */}
          {activeActivities.length > 0 && (
            <div>
              <div className="py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
                  <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <span className="break-words">My Activities</span>
                    <Badge variant="secondary" className="text-xs">{activeActivities.length}</Badge>
                  </h2>
                </div>
              </div>
              <div className="py-4 sm:py-6 pt-0">
                <div className="space-y-0">
                  {activeActivities.map(renderActivity)}
                </div>
              </div>
            </div>
          )}

          {/* Completed Activities */}
          {completedActivities.length > 0 && (
            <div>
              <div className="py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
                  <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <span className="break-words">Completed</span>
                    <Badge variant="outline" className="text-xs">{completedActivities.length}</Badge>
                  </h2>
                </div>
              </div>
              <div className="py-4 sm:py-6 pt-0">
                <div className="space-y-0">
                  {completedActivities.map(renderActivity)}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

