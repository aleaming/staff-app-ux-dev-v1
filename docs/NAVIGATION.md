# Navigation Documentation

> Routing structure and navigation patterns for React Native migration

---

## 1. Current Route Structure

### 1.1 Next.js App Router Pages

```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Dashboard (/)
├── login/
│   └── page.tsx            # Login (/login)
├── search/
│   └── page.tsx            # Global search (/search)
├── activities/
│   ├── page.tsx            # Activity list (/activities)
│   └── [homeCode]/
│       └── [activityType]/
│           └── page.tsx    # Activity tracker (/activities/COS285/provisioning)
├── homes/
│   ├── page.tsx            # Home list (/homes)
│   └── [homeCode]/
│       └── page.tsx        # Home details (/homes/COS285)
├── bookings/
│   ├── page.tsx            # Booking list (/bookings)
│   └── [bookingId]/
│       └── page.tsx        # Booking details (/bookings/BK123)
├── manage/
│   └── page.tsx            # Manage section (/manage)
├── profile/
│   └── page.tsx            # User profile (/profile)
└── settings/
    └── page.tsx            # Settings (/settings)
```

### 1.2 Route Parameters

| Route | Parameters | Description |
|-------|------------|-------------|
| `/activities/[homeCode]/[activityType]` | homeCode, activityType | Activity tracker |
| `/homes/[homeCode]` | homeCode | Home details |
| `/bookings/[bookingId]` | bookingId | Booking details |

---

## 2. Navigation Components

### 2.1 BottomNav Configuration

```typescript
const bottomNavItems = [
  {
    id: 'home',
    label: 'Home',
    icon: 'Home',
    href: '/',
    activePattern: /^\/$/,
  },
  {
    id: 'activities',
    label: 'Activities',
    icon: 'ClipboardList',
    href: '/activities',
    activePattern: /^\/activities/,
  },
  {
    id: 'search',
    label: 'Search',
    icon: 'Search',
    href: '/search',
    activePattern: /^\/search/,
  },
  {
    id: 'manage',
    label: 'Manage',
    icon: 'Settings',
    href: '/manage',
    activePattern: /^\/manage/,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'User',
    href: '/profile',
    activePattern: /^\/(profile|settings)/,
  },
];
```

### 2.2 TopNav Elements

- Logo (left, links to /)
- Breadcrumbs (center)
- Search trigger (right)
- Theme toggle (right)
- User menu (right)

### 2.3 Breadcrumb Generation

Automatic breadcrumbs based on route segments:

```typescript
// Example: /activities/COS285/provisioning
const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Activities', href: '/activities' },
  { label: 'COS285', href: '/homes/COS285' },
  { label: 'Provisioning', href: null }, // Current page
];
```

---

## 3. React Navigation Structure

### 3.1 Navigator Setup

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Type definitions
type RootStackParamList = {
  Main: undefined;
  Login: undefined;
};

type MainTabParamList = {
  HomeTab: undefined;
  ActivitiesTab: undefined;
  SearchTab: undefined;
  ManageTab: undefined;
  ProfileTab: undefined;
};

type HomeStackParamList = {
  Dashboard: undefined;
  HomeDetails: { homeCode: string };
  BookingDetails: { bookingId: string };
};

type ActivitiesStackParamList = {
  ActivityList: undefined;
  ActivityTracker: { homeCode: string; activityType: ActivityType };
};

type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
};
```

### 3.2 Navigator Implementation

```tsx
// Root navigator (auth flow)
function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

// Main tab navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getIconForRoute(route.name);
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="ActivitiesTab" component={ActivitiesStackNavigator} options={{ title: 'Activities' }} />
      <Tab.Screen name="SearchTab" component={SearchScreen} options={{ title: 'Search' }} />
      <Tab.Screen name="ManageTab" component={ManageScreen} options={{ title: 'Manage' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// Home stack
function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="HomeDetails" component={HomeDetailsScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
    </Stack.Navigator>
  );
}

// Activities stack
function ActivitiesStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ActivityList" component={ActivityListScreen} />
      <Stack.Screen
        name="ActivityTracker"
        component={ActivityTrackerScreen}
        options={{ headerShown: false }} // Full-screen tracker
      />
    </Stack.Navigator>
  );
}

// Profile stack
function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
```

---

## 4. Navigation Patterns

### 4.1 Programmatic Navigation

```typescript
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// In a component
function MyComponent() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const navigateToHome = (homeCode: string) => {
    navigation.navigate('HomeDetails', { homeCode });
  };

  const goBack = () => {
    navigation.goBack();
  };
}
```

### 4.2 Getting Route Parameters

```typescript
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

function ActivityTrackerScreen() {
  const route = useRoute<RouteProp<ActivitiesStackParamList, 'ActivityTracker'>>();
  const { homeCode, activityType } = route.params;

  // Use params...
}
```

### 4.3 Deep Linking

```typescript
const linking = {
  prefixes: ['staffapp://', 'https://staffapp.example.com'],
  config: {
    screens: {
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Dashboard: '',
              HomeDetails: 'homes/:homeCode',
              BookingDetails: 'bookings/:bookingId',
            },
          },
          ActivitiesTab: {
            screens: {
              ActivityList: 'activities',
              ActivityTracker: 'activities/:homeCode/:activityType',
            },
          },
          SearchTab: 'search',
          ManageTab: 'manage',
          ProfileTab: {
            screens: {
              Profile: 'profile',
              Settings: 'settings',
            },
          },
        },
      },
      Login: 'login',
    },
  },
};

// In App.tsx
<NavigationContainer linking={linking}>
  <RootNavigator />
</NavigationContainer>
```

---

## 5. Header Configuration

### 5.1 Custom Header Component

```tsx
interface CustomHeaderProps {
  title: string;
  showBack?: boolean;
  rightActions?: ReactNode;
}

function CustomHeader({ title, showBack, rightActions }: CustomHeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {showBack && (
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="ChevronLeft" size={24} />
        </Pressable>
      )}

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightActions}>
        {rightActions}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
  },
});
```

### 5.2 Screen Options

```typescript
// Per-screen header configuration
<Stack.Screen
  name="HomeDetails"
  component={HomeDetailsScreen}
  options={({ route }) => ({
    title: route.params.homeCode,
    headerRight: () => (
      <Pressable onPress={openSearch}>
        <Icon name="Search" size={20} />
      </Pressable>
    ),
  })}
/>

// Hide header for full-screen experiences
<Stack.Screen
  name="ActivityTracker"
  component={ActivityTrackerScreen}
  options={{
    headerShown: false,
    presentation: 'fullScreenModal',
  }}
/>
```

---

## 6. Modal & Sheet Navigation

### 6.1 Modal Screens

```typescript
// Define modal screens in stack
<Stack.Navigator>
  <Stack.Group>
    {/* Regular screens */}
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
  </Stack.Group>

  <Stack.Group screenOptions={{ presentation: 'modal' }}>
    {/* Modal screens */}
    <Stack.Screen name="IssueReport" component={IssueReportModal} />
    <Stack.Screen name="PhotoViewer" component={PhotoViewerModal} />
  </Stack.Group>
</Stack.Navigator>
```

### 6.2 Bottom Sheet (using @gorhom/bottom-sheet)

```tsx
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

function HomeInfoSheet({ homeCode }: { homeCode: string }) {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
      <BottomSheetView>
        <HomeInfoContent homeCode={homeCode} />
      </BottomSheetView>
    </BottomSheet>
  );
}
```

---

## 7. Tab Badge (Activity Indicator)

### 7.1 Showing Active Activity Badge

```tsx
function MainTabNavigator() {
  const [activeActivity, setActiveActivity] = useState<ActiveActivityInfo | null>(null);

  useEffect(() => {
    // Check for active activity on mount and when returning to tabs
    const checkActivity = async () => {
      const activity = await getActiveActivity();
      setActiveActivity(activity);
    };
    checkActivity();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getIconForRoute(route.name);

          if (route.name === 'HomeTab' && activeActivity) {
            return (
              <View>
                <Icon name={iconName} size={size} color={color} />
                <View style={styles.activityBadge}>
                  <Text style={styles.badgeText}>
                    {activeActivity.completedTasks}/{activeActivity.totalTasks}
                  </Text>
                </View>
              </View>
            );
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* ... tabs */}
    </Tab.Navigator>
  );
}
```

---

## 8. Navigation Guards

### 8.1 Auth Guard

```tsx
function ProtectedScreen({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

### 8.2 Unsaved Changes Guard

```tsx
function ActivityTrackerScreen() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!hasUnsavedChanges) {
        return;
      }

      e.preventDefault();

      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save before leaving?',
        [
          { text: 'Discard', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
          { text: 'Save & Leave', onPress: async () => {
            await saveActivityDraft();
            navigation.dispatch(e.data.action);
          }},
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    });

    return unsubscribe;
  }, [hasUnsavedChanges, navigation]);

  // ... rest of component
}
```

---

## 9. Navigation Events

### 9.1 Focus/Blur Events

```typescript
import { useFocusEffect } from '@react-navigation/native';

function DashboardScreen() {
  useFocusEffect(
    useCallback(() => {
      // Screen is focused
      refreshData();

      return () => {
        // Screen is unfocused
      };
    }, [])
  );
}
```

### 9.2 Navigation State Listener

```typescript
// In root component
<NavigationContainer
  onStateChange={(state) => {
    // Track screen views for analytics
    const currentRoute = getCurrentRouteName(state);
    analytics.logScreenView(currentRoute);
  }}
>
  <RootNavigator />
</NavigationContainer>
```

---

## 10. URL to Navigation Mapping

| Web URL | React Native Screen | Params |
|---------|---------------------|--------|
| `/` | `HomeTab > Dashboard` | - |
| `/activities` | `ActivitiesTab > ActivityList` | - |
| `/activities/COS285/provisioning` | `ActivitiesTab > ActivityTracker` | `{ homeCode: 'COS285', activityType: 'provisioning' }` |
| `/homes/COS285` | `HomeTab > HomeDetails` | `{ homeCode: 'COS285' }` |
| `/bookings/BK123` | `HomeTab > BookingDetails` | `{ bookingId: 'BK123' }` |
| `/search` | `SearchTab` | - |
| `/manage` | `ManageTab` | - |
| `/profile` | `ProfileTab > Profile` | - |
| `/settings` | `ProfileTab > Settings` | - |
| `/login` | `Login` | - |

---

## 11. Migration Checklist

### Setup
- [ ] Install `@react-navigation/native`
- [ ] Install `@react-navigation/native-stack`
- [ ] Install `@react-navigation/bottom-tabs`
- [ ] Install `react-native-screens`
- [ ] Install `react-native-safe-area-context`
- [ ] Install `@gorhom/bottom-sheet` (for sheets)

### Navigation Structure
- [ ] Create type definitions for all navigators
- [ ] Implement RootNavigator (auth flow)
- [ ] Implement MainTabNavigator
- [ ] Implement stack navigators for each tab
- [ ] Set up deep linking configuration

### UI Components
- [ ] Create custom header component
- [ ] Create tab bar with activity indicator
- [ ] Implement bottom sheets

### Guards & Events
- [ ] Implement auth guard
- [ ] Implement unsaved changes guard
- [ ] Set up navigation event listeners
