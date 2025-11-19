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
npm lint
```

**Important**: Use `npm run dev:network` when you need to test on mobile devices or access from other computers on the local network (runs on 0.0.0.0).

## Architecture Overview

### Data Layer (Currently Mock Data)

This app currently uses **mock test data** in `lib/test-data.ts`. In production, this would be replaced with API calls. All data access should go through the helper functions provided in:

- `lib/test-data.ts` - Core data types and mock datasets for homes, bookings, activities, notifications
- `lib/activity-templates.ts` - Activity workflow definitions (provisioning, turn, meet-greet, etc.)
- `lib/activity-utils.ts` - Activity state management (incomplete activities, localStorage)
- `lib/photo-utils.ts` - Photo upload and management utilities
- `lib/pdf-generator.ts` - PDF report generation

### Activity System Architecture

The activity system is the core of the app. Activities follow a template-based workflow:

1. **Activity Templates** (`lib/activity-templates.ts`):
   - Each activity type (provisioning, turn, meet-greet, deprovisioning, maid-service, adhoc) has a predefined template
   - Templates define tasks with dependencies, photo requirements, and estimated times
   - Activities are tracked via `ActivityTracker` component

2. **Activity State Management**:
   - Active activities are stored in localStorage with key pattern: `activity-tracker-draft-{homeId}-{activityType}`
   - Incomplete activities (saved but not completed) are stored in: `incomplete-activities`
   - When an activity is "closed" (saved without completing), it's marked with: `activity-closed-{homeId}-{activityType}`
   - Resume functionality rebuilds state from localStorage

3. **FloatingActivityIsland**:
   - Persistent UI element that shows active activity progress
   - Automatically detects any active activity from localStorage
   - Provides quick access to resume or save/close activities
   - Minimizes/expands based on scroll behavior
   - Hides on activity tracker pages to avoid redundancy

4. **Activity Workflow**:
   ```
   Start Activity → Track Progress → [Save & Close (Incomplete)] OR [Complete Activity]
   ```
   - Incomplete activities appear in "My Activities" with orange badge
   - Activities can have photo requirements, task dependencies, and time estimates
   - All task states persist to localStorage automatically

### Component Organization

```
components/
├── ui/              # Shadcn UI primitives (Button, Card, Sheet, etc.)
├── navigation/      # TopNav, BottomNav, Breadcrumbs, SearchBar, BackButton
├── dashboard/       # Dashboard-specific components (MyActivities, DashboardHeader, etc.)
├── activities/      # Activity tracking, photo upload, issue reporting
├── homes/           # Home details, access info, damages, media
├── settings/        # Settings and preferences
└── theme/           # Theme provider and toggle
```

### Navigation Structure

The app uses a mobile-first navigation pattern:

- **TopNav**: Displays on all pages, contains breadcrumbs and user menu
- **BottomNav**: Mobile navigation bar with 5 main sections (Home, Activities, Search, Manage, Profile)
- **Breadcrumbs**: Automatic breadcrumb generation based on route structure

### Toast Notifications

The app uses **Sonner** for toast notifications. The `<Toaster />` is configured in `app/layout.tsx` with:
- Position: top-center
- Rich colors enabled

Usage:
```tsx
import { toast } from "sonner"

toast.success("Success message", {
  description: "Additional details",
  duration: 3000,
})
```

### Recent Searches Feature

Search functionality (`app/search/page.tsx`) includes recent searches:
- Stored in localStorage with key: `recent-searches`
- Max 5 searches saved
- Dropdown appears on input focus
- Individual remove and "Clear all" functionality
- Click-outside detection to close dropdown

### localStorage Keys Reference

Understanding localStorage keys is critical for debugging:

- `activity-tracker-draft-{homeId}-{activityType}` - Active activity draft data
- `activity-closed-{homeId}-{activityType}` - Marks activity as closed (won't show in FloatingActivityIsland)
- `incomplete-activities` - Array of saved incomplete activities
- `recent-searches` - Array of recent search queries (max 5)

### Styling Approach

- **Tailwind CSS** for all styling
- **Shadcn UI** components use `class-variance-authority` for variant management
- Mobile-first responsive design using Tailwind breakpoints (sm, md, lg)
- Dark mode support via `next-themes` (system, light, dark)
- Utility function `cn()` from `lib/utils.ts` for conditional class merging

### Important Data Type Mismatches

Note: There's a discrepancy between activity types in different files:
- `lib/test-data.ts` uses: `"provisioning" | "meet-greet" | "turn" | "deprovision" | "ad-hoc"`
- `lib/activity-templates.ts` uses: `"adhoc" | "deprovisioning" | "meet-greet" | "maid-service" | "provisioning" | "turn"`

When working with activities, prefer the template types and ensure consistency.

### Photo Upload System

Photos are managed through:
- `PhotoUploader` component for capturing/uploading photos
- `UploadQueue` for batch upload management
- Photos stored per-task in activity state
- Photo status: "uploading" | "uploaded" | "failed"

### Maps and Location

- **Property maps**: Uses OpenStreetMap embed in `components/homes/HomeAccess.tsx`
- **Directions**: Google Maps Directions API integration
- **Area overview**: Leaflet map in `components/dashboard/DashboardMap.tsx` (collapsible)

## Common Patterns

### Reading Files in This Codebase

When making changes:
1. Always read the file first before editing
2. Check related type definitions in `lib/test-data.ts` and `lib/activity-templates.ts`
3. Verify localStorage key patterns in `lib/activity-utils.ts`
4. Test on mobile viewport (the primary use case)

### Adding New Activity Types

1. Update `ActivityType` in `lib/activity-templates.ts`
2. Add template definition in `activityTemplates` object
3. Update `ActivityType` in `lib/test-data.ts` (keep in sync)
4. Add icon and color config in `components/dashboard/MyActivities.tsx` (`activityTypeConfig`)

### Working with Forms

Forms use:
- `react-hook-form` for form state
- `zod` for validation
- Shadcn UI form components from `components/ui/form.tsx`

Example pattern:
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

## Key Features to Preserve

1. **Incomplete Activity Tracking**: Users can save and close activities mid-workflow
2. **FloatingActivityIsland**: Always visible when there's an active activity (except on tracker page)
3. **Mobile-first Design**: All UI must work well on mobile devices
4. **Dark Mode**: All components support dark mode
5. **Recent Searches**: Search input shows recent searches on focus
6. **Photo Requirements**: Activities enforce required photo counts per task
7. **Task Dependencies**: Some tasks cannot be started until dependencies complete
8. **localStorage Persistence**: All activity progress survives page refreshes

## Testing Considerations

- Test on mobile viewport (primary use case)
- Test dark mode for all new components
- Test localStorage persistence by refreshing during activities
- Test network access using `npm run dev:network` for mobile device testing
- Verify FloatingActivityIsland shows/hides correctly based on activity state
