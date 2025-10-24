import { doc, updateDoc } from "firebase/firestore"

import db from "../config/firebaseConfig"

import {
  CreateMatchResult,
  CreateMatchSchedule,
  GameType,
  Match,
  MatchResult,
  Team as MatchTeam,
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
  generateDynamicElimination,
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
      // Use the dynamic elimination system that creates proper brackets for all teams
      const teams = (await getTeamFromThisSeason()) as Team[]

      if (teams.length < 2) {
        throw new Error(
          "At least 2 teams are required for elimination tournament"
        )
      }

      console.log(`Creating elimination tournament for ${teams.length} teams`)

      // Map Team model to MatchTeam format for the bracket generator
      const matchTeams = teams.map((team) => ({
        teamId: team.id || "",
        teamName: team.teamName,
        teamLogo: team.teamLogo,
      }))

      // Generate dynamic elimination bracket - this already creates the correct structure
      const eliminationMatches = generateDynamicElimination(matchTeams)

      console.log(
        `Generated ${eliminationMatches.length} total matches for ${teams.length} teams`
      )

      // Organize matches by their logical rounds based on match types and structure
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

      const createMatchesPayload: CreateMatchSchedule = {
        done: false,
        seasonId: season.id,
        matchType: matchType,
        matchSchedule: rounds,
      }

      const resp = await addCollection(
        FirebaseCollection.MATCH_SCHEDULE,
        createMatchesPayload
      )

      console.log(
        `✅ Elimination tournament created: ${rounds.length} rounds, ${eliminationMatches.length} total matches`
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

export async function createEliminationMatchRound() {
  try {
    const teams = (await getTeamFromThisSeason()) as Team[]

    if (teams.length < 2) {
      throw new Error("Not enough teams for elimination matches")
    }

    // Create and save dynamic elimination bracket to match-schedule
    const matchScheduleId = await createDynamicEliminationMatch(teams)

    console.log(
      `✅ Elimination round created with schedule ID: ${matchScheduleId}`
    )

    return matchScheduleId
  } catch (error) {
    console.error("Error in createEliminationMatchRound:", error)
    throw new Error("Failed to create elimination match round: " + error)
  }
}

/**
 * Create dynamic elimination bracket for any number of teams
 * Generates bracket and saves it to match-schedule collection
 * Automatically handles byes for non-power-of-2 team counts
 *
 * @returns Document ID of the created match schedule
 */
export async function createDynamicEliminationMatch(teams: Team[]) {
  try {
    if (!teams || teams.length === 0) {
      throw new Error("No teams provided for elimination bracket")
    }

    if (teams.length < 2) {
      throw new Error("At least 2 teams are required for elimination bracket")
    }

    // Get current active season
    const season = await getActiveSeason()
    if (!season) {
      throw new Error("No active season found")
    }

    console.log("=== CREATING DYNAMIC ELIMINATION BRACKET ===")
    console.log(`Teams for bracket: ${teams.length}`)
    console.log(`Season ID: ${season.id}`)

    // Map Team model to MatchTeam format
    const matchTeams: MatchTeam[] = teams.map((team) => ({
      teamId: team.id || "",
      teamName: team.teamName,
      teamLogo: team.teamLogo,
    }))

    console.table(matchTeams)

    // Generate the elimination bracket using the dynamic generator
    const eliminationMatches = generateDynamicElimination(matchTeams)

    console.log(`Generated ${eliminationMatches.length} matches`)

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

    console.log(`Organized into ${rounds.length} rounds with proper structure`)

    // Debug output for verification
    rounds.forEach((round) => {
      console.log(`  Round ${round.round}: ${round.matches.length} matches`)
      round.matches.forEach((match, index) => {
        console.log(
          `    Match ${index + 1}: ${match.team1} vs ${match.team2} (${
            match.matchType
          })`
        )
      })
    })

    // Create the match schedule payload
    const createMatchesPayload: CreateMatchSchedule = {
      done: false,
      seasonId: season.id,
      matchType: GameType.ELIMINATION,
      matchSchedule: rounds, // Use the organized rounds
    }

    // Save to Firestore
    const resp = await addCollection(
      FirebaseCollection.MATCH_SCHEDULE,
      createMatchesPayload
    )

    console.log(`✅ Dynamic elimination bracket saved with ID: ${resp.id}`)
    console.log("=== END ELIMINATION BRACKET CREATION ===")

    return resp.id
  } catch (error) {
    console.error("Error creating dynamic elimination matches:", error)
    throw new Error("Failed to create dynamic elimination bracket: " + error)
  }
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

export async function getMatchResults(): Promise<MatchResult[]> {
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

    return resp as MatchResult[]
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

    if (findMatchWithDate.length < 1) {
      return null
    }

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

    // Return null if still no match found instead of throwing error
    return nearestMatch || null
  } catch (error) {
    console.error("Error fetching nearest matches:", error)
    // Return null instead of throwing error for graceful degradation
    return null
  }
}

/**
 * Arranges winners in elimination match schedule based on total scores
 * This function processes all semifinal matches and advances winners to the finals
 * @returns Updated SeasonGames with winners arranged
 */
export async function arrangeEliminationWinners() {
  try {
    // Get elimination matches
    const matches = (await getMatchSchedule(
      GameType.ELIMINATION
    )) as Array<SeasonGames>

    if (!matches || matches.length === 0) {
      throw new Error("No elimination match schedule found")
    }

    const eliminationSchedule = matches[0]

    // Find semifinal and final rounds
    const semifinalRound = eliminationSchedule.matchSchedule.find((round) =>
      round.matches.some((match) => match.matchType === MatchType.SEMIFINAL)
    )

    const finalRound = eliminationSchedule.matchSchedule.find((round) =>
      round.matches.some((match) => match.matchType === MatchType.FINAL)
    )

    if (!semifinalRound) {
      throw new Error("No semifinal round found")
    }

    if (!finalRound) {
      throw new Error("No final round found")
    }

    // Process semifinal matches and determine winners
    const semifinalWinners: Array<{
      teamId: string
      teamName: string
      teamLogo: string
      totalScore: number
      matchIndex: number
    }> = []

    semifinalRound.matches.forEach((match, index) => {
      // Only process completed matches (matches where the scores are actually set and the match is finished)
      const team1TotalScore = match.team1Score + match.team1MatchScore
      const team2TotalScore = match.team2Score + match.team2MatchScore

      // A match is considered completed only if it has actual scores (not just 0 vs 0) and a winner is determined
      const isMatchCompleted =
        (team1TotalScore > 0 || team2TotalScore > 0) &&
        team1TotalScore !== team2TotalScore &&
        match.winner !== "TBA"

      if (isMatchCompleted) {
        if (team1TotalScore > team2TotalScore) {
          semifinalWinners.push({
            teamId: match.team1Id,
            teamName: match.team1,
            teamLogo: match.team1Logo || "",
            totalScore: team1TotalScore,
            matchIndex: index,
          })
        } else if (team2TotalScore > team1TotalScore) {
          semifinalWinners.push({
            teamId: match.team2Id,
            teamName: match.team2,
            teamLogo: match.team2Logo || "",
            totalScore: team2TotalScore,
            matchIndex: index,
          })
        }
      }
    })

    // Update the match schedule with winners
    const updatedMatchSchedule = eliminationSchedule.matchSchedule.map(
      (round) => {
        // Update semifinal matches with winner information
        if (
          round.matches.some((match) => match.matchType === MatchType.SEMIFINAL)
        ) {
          return {
            ...round,
            matches: round.matches.map((match) => {
              const team1TotalScore = match.team1Score + match.team1MatchScore
              const team2TotalScore = match.team2Score + match.team2MatchScore

              let winner = match.winner // Keep existing winner unless we need to update it

              // Only update winner if the match has been completed with actual scores
              const isMatchCompleted =
                (team1TotalScore > 0 || team2TotalScore > 0) &&
                team1TotalScore !== team2TotalScore

              if (isMatchCompleted) {
                if (team1TotalScore > team2TotalScore) {
                  winner = match.team1Id
                } else if (team2TotalScore > team1TotalScore) {
                  winner = match.team2Id
                }
              }

              return {
                ...match,
                winner,
              }
            }),
          }
        }

        // Update final match with semifinal winners
        if (
          round.matches.some((match) => match.matchType === MatchType.FINAL)
        ) {
          return {
            ...round,
            matches: round.matches.map((match) => {
              if (match.matchType === MatchType.FINAL) {
                // Fill team1 with first semifinal winner
                // Fill team2 with second semifinal winner
                const team1 = semifinalWinners[0] || {
                  teamId: "",
                  teamName: "",
                  teamLogo: "",
                }
                const team2 = semifinalWinners[1] || {
                  teamId: "",
                  teamName: "",
                  teamLogo: "",
                }

                return {
                  ...match,
                  team1: team1.teamName,
                  team1Id: team1.teamId,
                  team1Logo: team1.teamLogo,
                  team2: team2.teamName,
                  team2Id: team2.teamId,
                  team2Logo: team2.teamLogo,
                }
              }
              return match
            }),
          }
        }

        return round
      }
    )

    const updatedData: SeasonGames = {
      ...eliminationSchedule,
      matchSchedule: updatedMatchSchedule,
    }

    // Save updated match schedule
    await updateMatches(eliminationSchedule.id, updatedData)

    return {
      success: true,
      message: "Winners arranged successfully",
      semifinalWinners,
      updatedSchedule: updatedData,
    }
  } catch (error) {
    console.error("Error arranging elimination winners:", error)
    throw new Error("Failed to arrange elimination winners: " + error)
  }
}

/**
 * Get winner of a specific match based on total scores
 * @param match The match to evaluate
 * @returns Winner information
 */
export function getMatchWinner(match: Match): {
  winnerId: string
  winnerName: string
  winnerLogo: string
  totalScore: number
} | null {
  const team1TotalScore = match.team1Score + match.team1MatchScore
  const team2TotalScore = match.team2Score + match.team2MatchScore

  if (team1TotalScore > team2TotalScore) {
    return {
      winnerId: match.team1Id,
      winnerName: match.team1,
      winnerLogo: match.team1Logo || "",
      totalScore: team1TotalScore,
    }
  } else if (team2TotalScore > team1TotalScore) {
    return {
      winnerId: match.team2Id,
      winnerName: match.team2,
      winnerLogo: match.team2Logo || "",
      totalScore: team2TotalScore,
    }
  }

  return null // Tie or no scores yet
}

/**
 * Advance specific winner to the final match
 * @param semifinalMatchId The ID of the semifinal match
 * @param finalSlot Which slot to fill in the final (1 or 2)
 */
export async function advanceWinnerToFinal(
  semifinalMatchId: string,
  finalSlot: 1 | 2
) {
  try {
    const matches = (await getMatchSchedule(
      GameType.ELIMINATION
    )) as Array<SeasonGames>

    if (!matches || matches.length === 0) {
      throw new Error("No elimination match schedule found")
    }

    const eliminationSchedule = matches[0]

    // Find the semifinal match
    let semifinalMatch: Match | null = null
    for (const round of eliminationSchedule.matchSchedule) {
      const found = round.matches.find((m) => m.id === semifinalMatchId)
      if (found) {
        semifinalMatch = found
        break
      }
    }

    if (!semifinalMatch) {
      throw new Error("Semifinal match not found")
    }

    // Get winner
    const winner = getMatchWinner(semifinalMatch)
    if (!winner) {
      throw new Error("No winner determined for this match")
    }

    // Update final match
    const updatedMatchSchedule = eliminationSchedule.matchSchedule.map(
      (round) => {
        return {
          ...round,
          matches: round.matches.map((match) => {
            if (match.matchType === MatchType.FINAL) {
              if (finalSlot === 1) {
                return {
                  ...match,
                  team1: winner.winnerName,
                  team1Id: winner.winnerId,
                  team1Logo: winner.winnerLogo,
                }
              } else {
                return {
                  ...match,
                  team2: winner.winnerName,
                  team2Id: winner.winnerId,
                  team2Logo: winner.winnerLogo,
                }
              }
            }
            return match
          }),
        }
      }
    )

    const updatedData: SeasonGames = {
      ...eliminationSchedule,
      matchSchedule: updatedMatchSchedule,
    }

    await updateMatches(eliminationSchedule.id, updatedData)

    return {
      success: true,
      message: `Winner advanced to final (team ${finalSlot})`,
      winner,
    }
  } catch (error) {
    console.error("Error advancing winner to final:", error)
    throw new Error("Failed to advance winner: " + error)
  }
}

/**
 * Calculate team statistics (wins and losses) from all matches
 * Uses match results as the source of truth for completed games
 *
 * @returns {Promise<Object>} Team statistics with wins, losses, and games played
 */
export async function calculateTeamStatistics() {
  try {
    const season = await getActiveSeason()
    if (!season) {
      throw new Error("No active season found")
    }

    // Get match results (actual completed games)
    const matchResults: MatchResult[] = await getMatchResults()

    console.log("=== CALCULATING TEAM STATISTICS ===")
    console.log(`Total match results found: ${matchResults?.length || 0}`)

    // Initialize team statistics map
    const teamStats: Record<
      string,
      {
        teamId: string
        teamName: string
        teamLogo: string
        wins: number
        losses: number
        games: number
        goalsFor: number
        goalsAgainst: number
      }
    > = {}

    // Process match results
    if (matchResults && matchResults.length > 0) {
      matchResults.forEach((match: MatchResult) => {
        // Initialize team1 if not exists
        if (!teamStats[match.team1Id]) {
          teamStats[match.team1Id] = {
            teamId: match.team1Id,
            teamName: match.team1,
            teamLogo: match.team1Logo || "",
            wins: 0,
            losses: 0,
            games: 0,
            goalsFor: 0,
            goalsAgainst: 0,
          }
        }

        // Initialize team2 if not exists
        if (!teamStats[match.team2Id]) {
          teamStats[match.team2Id] = {
            teamId: match.team2Id,
            teamName: match.team2,
            teamLogo: match.team2Logo || "",
            wins: 0,
            losses: 0,
            games: 0,
            goalsFor: 0,
            goalsAgainst: 0,
          }
        }

        // Update games played
        teamStats[match.team1Id].games += 1
        teamStats[match.team2Id].games += 1

        // Update goals
        teamStats[match.team1Id].goalsFor += match.team1Score
        teamStats[match.team1Id].goalsAgainst += match.team2Score
        teamStats[match.team2Id].goalsFor += match.team2Score
        teamStats[match.team2Id].goalsAgainst += match.team1Score

        // Update wins and losses based on winner
        if (match.winner === match.team1Id) {
          teamStats[match.team1Id].wins += 1
          teamStats[match.team2Id].losses += 1
          console.log(
            `${match.team1} (${match.team1Score}) beat ${match.team2} (${match.team2Score})`
          )
        } else if (match.winner === match.team2Id) {
          teamStats[match.team2Id].wins += 1
          teamStats[match.team1Id].losses += 1
          console.log(
            `${match.team2} (${match.team2Score}) beat ${match.team1} (${match.team1Score})`
          )
        } else {
          // Draw or no winner specified - use score to determine
          if (match.team1Score > match.team2Score) {
            teamStats[match.team1Id].wins += 1
            teamStats[match.team2Id].losses += 1
            console.log(
              `${match.team1} (${match.team1Score}) beat ${match.team2} (${match.team2Score}) - determined by score`
            )
          } else if (match.team2Score > match.team1Score) {
            teamStats[match.team2Id].wins += 1
            teamStats[match.team1Id].losses += 1
            console.log(
              `${match.team2} (${match.team2Score}) beat ${match.team1} (${match.team1Score}) - determined by score`
            )
          }
        }
      })
    }

    console.log("=== END CALCULATING STATISTICS ===")
    console.log("Team Statistics:", JSON.stringify(teamStats, null, 2))

    // Convert to array and sort by wins, then by goal difference
    const statistics = Object.values(teamStats)
      .map((team) => ({
        ...team,
        winRate: team.games > 0 ? (team.wins / team.games) * 100 : 0,
        goalDifference: team.goalsFor - team.goalsAgainst,
      }))
      .sort((a, b) => {
        // Sort by wins (descending)
        if (b.wins !== a.wins) return b.wins - a.wins
        // Then by losses (ascending)
        if (a.losses !== b.losses) return a.losses - b.losses
        // Then by goal difference (descending)
        if (b.goalDifference !== a.goalDifference)
          return b.goalDifference - a.goalDifference
        // Finally by goals for (descending)
        return b.goalsFor - a.goalsFor
      })

    return {
      success: true,
      totalTeams: statistics.length,
      totalGames: statistics.reduce((sum, team) => sum + team.games, 0) / 2, // Divide by 2 as each game counts for 2 teams
      totalWins: statistics.reduce((sum, team) => sum + team.wins, 0),
      totalLosses: statistics.reduce((sum, team) => sum + team.losses, 0),
      statistics,
    }
  } catch (error) {
    console.error("Error calculating team statistics:", error)
    throw new Error("Failed to calculate team statistics: " + error)
  }
}

/**
 * Get statistics for a specific team
 * @param teamId The ID of the team
 * @returns Team statistics
 */
/**
 * Update elimination round with automatic winner advancement
 * This function updates the match and optionally advances the winner to the next round
 */
export async function updateEliminationRoundWithAdvancement(
  updatePayload: Match, 
  shouldAdvanceWinner: boolean = false
) {
  try {
    console.log('🔄 Service: Starting elimination update with advancement', {
      matchId: updatePayload.id,
      shouldAdvanceWinner,
      winner: updatePayload.winner
    });

    // First, update the match using the existing function
    await updateEliminationRound(updatePayload);
    
    console.log('✅ Service: Match updated successfully');

    // If should advance winner and there's a winner, advance them to next round
    if (shouldAdvanceWinner && updatePayload.winner && updatePayload.winner !== "TBA") {
      console.log('🏆 Service: Advancing winner to next round...');
      
      const advancementResult = await advanceWinnerToNextRound(
        updatePayload.id,
        updatePayload.winner,
        updatePayload.winner === updatePayload.team1Id ? updatePayload.team1 : updatePayload.team2,
        updatePayload.winner === updatePayload.team1Id ? updatePayload.team1Logo : updatePayload.team2Logo
      );
      
      console.log('✅ Service: Winner advancement completed:', advancementResult);
      
      return {
        success: true,
        message: 'Match updated and winner advanced to next round',
        matchUpdate: updatePayload,
        advancement: advancementResult
      };
    }
    
    console.log('✅ Service: Match updated without advancement');
    return {
      success: true,
      message: 'Match updated successfully',
      matchUpdate: updatePayload
    };
    
  } catch (error) {
    console.error('❌ Service: Update with advancement failed:', error);
    throw new Error(`Failed to update elimination match with advancement: ${error}`);
  }
}

/**
 * Advance winner to the next round in elimination tournament
 * This function finds the next round match and places the winner there
 */
export async function advanceWinnerToNextRound(
  currentMatchId: string,
  winnerId: string, 
  winnerName: string,
  winnerLogo?: string
) {
  try {
    console.log('🔄 Service: Starting winner advancement', {
      currentMatchId,
      winnerId,
      winnerName
    });

    // Get current elimination matches
    const matches = await getMatchSchedule(GameType.ELIMINATION) as Array<SeasonGames>;
    
    if (!matches || matches.length === 0) {
      throw new Error("No elimination match schedule found");
    }

    const eliminationSchedule = matches[0];
    
    // Find the current match and its round
    let currentMatch: Match | null = null;
    let currentRoundNumber = 0;
    
    for (const round of eliminationSchedule.matchSchedule) {
      const foundMatch = round.matches.find(m => m.id === currentMatchId);
      if (foundMatch) {
        currentMatch = foundMatch;
        currentRoundNumber = round.round;
        break;
      }
    }
    
    if (!currentMatch) {
      throw new Error("Current match not found");
    }
    
    console.log(`📍 Service: Found current match in round ${currentRoundNumber}`);
    
    // Find next round
    const nextRoundNumber = currentRoundNumber + 1;
    const nextRound = eliminationSchedule.matchSchedule.find(r => r.round === nextRoundNumber);
    
    if (!nextRound) {
      console.log('🏁 Service: No next round found - winner might be champion!');
      return {
        success: true,
        message: 'Winner advanced - tournament complete or no next round',
        nextRound: null
      };
    }
    
    console.log(`🎯 Service: Found next round ${nextRoundNumber} with ${nextRound.matches.length} matches`);
    
    // Determine which match in the next round should receive this winner
    // For elimination tournaments, winners typically advance to specific slots
    // This is a simplified version - you might need more complex logic based on your bracket structure
    const nextMatch = nextRound.matches.find(match => 
      match.team1 === "TBA" || match.team2 === "TBA" || 
      match.team1 === "" || match.team2 === ""
    );
    
    if (!nextMatch) {
      console.log('⚠️ Service: No available slots in next round');
      return {
        success: false,
        message: 'No available slots in next round'
      };
    }
    
    // Place winner in the next match
    const updatedNextMatch: Match = {
      ...nextMatch,
      // Fill the first available slot
      team1: (nextMatch.team1 === "TBA" || nextMatch.team1 === "") ? winnerName : nextMatch.team1,
      team1Id: (nextMatch.team1Id === "TBA" || nextMatch.team1Id === "") ? winnerId : nextMatch.team1Id,
      team1Logo: (nextMatch.team1Logo === "" || !nextMatch.team1Logo) ? winnerLogo : nextMatch.team1Logo,
      team2: (nextMatch.team1 !== "TBA" && nextMatch.team1 !== "" && (nextMatch.team2 === "TBA" || nextMatch.team2 === "")) ? winnerName : nextMatch.team2,
      team2Id: (nextMatch.team1Id !== "TBA" && nextMatch.team1Id !== "" && (nextMatch.team2Id === "TBA" || nextMatch.team2Id === "")) ? winnerId : nextMatch.team2Id,
      team2Logo: (nextMatch.team1Logo && nextMatch.team1Logo !== "" && (!nextMatch.team2Logo || nextMatch.team2Logo === "")) ? winnerLogo : nextMatch.team2Logo,
    };
    
    console.log('🔄 Service: Updating next round match:', {
      matchId: updatedNextMatch.id,
      team1: updatedNextMatch.team1,
      team2: updatedNextMatch.team2
    });
    
    // Update the elimination schedule with the advanced winner
    const updatedMatchSchedule = eliminationSchedule.matchSchedule.map(round => {
      if (round.round === nextRoundNumber) {
        return {
          ...round,
          matches: round.matches.map(match => 
            match.id === nextMatch.id ? updatedNextMatch : match
          )
        };
      }
      return round;
    });
    
    const updatedData: SeasonGames = {
      ...eliminationSchedule,
      matchSchedule: updatedMatchSchedule
    };
    
    // Save the updated schedule
    await updateMatches(eliminationSchedule.id, updatedData);
    
    console.log('✅ Service: Winner successfully advanced to next round');
    
    return {
      success: true,
      message: `Winner ${winnerName} advanced to round ${nextRoundNumber}`,
      currentRound: currentRoundNumber,
      nextRound: nextRoundNumber,
      nextMatch: updatedNextMatch
    };
    
  } catch (error) {
    console.error('❌ Service: Winner advancement failed:', error);
    throw new Error(`Failed to advance winner to next round: ${error}`);
  }
}

export async function getTeamStatistics(teamId: string) {
  try {
    const allStats = await calculateTeamStatistics()
    const teamStat = allStats.statistics.find((stat) => stat.teamId === teamId)

    if (!teamStat) {
      throw new Error("Team not found in statistics")
    }

    return {
      success: true,
      team: teamStat,
      rank: allStats.statistics.indexOf(teamStat) + 1,
      totalTeams: allStats.totalTeams,
    }
  } catch (error) {
    console.error("Error getting team statistics:", error)
    throw new Error("Failed to get team statistics: " + error)
  }
}




