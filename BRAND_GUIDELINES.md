# Brand Guidelines

This document defines the visual identity and design system for the Staff Management Application. All components, pages, and features should adhere to these guidelines to maintain consistency across the platform.

---

## Table of Contents

1. [Color System](#1-color-system)
2. [Typography](#2-typography)
3. [Spacing System](#3-spacing-system)
4. [Component Styles](#4-component-styles)
5. [Activity Type Colors](#5-activity-type-colors)
6. [Icons](#6-icons)
7. [Shadows & Borders](#7-shadows--borders)
8. [Animation & Transitions](#8-animation--transitions)
9. [Mobile-First Patterns](#9-mobile-first-patterns)
10. [Dark Mode](#10-dark-mode)
11. [Special Effects](#11-special-effects)

---

## 1. Color System

The application uses a warm, earthy color palette that conveys professionalism while remaining approachable. All colors are defined as CSS variables in `app/globals.css` and automatically switch between light and dark modes.

### Primary Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| **Background** | `#F8F3E6` | `#262423` | Page backgrounds |
| **Foreground** | `#4A4035` | `#B8AA9F` | Primary text |
| **Primary** | `#D87D4A` | `#F4A261` | CTAs, links, active states |
| **Primary Foreground** | `#FFFFFF` | `#FFFFFF` | Text on primary |

### Secondary & Accent

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| **Secondary** | `#E8DFD5` | `#E8D5C4` | Secondary buttons, tags |
| **Secondary Foreground** | `#5A5450` | `#2D2C2A` | Text on secondary |
| **Accent** | `#E8DFD5` | `#1A1918` | Hover states, highlights |
| **Accent Foreground** | `#2C2520` | `#F5EEE8` | Text on accent |

### Utility Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| **Muted** | `#EBE3D9` | `#1A1918` | Disabled states, subtle backgrounds |
| **Muted Foreground** | `#6B6561` | `#AEA39E` | Secondary text, placeholders |
| **Border** | `#EAEAEA` | `#3B3A38` | Dividers, card borders |
| **Input** | `#CCCCCC` | `#404038` | Form input borders |
| **Ring** | `#FF9B6B` | `#FFAD85` | Focus rings |

### Status Colors

| Token | Value | Usage |
|-------|-------|-------|
| **Destructive** | `#FF4D4D` | Delete actions, errors |
| **Destructive Foreground** | `#FFFFFF` | Text on destructive |
| **Success** | `#22C55E` (green-500) | Success states, active indicators |
| **Warning** | `#F59E0B` (amber-500) | Warnings, incomplete states |

### Chart Colors

For data visualizations:

| Token | Value | HSL |
|-------|-------|-----|
| Chart 1 | `#C85A1A` | `hsl(16 57% 44%)` |
| Chart 2 | `#B4A7FF` | `hsl(247 73% 75%)` |
| Chart 3 | `#E8D9C3` | `hsl(48 26% 82%)` |
| Chart 4 | `#E0D5F0` | `hsl(260 48% 88%)` |
| Chart 5 | `#C55D1A` | `hsl(16 60% 44%)` |

### CSS Variable Usage

```tsx
// Use semantic color classes (preferred)
<div className="bg-background text-foreground" />
<button className="bg-primary text-primary-foreground" />
<span className="text-muted-foreground" />

// Direct HSL access when needed
<div style={{ backgroundColor: 'hsl(var(--primary))' }} />
```

---

## 2. Typography

### Font Families

| Family | Font Stack | Usage |
|--------|------------|-------|
| **Sans** (default) | `Zalando Sans, system-ui, -apple-system, sans-serif` | Body text, UI elements |
| **Serif** | `Adamina, ui-serif, serif` | Accent headings, quotes |
| **Mono** | `Fira Code, ui-monospace, monospace` | Code, technical data |

### Type Scale

| Name | Class | Size | Line Height | Usage |
|------|-------|------|-------------|-------|
| **Display** | `text-3xl` | 30px | 36px | Hero headings |
| **H1** | `text-2xl` | 24px | 32px | Page titles |
| **H2** | `text-xl` | 20px | 28px | Section headings |
| **H3** | `text-lg` | 18px | 28px | Card titles |
| **Body** | `text-base` | 16px | 24px | Default body text |
| **Small** | `text-sm` | 14px | 20px | Secondary text |
| **XSmall** | `text-xs` | 12px | 16px | Labels, badges, metadata |

### Font Weights

| Weight | Class | Usage |
|--------|-------|-------|
| **Regular** | `font-normal` (400) | Body text |
| **Medium** | `font-medium` (500) | UI elements, emphasis |
| **Semibold** | `font-semibold` (600) | Headings, card titles |
| **Bold** | `font-bold` (700) | Page titles, strong emphasis |

### Responsive Typography

```tsx
// Page title - scales up on larger screens
<h1 className="text-2xl sm:text-3xl font-bold">Page Title</h1>

// Card title - responsive sizing
<h2 className="text-base sm:text-lg font-semibold">Card Title</h2>

// Body text - consistent across sizes
<p className="text-sm sm:text-base text-muted-foreground">Description</p>
```

### Typography Patterns

```tsx
// Page title
<h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>

// Card title
<h3 className="font-semibold leading-none tracking-tight">Activity Details</h3>

// Form label
<label className="text-sm font-medium">Email Address</label>

// Helper text
<p className="text-[0.8rem] text-muted-foreground">Optional field</p>

// Error message
<p className="text-[0.8rem] font-medium text-destructive">Required field</p>
```

---

## 3. Spacing System

The spacing system is based on Tailwind's 4px base unit. Consistent spacing creates visual rhythm and hierarchy.

### Spacing Scale

| Token | Value | Common Usage |
|-------|-------|--------------|
| `0.5` | 2px | Tight text spacing |
| `1` | 4px | Icon-text gap, minimal |
| `1.5` | 6px | Tight grouping |
| `2` | 8px | Small component padding |
| `2.5` | 10px | Nested content |
| `3` | 12px | Card padding (mobile) |
| `4` | 16px | Standard padding |
| `5` | 20px | Medium spacing |
| `6` | 24px | Generous spacing |
| `8` | 32px | Section breaks |

### Component Spacing Patterns

#### Cards
```tsx
// Standard card
<Card>
  <CardHeader className="p-4 sm:p-6">
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent className="p-4 pt-0">
    Content
  </CardContent>
</Card>

// Compact card (nested)
<Card>
  <CardContent className="p-2.5 sm:p-3">
    Nested content
  </CardContent>
</Card>
```

#### Page Layout
```tsx
// Page container
<div className="container mx-auto px-4 sm:px-3 md:px-4">
  <div className="py-3 sm:py-4 md:py-6 lg:py-8">
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Sections */}
    </div>
  </div>
</div>
```

#### Lists & Groups
```tsx
// Vertical list
<div className="space-y-2">{/* Items */}</div>

// Form items
<div className="space-y-4">{/* Form fields */}</div>

// Horizontal group
<div className="flex gap-2">{/* Items */}</div>

// Icon + text
<div className="flex items-center gap-1.5">
  <Icon className="h-4 w-4" />
  <span>Label</span>
</div>
```

---

## 4. Component Styles

### Buttons

Located in `components/ui/button.tsx`

#### Variants

| Variant | Classes | Usage |
|---------|---------|-------|
| **default** | `bg-primary text-primary-foreground hover:bg-primary/90` | Primary actions |
| **secondary** | `bg-muted text-foreground hover:bg-secondary/80` | Secondary actions |
| **outline** | `border border-input bg-background hover:bg-accent` | Tertiary actions |
| **ghost** | `hover:bg-accent hover:text-accent-foreground` | Subtle actions |
| **destructive** | `bg-destructive text-destructive-foreground` | Delete, danger |
| **link** | `text-primary underline-offset-4 hover:underline` | Inline links |

#### Sizes

| Size | Classes | Usage |
|------|---------|-------|
| **sm** | `h-8 rounded-md px-4 text-xs` | Compact buttons |
| **default** | `h-8 px-4 py-2` | Standard buttons |
| **lg** | `h-8 rounded-md px-6` | Prominent buttons |
| **icon** | `h-9 w-9` | Icon-only buttons |

#### Usage Examples

```tsx
// Primary action
<Button variant="default">Start Activity</Button>

// Secondary action
<Button variant="secondary">Save Draft</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Edit className="h-4 w-4" />
</Button>

// Destructive action
<Button variant="destructive">Delete</Button>
```

### Cards

Located in `components/ui/card.tsx`

```tsx
<Card className="rounded-xl border bg-card text-card-foreground shadow-lg">
  <CardHeader className="flex flex-col space-y-1.5 p-4 sm:p-6">
    <CardTitle className="font-semibold leading-none tracking-tight">
      Title
    </CardTitle>
    <CardDescription className="text-sm text-muted-foreground">
      Description
    </CardDescription>
  </CardHeader>
  <CardContent className="p-4 pt-0">
    Content
  </CardContent>
  <CardFooter className="flex items-center p-4 pt-0">
    Footer
  </CardFooter>
</Card>
```

### Inputs

Located in `components/ui/input.tsx`

```tsx
<Input
  className="flex h-10 w-full rounded-md border border-input bg-transparent
             px-3 py-1 text-base shadow-sm transition-colors
             placeholder:text-muted-foreground
             focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
             disabled:cursor-not-allowed disabled:opacity-50
             md:text-sm"
/>
```

### Badges

Located in `components/ui/badge.tsx`

| Variant | Classes | Usage |
|---------|---------|-------|
| **default** | `bg-primary text-primary-foreground` | Primary badges |
| **secondary** | `bg-secondary text-secondary-foreground` | Neutral badges |
| **destructive** | `bg-destructive text-destructive-foreground` | Error badges |
| **outline** | `border text-foreground` | Subtle badges |

```tsx
// Count badge
<Badge variant="secondary">{count}</Badge>

// Status badge
<Badge variant="destructive">Urgent</Badge>

// Notification badge (positioned)
<Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0">
  3
</Badge>
```

### Sheets (Bottom Drawers)

Located in `components/ui/sheet.tsx`

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent
    side="bottom"
    className="rounded-t-3xl"
  >
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
      <SheetDescription>Description</SheetDescription>
    </SheetHeader>
    {/* Content */}
  </SheetContent>
</Sheet>
```

**Sheet sides:**
- `bottom` - Mobile-optimized, accounts for bottom nav
- `right` - Side panel for desktop
- `left` - Navigation drawer
- `top` - Notifications, alerts

---

## 5. Activity Type Colors

Each activity type has a designated color for instant visual recognition. These colors are consistent across light and dark modes.

| Activity Type | Color | Hex | Usage |
|---------------|-------|-----|-------|
| **Provisioning** | Light Orange | `#F4B183` | Property setup |
| **Deprovisioning** | Light Blue | `#A1C6E7` | Property teardown |
| **Turn** | Light Purple | `#B4A7D6` | Turnover cleaning |
| **Maid Service** | Light Green | `#C5E0B4` | Regular cleaning |
| **Touch-up** | Light Yellow | `#FFE699` | Quick refresh |
| **Meet & Greet** | Cyan | `#46BDC6` | Guest welcome |
| **Bag Drop** | Light Cyan | `#7DD2D9` | Luggage handling |
| **Viewing** | Light Pink | `#FFCCCC` | Property tours |
| **Service Recovery** | Bright Yellow | `#FFD521` | Issue resolution |
| **Mini Maid** | Very Light Green | `#E2F0D9` | Light cleaning |
| **Ad-hoc** | Gray | `#AFABAB` | Miscellaneous |
| **Quality Check** | Pink-Red | `#FF9393` | Inspections |
| **Additional Greet** | Light Cyan | `#B2E4E8` | Extra welcomes |

### Implementation

```tsx
// Activity card with colored left border
<Card className="border-l-[6px]" style={{ borderLeftColor: '#F4B183' }}>
  {/* Provisioning activity content */}
</Card>

// Activity type config object
const activityTypeConfig = {
  provisioning: { color: '#F4B183', icon: Package },
  turn: { color: '#B4A7D6', icon: RefreshCw },
  'meet-greet': { color: '#46BDC6', icon: Users },
  // ...
}
```

---

## 6. Icons

### Icon Library

The application uses **Lucide React** (`lucide-react`) for all iconography.

### Size Scale

| Size | Class | Pixels | Usage |
|------|-------|--------|-------|
| **XS** | `h-3 w-3` | 12px | Tiny indicators |
| **SM** | `h-4 w-4` | 16px | Default, inline icons |
| **MD** | `h-5 w-5` | 20px | Navigation, buttons |
| **LG** | `h-6 w-6` | 24px | Featured icons |
| **XL** | `h-8 w-8` | 32px | Hero elements |

### Color Patterns

```tsx
// Primary colored icon
<Icon className="h-4 w-4 text-primary" />

// Muted icon
<Icon className="h-4 w-4 text-muted-foreground" />

// Interactive icon
<Icon className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />

// Status icon
<Icon className="h-4 w-4 text-green-500" />
```

### Common Icons by Category

**Navigation:**
- `Home` - Dashboard
- `BookOpen` - Catalog
- `Target` - Activities
- `Play` - Current task
- `Settings` - Settings
- `User` - Profile

**Actions:**
- `Plus` - Add/Create
- `Edit` / `Pencil` - Edit
- `Trash2` - Delete
- `X` - Close/Cancel
- `Check` - Confirm/Complete
- `ChevronRight` - Navigate forward
- `ChevronDown` - Expand

**Content:**
- `Calendar` - Dates
- `Clock` - Time
- `MapPin` - Location
- `Users` - People/Guests
- `Key` - Access
- `Bell` - Notifications
- `Camera` - Photos
- `FileText` - Documents

**Status:**
- `AlertCircle` - Warning
- `Info` - Information
- `CheckCircle` - Success
- `XCircle` - Error

---

## 7. Shadows & Borders

### Border Radius

| Token | Value | Class | Usage |
|-------|-------|-------|-------|
| **sm** | 6px | `rounded-sm` | Small elements |
| **md** | 8px | `rounded-md` | Buttons, inputs |
| **lg** | 10px | `rounded-lg` | Cards (default) |
| **xl** | 16px | `rounded-xl` | Cards (preferred) |
| **2xl** | 20px | `rounded-2xl` | Large containers |
| **3xl** | 24px | `rounded-3xl` | Sheets, modals |
| **full** | 9999px | `rounded-full` | Avatars, pills |

### Border Colors

```tsx
// Standard border
<div className="border border-border" />

// Input border
<input className="border border-input" />

// Primary border
<div className="border-2 border-primary" />

// Activity color border
<div className="border-l-[6px]" style={{ borderLeftColor: activityColor }} />
```

### Shadow Scale

| Token | Class | Usage |
|-------|-------|-------|
| **None** | `shadow-none` | Flat elements |
| **SM** | `shadow-sm` | Subtle elevation |
| **Default** | `shadow` | Standard elevation |
| **MD** | `shadow-md` | Medium elevation |
| **LG** | `shadow-lg` | Cards, dropdowns |
| **XL** | `shadow-xl` | Modals, sheets |
| **2XL** | `shadow-2xl` | Fixed navigation |

### Common Patterns

```tsx
// Standard card
<Card className="rounded-xl border shadow-lg" />

// Floating element
<div className="rounded-lg shadow-xl" />

// Subtle card
<Card className="rounded-lg border shadow-sm" />

// No shadow (flat)
<div className="rounded-md border shadow-none" />
```

---

## 8. Animation & Transitions

### Transition Classes

| Class | Duration | Usage |
|-------|----------|-------|
| `transition-colors` | 150ms | Color/background changes |
| `transition-opacity` | 150ms | Fade effects |
| `transition-transform` | 150ms | Scale/position changes |
| `transition-all` | 150ms | Multiple properties |
| `duration-200` | 200ms | Quick interactions |
| `duration-300` | 300ms | Standard animations |
| `duration-500` | 500ms | Sheet open animations |

### Standard Hover Transitions

```tsx
// Color transition
<button className="hover:bg-primary/90 transition-colors" />

// Opacity transition
<div className="opacity-70 hover:opacity-100 transition-opacity" />

// Scale on press
<button className="active:scale-95 transition-transform" />
```

### Custom Keyframe Animations

#### Bounce In
```css
.animate-bounce-in {
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```
Usage: Entry animations for floating elements

#### Float
```css
.animate-float {
  animation: float 3s ease-in-out infinite;
}
```
Usage: Subtle floating effect for attention

#### Pulse Glow
```css
.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
```
Usage: Active state indicators, CTAs

### Sheet/Modal Animations

```tsx
// Sheet animations (automatic via Radix)
data-[state=open]:animate-in
data-[state=closed]:animate-out
slide-in-from-bottom  // Bottom sheet entry
slide-out-to-bottom   // Bottom sheet exit
fade-in-0            // Overlay fade in
fade-out-0           // Overlay fade out
```

### Activity Indicator

```tsx
// Pulsing active indicator
<span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
```

---

## 9. Mobile-First Patterns

### Breakpoints

| Prefix | Min Width | Target |
|--------|-----------|--------|
| (none) | 0px | Mobile (default) |
| `sm:` | 640px | Large phones, small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Desktops |
| `xl:` | 1280px | Large desktops |

### Responsive Patterns

#### Layout Switching
```tsx
// Stack on mobile, row on tablet+
<div className="flex flex-col sm:flex-row gap-4" />

// Hide on mobile, show on desktop
<div className="hidden md:block" />

// Show on mobile, hide on desktop
<div className="md:hidden" />
```

#### Responsive Spacing
```tsx
// Responsive padding
<div className="p-4 sm:p-6 md:p-8" />

// Responsive gap
<div className="gap-4 sm:gap-6 md:gap-8" />

// Responsive text
<h1 className="text-2xl sm:text-3xl" />
```

### Touch Targets

Minimum touch target size: **44px × 44px** (recommended)

```tsx
// Icon button with adequate touch target
<Button variant="ghost" size="icon" className="h-11 w-11">
  <Icon className="h-5 w-5" />
</Button>

// List item with touch-friendly padding
<div className="py-3 px-4 min-h-[44px]" />
```

### Bottom Navigation

The app uses a fixed bottom navigation on mobile:

```tsx
<nav className="fixed bottom-0 left-0 right-0 h-16 md:hidden">
  {/* 4-column grid of nav items */}
</nav>
```

**Important:** Account for bottom nav in page content:
```tsx
// Add bottom padding on mobile for nav clearance
<main className="pb-20 md:pb-0" />
```

### Sheet Positioning

```tsx
// Bottom sheet accounts for bottom nav
<SheetContent
  side="bottom"
  className="bottom-16 md:bottom-0 rounded-t-3xl"
/>

// Extra padding for mobile content
<div className="pb-48 md:pb-6">
  {/* Content above bottom nav */}
</div>
```

---

## 10. Dark Mode

### Implementation

Dark mode is implemented using `next-themes` with CSS variables that automatically switch.

```tsx
// Theme provider setup (in layout)
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### Color Variable Structure

All colors in `globals.css` have light and dark variants:

```css
:root {
  --background: 48 50% 97%;    /* Light cream */
  --foreground: 48 20% 20%;    /* Dark brown */
}

.dark {
  --background: 60 3% 15%;     /* Dark gray */
  --foreground: 48 13% 74%;    /* Light tan */
}
```

### Using Theme Colors

```tsx
// These automatically switch in dark mode:
<div className="bg-background text-foreground" />
<div className="bg-card border-border" />
<button className="bg-primary text-primary-foreground" />

// Manual dark mode overrides (rarely needed):
<div className="bg-white dark:bg-gray-900" />
```

### Testing Dark Mode

1. Toggle via system preferences
2. Use the theme toggle component in settings
3. Test all color combinations for contrast
4. Verify shadows and borders are visible

---

## 11. Special Effects

### Liquid Glass Navigation

The bottom navigation uses a frosted glass effect:

```css
.liquid-glass-nav {
  background: rgba(250, 249, 245, 0.95);
  backdrop-filter: blur(33px) saturate(180%);
  -webkit-backdrop-filter: blur(33px) saturate(180%);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 -4px 30px rgba(0, 0, 0, 0.1),
    0 -2px 10px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.dark .liquid-glass-nav {
  background: rgba(15, 15, 15, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 -4px 30px rgba(0, 0, 0, 0.3),
    0 -2px 10px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### Background Texture

A subtle diagonal pattern overlay adds texture:

```css
html::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.04;
  background-image: repeating-linear-gradient(
    45deg,
    currentColor 0,
    currentColor 1px,
    transparent 0,
    transparent 50%
  );
  background-size: 4.8px 4.8px;
}
```

### Haptic Feedback

Interactive elements include haptic feedback for mobile:

```tsx
import { triggerHaptic } from '@/lib/haptics'

// Medium feedback for standard actions
<Button onClick={() => triggerHaptic('medium')}>
  Submit
</Button>

// Error feedback for destructive actions
<Button
  variant="destructive"
  onClick={() => triggerHaptic('error')}
>
  Delete
</Button>
```

---

## Quick Reference

### Common Class Combinations

```tsx
// Page title
"text-2xl sm:text-3xl font-bold"

// Card
"rounded-xl border bg-card shadow-lg"

// Primary button
"bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"

// Form input
"h-10 rounded-md border border-input bg-transparent px-3 focus-visible:ring-1"

// Icon button
"h-9 w-9 rounded-md hover:bg-accent transition-colors"

// Badge
"inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium"

// Muted text
"text-sm text-muted-foreground"

// Activity card border
"border-l-[6px]" + style={{ borderLeftColor }}

// Bottom nav item
"flex flex-col items-center gap-1 text-xs transition-colors"
```

### Design Checklist

- [ ] Uses semantic color classes (not hardcoded values)
- [ ] Responsive with mobile-first approach
- [ ] Touch targets ≥ 44px
- [ ] Dark mode tested and working
- [ ] Consistent spacing using scale
- [ ] Proper focus states for accessibility
- [ ] Transitions on interactive elements
- [ ] Activity types use designated colors

---

## File References

| File | Contents |
|------|----------|
| `app/globals.css` | CSS variables, keyframes, special effects |
| `tailwind.config.ts` | Theme extensions, fonts, colors |
| `components/ui/` | Shadcn UI component definitions |
| `lib/utils.ts` | `cn()` utility for class merging |

---

*Last updated: December 2024*
