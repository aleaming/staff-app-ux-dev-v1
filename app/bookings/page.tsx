import { testBookings } from "@/lib/test-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, MapPin } from "lucide-react"
import Link from "next/link"

const statusConfig = {
  "upcoming": { label: "Upcoming", variant: "secondary" as const },
  "current": { label: "Current Stay", variant: "default" as const },
  "departure": { label: "Departing Soon", variant: "destructive" as const },
  "completed": { label: "Completed", variant: "outline" as const },
}

export default function BookingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Bookings</h1>
          <p className="text-muted-foreground">Browse all bookings</p>
        </div>

        <div className="flex flex-col gap-2">
          {testBookings.map((booking) => {
            const statusInfo = statusConfig[booking.status]

            return (
              <Link key={booking.id} href={`/bookings/${booking.id}`}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{booking.bookingId}</h3>
                          <Badge variant={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <User className="h-3 w-3" />
                          <span>{booking.guestName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <MapPin className="h-3 w-3" />
                          <span>{booking.homeCode}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {booking.checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {booking.checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          {booking.numberOfGuests && (
                            <span className="text-muted-foreground">
                              {booking.numberOfGuests} guest{booking.numberOfGuests !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

