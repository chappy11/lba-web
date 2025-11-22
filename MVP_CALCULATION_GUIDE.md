# MVP Calculation Feature - Season Update

## Overview
When ending a season, the system can automatically calculate and set the Most Valuable Player (MVP) based on player statistics throughout the season.

## MVP Calculation Formula

```
MVP Score = (Positive Points) - (Negative Points)

Where:
  Positive Points = Points + Three-Pointers + Assists + Steals + Rebounds
  Negative Points = Fouls + Turnovers
```

### Example Calculation
```
Player Stats across all games:
- Points: 250
- Three-Pointers: 45
- Assists: 120
- Steals: 30
- Rebounds: 150
- Fouls: 40
- Turnovers: 25

MVP Score = (250 + 45 + 120 + 30 + 150) - (40 + 25)
MVP Score = 595 - 65
MVP Score = 530
```

## How It Works

### 1. End Season Dialog
When you click "End Season" on an active season, you'll see:
- A checkbox option to "Calculate MVP of the Season"
- The formula displayed
- Confirmation dialog

### 2. MVP Calculation Process
1. Fetches all player statistics from the entire season
2. Groups stats by player ID
3. Calculates total MVP score for each player using the formula
4. Determines the player with the highest score
5. Retrieves player details (name, jersey number, etc.)
6. Retrieves team details (logo, name)
7. Updates the season with MVP information
8. Marks the season as complete (isActiveSeason = 0)

### 3. What Gets Stored
The MVP data stored in the season includes:
```typescript
{
  id: string
  firstname: string
  middlename: string
  lastname: string
  jerseyNumber: string
  teamLogo: string
  teamName: string
}
```

## Usage

### Using the Dialog (Recommended)
```tsx
import EndSeasonDialog from "@/feature/season/EndSeasonDialog"

<EndSeasonDialog season={seasonObject} />
```

### Programmatic Usage
```typescript
import { updateSeasonWithMvp } from "@/_lib/services/SeasonService.service"

const result = await updateSeasonWithMvp(seasonId)
console.log(result.mvp) // MVP player details
console.log(result.score) // Winning score
console.log(result.allScores) // All player scores
```

### Via API
```bash
PUT /api/season/update-mvp?seasonId=SEASON_ID
```

Response:
```json
{
  "success": true,
  "message": "Season updated with MVP successfully",
  "data": {
    "mvp": {
      "id": "player123",
      "firstname": "John",
      "lastname": "Doe",
      "jerseyNumber": "23",
      "teamLogo": "https://...",
      "teamName": "Lakers"
    },
    "score": 530,
    "allScores": {
      "player123": 530,
      "player456": 485,
      ...
    }
  }
}
```

## Service Functions

### `updateSeasonWithMvp(seasonId: string)`
Calculates MVP and updates the season.

**Returns:**
```typescript
{
  success: true,
  mvp: MvpOfTheSeason,
  score: number,
  allScores: Record<string, number>
}
```

### `updateSeason(seasonId: string, updates: Partial<Season>)`
Updates season fields without MVP calculation.

**Example:**
```typescript
await updateSeason(seasonId, {
  isActiveSeason: 0,
  gameWinner: winnerData
})
```

## Error Handling

The system handles various errors:
- ❌ No season ID provided
- ❌ No player statistics found
- ❌ MVP player not found in database
- ❌ Player's team not found
- ❌ Firebase update failures

All errors are:
1. Logged to console
2. Displayed via toast notification
3. Thrown for programmatic handling

## Statistics Considered

### Positive Contributions (+)
- **Points**: Field goals made
- **Three-Pointers**: 3-point shots made
- **Assists**: Passes leading to scores
- **Steals**: Ball takeaways from opponents
- **Rebounds**: Ball recoveries after missed shots

### Negative Contributions (-)
- **Fouls**: Rule violations
- **Turnovers**: Losing possession to opponents

## Features

✅ Automatic MVP calculation
✅ Considers entire season performance
✅ Fair scoring based on positive/negative contributions
✅ Stores complete MVP information
✅ Optional - can end season without MVP
✅ Shows all player scores for transparency
✅ Toast notifications with MVP name and score
✅ Type-safe implementation

## UI Components

### EndSeasonDialog
- Checkbox to enable/disable MVP calculation
- Shows formula explanation
- Warning messages
- Season details display
- Loading states
- Success/error feedback

### Display MVP (Future Enhancement)
You can display the season MVP anywhere:
```tsx
{season.mvpOfTheSeason && (
  <div>
    <h3>Season MVP</h3>
    <p>{season.mvpOfTheSeason.firstname} {season.mvpOfTheSeason.lastname}</p>
    <p>#{season.mvpOfTheSeason.jerseyNumber}</p>
    <p>{season.mvpOfTheSeason.teamName}</p>
    <img src={season.mvpOfTheSeason.teamLogo} alt="Team Logo" />
  </div>
)}
```

## Database Updates

The function updates the season document in Firebase:
```typescript
{
  mvpOfTheSeason: {
    id: "player_id",
    firstname: "John",
    middlename: "M",
    lastname: "Doe",
    jerseyNumber: "23",
    teamLogo: "url",
    teamName: "Team Name"
  },
  isActiveSeason: 0
}
```

## Testing

To test the feature:
1. Create a season with players
2. Record player statistics for multiple games
3. Click "End Season" on the active season
4. Check the "Calculate MVP" option
5. Confirm the action
6. Verify the toast shows the MVP name and score
7. Check the season document in Firebase for MVP data

## Future Enhancements

- [ ] MVP leaderboard display
- [ ] Historical MVP tracking
- [ ] MVP award certificates
- [ ] Custom scoring formulas
- [ ] Weighted stats (e.g., 3-pointers worth more)
- [ ] Tie-breaking logic
- [ ] MVP criteria configuration
