# Design System Documentation

> Complete design tokens and styling guide for React Native rebuild

---

## 1. Color System

### 1.1 Semantic Colors

All colors use HSL format. Convert to hex/RGB for React Native.

#### Light Mode

| Token | HSL | Hex | RGB | Usage |
|-------|-----|-----|-----|-------|
| `background` | `48 50% 97%` | `#FAF9F5` | `250, 249, 245` | Page backgrounds |
| `foreground` | `48 20% 20%` | `#3D3832` | `61, 56, 50` | Primary text |
| `card` | `48 50% 99%` | `#FEFDFB` | `254, 253, 251` | Card backgrounds |
| `card-foreground` | `30 2% 8%` | `#151514` | `21, 21, 20` | Card text |
| `primary` | `16 51% 52%` | `#C76B3D` | `199, 107, 61` | Primary actions |
| `primary-foreground` | `0 0% 100%` | `#FFFFFF` | `255, 255, 255` | Text on primary |
| `secondary` | `48 24% 89%` | `#E8E4DA` | `232, 228, 218` | Secondary backgrounds |
| `secondary-foreground` | `48 8% 30%` | `#514E47` | `81, 78, 71` | Secondary text |
| `muted` | `48 30% 90%` | `#EBE7DC` | `235, 231, 220` | Muted backgrounds |
| `muted-foreground` | `40 3% 40%` | `#696663` | `105, 102, 99` | Muted text |
| `accent` | `48 24% 89%` | `#E8E4DA` | `232, 228, 218` | Accent highlights |
| `destructive` | `0 84% 60%` | `#EF4444` | `239, 68, 68` | Error/delete actions |
| `border` | `0 0% 92%` | `#EBEBEB` | `235, 235, 235` | Borders |
| `input` | `0 0% 79.8%` | `#CBCBCB` | `203, 203, 203` | Input borders |
| `ring` | `16 96% 59%` | `#FA8541` | `250, 133, 65` | Focus rings |

#### Dark Mode

| Token | HSL | Hex | RGB | Usage |
|-------|-----|-----|-----|-------|
| `background` | `60 3% 15%` | `#262625` | `38, 38, 37` | Page backgrounds |
| `foreground` | `48 13% 74%` | `#C4BEB4` | `196, 190, 180` | Primary text |
| `card` | `60 3% 15%` | `#262625` | `38, 38, 37` | Card backgrounds |
| `card-foreground` | `48 50% 97%` | `#FAF9F5` | `250, 249, 245` | Card text |
| `primary` | `16 58% 60%` | `#E8853D` | `232, 133, 61` | Primary actions |
| `muted` | `60 4% 10%` | `#1B1B1A` | `27, 27, 26` | Muted backgrounds |
| `muted-foreground` | `48 10% 69%` | `#B8B3A8` | `184, 179, 168` | Muted text |
| `border` | `60 5% 23%` | `#3D3C39` | `61, 60, 57` | Borders |
| `destructive` | `0 70% 53%` | `#DC4747` | `220, 71, 71` | Error/delete actions |

---

### 1.2 Activity Type Colors

These colors categorize different activity types. **Same in light and dark mode.**

| Activity Type | Hex | RGB | Visual |
|---------------|-----|-----|--------|
| `provisioning` | `#F4B183` | `244, 177, 131` | Peach |
| `deprovision` | `#A1C6E7` | `161, 198, 231` | Light blue |
| `turn` | `#B4A7D6` | `180, 167, 214` | Lavender |
| `maid-service` | `#C5E0B4` | `197, 224, 180` | Light green |
| `mini-maid` | `#E2F0D9` | `226, 240, 217` | Very light green |
| `touch-up` | `#FFE699` | `255, 230, 153` | Light yellow |
| `quality-check` | `#FF9393` | `255, 147, 147` | Light red |
| `meet-greet` | `#46BDC6` | `70, 189, 198` | Teal |
| `bag-drop` | `#7DD2D9` | `125, 210, 217` | Light teal |
| `home-viewing` | `#FFCCCC` | `255, 204, 204` | Light pink |
| `service-recovery` | `#FFD521` | `255, 213, 33` | Golden yellow |
| `additional-greet` | `#B2E4E8` | `178, 228, 232` | Cyan |
| `adhoc` | `#AFABAB` | `175, 171, 171` | Gray |

---

### 1.3 Booking Status Colors

| Status | Hex | RGB | Meaning |
|--------|-----|-----|---------|
| `pre-stay` | `#E2F0D9` | `226, 240, 217` | Before check-in |
| `in-stay` | `#A7C58E` | `167, 197, 142` | Currently occupied |
| `post-stay` | `#AFABAB` | `175, 171, 171` | After checkout |
| `completed` | `#AFABAB` | `175, 171, 171` | Booking finished |

---

### 1.4 Map Marker Colors

| Marker | Hex | Tailwind Equivalent |
|--------|-----|---------------------|
| Red | `#EF4444` | `red-500` |
| Green | `#22C55E` | `green-500` |
| Yellow | `#EAB308` | `yellow-500` |
| Blue | `#3B82F6` | `blue-500` |
| Orange | `#F97316` | `orange-500` |
| Stroke | `#9A7C5C` | Custom tan |

---

### 1.5 Chart Colors (Data Visualization)

| Chart | Light HSL | Dark HSL | Use |
|-------|-----------|----------|-----|
| `chart-1` | `16 57% 44%` | Same | Primary data |
| `chart-2` | `247 73% 75%` | Same | Secondary data |
| `chart-3` | `48 26% 82%` | `48 10% 9%` | Tertiary data |
| `chart-4` | `260 48% 88%` | Same | Quaternary |
| `chart-5` | `16 60% 44%` | Same | Quinary |

---

## 2. Typography

### 2.1 Font Families

```javascript
// React Native font config
const fonts = {
  primary: 'ZalandoSans',      // Main UI font
  serif: 'Adamina',            // Accent/display
  mono: 'FiraCode',            // Code/technical

  // System fallbacks for React Native
  systemSans: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }),
};
```

**Note**: You'll need to include these fonts in your React Native project or use system alternatives.

### 2.2 Font Sizes

| Token | Size | Line Height | Use |
|-------|------|-------------|-----|
| `xs` | 12px | 16px | Badges, labels |
| `sm` | 14px | 20px | Secondary text, descriptions |
| `base` | 16px | 24px | Body text |
| `lg` | 18px | 28px | Section headings |
| `xl` | 20px | 28px | Page titles |
| `2xl` | 24px | 32px | Large headings |

### 2.3 Font Weights

| Token | Weight | Use |
|-------|--------|-----|
| `normal` | 400 | Body text |
| `medium` | 500 | UI labels, buttons |
| `semibold` | 600 | Card titles, emphasis |
| `bold` | 700 | Headings, strong emphasis |

### 2.4 Typography Patterns

```javascript
// React Native StyleSheet examples
const typography = StyleSheet.create({
  // Card title
  cardTitle: {
    fontFamily: fonts.primary,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.4, // tracking-tight
  },

  // Card description
  cardDescription: {
    fontFamily: fonts.primary,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: colors.mutedForeground,
  },

  // Button text
  buttonText: {
    fontFamily: fonts.primary,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
  },

  // Badge text
  badgeText: {
    fontFamily: fonts.primary,
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
  },
});
```

---

## 3. Spacing System

### 3.1 Spacing Scale

Based on 4px increments (same as Tailwind).

| Token | Value | Tailwind | Use |
|-------|-------|----------|-----|
| `0` | 0px | `0` | None |
| `0.5` | 2px | `0.5` | Micro adjustments |
| `1` | 4px | `1` | Icon gaps |
| `1.5` | 6px | `1.5` | Tight spacing |
| `2` | 8px | `2` | Small padding |
| `2.5` | 10px | `2.5` | Badge padding |
| `3` | 12px | `3` | Medium padding |
| `4` | 16px | `4` | Standard padding |
| `5` | 20px | `5` | Large padding |
| `6` | 24px | `6` | Section spacing |
| `8` | 32px | `8` | Component gaps |
| `10` | 40px | `10` | Large gaps |
| `12` | 48px | `12` | Section margins |

### 3.2 Common Spacing Patterns

```javascript
const spacing = {
  // Card internal padding
  cardPadding: 16,

  // List item gap
  listGap: 8,

  // Section gap
  sectionGap: 24,

  // Icon to text gap
  iconTextGap: 8,

  // Button internal padding
  buttonPaddingX: 16,
  buttonPaddingY: 8,

  // Badge padding
  badgePaddingX: 10,
  badgePaddingY: 2,

  // Input padding
  inputPaddingX: 12,
  inputPaddingY: 8,
};
```

---

## 4. Border Radius

### 4.1 Radius Scale

| Token | Value | Use |
|-------|-------|-----|
| `none` | 0px | Sharp corners |
| `sm` | 6px | Small elements |
| `md` | 8px | Buttons, inputs |
| `lg` | 10px | Base radius |
| `xl` | 14px | Cards |
| `2xl` | 16px | Large cards |
| `full` | 9999px | Pills, avatars |

### 4.2 Component Radius Mapping

| Component | Radius |
|-----------|--------|
| Button | 8px (`md`) |
| Card | 14px (`xl`) |
| Input | 8px (`md`) |
| Badge | 8px (`md`) |
| Avatar | 9999px (`full`) |
| Dialog | 10px (`lg`) |
| Sheet | 10px (top corners only) |

---

## 5. Shadows & Elevation

### 5.1 Shadow Scale

```javascript
// React Native shadow styles
const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
};
```

### 5.2 Component Shadow Mapping

| Component | Shadow Level |
|-----------|--------------|
| Card | `lg` |
| Button (default) | `sm` |
| Dialog/Modal | `xl` |
| Dropdown | `lg` |
| Bottom Sheet | `xl` |
| Floating Action | `lg` |

---

## 6. Animation & Motion

### 6.1 Timing Functions

```javascript
import { Easing } from 'react-native-reanimated';

const easings = {
  // Standard ease
  default: Easing.bezier(0.4, 0, 0.2, 1),

  // Entrance (decelerate)
  easeOut: Easing.bezier(0, 0, 0.2, 1),

  // Exit (accelerate)
  easeIn: Easing.bezier(0.4, 0, 1, 1),

  // Bounce effect
  bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),

  // Spring-like
  spring: Easing.bezier(0.175, 0.885, 0.32, 1.275),
};
```

### 6.2 Duration Scale

| Token | Duration | Use |
|-------|----------|-----|
| `fast` | 150ms | Micro interactions |
| `normal` | 200ms | Most transitions |
| `slow` | 300ms | Page transitions, modals |
| `slower` | 500ms | Complex animations |

### 6.3 Animation Patterns

```javascript
// Fade in
const fadeIn = {
  from: { opacity: 0 },
  to: { opacity: 1 },
  duration: 200,
  easing: easings.easeOut,
};

// Scale in (dialogs)
const scaleIn = {
  from: { opacity: 0, transform: [{ scale: 0.95 }] },
  to: { opacity: 1, transform: [{ scale: 1 }] },
  duration: 200,
  easing: easings.easeOut,
};

// Slide up (sheets)
const slideUp = {
  from: { transform: [{ translateY: '100%' }] },
  to: { transform: [{ translateY: 0 }] },
  duration: 300,
  easing: easings.easeOut,
};

// Float effect (indicators)
const float = {
  keyframes: [
    { transform: [{ translateY: 0 }] },
    { transform: [{ translateY: -5 }] },
    { transform: [{ translateY: 0 }] },
  ],
  duration: 3000,
  iterations: -1, // infinite
  easing: easings.default,
};
```

---

## 7. Component Sizes

### 7.1 Touch Targets

**Minimum touch target: 44x44px** (Apple HIG recommendation)

| Component | Visual Size | Touch Target |
|-----------|-------------|--------------|
| Icon Button | 36x36px | 44x44px |
| List Item | Variable | 44px min height |
| Checkbox | 20x20px | 44x44px |
| Switch | 44x24px | 44x44px |

### 7.2 Button Sizes

| Variant | Height | Padding X | Font Size |
|---------|--------|-----------|-----------|
| `sm` | 32px | 12px | 12px |
| `default` | 32px | 16px | 14px |
| `lg` | 40px | 24px | 14px |
| `icon` | 36px | - | - |

### 7.3 Input Sizes

| Variant | Height | Padding X | Font Size |
|---------|--------|-----------|-----------|
| `default` | 40px | 12px | 16px |
| `sm` | 32px | 8px | 14px |

### 7.4 Icon Sizes

| Size | Dimensions | Use |
|------|------------|-----|
| `xs` | 12x12px | Inline indicators |
| `sm` | 16x16px | Button icons, badges |
| `md` | 20x20px | List item icons |
| `lg` | 24x24px | Navigation icons |
| `xl` | 32x32px | Feature icons |

---

## 8. Z-Index Layering

```javascript
const zIndex = {
  base: 0,
  dropdown: 50,
  sticky: 100,
  overlay: 105,
  modal: 110,
  popover: 120,
  toast: 130,
  tooltip: 140,
};
```

---

## 9. Breakpoints (Reference Only)

The web app uses these breakpoints. For React Native, use `Dimensions` and responsive design patterns.

| Breakpoint | Width | Use |
|------------|-------|-----|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop (not applicable) |

---

## 10. Special Effects

### 10.1 Glass Effect (Bottom Nav)

```javascript
// React Native approximation using blur
import { BlurView } from 'expo-blur';

const GlassBackground = () => (
  <BlurView
    intensity={80}
    tint="light" // or "dark" for dark mode
    style={{
      backgroundColor: 'rgba(250, 249, 245, 0.85)',
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.3)',
    }}
  />
);
```

### 10.2 Focus Ring

```javascript
// Focus state for inputs/buttons
const focusRing = {
  borderWidth: 2,
  borderColor: colors.ring, // #FA8541
  // React Native doesn't have offset, simulate with padding
};
```

---

## 11. Implementation Checklist

### Colors
- [ ] Create color constants file
- [ ] Set up theme context for light/dark
- [ ] Map all semantic tokens
- [ ] Add activity type colors
- [ ] Add status colors

### Typography
- [ ] Load custom fonts (Zalando Sans, Adamina, Fira Code)
- [ ] Create text style presets
- [ ] Test font rendering on iOS/Android

### Spacing & Layout
- [ ] Create spacing constants
- [ ] Create layout helpers
- [ ] Test on multiple screen sizes

### Components
- [ ] Create shadow utilities
- [ ] Create border radius constants
- [ ] Build reusable style compositions

### Animation
- [ ] Install react-native-reanimated
- [ ] Create animation presets
- [ ] Test performance on low-end devices
