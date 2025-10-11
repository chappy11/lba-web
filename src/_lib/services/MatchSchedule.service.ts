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

import dayjs from "dayjs"
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

    const resp = (await getData(payload)) as Array<SeasonGames>

    return resp
  } catch (error) {
    throw new Error(
      "Something went wrong while fetching match schedule  data: " + error
    )
  }
}

export async function getMatchesFromThisSeason() {
  try {
    const currentSeason = await getActiveSeason()

    if (!currentSeason) {
      throw new Error("No active season found")
    }

    const payload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.MATCH_SCHEDULE,
      filter: [["seasonId", "==", currentSeason.id]],
    }
    const resp = await getData(payload)
    return resp
  } catch (error) {
    console.log(error)
    throw new Error("Failed to fetch teams for the current season")
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
  const cleanedPayload = removeUndefinedFields(matches) as Partial<SeasonGames>

  await updateDoc(
    doc(db, FirebaseCollection.MATCH_SCHEDULE, id),
    cleanedPayload
  )

  return matches
}

export function removeUndefinedFields(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedFields)
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v !== undefined)
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
      winner:
        updatePayload.team1Score > updatePayload.team2Score
          ? updatePayload.team1Id
          : updatePayload.team2Id,
      playerMvp: null,
      seasonId: matches[0].seasonId || "",
    }

    const checkElimanationMatches = matches[0].matchSchedule.filter((round) => {
      return {
        ...round,
        matches: round.matches.filter((match) => match.id === updatePayload.id),
      }
    })[0]

    const filterDataById = checkElimanationMatches.matches.filter(
      (val) => val.id === updatePayload.id
    )[0]

    if (filterDataById.address !== "TBA") {
      await createMatchResult(createMatchResultPayload)
    }

    await updateMatches(matches[0].id, updatedData)

    if (filterDataById.address === "TBA" && filterDataById.gameTime === "TBA") {
      return await updateMatches(matches[0].id, updatedData)
    }

    if (updatePayload.winner !== "TBA") {
      const retriggerMatches = (await getMatchSchedule(
        GameType.ELIMINATION
      )) as Array<SeasonGames>
      const finalElimationMatch = retriggerMatches[0].matchSchedule?.map(
        (round) => {
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
            matches: round?.matches?.map((match) => {
              if (match?.matchType === MatchType.FINAL.toString()) {
                // Determine which slot to fill based on current state
                const isTeam1Empty = !match?.team1 || match?.team1 === ""
                const isTeam2Empty = !match?.team2 || match?.team2 === ""

                // If team1 is empty, fill team1. Otherwise, fill team2
                const shouldFillTeam1 = isTeam1Empty
                const shouldFillTeam2 = !isTeam1Empty && isTeam2Empty

                return {
                  ...match,
                  team1: shouldFillTeam1 ? teamWinner : match?.team1,
                  team2: shouldFillTeam2 ? teamWinner : match?.team2,
                  team1Logo: shouldFillTeam1
                    ? teamWinnerLogo
                    : match?.team1Logo,
                  team2Logo: shouldFillTeam2
                    ? teamWinnerLogo
                    : match?.team2Logo,
                  team1Id: shouldFillTeam1
                    ? updatePayload?.winner
                    : match?.team1Id,
                  team2Id: shouldFillTeam2
                    ? updatePayload?.winner
                    : match?.team2Id,
                }
              }
              return match
            }),
          }
        }
      )

      const updateD: SeasonGames = {
        ...matches[0],
        matchSchedule: finalElimationMatch,
      }

      await updateMatches(matches[0].id, updateD)

      return
    }
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

// Match Result

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

export async function getMatchResults() {
  try {
    const currentSeason = await getActiveSeason()

    if (!currentSeason) {
      throw new Error("No active season found")
    }
    const payload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.MATCH_RESULTS,
      filter: [["seasonId", "==", currentSeason.id]],
    }

    const resp = await getData(payload)

    return resp
  } catch (error) {
    throw new Error(
      "Something went wrong while fetching match results: " + error
    )
  }
}

export async function getNearestMatches() {
  try {
    const now = dayjs()
    const roundRobinMatches = await getMatchSchedule(GameType.ROUND_ROBIN)
    const eliminationMatches = await getMatchSchedule(GameType.ELIMINATION)

    const allMatches = [
      ...(roundRobinMatches ?? []),
      ...(eliminationMatches ?? []),
    ]

    const findMatchWithDate = allMatches
      .map((data: SeasonGames) =>
        data.matchSchedule
          .map((round: Round) =>
            round.matches.filter(
              (match: Match) =>
                match.gameDate !== "TBA" && match.gameTime !== "TBA"
            )
          )
          .flat()
      )
      .flat()

    let nearestMatch = findMatchWithDate
      .map((m) => ({ ...m, datetime: dayjs(`${m.gameDate} ${m.gameTime}`) }))
      .filter((m) => m.datetime.isAfter(now))
      .sort((a, b) => a.datetime.diff(now) - b.datetime.diff(now))[0]

    if (!nearestMatch) {
      nearestMatch = findMatchWithDate
        .map((m) => ({ ...m, datetime: dayjs(`${m.gameDate} ${m.gameTime}`) }))
        .filter((m) => m.datetime.isBefore(now))
        .sort((a, b) => now.diff(a.datetime) - now.diff(b.datetime))[0]
    }

    return nearestMatch
  } catch {
    throw new Error("Something went wrong while fetching nearest matches")
  }
}