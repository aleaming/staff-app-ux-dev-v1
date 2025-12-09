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

  return (
    <div className="container mx-auto px-4 sm:px-3 md:px-4 py-3 sm:py-4 md:py-6 lg:py-8 w-full max-w-full">
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header Section */}
        <DashboardHeader userName="Alex" />

        {/* Weather & Map Section */}
        <DashboardMap 
          homes={homes} 
          activities={activities}
          latitude={51.5074}
          longitude={-0.1278}
          city="London"
        />

        {/* Main Dashboard Sections */}
        <MyActivities activities={activities} bookings={bookings} homes={homes} />
        <BookingOverview bookings={bookings} />
        <NotificationsMessages notifications={testNotifications} />
        <RecentlyAccessed items={testRecentItems} />
      </div>
    </div>
  )
}

