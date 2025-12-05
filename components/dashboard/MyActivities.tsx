"use client"

import { useState, useEffect } from "react"
import { testActivities, testHomes, testBookings } from "@/lib/test-data"
import { getIncompleteActivities } from "@/lib/activity-utils"
import { ChevronDown } from "lucide-react"
import { Card as SectionCard, CardContent as SectionCardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { MapSheet } from "@/components/map/MapSheet"
import { ActivityCard } from "@/components/activities/ActivityCard"

import type { Activity, Home, Booking } from "@/lib/test-data"

interface MyActivitiesProps {
  activities?: Activity[]
  homes?: Home[]
  bookings?: Booking[]
  isLoading?: boolean
}

export function MyActivities({ activities = [], homes = [], bookings = [], isLoading = false }: MyActivitiesProps) {
  const [incompleteActivities, setIncompleteActivities] = useState<Activity[]>([])
  const [completedIsOpen, setCompletedIsOpen] = useState(false)
  const [mapSheetOpen, setMapSheetOpen] = useState(false)
  const [selectedHome, setSelectedHome] = useState<{
    code: string
    name?: string
    address: string
    city?: string
    coordinates?: { lat: number, lng: number }
  } | null>(null)

  // Load incomplete activities on mount
  useEffect(() => {
    const incomplete = getIncompleteActivities()
    setIncompleteActivities(incomplete)
  }, [])

  // Use provided data or fall back to test data
  const displayHomes = homes.length > 0 ? homes : testHomes
  const displayBookings = bookings.length > 0 ? bookings : testBookings
  const baseActivities: Activity[] = activities.length > 0 ? activities : testActivities
  const displayActivities: Activity[] = [...baseActivities, ...incompleteActivities]

  // Separate activities into active and completed
  const activeActivities = displayActivities.filter(a => a.status !== "completed")
  const completedActivities = displayActivities.filter(a => a.status === "completed")

  // Sort active activities: in-progress and paused first, then others
  const sortedActiveActivities = activeActivities.sort((a, b) => {
    const priorityOrder: Record<Activity['status'], number> = {
      "in-progress": 0,
      "paused": 1,
      "to-start": 2,
      "abandoned": 3,
      "cancelled": 4,
      "completed": 5,
      "ignored": 6
    }
    const aPriority = priorityOrder[a.status] ?? 99
    const bPriority = priorityOrder[b.status] ?? 99
    return aPriority - bPriority
  })

  const handleShowMap = (homeCode: string) => {
    const home = displayHomes.find(h => h.code === homeCode)
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
    // Get home for linking
    const home = displayHomes.find(h => h.code === activity.homeCode)

    // Get booking internal ID for linking
    const booking = activity.bookingId ? displayBookings.find(b => b.bookingId === activity.bookingId) : undefined

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
          {sortedActiveActivities.length > 0 && (
            <div>
              <div className="py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
                  <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <span className="break-words">My Activities</span>
                    <Badge variant="secondary" className="text-xs">{sortedActiveActivities.length}</Badge>
                  </h2>
                </div>
              </div>
              <div className="py-4 sm:py-6 pt-0">
                <div className="space-y-0">
                  {sortedActiveActivities.map(renderActivity)}
                </div>
              </div>
            </div>
          )}

          {/* Completed Activities */}
          {completedActivities.length > 0 && (
            <Collapsible open={completedIsOpen} onOpenChange={setCompletedIsOpen}>
              <SectionCard className="w-full hover:bg-white/80 dark:hover:bg-black/50 transition-colors">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                      <span className="break-words">Completed</span>
                      <Badge variant="outline" className="text-xs">{completedActivities.length}</Badge>
                    </CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${completedIsOpen ? 'rotate-180' : ''}`} />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <SectionCardContent className="p-4 sm:p-6 pt-0">
                    <div className="space-y-0">
                      {completedActivities.map(renderActivity)}
                    </div>
                  </SectionCardContent>
                </CollapsibleContent>
              </SectionCard>
            </Collapsible>
          )}
        </>
      )}
      
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

