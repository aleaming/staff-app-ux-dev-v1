import { notFound } from "next/navigation"
import { testBookings, getHomeByCode, getActivitiesForBooking } from "@/lib/test-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"
import { BackButton } from "@/components/navigation/BackButton"
import { HomeActivitiesSheet } from "@/components/homes/HomeActivitiesSheet"
import { 
  Calendar, 
  User, 
  Mail, 
  Phone,
  MapPin,
  Users,
  Target,
  Home
} from "lucide-react"
import Link from "next/link"

const statusConfig = {
  "upcoming": { label: "Upcoming", variant: "secondary" as const },
  "current": { label: "Current Stay", variant: "default" as const },
  "departure": { label: "Departing Soon", variant: "destructive" as const },
  "completed": { label: "Completed", variant: "outline" as const },
}

interface BookingDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = await params
  const booking = testBookings.find(b => b.id === id)

  if (!booking) {
    notFound()
  }

  const home = getHomeByCode(booking.homeCode)
  const activities = getActivitiesForBooking(booking.bookingId)
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
    { label: "Bookings", href: "/bookings" },
    { label: booking.bookingId }
  ]

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Header */}
        <div className="flex items-start gap-4">
          <BackButton href="/bookings" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{booking.bookingId}</h1>
            <p className="text-muted-foreground mt-1">{booking.guestName}</p>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="activities">
                  Activities ({activities.length})
                </TabsTrigger>
                <TabsTrigger value="home">Home</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                {/* Guest Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Guest Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Guest Name</p>
                      <p className="font-semibold text-lg">{booking.guestName}</p>
                    </div>
                    
                    {booking.guestEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{booking.guestEmail}</p>
                        </div>
                      </div>
                    )}

                    {booking.guestPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{booking.guestPhone}</p>
                        </div>
                      </div>
                    )}

                    {booking.numberOfGuests && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Number of Guests</p>
                          <p className="font-medium">{booking.numberOfGuests}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Booking Dates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Booking Dates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Check-in</p>
                        <p className="font-semibold text-lg">{formatDate(booking.checkIn)}</p>
                        <p className="text-sm text-muted-foreground mt-1">{getDaysUntil(booking.checkIn)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Check-out</p>
                        <p className="font-semibold text-lg">{formatDate(booking.checkOut)}</p>
                        <p className="text-sm text-muted-foreground mt-1">{getDaysUntil(booking.checkOut)}</p>
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
                      <p className="text-muted-foreground">{booking.specialRequests}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="activities" className="space-y-4">
                {activities.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Target className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No activities for this booking</p>
                    </CardContent>
                  </Card>
                ) : (
                  activities.map((activity) => (
                    <Card key={activity.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Link href={`/activities/${activity.id}`}>
                              <h3 className="font-semibold hover:underline">{activity.title}</h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {activity.scheduledTime.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <Badge variant={
                            activity.status === "pending" ? "secondary" :
                            activity.status === "in-progress" ? "default" :
                            activity.status === "completed" ? "outline" : "destructive"
                          }>
                            {activity.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="home" className="space-y-4">
                {home ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{home.code}</h3>
                          {home.name && <p className="text-muted-foreground">{home.name}</p>}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <p>{home.address}, {home.city}</p>
                        </div>
                        {home.distance !== undefined && (
                          <div>
                            <p className="text-sm text-muted-foreground">Distance</p>
                            <p className="font-medium">{home.distance.toFixed(1)} km away</p>
                          </div>
                        )}
                        <Button variant="outline" asChild className="w-full">
                          <Link href={`/homes/${home.id}`}>
                            <Home className="h-4 w-4 mr-2" />
                            View Home Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Home className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Home information not available</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
          </div>
        </div>
      </div>
    </div>
  )
}

