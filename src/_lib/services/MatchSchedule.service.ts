import { doc, updateDoc } from "firebase/firestore"

import db from "../config/firebaseConfig"

import {
  CreateMatchSchedule,
  GameType,
  SeasonGames,
} from "../dto/MatchSchedule"
import { Team } from "../dto/Team.model"
import { FirebaseCollection } from "../enums/FirebaseCollection.enum"

import { GetFirebaseDataPayload } from "../type/firebaseType.type"
import { addCollection, getData } from "../utils/firebase.utils"
import { generateRoundRobinSchedule } from "../utils/teamUtils"
import { getActiveSeason } from "./SeasonService.service"
import { getTeamFromThisSeason } from "./TeamService.service"

export async function createSchedule(matchType: GameType) {
  try {
    const season = await getActiveSeason()
    if (!season) {
      return null
    }
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
    console.log("data", resp)
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
  }))

  const matches = await generateRoundRobinSchedule(inputTeams)

  return matches
}

export async function updateMatches(id: string, matches: SeasonGames) {
  await updateDoc(doc(db, FirebaseCollection.MATCH_SCHEDULE, id), matches)

  return matches
}

