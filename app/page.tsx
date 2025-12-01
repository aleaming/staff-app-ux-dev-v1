import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardMap } from "@/components/dashboard/DashboardMap"
import { MyActivities } from "@/components/dashboard/MyActivities"
import { RecentlyAccessed } from "@/components/dashboard/RecentlyAccessed"
import { BookingOverview } from "@/components/dashboard/BookingOverview"
import { NotificationsMessages } from "@/components/dashboard/NotificationsMessages"
import { 
  testActivities, 
  testHomes, 
  testBookings, 
  testNotifications,
  testRecentItems,
  getActivitiesDueToday,
  getUnreadNotificationsCount,
  getUpcomingBookings
} from "@/lib/test-data"

export default function Home() {
  // Calculate stats from test data
  const activitiesToday = getActivitiesDueToday().length
  const pendingMessages = getUnreadNotificationsCount()
  const upcomingBookings = getUpcomingBookings(7).length

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
          homes={testHomes} 
          activities={testActivities}
          latitude={51.5074}
          longitude={-0.1278}
          city="London"
        />

        {/* Main Dashboard Sections */}
        <MyActivities activities={testActivities} />
        <BookingOverview bookings={testBookings} />
        <NotificationsMessages notifications={testNotifications} />
        <RecentlyAccessed items={testRecentItems} />
      </div>
    </div>
  );
}

