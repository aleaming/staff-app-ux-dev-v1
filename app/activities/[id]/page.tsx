"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/data/DataProvider"
import type { ActivityStatus } from "@/lib/test-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"
import { ReportIssueButton } from "@/components/property/ReportIssueButton"
import { HomeInformationCard } from "./ActivityDetailClient"
import { HomeInfoSheet } from "@/components/homes/HomeInfoSheet"
import { PreActivityConfirmationModal } from "@/components/activities/PreActivityConfirmationModal"
import { TaskPreviewSheet } from "@/components/activities/TaskPreviewSheet"
import { DamagesNotificationBanner } from "@/components/homes/DamagesNotificationBanner"
import { BookingNotesCard } from "@/components/bookings/BookingNotesCard"
import { EntryCodesCard } from "@/components/bookings/EntryCodesCard"
import type { ActivityType } from "@/lib/activity-templates"
import {
  MapPin,
  Clock,
  Calendar,
  User,
  Package,
  Handshake,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  List
} from "lucide-react"
import Link from "next/link"

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

// Map activity types to template types (unified)
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

const statusConfig: Record<ActivityStatus, { label: string; variant: "default" | "destructive" | "outline" | "secondary" }> = {
  "to-start": { label: "To Start", variant: "secondary" as const },
  "in-progress": { label: "In Progress", variant: "default" as const },
  "paused": { label: "Paused", variant: "secondary" as const },
  "abandoned": { label: "Abandoned", variant: "destructive" as const },
  "completed": { label: "Completed", variant: "outline" as const },
  "cancelled": { label: "Cancelled", variant: "outline" as const },
  "ignored": { label: "Ignored", variant: "outline" as const },
}

function ActivityDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="space-y-6">
        <Skeleton className="h-6 w-64" />
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

function ActivityNotFound() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertTriangle className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Activity Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The activity you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/activities">Back to Activities</Link>
        </Button>
      </div>
    </div>
  )
}

interface ActivityDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { activities, homes, bookings, bookingNotes: allBookingNotes, isLoading } = useData()
  const [showConfirmation, setShowConfirmation] = useState(false)

  if (isLoading) {
    return <ActivityDetailSkeleton />
  }

  const activity = activities.find(a => a.id === id)

  if (!activity) {
    return <ActivityNotFound />
  }

  const home = homes.find(h => h.code === activity.homeCode)
  const booking = activity.bookingId 
    ? bookings.find(b => b.bookingId === activity.bookingId) 
    : null
  const bookingNotes = booking 
    ? allBookingNotes.find(bn => bn.bookingRef === booking.bookingId)
    : null
  const typeConfig = activityTypeConfig[activity.type] || activityTypeConfig["adhoc"]
  const statusInfo = statusConfig[activity.status]
  const TypeIcon = typeConfig.icon

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const formatTimeRange = (startDate: Date, endDate?: Date) => {
    const dateStr = startDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const startTimeStr = startDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
    const endTimeStr = endDate?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
    
    if (endTimeStr) {
      return `${dateStr}, ${startTimeStr} – ${endTimeStr}`
    }
    return `${dateStr}, ${startTimeStr}`
  }

  // Build breadcrumbs based on whether activity has a booking
  // Final breadcrumb (current page) is omitted since the page title already shows it
  const breadcrumbs = booking
    ? [
        { label: "Bookings", href: "/catalog?tab=bookings" },
        { label: booking.bookingId, href: `/bookings/${booking.id}` }
      ]
    : [
        { label: "Activities", href: "/activities" }
      ]

  return (
    <div>
      {/* Damages Banner - shows if home has damages */}
      {home && home.damages && home.damages.length > 0 && (
        <DamagesNotificationBanner homeId={home.id} damages={home.damages} />
      )}

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="space-y-4">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Header */}
        <div className="flex items-start gap-4">
          
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">{typeConfig.label}</h1>
            {home ? (
              <HomeInfoSheet
                homeId={home.id}
                homeCode={home.code}
                homeName={home.name}
                location={home.location}
                market={home.market}
              >
                <button className="text-xs text-primary underline hover:text-primary/80 transition-colors text-left mt-1">
                  {activity.homeCode}
                  {activity.homeName && (
                    <span className="text-muted-foreground"> • {activity.homeName}</span>
                  )}
                </button>
              </HomeInfoSheet>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                {activity.homeCode} {activity.homeName && `• ${activity.homeName}`}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-3">
            {/* Activity Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 px-1">
                  
                  Activity Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activity.description && (
                  <div className="flex flex-col">
                    <p className="text-xs font-medium">{activity.description}</p>
                  </div>
                )}
                
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Scheduled Time</p>
                      <p className="font-medium text-xs">{formatTimeRange(activity.scheduledTime, activity.endTime)}</p>
                    </div>
                  </div>
                  
                  {activity.assignedTo && (
                    <div className="flex items-start gap-2">
                      <User className="h-3 w-3 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Assigned To</p>
                        <p className="text-xs font-medium">{activity.assignedTo}</p>
                      </div>
                    </div>
                  )}
                </div>

                {activity.status === "to-start" && home && (
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={() => setShowConfirmation(true)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Start Activity
                  </Button>
                )}

                {/* Task Preview Button */}
                <TaskPreviewSheet 
                  activityType={activity.type as ActivityType}
                  activityName={typeConfig.label}
                >
                  <Button variant="outline" className="w-full gap-2">
                    <List className="h-4 w-4" />
                    Preview all {typeConfig.label} tasks
                  </Button>
                </TaskPreviewSheet>
              </CardContent>
            </Card>

            {/* Home Information */}
            {home && (
              <HomeInformationCard home={home} />
            )}

            {/* Booking Information */}
            {booking && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 px-1">
    
                    Booking Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-muted-foreground">Booking ID:</p>
                      <p className="text-xs font-semibold">{booking.bookingId}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-muted-foreground">Guest:</p>
                      <p className="text-xs font-medium">{booking.guestName}</p>
                    </div>
                    <div className="grid gap-1 grid-cols-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Check-in</p>
                        <p className="text-xs font-medium">
                          {booking.checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Check-out</p>
                        <p className="text-xs font-medium">
                          {booking.checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`/bookings/${booking.id}`}>View Booking Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Entry Codes - shown if booking has entry codes */}
            {bookingNotes?.entryCodes && (
              <EntryCodesCard entryCodes={bookingNotes.entryCodes} />
            )}

            {/* Field Staff Notes - shown if booking has notes */}
            {bookingNotes && (
              <BookingNotesCard notes={bookingNotes} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="px-1">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
               
                {home && (
                  <ReportIssueButton
                    homeId={home.id}
                    homeCode={home.code}
                    homeName={home.name}
                    activityId={activity.id}
                    breadcrumbs={breadcrumbs}
                    variant="destructive"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

        {/* Pre-Activity Confirmation Modal */}
        {home && (
          <PreActivityConfirmationModal
            open={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            onConfirm={() => {
              setShowConfirmation(false)
              router.push(`/homes/${home.id}/activities/${activityTypeToTemplateType[activity.type]}/track${activity.bookingId ? `?bookingId=${activity.bookingId}` : ''}`)
            }}
            homeCode={home.code}
            homeName={home.name}
            entryCodes={bookingNotes?.entryCodes}
          />
        )}
      </div>
    </div>
  )
}
