import { axiosConfig } from "../config/config";
import {
  CreateMatchResult,
  Match,
  Round,
  SeasonGames,
} from "../dto/MatchSchedule"

export const getMatchSchedule =
	async () => {
		const resp = await axiosConfig.get(
			"/teams/round-robin"
		);

		return resp.data;
	};

export const createMatchSchedule =
	async () => {
		const resp = await axiosConfig.post(
			"/teams/round-robin"
		);

		return resp.data;
	};

export const updateMatchSchedule =
	async (data: SeasonGames) => {
		const resp = await axiosConfig.put(
			"/match-shedule",
			data
		);

		return resp;
	};

export const getEliminationMatchSchedule = async () => {
  const resp = await axiosConfig.get("/teams/elimination-round")
  return resp.data
}

export const createEliminationMatchSchedule = async () => {
  const resp = await axiosConfig.post("/teams/elimination-round")
  return resp.data
}

export const eliminationMatchScheduleUpdate = async (data: Match) => {
  try {
    console.log("Sending elimination match update request:", {
      matchId: data.id,
      address: data.address,
      gameDate: data.gameDate,
      gameTime: data.gameTime,
      team1Score: data.team1Score,
      team2Score: data.team2Score,
      winner: data.winner,
    })

    const resp = await axiosConfig.put("/elimination-schedule", data)

    console.log("Elimination match update response:", resp.data)
    return resp.data
  } catch (error) {
    console.error("Failed to update elimination match:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
    }
    throw error
  }
}

export const getMatchResuts = async () => {
  const resp = await axiosConfig.get("/match-results")

  return resp.data
}


export const getNearestMatches = async () => {
    const resp = await axiosConfig.get("/nearest-match")
    return resp.data
}
/**
 * Get comprehensive team statistics from all matches
 * Calculates wins, losses, games played, goals, and rankings
 */
export const getTeamStatistics = async () => {
  const resp = await axiosConfig.get("/team-statistics")
  return resp.data
}

/**
 * Get statistics for a specific team
 */
export const getTeamStatisticsById = async (teamId: string) => {
  const resp = await axiosConfig.get(`/team-statistics/${teamId}`)
  return resp.data
}

/**
 * Get elimination tournament data for team assignment
 */
export const getEliminationTournamentData = async () => {
  try {
    const resp = await axiosConfig.get("/get-elimination-matches")
    return resp.data
  } catch (error) {
    console.error('Error fetching elimination tournament data:', error)
    throw error
  }
}

/**
 * Update team assignments for tournament matches
 */
export const updateTeamAssignments = async (tournamentId: string, teamAssignments: {[matchId: string]: {team1?: string, team2?: string}}) => {
  try {
    const resp = await axiosConfig.post("/update-match-teams", {
      tournamentId,
      teamAssignments
    })
    return resp.data
  } catch (error) {
    console.error('Error updating team assignments:', error)
    throw error
  }
}

/**
 * Advance winner to next round in elimination tournament
 * This function automatically places the winner in the appropriate next round match
 */
export const advanceWinnerToNextRound = async (
  tournamentId: string, 
  winnerId: string, 
  winnerName: string, 
  currentMatchId: string, 
  currentRound: number
) => {
  try {
    const resp = await axiosConfig.post("/advance-winner", {
      tournamentId,
      winnerId,
      winnerName,
      currentMatchId,
      currentRound
    })
    return resp.data
  } catch (error) {
    console.error('Error advancing winner to next round:', error)
    throw error
  }
}

/**
 * Update elimination match with automatic winner advancement
 * This combines match update with automatic advancement to next round
 */
export const updateEliminationMatchWithAdvancement = async (matchData: Match, shouldAdvance: boolean = false) => {
  try {
    console.log('Sending elimination match update with advancement:', {
      matchId: matchData.id,
      address: matchData.address,
      gameDate: matchData.gameDate,
      gameTime: matchData.gameTime,
      shouldAdvance,
      winner: matchData.winner
    })
    
    const resp = await axiosConfig.put("/elimination-schedule-with-advancement", {
      matchData,
      shouldAdvance
    })
    
    console.log('Elimination match with advancement response:', resp.data)
    return resp.data
  } catch (error) {
    console.error('Error updating elimination match with advancement:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }
    throw error
  }
}

/**
 * Get the tournament bracket structure and determine next round placement
 * This helps determine where winners should be placed in the next round
 */
export const getTournamentBracketStructure = async (tournamentId: string) => {
  try {
    const resp = await axiosConfig.get(`/tournament-bracket-structure/${tournamentId}`)
    return resp.data
  } catch (error) {
    console.error('Error getting tournament bracket structure:', error)
    throw error
  }
}


export const insertMatchResult = async (payload: CreateMatchResult) => {
  const resp = await axiosConfig.post("/match-results", payload)

  return resp.data
}

export const createRoundRobinElimiantonMatchesApi = async (
  matches: Round[]
) => {
  const resp = await axiosConfig.post(
    "/create-elimination-via-round-robin",
    matches
  )
  return resp.data
}