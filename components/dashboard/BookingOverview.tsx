"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { testBookings, testHomes } from "@/lib/test-data"
import { Calendar, Users, LogOut, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MapSheet } from "@/components/map/MapSheet"

export interface Booking {
  id: string
  bookingId: string
  guestName: string
  homeCode: string
  checkIn: Date
  checkOut: Date
  status: "upcoming" | "current" | "departure" | "completed"
}

interface BookingOverviewProps {
  bookings?: Booking[]
  isLoading?: boolean
}

export function BookingOverview({ 
  bookings = [], 
  isLoading = false 
}: BookingOverviewProps) {
  const router = useRouter()
  const [mapSheetOpen, setMapSheetOpen] = useState(false)
  const [selectedHome, setSelectedHome] = useState<{
    code: string
    name?: string
    address: string
    city?: string
    coordinates?: { lat: number, lng: number }
  } | null>(null)
  
  // Use provided bookings or fall back to test data
  const now = new Date()
  const displayBookings: Booking[] = bookings.length > 0 ? bookings : testBookings

  const upcomingArrivals = displayBookings.filter(b => {
    const daysUntilCheckIn = Math.ceil((b.checkIn.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    return daysUntilCheckIn >= 0 && daysUntilCheckIn <= 7 && b.status === "upcoming"
  })

  const currentStays = displayBookings.filter(b => b.status === "current")

  const departures = displayBookings.filter(b => {
    const daysUntilCheckOut = Math.ceil((b.checkOut.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    return daysUntilCheckOut >= 0 && daysUntilCheckOut <= 7 && b.status === "departure"
  })

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getDaysUntil = (date: Date) => {
    const days = Math.ceil((date.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    if (days === 0) return "Today"
    if (days === 1) return "Tomorrow"
    if (days < 0) return `${Math.abs(days)} days ago`
    return `In ${days} days`
  }

  const handleShowMap = (e: React.MouseEvent, homeCode: string) => {
    e.stopPropagation()
    const home = testHomes.find(h => h.code === homeCode)
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
      <Card>
        <CardHeader>
          <CardTitle>Booking Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg break-words">Booking Overview</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/catalog?tab=bookings">View All</Link>
          </Button>
        </div>
          </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-4 sm:space-y-6">
          {/* Upcoming Arrivals */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Upcoming Arrivals (Next 7 Days)</h3>
                <Badge variant="secondary">{upcomingArrivals.length}</Badge>
              </div>
            </div>
            {upcomingArrivals.length === 0 ? (
              <p className="text-xs text-muted-foreground">No upcoming arrivals</p>
            ) : (
              <div className="flex flex-col gap-2">
                {upcomingArrivals.map((booking) => {
                  const home = testHomes.find(h => h.code === booking.homeCode)
                  return (
                    <Card 
                      key={booking.id} 
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/bookings/${booking.id}`)}
                    >
                      <CardContent className="p-2.5 sm:p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-xl font-semibold">{booking.bookingId}</p>
                            <p className="text-xs text-muted-foreground">
                              {booking.guestName} •{" "}
                              <Link
                                href={`/homes/${home?.id || booking.homeCode}`}
                                className="text-primary underline hover:text-primary/80 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {booking.homeCode}
                              </Link>
                            </p>
                            {home && (
                              <button
                                onClick={(e) => handleShowMap(e, booking.homeCode)}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mt-0.5"
                              >
                                <MapPin className="h-3 w-3" />
                                <span className="underline">{home.address}</span>
                              </button>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <p className="text-xs font-medium">{formatDate(booking.checkIn)}</p>
                            <p className="text-xs text-muted-foreground">
                              {getDaysUntil(booking.checkIn)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Current Stays */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Current Stays</h3>
                <Badge variant="secondary">{currentStays.length}</Badge>
              </div>
            </div>
            {currentStays.length === 0 ? (
              <p className="text-xs text-muted-foreground">No current stays</p>
            ) : (
              <div className="flex flex-col gap-2">
                {currentStays.map((booking) => {
                  const home = testHomes.find(h => h.code === booking.homeCode)
                  return (
                    <Card 
                      key={booking.id} 
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/bookings/${booking.id}`)}
                    >
                      <CardContent className="p-2.5 sm:p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{booking.bookingId}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.guestName} •{" "}
                              <Link
                                href={`/homes/${home?.id || booking.homeCode}`}
                                className="text-primary underline hover:text-primary/80 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {booking.homeCode}
                              </Link>
                            </p>
                            {home && (
                              <button
                                onClick={(e) => handleShowMap(e, booking.homeCode)}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mt-0.5"
                              >
                                <MapPin className="h-3 w-3" />
                                <span className="underline">{home.address}</span>
                              </button>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <p className="text-xs font-medium">Until {formatDate(booking.checkOut)}</p>
                            <p className="text-xs text-muted-foreground">
                              {getDaysUntil(booking.checkOut)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Departures */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Departures (Next 7 Days)</h3>
                <Badge variant="secondary">{departures.length}</Badge>
              </div>
            </div>
            {departures.length === 0 ? (
              <p className="text-xs text-muted-foreground">No departures scheduled</p>
            ) : (
              <div className="flex flex-col gap-2">
                {departures.map((booking) => {
                  const home = testHomes.find(h => h.code === booking.homeCode)
                  return (
                    <Card 
                      key={booking.id} 
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/bookings/${booking.id}`)}
                    >
                      <CardContent className="p-2.5 sm:p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{booking.bookingId}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.guestName} •{" "}
                              <Link
                                href={`/homes/${home?.id || booking.homeCode}`}
                                className="text-primary underline hover:text-primary/80 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {booking.homeCode}
                              </Link>
                            </p>
                            {home && (
                              <button
                                onClick={(e) => handleShowMap(e, booking.homeCode)}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mt-0.5"
                              >
                                <MapPin className="h-3 w-3" />
                                <span className="underline">{home.address}</span>
                              </button>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <p className="text-sm font-medium">{formatDate(booking.checkOut)}</p>
                            <p className="text-xs text-muted-foreground">
                              {getDaysUntil(booking.checkOut)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
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
    </Card>
  )
}

