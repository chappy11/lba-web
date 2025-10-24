import { CreateMatchSchedule, GameType, Round } from '@/_lib/dto/MatchSchedule'
import { Team } from "@/_lib/dto/Team.model"
import { FirebaseCollection } from "@/_lib/enums/FirebaseCollection.enum"
import { getActiveSeason } from "@/_lib/services/SeasonService.service"
import { getTeamFromThisSeason } from "@/_lib/services/TeamService.service"
import { addCollection } from '@/_lib/utils/firebase.utils'
import { generateDynamicElimination } from '@/_lib/utils/teamUtils'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Get current active season
    const season = await getActiveSeason()
    if (!season) {
      throw new Error("No active season found")
    }

    // Get actual teams from the current season to determine tournament size
    const teams = (await getTeamFromThisSeason()) as Team[]
    if (!teams || teams.length < 2) {
      throw new Error(
        "At least 2 teams are required for elimination tournament"
      )
    }

    console.log("=== CREATING TBA ELIMINATION BRACKET ===")
    console.log(
      `Creating bracket structure for ${teams.length} teams with TBA placeholders`
    )

    // Create TBA teams based on the actual team count for tournament structure
    const tbaTeams = Array.from({ length: teams.length }, (_, i) => ({
      teamId: `tba-${i + 1}`,
      teamName: "TBA",
      teamLogo: "",
    }))

    // Generate the elimination bracket using the dynamic generator with TBA teams
    const eliminationMatches = generateDynamicElimination(tbaTeams)

    // Organize matches into proper rounds based on logical progression
    const rounds: Round[] = []

    // Calculate the proper tournament structure
    let currentTeamCount = teams.length
    let expectedRounds = 0
    while (currentTeamCount > 1) {
      expectedRounds++
      currentTeamCount = Math.floor(currentTeamCount / 2)
    }

    console.log(`Expected ${expectedRounds} rounds for ${teams.length} teams`)

    // Group matches by rounds based on the bracket structure
    let matchIndex = 0
    let teamsRemaining = teams.length

    for (let roundNum = 1; roundNum <= expectedRounds; roundNum++) {
      const matchesInRound = Math.floor(teamsRemaining / 2)

      // Get matches for this specific round
      const roundMatches = eliminationMatches.slice(
        matchIndex,
        matchIndex + matchesInRound
      )

      if (roundMatches.length > 0) {
        rounds.push({
          round: roundNum,
          matches: roundMatches,
        })

        console.log(
          `Round ${roundNum}: ${roundMatches.length} matches (${teamsRemaining} → ${matchesInRound} advance)`
        )
      }

      matchIndex += matchesInRound
      teamsRemaining = matchesInRound
    }

    // Create the match schedule payload
    const createMatchesPayload: CreateMatchSchedule = {
      done: false,
      seasonId: season.id,
      matchType: GameType.ELIMINATION,
      matchSchedule: rounds,
    }

    // Save to Firestore
    const resp = await addCollection(
      FirebaseCollection.MATCH_SCHEDULE,
      createMatchesPayload
    )

    const matchScheduleId = resp.id

    // Calculate tournament info for response
    const totalMatches = eliminationMatches.length
    const totalRounds = rounds.length

    return NextResponse.json({
      success: true,
      matchScheduleId,
      totalMatches,
      totalRounds,
      teamCount: teams.length,
      message: `Successfully created elimination tournament with ${totalMatches} matches across ${totalRounds} rounds for ${teams.length} teams`,
    })
  } catch (error) {
    console.error('Error creating elimination matches:', error)
    return NextResponse.json(
      { 
        message: 'Failed to create elimination matches',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}