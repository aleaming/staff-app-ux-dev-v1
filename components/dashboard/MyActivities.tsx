"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { testActivities, testHomes } from "@/lib/test-data"
import type { Booking, Home } from "@/lib/test-data"
import { getIncompleteActivities } from "@/lib/activity-utils"
import {
  AlertCircle,
  Package,
  Handshake,
  RefreshCw,
  X,
  Pause,
  ChevronDown,
  MapPin,
  Calendar,
  Bed,
  Bath
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Card as SectionCard, CardContent as SectionCardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { MapSheet } from "@/components/map/MapSheet"
import { HomeInfoSheet } from "@/components/homes/HomeInfoSheet"
import { BookingInfoSheet } from "@/components/bookings/BookingInfoSheet"

// Activity types - aligned with lib/test-data.ts and lib/activity-templates.ts
export type ActivityType = 
  | "provisioning"
  | "deprovisioning"
  | "turn"
  | "maid-service"
  | "mini-maid"
  | "touch-up"
  | "quality-check"
  | "meet-greet"
  | "additional-greet"
  | "bag-drop"
  | "service-recovery"
  | "home-viewing"
  | "adhoc"
export type ActivityStatus = "to-start" | "in-progress" | "paused" | "abandoned" | "completed" | "cancelled" | "ignored"

export interface Activity {
  id: string
  type: ActivityType
  title: string
  homeCode: string
  homeName?: string
  bookingId?: string
  scheduledTime: Date
  endTime?: Date
  status: ActivityStatus
  priority?: "high" | "normal"
  description?: string
  assignedTo?: string
  // Activity attributes (sub-statuses/tags)
  confirmed?: boolean
  onTime?: boolean
  delayed?: boolean
  hasIssues?: boolean
}

interface MyActivitiesProps {
  activities?: Activity[]
  bookings?: Booking[]
  homes?: Home[]
  isLoading?: boolean
}

// Map activity types to template types (now unified, but kept for backwards compatibility)
const activityTypeToTemplateType: Record<string, string> = {
  "provisioning": "provisioning",
  "deprovisioning": "deprovisioning",
  "turn": "turn",
  "maid-service": "maid-service",
  "mini-maid": "mini-maid",
  "touch-up": "touch-up",
  "quality-check": "quality-check",
  "meet-greet": "meet-greet",
  "additional-greet": "additional-greet",
  "bag-drop": "bag-drop",
  "service-recovery": "service-recovery",
  "home-viewing": "home-viewing",
  "adhoc": "adhoc",
}

const activityTypeConfig: Record<string, { label: string; icon: typeof Package; color: string }> = {
  // Home preparation
  "provisioning": { label: "Provisioning", icon: Package, color: "var(--activity-provisioning)" },
  "deprovisioning": { label: "Deprovisioning", icon: X, color: "var(--activity-deprovision)" },
  "turn": { label: "Turn", icon: RefreshCw, color: "var(--activity-turn)" },
  "maid-service": { label: "Maid Service", icon: RefreshCw, color: "var(--activity-maid)" },
  "mini-maid": { label: "Mini-Maid", icon: RefreshCw, color: "var(--activity-mini-maid)" },
  "touch-up": { label: "Touch-Up", icon: RefreshCw, color: "var(--activity-touch-up)" },
  "quality-check": { label: "Quality Check", icon: AlertCircle, color: "var(--activity-quality-check)" },
  // Guest welcoming
  "meet-greet": { label: "Meet & Greet", icon: Handshake, color: "var(--activity-greet)" },
  "additional-greet": { label: "Additional Greet", icon: Handshake, color: "var(--activity-additional-greet)" },
  "bag-drop": { label: "Bag Drop", icon: Package, color: "var(--activity-bag-drop)" },
  "service-recovery": { label: "Service Recovery", icon: AlertCircle, color: "var(--activity-service-recovery)" },
  "home-viewing": { label: "Home Viewing", icon: Handshake, color: "var(--activity-home-viewing)" },
  // Other
  "adhoc": { label: "Ad-hoc", icon: AlertCircle, color: "var(--activity-adhoc)" },
}

const statusConfig = {
  "to-start": { label: "To Start", variant: "secondary" as const },
  "in-progress": { label: "In Progress", variant: "default" as const },
  "paused": { label: "Paused", variant: "secondary" as const },
  "abandoned": { label: "Abandoned", variant: "destructive" as const },
  "completed": { label: "Completed", variant: "outline" as const },
  "cancelled": { label: "Cancelled", variant: "outline" as const },
  "ignored": { label: "Ignored", variant: "outline" as const },
}

export function MyActivities({ activities = [], bookings = [], homes = [], isLoading = false }: MyActivitiesProps) {
  // Use passed homes or fall back to test data
  const homesList = homes.length > 0 ? homes : testHomes
  const [incompleteActivities, setIncompleteActivities] = useState<Activity[]>([])
  const [completedIsOpen, setCompletedIsOpen] = useState(false)
  const [mapSheetOpen, setMapSheetOpen] = useState(false)
  const [selectedHome, setSelectedHome] = useState<{
    code: string
    name?: string
    address: string
    city?: string
    location?: string
    market?: string
    coordinates?: { lat: number, lng: number }
  } | null>(null)

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

  // Sort active activities: in-progress and paused first, then others
  const sortedActiveActivities = activeActivities.sort((a, b) => {
    const priorityOrder: Record<ActivityStatus, number> = {
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

  const handleShowMap = (e: React.MouseEvent, homeCode: string) => {
    e.preventDefault()
    e.stopPropagation()
    const home = homesList.find(h => h.code === homeCode)
    if (home) {
      setSelectedHome({
        code: home.code,
        name: home.name,
        address: home.address,
        city: home.city,
        location: home.location,
        market: home.market,
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
              const typeConfig = activityTypeConfig[activity.type]
              const statusInfo = statusConfig[activity.status]

              // Skip activities with invalid types
              if (!typeConfig || !statusInfo) {
                console.warn(`Invalid activity type or status: ${activity.type}, ${activity.status}`)
                return null
              }

              const startTimeString = activity.scheduledTime.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit' 
              })
              const endTimeString = activity.endTime?.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit' 
              })
              const timeString = endTimeString 
                ? `${startTimeString} – ${endTimeString}`
                : startTimeString
              
              // Get home for linking
              const home = homesList.find(h => h.code === activity.homeCode)

              // Get booking internal ID for linking
              const booking = activity.bookingId ? bookings.find(b => b.bookingId === activity.bookingId) : null

    return (
      <div key={activity.id} className="pb-3 last:pb-0">
        <Card 
          className="hover:bg-white/80 dark:hover:bg-black/50 transition-colors overflow-hidden border-l-[8px]"
          style={{ borderLeftColor: typeConfig.color }}
        >
          <CardContent className="p-4 sm:p-5">
            <div className="space-y-2">
              {/* Row 1: Title/Home Info on left, Status Badge/Time on right */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-bold text-base">
                    {typeConfig.label}
                  </h3>
                  <HomeInfoSheet
                    homeId={home?.id || activity.homeCode}
                    homeCode={activity.homeCode}
                    homeName={activity.homeName}
                    location={home?.location}
                    market={home?.market}
                  >
                    <button className="text-xs text-primary underline hover:text-primary/80 transition-colors text-left">
                      {activity.homeCode}
                      {activity.homeName && (
                        <span> • {activity.homeName}</span>
                      )}
                    </button>
                  </HomeInfoSheet>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge
                    variant={statusInfo.variant}
                    className={`whitespace-nowrap ${activity.status === 'paused' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800' : ''} ${activity.status === 'to-start' ? 'text-neutral-900 border-transparent' : ''}`}
                    style={activity.status === 'to-start' ? { backgroundColor: typeConfig.color } : undefined}
                  >
                    {activity.status === 'paused' && <Pause className="h-3 w-3 mr-1" />}
                    {statusInfo.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{timeString}</span>
                </div>
              </div>

              {/* Row 2: Location and Market badges */}
              {home && (home.location || home.market) && (
                <div className="flex items-center gap-1.5">
                  {home.location && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                      {home.location}
                    </Badge>
                  )}
                  {home.market && home.market !== home.location && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                      {home.market}
                    </Badge>
                  )}
                </div>
              )}

              {/* Row 3: Additional details - bedrooms, address, booking info */}
              <div className="space-y-2 pb-2">
                {home && (home.bedrooms || home.bathrooms) && (
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {home.bedrooms && (
                      <span className="flex items-center gap-1">
                        <Bed className="h-3 w-3" />
                        {home.bedrooms} {home.bedrooms === 1 ? 'bed' : 'beds'}
                      </span>
                    )}
                    {home.bathrooms && (
                      <span className="flex items-center gap-1">
                        <Bath className="h-3 w-3" />
                        {home.bathrooms} {home.bathrooms === 1 ? 'bath' : 'baths'}
                      </span>
                    )}
                  </div>
                )}
                {home && (
                  <button
                    onClick={(e) => handleShowMap(e, activity.homeCode)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors text-left w-full min-w-0 overflow-hidden"
                  >
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="underline truncate">{home.address}, {home.city}</span>
                  </button>
                )}
                {activity.bookingId && booking && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <BookingInfoSheet bookingId={booking.bookingId}>
                      <button className="underline hover:text-primary transition-colors">
                        {activity.bookingId}
                      </button>
                    </BookingInfoSheet>
                    <span>•</span>
                    <span>
                      {booking.checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {booking.checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom: Start/Resume Activity Button */}
              {activity.status === "to-start" && (
                <Link href={`/activities/${activity.id}`}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full h-10 rounded-lg font-medium text-base text-neutral-900 dark:text-neutral-900 border-transparent"
                    style={{ backgroundColor: typeConfig.color }}
                  >
                    Activity Details
                  </Button>
                </Link>
              )}
              {activity.status === "paused" && (
                <Link href={`/homes/${home?.id || activity.homeCode}/activities/${activityTypeToTemplateType[activity.type]}/track${activity.bookingId ? `?bookingId=${activity.bookingId}` : ''}`}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full h-10 rounded-lg font-medium text-base gap-2"
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
          location={selectedHome.location}
          market={selectedHome.market}
          coordinates={selectedHome.coordinates}
        />
      )}
    </div>
  )
}

