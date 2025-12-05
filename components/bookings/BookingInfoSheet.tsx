"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HomeInfoSheet } from "@/components/homes/HomeInfoSheet"
import { 
  Calendar, 
  User, 
  Mail, 
  Phone,
  Users,
  Home,
  Target,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import type { Booking, Home as HomeType, Activity } from "@/lib/test-data"

const statusConfig = {
  "upcoming": { label: "Pre-Stay", className: "bg-[#E2F0D9] text-green-900 border-[#E2F0D9] hover:bg-[#E2F0D9]" },
  "current": { label: "In-Stay", className: "bg-[#A7C58E] text-green-900 border-[#A7C58E] hover:bg-[#A7C58E]" },
  "departure": { label: "Post-Stay", className: "bg-[#AFABAB] text-gray-900 border-[#AFABAB] hover:bg-[#AFABAB]" },
  "completed": { label: "Completed", className: "bg-[#AFABAB] text-gray-900 border-[#AFABAB] hover:bg-[#AFABAB]" },
}

interface BookingInfoSheetProps {
  booking: Booking
  home?: HomeType
  activities?: Activity[]
  children: React.ReactNode
}

export function BookingInfoSheet({ 
  booking,
  home,
  activities = [],
  children
}: BookingInfoSheetProps) {
  const [open, setOpen] = useState(false)
  const statusInfo = statusConfig[booking.status]

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const bookingActivities = activities.filter(a => a.bookingId === booking.bookingId)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[calc(100vh-8rem)] max-h-[calc(100vh-4rem)]">
        <SheetHeader className="mb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {booking.bookingId}
            </SheetTitle>
            <Badge className={statusInfo.className}>
              {statusInfo.label}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pb-48">
          {/* Guest Information */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4" />
                Guest Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div>
                <p className="text-xs text-muted-foreground">Guest Name</p>
                <p className="font-semibold">{booking.guestName}</p>
              </div>
              
              {booking.guestEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs">{booking.guestEmail}</p>
                </div>
              )}

              {booking.guestPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs">{booking.guestPhone}</p>
                </div>
              )}

              {booking.numberOfGuests && (
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs">{booking.numberOfGuests} guests</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Dates */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Booking Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Check-in</p>
                  <p className="font-semibold text-sm">{formatDate(booking.checkIn)}</p>
                  <p className="text-xs text-muted-foreground">{getDaysUntil(booking.checkIn)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Check-out</p>
                  <p className="font-semibold text-sm">{formatDate(booking.checkOut)}</p>
                  <p className="text-xs text-muted-foreground">{getDaysUntil(booking.checkOut)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Home Information */}
          {home && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <HomeInfoSheet
                  homeId={home.id}
                  homeCode={home.code}
                  homeName={home.name}
                >
                  <button className="text-primary underline hover:text-primary/80 transition-colors text-left font-medium text-sm">
                    {home.code}
                    {home.name && (
                      <span> • {home.name}</span>
                    )}
                  </button>
                </HomeInfoSheet>
                <p className="text-xs text-muted-foreground mt-1">{home.address}, {home.city}</p>
              </CardContent>
            </Card>
          )}

          {/* Special Requests */}
          {booking.specialRequests && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Special Requests</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">{booking.specialRequests}</p>
              </CardContent>
            </Card>
          )}

          {/* Activities */}
          {bookingActivities.length > 0 && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Activities ({bookingActivities.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {bookingActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.scheduledTime.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <Badge variant={
                      activity.status === "to-start" ? "secondary" :
                      activity.status === "in-progress" ? "default" :
                      activity.status === "completed" ? "outline" : "secondary"
                    } className="text-xs">
                      {activity.status === "to-start" ? "To Start" :
                       activity.status === "in-progress" ? "In Progress" :
                       activity.status === "completed" ? "Completed" : activity.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* View Full Details Link */}
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/bookings/${booking.id}`} onClick={() => setOpen(false)}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Booking Details
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

