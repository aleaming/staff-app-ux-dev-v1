# Data Models Documentation

> Complete TypeScript interfaces and data structures for React Native rebuild

---

## 1. Core Entity Types

### 1.1 Activity

The primary entity in the application.

```typescript
// Activity types - 13 distinct workflow types
type ActivityType =
  | 'provisioning'      // Prepare home for guest arrival
  | 'deprovisioning'    // Close down after departure
  | 'turn'              // Full turnover between guests
  | 'maid-service'      // Professional cleaning
  | 'mini-maid'         // Light cleaning during stay
  | 'touch-up'          // Minor adjustments
  | 'quality-check'     // Final inspection
  | 'meet-greet'        // Guest arrival & orientation
  | 'additional-greet'  // Follow-up greet
  | 'bag-drop'          // Luggage storage
  | 'service-recovery'  // Issue resolution
  | 'home-viewing'      // Property viewing
  | 'adhoc';            // General tasks

// Activity status workflow
type ActivityStatus =
  | 'to-start'    // Not yet begun
  | 'in-progress' // Currently active
  | 'paused'      // Saved but incomplete
  | 'abandoned'   // Cancelled mid-progress
  | 'completed'   // Successfully finished
  | 'cancelled'   // Never started, removed
  | 'ignored';    // Skipped

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  homeCode: string;
  homeName?: string;
  bookingId?: string;

  // Timing
  scheduledTime: Date;
  endTime?: Date;

  // Status
  status: ActivityStatus;
  priority?: 'high' | 'normal';

  // Details
  description?: string;
  assignedTo?: string;

  // Sub-statuses
  confirmed?: boolean;
  onTime?: boolean;
  delayed?: boolean;
  hasIssues?: boolean;
}
```

### 1.2 Home

Property/unit information.

```typescript
type HomeStatus = 'occupied' | 'available' | 'maintenance';

interface Home {
  id: string;              // Format: "home-{CODE}-{index}"
  code: string;            // e.g., "COS285", "APT123"
  name?: string;
  address: string;
  city: string;
  location?: string;       // Area name, e.g., "St John's Wood"
  market?: string;         // Market region, e.g., "London"

  // Stats
  distance?: number;       // Distance in km from user
  activeBookings: number;
  pendingActivities: number;
  status: HomeStatus;

  // Details
  bedrooms?: number;
  bathrooms?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };

  // Issues
  damages?: Damage[];
}

interface Damage {
  id: string;
  description: string;
  location: string;
  severity: 'minor' | 'moderate' | 'major';
  reportedDate: Date;
  status: 'open' | 'in-progress' | 'resolved';
  media?: {
    id: string;
    url: string;
    caption?: string;
    uploadedAt: Date;
  }[];
}
```

### 1.3 Booking

Guest reservation information.

```typescript
type BookingStatus = 'upcoming' | 'current' | 'departure' | 'completed';

interface Booking {
  id: string;
  bookingId: string;       // Guest-facing reference
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  homeCode: string;
  homeId: string;

  // Dates
  checkIn: Date;
  checkOut: Date;

  // Details
  status: BookingStatus;
  numberOfGuests?: number;
  specialRequests?: string;
}
```

### 1.4 Booking Notes

Parsed from free-text booking notes.

```typescript
interface BookingNotes {
  bookingRef: string;
  advisorInitials?: string;
  repeatGuest?: boolean;
  contextOfStay?: string;
  groupMakeup?: string;
  concerns?: string;
  checkInOutNotes?: string;
  flexRate?: string;
  discountNote?: string;
  adminFeeNote?: string;
  homeownerNotes?: string;
  jiraLink?: string;
  welcomeMessage?: string;

  entryCodes?: {
    streetLevel?: string;
    apartment?: string;
  };

  actionRequired?: string;  // e.g., "Pre-Auth NOT Captured"
  rawNotes?: string;        // Full unparsed text
}
```

### 1.5 Notification

System notifications and messages.

```typescript
type NotificationType = 'message' | 'alert' | 'activity-update';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
  priority?: 'high' | 'normal';
}
```

### 1.6 Recent Item

For recently accessed tracking.

```typescript
type RecentItemType = 'home' | 'booking' | 'activity';

interface RecentItem {
  id: string;
  type: RecentItemType;
  title: string;
  subtitle?: string;
  href: string;
  accessedAt: Date;
}
```

---

## 2. Activity Template System

### 2.1 Task Template

Individual task within an activity.

```typescript
type TaskAction =
  | 'Check'
  | 'Bag and tag'
  | 'Seal'
  | 'Prepare For Guest'
  | 'Connect'
  | 'Leave out'
  | 'Set'
  | 'Troubleshoot'
  | 'Sweep'
  | 'Quality check'
  | 'Secure'
  | 'Turn off'
  | 'Empty'
  | 'Fill out'
  | 'Vacuum'
  | 'Test'
  | 'Verify'
  | 'Photograph'
  | 'Show'
  | 'Explain'
  | 'Demonstrate'
  | 'Review'
  | 'Welcome'
  | 'Answer Questions'
  | 'Collect'
  | 'Deliver'
  | 'Clear'
  | 'Remove'
  | 'Unribbon'
  | 'Unseal'
  | 'Video'
  | 'Note';

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  required: boolean;
  estimatedTime: number;        // Minutes
  photoRequired: boolean;
  photoCount?: number;          // Required photo count
  order: number;
  dependencies?: string[];      // Task IDs that must complete first
  action?: TaskAction;
  subject?: string;
  location?: string;
  priority?: 'high' | 'medium' | 'low';

  conditional?: {
    season?: 'summer' | 'winter';
    occupancy?: 'booking' | 'empty' | 'host';
  };
}
```

### 2.2 Activity Template

Full activity workflow definition.

```typescript
interface ActivityTemplate {
  type: ActivityType;
  name: string;
  description: string;
  estimatedTotalTime: number;   // Minutes
  tasks: TaskTemplate[];
  phases?: PhaseTemplate[];     // For phased activities
  metadata?: PropertyMetadata;
}

interface PhaseTemplate {
  id: string;
  name: 'arrive' | 'during' | 'depart';
  order: number;
  rooms?: RoomTemplate[];
  tasks?: TaskTemplate[];
}

interface RoomTemplate {
  id: string;
  code: string;
  name: string;
  location?: string;
  tasks: TaskTemplate[];
}
```

### 2.3 Property Metadata

Property-specific information embedded in templates.

```typescript
interface PropertyMetadata {
  propertyCode: string;
  propertyName: string;
  version: string;
  sensitivityLevel: 'low' | 'medium' | 'high';
  hasDoorman: boolean;
  storage: string[];

  heating: {
    type: string;
    location: string;
    summerSetting: string;
    winterSettings: Record<string, string>;
  };

  wifi: Array<{
    name: string;
    password: string;
    location?: string;
  }>;

  alerts: Array<{
    type: 'critical' | 'warning' | 'info';
    message: string;
  }>;

  exitInstructions?: {
    locking?: string;
    refuse?: string;
    checkout?: string;
  };

  checkInstructions?: string[];
}
```

---

## 3. Property Hierarchy Types

### 3.1 Property Node

Recursive tree structure for property items.

```typescript
type PropertyNodeType = 'unit' | 'building' | 'floor' | 'room' | 'item';

interface PropertyHierarchyNode {
  id: string;
  label: string;
  type: PropertyNodeType;
  icon?: string;                 // Lucide icon name
  metadata?: string;             // e.g., "x 2", "12 items"
  children?: PropertyHierarchyNode[];
  detailsUrl?: string;
  instructions?: string;
  photos?: {
    id: string;
    url: string;
    caption?: string;
  }[];
  details?: Record<string, string>;
  issueCount?: number;           // Computed
  hasNotification?: boolean;     // Computed
}
```

### 3.2 Property Issue

Issue/damage reported on a property item.

```typescript
type PropertyIssueType =
  | 'not-working'
  | 'damaged'
  | 'missing'
  | 'needs-cleaning'
  | 'other';

type PropertyIssueStatus = 'open' | 'in-progress' | 'resolved';
type PropertyIssuePriority = 'urgent' | 'high' | 'medium' | 'low';

interface PropertyIssue {
  id: string;
  itemId: string;               // Reference to PropertyHierarchyNode
  reporterName: string;
  reportedDate: Date;
  description: string;
  status: PropertyIssueStatus;
  priority: PropertyIssuePriority;
  type: PropertyIssueType;
  photos?: {
    id: string;
    url: string;
    fileName?: string;
  }[];
}
```

---

## 4. Meet & Greet Report Types

Complex form data for activity reports.

```typescript
// Enum types for form fields
type ActivityTypeOption = 'greet' | 'viewing' | 'other';
type PartyType =
  | 'individual'
  | 'couple'
  | 'single-family'
  | 'multiple-families'
  | 'friendship-group'
  | 'business-group';
type StayReason = 'business' | 'leisure' | 'special-occasion' | 'relocation' | 'other';
type EnglishLevel =
  | 'first-language'
  | 'easy-to-communicate'
  | 'difficult-to-communicate'
  | 'no-english';
type PunctualityStatus = 'on-time' | 'early-30-plus' | 'late-30-plus';
type AgreementScale = 'strongly-agree' | 'agree' | 'disagree' | 'strongly-disagree';
type ContactPreference =
  | 'phone-sms-on-file'
  | 'phone-sms-different'
  | 'email'
  | 'not-sure';
type WiFiTestResult = 'yes' | 'no' | 'unable-to-test';

// Full report interface
interface MeetGreetReportData {
  id: string;
  homeId: string;
  activityId?: string;
  submittedAt?: string;

  basicInfo: {
    date: string;
    greeterName: string;
    activityType: ActivityTypeOption;
  };

  aboutGuests: {
    partyType: PartyType;
    numberOfAdults: number;
    numberOfChildren: number;
    stayReason: StayReason;
    stayReasonOther?: string;
    englishLevel: EnglishLevel;
    anyoneGermanSpeaking: boolean;
    punctualityStatus: PunctualityStatus;
    punctualityMinutes?: number;
    additionalNotes?: string;
  };

  aboutGreet: {
    // Multiple agreement scale questions
    guestsHadQuestions: boolean;
    questionsDetails?: string;
    questionsResolved?: AgreementScale;
    furnitureArranged: AgreementScale;
    specialRequests?: string;
    contactPreference: ContactPreference;
    alternatePhone?: string;
    wifiTested: WiFiTestResult;
    wifiIssues?: string;
  };

  maintenanceClosing: {
    maintenanceIssues: boolean;
    maintenanceDetails?: string;
    maintenanceReported?: boolean;
    additionalNotes?: string;
  };
}
```

---

## 5. Photo Management Types

```typescript
interface CompressedPhoto {
  file: File;                   // In RN: uri string
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

interface PhotoState {
  id: string;
  uri: string;                  // Local file URI
  status: 'uploading' | 'uploaded' | 'failed';
  uploadProgress?: number;
  remoteUrl?: string;           // After upload
  thumbnailUri?: string;
  metadata?: {
    width: number;
    height: number;
    capturedAt: Date;
  };
}

// Photo compression settings
const PHOTO_COMPRESSION = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,                 // 80% JPEG quality
  thumbnailSize: 200,
};
```

---

## 6. Data Access Patterns

### 6.1 Data Context Type

```typescript
interface DataContextType {
  homes: Home[];
  bookings: Booking[];
  activities: Activity[];
  bookingNotes: BookingNotes[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// Hooks provided
function useData(): DataContextType;
function useHomes(): { homes: Home[]; isLoading: boolean; error: string | null };
function useBookings(): { bookings: Booking[]; isLoading: boolean; error: string | null };
function useActivities(): { activities: Activity[]; isLoading: boolean; error: string | null };
function useBookingNotes(): { bookingNotes: BookingNotes[]; isLoading: boolean; error: string | null };
```

### 6.2 Data Helper Functions

```typescript
// Filtering and lookup
function getActivitiesForHome(homeId: string): Activity[];
function getActivitiesForBooking(bookingId: string): Activity[];
function getBookingsForHome(homeId: string): Booking[];
function getHomeByCode(code: string): Home | undefined;
function getBookingByBookingId(bookingId: string): Booking | undefined;
function getActivityById(id: string): Activity | undefined;

// Analytics
function getUnreadNotificationsCount(): number;
function getActivitiesDueToday(): Activity[];
function getUpcomingBookings(days?: number): Booking[];

// Property hierarchy
function getPropertyHierarchy(homeId: string): PropertyHierarchyNode | null;
function getIssuesForProperty(homeId: string): Record<string, PropertyIssue[]>;
function getIssueCountForNode(
  nodeId: string,
  hierarchy: PropertyHierarchyNode,
  issues: Record<string, PropertyIssue[]>
): number;
```

---

## 7. API Response Types

For future API integration (currently using mock CSV data).

```typescript
// Generic API response wrapper
interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// Example endpoints
type GetActivitiesResponse = ApiResponse<Activity[]>;
type GetHomeResponse = ApiResponse<Home>;
type GetBookingResponse = ApiResponse<Booking>;

// Activity completion payload
interface CompleteActivityPayload {
  activityId: string;
  completedAt: string;          // ISO timestamp
  tasks: {
    taskId: string;
    completed: boolean;
    photos?: string[];          // Photo URLs
    notes?: string;
    issues?: string[];          // Issue IDs
  }[];
}
```

---

## 8. Form Validation Schemas

Using Zod (compatible with React Native).

```typescript
import * as z from 'zod';

// Issue report schema
const issueReportSchema = z.object({
  itemId: z.string().min(1, 'Required'),
  type: z.enum(['not-working', 'damaged', 'missing', 'needs-cleaning', 'other']),
  priority: z.enum(['urgent', 'high', 'medium', 'low']),
  description: z.string().min(10, 'Please provide more details'),
  photos: z.array(z.string()).optional(),
});

// M&G basic info schema
const meetGreetBasicSchema = z.object({
  date: z.string().min(1, 'Required'),
  greeterName: z.string().min(1, 'Required'),
  activityType: z.enum(['greet', 'viewing', 'other']),
});

// Login schema
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
});
```

---

## 9. Type Utilities

```typescript
// Make all properties optional recursively
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Extract array item type
type ArrayItem<T> = T extends (infer U)[] ? U : never;

// Nullable type
type Nullable<T> = T | null;

// Date string type (ISO format)
type DateString = string;

// Convert Date fields to string for serialization
type Serialized<T> = {
  [P in keyof T]: T[P] extends Date ? DateString : T[P];
};
```

---

## 10. Enum Constants

```typescript
// Activity types array for iteration
export const ACTIVITY_TYPES: ActivityType[] = [
  'provisioning',
  'deprovisioning',
  'turn',
  'maid-service',
  'mini-maid',
  'touch-up',
  'quality-check',
  'meet-greet',
  'additional-greet',
  'bag-drop',
  'service-recovery',
  'home-viewing',
  'adhoc',
];

// Activity status array
export const ACTIVITY_STATUSES: ActivityStatus[] = [
  'to-start',
  'in-progress',
  'paused',
  'abandoned',
  'completed',
  'cancelled',
  'ignored',
];

// Issue priorities with labels
export const ISSUE_PRIORITIES = [
  { value: 'urgent', label: 'Urgent', color: '#EF4444' },
  { value: 'high', label: 'High', color: '#F97316' },
  { value: 'medium', label: 'Medium', color: '#EAB308' },
  { value: 'low', label: 'Low', color: '#22C55E' },
] as const;

// Task actions with icons
export const TASK_ACTIONS: Record<TaskAction, { icon: string; color: string }> = {
  'Check': { icon: 'ClipboardCheck', color: '#3B82F6' },
  'Photograph': { icon: 'Camera', color: '#8B5CF6' },
  'Seal': { icon: 'Lock', color: '#F97316' },
  // ... see full list in design system
};
```

---

## 11. Migration Checklist

### Types to Create
- [ ] Activity types and interfaces
- [ ] Home types and interfaces
- [ ] Booking types and interfaces
- [ ] Notification types
- [ ] Property hierarchy types
- [ ] Issue report types
- [ ] Photo management types
- [ ] Form validation schemas

### Data Layer
- [ ] Set up AsyncStorage for persistence
- [ ] Create data context/provider
- [ ] Implement data hooks
- [ ] Create helper functions
- [ ] Set up API client (for future)

### Validation
- [ ] Install Zod
- [ ] Create form schemas
- [ ] Integrate with React Hook Form
