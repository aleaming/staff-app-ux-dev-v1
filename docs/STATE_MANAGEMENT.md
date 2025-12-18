# State Management Documentation

> localStorage patterns and React Context architecture for React Native migration

---

## 1. Provider Architecture

### 1.1 Provider Hierarchy

```
App Root
├── ThemeProvider           # Dark/light mode (next-themes)
│   └── enableSystem: true
│   └── attribute: "class"
│
├── HapticProvider          # Vibration feedback
│   └── Context + localStorage
│
├── DataProvider            # CSV data context
│   └── Async loading + caching
│
└── GoogleMapsProvider      # Maps API
    └── Lazy loading
```

### 1.2 React Native Equivalent

```tsx
// App.tsx
import { ThemeProvider } from './providers/ThemeProvider';
import { HapticProvider } from './providers/HapticProvider';
import { DataProvider } from './providers/DataProvider';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <ThemeProvider>
      <HapticProvider>
        <DataProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </DataProvider>
      </HapticProvider>
    </ThemeProvider>
  );
}
```

---

## 2. Data Provider

### 2.1 Context Definition

```typescript
interface DataContextType {
  // Data
  homes: Home[];
  bookings: Booking[];
  activities: Activity[];
  bookingNotes: BookingNotes[];

  // State
  isLoading: boolean;
  error: string | null;

  // Actions
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);
```

### 2.2 Provider Implementation

```tsx
// Current: Loads from CSV files
// Future: Replace with API calls

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>({
    homes: [],
    bookings: [],
    activities: [],
    bookingNotes: [],
    isLoading: true,
    error: null,
  });

  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [homes, bookings, activities, bookingNotes] = await Promise.all([
        fetchHomes(),
        fetchBookings(),
        fetchActivities(),
        fetchBookingNotes(),
      ]);

      setState({
        homes,
        bookings,
        activities,
        bookingNotes,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <DataContext.Provider value={{ ...state, refresh: loadData }}>
      {children}
    </DataContext.Provider>
  );
}
```

### 2.3 Data Hooks

```typescript
// Main hook
export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

// Convenience hooks
export function useHomes() {
  const { homes, isLoading, error } = useData();
  return { homes, isLoading, error };
}

export function useBookings() {
  const { bookings, isLoading, error } = useData();
  return { bookings, isLoading, error };
}

export function useActivities() {
  const { activities, isLoading, error } = useData();
  return { activities, isLoading, error };
}
```

---

## 3. Theme Provider

### 3.1 Current Implementation (next-themes)

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### 3.2 React Native Implementation

```tsx
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');

  // Load saved preference
  useEffect(() => {
    AsyncStorage.getItem('theme').then(saved => {
      if (saved) setThemeState(saved as Theme);
    });
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  }, []);

  const resolvedTheme = theme === 'system'
    ? systemColorScheme ?? 'light'
    : theme;

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

---

## 4. Haptic Provider

### 4.1 Current Implementation

```typescript
interface HapticContextType {
  trigger: (pattern: HapticPattern) => void;
  isEnabled: boolean;
  toggleEnabled: (enabled: boolean) => void;
  isSupported: boolean;
}

type HapticPattern = 'light' | 'medium' | 'success' | 'error' | 'warning';

// Vibration patterns (milliseconds)
const patterns = {
  light: [10],
  medium: [20],
  success: [10, 50, 10],
  error: [50, 100, 50, 100, 50],
  warning: [30, 100, 30],
};
```

### 4.2 React Native Implementation

```tsx
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function HapticProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setEnabled] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('haptics-enabled').then(value => {
      setEnabled(value !== 'false');
    });
  }, []);

  const toggleEnabled = useCallback((enabled: boolean) => {
    setEnabled(enabled);
    AsyncStorage.setItem('haptics-enabled', String(enabled));
  }, []);

  const trigger = useCallback((pattern: HapticPattern) => {
    if (!isEnabled) return;

    switch (pattern) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
    }
  }, [isEnabled]);

  return (
    <HapticContext.Provider value={{ trigger, isEnabled, toggleEnabled, isSupported: true }}>
      {children}
    </HapticContext.Provider>
  );
}
```

---

## 5. localStorage Patterns

### 5.1 Storage Key Reference

| Key Pattern | Purpose | Data Type |
|-------------|---------|-----------|
| `activity-tracker-draft-{homeId}-{activityType}` | Active activity draft | TaskState[] |
| `activity-closed-{homeId}-{activityType}` | Activity closed flag | boolean |
| `incomplete-activities` | Saved incomplete activities | Activity[] |
| `mg-report-{homeId}-draft` | M&G report draft | MeetGreetReportData |
| `mg-report-{homeId}-{activityId}` | Submitted M&G report | MeetGreetReportData |
| `property-issues-{homeId}` | Property issues | PropertyIssue[] |
| `recent-searches` | Search history | string[] |
| `recentItems` | Recently accessed items | RecentItem[] |
| `isAuthenticated` | Auth state | "true" \| "false" |
| `userEmail` | User email | string |
| `haptics-enabled` | Haptic preference | "true" \| "false" |
| `theme` | Theme preference | "light" \| "dark" \| "system" |

### 5.2 AsyncStorage Migration

```typescript
// Create storage utility for React Native
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch {
      return [];
    }
  },
};
```

---

## 6. Activity State Management

### 6.1 Activity Draft Storage

```typescript
interface TaskState {
  taskId: string;
  completed: boolean;
  photos: PhotoState[];
  notes: string;
  issues: string[];
  completedAt?: Date;
}

// Storage key generator
function getActivityDraftKey(homeId: string, activityType: ActivityType): string {
  return `activity-tracker-draft-${homeId}-${activityType}`;
}

// Save draft
async function saveActivityDraft(
  homeId: string,
  activityType: ActivityType,
  tasks: TaskState[]
): Promise<void> {
  const key = getActivityDraftKey(homeId, activityType);
  await storage.set(key, tasks);
}

// Load draft
async function loadActivityDraft(
  homeId: string,
  activityType: ActivityType
): Promise<TaskState[] | null> {
  const key = getActivityDraftKey(homeId, activityType);
  return storage.get<TaskState[]>(key);
}

// Clear draft
async function clearActivityDraft(
  homeId: string,
  activityType: ActivityType
): Promise<void> {
  const key = getActivityDraftKey(homeId, activityType);
  await storage.remove(key);
}
```

### 6.2 Active Activity Detection

```typescript
interface ActiveActivityInfo {
  homeId: string;
  homeCode: string;
  homeName?: string;
  activityType: ActivityType;
  storageKey: string;
  completedTasks: number;
  totalTasks: number;
}

async function getActiveActivity(): Promise<ActiveActivityInfo | null> {
  const allKeys = await storage.getAllKeys();
  const draftKeys = allKeys.filter(key =>
    key.startsWith('activity-tracker-draft-') &&
    !key.includes('-closed')
  );

  for (const key of draftKeys) {
    // Check if activity is closed
    const closedKey = key.replace('draft', 'closed');
    const isClosed = await storage.get<boolean>(closedKey);
    if (isClosed) continue;

    // Parse key to extract homeId and activityType
    const match = key.match(/activity-tracker-draft-(.+)-(.+)$/);
    if (!match) continue;

    const [, homeId, activityType] = match;
    const tasks = await storage.get<TaskState[]>(key);

    if (tasks && tasks.length > 0) {
      const completedTasks = tasks.filter(t => t.completed).length;

      return {
        homeId,
        homeCode: homeId, // You may need to look up the actual code
        activityType: activityType as ActivityType,
        storageKey: key,
        completedTasks,
        totalTasks: tasks.length,
      };
    }
  }

  return null;
}
```

### 6.3 Incomplete Activities

```typescript
// Save activity as incomplete
async function saveIncompleteActivity(activity: Activity): Promise<void> {
  const existing = await storage.get<Activity[]>('incomplete-activities') ?? [];

  // Deduplicate
  const filtered = existing.filter(
    a => !(a.homeCode === activity.homeCode && a.type === activity.type)
  );

  filtered.push({
    ...activity,
    status: 'paused',
  });

  await storage.set('incomplete-activities', filtered);
}

// Get incomplete activities
async function getIncompleteActivities(): Promise<Activity[]> {
  const activities = await storage.get<Activity[]>('incomplete-activities') ?? [];

  // Convert date strings back to Date objects
  return activities.map(a => ({
    ...a,
    scheduledTime: new Date(a.scheduledTime),
    endTime: a.endTime ? new Date(a.endTime) : undefined,
  }));
}

// Remove incomplete activity
async function removeIncompleteActivity(activityId: string): Promise<void> {
  const existing = await storage.get<Activity[]>('incomplete-activities') ?? [];
  const filtered = existing.filter(a => a.id !== activityId);
  await storage.set('incomplete-activities', filtered);
}
```

---

## 7. Recent Items Management

```typescript
const MAX_RECENT_ITEMS = 10;

async function addRecentItem(item: Omit<RecentItem, 'accessedAt'>): Promise<void> {
  const existing = await storage.get<RecentItem[]>('recentItems') ?? [];

  // Remove duplicate
  const filtered = existing.filter(i => i.id !== item.id);

  // Add to front with timestamp
  filtered.unshift({
    ...item,
    accessedAt: new Date(),
  });

  // Trim to max
  const trimmed = filtered.slice(0, MAX_RECENT_ITEMS);

  await storage.set('recentItems', trimmed);
}

async function getRecentItems(): Promise<RecentItem[]> {
  const items = await storage.get<RecentItem[]>('recentItems') ?? [];

  return items.map(item => ({
    ...item,
    accessedAt: new Date(item.accessedAt),
  }));
}

async function clearRecentItems(): Promise<void> {
  await storage.remove('recentItems');
}
```

---

## 8. Search History

```typescript
const MAX_RECENT_SEARCHES = 5;

async function addRecentSearch(query: string): Promise<void> {
  if (!query.trim()) return;

  const existing = await storage.get<string[]>('recent-searches') ?? [];

  // Remove duplicate
  const filtered = existing.filter(s => s.toLowerCase() !== query.toLowerCase());

  // Add to front
  filtered.unshift(query);

  // Trim
  const trimmed = filtered.slice(0, MAX_RECENT_SEARCHES);

  await storage.set('recent-searches', trimmed);
}

async function getRecentSearches(): Promise<string[]> {
  return await storage.get<string[]>('recent-searches') ?? [];
}

async function removeRecentSearch(query: string): Promise<void> {
  const existing = await storage.get<string[]>('recent-searches') ?? [];
  const filtered = existing.filter(s => s !== query);
  await storage.set('recent-searches', filtered);
}

async function clearRecentSearches(): Promise<void> {
  await storage.remove('recent-searches');
}
```

---

## 9. Authentication State

### 9.1 Current Implementation

```typescript
// Simple localStorage-based auth (mock)
function isAuthenticated(): boolean {
  return localStorage.getItem('isAuthenticated') === 'true';
}

function getUserEmail(): string | null {
  return localStorage.getItem('userEmail');
}

function login(email: string): void {
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userEmail', email);
}

function logout(): void {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');
}
```

### 9.2 React Native Implementation

```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: { email: string } | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      const isAuth = await storage.get<boolean>('isAuthenticated');
      const email = await storage.get<string>('userEmail');

      setState({
        isAuthenticated: isAuth ?? false,
        user: email ? { email } : null,
        isLoading: false,
      });
    }
    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // In production: call API
    await storage.set('isAuthenticated', true);
    await storage.set('userEmail', email);

    setState({
      isAuthenticated: true,
      user: { email },
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    await storage.remove('isAuthenticated');
    await storage.remove('userEmail');

    setState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## 10. Form State with React Hook Form

React Hook Form is compatible with React Native.

```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, Switch } from 'react-native';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  notifications: z.boolean(),
});

function MyForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      notifications: true,
    },
  });

  return (
    <View>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Name"
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Controller
        control={control}
        name="notifications"
        render={({ field: { onChange, value } }) => (
          <Switch value={value} onValueChange={onChange} />
        )}
      />
    </View>
  );
}
```

---

## 11. Migration Checklist

### Storage
- [ ] Install `@react-native-async-storage/async-storage`
- [ ] Create storage utility wrapper
- [ ] Migrate all localStorage patterns
- [ ] Test persistence across app restarts

### Providers
- [ ] Create ThemeProvider with AsyncStorage
- [ ] Create HapticProvider with expo-haptics
- [ ] Create DataProvider with API/mock data
- [ ] Create AuthProvider

### State Management
- [ ] Implement activity draft storage
- [ ] Implement incomplete activities
- [ ] Implement recent items
- [ ] Implement search history

### Forms
- [ ] Install react-hook-form
- [ ] Install @hookform/resolvers
- [ ] Install zod
- [ ] Create form components for React Native
