# Dynamic Elimination Bracket Generator

## Overview
This system generates single-elimination tournament brackets for any number of teams. It automatically handles:
- Power-of-2 team counts (2, 4, 8, 16, 32, etc.)
- Non-power-of-2 team counts with automatic bye distribution
- Proper seeding based on standings
- Multiple rounds (quarterfinals, semifinals, finals)

## Features

### 1. **Automatic Bracket Sizing**
The system automatically determines the bracket size based on the number of teams:
- 2-4 teams → 4-team bracket (semifinals + final)
- 5-8 teams → 8-team bracket (quarterfinals + semifinals + final)
- 9-16 teams → 16-team bracket (round of 16 + quarterfinals + semifinals + final)
- And so on...

### 2. **Smart Bye Distribution**
When the number of teams is not a power of 2, the system:
- Calculates how many byes are needed
- Distributes byes to favor higher-seeded teams
- Example: 6 teams → 8-team bracket with 2 byes for top seeds

### 3. **Proper Seeding**
Teams are seeded based on their round-robin performance:
- Primary: Wins (descending)
- Secondary: Goals For (descending)
- Top seeds get favorable matchups and byes

### 4. **Match Type Classification**
Each match is properly labeled:
- `FINAL` - Championship match
- `SEMIFINAL` - Second-to-last round
- `NONE` - Earlier rounds (quarterfinals, etc.)

## Usage

### Using the Service Function (Recommended)

```typescript
import { createDynamicEliminationMatch } from '@/_lib/services/MatchSchedule.service'

// Generate elimination bracket from current round robin standings
const eliminationMatches = await createDynamicEliminationMatch()
```

This function:
1. Fetches current round-robin standings
2. Sorts teams by performance
3. Generates the complete elimination bracket
4. Returns array of all matches

### Using the Utility Function Directly

```typescript
import { generateDynamicElimination } from '@/_lib/utils/teamUtils'
import { Standing } from '@/_lib/dto/MatchSchedule'

const standings: Standing[] = [
  { teamId: '1', teamName: 'Team A', wins: 5, losses: 0, goalsFor: 100, teamLogo: '...' },
  { teamId: '2', teamName: 'Team B', wins: 4, losses: 1, goalsFor: 90, teamLogo: '...' },
  { teamId: '3', teamName: 'Team C', wins: 3, losses: 2, goalsFor: 80, teamLogo: '...' },
  // ... more teams
]

const eliminationMatches = generateDynamicElimination(standings)
```

### Creating Elimination Schedule

To add elimination matches to the schedule:

```typescript
import { createSchedule } from '@/_lib/services/MatchSchedule.service'
import { GameType } from '@/_lib/dto/MatchSchedule'

// This will use the old 4-team elimination
await createSchedule(GameType.ELIMINATION)

// To use dynamic elimination, modify createSchedule to use:
// const eliminationMatches = await createDynamicEliminationMatch()
```

## Examples

### Example 1: 4 Teams (Perfect Bracket)
```
Input: 4 teams
Output: 4-team bracket
- Round 1 (Semifinals): 2 matches
- Round 2 (Final): 1 match
Total: 3 matches
```

### Example 2: 6 Teams (With Byes)
```
Input: 6 teams
Output: 8-team bracket (2 byes)
- Round 1 (Quarterfinals): 4 matches (2 with byes)
- Round 2 (Semifinals): 2 matches
- Round 3 (Final): 1 match
Total: 7 matches

Seeding:
- Seed 1 vs BYE (auto-win for Seed 1)
- Seed 4 vs Seed 5
- Seed 3 vs Seed 6
- Seed 2 vs BYE (auto-win for Seed 2)
```

### Example 3: 8 Teams
```
Input: 8 teams
Output: 8-team bracket
- Round 1 (Quarterfinals): 4 matches
- Round 2 (Semifinals): 2 matches
- Round 3 (Final): 1 match
Total: 7 matches

Seeding:
- Seed 1 vs Seed 8
- Seed 4 vs Seed 5
- Seed 3 vs Seed 6
- Seed 2 vs Seed 7
```

## Match Structure

Each match in the bracket contains:

```typescript
{
  id: string,                    // Unique match ID
  team1: string,                 // Team 1 name (or empty for future rounds)
  team2: string,                 // Team 2 name (or empty for future rounds)
  team1Id: string,               // Team 1 ID
  team2Id: string,               // Team 2 ID
  team1Score: number,            // Team 1 score (0 initially)
  team2Score: number,            // Team 2 score (0 initially)
  winner: string,                // "TBA" or winner team ID (for byes)
  address: string,               // Game location ("TBA" initially)
  gameDate: string,              // Game date ("TBA" initially)
  gameTime: string,              // Game time ("TBA" initially)
  matchType: MatchType,          // SEMIFINAL, FINAL, or NONE
  gameType: GameType,            // ELIMINATION
  playerMvp: null,               // MVP data (null initially)
  team1MatchScore: number,       // Additional score (0 initially)
  team2MatchScore: number,       // Additional score (0 initially)
  team1Logo: string,             // Team 1 logo URL
  team2Logo: string              // Team 2 logo URL
}
```

## Advancing Winners

After each match is completed, winners advance to the next round. You'll need to:

1. Update the match with the winner
2. Call `arrangeEliminationWinners()` to automatically populate next rounds
3. Or manually use `advanceWinnerToFinal()` for specific matches

See `ELIMINATION_WINNERS_BACKEND.md` for more details on winner advancement.

## Integration with Existing System

### Option 1: Replace Current Elimination (Breaking Change)
Modify the `createSchedule` function:

```typescript
if (matchType === GameType.ELIMINATION) {
  const eliminationMatches = await createDynamicEliminationMatch() // Use dynamic
  // ... rest of the code
}
```

### Option 2: Add New Game Type (Non-Breaking)
1. Add new enum value: `GameType.DYNAMIC_ELIMINATION`
2. Handle it in `createSchedule`:

```typescript
if (matchType === GameType.DYNAMIC_ELIMINATION) {
  const eliminationMatches = await createDynamicEliminationMatch()
  // ... save to database
}
```

### Option 3: Add Flag/Parameter
```typescript
export async function createSchedule(matchType: GameType, useDynamic = false) {
  if (matchType === GameType.ELIMINATION) {
    const eliminationMatches = useDynamic 
      ? await createDynamicEliminationMatch()
      : await createEliminationMatch()
    // ... rest of the code
  }
}
```

## Testing

Test the function with different team counts:

```typescript
// Test with 3 teams (will create 4-team bracket with 1 bye)
const teams3 = standings.slice(0, 3)
const bracket3 = generateDynamicElimination(teams3)
console.log(`3 teams: ${bracket3.length} matches`)

// Test with 5 teams (will create 8-team bracket with 3 byes)
const teams5 = standings.slice(0, 5)
const bracket5 = generateDynamicElimination(teams5)
console.log(`5 teams: ${bracket5.length} matches`)

// Test with 7 teams (will create 8-team bracket with 1 bye)
const teams7 = standings.slice(0, 7)
const bracket7 = generateDynamicElimination(teams7)
console.log(`7 teams: ${bracket7.length} matches`)
```

## Benefits Over Fixed 4-Team Elimination

1. **Scalability**: Works with any number of teams
2. **Flexibility**: No need to artificially limit to 4 teams
3. **Fair Seeding**: Better teams get easier paths
4. **Automatic Byes**: Handles odd team counts gracefully
5. **Future-Proof**: Easy to expand tournament size

## Notes

- Minimum 2 teams required
- Byes automatically advance the higher seed to the next round
- All matches after round 1 start with empty teams (placeholders)
- Winners must be populated after each match completion
- Use the existing winner arrangement functions to populate subsequent rounds
