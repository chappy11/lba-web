import { doc, getDoc } from "firebase/firestore"
import db from "../config/firebaseConfig"
import { GameInserPayload, GameStatus } from "../dto/Game.model"
import { Season } from "../dto/Season.model"
import {
  FirebaseCollection,
  FirebaseOrderDirection,
} from "../enums/FirebaseCollection.enum"
import {
  GetFirebaseDataPayload,
  WhereDataType,
} from "../type/firebaseType.type"
import { addCollection, getData } from "../utils/firebase.utils"

import { getActiveSeason } from "./SeasonService.service"

export async function insertGame(payload: GameInserPayload) {
  try {
    const currentSeason = await getActiveSeason()

    if (!currentSeason) {
      throw new Error("No Season found")
    }
    const insertedData: GameInserPayload = {
      ...payload,
      seasonId: currentSeason.id,
    }
    const resp = await addCollection(FirebaseCollection.GAMES, insertedData)

    return resp
  } catch (error) {
    throw error
  }
}

export async function getGameBySeasonId(seasonId: string) {
  try {
    const whereData: WhereDataType[] = [["seasonId", "==", seasonId]]

    const queryPayload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.SEASONS,
      filter: whereData,
    }
    const resp = await getData(queryPayload)

    return resp
  } catch (error) {
    throw error
  }
}

export async function getLatestGame(seasonId: string, gameStatus: GameStatus) {
  try {
    const whereData: WhereDataType[] = [
      ["seasonId", "==", seasonId],
      ["gameStatus", "==", gameStatus],
    ]

    const queryPayload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.GAMES,
      filter: whereData,
      sort: FirebaseOrderDirection.ASC,
      sortKey: "updatedAt",
    }

    const resp = await getData(queryPayload)

    return resp
  } catch (error) {
    throw error
  }
}

export async function getAllGamesViaLatestSeason() {
  try {
    const rsep = (await getActiveSeason()) as Season

    const whereData: WhereDataType[] = [["seasonId", "==", rsep.id]]

    const qryPayload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.GAMES,
      filter: whereData,
    }

    const data = await getData(qryPayload)

    return data
  } catch (error) {
    throw error
  }
}

export const getGetGamesById = async (gameId: string) => {
	try {
    const docRef = doc(db, FirebaseCollection.GAMES, gameId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error("Game not found")
    }
  } catch (error) {
     console.log(error)
  }
}
