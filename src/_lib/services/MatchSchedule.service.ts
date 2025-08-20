import { doc, updateDoc } from "firebase/firestore"

import db from "../config/firebaseConfig"

import {
  CreateMatchResult,
  CreateMatchSchedule,
  GameType,
  Match,
  MatchType,
  Round,
  SeasonGames,
} from "../dto/MatchSchedule"
import { Team } from "../dto/Team.model"
import { FirebaseCollection } from "../enums/FirebaseCollection.enum"

import { GetFirebaseDataPayload } from "../type/firebaseType.type"
import { addCollection, getData } from "../utils/firebase.utils"
import {
  generateRoundRobinSchedule,
  getStandings,
  singleElimation,
} from "../utils/teamUtils"
import { getActiveSeason } from "./SeasonService.service"
import { getTeamFromThisSeason } from "./TeamService.service"

export async function createSchedule(matchType: GameType) {
  try {
    const season = await getActiveSeason()
    if (!season) {
      return null
    }

    if (matchType === GameType.ELIMINATION) {
      const eliminationMatches = await createEliminationMatch()
      const dataRound: Round = {
        round: 1,
        matches: eliminationMatches,
      }

      const createMatchesPayload: CreateMatchSchedule = {
        done: false,
        seasonId: season.id,
        matchType: matchType,
        matchSchedule: [dataRound],
      }

      const resp = await addCollection(
        FirebaseCollection.MATCH_SCHEDULE,
        createMatchesPayload
      )
      return resp.id
    }

    // For Round Robin matches
    const matches = await roundRobin()

    const createMatchesPayload: CreateMatchSchedule = {
      done: false,
      seasonId: season.id,
      matchType: matchType,
      matchSchedule: matches,
    }

    const resp = await addCollection(
      FirebaseCollection.MATCH_SCHEDULE,
      createMatchesPayload
    )

    return resp.id
  } catch (error) {
    console.error("Error creating schedule:", error)
    throw new Error("Failed to create schedule")
  }
}

export async function getMatchSchedule(gameType: GameType) {
  try {
    const season = await getActiveSeason()
    if (!season) {
      throw new Error("No active season found")
    }
    const payload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.MATCH_SCHEDULE,
      filter: [
        ["seasonId", "==", season.id],
        ["matchType", "==", gameType.toString()],
      ],
    }

    const resp = await getData(payload)

    return resp
  } catch (error) {
    throw new Error(
      "Something went wrong while fetching match schedule  data: " + error
    )
  }
}

export async function roundRobin() {
  const teams = (await getTeamFromThisSeason()) as unknown as Team[]

  if (teams.length < 1) {
    throw new Error("No teams found for the current season")
  }

  const inputTeams = teams.map((team) => ({
    teamId: team.id as string,
    teamName: team.teamName,
    teamLogo: team.teamLogo, // Use a default logo if none exists
  }))

  const matches = await generateRoundRobinSchedule(inputTeams)

  return matches
}

export async function updateMatches(id: string, matches: SeasonGames) {
  console.log("ID0", id)
  console.log("MATCHES0", JSON.stringify(matches, null, 2))
  const cleanedPayload = removeUndefinedFields(matches)
  await updateDoc(
    doc(db, FirebaseCollection.MATCH_SCHEDULE, id),
    cleanedPayload
  )

  return matches
}

function removeUndefinedFields(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedFields)
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefinedFields(v)])
    )
  }
  return obj
}

export async function updateEliminationRound(updatePayload: Match) {
  try {
    const matches = (await getMatchSchedule(
      GameType.ELIMINATION
    )) as Array<SeasonGames>
    if (!matches || matches.length === 0) {
      throw new Error("No match schedule found for elimination round update")
    }
    const eliminationMatches = matches[0].matchSchedule.map((round) => {
      return {
        ...round,
        matches: round.matches.map((match) =>
          match.id === updatePayload.id ? updatePayload : match
        ),
      }
    })

    const updatedData: SeasonGames = {
      ...matches[0],
      matchSchedule: eliminationMatches,
    }
    const createMatchResultPayload: CreateMatchResult = {
      team1: updatePayload.team1,
      team2: updatePayload.team2,
      gameId: updatePayload.id,
      team1Logo: updatePayload.team1Logo || "",
      team2Logo: updatePayload.team2Logo || "",
      team1Id: updatePayload.team1Id || "",
      team2Id: updatePayload.team2Id || "",
      team1Score: updatePayload.team1Score || 0,
      team2Score: updatePayload.team2Score || 0,
      gameDate: updatePayload.gameDate || "TBA",
      winner: updatePayload.winner || "TBA",
      playerMvp: null,
    }

    if (updatePayload.winner !== "TBA") {
      const finalElimationMatch = matches[0].matchSchedule?.map((round) => {
        const teamWinner =
          updatePayload?.winner === updatePayload?.team1Id
            ? updatePayload?.team1
            : updatePayload?.team2

        const teamWinnerLogo =
          updatePayload?.winner === updatePayload?.team1Id
            ? updatePayload?.team1Logo
            : updatePayload?.team2Logo
        return {
          ...round,
          matches: round?.matches?.map((match) =>
            match?.matchType === MatchType.FINAL.toString()
              ? {
                  ...match,
                  team1: match?.team1 === "" ? teamWinner : match?.team1,
                  team2: match?.team2 === "" ? teamWinner : match?.team2,
                  team1Logo:
                    match?.team1Logo === "" ? teamWinnerLogo : match?.team1Logo,
                  team2Logo:
                    match?.team2Logo === "" ? teamWinnerLogo : match?.team2Logo,
                  team1Id:
                    match?.team1Id === ""
                      ? updatePayload?.winner
                      : match.team1Id,
                  team2Id:
                    match?.team2Id === ""
                      ? updatePayload?.winner
                      : match.team2Id,
                }
              : match
          ),
        }
      })

      console.log("UPDATE", JSON.stringify(finalElimationMatch, null, 2))

      const updateD: SeasonGames = {
        ...matches[0],
        matchSchedule: finalElimationMatch,
      }

      console.log("UPDATE DATA", JSON.stringify(updateD, null, 2))
      await createMatchResult(createMatchResultPayload)
      return await updateMatches(matches[0].id, updateD)
    }

    await createMatchResult(createMatchResultPayload)

    return await updateMatches(matches[0].id, updatedData)
  } catch (error) {
    console.log("ERROR", error)
  }
}

export async function createEliminationMatch() {
  const matches = (await getMatchSchedule(
    GameType.ROUND_ROBIN
  )) as Array<SeasonGames>
  if (!matches || matches.length === 0) {
    throw new Error("No match schedule found for elimination round creation")
  }
  const standing = getStandings(matches[0].matchSchedule)
  console.table(standing)
  if (standing.length < 2) {
    throw new Error("Not enough teams for elimination matches")
  }
  const eliminationMatches = singleElimation(standing)

  return eliminationMatches
}

export async function createMatchResult(matchResult: CreateMatchResult) {
  try {
    const resp = await addCollection(
      FirebaseCollection.MATCH_RESULTS,
      matchResult
    )
    return resp.id
  } catch (error) {
    console.log(error)
  }
}
