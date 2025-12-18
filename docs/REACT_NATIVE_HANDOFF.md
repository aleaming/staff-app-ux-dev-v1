# React Native Handoff Documentation

> **Staff App UX** - Property Operations Management Application
>
> This documentation provides everything needed to rebuild this Next.js application in React Native.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Reference](#quick-reference)
3. [Documentation Index](#documentation-index)
4. [Getting Started](#getting-started)
5. [Architecture Summary](#architecture-summary)
6. [Migration Priority](#migration-priority)

---

## Project Overview

### What This App Does

A mobile-first staff management application for vacation rental operations. Staff use it to:

- **Track Activities**: Provisioning homes, guest meet-greets, turnovers, cleaning
- **Manage Properties**: View property details, access codes, WiFi, instructions
- **Handle Bookings**: View guest info, special requests, booking notes
- **Report Issues**: Document damages, maintenance needs with photos
- **Navigate Work**: Dashboard with today's activities, map view, search

### Target Users

Operations staff managing 50+ properties across multiple markets. Primary usage is on mobile devices in the field.

### Tech Stack (Current)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI Components | Shadcn UI + Radix UI |
| Styling | Tailwind CSS 4 |
| State | React Context + localStorage |
| Data | CSV files (mock data) |
| Maps | Leaflet + Google Maps |
| Forms | React Hook Form + Zod |

---

## Quick Reference

### Brand Colors

| Token | Light Mode | Dark Mode | Use |
|-------|------------|-----------|-----|
| **Primary** | `#E8732E` | `#E8853D` | Actions, CTAs |
| **Background** | `#FAF9F5` | `#262626` | Page backgrounds |
| **Foreground** | `#3D3832` | `#C4BEB4` | Text |
| **Destructive** | `#EF4444` | `#DC4747` | Errors, delete |

### Fonts

| Usage | Font Family |
|-------|-------------|
| Primary UI | Zalando Sans |
| Serif Accent | Adamina |
| Monospace | Fira Code |

### Spacing Scale (Base: 4px)

```
4px  → xs
8px  → sm
12px → md
16px → lg
24px → xl
32px → 2xl
```

### Component Sizes

| Component | Height | Touch Target |
|-----------|--------|--------------|
| Button (default) | 32px | 44px min |
| Button (icon) | 36px | 36px |
| Input | 40px | 44px min |
| Badge | auto | N/A |

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Complete design tokens, colors, typography, spacing |
| [COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md) | All 85+ components with purposes and patterns |
| [DATA_MODELS.md](./DATA_MODELS.md) | TypeScript interfaces, data structures, APIs |
| [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) | Context providers, localStorage patterns |
| [NAVIGATION.md](./NAVIGATION.md) | Routes, navigation patterns, deep linking |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) | React Native equivalents and migration steps |

---

## Getting Started

### Run the Existing App

```bash
# Install dependencies
npm install

# Run dev server (mobile testing)
npm run dev:network

# Access from mobile at http://<your-ip>:3000
```

### Key Directories

```
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                 # Shadcn primitives (Button, Card, etc.)
│   ├── activities/         # Activity tracking system
│   ├── navigation/         # TopNav, BottomNav, Search
│   ├── dashboard/          # Dashboard widgets
│   ├── homes/              # Property details
│   └── bookings/           # Booking info
├── lib/
│   ├── data/               # Data loaders and context
│   ├── test-data.ts        # Type definitions
│   └── activity-templates.ts # Activity workflows
└── public/data/            # CSV mock data files
```

---

## Architecture Summary

### Component Hierarchy

```
LayoutClient
├── ThemeProvider (dark/light mode)
├── HapticProvider (vibration feedback)
├── DataProvider (CSV data context)
├── GoogleMapsProvider
├── TopNav
├── {Page Content}
├── FloatingActivityIsland (active activity indicator)
├── BottomNav
└── Toaster (notifications)
```

### Data Flow

```
CSV Files → Loaders → DataProvider Context → Components
                              ↓
                       localStorage (drafts, preferences)
```

### Activity System Flow

```
Select Activity Type
       ↓
Start Activity (creates localStorage draft)
       ↓
Complete Tasks (photos, notes, checkboxes)
       ↓
[Save & Close] OR [Complete Activity]
       ↓
If saved: Added to "Incomplete Activities"
If completed: Draft cleared, success notification
```

---

## Migration Priority

### Phase 1: Core Infrastructure
1. Navigation structure (Tab Navigator + Stack)
2. Theme system (dark/light mode)
3. Data layer (AsyncStorage instead of localStorage)
4. UI primitives (Button, Card, Input, Badge)

### Phase 2: Main Features
1. Dashboard with activity list
2. Activity tracker with task completion
3. Home details sheets
4. Search functionality

### Phase 3: Advanced Features
1. Photo upload with compression
2. Map integration
3. Issue reporting
4. Meet & Greet forms

### Phase 4: Polish
1. Haptic feedback
2. Animations and transitions
3. Offline support
4. Push notifications

---

## Key Differences: Next.js → React Native

| Feature | Next.js | React Native |
|---------|---------|--------------|
| Routing | App Router | React Navigation |
| Styling | Tailwind CSS | StyleSheet / NativeWind |
| Storage | localStorage | AsyncStorage |
| Forms | React Hook Form | Same (compatible) |
| Maps | Leaflet/Google | react-native-maps |
| Photos | File input | expo-image-picker |
| Haptics | Vibration API | expo-haptics |
| Sheets | Radix Sheet | Bottom Sheet library |

---

## Questions?

Review the detailed documentation files for comprehensive information on each topic. The design system document includes exact color values, the component architecture shows all components with their props, and the migration guide provides React Native equivalents for each pattern.
