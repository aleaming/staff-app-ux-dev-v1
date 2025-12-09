/**
 * Test Data for onefinestay Staff App
 * 
 * This file loads data from CSV files and provides typed interfaces.
 * In production, this would be replaced with API calls.
 */

// Import CSV data loaders
import { getHomes as loadHomes, refreshHomes as refreshHomesAsync } from './data/homes-loader'
import { getBookings as loadBookings, refreshBookings as refreshBookingsAsync } from './data/bookings-loader'
import { getActivities as loadActivities, refreshActivities as refreshActivitiesAsync } from './data/activities-loader'

// ============================================================================
// TYPES
// ============================================================================

// Activity types - aligned with activity-templates.ts
// Home preparation: provisioning, deprovisioning, turn, maid-service, mini-maid, touch-up, quality-check
// Guest welcoming: meet-greet, additional-greet, bag-drop, service-recovery, home-viewing
// Other: adhoc
export type ActivityType = 
  | "provisioning"
  | "deprovisioning"
  | "turn"
  | "maid-service"
  | "mini-maid"
  | "touch-up"
  | "quality-check"
  | "meet-greet"
  | "additional-greet"
  | "bag-drop"
  | "service-recovery"
  | "home-viewing"
  | "adhoc"
export type ActivityStatus = "to-start" | "in-progress" | "paused" | "abandoned" | "completed" | "cancelled" | "ignored"
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
  endTime?: Date
  status: ActivityStatus
  priority?: "high" | "normal"
  description?: string
  assignedTo?: string
  // Activity attributes (sub-statuses/tags)
  confirmed?: boolean
  onTime?: boolean
  delayed?: boolean
  hasIssues?: boolean
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
  location?: string // e.g., "St John's Wood", "Soho"
  market?: string // e.g., "London"
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
export type PropertyIssuePriority = "urgent" | "high" | "medium" | "low"

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
// DATE HELPERS
// ============================================================================

const now = new Date()

// Helper to create dates relative to now
const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
const hoursFromNow = (hours: number) => new Date(now.getTime() + hours * 60 * 60 * 1000)
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000)

// ============================================================================
// DATA EXPORTS (loaded from CSV)
// ============================================================================

// Export loaded data - these are populated from CSV files
// Note: Data loads asynchronously; arrays will be empty until CSV files are fetched
export const testHomes: Home[] = loadHomes()
export const testBookings: Booking[] = loadBookings()
export const testActivities: Activity[] = loadActivities()

// Re-export refresh functions for hot reloading
export const refreshHomes = refreshHomesAsync
export const refreshBookings = refreshBookingsAsync
export const refreshActivities = refreshActivitiesAsync

/**
 * Initialize all data from CSV files
 * Call this on app startup to ensure data is loaded
 */
export async function initializeData(): Promise<void> {
  await Promise.all([
    refreshHomesAsync(),
    refreshBookingsAsync(),
    refreshActivitiesAsync(),
  ])
}

// ============================================================================
// NOTIFICATIONS DATA (not from CSV - kept as mock)
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
// RECENT ITEMS DATA (not from CSV - kept as mock)
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
/**
 * Create a default comprehensive hierarchy structure
 * This can be customized per home code if needed
 */
function createDefaultHierarchy(homeCode: string, homeName?: string): PropertyHierarchyNode {
  return {
    id: `unit-${homeCode.toLowerCase()}`,
    label: homeCode,
    type: "unit",
    icon: "Home",
    children: [
      {
        id: "building-1",
        label: "Main Building",
        type: "building",
        icon: "Building",
        children: [
          // First Floor
          {
            id: "floor-1",
            label: "First Floor",
            type: "floor",
            icon: "Layers",
            children: [
              {
                id: "room-master",
                label: "Master Bedroom",
                type: "room",
                icon: "Bed",
                metadata: "15 items",
                children: [
                  {
                    id: "item-king-bed",
                    label: "King Bed",
                    type: "item",
                    icon: "Bed",
                    instructions: "Change linens weekly. Check mattress for stains.",
                    details: {
                      "Size": "King",
                      "Last Updated": "2024-01-14"
                    }
                  },
                  {
                    id: "item-left-bedside",
                    label: "Left Bedside Table",
                    type: "item",
                    icon: "Table",
                    instructions: "Check drawer contents. Dust weekly.",
                    children: [
                      {
                        id: "item-left-drawer",
                        label: "Drawer",
                        type: "item",
                        icon: "Package",
                        instructions: "Contains remote controls and reading materials."
                      }
                    ]
                  },
                  {
                    id: "item-right-bedside",
                    label: "Right Bedside Table",
                    type: "item",
                    icon: "Table",
                    instructions: "Check drawer contents. Dust weekly.",
                    children: [
                      {
                        id: "item-right-drawer",
                        label: "Drawer",
                        type: "item",
                        icon: "Package",
                        instructions: "Contains remote controls and reading materials."
                      }
                    ]
                  },
                  {
                    id: "item-wardrobe",
                    label: "Built-in Wardrobe",
                    type: "item",
                    icon: "Package",
                    instructions: "Check hanging space. Organize shelves.",
                    children: [
                      {
                        id: "item-hanging-left",
                        label: "Hanging Rail Left",
                        type: "item",
                        icon: "Package"
                      },
                      {
                        id: "item-hanging-right",
                        label: "Hanging Rail Right",
                        type: "item",
                        icon: "Package"
                      },
                      {
                        id: "item-top-shelf",
                        label: "Top Shelf",
                        type: "item",
                        icon: "Package"
                      },
                      {
                        id: "item-shoe-rack",
                        label: "Shoe Rack",
                        type: "item",
                        icon: "Package"
                      },
                      {
                        id: "item-wardrobe-drawers",
                        label: "Drawers",
                        type: "item",
                        icon: "Package"
                      }
                    ]
                  },
                  {
                    id: "item-dressing-table",
                    label: "Dressing Table",
                    type: "item",
                    icon: "Table",
                    children: [
                      {
                        id: "item-mirror",
                        label: "Mirror",
                        type: "item",
                        icon: "Eye"
                      },
                      {
                        id: "item-dressing-drawers",
                        label: "Drawers",
                        type: "item",
                        icon: "Package"
                      }
                    ]
                  },
                  {
                    id: "item-window-area",
                    label: "Window Area",
                    type: "item",
                    icon: "Window",
                    children: [
                      {
                        id: "item-curtains",
                        label: "Curtains/Blinds",
                        type: "item",
                        icon: "Window"
                      },
                      {
                        id: "item-window-sill",
                        label: "Window Sill",
                        type: "item",
                        icon: "Window"
                      }
                    ]
                  }
                ]
              },
              {
                id: "room-guest",
                label: "Guest Bedroom",
                type: "room",
                icon: "Bed",
                metadata: "8 items",
                children: [
                  {
                    id: "item-double-bed",
                    label: "Double Bed",
                    type: "item",
                    icon: "Bed"
                  },
                  {
                    id: "item-guest-bedside",
                    label: "Bedside Table",
                    type: "item",
                    icon: "Table",
                    children: [
                      {
                        id: "item-guest-drawer",
                        label: "Drawer",
                        type: "item",
                        icon: "Package"
                      }
                    ]
                  },
                  {
                    id: "item-guest-wardrobe",
                    label: "Wardrobe",
                    type: "item",
                    icon: "Package",
                    children: [
                      {
                        id: "item-guest-hanging",
                        label: "Hanging Rail",
                        type: "item",
                        icon: "Package"
                      },
                      {
                        id: "item-guest-shelf",
                        label: "Top Shelf",
                        type: "item",
                        icon: "Package"
                      }
                    ]
                  },
                  {
                    id: "item-chest",
                    label: "Chest of Drawers",
                    type: "item",
                    icon: "Package"
                  },
                  {
                    id: "item-guest-window",
                    label: "Window Area",
                    type: "item",
                    icon: "Window"
                  }
                ]
              },
              {
                id: "room-hall-1",
                label: "Hall",
                type: "room",
                icon: "Door",
                children: [
                  {
                    id: "item-linen",
                    label: "Linen Cupboard",
                    type: "item",
                    icon: "Package",
                    children: [
                      {
                        id: "item-linen-top",
                        label: "Top Shelf",
                        type: "item",
                        icon: "Package"
                      },
                      {
                        id: "item-linen-middle",
                        label: "Middle Shelf",
                        type: "item",
                        icon: "Package"
                      },
                      {
                        id: "item-linen-bottom",
                        label: "Bottom Shelf",
                        type: "item",
                        icon: "Package"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          // Ground Floor / Entrance Level
          {
            id: "floor-ground",
            label: "Ground Floor",
            type: "floor",
            icon: "Layers",
            children: [
              {
                id: "room-entrance",
                label: "Entrance Hall",
                type: "room",
                icon: "Door"
              },
              {
                id: "room-sitting",
                label: "Sitting Room",
                type: "room",
                icon: "Sofa",
                metadata: "12 items",
                children: [
                  {
                    id: "item-sofa",
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
                    id: "item-tv",
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
              },
              {
                id: "room-kitchen",
                label: "Kitchen",
                type: "room",
                icon: "ChefHat",
                metadata: "25 items",
                children: [
                  {
                    id: "zone-cooking",
                    label: "Cooking Zone",
                    type: "item",
                    icon: "ChefHat",
                    children: [
                      {
                        id: "item-oven",
                        label: "Oven",
                        type: "item",
                        icon: "ChefHat",
                        instructions: "Self-cleaning function available. Use oven cleaner for stubborn stains.",
                        details: {
                          "Model": "GE Profile PGS930",
                          "Last Updated": "2024-01-12"
                        }
                      },
                      {
                        id: "item-hob",
                        label: "Hob/Cooktop",
                        type: "item",
                        icon: "ChefHat",
                        instructions: "Clean after each use. Check gas connections."
                      },
                      {
                        id: "item-microwave",
                        label: "Microwave",
                        type: "item",
                        icon: "ChefHat",
                        instructions: "Clean interior weekly. Check door seal."
                      },
                      {
                        id: "item-kettle",
                        label: "Kettle",
                        type: "item",
                        icon: "ChefHat",
                        instructions: "Descale monthly. Check for leaks."
                      },
                      {
                        id: "item-toaster",
                        label: "Toaster",
                        type: "item",
                        icon: "ChefHat",
                        instructions: "Clean crumb tray weekly."
                      }
                    ]
                  },
                  {
                    id: "zone-sink",
                    label: "Sink Area",
                    type: "item",
                    icon: "Droplet",
                    children: [
                      {
                        id: "item-sink",
                        label: "Main Sink",
                        type: "item",
                        icon: "Droplet",
                        instructions: "Check water pressure. Clean drain monthly."
                      },
                      {
                        id: "item-dishwasher",
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
                        id: "item-under-sink",
                        label: "Under-sink Storage",
                        type: "item",
                        icon: "Package"
                      }
                    ]
                  },
                  {
                    id: "zone-fridge",
                    label: "Refrigeration",
                    type: "item",
                    icon: "Refrigerator",
                    children: [
                      {
                        id: "item-fridge",
                        label: "Fridge/Freezer",
                        type: "item",
                        icon: "Refrigerator",
                        instructions: "Check temperature daily. Clean condenser coils monthly.",
                        details: {
                          "Model": "Samsung RF28R7351SG",
                          "Last Updated": "2024-01-10"
                        }
                      },
                      {
                        id: "item-wine-cooler",
                        label: "Wine Cooler",
                        type: "item",
                        icon: "Refrigerator"
                      }
                    ]
                  },
                  {
                    id: "item-upper-cabinets",
                    label: "Upper Cabinets",
                    type: "item",
                    icon: "Package",
                    children: [
                      {
                        id: "item-glassware",
                        label: "Glassware Cabinet",
                        type: "item",
                        icon: "Package"
                      },
                      {
                        id: "item-plates",
                        label: "Plates & Bowls Cabinet",
                        type: "item",
                        icon: "Package"
                      },
                      {
                        id: "item-mugs",
                        label: "Mugs & Cups Cabinet",
                        type: "item",
                        icon: "Package"
                      }
                    ]
                  },
                  {
                    id: "item-lower-cabinets",
                    label: "Lower Cabinets",
                    type: "item",
                    icon: "Package",
                    children: [
                      {
                        id: "item-pots",
                        label: "Pots & Pans Drawer",
                        type: "item",
                        icon: "Package"
                      },
                      {
                        id: "item-utensils",
                        label: "Utensils Drawer",
                        type: "item",
                        icon: "Package"
                      },
                      {
                        id: "item-tupperware",
                        label: "Tupperware Cabinet",
                        type: "item",
                        icon: "Package"
                      }
                    ]
                  },
                  {
                    id: "item-pantry",
                    label: "Pantry",
                    type: "item",
                    icon: "Package",
                    children: [
                      {
                        id: "item-dry-goods",
                        label: "Dry Goods Shelf",
                        type: "item",
                        icon: "Package"
                      },
                      {
                        id: "item-spices",
                        label: "Spices & Condiments Shelf",
                        type: "item",
                        icon: "Package"
                      },
                      {
                        id: "item-baking",
                        label: "Baking Supplies Shelf",
                        type: "item",
                        icon: "Package"
                      },
                      {
                        id: "item-coffee",
                        label: "Coffee & Tea Station",
                        type: "item",
                        icon: "Package"
                      }
                    ]
                  },
                  {
                    id: "item-countertops",
                    label: "Countertops",
                    type: "item",
                    icon: "Table",
                    children: [
                      {
                        id: "item-coffee-machine",
                        label: "Coffee Machine",
                        type: "item",
                        icon: "ChefHat",
                        instructions: "Descale monthly. Clean portafilter after use."
                      },
                      {
                        id: "item-knife-block",
                        label: "Knife Block",
                        type: "item",
                        icon: "Package"
                      },
                      {
                        id: "item-fruit-bowl",
                        label: "Fruit Bowl",
                        type: "item",
                        icon: "Package"
                      }
                    ]
                  },
                  {
                    id: "item-island",
                    label: "Kitchen Island",
                    type: "item",
                    icon: "Table",
                    children: [
                      {
                        id: "item-bar-stools",
                        label: "Bar Stools",
                        type: "item",
                        icon: "Table"
                      }
                    ]
                  },
                  {
                    id: "zone-bin",
                    label: "Bin Area",
                    type: "item",
                    icon: "Trash2",
                    children: [
                      {
                        id: "item-waste",
                        label: "General Waste Bin",
                        type: "item",
                        icon: "Trash2"
                      },
                      {
                        id: "item-recycling",
                        label: "Recycling Bin",
                        type: "item",
                        icon: "Trash2"
                      },
                      {
                        id: "item-food-waste",
                        label: "Food Waste Bin",
                        type: "item",
                        icon: "Trash2"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          // Lower Ground Floor
          {
            id: "floor-lower",
            label: "Lower Ground Floor",
            type: "floor",
            icon: "Layers",
            children: [
              {
                id: "room-dining",
                label: "Dining Room",
                type: "room",
                icon: "Utensils",
                children: [
                  {
                    id: "item-dining-table",
                    label: "Dining Table",
                    type: "item",
                    icon: "Table"
                  },
                  {
                    id: "item-sideboard",
                    label: "Sideboard",
                    type: "item",
                    icon: "Table"
                  },
                  {
                    id: "item-display-cabinet",
                    label: "Display Cabinet",
                    type: "item",
                    icon: "Package"
                  }
                ]
              },
              {
                id: "room-utility",
                label: "Utility Room",
                type: "room",
                icon: "WashingMachine",
                children: [
                  {
                    id: "item-washing",
                    label: "Washing Machine",
                    type: "item",
                    icon: "WashingMachine",
                    instructions: "Check detergent drawer. Clean filter monthly.",
                    details: {
                      "Model": "Bosch WAN28200GB",
                      "Last Updated": "2024-01-06"
                    }
                  },
                  {
                    id: "item-dryer",
                    label: "Tumble Dryer",
                    type: "item",
                    icon: "WashingMachine",
                    instructions: "Clean lint filter after each use.",
                    details: {
                      "Model": "Bosch WTW87561GB",
                      "Last Updated": "2024-01-06"
                    }
                  },
                  {
                    id: "item-cleaning",
                    label: "Cleaning Supplies Storage",
                    type: "item",
                    icon: "Package"
                  },
                  {
                    id: "item-ironing",
                    label: "Ironing Board & Iron",
                    type: "item",
                    icon: "Package"
                  },
                  {
                    id: "item-vault-right",
                    label: "Right Vault",
                    type: "item",
                    icon: "Lock"
                  },
                  {
                    id: "item-vault-left",
                    label: "Left Vault",
                    type: "item",
                    icon: "Lock"
                  }
                ]
              }
            ]
          },
          // Exterior
          {
            id: "floor-exterior",
            label: "Exterior / Other Areas",
            type: "floor",
            icon: "Layers",
            children: [
              {
                id: "room-patio",
                label: "Patio",
                type: "room",
                icon: "Home"
              }
            ]
          }
        ]
      },
      // Special Categories (top-level nodes)
      {
        id: "category-bedding",
        label: "Host Bedding",
        type: "item",
        icon: "Bed",
        instructions: "Bedding items that move between rooms."
      },
      {
        id: "category-plants",
        label: "Host Plants",
        type: "item",
        icon: "Flower",
        instructions: "Plants that require regular care."
      }
    ]
  }
}

export function getPropertyHierarchy(homeId: string): PropertyHierarchyNode | null {
  // Mock hierarchy data - in production this would come from API
  // Expanded based on Notion blueprint example
  
  // Extract home code from homeId (format: "home-{code}-{index}")
  // Or use homeId directly if it's a simple code
  let homeCode = homeId
  
  if (homeId.startsWith("home-")) {
    // Extract code from "home-{code}-{index}" format
    const parts = homeId.split("-")
    if (parts.length >= 3) {
      // Rejoin the middle parts (in case code has hyphens)
      homeCode = parts.slice(1, -1).join("-").toUpperCase()
    } else if (parts.length === 2) {
      homeCode = parts[1].toUpperCase()
    }
  }
  
  // Check for specific hierarchies (can be customized per home code)
  const specificHierarchies: Record<string, PropertyHierarchyNode> = {
    "COS285": {
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
            // First Floor
            {
              id: "floor-1",
              label: "First Floor",
              type: "floor",
              icon: "Layers",
              children: [
                {
                  id: "room-master",
                  label: "Master Bedroom",
                  type: "room",
                  icon: "Bed",
                  metadata: "15 items",
                  children: [
                    {
                      id: "item-king-bed",
                      label: "King Bed",
                      type: "item",
                      icon: "Bed",
                      instructions: "Change linens weekly. Check mattress for stains.",
                      details: {
                        "Size": "King",
                        "Last Updated": "2024-01-14"
                      }
                    },
                    {
                      id: "item-left-bedside",
                      label: "Left Bedside Table",
                      type: "item",
                      icon: "Table",
                      instructions: "Check drawer contents. Dust weekly.",
                      children: [
                        {
                          id: "item-left-drawer",
                          label: "Drawer",
                          type: "item",
                          icon: "Package",
                          instructions: "Contains remote controls and reading materials."
                        }
                      ]
                    },
                    {
                      id: "item-right-bedside",
                      label: "Right Bedside Table",
                      type: "item",
                      icon: "Table",
                      instructions: "Check drawer contents. Dust weekly.",
                      children: [
                        {
                          id: "item-right-drawer",
                          label: "Drawer",
                          type: "item",
                          icon: "Package",
                          instructions: "Contains remote controls and reading materials."
                        }
                      ]
                    },
                    {
                      id: "item-wardrobe",
                      label: "Built-in Wardrobe",
                      type: "item",
                      icon: "Package",
                      instructions: "Check hanging space. Organize shelves.",
                      children: [
                        {
                          id: "item-hanging-left",
                          label: "Hanging Rail Left",
                          type: "item",
                          icon: "Package"
                        },
                        {
                          id: "item-hanging-right",
                          label: "Hanging Rail Right",
                          type: "item",
                          icon: "Package"
                        },
                        {
                          id: "item-top-shelf",
                          label: "Top Shelf",
                          type: "item",
                          icon: "Package"
                        },
                        {
                          id: "item-shoe-rack",
                          label: "Shoe Rack",
                          type: "item",
                          icon: "Package"
                        },
                        {
                          id: "item-wardrobe-drawers",
                          label: "Drawers",
                          type: "item",
                          icon: "Package"
                        }
                      ]
                    },
                    {
                      id: "item-dressing-table",
                      label: "Dressing Table",
                      type: "item",
                      icon: "Table",
                      children: [
                        {
                          id: "item-mirror",
                          label: "Mirror",
                          type: "item",
                          icon: "Eye"
                        },
                        {
                          id: "item-dressing-drawers",
                          label: "Drawers",
                          type: "item",
                          icon: "Package"
                        }
                      ]
                    },
                    {
                      id: "item-window-area",
                      label: "Window Area",
                      type: "item",
                      icon: "Window",
                      children: [
                        {
                          id: "item-curtains",
                          label: "Curtains/Blinds",
                          type: "item",
                          icon: "Window"
                        },
                        {
                          id: "item-window-sill",
                          label: "Window Sill",
                          type: "item",
                          icon: "Window"
                        }
                      ]
                    }
                  ]
                },
                {
                  id: "room-guest",
                  label: "Guest Bedroom",
                  type: "room",
                  icon: "Bed",
                  metadata: "8 items",
                  children: [
                    {
                      id: "item-double-bed",
                      label: "Double Bed",
                      type: "item",
                      icon: "Bed"
                    },
                    {
                      id: "item-guest-bedside",
                      label: "Bedside Table",
                      type: "item",
                      icon: "Table",
                      children: [
                        {
                          id: "item-guest-drawer",
                          label: "Drawer",
                          type: "item",
                          icon: "Package"
                        }
                      ]
                    },
                    {
                      id: "item-guest-wardrobe",
                      label: "Wardrobe",
                      type: "item",
                      icon: "Package",
                      children: [
                        {
                          id: "item-guest-hanging",
                          label: "Hanging Rail",
                          type: "item",
                          icon: "Package"
                        },
                        {
                          id: "item-guest-shelf",
                          label: "Top Shelf",
                          type: "item",
                          icon: "Package"
                        }
                      ]
                    },
                    {
                      id: "item-chest",
                      label: "Chest of Drawers",
                      type: "item",
                      icon: "Package"
                    },
                    {
                      id: "item-guest-window",
                      label: "Window Area",
                      type: "item",
                      icon: "Window"
                    }
                  ]
                },
                {
                  id: "room-hall-1",
                  label: "Hall",
                  type: "room",
                  icon: "Door",
                  children: [
                    {
                      id: "item-linen",
                      label: "Linen Cupboard",
                      type: "item",
                      icon: "Package",
                      children: [
                        {
                          id: "item-linen-top",
                          label: "Top Shelf",
                          type: "item",
                          icon: "Package"
                        },
                        {
                          id: "item-linen-middle",
                          label: "Middle Shelf",
                          type: "item",
                          icon: "Package"
                        },
                        {
                          id: "item-linen-bottom",
                          label: "Bottom Shelf",
                          type: "item",
                          icon: "Package"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            // Ground Floor / Entrance Level
            {
              id: "floor-ground",
              label: "Ground Floor",
              type: "floor",
              icon: "Layers",
              children: [
                {
                  id: "room-entrance",
                  label: "Entrance Hall",
                  type: "room",
                  icon: "Door"
                },
                {
                  id: "room-sitting",
                  label: "Sitting Room",
                  type: "room",
                  icon: "Sofa",
                  metadata: "12 items",
                  children: [
                    {
                      id: "item-sofa",
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
                      id: "item-tv",
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
                },
                {
                  id: "room-kitchen",
                  label: "Kitchen",
                  type: "room",
                  icon: "ChefHat",
                  metadata: "25 items",
                  children: [
                    {
                      id: "zone-cooking",
                      label: "Cooking Zone",
                      type: "item",
                      icon: "ChefHat",
                      children: [
                        {
                          id: "item-oven",
                          label: "Oven",
                          type: "item",
                          icon: "ChefHat",
                          instructions: "Self-cleaning function available. Use oven cleaner for stubborn stains.",
                          details: {
                            "Model": "GE Profile PGS930",
                            "Last Updated": "2024-01-12"
                          }
                        },
                        {
                          id: "item-hob",
                          label: "Hob/Cooktop",
                          type: "item",
                          icon: "ChefHat",
                          instructions: "Clean after each use. Check gas connections."
                        },
                        {
                          id: "item-microwave",
                          label: "Microwave",
                          type: "item",
                          icon: "ChefHat",
                          instructions: "Clean interior weekly. Check door seal."
                        },
                        {
                          id: "item-kettle",
                          label: "Kettle",
                          type: "item",
                          icon: "ChefHat",
                          instructions: "Descale monthly. Check for leaks."
                        },
                        {
                          id: "item-toaster",
                          label: "Toaster",
                          type: "item",
                          icon: "ChefHat",
                          instructions: "Clean crumb tray weekly."
                        }
                      ]
                    },
                    {
                      id: "zone-sink",
                      label: "Sink Area",
                      type: "item",
                      icon: "Droplet",
                      children: [
                        {
                          id: "item-sink",
                          label: "Main Sink",
                          type: "item",
                          icon: "Droplet",
                          instructions: "Check water pressure. Clean drain monthly."
                        },
                        {
                          id: "item-dishwasher",
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
                          id: "item-under-sink",
                          label: "Under-sink Storage",
                          type: "item",
                          icon: "Package"
                        }
                      ]
                    },
                    {
                      id: "zone-fridge",
                      label: "Refrigeration",
                      type: "item",
                      icon: "Refrigerator",
                      children: [
                        {
                          id: "item-fridge",
                          label: "Fridge/Freezer",
                          type: "item",
                          icon: "Refrigerator",
                          instructions: "Check temperature daily. Clean condenser coils monthly.",
                          details: {
                            "Model": "Samsung RF28R7351SG",
                            "Last Updated": "2024-01-10"
                          }
                        },
                        {
                          id: "item-wine-cooler",
                          label: "Wine Cooler",
                          type: "item",
                          icon: "Refrigerator"
                        }
                      ]
                    },
                    {
                      id: "item-upper-cabinets",
                      label: "Upper Cabinets",
                      type: "item",
                      icon: "Package",
                      children: [
                        {
                          id: "item-glassware",
                          label: "Glassware Cabinet",
                          type: "item",
                          icon: "Package"
                        },
                        {
                          id: "item-plates",
                          label: "Plates & Bowls Cabinet",
                          type: "item",
                          icon: "Package"
                        },
                        {
                          id: "item-mugs",
                          label: "Mugs & Cups Cabinet",
                          type: "item",
                          icon: "Package"
                        }
                      ]
                    },
                    {
                      id: "item-lower-cabinets",
                      label: "Lower Cabinets",
                      type: "item",
                      icon: "Package",
                      children: [
                        {
                          id: "item-pots",
                          label: "Pots & Pans Drawer",
                          type: "item",
                          icon: "Package"
                        },
                        {
                          id: "item-utensils",
                          label: "Utensils Drawer",
                          type: "item",
                          icon: "Package"
                        },
                        {
                          id: "item-tupperware",
                          label: "Tupperware Cabinet",
                          type: "item",
                          icon: "Package"
                        }
                      ]
                    },
                    {
                      id: "item-pantry",
                      label: "Pantry",
                      type: "item",
                      icon: "Package",
                      children: [
                        {
                          id: "item-dry-goods",
                          label: "Dry Goods Shelf",
                          type: "item",
                          icon: "Package"
                        },
                        {
                          id: "item-spices",
                          label: "Spices & Condiments Shelf",
                          type: "item",
                          icon: "Package"
                        },
                        {
                          id: "item-baking",
                          label: "Baking Supplies Shelf",
                          type: "item",
                          icon: "Package"
                        },
                        {
                          id: "item-coffee",
                          label: "Coffee & Tea Station",
                          type: "item",
                          icon: "Package"
                        }
                      ]
                    },
                    {
                      id: "item-countertops",
                      label: "Countertops",
                      type: "item",
                      icon: "Table",
                      children: [
                        {
                          id: "item-coffee-machine",
                          label: "Coffee Machine",
                          type: "item",
                          icon: "ChefHat",
                          instructions: "Descale monthly. Clean portafilter after use."
                        },
                        {
                          id: "item-knife-block",
                          label: "Knife Block",
                          type: "item",
                          icon: "Package"
                        },
                        {
                          id: "item-fruit-bowl",
                          label: "Fruit Bowl",
                          type: "item",
                          icon: "Package"
                        }
                      ]
                    },
                    {
                      id: "item-island",
                      label: "Kitchen Island",
                      type: "item",
                      icon: "Table",
                      children: [
                        {
                          id: "item-bar-stools",
                          label: "Bar Stools",
                          type: "item",
                          icon: "Table"
                        }
                      ]
                    },
                    {
                      id: "zone-bin",
                      label: "Bin Area",
                      type: "item",
                      icon: "Trash2",
                      children: [
                        {
                          id: "item-waste",
                          label: "General Waste Bin",
                          type: "item",
                          icon: "Trash2"
                        },
                        {
                          id: "item-recycling",
                          label: "Recycling Bin",
                          type: "item",
                          icon: "Trash2"
                        },
                        {
                          id: "item-food-waste",
                          label: "Food Waste Bin",
                          type: "item",
                          icon: "Trash2"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            // Lower Ground Floor
            {
              id: "floor-lower",
              label: "Lower Ground Floor",
              type: "floor",
              icon: "Layers",
              children: [
                {
                  id: "room-dining",
                  label: "Dining Room",
                  type: "room",
                  icon: "Utensils",
                  children: [
                    {
                      id: "item-dining-table",
                      label: "Dining Table",
                      type: "item",
                      icon: "Table"
                    },
                    {
                      id: "item-sideboard",
                      label: "Sideboard",
                      type: "item",
                      icon: "Table"
                    },
                    {
                      id: "item-display-cabinet",
                      label: "Display Cabinet",
                      type: "item",
                      icon: "Package"
                    }
                  ]
                },
                {
                  id: "room-utility",
                  label: "Utility Room",
                  type: "room",
                  icon: "WashingMachine",
                  children: [
                    {
                      id: "item-washing",
                      label: "Washing Machine",
                      type: "item",
                      icon: "WashingMachine",
                      instructions: "Check detergent drawer. Clean filter monthly.",
                      details: {
                        "Model": "Bosch WAN28200GB",
                        "Last Updated": "2024-01-06"
                      }
                    },
                    {
                      id: "item-dryer",
                      label: "Tumble Dryer",
                      type: "item",
                      icon: "WashingMachine",
                      instructions: "Clean lint filter after each use.",
                      details: {
                        "Model": "Bosch WTW87561GB",
                        "Last Updated": "2024-01-06"
                      }
                    },
                    {
                      id: "item-cleaning",
                      label: "Cleaning Supplies Storage",
                      type: "item",
                      icon: "Package"
                    },
                    {
                      id: "item-ironing",
                      label: "Ironing Board & Iron",
                      type: "item",
                      icon: "Package"
                    },
                    {
                      id: "item-vault-right",
                      label: "Right Vault",
                      type: "item",
                      icon: "Lock"
                    },
                    {
                      id: "item-vault-left",
                      label: "Left Vault",
                      type: "item",
                      icon: "Lock"
                    }
                  ]
                }
              ]
            },
            // Exterior
            {
              id: "floor-exterior",
              label: "Exterior / Other Areas",
              type: "floor",
              icon: "Layers",
              children: [
                {
                  id: "room-patio",
                  label: "Patio",
                  type: "room",
                  icon: "Home"
                }
              ]
            }
          ]
        },
        // Special Categories (top-level nodes)
        {
          id: "category-bedding",
          label: "Host Bedding",
          type: "item",
          icon: "Bed",
          instructions: "Bedding items that move between rooms."
        },
        {
          id: "category-plants",
          label: "Host Plants",
          type: "item",
          icon: "Flower",
          instructions: "Plants that require regular care."
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

  // Check for specific hierarchy first (by home code, e.g., "COS285")
  if (specificHierarchies[homeCode]) {
    return specificHierarchies[homeCode]
  }
  
  // Check by homeId as fallback
  if (specificHierarchies[homeId]) {
    return specificHierarchies[homeId]
  }
  
  // Use default comprehensive hierarchy for all other homes
  return createDefaultHierarchy(homeCode)
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
