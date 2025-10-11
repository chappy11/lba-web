# Elimination Winners Backend API Documentation

## Overview
This document describes the backend functions for arranging winners in elimination match schedules based on total scores.

## New Functions Added

### 1. `arrangeEliminationWinners()`

**Location:** `/src/_lib/services/MatchSchedule.service.ts`

**Purpose:** Automatically processes all semifinal matches, determines winners based on total scores (team1Score + team1MatchScore vs team2Score + team2MatchScore), and advances them to the final match.

**How it works:**
1. Fetches the current elimination match schedule
2. Finds semifinal and final rounds
3. Calculates total scores for each team in semifinal matches
4. Determines winners based on total scores
5. Updates semifinal matches with winner information
6. Advances the top 2 winners to the final match
7. Saves the updated schedule to Firebase

**Returns:**
```typescript
{
  success: boolean
  message: string
  semifinalWinners: Array<{
    teamId: string
    teamName: string
    teamLogo: string
    totalScore: number
    matchIndex: number
  }>
  updatedSchedule: SeasonGames
}
```

**Usage Example:**
```typescript
import { arrangeEliminationWinners } from "@/_lib/services/MatchSchedule.service"

const result = await arrangeEliminationWinners()
console.log(result.semifinalWinners)
```

---

### 2. `getMatchWinner(match)`

**Location:** `/src/_lib/services/MatchSchedule.service.ts`

**Purpose:** Calculates the winner of a specific match based on total scores.

**Parameters:**
- `match: Match` - The match object to evaluate

**Returns:**
```typescript
{
  winnerId: string
  winnerName: string
  winnerLogo: string
  totalScore: number
} | null  // Returns null if tie or no scores
```

**Usage Example:**
```typescript
import { getMatchWinner } from "@/_lib/services/MatchSchedule.service"

const winner = getMatchWinner(match)
if (winner) {
  console.log(`Winner: ${winner.winnerName} with ${winner.totalScore} points`)
}
```

---

### 3. `advanceWinnerToFinal(semifinalMatchId, finalSlot)`

**Location:** `/src/_lib/services/MatchSchedule.service.ts`

**Purpose:** Manually advances a specific semifinal winner to a designated slot in the final match.

**Parameters:**
- `semifinalMatchId: string` - The ID of the semifinal match
- `finalSlot: 1 | 2` - Which team slot in the final (1 for team1, 2 for team2)

**Returns:**
```typescript
{
  success: boolean
  message: string
  winner: {
    winnerId: string
    winnerName: string
    winnerLogo: string
    totalScore: number
  }
}
```

**Usage Example:**
```typescript
import { advanceWinnerToFinal } from "@/_lib/services/MatchSchedule.service"

// Advance winner of semifinal match to team1 slot in final
const result = await advanceWinnerToFinal("semifinal-match-id-123", 1)
```

---

## Server API Endpoints

Add these to your `/src/_lib/server/matchSchedule.ts`:

```typescript
/**
 * Arranges winners in elimination matches based on total scores
 * Automatically advances semifinal winners to the final match
 */
export const arrangeEliminationWinners = async () => {
  const resp = await axiosConfig.post("/arrange-elimination-winners")
  return resp.data
}

/**
 * Advance a specific semifinal winner to a specific slot in the final
 * @param semifinalMatchId - The ID of the semifinal match
 * @param finalSlot - Which slot to fill in the final (1 or 2)
 */
export const advanceWinnerToFinal = async (
  semifinalMatchId: string,
  finalSlot: 1 | 2
) => {
  const resp = await axiosConfig.post("/advance-winner-to-final", {
    semifinalMatchId,
    finalSlot,
  })
  return resp.data
}
```

---

## How Total Scores Are Calculated

For each match, the winner is determined by:
```
Team 1 Total Score = team1Score + team1MatchScore
Team 2 Total Score = team2Score + team2MatchScore

Winner = Team with higher total score
```

---

## Data Flow

### Automatic Winner Arrangement
```
1. Call arrangeEliminationWinners()
   ↓
2. Fetch elimination schedule from Firebase
   ↓
3. Process all semifinal matches
   ↓
4. Calculate total scores (score + matchScore)
   ↓
5. Determine winners
   ↓
6. Update semifinal matches with winner IDs
   ↓
7. Place top 2 winners in final match (team1 and team2)
   ↓
8. Save to Firebase
   ↓
9. Return results
```

### Manual Winner Advancement
```
1. Call advanceWinnerToFinal(matchId, slot)
   ↓
2. Find specific semifinal match
   ↓
3. Calculate winner
   ↓
4. Update final match's specified slot
   ↓
5. Save to Firebase
   ↓
6. Return winner info
```

---

## Usage in Components

### Example: Button to Arrange Winners

```typescript
"use client"

import { arrangeEliminationWinners } from "@/_lib/server/matchSchedule"
import { useState } from "react"

export default function ArrangeWinnersButton() {
  const [loading, setLoading] = useState(false)
  
  const handleArrange = async () => {
    try {
      setLoading(true)
      const result = await arrangeEliminationWinners()
      alert(`Success! ${result.semifinalWinners.length} winners advanced to final`)
    } catch (error) {
      alert("Error arranging winners: " + error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <button
      onClick={handleArrange}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      {loading ? "Processing..." : "Arrange Elimination Winners"}
    </button>
  )
}
```

---

## Error Handling

The functions throw errors in these cases:
- No elimination match schedule found
- No semifinal round found
- No final round found  
- Semifinal match not found (for advanceWinnerToFinal)
- No winner determined (for advanceWinnerToFinal)

Always wrap calls in try-catch blocks:

```typescript
try {
  const result = await arrangeEliminationWinners()
  // Handle success
} catch (error) {
  console.error("Error:", error)
  // Handle error
}
```

---

## Testing

To test the functions:

1. Ensure you have:
   - A round-robin schedule completed
   - An elimination schedule created
   - Semifinal matches with scores entered

2. Call `arrangeEliminationWinners()`

3. Verify:
   - Semifinal matches have `winner` field populated
   - Final match has both `team1` and `team2` populated
   - Teams in final are the ones with highest scores from semifinals

---

## Notes

- The function uses `team1Score + team1MatchScore` for total calculation
- In case of a tie, no winner is set (remains "TBA")
- The function automatically determines which teams go to final based on match order
- First semifinal winner → team1 in final
- Second semifinal winner → team2 in final
