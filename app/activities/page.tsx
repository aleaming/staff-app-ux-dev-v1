"use client"

import { useEffect, useState } from "react"
import { useData } from "@/lib/data/DataProvider"
import { getIncompleteActivities } from "@/lib/activity-utils"
import type { Activity } from "@/lib/test-data"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ActivityCard } from "@/components/activities/ActivityCard"
import { MapSheet } from "@/components/map/MapSheet"

function ActivitiesSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ActivitiesPage() {
  const { activities, homes, bookings, isLoading } = useData()
  const [incompleteActivities, setIncompleteActivities] = useState<Activity[]>([])
  const [mapSheetOpen, setMapSheetOpen] = useState(false)
  const [selectedHome, setSelectedHome] = useState<{
    code: string
    name?: string
    address: string
    city?: string
    coordinates?: { lat: number, lng: number }
  } | null>(null)

  useEffect(() => {
    const incomplete = getIncompleteActivities()
    setIncompleteActivities(incomplete)
  }, [])

  const handleShowMap = (homeCode: string) => {
    const home = homes.find(h => h.code === homeCode)
    if (home) {
      setSelectedHome({
        code: home.code,
        name: home.name,
        address: home.address,
        city: home.city,
        coordinates: home.coordinates
      })
      setMapSheetOpen(true)
    }
  }

  if (isLoading) {
    return <ActivitiesSkeleton />
  }

  // Filter activities by category
  const startedActivities = [...incompleteActivities, ...activities.filter(a => a.status === "in-progress")]
  const myActivities = activities.filter(a => a.assignedTo === "Alex" && a.status !== "completed")
  const allActivities = activities

  const renderActivity = (activity: Activity) => {
    const home = homes.find(h => h.code === activity.homeCode)
    const booking = activity.bookingId ? bookings.find(b => b.bookingId === activity.bookingId) : undefined

    return (
      <ActivityCard
        key={activity.id}
        activity={activity}
        home={home}
        booking={booking}
        onShowMap={handleShowMap}
      />
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
            <h2 className="text-2xl font-semibold mb-1">Activities assigned to me</h2>
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

      {/* Map Sheet */}
      {selectedHome && (
        <MapSheet
          open={mapSheetOpen}
          onOpenChange={setMapSheetOpen}
          homeCode={selectedHome.code}
          homeName={selectedHome.name}
          address={selectedHome.address}
          city={selectedHome.city}
          coordinates={selectedHome.coordinates}
        />
      )}
    </div>
  )
}

