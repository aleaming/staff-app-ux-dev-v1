# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 staff management application for property/vacation rental operations. It uses Shadcn UI components, Tailwind CSS, and TypeScript. The app is designed for mobile-first usage by operations staff managing properties, activities, bookings, and guest interactions.

## Development Commands

```bash
# Development server (local only)
npm run dev

# Development server (accessible on local network)
npm run dev:network

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

**Important**: Use `npm run dev:network` when you need to test on mobile devices or access from other computers on the local network (runs on 0.0.0.0).

## Architecture Overview

### Data Layer

The app uses a **CSV-based data loading system** with React Context for state management:

#### Data Provider (`lib/data/DataProvider.tsx`)
- Central React Context providing homes, bookings, and activities data to all components
- Handles async loading state and error handling
- Exposes hooks: `useData()`, `useHomes()`, `useBookings()`, `useActivities()`
- Data is refreshed via `refresh()` function in context

#### Data Loaders (`lib/data/`)
- `homes-loader.ts` - Loads homes from `/data/homes.csv`, handles geocoding
- `bookings-loader.ts` - Loads bookings from `/data/bookings.csv`
- `activities-loader.ts` - Loads activities from `/data/activities.csv`
- Each loader has sync and async variants with caching

#### Legacy Support (`lib/test-data.ts`)
- Re-exports CSV data for backward compatibility
- Contains TypeScript interfaces for all data types
- Includes helper functions: `getActivitiesForHome()`, `getBookingsForHome()`, `getHomeByCode()`, etc.
- Contains mock data for notifications and recent items (not from CSV)
- **Property Hierarchy System** - Defines `PropertyHierarchyNode`, `PropertyIssue`, and related types

### Activity System Architecture

The activity system is the core of the app. Activities follow a template-based workflow:

#### Activity Types (aligned across files)
**Home Preparation:**
- `provisioning`, `deprovisioning`, `turn`, `maid-service`, `mini-maid`, `touch-up`, `quality-check`

**Guest Welcoming:**
- `meet-greet`, `additional-greet`, `bag-drop`, `service-recovery`, `home-viewing`

**Other:**
- `adhoc`

#### Activity Templates (`lib/activity-templates.ts`)
- Each activity type has a predefined template with phases (arrive, during, depart)
- Templates define tasks with dependencies, photo requirements, and estimated times
- Tasks have actions like "Check", "Prepare For Guest", "Verify", "Photograph", etc.
- Supports conditional tasks (season, occupancy-based)

#### Activity State Management (`lib/activity-utils.ts`)
- Active activities stored in localStorage: `activity-tracker-draft-{homeId}-{activityType}`
- Incomplete activities (saved but not completed): `incomplete-activities`
- Closed activities marked with: `activity-closed-{homeId}-{activityType}`
- Resume functionality rebuilds state from localStorage

#### Key Activity Components
- `ActivityTracker` - Main activity workflow UI
- `ActivityCard` (`components/activities/ActivityCard.tsx`) - Reusable activity display card with status, home info, booking links
- `ActivityTypeSelector` - Choose activity type to start
- `TaskCard`, `PhaseSection`, `RoomChecklist` - Activity workflow UI elements

### Property Browser System

A comprehensive property inventory and issue reporting system:

#### Components (`components/property/`)
- `PropertyBrowser.tsx` - Main hierarchical browser with offline support
- `HierarchicalListItem.tsx` - List item with navigation and issue badges
- `ItemDetailsSheet.tsx` - Detailed view of property items
- `PropertyIssueReportSheet.tsx` - Issue reporting with photo upload
- `PropertySearch.tsx` - Search within property hierarchy
- `IssueBadge.tsx`, `ReportIssueButton.tsx` - UI helpers

#### Property Data Types (`lib/test-data.ts`)
- `PropertyNodeType`: "unit" | "building" | "floor" | "room" | "item"
- `PropertyIssueType`: "not-working" | "damaged" | "missing" | "needs-cleaning" | "other"
- `PropertyIssuePriority`: "urgent" | "high" | "medium" | "low"

#### Features
- Hierarchical navigation (Building → Floor → Room → Item)
- Issue tracking with photo requirements
- Offline queue support (syncs when back online)
- Cached hierarchy data (24-hour expiry)
- Issue count bubbling to parent nodes

### Component Organization

```
components/
├── ui/              # Shadcn UI primitives (Button, Card, Sheet, etc.)
├── navigation/      # TopNav, BottomNav, Breadcrumbs, SearchBar, BackButton
├── dashboard/       # DashboardHeader, MyActivities, BookingOverview, DashboardMap, etc.
├── activities/      # ActivityTracker, ActivityCard, PhotoUploader, TaskCard, etc.
├── homes/           # HomeInfoSheet, HomeAccess, HomeMedia, DamagesSheet, etc.
├── bookings/        # BookingInfoSheet - booking details in bottom sheet
├── property/        # PropertyBrowser, HierarchicalListItem, ItemDetailsSheet, etc.
├── map/             # MapSheet - location/directions sheet
├── haptic/          # HapticProvider - haptic feedback context
├── layout/          # LayoutClient - client-side layout wrapper
├── settings/        # HapticSettings, PlanMyDay
└── theme/           # ThemeProvider, ThemeToggle
```

### Route Structure

```
app/
├── page.tsx                          # Dashboard (home)
├── activities/
│   ├── page.tsx                      # Activities list
│   └── [id]/page.tsx                 # Activity detail
├── bookings/
│   └── [id]/page.tsx                 # Booking detail
├── catalog/page.tsx                  # Property catalog
├── homes/
│   └── [id]/
│       ├── page.tsx                  # Home detail
│       ├── start-activity/page.tsx   # Activity selector
│       └── activities/[type]/track/  # Activity tracker
├── keys/page.tsx                     # Key management
├── login/page.tsx                    # Login
├── manage/page.tsx                   # Management
├── notifications/page.tsx            # Notifications
├── profile/page.tsx                  # User profile
└── settings/page.tsx                 # Settings
```

### Navigation Pattern

The app uses a mobile-first navigation pattern:
- **TopNav**: Displays on all pages, contains breadcrumbs and user menu
- **BottomNav**: Mobile navigation bar with 5 main sections (Home, Activities, Search, Manage, Profile)
- **Breadcrumbs**: Automatic breadcrumb generation based on route structure

### Toast Notifications

Uses **Sonner** for toast notifications. Configured in `app/layout.tsx`:
- Position: top-center
- Rich colors enabled

```tsx
import { toast } from "sonner"

toast.success("Success message", {
  description: "Additional details",
  duration: 3000,
})
```

### Haptic Feedback System

Mobile haptic feedback support via `lib/use-haptic.ts`:
- Patterns: `light`, `medium`, `success`, `error`, `warning`
- User preference stored in localStorage: `haptics-enabled`
- Uses Web Vibration API

```tsx
const { trigger, isEnabled, toggleEnabled, isSupported } = useHaptic()
trigger('success') // Trigger haptic
```

### Photo Upload System

Photos are managed through:
- `PhotoUploader` component for capturing/uploading photos
- `PhotoAnnotation` for marking up photos
- `PhotoGallery` for viewing photo collections
- `UploadQueue` for batch upload management
- Photos stored per-task in activity state
- Photo status: "uploading" | "uploaded" | "failed"

### Maps and Location

- **Property maps**: Uses OpenStreetMap embed in `components/homes/HomeAccess.tsx`
- **Directions**: Google Maps Directions API integration
- **Area overview**: Leaflet map in `components/dashboard/DashboardMap.tsx` (collapsible)
- **MapSheet**: Bottom sheet with map and directions (`components/map/MapSheet.tsx`)
- **Geocoding**: `lib/geocoding.ts` handles location-to-coordinates conversion

### localStorage Keys Reference

Understanding localStorage keys is critical for debugging:

**Activity System:**
- `activity-tracker-draft-{homeId}-{activityType}` - Active activity draft data
- `activity-closed-{homeId}-{activityType}` - Marks activity as closed
- `incomplete-activities` - Array of saved incomplete activities

**Property System:**
- `property-hierarchy-{homeId}` - Cached property hierarchy (24hr)
- `property-issues-{homeId}` - Issues for a property
- `property-issue-queue-{homeId}` - Offline issue queue
- `home-issues-{homeId}` - General home issues

**User Preferences:**
- `recent-searches` - Array of recent search queries (max 5)
- `haptics-enabled` - Haptic feedback preference

### Styling Approach

- **Tailwind CSS** for all styling
- **Shadcn UI** components use `class-variance-authority` for variant management
- Mobile-first responsive design using Tailwind breakpoints (sm, md, lg)
- Dark mode support via `next-themes` (system, light, dark)
- Utility function `cn()` from `lib/utils.ts` for conditional class merging
- **Activity color CSS variables**: `--activity-provisioning`, `--activity-turn`, etc.

## Common Patterns

### Accessing Data in Components

```tsx
// Using React Context (recommended)
import { useData, useHomes, useActivities } from "@/lib/data/DataProvider"

function MyComponent() {
  const { homes, bookings, activities, isLoading, error, refresh } = useData()
  // or for specific data:
  const { homes, isLoading, error } = useHomes()
  
  if (isLoading) return <Skeleton />
  // ...
}
```

### Creating Info Sheets

Use bottom sheets for detail views:
```tsx
<HomeInfoSheet homeId={home.id} homeCode={home.code} homeName={home.name}>
  <button>View Home</button>
</HomeInfoSheet>

<BookingInfoSheet booking={booking} home={home}>
  <button>View Booking</button>
</BookingInfoSheet>
```

### Adding New Activity Types

1. Update `ActivityType` in `lib/activity-templates.ts`
2. Add template definition in `activityTemplates` object
3. Update `ActivityType` in `lib/test-data.ts` (keep in sync)
4. Add icon and color config in `components/activities/ActivityCard.tsx` (`activityTypeConfig`)
5. Add CSS variable for color in `globals.css`

### Working with Forms

Forms use:
- `react-hook-form` for form state
- `zod` for validation
- Shadcn UI form components from `components/ui/form.tsx`

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const schema = z.object({
  field: z.string().min(1, "Required")
})

const form = useForm({
  resolver: zodResolver(schema)
})
```

### Loading States

Use Skeleton components for loading states:
```tsx
import { Skeleton } from "@/components/ui/skeleton"

if (isLoading) {
  return <Skeleton className="h-32 w-full rounded-lg" />
}
```

## Key Features to Preserve

1. **Incomplete Activity Tracking**: Users can save and close activities mid-workflow
2. **FloatingActivityIsland**: Always visible when there's an active activity (except on tracker page)
3. **Mobile-first Design**: All UI must work well on mobile devices
4. **Dark Mode**: All components support dark mode
5. **Recent Searches**: Search input shows recent searches on focus
6. **Photo Requirements**: Activities enforce required photo counts per task
7. **Task Dependencies**: Some tasks cannot be started until dependencies complete
8. **localStorage Persistence**: All activity progress survives page refreshes
9. **Property Hierarchy**: Hierarchical item tracking with issue reporting
10. **Offline Support**: Property issues queued when offline
11. **Haptic Feedback**: Mobile vibration patterns for user feedback

## Testing Considerations

- Test on mobile viewport (primary use case)
- Test dark mode for all new components
- Test localStorage persistence by refreshing during activities
- Test network access using `npm run dev:network` for mobile device testing
- Verify FloatingActivityIsland shows/hides correctly based on activity state
- Test offline behavior for property issue reporting
- Test haptic feedback on supported devices

## Key Dependencies

- `next` ^16 - React framework
- `react-hook-form` ^7 - Form handling
- `zod` ^4 - Schema validation
- `sonner` ^2 - Toast notifications
- `lucide-react` - Icons
- `papaparse` ^5 - CSV parsing
- `jspdf` ^3 - PDF generation
- `next-themes` - Dark mode
- `class-variance-authority` - Component variants
