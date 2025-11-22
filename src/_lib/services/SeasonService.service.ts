
import { doc, updateDoc } from "firebase/firestore"
import db from "../config/firebaseConfig"
import { Player } from "../dto/Player.model"
import { MvpOfTheSeason, SeasonInsertPayload } from "../dto/Season.model"
import { Team } from "../dto/Team.model"
import { PlayerScoreModel } from "../dto/TeamScoring.model"
import { FirebaseCollection } from "../enums/FirebaseCollection.enum"
import {
  GetFirebaseDataPayload,
  WhereDataType,
} from "../type/firebaseType.type"
import { addCollection, getData } from "../utils/firebase.utils"

export async function insertSeason(payload: SeasonInsertPayload) {
  try {
    //   return payload;
    const resp = await addCollection(FirebaseCollection.SEASONS, payload)
    return resp
  } catch (error) {
    console.log(error)
  }
}

export async function getActiveSeason() {
  try {
    const filter: WhereDataType[] = [["isActiveSeason", "==", 1]]

    const payload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.SEASONS,
      filter: filter,
    }

    const resp = await getData(payload)

    return resp[0]
  } catch (error) {
    console.log(error)
  }
}

export async function getAllSeason() {
  try {
    const payload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.SEASONS,
      filter: [],
    }
    const resp = await getData(payload)

    return resp
  } catch (error) {
    throw error
  }
}

/**
 * Calculate MVP score for a player
 * Formula: (points + threepoints + assist + steal + rebound) - (foul + turnOver)
 */
function calculateMvpScore(playerStats: PlayerScoreModel[]): number {
  return playerStats.reduce((total, stat) => {
    const positivePoints =
      (stat.points || 0) +
      (stat.threepoints || 0) +
      (stat.assist || 0) +
      (stat.steal || 0) +
      (stat.rebound || 0)

    const negativePoints = (stat.foul || 0) + (stat.turnOver || 0)

    return total + (positivePoints - negativePoints)
  }, 0)
}

/**
 * Update season with MVP of the season
 * Calculates MVP based on: (positive points) - (fouls + turnovers)
 * Positive points: points + threepoints + assists + steals + rebounds
 */
export async function updateSeasonWithMvp(seasonId: string) {
  try {
    if (!seasonId) {
      throw new Error("Season ID is required")
    }

    // Get all player stats for the season
    const playerStatsPayload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.PLAYER_STATS,
      filter: [],
    }
    const allPlayerStats = (await getData(
      playerStatsPayload
    )) as PlayerScoreModel[]

    if (!allPlayerStats || allPlayerStats.length === 0) {
      throw new Error("No player statistics found")
    }

    // Group stats by player ID
    const playerStatsMap = new Map<string, PlayerScoreModel[]>()

    allPlayerStats.forEach((stat) => {
      const playerId = stat.playerId
      if (!playerStatsMap.has(playerId)) {
        playerStatsMap.set(playerId, [])
      }
      playerStatsMap.get(playerId)?.push(stat)
    })

    // Calculate MVP score for each player
    let mvpPlayerId: string | null = null
    let highestScore = -Infinity
    const playerScores = new Map<string, number>()

    playerStatsMap.forEach((stats, playerId) => {
      const score = calculateMvpScore(stats)
      playerScores.set(playerId, score)

      if (score > highestScore) {
        highestScore = score
        mvpPlayerId = playerId
      }
    })

    if (!mvpPlayerId) {
      throw new Error("Could not determine MVP")
    }

    // Get the MVP player details
    const playerPayload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.PLAYERS,
      filter: [["id", "==", mvpPlayerId]] as WhereDataType[],
    }
    const players = (await getData(playerPayload)) as Player[]

    if (!players || players.length === 0) {
      throw new Error("MVP player not found")
    }

    const mvpPlayer = players[0]

    // Get the player's team details
    const teamPayload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.TEAMS,
      filter: [["id", "==", mvpPlayer.teamId]] as WhereDataType[],
    }
    const teams = (await getData(teamPayload)) as Team[]

    if (!teams || teams.length === 0) {
      throw new Error("MVP player's team not found")
    }

    const mvpTeam = teams[0]

    // Prepare MVP data
    const mvpData: MvpOfTheSeason = {
      id: mvpPlayer.id,
      firstname: mvpPlayer.firstname,
      middlename: mvpPlayer.middlename,
      lastname: mvpPlayer.lastname,
      jerseyNumber: mvpPlayer.jerseyNumber,
      teamLogo: mvpTeam.teamLogo,
      teamName: mvpTeam.teamName,
    }

    // Update the season with MVP
    const seasonRef = doc(db, FirebaseCollection.SEASONS, seasonId)
    await updateDoc(seasonRef, {
      mvpOfTheSeason: mvpData,
      isActiveSeason: 0, // Mark season as completed
    })

    return {
      success: true,
      mvp: mvpData,
      score: highestScore,
      allScores: Object.fromEntries(playerScores),
    }
  } catch (error) {
    console.error("Error updating season with MVP:", error)
    throw error
  }
}

/**
 * Update season fields
 */
export async function updateSeason(
  seasonId: string,
  updates: Partial<Omit<SeasonInsertPayload, "dateCreated">>
) {
  try {
    if (!seasonId) {
      throw new Error("Season ID is required")
    }

    const seasonRef = doc(db, FirebaseCollection.SEASONS, seasonId)
    await updateDoc(seasonRef, updates)

    return { success: true }
  } catch (error) {
    console.error("Error updating season:", error)
    throw error
  }
}
