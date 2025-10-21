"use server"

import { Match } from "@/_lib/dto/MatchSchedule"
import { advanceWinnerToNextRound, updateEliminationMatchWithAdvancement, updateTeamAssignments } from "@/_lib/server/matchSchedule"
import { revalidatePath } from "next/cache"

export async function saveTeamAssignmentsAction(
  tournamentId: string, 
  teamAssignments: {[matchId: string]: {team1?: string, team2?: string}}
) {
  try {
    const result = await updateTeamAssignments(tournamentId, teamAssignments)
    
    // Revalidate the page to show updated data
    revalidatePath('/administrator/match-schedule/team-assignment')
    revalidatePath('/administrator/match-schedule')
    
    return {
      success: true,
      message: 'Team assignments saved successfully!',
      data: result
    }
  } catch (error) {
    console.error('Error saving team assignments:', error)
    return {
      success: false,
      message: 'Failed to save team assignments',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function advanceWinnerToNextRoundAction(
  tournamentId: string,
  winnerId: string,
  winnerName: string,
  currentMatchId: string,
  currentRound: number
) {
  try {
    const result = await advanceWinnerToNextRound(tournamentId, winnerId, winnerName, currentMatchId, currentRound)
    
    // Revalidate relevant pages
    revalidatePath('/administrator/match-schedule')
    revalidatePath('/administrator/match-schedule/team-assignment')
    
    return {
      success: true,
      message: `${winnerName} has been advanced to the next round!`,
      data: result
    }
  } catch (error) {
    console.error('Error advancing winner to next round:', error)
    return {
      success: false,
      message: 'Failed to advance winner to next round',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function updateEliminationMatchAction(
  matchData: Match,
  shouldAdvanceWinner: boolean = false
) {
  try {
    const result = await updateEliminationMatchWithAdvancement(matchData, shouldAdvanceWinner)
    
    // Revalidate relevant pages
    revalidatePath('/administrator/match-schedule')
    revalidatePath('/administrator/match-schedule/team-assignment')
    
    const winnerName = shouldAdvanceWinner ? 
      (matchData.team1Score > matchData.team2Score ? matchData.team1 : matchData.team2) : 
      null
    
    const message = shouldAdvanceWinner && winnerName ? 
      `Match updated successfully! ${winnerName} has been advanced to the next round.` :
      'Match updated successfully!'
    
    return {
      success: true,
      message,
      data: result,
      winnerAdvanced: shouldAdvanceWinner
    }
  } catch (error) {
    console.error('Error updating elimination match:', error)
    return {
      success: false,
      message: 'Failed to update match',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}