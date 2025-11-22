# End Season Dialog - Usage Guide

## Overview
The `EndSeasonDialog` component provides a user-friendly interface to mark a season as complete/done with proper confirmation and warnings.

## Features
✅ Beautiful confirmation dialog with season details
✅ Warning messages about the consequences
✅ Loading states during the update
✅ Success/error toast notifications
✅ Automatic page refresh after completion
✅ Disabled state for already completed seasons
✅ Responsive design

## Usage

### Basic Usage
```tsx
import EndSeasonDialog from "@/feature/season/EndSeasonDialog"

function MyComponent() {
  const season = {
    id: "season123",
    seasonName: "Summer League 2024",
    isActiveSeason: 1,
    seasonStartDate: "2024-06-01",
    seasonEndDate: "2024-08-31",
    // ... other season properties
  }

  return <EndSeasonDialog season={season} />
}
```

### With Callback
```tsx
import EndSeasonDialog from "@/feature/season/EndSeasonDialog"

function MyComponent() {
  const handleSeasonEnded = () => {
    console.log("Season has been ended!")
    // Perform additional actions here
  }

  return (
    <EndSeasonDialog 
      season={season} 
      onSuccess={handleSeasonEnded}
    />
  )
}
```

### In a Table Row (like SeasonList)
```tsx
<td>
  <EndSeasonDialog season={item} />
</td>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `season` | `Season` | Yes | The season object to be ended |
| `onSuccess` | `() => void` | No | Callback function called after successful completion |

## Season Object Requirements

The `season` prop must include:
- `id` - Firebase document ID (required for update)
- `seasonName` - Display name
- `isActiveSeason` - 1 for active, 0 for inactive
- `seasonStartDate` - ISO date string or formatted date
- `seasonEndDate` - ISO date string or formatted date

## What Happens When You End a Season

1. User clicks "End Season" button
2. Confirmation dialog appears with:
   - Season details
   - Warning about consequences
   - List of actions that will be performed
3. User confirms by clicking "Yes, Complete Season"
4. Season's `isActiveSeason` is set to `0` in Firebase
5. Success toast notification appears
6. Dialog closes
7. Optional `onSuccess` callback is triggered
8. Page automatically refreshes after 1 second

## Styling

The dialog includes:
- Gradient backgrounds (amber/orange theme)
- Warning box with amber color scheme
- Season details in a gray box
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Disabled state styling for completed seasons

## Dependencies

- `@/components/ui/dialog` - Dialog primitives
- `@/components/ui/button` - Button component
- `lucide-react` - Icons
- `sonner` - Toast notifications
- `firebase/firestore` - Database updates

## Example Screenshots

### Active Season Button
Shows "End Season" button in ghost variant (clickable)

### Completed Season Button
Shows "Completed" button in outline variant (disabled, grayed out)

### Dialog View
Full dialog with:
- Trophy icon header
- Season name and dates
- Warning box with bullet points
- Action buttons (Cancel / Yes, Complete Season)
