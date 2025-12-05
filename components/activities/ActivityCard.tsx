"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HomeInfoSheet } from "@/components/homes/HomeInfoSheet"
import { BookingInfoSheet } from "@/components/bookings/BookingInfoSheet"
import {
  AlertCircle,
  Package,
  Handshake,
  RefreshCw,
  X,
  Pause,
  MapPin,
  Calendar,
  Home,
  BedDouble,
  Bath
} from "lucide-react"
import type { Activity, Home as HomeType, Booking } from "@/lib/test-data"

// Activity types configuration
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

// Map activity types to template types
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

interface ActivityCardProps {
  activity: Activity
  home?: HomeType
  booking?: Booking
  onShowMap?: (homeCode: string) => void
}

export function ActivityCard({ activity, home, booking, onShowMap }: ActivityCardProps) {
  const typeConfig = activityTypeConfig[activity.type]
  const statusInfo = statusConfig[activity.status]

  // Skip activities with invalid types
  if (!typeConfig || !statusInfo) {
    console.warn(`Invalid activity type or status: ${activity.type}, ${activity.status}`)
    return null
  }

  const timeString = activity.scheduledTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  })

  const handleMapClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onShowMap) {
      onShowMap(activity.homeCode)
    }
  }

  return (
    <div className="pb-3 last:pb-0">
      <Card 
        className="hover:bg-white/80 dark:hover:bg-black/50 transition-colors overflow-hidden border-l-[8px]"
        style={{ borderLeftColor: typeConfig.color }}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-4">
            {/* Top Section: Title and Right Side Info */}
            <div className="flex items-start justify-between gap-4">
              {/* Left: Title and Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base pl-4 mb-1">
                  {typeConfig.label}
                </h3>
                <div className="gap-1">
                  <div className="text-xs text-muted-foreground mb-2">
                    <HomeInfoSheet
                      homeId={home?.id || activity.homeCode}
                      homeCode={activity.homeCode}
                      homeName={activity.homeName}
                    >
                      <button className="flex items-center gap-1 text-primary underline hover:text-primary/80 transition-colors text-left">
                        <Home className="h-3 w-3 flex-shrink-0" />
                        <span>
                          {activity.homeCode}
                          {activity.homeName && (
                            <span> • {activity.homeName}</span>
                          )}
                        </span>
                      </button>
                    </HomeInfoSheet>
                  </div>
                  {home && (home.bedrooms || home.bathrooms) && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      {home.bedrooms && (
                        <div className="flex items-center gap-1">
                          <BedDouble className="h-3 w-3" />
                          <span>{home.bedrooms} bed{home.bedrooms !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {home.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bath className="h-3 w-3" />
                          <span>{home.bathrooms} bath{home.bathrooms !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {home && onShowMap && (
                    <div className="flex items-center gap-1 text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <button
                        onClick={handleMapClick}
                        className="underline hover:text-primary transition-colors text-left text-xs truncate"
                      >
                        {home.address}, {home.city}
                      </button>
                    </div>
                  )}
                  {activity.bookingId && booking && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <BookingInfoSheet
                        booking={booking}
                        home={home}
                      >
                        <button className="underline hover:text-primary transition-colors text-left">
                          {activity.bookingId}
                        </button>
                      </BookingInfoSheet>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Status Badges, Time */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <Badge
                  variant={statusInfo.variant}
                  className={`whitespace-nowrap ${activity.status === 'paused' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800' : ''}`}
                >
                  {activity.status === 'paused' && <Pause className="h-3 w-3 mr-1" />}
                  {statusInfo.label}
                </Badge>

                <div className="text-xs text-muted-foreground pr-1">
                  <span>{timeString}</span>
                </div>
              </div>
            </div>

            {/* Bottom: Start/Resume Activity Button */}
            {activity.status === "to-start" && (
              <Link href={`/activities/${activity.id}`}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full h-10 rounded-lg font-medium text-base"
                >
                  Begin Activity
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
                  {typeConfig.label}
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

