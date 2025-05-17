import { doc, getDoc } from "firebase/firestore"
import db from "../config/firebaseConfig"
import { TeamInsertPayload } from "../dto/Team.model"
import { FirebaseCollection } from "../enums/FirebaseCollection.enum"
import {
  GetFirebaseDataPayload,
  WhereDataType,
} from "../type/firebaseType.type"
import { addCollection, getData } from "../utils/firebase.utils"

import { getActiveSeason } from "./SeasonService.service"

export async function insertTeam(payload: TeamInsertPayload) {
  try {
    const season = await getActiveSeason()

    if (!season) {
      throw new Error("No active season found")
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

//1bBhp3PpDTMQOGMgXepD
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
      throw new Error("No active season found")
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

    const team = { id: snapshot.id, ...snapshot.data() }

    // Check if the team belongs to the current season

    return team
  } catch (error) {
    console.error(error)
    return null
  }
}
