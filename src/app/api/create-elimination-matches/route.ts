import { CreateMatchSchedule, GameType, Round } from '@/_lib/dto/MatchSchedule'
import { FirebaseCollection } from '@/_lib/enums/FirebaseCollection.enum'
import { getActiveSeason } from '@/_lib/services/SeasonService.service'
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

    // Create 10 TBA teams for the tournament structure
    const tbaTeams = Array.from({ length: 10 }, (_, i) => ({
      teamId: `tba-${i + 1}`,
      teamName: "TBA",
      teamLogo: "",
    }))

    console.log("=== CREATING TBA ELIMINATION BRACKET ===")
    console.log(`Creating bracket for ${tbaTeams.length} TBA teams`)

    // Generate the elimination bracket using the dynamic generator
    const eliminationMatches = generateDynamicElimination(tbaTeams)

    // Organize matches into proper rounds based on logical progression
    const rounds: Round[] = []
    let teamsInRound = 10
    let matchIndex = 0
    let roundNumber = 1

    while (teamsInRound > 1) {
      const matchesInThisRound = Math.floor(teamsInRound / 2)
      const byesInThisRound = teamsInRound % 2

      // Get matches for this round
      const roundMatches = eliminationMatches.slice(
        matchIndex,
        matchIndex + matchesInThisRound
      )

      if (roundMatches.length > 0) {
        rounds.push({
          round: roundNumber,
          matches: roundMatches,
        })
      }

      matchIndex += matchesInThisRound
      teamsInRound = matchesInThisRound + byesInThisRound
      roundNumber++
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
    const totalMatches = 8 // 5 + 2 + 1 for 10 teams
    const totalRounds = 3

    return NextResponse.json({
      success: true,
      matchScheduleId,
      totalMatches,
      totalRounds,
      message: `Successfully created elimination tournament with ${totalMatches} matches across ${totalRounds} rounds`
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