import { doc, getDoc } from "firebase/firestore"

import db from "../config/firebaseConfig"
import { Game } from "../dto/Game.model"
import { Team, TeamInsertPayload, TeamsStanding } from "../dto/Team.model"
import { FirebaseCollection } from "../enums/FirebaseCollection.enum"
import {
  GetFirebaseDataPayload,
  WhereDataType,
} from "../type/firebaseType.type"
import { addCollection, getData } from "../utils/firebase.utils"

import { getAllGamesViaLatestSeason } from "./GameService.service"
import { getMatchesFromThisSeason } from "./MatchSchedule.service"
import { getActiveSeason } from "./SeasonService.service"

export async function insertTeam(payload: TeamInsertPayload) {
  try {
    const season = await getActiveSeason()

    if (!season) {
      throw new Error("No active season found")
    }

    const matchesThisSeason = await getMatchesFromThisSeason()

    if (matchesThisSeason.length > 0) {
      throw new Error(
        "Cannot add team when matches have already been scheduled for the current season"
      )
    }

    const insertPayload: TeamInsertPayload & {
      seasonId: string
    } = {
      ...payload,
      seasonId: season.id,
    }
    const resp = await addCollection(FirebaseCollection.TEAMS, insertPayload)

    return resp.id
  } catch (error) {
    console.log(error)
    throw new Error("Failed to insert team")
  }
}


export async function getTeamBySeasonId(seasonId: string) {
  try {
    const filter: WhereDataType[] = [["seasonId", "==", seasonId]]

    const payload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.TEAMS,
      filter: filter,
    }

    const resp = await getData(payload)

    return resp
  } catch (error) {
    console.log(error)
  }
}

export async function getAllTeams() {
  try {
    const payload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.TEAMS,
      filter: [],
    }

    const resp = await getData(payload)

    return resp
  } catch (error) {
    console.log(error)
  }
}

export async function getTeamFromThisSeason() {
  try {
    const season = await getActiveSeason()
    if (!season) {
      return []
    }
    const filter: WhereDataType[] = [["seasonId", "==", season.id]]

    const payload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.TEAMS,
      filter: filter,
    }

    const resp = await getData(payload)

    return resp
  } catch (error) {
    console.log(error)
  }
}

export async function getTeamById(id: string) {
  try {
    const docRef = doc(db, FirebaseCollection.TEAMS, id)
    const snapshot = await getDoc(docRef)

    if (!snapshot.exists()) {
      return null
    }

    const team = {
      id: snapshot.id,
      ...snapshot.data(),
    }

    // Check if the team belongs to the current season

    return team
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getStandingThisSeason() {
  try {
    const teams = (await getTeamFromThisSeason()) as unknown as Team[]

    const games = (await getAllGamesViaLatestSeason()) as unknown as Game[]
    if (teams?.length < 1) {
      return []
    }

    const tempArr: Array<TeamsStanding> = []
    teams.map(async (val: Team) => {
      const teamRecent = games.filter((games: Game) => {
        return (
          (val.id === games.teamOne?.id || val.id === games?.teamTwo?.id) &&
          games.gameWinner !== null
        )
      })

      const filterWinnder = teamRecent.filter((value) => {
        return value.gameWinner?.id === val?.id
      })

      const payload: TeamsStanding = {
        ...val,
        win: filterWinnder.length,
        lose: teamRecent.length - filterWinnder.length,
        games: teamRecent.length,
      }

      tempArr.push(payload)
    })

    return tempArr.sort((a, b) => {
      return b.win - a.win
    })
  } catch (error) {
    throw new Error("Failed to get standings for this season")
  }
}

// export async function roundRobin() {
//   const teams = (await getTeamFromThisSeason()) as unknown as Team[]

//   if (teams.length < 1) {
//     throw new Error("No teams found for the current season")
//   }

//   console.log(teams.length)
//   const inputTeams = teams.map((team) => ({
//     teamId: team.id as string,
//     teamName: team.teamName,
//   }))

//   const matches = await generateCustomRoundRobinMatches(inputTeams)

//   return matches
// }
