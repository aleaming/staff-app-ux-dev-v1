"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, MapPin, Target, CheckCircle2, AlertCircle } from "lucide-react"
import { testActivities, testHomes, type Activity, type Home } from "@/lib/test-data"
import Link from "next/link"

export function PlanMyDay() {
  const [enabled, setEnabled] = useState(true)
  const [optimizeRoute, setOptimizeRoute] = useState(true)
  const [includeWeather, setIncludeWeather] = useState(true)
  const [plannedActivities, setPlannedActivities] = useState<Activity[]>([])

  useEffect(() => {
    if (enabled) {
      // Get today's activities and sort them
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const todaysActivities = testActivities
        .filter(activity => {
          const activityDate = new Date(activity.scheduledTime)
          return activityDate >= today && activityDate < tomorrow
        })
        .sort((a, b) => {
          const timeA = new Date(a.scheduledTime).getTime()
          const timeB = new Date(b.scheduledTime).getTime()
          return timeA - timeB
        })

      // If optimize route is enabled, sort by location proximity
      if (optimizeRoute && todaysActivities.length > 0) {
        // Simple optimization: group by home code first, then by time
        const grouped = todaysActivities.reduce((acc, activity) => {
          const key = activity.homeCode
          if (!acc[key]) acc[key] = []
          acc[key].push(activity)
          return acc
        }, {} as Record<string, Activity[]>)

        const optimized: Activity[] = []
        Object.values(grouped).forEach(group => {
          group.sort((a, b) => {
            const timeA = new Date(a.scheduledTime).getTime()
            const timeB = new Date(b.scheduledTime).getTime()
            return timeA - timeB
          })
          optimized.push(...group)
        })

        setPlannedActivities(optimized)
      } else {
        setPlannedActivities(todaysActivities)
      }
    } else {
      setPlannedActivities([])
    }
  }, [enabled, optimizeRoute])

  const getActivityHome = (activity: Activity): Home | undefined => {
    return testHomes.find(h => h.code === activity.homeCode)
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusBadge = (status: Activity["status"]) => {
    switch (status) {
      case "to-start":
        return <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">To Start</Badge>
      case "in-progress":
        return <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">In Progress</Badge>
      case "paused":
        return <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">Paused</Badge>
      case "completed":
        return <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">Completed</Badge>
      case "abandoned":
        return <Badge variant="destructive">Abandoned</Badge>
      case "cancelled":
        return <Badge variant="outline" className="bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800">Cancelled</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Plan My Day
            </CardTitle>
            <CardDescription>
              Automatically organize your activities for optimal efficiency
            </CardDescription>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Settings */}
        <div className="space-y-3 pb-4 border-b">
          <div className="flex items-center justify-between">
            <Label htmlFor="optimize-route" className="flex items-center gap-2 cursor-pointer">
              <MapPin className="h-4 w-4" />
              <span>Optimize Route</span>
            </Label>
            <Switch
              id="optimize-route"
              checked={optimizeRoute}
              onCheckedChange={setOptimizeRoute}
              disabled={!enabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="include-weather" className="flex items-center gap-2 cursor-pointer">
              <Clock className="h-4 w-4" />
              <span>Include Weather Alerts</span>
            </Label>
            <Switch
              id="include-weather"
              checked={includeWeather}
              onCheckedChange={setIncludeWeather}
              disabled={!enabled}
            />
          </div>
        </div>

        {/* Planned Activities */}
        {enabled && plannedActivities.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Today's Schedule</h3>
              <Badge variant="outline">{plannedActivities.length} activities</Badge>
            </div>
            <div className="space-y-2">
              {plannedActivities.map((activity, index) => {
                const home = getActivityHome(activity)
                const isLast = index === plannedActivities.length - 1

                return (
                  <div key={activity.id} className="relative">
                    {/* Timeline connector */}
                    {!isLast && (
                      <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-border" />
                    )}

                    <div className="flex gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                      {/* Time indicator */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          {formatTime(activity.scheduledTime)}
                        </span>
                      </div>

                      {/* Activity details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/activities/${activity.id}`}
                              className="font-semibold hover:underline block truncate"
                            >
                              {activity.title}
                            </Link>
                            {home && (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3" />
                                <Link
                                  href={`/homes/${home.id}`}
                                  className="hover:underline"
                                >
                                  {activity.homeCode} {home.name && `• ${home.name}`}
                                </Link>
                                {home.distance && (
                                  <span className="text-xs">({home.distance} km away)</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getStatusBadge(activity.status)}
                          </div>
                        </div>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {activity.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : enabled ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No activities scheduled for today</p>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Enable "Plan My Day" to see your optimized schedule</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

