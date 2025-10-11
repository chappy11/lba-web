# Color Palette Migration Guide

## Quick Start

Replace hardcoded Tailwind classes with centralized theme constants.

## Import Statement

```tsx
import { THEME, COMBINATIONS, SECTION_BG, BORDERS, ICONS, TEXT } from '@/lib/theme';
```

## Common Replacements

### Gradients

#### Before:
```tsx
<div className="bg-gradient-to-r from-purple-500 to-indigo-600">
```

#### After:
```tsx
<div className={THEME.TEAMS.GRADIENT}>
```

### Buttons

#### Before:
```tsx
<button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
```

#### After:
```tsx
<button className={COMBINATIONS.BUTTON_SECONDARY}>
```

### Sections

#### Before:
```tsx
<div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
```

#### After:
```tsx
<div className={COMBINATIONS.SECTION_INFO}>
```

### Icons

#### Before:
```tsx
<Trophy className="w-5 h-5 text-green-600" />
```

#### After:
```tsx
<Trophy className={`w-5 h-5 ${ICONS.GREEN}`} />
```

## Theme Mapping

### Teams Components
```tsx
// Gradient
THEME.TEAMS.GRADIENT          // bg-gradient-to-r from-purple-500 to-indigo-600
THEME.TEAMS.GRADIENT_BR       // bg-gradient-to-br from-purple-500 to-indigo-600
THEME.TEAMS.GRADIENT_HOVER    // hover:from-purple-600 hover:to-indigo-700

// Section
COMBINATIONS.SECTION_INFO     // Includes background, border, padding, rounded corners
```

### Player Components
```tsx
// Gradient
THEME.PLAYER.GRADIENT         // bg-gradient-to-r from-red-500 to-orange-600
THEME.PLAYER.GRADIENT_BR      // bg-gradient-to-br from-red-500 to-orange-600
THEME.PLAYER.GRADIENT_HOVER   // hover:from-red-600 hover:to-orange-700

// Section
COMBINATIONS.SECTION_PLAYER   // Red/orange section background
```

### Match/Game Components
```tsx
// Info sections
COMBINATIONS.SECTION_INFO     // Blue gradient background

// Score sections
COMBINATIONS.SECTION_SUCCESS  // Green gradient background

// Warning sections
COMBINATIONS.SECTION_WARNING  // Yellow gradient background
```

### MVP/Achievement Components
```tsx
// Achievement sections
COMBINATIONS.SECTION_ACHIEVEMENT  // Purple/pink gradient background

// Icon
ICONS.PURPLE                     // text-purple-600
```

## Full Component Example

### Before:
```tsx
export default function ExampleComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Title</h2>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <Trophy className="w-5 h-5 text-blue-600" />
          <p className="text-gray-700">Content</p>
        </div>

        <button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
          Click Me
        </button>
      </div>
    </div>
  );
}
```

### After:
```tsx
import { THEME, COMBINATIONS, ICONS, TEXT, BG } from '@/lib/theme';
import { Users, Trophy } from 'lucide-react';

export default function ExampleComponent() {
  return (
    <div className={`min-h-screen ${BG.PAGE} p-8`}>
      <div className={COMBINATIONS.CARD}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 ${THEME.TEAMS.GRADIENT_BR} rounded-lg`}>
            <Users className="w-6 h-6 text-white" />
          </div>
          <h2 className={`text-2xl font-bold ${TEXT.PRIMARY}`}>Title</h2>
        </div>
        
        <div className={COMBINATIONS.SECTION_INFO}>
          <Trophy className={`w-5 h-5 ${ICONS.BLUE}`} />
          <p className={TEXT.SECONDARY}>Content</p>
        </div>

        <button className={COMBINATIONS.BUTTON_PRIMARY}>
          Click Me
        </button>
      </div>
    </div>
  );
}
```

## Step-by-Step Migration

1. **Add Import**
   ```tsx
   import { THEME, COMBINATIONS, ICONS, TEXT } from '@/lib/theme';
   ```

2. **Replace Gradients**
   - Find: `bg-gradient-to-r from-purple-500 to-indigo-600`
   - Replace: `{THEME.TEAMS.GRADIENT}`

3. **Replace Section Backgrounds**
   - Find: `bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100`
   - Replace: `{COMBINATIONS.SECTION_INFO}`

4. **Replace Buttons**
   - Find: Long button class strings
   - Replace: `{COMBINATIONS.BUTTON_PRIMARY}` or similar

5. **Replace Icon Colors**
   - Find: `text-blue-600`
   - Replace: `{ICONS.BLUE}`

6. **Replace Text Colors**
   - Find: `text-gray-900`
   - Replace: `{TEXT.PRIMARY}`

## Available Constants

### THEME
- `THEME.TEAMS` - Purple/Indigo for teams
- `THEME.INFO` - Blue/Indigo for info
- `THEME.PLAYER` - Red/Orange for players
- `THEME.SUCCESS` - Green/Emerald for success
- `THEME.WARNING` - Yellow/Orange for warnings
- `THEME.ACHIEVEMENT` - Purple/Pink for achievements

### COMBINATIONS
- `COMBINATIONS.BUTTON_PRIMARY`
- `COMBINATIONS.BUTTON_SECONDARY`
- `COMBINATIONS.BUTTON_PLAYER`
- `COMBINATIONS.SECTION_INFO`
- `COMBINATIONS.SECTION_SUCCESS`
- `COMBINATIONS.SECTION_WARNING`
- `COMBINATIONS.SECTION_PLAYER`
- `COMBINATIONS.SECTION_ACHIEVEMENT`
- `COMBINATIONS.CARD`
- `COMBINATIONS.CARD_HOVER`
- `COMBINATIONS.ACCENT_TEAMS`
- `COMBINATIONS.ACCENT_PLAYER`
- `COMBINATIONS.ACCENT_INFO`

### SECTION_BG
- `SECTION_BG.BLUE`
- `SECTION_BG.PURPLE`
- `SECTION_BG.GREEN`
- `SECTION_BG.YELLOW`
- `SECTION_BG.RED`
- `SECTION_BG.GRAY`

### BORDERS
- `BORDERS.BLUE`
- `BORDERS.PURPLE`
- `BORDERS.GREEN`
- `BORDERS.YELLOW`
- `BORDERS.RED`
- `BORDERS.GRAY`

### TEXT
- `TEXT.PRIMARY` - text-gray-900
- `TEXT.SECONDARY` - text-gray-700
- `TEXT.MUTED` - text-gray-600
- `TEXT.LIGHT` - text-gray-500
- `TEXT.WHITE` - text-white

### ICONS
- `ICONS.BLUE`
- `ICONS.PURPLE`
- `ICONS.GREEN`
- `ICONS.YELLOW`
- `ICONS.RED`
- `ICONS.ORANGE`
- `ICONS.INDIGO`

### BG
- `BG.PAGE` - Page background gradient
- `BG.CARD` - Card background (white)
- `BG.HOVER` - Hover state background

## Tips

1. **String Interpolation**: When mixing with other classes:
   ```tsx
   <div className={`p-4 ${THEME.TEAMS.GRADIENT} rounded-lg`}>
   ```

2. **Combining Classes**: Use template literals:
   ```tsx
   <button className={`${THEME.INFO.GRADIENT} ${THEME.INFO.GRADIENT_HOVER} custom-class`}>
   ```

3. **Conditional Classes**: Works with conditionals:
   ```tsx
   <div className={isActive ? THEME.SUCCESS.GRADIENT : THEME.WARNING.GRADIENT}>
   ```

4. **TypeScript**: Full type safety with autocomplete:
   ```tsx
   const buttonClass = COMBINATIONS.BUTTON_PRIMARY; // Type checked!
   ```

## Benefits of Migration

✅ Centralized color management
✅ Easier to update theme globally
✅ Type-safe with autocomplete
✅ Consistent across all components
✅ Shorter, cleaner code
✅ Self-documenting (semantic names)
