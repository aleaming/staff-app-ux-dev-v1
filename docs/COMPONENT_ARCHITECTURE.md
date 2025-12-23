# Component Architecture Documentation

> Complete inventory of 85+ components with React Native migration notes

---

## 1. Component Directory Structure

```
components/
├── ui/                    # Shadcn UI primitives (24 components)
├── activities/            # Activity tracking (17 components)
├── navigation/            # Navigation (7 components)
├── dashboard/             # Dashboard widgets (7 components)
├── homes/                 # Property details (11 components)
├── bookings/              # Booking info (3 components)
├── property/              # Property management (7 components)
├── settings/              # User settings (2 components)
├── layout/                # Layout wrappers (1 component)
├── theme/                 # Theme system (2 components)
├── map/                   # Maps (2 components)
└── haptic/                # Haptic feedback (1 component)
```

---

## 2. UI Primitives (Shadcn Components)

These are the foundation components. Replace with React Native equivalents.

| Component | File | RN Equivalent |
|-----------|------|---------------|
| **Accordion** | `ui/accordion.tsx` | `react-native-collapsible` |
| **Alert** | `ui/alert.tsx` | Custom View + Text |
| **Avatar** | `ui/avatar.tsx` | `Image` with fallback |
| **Badge** | `ui/badge.tsx` | Custom View + Text |
| **Button** | `ui/button.tsx` | `Pressable` / `TouchableOpacity` |
| **Card** | `ui/card.tsx` | Custom View |
| **Checkbox** | `ui/checkbox.tsx` | `expo-checkbox` or custom |
| **Collapsible** | `ui/collapsible.tsx` | `react-native-collapsible` |
| **Dialog** | `ui/dialog.tsx` | `Modal` / `react-native-modal` |
| **Dropdown** | `ui/dropdown-menu.tsx` | `react-native-dropdown-picker` |
| **Form** | `ui/form.tsx` | `react-hook-form` (compatible) |
| **Input** | `ui/input.tsx` | `TextInput` |
| **Label** | `ui/label.tsx` | `Text` |
| **Logo** | `ui/logo.tsx` | `Image` / SVG |
| **Menubar** | `ui/menubar.tsx` | Custom implementation |
| **Progress** | `ui/progress.tsx` | `ProgressBar` / custom View |
| **RadioGroup** | `ui/radio-group.tsx` | Custom Pressables |
| **Select** | `ui/select.tsx` | `react-native-picker-select` |
| **Separator** | `ui/separator.tsx` | `View` with border |
| **Sheet** | `ui/sheet.tsx` | `@gorhom/bottom-sheet` |
| **Skeleton** | `ui/skeleton.tsx` | Animated View |
| **Switch** | `ui/switch.tsx` | `Switch` component |
| **Tabs** | `ui/tabs.tsx` | `react-native-tab-view` |
| **Textarea** | `ui/textarea.tsx` | `TextInput` multiline |

---

## 3. Activity System Components

The core feature of the app. Highest migration priority.

### 3.1 Main Components

| Component | Purpose | Complexity |
|-----------|---------|------------|
| **ActivityTracker** | Main tracking interface with phases and tasks | High |
| **ActivityTypeSelector** | Color-coded activity type selection | Medium |
| **ActivitySwitchDialog** | Switch between activities | Low |
| **TaskCard** | Individual task with photo/notes | High |
| **PhaseSection** | Collapsible phase with tasks | Medium |
| **ProgressIndicator** | Task progress bar | Low |

### 3.2 Photo Components

| Component | Purpose | RN Equivalent |
|-----------|---------|---------------|
| **PhotoUploader** | Capture/upload photos | `expo-image-picker` |
| **PhotoGallery** | Carousel with navigation | `react-native-image-gallery` |
| **PhotoAnnotation** | Mark up photos | Custom canvas or library |
| **UploadQueue** | Batch upload manager | Custom with AsyncStorage |

### 3.3 Supporting Components

| Component | Purpose |
|-----------|---------|
| **RoomChecklist** | Room-by-room tasks |
| **PropertyInfoCard** | Property info in activity |
| **MeetGreetReportForm** | M&G form submission |
| **PreActivityConfirmationModal** | Pre-start confirmation |
| **IssueReportSheet** | Issue reporting |
| **TaskPreviewSheet** | Task detail preview |
| **ScrollContextIndicator** | Scroll position indicator |

### 3.4 ActivityTracker Props (Key Component)

```typescript
interface ActivityTrackerProps {
  homeId: string;
  homeCode: string;
  homeName?: string;
  activityType: ActivityType;
  template: ActivityTemplate;

  // Callbacks
  onTaskComplete: (taskId: string) => void;
  onTaskUncomplete: (taskId: string) => void;
  onPhotoAdd: (taskId: string, photo: Photo) => void;
  onPhotoRemove: (taskId: string, photoId: string) => void;
  onNoteChange: (taskId: string, note: string) => void;
  onIssueReport: (taskId: string, issue: Issue) => void;
  onActivityComplete: () => void;
  onSaveAndClose: () => void;
}
```

---

## 4. Navigation Components

### 4.1 Component List

| Component | Purpose | RN Equivalent |
|-----------|---------|---------------|
| **TopNav** | Header with logo, search, user menu | `@react-navigation` header |
| **BottomNav** | Tab navigation with activity indicator | Tab Navigator |
| **SearchBar** | Global search input | `TextInput` with handlers |
| **GlobalSearchSheet** | Full-screen search | Stack screen or modal |
| **Breadcrumbs** | Path navigation | Custom breadcrumb row |
| **BreadcrumbEllipsis** | Truncated breadcrumbs | Pressable with popover |
| **BackButton** | Navigation back | `navigation.goBack()` |

### 4.2 BottomNav Configuration

```typescript
const bottomNavItems = [
  { id: 'home', label: 'Home', icon: 'Home', href: '/' },
  { id: 'activities', label: 'Activities', icon: 'ClipboardList', href: '/activities' },
  { id: 'search', label: 'Search', icon: 'Search', href: '/search' },
  { id: 'manage', label: 'Manage', icon: 'Settings', href: '/manage' },
  { id: 'profile', label: 'Profile', icon: 'User', href: '/profile' },
];
```

---

## 5. Dashboard Components

| Component | Purpose | Data Source |
|-----------|---------|-------------|
| **DashboardHeader** | Greeting, date, weather | API + Date |
| **MyActivities** | Activity list with filters | DataProvider |
| **BookingOverview** | Booking summary | DataProvider |
| **NotificationsMessages** | Notification feed | DataProvider |
| **RecentlyAccessed** | Recent items | localStorage |
| **DashboardMap** | Leaflet property map | DataProvider |
| **WeatherDetailsSheet** | Weather details | Open-Meteo API |

### 5.1 MyActivities Configuration

Activity type styling configuration:

```typescript
const activityTypeConfig = {
  'provisioning': {
    icon: 'Package',
    color: 'bg-[var(--activity-provisioning)]',
    label: 'Provisioning',
  },
  'meet-greet': {
    icon: 'Users',
    color: 'bg-[var(--activity-greet)]',
    label: 'Meet & Greet',
  },
  'turn': {
    icon: 'RefreshCw',
    color: 'bg-[var(--activity-turn)]',
    label: 'Turn',
  },
  // ... more types
};
```

---

## 6. Home/Property Components

### 6.1 Component List

| Component | Purpose |
|-----------|---------|
| **HomeInfoSheet** | Tabbed home details |
| **HomeAccess** | Entry codes, map, instructions |
| **HomeEssentials** | WiFi, parking, check-out |
| **HomeRules** | House rules |
| **HomeMedia** | Photo gallery |
| **PhotoLightbox** | Full-screen photo viewer |
| **DamagesNotificationBanner** | Damage alert banner |
| **DamagesSheet** | Damage report details |
| **ActivityFolderCard** | Activity grouping |
| **HomeActivitiesSheet** | Activities for a home |
| **ActivityMediaGallery** | Activity photos |

### 6.2 HomeInfoSheet Tabs

```typescript
const homeInfoTabs = [
  { id: 'access', label: 'Access', component: HomeAccess },
  { id: 'essentials', label: 'Essentials', component: HomeEssentials },
  { id: 'rules', label: 'Rules', component: HomeRules },
  { id: 'media', label: 'Media', component: HomeMedia },
];
```

---

## 7. Booking Components

| Component | Purpose |
|-----------|---------|
| **BookingInfoSheet** | Full booking details |
| **BookingNotesCard** | Guest notes, special requests |
| **EntryCodesCard** | Entry codes with copy |

### 7.1 BookingInfoSheet Sections

- Guest information
- Stay dates
- Entry codes
- Special requests
- Booking notes (parsed from CSV)
- Contact preferences

---

## 8. Property Management Components

For property hierarchy and issue tracking.

| Component | Purpose |
|-----------|---------|
| **PropertyBrowser** | Hierarchical item browser |
| **PropertySearch** | Item search |
| **PropertyIssueReportSheet** | Issue reporting form |
| **ItemDetailsSheet** | Item details view |
| **HierarchicalListItem** | Tree view item |
| **IssueBadge** | Issue count badge |
| **ReportIssueButton** | Issue report trigger |

### 8.1 Property Hierarchy Structure

```typescript
// Recursive tree structure
interface PropertyNode {
  id: string;
  label: string;
  type: 'unit' | 'building' | 'floor' | 'room' | 'item';
  icon?: string;
  children?: PropertyNode[];
  issueCount?: number;
}

// Example: COS285 property
const hierarchy = {
  id: 'cos285',
  label: 'COS285',
  type: 'unit',
  children: [
    {
      id: 'reception',
      label: 'Reception',
      type: 'room',
      children: [
        { id: 'reception-sofa', label: 'Sofa', type: 'item' },
        { id: 'reception-tv', label: 'TV', type: 'item' },
      ]
    },
    // ... more rooms
  ]
};
```

---

## 9. Settings Components

| Component | Purpose |
|-----------|---------|
| **HapticSettings** | Enable/disable haptics |
| **PlanMyDay** | Day planning interface |

---

## 10. Provider Components

Context providers that wrap the app.

| Provider | Purpose | RN Equivalent |
|----------|---------|---------------|
| **ThemeProvider** | Dark/light mode | React Context |
| **HapticProvider** | Vibration feedback | `expo-haptics` |
| **DataProvider** | CSV data context | AsyncStorage + Context |
| **GoogleMapsProvider** | Maps API | `react-native-maps` |

### 10.1 Provider Hierarchy

```tsx
// React Native equivalent structure
<ThemeProvider>
  <HapticProvider>
    <DataProvider>
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </DataProvider>
  </HapticProvider>
</ThemeProvider>
```

---

## 11. Component Patterns

### 11.1 Sheet/Modal Pattern

Used extensively for details views.

```tsx
// Web (Radix Sheet)
<Sheet>
  <SheetTrigger asChild>{children}</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
    </SheetHeader>
    {/* content */}
  </SheetContent>
</Sheet>

// React Native equivalent
<BottomSheet ref={sheetRef}>
  <BottomSheetView>
    <Text style={styles.title}>Title</Text>
    {/* content */}
  </BottomSheetView>
</BottomSheet>
```

### 11.2 ForwardRef Pattern

Used for input components.

```tsx
// Web
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />;
});

// React Native
const Input = forwardRef<TextInput, InputProps>((props, ref) => {
  return <TextInput ref={ref} {...props} />;
});
```

### 11.3 Imperative Handle Pattern

Used in PhotoUploader.

```tsx
// Expose methods to parent
useImperativeHandle(ref, () => ({
  triggerUpload: () => {
    // Open camera/gallery
  },
}));
```

### 11.4 CVA Pattern (Class Variance Authority)

For component variants. Replace with StyleSheet variants.

```tsx
// Web
const buttonVariants = cva('base-classes', {
  variants: {
    variant: { default: '...', destructive: '...' },
    size: { sm: '...', default: '...', lg: '...' },
  },
});

// React Native
const buttonStyles = {
  base: { /* base styles */ },
  variants: {
    default: { backgroundColor: colors.primary },
    destructive: { backgroundColor: colors.destructive },
  },
  sizes: {
    sm: { height: 32, paddingHorizontal: 12 },
    default: { height: 36, paddingHorizontal: 16 },
    lg: { height: 40, paddingHorizontal: 24 },
  },
};
```

---

## 12. Icon System

Uses Lucide React icons. For React Native, use `lucide-react-native` or map to another icon library.

### 12.1 Common Icons Used

| Icon | Usage |
|------|-------|
| `Home` | Dashboard nav |
| `ClipboardList` | Activities nav |
| `Search` | Search nav |
| `Settings` | Manage nav |
| `User` | Profile nav |
| `ChevronRight` | Navigation arrows |
| `X` | Close buttons |
| `Check` | Checkboxes, success |
| `Camera` | Photo upload |
| `MapPin` | Location |
| `Clock` | Time/schedule |
| `AlertCircle` | Warnings |
| `Package` | Provisioning |
| `Users` | Meet & Greet |

### 12.2 Task Action Icons

Mapped by action type in activity templates:

```typescript
const taskActionIcons = {
  'Check': 'ClipboardCheck',
  'Photograph': 'Camera',
  'Seal': 'Lock',
  'Verify': 'CheckCircle2',
  'Sweep': 'Sparkles',
  'Vacuum': 'Wind',
  // ... see DESIGN_SYSTEM.md for full list
};
```

---

## 13. Form System

Uses React Hook Form with Zod validation. Fully compatible with React Native.

### 13.1 Form Pattern

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
});

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { name: '', email: '' },
});
```

### 13.2 Form Components Needed

- FormField wrapper
- FormLabel
- FormControl (input wrapper)
- FormDescription
- FormMessage (error display)

---

## 14. Migration Priority

### High Priority (Core Features)
1. `ActivityTracker` - Main feature
2. `TaskCard` - Task interaction
3. `PhotoUploader` - Photo capture
4. `BottomNav` - Navigation
5. `Button`, `Card`, `Input` - Primitives

### Medium Priority (Secondary Features)
1. `HomeInfoSheet` - Property details
2. `BookingInfoSheet` - Booking details
3. `MyActivities` - Activity list
4. `SearchBar`, `GlobalSearchSheet` - Search

### Lower Priority (Enhancement)
1. `DashboardMap` - Map view
2. `PropertyBrowser` - Item hierarchy
3. `MeetGreetReportForm` - Complex form
4. `PhotoAnnotation` - Photo markup

---

## 15. Component Checklist

### UI Primitives
- [ ] Button (with variants)
- [ ] Card (with sections)
- [ ] Input / TextInput
- [ ] Checkbox
- [ ] Switch
- [ ] Badge
- [ ] Avatar
- [ ] Progress
- [ ] Skeleton
- [ ] Separator

### Navigation
- [ ] Tab Navigator (BottomNav)
- [ ] Stack Navigator
- [ ] Header (TopNav)
- [ ] Search interface

### Activity System
- [ ] ActivityTracker
- [ ] TaskCard
- [ ] PhaseSection
- [ ] PhotoUploader
- [ ] PhotoGallery

### Sheets/Modals
- [ ] Bottom Sheet component
- [ ] Modal component
- [ ] Dialog component

### Data Display
- [ ] List components
- [ ] Empty states
- [ ] Loading states
- [ ] Error states
