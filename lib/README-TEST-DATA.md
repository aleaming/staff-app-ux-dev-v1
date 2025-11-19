# Test Data Documentation

This directory contains comprehensive test data for the onefinestay Staff App.

## File: `test-data.ts`

### Overview
The test data file provides mock data for all major entities in the application:
- **Homes** - Property listings with status, location, and booking information
- **Bookings** - Guest reservations with check-in/check-out dates
- **Activities** - Tasks assigned to staff (Provisioning, Meet & Greet, Turn, Deprovision, Ad-hoc)
- **Notifications** - Messages, alerts, and activity updates
- **Recent Items** - Recently accessed homes, bookings, and activities

### Data Structure

#### Homes
Each home includes:
- `id`: Unique identifier
- `code`: Property code (e.g., "COS285")
- `name`: Property name
- `address`: Street address
- `city`: City name
- `distance`: Distance from user location (km)
- `activeBookings`: Number of current bookings
- `pendingActivities`: Number of pending activities
- `status`: "occupied" | "available" | "maintenance"
- `coordinates`: Latitude/longitude
- `bedrooms`, `bathrooms`: Property details

#### Bookings
Each booking includes:
- `id`: Unique identifier
- `bookingId`: Booking reference (e.g., "BB-1AB2C3D4")
- `guestName`: Guest's name
- `guestEmail`, `guestPhone`: Contact information
- `homeCode`, `homeId`: Associated home
- `checkIn`, `checkOut`: Date range
- `status`: "upcoming" | "current" | "departure" | "completed"
- `numberOfGuests`: Guest count
- `specialRequests`: Any special requirements

#### Activities
Each activity includes:
- `id`: Unique identifier
- `type`: "provisioning" | "meet-greet" | "turn" | "deprovision" | "ad-hoc"
- `title`: Activity name
- `homeCode`, `homeName`: Associated home
- `bookingId`: Associated booking (optional)
- `scheduledTime`: When the activity is scheduled
- `status`: "pending" | "in-progress" | "completed" | "overdue"
- `priority`: "high" | "normal" (optional)
- `description`: Activity details
- `assignedTo`: Staff member assigned

#### Notifications
Each notification includes:
- `id`: Unique identifier
- `type`: "message" | "alert" | "activity-update"
- `title`: Notification title
- `message`: Notification content
- `timestamp`: When it was created
- `read`: Whether it's been read
- `link`: Optional link to related page
- `priority`: "high" | "normal" (optional)

### Helper Functions

The test data file includes several helper functions:

```typescript
// Get activities for a specific home
getActivitiesForHome(homeId: string): Activity[]

// Get activities for a specific booking
getActivitiesForBooking(bookingId: string): Activity[]

// Get bookings for a specific home
getBookingsForHome(homeId: string): Booking[]

// Get home by code
getHomeByCode(code: string): Home | undefined

// Get booking by booking ID
getBookingByBookingId(bookingId: string): Booking | undefined

// Get activity by ID
getActivityById(id: string): Activity | undefined

// Get unread notifications count
getUnreadNotificationsCount(): number

// Get activities due today
getActivitiesDueToday(): Activity[]

// Get upcoming bookings (next N days)
getUpcomingBookings(days?: number): Booking[]
```

### Usage Examples

#### Basic Import
```typescript
import { 
  testHomes, 
  testBookings, 
  testActivities, 
  testNotifications 
} from "@/lib/test-data"
```

#### Using in Components
```typescript
"use client"

import { testActivities } from "@/lib/test-data"
import { MyActivities } from "@/components/dashboard/MyActivities"

export default function DashboardPage() {
  return <MyActivities activities={testActivities} />
}
```

#### Using Helper Functions
```typescript
import { 
  getActivitiesForHome, 
  getBookingsForHome,
  getActivitiesDueToday 
} from "@/lib/test-data"

// Get all activities for a home
const homeActivities = getActivitiesForHome("home-1")

// Get all bookings for a home
const homeBookings = getBookingsForHome("home-1")

// Get today's activities
const todayActivities = getActivitiesDueToday()
```

#### Filtering Data
```typescript
import { testActivities } from "@/lib/test-data"

// Filter by status
const pendingActivities = testActivities.filter(
  a => a.status === "pending"
)

// Filter by type
const provisioningActivities = testActivities.filter(
  a => a.type === "provisioning"
)

// Filter by priority
const highPriorityActivities = testActivities.filter(
  a => a.priority === "high"
)
```

### Data Relationships

The test data maintains relationships between entities:

- **Home → Bookings**: Multiple bookings can be associated with one home
- **Booking → Activities**: Multiple activities can be associated with one booking
- **Home → Activities**: Activities can be directly associated with homes (ad-hoc activities)
- **Activity → Home**: All activities are linked to a home
- **Activity → Booking**: Activities can optionally be linked to a booking

### Date Handling

All dates in the test data are relative to the current time:
- `daysFromNow(n)`: Creates a date n days in the future
- `hoursFromNow(n)`: Creates a date n hours in the future
- `hoursAgo(n)`: Creates a date n hours in the past

This ensures the data is always relevant and up-to-date when the app runs.

### Integration with Components

Components are designed to accept data as props with fallback to test data:

```typescript
interface MyComponentProps {
  activities?: Activity[]
  isLoading?: boolean
}

export function MyComponent({ 
  activities = [], 
  isLoading = false 
}: MyComponentProps) {
  // Use provided activities or fall back to test data
  const displayActivities = activities.length > 0 
    ? activities 
    : testActivities
  
  // Component logic...
}
```

### Future Migration to API

When ready to connect to a real API:

1. Create API service functions that match the helper function signatures
2. Replace test data imports with API calls
3. Components will continue to work with the same data structure
4. Add loading and error states as needed

Example:
```typescript
// Before (test data)
import { testActivities } from "@/lib/test-data"
const activities = testActivities

// After (API)
import { fetchActivities } from "@/lib/api"
const activities = await fetchActivities()
```

