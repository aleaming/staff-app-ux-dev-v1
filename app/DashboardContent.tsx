"use client"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardMap } from "@/components/dashboard/DashboardMap"
import { MyActivities } from "@/components/dashboard/MyActivities"
import { RecentlyAccessed } from "@/components/dashboard/RecentlyAccessed"
import { BookingOverview } from "@/components/dashboard/BookingOverview"
import { NotificationsMessages } from "@/components/dashboard/NotificationsMessages"
import { useData } from "@/lib/data/DataProvider"
import { 
  testNotifications,
  testRecentItems,
} from "@/lib/test-data"
import { Skeleton } from "@/components/ui/skeleton"

function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-3 md:px-4 py-3 sm:py-4 md:py-6 lg:py-8 w-full max-w-full">
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        
        {/* Map skeleton */}
        <Skeleton className="h-64 w-full rounded-lg" />
        
        {/* Activities skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardContent() {
  const { homes, bookings, activities, isLoading } = useData()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  // Calculate stats from loaded data
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const activitiesToday = activities.filter(a => {
    const activityDate = new Date(a.scheduledTime)
    activityDate.setHours(0, 0, 0, 0)
    return activityDate.getTime() === today.getTime()
  }).length

  const pendingMessages = testNotifications.filter(n => !n.read).length
  
  const futureDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const upcomingBookings = bookings.filter(b => {
    const checkIn = new Date(b.checkIn)
    return checkIn >= today && checkIn <= futureDate && b.status === "upcoming"
  }).length

  const stats = {
    activitiesToday,
    pendingMessages,
    upcomingBookings
  }

  return (
    <div className="container mx-auto px-4 sm:px-3 md:px-4 py-3 sm:py-4 md:py-6 lg:py-8 w-full max-w-full">
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header Section */}
        <DashboardHeader 
          userName="Alex" 
          stats={stats}
        />

        {/* Weather & Map Section */}
        <DashboardMap 
          homes={homes} 
          activities={activities}
          latitude={51.5074}
          longitude={-0.1278}
          city="London"
        />

        {/* Main Dashboard Sections */}
        <MyActivities activities={activities} />
        <BookingOverview bookings={bookings} />
        <NotificationsMessages notifications={testNotifications} />
        <RecentlyAccessed items={testRecentItems} />
      </div>
    </div>
  )
}

