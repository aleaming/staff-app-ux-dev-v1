# React Native Migration Guide

> Step-by-step guide for rebuilding the Staff App in React Native

---

## 1. Technology Mapping

### 1.1 Core Dependencies

| Web (Current) | React Native Equivalent | Notes |
|---------------|------------------------|-------|
| Next.js | React Native + Expo | Use Expo for easier setup |
| Tailwind CSS | NativeWind or StyleSheet | NativeWind allows Tailwind syntax |
| Shadcn UI | Custom components | Need to rebuild |
| Radix UI | Various RN libraries | See component mapping |
| next-themes | React Context | Custom implementation |
| localStorage | AsyncStorage | `@react-native-async-storage/async-storage` |
| react-hook-form | react-hook-form | Works in RN |
| zod | zod | Works in RN |
| Lucide React | lucide-react-native | Same icons |
| Sonner | react-native-toast-message | Similar API |

### 1.2 UI Component Mapping

| Shadcn Component | React Native Equivalent |
|------------------|------------------------|
| Button | Custom Pressable |
| Card | Custom View |
| Input | TextInput |
| Checkbox | expo-checkbox or custom |
| Switch | React Native Switch |
| Dialog | react-native-modal |
| Sheet | @gorhom/bottom-sheet |
| Tabs | react-native-tab-view |
| Accordion | react-native-collapsible |
| Select | react-native-picker-select |
| Progress | Custom View or library |
| Skeleton | Animated View |

### 1.3 Feature Libraries

| Feature | Web Library | React Native Library |
|---------|-------------|---------------------|
| Navigation | Next.js Router | @react-navigation/native |
| Maps | Leaflet / Google Maps | react-native-maps |
| Image Picker | File input | expo-image-picker |
| Image Compression | Canvas API | expo-image-manipulator |
| Haptics | Vibration API | expo-haptics |
| Icons | lucide-react | lucide-react-native |
| Toast | sonner | react-native-toast-message |
| Blur | CSS backdrop-filter | expo-blur |

---

## 2. Project Setup

### 2.1 Create Expo Project

```bash
# Create new Expo project
npx create-expo-app@latest StaffApp --template tabs

# Navigate to project
cd StaffApp

# Install core dependencies
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install @react-native-async-storage/async-storage
npx expo install expo-haptics expo-image-picker expo-image-manipulator expo-blur
npx expo install react-native-maps
npx expo install @gorhom/bottom-sheet react-native-reanimated react-native-gesture-handler

# Install form libraries
npm install react-hook-form @hookform/resolvers zod

# Install UI libraries
npm install lucide-react-native react-native-svg
npm install react-native-toast-message
```

### 2.2 Project Structure

```
src/
├── app/                    # Expo Router (if using)
├── components/
│   ├── ui/                 # Primitive components
│   ├── activities/         # Activity system
│   ├── navigation/         # Nav components
│   └── ...                 # Feature components
├── lib/
│   ├── types/              # TypeScript types
│   ├── hooks/              # Custom hooks
│   ├── storage/            # AsyncStorage utilities
│   └── utils/              # Utility functions
├── providers/              # Context providers
├── screens/                # Screen components
├── navigation/             # Navigator definitions
└── constants/
    ├── colors.ts           # Color tokens
    ├── spacing.ts          # Spacing scale
    └── typography.ts       # Font styles
```

---

## 3. Design System Implementation

### 3.1 Colors

```typescript
// src/constants/colors.ts
export const colors = {
  light: {
    background: '#FAF9F5',
    foreground: '#3D3832',
    card: '#FEFDFB',
    cardForeground: '#151514',
    primary: '#C76B3D',
    primaryForeground: '#FFFFFF',
    secondary: '#E8E4DA',
    secondaryForeground: '#514E47',
    muted: '#EBE7DC',
    mutedForeground: '#696663',
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    border: '#EBEBEB',
    input: '#CBCBCB',
    ring: '#FA8541',
  },
  dark: {
    background: '#262625',
    foreground: '#C4BEB4',
    card: '#262625',
    cardForeground: '#FAF9F5',
    primary: '#E8853D',
    primaryForeground: '#FFFFFF',
    secondary: '#E8E4DA',
    secondaryForeground: '#1C1C1C',
    muted: '#1B1B1A',
    mutedForeground: '#B8B3A8',
    destructive: '#DC4747',
    destructiveForeground: '#FFFFFF',
    border: '#3D3C39',
    input: '#404040',
    ring: '#FA8541',
  },
  activity: {
    provisioning: '#F4B183',
    deprovision: '#A1C6E7',
    turn: '#B4A7D6',
    'maid-service': '#C5E0B4',
    'mini-maid': '#E2F0D9',
    'touch-up': '#FFE699',
    'quality-check': '#FF9393',
    'meet-greet': '#46BDC6',
    'bag-drop': '#7DD2D9',
    'home-viewing': '#FFCCCC',
    'service-recovery': '#FFD521',
    'additional-greet': '#B2E4E8',
    adhoc: '#AFABAB',
  },
};
```

### 3.2 Typography

```typescript
// src/constants/typography.ts
import { StyleSheet, Platform } from 'react-native';

export const fonts = {
  primary: Platform.select({
    ios: 'ZalandoSans',
    android: 'ZalandoSans',
    default: 'System',
  }),
};

export const typography = StyleSheet.create({
  // Headings
  h1: {
    fontFamily: fonts.primary,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  h2: {
    fontFamily: fonts.primary,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  h3: {
    fontFamily: fonts.primary,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
  },

  // Body
  body: {
    fontFamily: fonts.primary,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySm: {
    fontFamily: fonts.primary,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },

  // UI
  button: {
    fontFamily: fonts.primary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  badge: {
    fontFamily: fonts.primary,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  label: {
    fontFamily: fonts.primary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  caption: {
    fontFamily: fonts.primary,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
});
```

### 3.3 Spacing

```typescript
// src/constants/spacing.ts
export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

export const borderRadius = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 14,
  '2xl': 16,
  full: 9999,
};
```

---

## 4. Core Component Examples

### 4.1 Button Component

```tsx
// src/components/ui/Button.tsx
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useTheme } from '@/providers/ThemeProvider';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

export function Button({
  variant = 'default',
  size = 'default',
  children,
  onPress,
  disabled,
}: ButtonProps) {
  const { theme } = useTheme();
  const { trigger } = useHapticFeedback();
  const themeColors = colors[theme];

  const handlePress = () => {
    trigger('light');
    onPress?.();
  };

  const variantStyles: Record<ButtonVariant, ViewStyle> = {
    default: {
      backgroundColor: themeColors.primary,
    },
    destructive: {
      backgroundColor: themeColors.destructive,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
  };

  const sizeStyles: Record<ButtonSize, ViewStyle> = {
    sm: { height: 32, paddingHorizontal: 12 },
    default: { height: 36, paddingHorizontal: 16 },
    lg: { height: 40, paddingHorizontal: 24 },
    icon: { height: 36, width: 36, paddingHorizontal: 0 },
  };

  const textColor = variant === 'default' || variant === 'destructive'
    ? themeColors.primaryForeground
    : themeColors.foreground;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[typography.button, { color: textColor }]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});
```

### 4.2 Card Component

```tsx
// src/components/ui/Card.tsx
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing, borderRadius } from '@/constants/spacing';
import { useTheme } from '@/providers/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <View style={[
      styles.card,
      { backgroundColor: themeColors.card },
      style,
    ]}>
      {children}
    </View>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

export function CardTitle({ children }: { children: string }) {
  const { theme } = useTheme();
  return (
    <Text style={[
      typography.h3,
      { color: colors[theme].cardForeground }
    ]}>
      {children}
    </Text>
  );
}

export function CardDescription({ children }: { children: string }) {
  const { theme } = useTheme();
  return (
    <Text style={[
      typography.bodySm,
      { color: colors[theme].mutedForeground }
    ]}>
      {children}
    </Text>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <View style={styles.content}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    marginBottom: spacing[3],
  },
  content: {
    // Additional content styles
  },
});
```

### 4.3 Input Component

```tsx
// src/components/ui/Input.tsx
import { TextInput, StyleSheet, ViewStyle } from 'react-native';
import { forwardRef } from 'react';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing, borderRadius } from '@/constants/spacing';
import { useTheme } from '@/providers/ThemeProvider';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ style, ...props }, ref) => {
    const { theme } = useTheme();
    const themeColors = colors[theme];

    return (
      <TextInput
        ref={ref}
        style={[
          styles.input,
          typography.body,
          {
            backgroundColor: themeColors.background,
            borderColor: themeColors.input,
            color: themeColors.foreground,
          },
          style,
        ]}
        placeholderTextColor={themeColors.mutedForeground}
        {...props}
      />
    );
  }
);

const styles = StyleSheet.create({
  input: {
    height: 40,
    paddingHorizontal: spacing[3],
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
});
```

---

## 5. Feature Implementation

### 5.1 Photo Upload

```tsx
// src/components/activities/PhotoUploader.tsx
import { useState } from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Camera } from 'lucide-react-native';

interface PhotoUploaderProps {
  onPhotoCapture: (uri: string) => void;
  maxPhotos?: number;
  photos: string[];
}

export function PhotoUploader({ onPhotoCapture, maxPhotos = 5, photos }: PhotoUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async (useCamera: boolean) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Permission required');
      return;
    }

    setIsLoading(true);

    try {
      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
          });

      if (!result.canceled && result.assets[0]) {
        // Compress image
        const compressed = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 1920 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        onPhotoCapture(compressed.uri);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.photoGrid}>
        {photos.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.photo} />
        ))}

        {photos.length < maxPhotos && (
          <Pressable
            style={styles.addButton}
            onPress={() => pickImage(true)}
          >
            <Camera size={24} color="#666" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  addButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### 5.2 Bottom Sheet

```tsx
// src/components/ui/CustomBottomSheet.tsx
import { useMemo, forwardRef, useCallback } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useTheme } from '@/providers/ThemeProvider';
import { colors } from '@/constants/colors';

interface CustomBottomSheetProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  onClose?: () => void;
}

export const CustomBottomSheet = forwardRef<BottomSheet, CustomBottomSheetProps>(
  ({ children, snapPoints: customSnapPoints, onClose }, ref) => {
    const { theme } = useTheme();
    const themeColors = colors[theme];
    const snapPoints = useMemo(() => customSnapPoints || ['50%', '90%'], [customSnapPoints]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      []
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onClose={onClose}
        backgroundStyle={{ backgroundColor: themeColors.card }}
        handleIndicatorStyle={{ backgroundColor: themeColors.mutedForeground }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          {children}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);
```

---

## 6. Migration Phases

### Phase 1: Foundation (Week 1-2)

**Setup**
- [ ] Create Expo project
- [ ] Install all dependencies
- [ ] Set up TypeScript configuration
- [ ] Configure path aliases

**Design System**
- [ ] Implement color constants
- [ ] Implement typography styles
- [ ] Implement spacing scale
- [ ] Load custom fonts

**Core Components**
- [ ] Button
- [ ] Card
- [ ] Input
- [ ] Badge
- [ ] Checkbox
- [ ] Switch

**Providers**
- [ ] ThemeProvider
- [ ] HapticProvider

### Phase 2: Navigation & Data (Week 2-3)

**Navigation**
- [ ] Set up React Navigation
- [ ] Create tab navigator
- [ ] Create stack navigators
- [ ] Configure deep linking

**Data Layer**
- [ ] Create AsyncStorage utilities
- [ ] Implement DataProvider
- [ ] Port data types
- [ ] Create data hooks

**Screens**
- [ ] Login screen
- [ ] Dashboard screen
- [ ] Activity list screen

### Phase 3: Core Features (Week 3-4)

**Activity System**
- [ ] ActivityTracker screen
- [ ] TaskCard component
- [ ] PhaseSection component
- [ ] PhotoUploader component
- [ ] Activity draft persistence

**Sheets & Modals**
- [ ] HomeInfoSheet
- [ ] BookingInfoSheet
- [ ] IssueReportSheet

### Phase 4: Secondary Features (Week 4-5)

**Search**
- [ ] Search screen
- [ ] Recent searches
- [ ] Search results

**Property Details**
- [ ] Home details screen
- [ ] Booking details screen
- [ ] Property hierarchy browser

**Forms**
- [ ] Issue report form
- [ ] Meet & Greet report form

### Phase 5: Polish (Week 5-6)

**Animations**
- [ ] Add transitions
- [ ] Add loading states
- [ ] Add pull-to-refresh

**Maps**
- [ ] Integrate react-native-maps
- [ ] Property markers
- [ ] Directions

**Testing**
- [ ] Test on iOS
- [ ] Test on Android
- [ ] Test on various screen sizes

---

## 7. Testing Checklist

### Functionality
- [ ] Activity creation and tracking
- [ ] Photo capture and upload
- [ ] Form submission
- [ ] Navigation between screens
- [ ] Data persistence
- [ ] Dark/light mode toggle
- [ ] Haptic feedback

### Platforms
- [ ] iOS (iPhone)
- [ ] iOS (iPad)
- [ ] Android phones
- [ ] Android tablets

### Performance
- [ ] List scrolling (FlatList virtualization)
- [ ] Image loading
- [ ] Navigation transitions
- [ ] Memory usage

### Accessibility
- [ ] VoiceOver (iOS)
- [ ] TalkBack (Android)
- [ ] Touch targets (44x44 minimum)
- [ ] Color contrast

---

## 8. Resources

### Documentation
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Gorhom Bottom Sheet](https://gorhom.github.io/react-native-bottom-sheet/)

### Component Libraries
- [React Native Paper](https://callstack.github.io/react-native-paper/) - Material Design
- [Tamagui](https://tamagui.dev/) - Universal UI
- [NativeBase](https://nativebase.io/) - Component library
- [Gluestack](https://gluestack.io/) - Headless components

### Tools
- [Expo Go](https://expo.dev/go) - Development testing
- [Flipper](https://fbflipper.com/) - Debugging
- [Reactotron](https://github.com/infinitered/reactotron) - Debugging
