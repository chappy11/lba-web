# LBA Web Application - Color Palette Guide

## Overview
This document defines the consistent color palette used across the entire LBA Web application to ensure visual harmony and maintainability.

## Color Themes

### 1. Primary Theme (Purple/Indigo)
**Usage:** Teams, Main UI Elements, Navigation
```
- Gradient: from-purple-500 to-indigo-600
- Text: text-purple-600
- Background: bg-purple-500
- Border: border-purple-500
```

**Examples:**
- Team cards and profiles
- Main dashboard sections
- Primary buttons and headers

### 2. Secondary Theme (Blue/Indigo)
**Usage:** Information Cards, Action Buttons, General UI
```
- Gradient: from-blue-600 to-indigo-600
- Text: text-blue-600
- Background: bg-blue-600
- Border: border-blue-600
```

**Examples:**
- Match information sections
- General action buttons
- Info badges and cards

### 3. Player Theme (Red/Orange)
**Usage:** Player-related Components
```
- Gradient: from-red-500 to-orange-600
- Text: text-red-600
- Background: bg-red-500
- Border: border-red-500
```

**Examples:**
- Player cards and profiles
- Player statistics
- Player-specific buttons and badges

### 4. Success Theme (Green/Emerald)
**Usage:** Success States, Winners, Achievements
```
- Gradient: from-green-500 to-emerald-600
- Text: text-green-600
- Background: bg-green-500
- Border: border-green-500
```

**Examples:**
- Winner indicators
- Success messages
- Match scores (winning team)
- Positive stats

### 5. Warning Theme (Yellow/Orange)
**Usage:** Warnings, Featured Items, Special Highlights
```
- Gradient: from-yellow-400 to-orange-500
- Text: text-yellow-600
- Background: bg-yellow-400
- Border: border-yellow-400
```

**Examples:**
- Featured players
- MVP awards
- Warning messages
- Important notifications

### 6. Achievement Theme (Purple/Pink)
**Usage:** Awards, MVPs, Special Achievements
```
- Gradient: from-purple-500 to-pink-600
- Text: text-purple-600
- Background: bg-purple-500
- Border: border-purple-500
```

**Examples:**
- MVP sections
- Post-match achievements
- Award badges
- Special recognitions

## Background Colors

### Page Backgrounds
```css
bg-gradient-to-br from-gray-50 to-gray-100
```

### Card Backgrounds
```css
bg-white
```

### Section Backgrounds (Subtle Gradients)
- **Blue Section:** `bg-gradient-to-br from-blue-50 to-indigo-50` with `border-blue-100`
- **Purple Section:** `bg-gradient-to-br from-purple-50 to-pink-50` with `border-purple-100`
- **Green Section:** `bg-gradient-to-br from-green-50 to-emerald-50` with `border-green-100`
- **Yellow Section:** `bg-gradient-to-br from-yellow-50 to-orange-50` with `border-yellow-200`
- **Red Section:** `bg-gradient-to-br from-red-50 to-orange-50` with `border-red-200`
- **Gray Section:** `bg-gradient-to-r from-gray-50 to-gray-100` with `border-gray-200`

## Text Colors
```css
- Primary: text-gray-900
- Secondary: text-gray-700
- Muted: text-gray-600
- Light: text-gray-500
- White: text-white
```

## Icon Colors
```css
- Blue: text-blue-600
- Purple: text-purple-600
- Green: text-green-600
- Yellow: text-yellow-600
- Red: text-red-600
- Orange: text-orange-600
- Indigo: text-indigo-600
```

## Component Usage Guide

### Teams Components
```tsx
// Header accent
<div className="h-12 w-2 bg-gradient-to-b from-purple-500 to-indigo-600" />

// Card gradient
<div className="bg-gradient-to-br from-purple-500 to-indigo-600" />

// Button
<button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700" />
```

### Players Components
```tsx
// Header accent
<div className="h-1 w-24 bg-gradient-to-r from-red-500 to-orange-600" />

// Card section
<div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200" />

// Icon
<Icon className="w-5 h-5 text-red-600" />
```

### Match/Game Components
```tsx
// Information section
<div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100" />

// Score section
<div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100" />

// Button
<button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" />
```

### MVP/Achievement Components
```tsx
// Background
<div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100" />

// Icon
<Award className="w-5 h-5 text-purple-600" />

// Featured section
<div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200" />
```

## Stats Color Coding

### Player Statistics
- **Points:** `from-blue-500 to-indigo-600`
- **Rebounds:** `from-orange-500 to-red-600`
- **Assists:** `from-green-500 to-emerald-600`
- **3-Pointers:** `from-purple-500 to-indigo-600`
- **Fouls:** `from-red-500 to-orange-600`

## Using the Color Helper

Import and use the centralized color configuration:

```tsx
import { colors, getGradient, getButtonGradient } from '@/lib/colors';

// Example usage
<div className={colors.primary.gradient}>...</div>
<button className={getButtonGradient('primary')}>...</button>
<div className={colors.section.blue}>...</div>
```

## Design Principles

1. **Consistency:** Use the same color theme for related components
2. **Hierarchy:** Use gradients for primary elements, solid colors for secondary
3. **Accessibility:** Ensure sufficient contrast for text readability
4. **Semantic:** Colors should match their purpose (green = success, red = error/player)
5. **Harmony:** Stick to the defined palette for visual cohesion

## Migration Notes

When updating existing components:
1. Replace hardcoded colors with palette colors
2. Use consistent gradient directions (to-r for horizontal, to-br for diagonal)
3. Apply consistent hover states
4. Match border colors to their section backgrounds
5. Use proper icon colors from the palette

## Future Considerations

- Dark mode variants (already defined in globals.css)
- Team-specific accent colors
- Season-specific themes
- Customizable user preferences
