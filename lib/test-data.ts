/**
 * Test Data for onefinestay Staff App
 * 
 * This file contains comprehensive test data for development and testing.
 * In production, this would be replaced with API calls.
 */

// ============================================================================
// TYPES
// ============================================================================

export type ActivityType = "provisioning" | "meet-greet" | "turn" | "deprovision" | "ad-hoc"
export type ActivityStatus = "pending" | "in-progress" | "completed" | "overdue" | "incomplete"
export type HomeStatus = "occupied" | "available" | "maintenance"
export type NotificationType = "message" | "alert" | "activity-update"
export type RecentItemType = "home" | "booking" | "activity"

export interface Activity {
  id: string
  type: ActivityType
  title: string
  homeCode: string
  homeName?: string
  bookingId?: string
  scheduledTime: Date
  status: ActivityStatus
  priority?: "high" | "normal"
  description?: string
  assignedTo?: string
}

export interface Damage {
  id: string
  description: string
  location: string
  severity: "minor" | "moderate" | "major"
  reportedDate: Date
  status: "open" | "in-progress" | "resolved"
  media?: { id: string; url: string; caption?: string; uploadedAt: Date }[]
}

export interface Home {
  id: string
  code: string
  name?: string
  address: string
  city: string
  distance?: number // in km
  activeBookings: number
  pendingActivities: number
  status: HomeStatus
  coordinates?: { lat: number; lng: number }
  bedrooms?: number
  bathrooms?: number
  damages?: Damage[]
}

export interface Booking {
  id: string
  bookingId: string
  guestName: string
  guestEmail?: string
  guestPhone?: string
  homeCode: string
  homeId: string
  checkIn: Date
  checkOut: Date
  status: "upcoming" | "current" | "departure" | "completed"
  numberOfGuests?: number
  specialRequests?: string
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
  link?: string
  priority?: "high" | "normal"
}

export interface RecentItem {
  id: string
  type: RecentItemType
  title: string
  subtitle?: string
  href: string
  accessedAt: Date
}

// ============================================================================
// PROPERTY HIERARCHY TYPES
// ============================================================================

export type PropertyNodeType = "unit" | "building" | "floor" | "room" | "item"
export type PropertyIssueType = "not-working" | "damaged" | "missing" | "needs-cleaning" | "other"
export type PropertyIssueStatus = "open" | "in-progress" | "resolved"
export type PropertyIssuePriority = "low" | "medium" | "high"

export interface PropertyHierarchyNode {
  id: string
  label: string
  type: PropertyNodeType
  icon?: string // lucide-react icon name
  metadata?: string // e.g., "x 2", "12 items"
  children?: PropertyHierarchyNode[]
  detailsUrl?: string
  instructions?: string
  photos?: { id: string; url: string; caption?: string }[]
  details?: Record<string, string> // key-value pairs like model number, last updated
  issueCount?: number // computed: total issues including children
  hasNotification?: boolean // computed: true if has issues
}

export interface PropertyIssue {
  id: string
  itemId: string
  reporterName: string
  reportedDate: Date
  description: string
  status: PropertyIssueStatus
  priority: PropertyIssuePriority
  type: PropertyIssueType
  photos?: { id: string; url: string; fileName?: string }[]
}

// ============================================================================
// TEST DATA GENERATION
// ============================================================================

const now = new Date()

// Helper to create dates relative to now
const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
const hoursFromNow = (hours: number) => new Date(now.getTime() + hours * 60 * 60 * 1000)
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000)

// ============================================================================
// HOMES DATA
// ============================================================================

export const testHomes: Home[] = [
  {
    id: "home-1",
    code: "COS285",
    name: "Cosmopolitan Suite",
    address: "123 Main Street",
    city: "London",
    distance: 0.5,
    activeBookings: 2,
    pendingActivities: 3,
    status: "occupied",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    bedrooms: 2,
    bathrooms: 2,
    damages: [
      {
        id: "damage-1",
        description: "Crack in bathroom mirror",
        location: "Master bathroom",
        severity: "minor",
        reportedDate: daysFromNow(-5),
        status: "open",
        media: []
      },
      {
        id: "damage-2",
        description: "Scratches on kitchen countertop",
        location: "Kitchen",
        severity: "moderate",
        reportedDate: daysFromNow(-3),
        status: "in-progress",
        media: []
      }
    ]
  },
  {
    id: "home-2",
    code: "APT123",
    name: "Apartment 123",
    address: "456 Park Avenue",
    city: "London",
    distance: 1.2,
    activeBookings: 1,
    pendingActivities: 1,
    status: "available",
    coordinates: { lat: 51.5155, lng: -0.0922 },
    bedrooms: 1,
    bathrooms: 1
  },
  {
    id: "home-3",
    code: "VIL789",
    name: "Villa 789",
    address: "789 Ocean Drive",
    city: "London",
    distance: 2.5,
    activeBookings: 0,
    pendingActivities: 5,
    status: "maintenance",
    coordinates: { lat: 51.4816, lng: -0.0484 },
    bedrooms: 3,
    bathrooms: 2
  },
  {
    id: "home-4",
    code: "STU456",
    name: "Studio 456",
    address: "321 Elm Street",
    city: "London",
    distance: 0.8,
    activeBookings: 1,
    pendingActivities: 0,
    status: "occupied",
    coordinates: { lat: 51.5099, lng: -0.1180 },
    bedrooms: 0,
    bathrooms: 1
  },
  {
    id: "home-5",
    code: "PEN901",
    name: "Penthouse 901",
    address: "100 Skyline Boulevard",
    city: "London",
    distance: 3.2,
    activeBookings: 0,
    pendingActivities: 2,
    status: "available",
    coordinates: { lat: 51.5045, lng: -0.0865 },
    bedrooms: 4,
    bathrooms: 3
  },
  {
    id: "home-6",
    code: "LOF234",
    name: "Loft 234",
    address: "567 Industrial Way",
    city: "London",
    distance: 1.8,
    activeBookings: 0,
    pendingActivities: 4,
    status: "maintenance",
    coordinates: { lat: 51.5236, lng: -0.0394 },
    bedrooms: 2,
    bathrooms: 1
  }
]

// ============================================================================
// BOOKINGS DATA
// ============================================================================

export const testBookings: Booking[] = [
  {
    id: "booking-1",
    bookingId: "BB-1AB2C3D4",
    guestName: "John Doe",
    guestEmail: "john.doe@example.com",
    guestPhone: "+44 20 1234 5678",
    homeCode: "COS285",
    homeId: "home-1",
    checkIn: daysFromNow(2),
    checkOut: daysFromNow(5),
    status: "upcoming",
    numberOfGuests: 2,
    specialRequests: "Late check-in requested (after 8 PM)"
  },
  {
    id: "booking-2",
    bookingId: "BB-7570AF5B",
    guestName: "Jane Smith",
    guestEmail: "jane.smith@example.com",
    guestPhone: "+44 20 2345 6789",
    homeCode: "APT123",
    homeId: "home-2",
    checkIn: daysFromNow(-2), // 2 days ago
    checkOut: daysFromNow(3),
    status: "current",
    numberOfGuests: 1
  },
  {
    id: "booking-3",
    bookingId: "BB-9XYZ1234",
    guestName: "Bob Johnson",
    guestEmail: "bob.johnson@example.com",
    guestPhone: "+44 20 3456 7890",
    homeCode: "VIL789",
    homeId: "home-3",
    checkIn: daysFromNow(-5),
    checkOut: daysFromNow(1),
    status: "departure",
    numberOfGuests: 4,
    specialRequests: "Early check-out at 9 AM"
  },
  {
    id: "booking-4",
    bookingId: "BB-ABCD5678",
    guestName: "Alice Williams",
    guestEmail: "alice.williams@example.com",
    guestPhone: "+44 20 4567 8901",
    homeCode: "COS285",
    homeId: "home-1",
    checkIn: daysFromNow(-3),
    checkOut: daysFromNow(4),
    status: "current",
    numberOfGuests: 2
  },
  {
    id: "booking-5",
    bookingId: "BB-EFGH9012",
    guestName: "Charlie Brown",
    guestEmail: "charlie.brown@example.com",
    guestPhone: "+44 20 5678 9012",
    homeCode: "STU456",
    homeId: "home-4",
    checkIn: daysFromNow(-1),
    checkOut: daysFromNow(6),
    status: "current",
    numberOfGuests: 1
  },
  {
    id: "booking-6",
    bookingId: "BB-IJKL3456",
    guestName: "Diana Prince",
    guestEmail: "diana.prince@example.com",
    guestPhone: "+44 20 6789 0123",
    homeCode: "PEN901",
    homeId: "home-5",
    checkIn: daysFromNow(5),
    checkOut: daysFromNow(12),
    status: "upcoming",
    numberOfGuests: 3,
    specialRequests: "Anniversary celebration - please ensure champagne is chilled"
  }
]

// ============================================================================
// ACTIVITIES DATA
// ============================================================================

export const testActivities: Activity[] = [
  {
    id: "activity-1",
    type: "provisioning",
    title: "Provision Home",
    homeCode: "COS285",
    homeName: "Cosmopolitan Suite",
    bookingId: "BB-1AB2C3D4",
    scheduledTime: hoursFromNow(2),
    status: "pending",
    priority: "high",
    description: "Prepare home for guest arrival",
    assignedTo: "Alex"
  },
  {
    id: "activity-2",
    type: "meet-greet",
    title: "Guest Arrival - Meet & Greet",
    homeCode: "COS285",
    homeName: "Cosmopolitan Suite",
    bookingId: "BB-1AB2C3D4",
    scheduledTime: hoursFromNow(4),
    status: "pending",
    description: "Welcome guest and provide keys",
    assignedTo: "Alex"
  },
  {
    id: "activity-3",
    type: "turn",
    title: "Turn Service",
    homeCode: "APT123",
    homeName: "Apartment 123",
    scheduledTime: hoursFromNow(6),
    status: "in-progress",
    description: "Clean and prepare for next guest",
    assignedTo: "Alex"
  },
  {
    id: "activity-4",
    type: "deprovision",
    title: "Deprovision Home",
    homeCode: "VIL789",
    homeName: "Villa 789",
    bookingId: "BB-9XYZ1234",
    scheduledTime: hoursFromNow(8),
    status: "pending",
    description: "Secure home after guest departure",
    assignedTo: "Alex"
  },
  {
    id: "activity-5",
    type: "ad-hoc",
    title: "Maintenance Check",
    homeCode: "VIL789",
    homeName: "Villa 789",
    scheduledTime: hoursFromNow(1),
    status: "pending",
    priority: "high",
    description: "Check heating system issue",
    assignedTo: "Alex"
  },
  {
    id: "activity-6",
    type: "provisioning",
    title: "Provision Home",
    homeCode: "PEN901",
    homeName: "Penthouse 901",
    bookingId: "BB-IJKL3456",
    scheduledTime: daysFromNow(5),
    status: "pending",
    description: "Prepare home for upcoming booking",
    assignedTo: "Alex"
  },
  {
    id: "activity-7",
    type: "turn",
    title: "Turn Service",
    homeCode: "STU456",
    homeName: "Studio 456",
    scheduledTime: hoursAgo(2),
    status: "completed",
    description: "Cleaning completed",
    assignedTo: "Alex"
  },
  {
    id: "activity-8",
    type: "meet-greet",
    title: "Guest Arrival",
    homeCode: "APT123",
    homeName: "Apartment 123",
    bookingId: "BB-7570AF5B",
    scheduledTime: hoursAgo(48),
    status: "completed",
    description: "Guest checked in successfully",
    assignedTo: "Alex"
  },
  {
    id: "activity-9",
    type: "deprovision",
    title: "Deprovision Home",
    homeCode: "LOF234",
    homeName: "Loft 234",
    scheduledTime: daysFromNow(-1),
    status: "overdue",
    priority: "high",
    description: "Secure home - overdue",
    assignedTo: "Alex"
  }
]

// ============================================================================
// NOTIFICATIONS DATA
// ============================================================================

export const testNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "message",
    title: "New Message",
    message: "You have a new message from supervisor regarding COS285",
    timestamp: hoursAgo(0.5),
    read: false,
    link: "/messages/1",
    priority: "normal"
  },
  {
    id: "notif-2",
    type: "alert",
    title: "Issue Reported",
    message: "Maintenance issue reported at APT123 - Heating system not working",
    timestamp: hoursAgo(2),
    read: false,
    link: "/issues/1",
    priority: "high"
  },
  {
    id: "notif-3",
    type: "activity-update",
    title: "Activity Completed",
    message: "Provisioning activity at COS285 has been completed",
    timestamp: hoursAgo(4),
    read: true,
    link: "/activities/activity-1",
    priority: "normal"
  },
  {
    id: "notif-4",
    type: "message",
    title: "Reminder",
    message: "Reminder: Turn service scheduled for tomorrow at VIL789",
    timestamp: hoursAgo(6),
    read: true,
    link: "/messages/2",
    priority: "normal"
  },
  {
    id: "notif-5",
    type: "alert",
    title: "Overdue Activity",
    message: "Activity 'Deprovision Home' at LOF234 is overdue",
    timestamp: hoursAgo(12),
    read: false,
    link: "/activities/activity-9",
    priority: "high"
  },
  {
    id: "notif-6",
    type: "activity-update",
    title: "Activity Started",
    message: "Turn service at APT123 has been started",
    timestamp: hoursAgo(6),
    read: true,
    link: "/activities/activity-3",
    priority: "normal"
  },
  {
    id: "notif-7",
    type: "message",
    title: "New Booking",
    message: "New booking BB-IJKL3456 confirmed for PEN901",
    timestamp: hoursAgo(24),
    read: true,
    link: "/bookings/booking-6",
    priority: "normal"
  }
]

// ============================================================================
// RECENT ITEMS DATA
// ============================================================================

export const testRecentItems: RecentItem[] = [
  {
    id: "recent-1",
    type: "home",
    title: "COS285",
    subtitle: "Cosmopolitan Suite",
    href: "/homes/home-1",
    accessedAt: hoursAgo(1)
  },
  {
    id: "recent-2",
    type: "booking",
    title: "BB-1AB2C3D4",
    subtitle: "Guest: John Doe",
    href: "/bookings/booking-1",
    accessedAt: hoursAgo(2)
  },
  {
    id: "recent-3",
    type: "activity",
    title: "Provisioning Activity",
    subtitle: "COS285",
    href: "/activities/activity-1",
    accessedAt: hoursAgo(3)
  },
  {
    id: "recent-4",
    type: "home",
    title: "APT123",
    subtitle: "Apartment 123",
    href: "/homes/home-2",
    accessedAt: hoursAgo(5)
  },
  {
    id: "recent-5",
    type: "booking",
    title: "BB-7570AF5B",
    subtitle: "Guest: Jane Smith",
    href: "/bookings/booking-2",
    accessedAt: hoursAgo(8)
  }
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get activities for a specific home
 */
export function getActivitiesForHome(homeId: string): Activity[] {
  const home = testHomes.find(h => h.id === homeId)
  if (!home) return []
  return testActivities.filter(a => a.homeCode === home.code)
}

/**
 * Get activities for a specific booking
 */
export function getActivitiesForBooking(bookingId: string): Activity[] {
  return testActivities.filter(a => a.bookingId === bookingId)
}

/**
 * Get bookings for a specific home
 */
export function getBookingsForHome(homeId: string): Booking[] {
  return testBookings.filter(b => b.homeId === homeId)
}

/**
 * Get home by code
 */
export function getHomeByCode(code: string): Home | undefined {
  return testHomes.find(h => h.code === code)
}

/**
 * Get booking by booking ID
 */
export function getBookingByBookingId(bookingId: string): Booking | undefined {
  return testBookings.find(b => b.bookingId === bookingId)
}

/**
 * Get activity by ID
 */
export function getActivityById(id: string): Activity | undefined {
  return testActivities.find(a => a.id === id)
}

/**
 * Get unread notifications count
 */
export function getUnreadNotificationsCount(): number {
  return testNotifications.filter(n => !n.read).length
}

/**
 * Get activities due today
 */
export function getActivitiesDueToday(): Activity[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return testActivities.filter(a => {
    const activityDate = new Date(a.scheduledTime)
    activityDate.setHours(0, 0, 0, 0)
    return activityDate.getTime() === today.getTime()
  })
}

/**
 * Get upcoming bookings (next 7 days)
 */
export function getUpcomingBookings(days: number = 7): Booking[] {
  const futureDate = daysFromNow(days)
  return testBookings.filter(b => {
    const checkIn = new Date(b.checkIn)
    return checkIn >= now && checkIn <= futureDate && b.status === "upcoming"
  })
}

// ============================================================================
// PROPERTY HIERARCHY DATA
// ============================================================================

/**
 * Get property hierarchy for a specific home
 */
export function getPropertyHierarchy(homeId: string): PropertyHierarchyNode | null {
  // Mock hierarchy data - in production this would come from API
  const hierarchies: Record<string, PropertyHierarchyNode> = {
    "home-1": {
      id: "unit-1",
      label: "COS285",
      type: "unit",
      icon: "Home",
      children: [
        {
          id: "building-1",
          label: "Main Building",
          type: "building",
          icon: "Building",
          children: [
            {
              id: "floor-1",
              label: "Ground Floor",
              type: "floor",
              icon: "Layers",
              children: [
                {
                  id: "room-1",
                  label: "Kitchen",
                  type: "room",
                  icon: "ChefHat",
                  metadata: "8 items",
                  children: [
                    {
                      id: "item-1",
                      label: "Dishwasher",
                      type: "item",
                      icon: "Refrigerator",
                      instructions: "Use eco-friendly detergent. Run empty cycle monthly.",
                      details: {
                        "Model": "Bosch SMS24AW00G",
                        "Last Updated": "2024-01-15",
                        "Serial Number": "BSH-12345"
                      },
                      photos: [
                        { id: "photo-1", url: "/placeholder-dishwasher.jpg", caption: "Dishwasher front view" }
                      ]
                    },
                    {
                      id: "item-2",
                      label: "Refrigerator",
                      type: "item",
                      icon: "Refrigerator",
                      instructions: "Check temperature daily. Clean condenser coils monthly.",
                      details: {
                        "Model": "Samsung RF28R7351SG",
                        "Last Updated": "2024-01-10"
                      }
                    },
                    {
                      id: "item-3",
                      label: "Oven",
                      type: "item",
                      icon: "ChefHat",
                      instructions: "Self-cleaning function available. Use oven cleaner for stubborn stains.",
                      details: {
                        "Model": "GE Profile PGS930",
                        "Last Updated": "2024-01-12"
                      }
                    }
                  ]
                },
                {
                  id: "room-2",
                  label: "Living Room",
                  type: "room",
                  icon: "Sofa",
                  metadata: "12 items",
                  children: [
                    {
                      id: "item-4",
                      label: "Sofa",
                      type: "item",
                      icon: "Sofa",
                      instructions: "Vacuum weekly. Spot clean with fabric cleaner.",
                      details: {
                        "Material": "Fabric",
                        "Last Updated": "2024-01-08"
                      }
                    },
                    {
                      id: "item-5",
                      label: "TV",
                      type: "item",
                      icon: "Tv",
                      instructions: "Remote control in drawer. Check HDMI connections.",
                      details: {
                        "Model": "Samsung 65\" QLED",
                        "Last Updated": "2024-01-05"
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "floor-2",
              label: "First Floor",
              type: "floor",
              icon: "Layers",
              children: [
                {
                  id: "room-3",
                  label: "Master Bedroom",
                  type: "room",
                  icon: "Bed",
                  metadata: "15 items",
                  children: [
                    {
                      id: "item-6",
                      label: "Bed",
                      type: "item",
                      icon: "Bed",
                      instructions: "Change linens weekly. Check mattress for stains.",
                      details: {
                        "Size": "King",
                        "Last Updated": "2024-01-14"
                      }
                    },
                    {
                      id: "item-7",
                      label: "Air Conditioning Unit",
                      type: "item",
                      icon: "Wind",
                      instructions: "Clean filters monthly. Set to 22°C when occupied.",
                      details: {
                        "Model": "Daikin FTXS35LVMA",
                        "Last Updated": "2024-01-11"
                      }
                    }
                  ]
                },
                {
                  id: "room-4",
                  label: "Master Bathroom",
                  type: "room",
                  icon: "Droplet",
                  metadata: "10 items",
                  children: [
                    {
                      id: "item-8",
                      label: "Shower",
                      type: "item",
                      icon: "Droplet",
                      instructions: "Check water pressure. Clean showerhead monthly.",
                      details: {
                        "Type": "Rain Shower",
                        "Last Updated": "2024-01-09"
                      }
                    },
                    {
                      id: "item-9",
                      label: "Toilet",
                      type: "item",
                      icon: "Droplet",
                      instructions: "Check for leaks. Clean thoroughly.",
                      details: {
                        "Model": "Toto CST744SL",
                        "Last Updated": "2024-01-13"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    "home-2": {
      id: "unit-2",
      label: "APT123",
      type: "unit",
      icon: "Home",
      children: [
        {
          id: "building-2",
          label: "Apartment Building",
          type: "building",
          icon: "Building",
          children: [
            {
              id: "floor-3",
              label: "Third Floor",
              type: "floor",
              icon: "Layers",
              children: [
                {
                  id: "room-5",
                  label: "Studio",
                  type: "room",
                  icon: "Home",
                  metadata: "6 items",
                  children: [
                    {
                      id: "item-10",
                      label: "Kitchenette",
                      type: "item",
                      icon: "ChefHat",
                      instructions: "Compact kitchen. Check all appliances.",
                      details: {
                        "Last Updated": "2024-01-07"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }

  return hierarchies[homeId] || null
}

/**
 * Get issues for a property
 */
export function getIssuesForProperty(homeId: string): Record<string, PropertyIssue[]> {
  // In production, this would load from localStorage or API
  // For now, return empty object - issues will be stored in localStorage
  if (typeof window === "undefined") return {}
  
  const issuesKey = `property-issues-${homeId}`
  const stored = localStorage.getItem(issuesKey)
  if (!stored) return {}
  
  try {
    const issues: PropertyIssue[] = JSON.parse(stored)
    // Convert date strings back to Date objects
    const issuesWithDates = issues.map(issue => ({
      ...issue,
      reportedDate: new Date(issue.reportedDate)
    }))
    
    // Group by itemId
    const grouped: Record<string, PropertyIssue[]> = {}
    issuesWithDates.forEach(issue => {
      if (!grouped[issue.itemId]) {
        grouped[issue.itemId] = []
      }
      grouped[issue.itemId].push(issue)
    })
    
    return grouped
  } catch {
    return {}
  }
}

/**
 * Get issue count for a specific node (including children)
 */
export function getIssueCountForNode(
  nodeId: string,
  hierarchy: PropertyHierarchyNode,
  issues: Record<string, PropertyIssue[]>
): number {
  let count = 0
  
  // Count issues for this node
  const nodeIssues = issues[nodeId] || []
  count += nodeIssues.filter(issue => issue.status !== "resolved").length
  
  // Recursively count issues for children
  const findNode = (node: PropertyHierarchyNode): PropertyHierarchyNode | null => {
    if (node.id === nodeId) return node
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(child)
        if (found) return found
      }
    }
    return null
  }
  
  const node = findNode(hierarchy)
  if (node?.children) {
    for (const child of node.children) {
      count += getIssueCountForNode(child.id, hierarchy, issues)
    }
  }
  
  return count
}

/**
 * Bubble up issue counts to parent nodes
 */
export function bubbleUpIssueCounts(
  hierarchy: PropertyHierarchyNode,
  issues: Record<string, PropertyIssue[]>
): PropertyHierarchyNode {
  const processNode = (node: PropertyHierarchyNode): PropertyHierarchyNode => {
    const processedChildren = node.children?.map(child => processNode(child)) || []
    
    // Count direct issues
    const directIssues = issues[node.id] || []
    const directCount = directIssues.filter(issue => issue.status !== "resolved").length
    
    // Count child issues
    const childCount = processedChildren.reduce((sum, child) => {
      const childIssues = issues[child.id] || []
      const childDirectCount = childIssues.filter(issue => issue.status !== "resolved").length
      // Also get the total from child's metadata if it exists
      const childTotal = child.issueCount || 0
      return sum + childDirectCount + childTotal
    }, 0)
    
    const totalCount = directCount + childCount
    
    return {
      ...node,
      children: processedChildren,
      issueCount: totalCount,
      hasNotification: totalCount > 0
    }
  }
  
  return processNode(hierarchy)
}

