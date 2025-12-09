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
import { HomeEssentials } from "@/components/homes/HomeEssentials"
import { HomeAccess } from "@/components/homes/HomeAccess"
import { HomeRules } from "@/components/homes/HomeRules"
import { HomeMedia } from "@/components/homes/HomeMedia"
import { PropertyBrowser } from "@/components/property/PropertyBrowser"
import { HomeActivitiesSheet } from "@/components/homes/HomeActivitiesSheet"
import { ReportIssueButton } from "@/components/property/ReportIssueButton"
import { 
  Calendar, 
  Target,
  Navigation
} from "lucide-react"
import Link from "next/link"

const statusConfig = {
  "occupied": { label: "Occupied", variant: "default" as const, color: "bg-green-500" },
  "available": { label: "Available", variant: "secondary" as const, color: "bg-gray-500" },
  "maintenance": { label: "Maintenance", variant: "destructive" as const, color: "bg-orange-500" },
}

interface HomeDetailPageProps {
  params: Promise<{ id: string }>
}

function HomeDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="space-y-4">
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

function HomeNotFound() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Home Not Found</h1>
      <p className="text-muted-foreground mb-6">The home you are looking for does not exist or has been removed.</p>
      <Link href="/catalog?tab=homes">
        <Button>Go to Homes Catalog</Button>
      </Link>
    </div>
  )
}

export default function HomeDetailPage({ params }: HomeDetailPageProps) {
  const { id } = use(params)
  const { homes, bookings, activities, isLoading } = useData()

  if (isLoading) {
    return <HomeDetailSkeleton />
  }

  const home = homes.find(h => h.id === id)

  if (!home) {
    return <HomeNotFound />
  }

  const homeBookings = bookings.filter(b => b.homeCode === home.code)
  const homeActivities = activities.filter(a => a.homeCode === home.code)
  const statusInfo = statusConfig[home.status]

  const breadcrumbs = [
    { label: "Homes", href: "/catalog?tab=homes" },
    { label: home.code }
  ]

  return (
    <div className="container mx-auto px-4 py-4 md:py-4">
      <div className="space-y-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h1 className="text-lg font-bold">
              <span className="text-primary">{home.code}</span>
              {home.name && (
                <span className="text-muted-foreground ml-2">• {home.name}</span>
              )}
            </h1>
          </div>
        </div>

        <div className="space-y-4">
          {/* Home Activities CTA */}
          <HomeActivitiesSheet 
            homeId={home.id} 
            homeCode={home.code} 
            homeName={home.name} 
          />

          {/* Main Tabs: Browse, Access, Essentials, Rules, Media */}
          <Tabs defaultValue="essentials" className="w-full">
            <div className="sticky top-16 z-40 pb-0 mb-6 -mx-4 px-4">
              <TabsList className="grid w-full grid-cols-5 shadow-lg">
                <TabsTrigger value="browse">Browse</TabsTrigger>
                <TabsTrigger value="access">Access</TabsTrigger>
                <TabsTrigger value="essentials">Essentials</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="browse" className="mt-6">
              <PropertyBrowser homeId={home.id} homeCode={home.code} homeName={home.name} />
            </TabsContent>

            <TabsContent value="access" className="mt-6">
              <HomeAccess homeCode={home.code} />
            </TabsContent>

            <TabsContent value="essentials" className="mt-6">
              <HomeEssentials homeCode={home.code} />
            </TabsContent>

            <TabsContent value="rules" className="mt-6">
              <HomeRules homeCode={home.code} />
            </TabsContent>

            <TabsContent value="media" className="mt-6">
              <HomeMedia homeCode={home.code} />
            </TabsContent>
          </Tabs>

          {/* Additional Info Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Tabs defaultValue="bookings" className="w-full">
                <TabsList>
                  <TabsTrigger value="bookings">
                    Bookings ({homeBookings.length})
                  </TabsTrigger>
                  <TabsTrigger value="activities">
                    Activities ({homeActivities.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="bookings" className="space-y-4 mt-4">
                  {homeBookings.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground">No bookings for this home</p>
                      </CardContent>
                    </Card>
                  ) : (
                    homeBookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Link href={`/bookings/${booking.id}`}>
                                <h3 className="text-xl font-semibold hover:underline">{booking.bookingId}</h3>
                              </Link>
                              <p className="text-xs text-muted-foreground">{booking.guestName}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs">
                                <span>
                                  Check-in: {booking.checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                <span>
                                  Check-out: {booking.checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            </div>
                            <Badge variant={booking.status === "current" ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="activities" className="space-y-4 mt-4">
                  {homeActivities.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Target className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground">No activities for this home</p>
                      </CardContent>
                    </Card>
                  ) : (
                    homeActivities.map((activity) => {
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
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                  <ReportIssueButton
                    homeId={home.id}
                    homeCode={home.code}
                    homeName={home.name}
                    breadcrumbs={breadcrumbs}
                    variant="outline"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

