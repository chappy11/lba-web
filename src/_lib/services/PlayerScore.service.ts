import { doc, updateDoc } from "firebase/firestore"
import db from "../config/firebaseConfig"
import {
  PlayerScoreModeBasedInsert,
  PlayerStatusPayload,
} from "../dto/TeamScoring.model"
import { FirebaseCollection } from "../enums/FirebaseCollection.enum"
import { GetFirebaseDataPayload } from "../type/firebaseType.type"
import { addCollection, getData } from "../utils/firebase.utils"
import { removeUndefinedFields } from "./MatchSchedule.service"

export async function createPlayerStatus(payload: PlayerStatusPayload) {
  try {
    if (payload.id === null) {
      // insert
      const resp = await insertPlayerStatus(payload)
      return resp
    }

    // update
    const resp = await updatePlayerStatus(payload)
    return resp
  } catch (error) {
    console.log(error)
    throw new Error("Something went wrong   with creating player status")
  }
}

export async function insertPlayerStatus(payload: PlayerScoreModeBasedInsert) {
  try {
    const resp = await addCollection(FirebaseCollection.PLAYER_STATS, payload)
    return resp
  } catch (error) {
    console.log(error)
    throw new Error("Something went wrong with inserting player status")
  }
}

export async function updatePlayerStatus(payload: PlayerStatusPayload) {
  try {
    // TO DO: update player status
    if (payload.id === null) throw new Error("Player status ID is null")

    const cleanPayload = removeUndefinedFields(payload)

    await updateDoc(doc(db, FirebaseCollection.PLAYER_STATS, payload.id), {
      ...cleanPayload,
    })

    return payload.id
  } catch (error) {
    console.log(error)
    throw new Error("Something went wrong with updating player status")
  }
}

export async function getPlayerStatusByGameId(gameId: string) {
  try {
    const payload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.PLAYER_STATS,
      filter: [["gameId", "==", gameId]],
    }

    const resp = await getData(payload)

    return resp
  } catch (error) {
    console.log(error)
    throw new Error("Something went wrong with getting player status")
  }
}
