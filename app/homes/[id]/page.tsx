import { notFound } from "next/navigation"
import { testHomes, getBookingsForHome, getActivitiesForHome } from "@/lib/test-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export default async function HomeDetailPage({ params }: HomeDetailPageProps) {
  const { id } = await params
  const home = testHomes.find(h => h.id === id)

  if (!home) {
    notFound()
  }

  const bookings = getBookingsForHome(id)
  const activities = getActivitiesForHome(id)
  const statusInfo = statusConfig[home.status]

  const breadcrumbs = [
    { label: "Homes", href: "/homes" },
    { label: home.code }
  ]

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Header */}
        <div className="flex items-start gap-4">
         
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{home.code}</h1>
            {home.name && <p className="text-muted-foreground mt-1">{home.name}</p>}
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>

        <div className="space-y-6">
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
                    Bookings ({bookings.length})
                  </TabsTrigger>
                  <TabsTrigger value="activities">
                    Activities ({activities.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="bookings" className="space-y-4 mt-4">
                  {bookings.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No bookings for this home</p>
                      </CardContent>
                    </Card>
                  ) : (
                    bookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Link href={`/bookings/${booking.id}`}>
                                <h3 className="font-semibold hover:underline">{booking.bookingId}</h3>
                              </Link>
                              <p className="text-sm text-muted-foreground">{booking.guestName}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm">
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
                  {activities.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Target className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No activities for this home</p>
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
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
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

