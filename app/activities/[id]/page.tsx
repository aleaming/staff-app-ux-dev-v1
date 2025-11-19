import { notFound } from "next/navigation"
import { getActivityById, getHomeByCode, getBookingByBookingId } from "@/lib/test-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"
import { BackButton } from "@/components/navigation/BackButton"
import { ReportIssueButton } from "@/components/property/ReportIssueButton"
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
  CheckCircle2
} from "lucide-react"
import Link from "next/link"

const activityTypeConfig = {
  "provisioning": { label: "Provisioning", icon: Package, color: "bg-blue-500" },
  "meet-greet": { label: "Meet & Greet", icon: Handshake, color: "bg-green-500" },
  "turn": { label: "Turn", icon: RefreshCw, color: "bg-orange-500" },
  "deprovision": { label: "Deprovision", icon: X, color: "bg-red-500" },
  "ad-hoc": { label: "Ad-hoc", icon: AlertCircle, color: "bg-purple-500" },
}

// Map test-data activity types to template activity types
const activityTypeToTemplateType: Record<string, string> = {
  "provisioning": "provisioning",
  "meet-greet": "meet-greet",
  "turn": "turn",
  "deprovision": "deprovisioning",
  "ad-hoc": "adhoc",
}

const statusConfig = {
  "pending": { label: "Pending", variant: "secondary" as const },
  "in-progress": { label: "In Progress", variant: "default" as const },
  "completed": { label: "Completed", variant: "outline" as const },
  "overdue": { label: "Overdue", variant: "destructive" as const },
  "incomplete": { label: "Incomplete", variant: "default" as const },
}

interface ActivityDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const { id } = await params
  const activity = getActivityById(id)

  if (!activity) {
    notFound()
  }

  const home = getHomeByCode(activity.homeCode)
  const booking = activity.bookingId ? getBookingByBookingId(activity.bookingId) : null
  const typeConfig = activityTypeConfig[activity.type]
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

  // Build breadcrumbs based on whether activity has a booking
  const breadcrumbs = booking
    ? [
        { label: "Bookings", href: "/bookings" },
        { label: booking.bookingId, href: `/bookings/${booking.id}` },
        { label: activity.title }
      ]
    : [
        { label: "Activities", href: "/activities" },
        { label: activity.title }
      ]

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Header */}
        <div className="flex items-start gap-4">
          
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">{activity.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {activity.homeCode} {activity.homeName && `• ${activity.homeName}`}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            {activity.priority === "high" && (
              <Badge variant="destructive">High Priority</Badge>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${typeConfig.color} text-white`}>
                    <TypeIcon className="h-5 w-5" />
                  </div>
                  Activity Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activity.description && (
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{activity.description}</p>
                  </div>
                )}
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Scheduled Time</p>
                      <p className="font-medium text-sm">{formatDateTime(activity.scheduledTime)}</p>
                    </div>
                  </div>
                  
                  {activity.assignedTo && (
                    <div className="flex items-start gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned To</p>
                        <p className="text-sm font-medium">{activity.assignedTo}</p>
                      </div>
                    </div>
                  )}
                </div>

                {activity.status === "pending" && home && (
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/homes/${home.id}/activities/${activityTypeToTemplateType[activity.type]}/track${activity.bookingId ? `?bookingId=${activity.bookingId}` : ''}`}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Start Activity
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Home Information */}
            {home && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Home Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold">{home.code}</h3>
                      {home.name && <p className="text-sm text-muted-foreground">{home.name}</p>}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="text-sm font-medium">{home.address}, {home.city}</p>
                    </div>
                    {home.distance !== undefined && (
                      <div>
                        <p className="text-sm text-muted-foreground">Distance</p>
                        <p className="text-sm ont-medium">{home.distance.toFixed(1)} km away</p>
                      </div>
                    )}
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`/homes/${home.id}`}>View Home Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Booking Information */}
            {booking && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Booking Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Booking ID</p>
                      <p className="text-sm font-semibold">{booking.bookingId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Guest</p>
                      <p className="text-sm font-medium">{booking.guestName}</p>
                    </div>
                    <div className="grid gap-1 grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Check-in</p>
                        <p className="text-sm font-medium">
                          {booking.checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Check-out</p>
                        <p className="text-sm font-medium">
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
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
    </div>
  )
}

