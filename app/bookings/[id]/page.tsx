"use client"

import { use } from "react"
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
  "upcoming": { label: "Pre-Stay", className: "bg-[#E2F0D9] text-green-900 border-[#E2F0D9] hover:bg-[#E2F0D9]" },
  "current": { label: "In-Stay", className: "bg-[#A7C58E] text-green-900 border-[#A7C58E] hover:bg-[#A7C58E]" },
  "departure": { label: "Post-Stay", className: "bg-[#AFABAB] text-gray-900 border-[#AFABAB] hover:bg-[#AFABAB]" },
  "completed": { label: "Completed", className: "bg-[#AFABAB] text-gray-900 border-[#AFABAB] hover:bg-[#AFABAB]" },
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
  const { homes, bookings, activities, isLoading } = useData()

  if (isLoading) {
    return <BookingDetailSkeleton />
  }

  const booking = bookings.find(b => b.id === id)

  if (!booking) {
    return <BookingNotFound />
  }

  const home = homes.find(h => h.code === booking.homeCode)
  const bookingActivities = activities.filter(a => a.bookingId === booking.bookingId)
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
                <TabsTrigger value="home">Home</TabsTrigger>
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
                      <div className="flex items-center gap-1">
                        <Home className="h-3 w-3 text-foreground" />
                        <div className="flex items-center gap-1">
                          
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
                      </div>
                    )}
                  </CardContent>
                </Card>

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

              <TabsContent value="activities" className="space-y-4">
                {bookingActivities.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Target className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">No activities for this booking</p>
                    </CardContent>
                  </Card>
                ) : (
                  bookingActivities.map((activity) => {
                    const startStr = activity.scheduledTime.toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })
                    const endStr = activity.endTime?.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })
                    return (
                    <Card key={activity.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Link href={`/activities/${activity.id}`}>
                              <h3 className="text-xl font-semibold hover:underline">{activity.title}</h3>
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              {endStr ? `${startStr} – ${endStr}` : startStr}
                            </p>
                          </div>
                          <Badge variant={
                            activity.status === "to-start" ? "secondary" :
                            activity.status === "in-progress" ? "default" :
                            activity.status === "paused" ? "secondary" :
                            activity.status === "completed" ? "outline" :
                            activity.status === "cancelled" ? "outline" :
                            activity.status === "ignored" ? "outline" : "destructive"
                          }>
                            {activity.status === "to-start" ? "To Start" :
                             activity.status === "in-progress" ? "In Progress" :
                             activity.status === "paused" ? "Paused" :
                             activity.status === "abandoned" ? "Abandoned" :
                             activity.status === "completed" ? "Completed" :
                             activity.status === "ignored" ? "Ignored" : "Cancelled"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    )
                  })
                )}
              </TabsContent>

              <TabsContent value="home" className="space-y-4">
                {home ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-xl">{home.code}</h3>
                          {home.name && <p className="text-xs text-muted-foreground">{home.name}</p>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <p>{home.address}, {home.city}</p>
                        </div>
                        {home.distance !== undefined && (
                          <div>
                            <p className="text-xs text-muted-foreground">Distance</p>
                            <p className="font-medium text-xs">{home.distance.toFixed(1)} km away</p>
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
                      <p className="text-xs text-muted-foreground">Home information not available</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

