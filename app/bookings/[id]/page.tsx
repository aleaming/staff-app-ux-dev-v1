"use client"

import { use, useState } from "react"
import { useData } from "@/lib/data/DataProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"
import { BackButton } from "@/components/navigation/BackButton"
import { HomeActivitiesSheet } from "@/components/homes/HomeActivitiesSheet"
import { HomeInfoSheet } from "@/components/homes/HomeInfoSheet"
import { BookingNotesCard } from "@/components/bookings/BookingNotesCard"
import { EntryCodesCard } from "@/components/bookings/EntryCodesCard"
import { MapSheet } from "@/components/map/MapSheet"
import { 
  Calendar, 
  User, 
  Mail, 
  Phone,
  MapPin,
  Users,
  Target,
  Home,
  Clock,
  ChevronRight
} from "lucide-react"
import Link from "next/link"

const statusConfig = {
  "upcoming": { label: "Pre-Stay", className: "bg-booking-pre-stay text-neutral-700 border-booking-pre-stay hover:bg-booking-pre-stay" },
  "current": { label: "In-Stay", className: "bg-booking-in-stay text-neutral-700 border-booking-in-stay hover:bg-booking-in-stay" },
  "departure": { label: "Post-Stay", className: "bg-booking-post-stay text-neutral-700 border-booking-post-stay hover:bg-booking-post-stay" },
  "completed": { label: "Completed", className: "bg-booking-completed text-neutral-700 border-booking-completed hover:bg-booking-completed" },
}

// Activity type colors matching CSS variables from globals.css
const activityTypeConfig: Record<string, { label: string; color: string }> = {
  // Home preparation
  "provisioning": { label: "Provisioning", color: "var(--activity-provisioning)" },
  "deprovisioning": { label: "Deprovisioning", color: "var(--activity-deprovision)" },
  "turn": { label: "Turn", color: "var(--activity-turn)" },
  "maid-service": { label: "Maid Service", color: "var(--activity-maid)" },
  "mini-maid": { label: "Mini-Maid", color: "var(--activity-mini-maid)" },
  "touch-up": { label: "Touch-Up", color: "var(--activity-touch-up)" },
  "quality-check": { label: "Quality Check", color: "var(--activity-quality-check)" },
  // Guest welcoming
  "meet-greet": { label: "Meet & Greet", color: "var(--activity-greet)" },
  "additional-greet": { label: "Additional Greet", color: "var(--activity-additional-greet)" },
  "bag-drop": { label: "Bag Drop", color: "var(--activity-bag-drop)" },
  "service-recovery": { label: "Service Recovery", color: "var(--activity-service-recovery)" },
  "home-viewing": { label: "Home Viewing", color: "var(--activity-home-viewing)" },
  // Other
  "adhoc": { label: "Ad-hoc", color: "var(--activity-adhoc)" },
}

const activityStatusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  "to-start": { label: "To Start", variant: "secondary" },
  "in-progress": { label: "In Progress", variant: "default" },
  "paused": { label: "Paused", variant: "secondary" },
  "completed": { label: "Completed", variant: "outline" },
  "abandoned": { label: "Abandoned", variant: "destructive" },
  "cancelled": { label: "Cancelled", variant: "outline" },
  "ignored": { label: "Ignored", variant: "outline" },
}

interface BookingDetailPageProps {
  params: Promise<{ id: string }>
}

function BookingDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="space-y-6">
        <Skeleton className="h-6 w-48" />
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-1" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}

function BookingNotFound() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
      <p className="text-muted-foreground mb-6">The booking you are looking for does not exist or has been removed.</p>
      <Link href="/catalog?tab=bookings">
        <Button>Go to Bookings Catalog</Button>
      </Link>
    </div>
  )
}

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = use(params)
  const { homes, bookings, activities, bookingNotes, isLoading } = useData()
  const [mapSheetOpen, setMapSheetOpen] = useState(false)

  if (isLoading) {
    return <BookingDetailSkeleton />
  }

  const booking = bookings.find(b => b.id === id)

  if (!booking) {
    return <BookingNotFound />
  }

  const home = homes.find(h => h.code === booking.homeCode)
  const bookingActivities = activities.filter(a => a.bookingId === booking.bookingId)
  const notes = bookingNotes.find(n => n.bookingRef === booking.bookingId)
  const statusInfo = statusConfig[booking.status]

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysUntil = (date: Date) => {
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const days = Math.ceil(diffMs / (24 * 60 * 60 * 1000))
    if (days === 0) return "Today"
    if (days === 1) return "Tomorrow"
    if (days < 0) return `${Math.abs(days)} days ago`
    return `In ${days} days`
  }

  const breadcrumbs = [
    { label: "Bookings", href: "/catalog?tab=bookings" },
    { label: booking.bookingId }
  ]

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

       

        <div className="space-y-3">
          {/* Main Content */}
          <div className="space-y-3 w-full">
            <Tabs defaultValue="details" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="activities">
                  Activities ({bookingActivities.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-3">
                {/* Guest Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                     
                      Guest Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">

                      <p className="text-xs text-muted-foreground">Guest Name</p>
                      <p className="font-semibold text-sm">{booking.guestName}</p>
                 
                    
                    {booking.guestEmail && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="font-medium text-xs">{booking.guestEmail}</p>
                        </div>
                      </div>
                    )}

                    {booking.guestPhone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="font-medium text-xs">{booking.guestPhone}</p>
                        </div>
                      </div>
                    )}

                    {booking.numberOfGuests && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Number of Guests</p>
                          <p className="font-medium text-xs">{booking.numberOfGuests}</p>
                        </div>
                      </div>
                    )}

                    {home && (
                      <>
                        <div className="flex items-center gap-1">
                          <Home className="h-3 w-3 text-foreground shrink-0" />
                          <HomeInfoSheet
                            homeId={home.id}
                            homeCode={home.code}
                            homeName={home.name}
                            location={home.location}
                            market={home.market}
                          >
                            <button className="text-primary underline hover:text-primary/80 transition-colors text-left font-medium text-xs">
                              {home.code}
                              {home.name && (
                                <span> • {home.name}</span>
                              )}
                            </button>
                          </HomeInfoSheet>
                        </div>
                        {(home.address || home.city) && (
                          <button
                            onClick={() => setMapSheetOpen(true)}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors text-left"
                          >
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="underline">{home.address}{home.address && home.city && ', '}{home.city}</span>
                          </button>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Entry Codes */}
                {notes?.entryCodes && <EntryCodesCard entryCodes={notes.entryCodes} />}

                {/* Field Staff Notes */}
                {notes && <BookingNotesCard notes={notes} />}

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {home && (
                      <>
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link href={`/homes/${home.id}`}>
                            <Home className="h-4 w-4 mr-2" />
                            View Home
                          </Link>
                        </Button>
                        <HomeActivitiesSheet 
                          homeId={home.id} 
                          homeCode={home.code} 
                          homeName={home.name}
                          variant="quick-action"
                          buttonText="Create Activity"
                        />
                      </>
                    )}
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Guest
                    </Button>
                  </CardContent>
                </Card>

                {/* Booking Dates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      
                      Booking Dates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Check-in</p>
                        <p className="font-semibold text-sm">{formatDate(booking.checkIn)}</p>
                        <p className="text-xs text-muted-foreground mt-1 text-red-500">{getDaysUntil(booking.checkIn)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Check-out</p>
                        <p className="font-semibold text-sm">{formatDate(booking.checkOut)}</p>
                        <p className="text-xs text-muted-foreground mt-1 text-red-500">{getDaysUntil(booking.checkOut)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Special Requests */}
                {booking.specialRequests && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Special Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">{booking.specialRequests}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="activities" className="space-y-3">
                {bookingActivities.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Target className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">No activities for this booking</p>
                    </CardContent>
                  </Card>
                ) : (
                  bookingActivities.map((activity) => {
                    const typeConfig = activityTypeConfig[activity.type] || activityTypeConfig["adhoc"]
                    const statusInfo = activityStatusConfig[activity.status] || activityStatusConfig["to-start"]
                    
                    const formatDate = (date: Date) => {
                      return date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })
                    }
                    
                    const formatTime = (date: Date) => {
                      return date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })
                    }
                    
                    return (
                      <Card 
                        key={activity.id}
                        className="overflow-hidden border-l-[6px] hover:bg-muted/50 transition-colors"
                        style={{ borderLeftColor: typeConfig.color }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            {/* Left: Title and Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg">{typeConfig.label}</h3>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(activity.scheduledTime)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(activity.scheduledTime)}
                                  {activity.endTime && ` – ${formatTime(activity.endTime)}`}
                                </span>
                              </div>
                              {activity.description && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                  {activity.description}
                                </p>
                              )}
                            </div>

                            {/* Right: Status and View button */}
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              <Badge variant={statusInfo.variant}>
                                {statusInfo.label}
                              </Badge>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                asChild
                              >
                                <Link href={`/activities/${activity.id}`}>
                                  View
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </div>

      {/* Map Sheet for directions */}
      {home && (
        <MapSheet
          open={mapSheetOpen}
          onOpenChange={setMapSheetOpen}
          homeCode={home.code}
          homeName={home.name}
          address={home.address}
          city={home.city}
          location={home.location}
          market={home.market}
          coordinates={home.coordinates}
        />
      )}
    </div>
  )
}

