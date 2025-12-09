"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CLOSE_ALL_SHEETS_EVENT } from "@/lib/sheet-utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HomeInfoSheet } from "@/components/homes/HomeInfoSheet"
import { useData } from "@/lib/data/DataProvider"
import { 
  Calendar, 
  User, 
  Mail, 
  Phone,
  Users,
  Home,
  FileText,
  Target
} from "lucide-react"
import Link from "next/link"

const statusConfig = {
  "upcoming": { label: "Pre-Stay", className: "bg-[#E2F0D9] text-green-900 border-[#E2F0D9]" },
  "current": { label: "In-Stay", className: "bg-[#A7C58E] text-green-900 border-[#A7C58E]" },
  "departure": { label: "Post-Stay", className: "bg-[#AFABAB] text-gray-900 border-[#AFABAB]" },
  "completed": { label: "Completed", className: "bg-[#AFABAB] text-gray-900 border-[#AFABAB]" },
}

interface BookingInfoSheetProps {
  bookingId: string
  children: React.ReactNode
}

export function BookingInfoSheet({ 
  bookingId,
  children
}: BookingInfoSheetProps) {
  const [open, setOpen] = useState(false)
  const { homes, bookings, activities } = useData()

  // Close sheet when navigation occurs
  useEffect(() => {
    const handleClose = () => setOpen(false)
    window.addEventListener(CLOSE_ALL_SHEETS_EVENT, handleClose)
    return () => window.removeEventListener(CLOSE_ALL_SHEETS_EVENT, handleClose)
  }, [])

  const booking = bookings.find(b => b.bookingId === bookingId)
  const home = booking ? homes.find(h => h.code === booking.homeCode) : null
  const bookingActivities = booking ? activities.filter(a => a.bookingId === booking.bookingId) : []

  if (!booking) {
    return <>{children}</>
  }

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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[calc(92vh-8rem)] max-h-[calc(92vh-4rem)]">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span className="text-primary">{booking.bookingId}</span>
            <Badge className={statusInfo.className}>
              {statusInfo.label}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pb-6">
          {/* Guest Information */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Guest</p>
                  <p className="font-semibold">{booking.guestName}</p>
                </div>
              </div>
              
              {booking.guestEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm">{booking.guestEmail}</p>
                  </div>
                </div>
              )}

              {booking.guestPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm">{booking.guestPhone}</p>
                  </div>
                </div>
              )}

              {booking.numberOfGuests && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Number of Guests</p>
                    <p className="text-sm">{booking.numberOfGuests}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Dates */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Dates</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Check-in</p>
                  <p className="font-semibold">{formatDate(booking.checkIn)}</p>
                  <p className="text-xs text-muted-foreground">{getDaysUntil(booking.checkIn)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Check-out</p>
                  <p className="font-semibold">{formatDate(booking.checkOut)}</p>
                  <p className="text-xs text-muted-foreground">{getDaysUntil(booking.checkOut)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Home Info */}
          {home && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Home</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary">{home.code}</p>
                    {home.name && <p className="text-xs text-muted-foreground">{home.name}</p>}
                  </div>
                  <HomeInfoSheet
                    homeId={home.id}
                    homeCode={home.code}
                    homeName={home.name}
                  >
                    <Button variant="outline" size="sm">
                      View Home
                    </Button>
                  </HomeInfoSheet>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Special Requests */}
          {booking.specialRequests && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Special Requests</p>
                <p className="text-sm">{booking.specialRequests}</p>
              </CardContent>
            </Card>
          )}

          {/* Activities */}
          {bookingActivities.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Activities ({bookingActivities.length})</span>
                </div>
                <div className="space-y-2">
                  {bookingActivities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.scheduledTime.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.status === "to-start" ? "To Start" :
                         activity.status === "in-progress" ? "In Progress" :
                         activity.status === "completed" ? "Completed" : activity.status}
                      </Badge>
                    </div>
                  ))}
                  {bookingActivities.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{bookingActivities.length - 3} more activities
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* View Full Details Button */}
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/bookings/${booking.id}`} onClick={() => setOpen(false)}>
              View Full Booking Details
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

