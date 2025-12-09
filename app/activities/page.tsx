"use client"

import { useEffect, useState } from "react"
import { useData } from "@/lib/data/DataProvider"
import { getIncompleteActivities } from "@/lib/activity-utils"
import type { Activity } from "@/lib/test-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Package,
  Handshake,
  RefreshCw,
  X,
  AlertCircle,
  Pause,
  Calendar,
  Bed,
  Bath,
  MapPin
} from "lucide-react"
import Link from "next/link"
import { HomeInfoSheet } from "@/components/homes/HomeInfoSheet"
import { BookingInfoSheet } from "@/components/bookings/BookingInfoSheet"
import { MapSheet } from "@/components/map/MapSheet"

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

// Map activity types to template types (unified, but kept for backwards compatibility)
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

const statusConfig = {
  "to-start": { label: "To Start", variant: "secondary" as const },
  "in-progress": { label: "In Progress", variant: "default" as const },
  "paused": { label: "Paused", variant: "secondary" as const },
  "abandoned": { label: "Abandoned", variant: "destructive" as const },
  "completed": { label: "Completed", variant: "outline" as const },
  "cancelled": { label: "Cancelled", variant: "outline" as const },
  "ignored": { label: "Ignored", variant: "outline" as const },
}

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
    location?: string
    market?: string
    coordinates?: { lat: number, lng: number }
  } | null>(null)

  useEffect(() => {
    const incomplete = getIncompleteActivities()
    setIncompleteActivities(incomplete)
  }, [])

  const handleShowMap = (e: React.MouseEvent, homeCode: string) => {
    e.preventDefault()
    e.stopPropagation()
    const home = homes.find(h => h.code === homeCode)
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
    return <ActivitiesSkeleton />
  }

  // Filter activities by category
  const startedActivities = [...incompleteActivities, ...activities.filter(a => a.status === "in-progress")]
  const myActivities = activities.filter(a => a.assignedTo === "Alex" && a.status !== "completed")
  const allActivities = activities

  const renderActivity = (activity: Activity) => {
    const typeConfig = activityTypeConfig[activity.type as keyof typeof activityTypeConfig]
    const statusInfo = statusConfig[activity.status as keyof typeof statusConfig]

    if (!typeConfig || !statusInfo) return null

    const home = homes.find(h => h.code === activity.homeCode)
    const booking = activity.bookingId ? bookings.find(b => b.bookingId === activity.bookingId) : null
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

    return (
      <div key={activity.id} className="pb-3 last:pb-0">
        <Card 
          className="hover:bg-white/80 dark:hover:bg-black/50 transition-colors overflow-hidden border-l-[8px]"
          style={{ borderLeftColor: typeConfig.color }}
        >
          <CardContent className="p-4 sm:p-5">
            <div className="space-y-3">
              {/* Row 1: Title, Home Info, Status Badge, and Time */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-0 flex-wrap">
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
                      <button className="text-xs text-primary underline hover:text-primary/80 transition-colors">
                        {activity.homeCode}
                        {activity.homeName && (
                          <span> • {activity.homeName}</span>
                        )}
                      </button>
                    </HomeInfoSheet>
                    {home && (home.location || home.market) && (
                      <>
                        {home.location && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal mt-2">
                            {home.location}
                          </Badge>
                        )}
                        {home.market && home.market !== home.location && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal mt-2">
                            {home.market}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge
                    variant={statusInfo.variant}
                    className={`whitespace-nowrap ${activity.status === 'paused' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800' : ''}`}
                  >
                    {activity.status === 'paused' && <Pause className="h-3 w-3 mr-1" />}
                    {statusInfo.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{timeString}</span>
                </div>
              </div>

              {/* Row 2: Additional details - bedrooms, address, booking info */}
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
                {home && home.address && (
                  <button
                    onClick={(e) => handleShowMap(e, activity.homeCode)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors text-left w-full min-w-0 overflow-hidden"
                  >
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="underline truncate">{home.address}{home.city && `, ${home.city}`}</span>
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

              {/* Bottom: Activity Details or Resume Activity Button */}
              {activity.status === "paused" ? (
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
              ) : (
                <Link href={`/activities/${activity.id}`}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full h-10 rounded-lg font-medium text-base"
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

