import db from '@/_lib/config/firebaseConfig'
import { Match, Round, SeasonGames } from '@/_lib/dto/MatchSchedule'
import { Team } from '@/_lib/dto/Team.model'
import { FirebaseCollection } from '@/_lib/enums/FirebaseCollection.enum'
import { getTeamFromThisSeason } from '@/_lib/services/TeamService.service'
import { doc, updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tournamentId, teamAssignments } = body

    console.log('Received tournamentId:', tournamentId)
    console.log('Received teamAssignments:', teamAssignments)

    if (!tournamentId || !teamAssignments) {
      return NextResponse.json(
        { success: false, message: 'Tournament ID and team assignments are required' },
        { status: 400 }
      )
    }

    // Get all available teams
    const allTeams = await getTeamFromThisSeason() as Team[]
    
    // Get the current tournament document
    const tournamentRef = doc(db, FirebaseCollection.MATCH_SCHEDULE, tournamentId)
    
    // Get tournament data first to update it properly
    const { getEliminationMatchSchedule } = await import('@/_lib/server/matchSchedule')
    const tournaments = await getEliminationMatchSchedule()
    
    console.log('Found tournaments:', tournaments?.length)
    console.log('Tournament IDs:', tournaments?.map((t: SeasonGames) => t.id))
    
    const currentTournament = tournaments?.find((t: SeasonGames) => t.id === tournamentId)
    
    if (!currentTournament) {
      console.log('Tournament not found with ID:', tournamentId)
      return NextResponse.json(
        { success: false, message: 'Tournament not found' },
        { status: 404 }
      )
    }

    console.log('Found tournament:', currentTournament.id)

    // Helper function to find team by ID
    const findTeam = (teamId: string) => allTeams.find(team => team.id === teamId)

    // Update matches with new team assignments
    const updatedMatchSchedule = currentTournament.matchSchedule.map((round: Round) => ({
      ...round,
      matches: round.matches.map((match: Match) => {
        const assignment = teamAssignments[match.id]
        if (!assignment) return match

        const updatedMatch = { ...match }

        // Update team 1 if assigned
        if (assignment.team1) {
          const team1Data = findTeam(assignment.team1)
          if (team1Data) {
            updatedMatch.team1 = team1Data.teamName
            updatedMatch.team1Id = team1Data.id || assignment.team1
            updatedMatch.team1Logo = team1Data.teamLogo
          }
        }

        // Update team 2 if assigned
        if (assignment.team2) {
          const team2Data = findTeam(assignment.team2)
          if (team2Data) {
            updatedMatch.team2 = team2Data.teamName
            updatedMatch.team2Id = team2Data.id || assignment.team2
            updatedMatch.team2Logo = team2Data.teamLogo
          }
        }

        return updatedMatch
      })
    }))

    // Update the tournament in Firestore
    await updateDoc(tournamentRef, {
      matchSchedule: updatedMatchSchedule
    })

    return NextResponse.json({
      success: true,
      message: 'Team assignments updated successfully'
    })

  } catch (error) {
    console.error('Error updating team assignments:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to update team assignments',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}