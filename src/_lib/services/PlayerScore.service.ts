import { doc, updateDoc } from "firebase/firestore"
import db from "../config/firebaseConfig"
import { Player } from "../dto/Player.model"
import {
  PlayerScoreModeBasedInsert,
  PlayerStatusPayload,
  PlayerStatusPayloadBulkInsert,
} from "../dto/TeamScoring.model"
import { FirebaseCollection } from "../enums/FirebaseCollection.enum"
import { GetFirebaseDataPayload } from "../type/firebaseType.type"
import { addCollection, getData } from "../utils/firebase.utils"
import { removeUndefinedFields } from "./MatchSchedule.service"
import { getPlayerById } from "./PlayerService.service"

export async function createPlayerStatus(payload: PlayerStatusPayload) {
  try {
    const playerRecordAndGameId = await getPlayerStatusByGameIdAndPlayerId(
      payload.gameId,
      payload.playerId
    )

    const isExistingRecord = playerRecordAndGameId.length > 0

    if (isExistingRecord) {
      // update existing record
      const existingRecord = playerRecordAndGameId[0]
      payload.id = existingRecord.id // set the id for update
    } else {
      payload.id = null // indicate this is a new record
    }
    if (payload.id === null) {
      // insert

      const cleanPayload: PlayerScoreModeBasedInsert = {
        playerId: payload.playerId,
        gameId: payload.gameId,
        player: payload.player,
        points: payload.points ?? 0,
        rebound: payload.rebound ?? 0,
        assist: payload.assist ?? 0,
        threepoints: payload.threepoints ?? 0,
        steal: payload.steal ?? 0,
        foul: payload.foul ?? 0,
        turnOver: payload.turnOver ?? 0,
      }

      const resp = await insertPlayerStatus(cleanPayload)
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

    const cleanPayload = removeUndefinedFields(
      payload
    ) as Partial<PlayerStatusPayload>

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

export async function getPlayerStatusByPlayerId(playerId: string) {
  try {
    const payload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.PLAYER_STATS,
      filter: [["playerId", "==", playerId]],
    }

    const resp = await getData(payload)

    return resp
  } catch (error) {
    console.log(error)
    throw new Error(
      "Something went wrong with getting player status by player ID"
    )
  }
}

export async function getPlayerStatusByGameIdAndPlayerId(
  gameId: string,
  playerId: string
) {
  try {
    const payload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.PLAYER_STATS,
      filter: [
        ["gameId", "==", gameId],
        ["playerId", "==", playerId],
      ],
    }

    const resp = await getData(payload)

    return resp
  } catch (error) {
    console.log(error)
    throw new Error(
      "Something went wrong with getting player status by game ID and player ID"
    )
  }
}

export async function bulkInsertPlayerStatus(
  payloads: PlayerStatusPayloadBulkInsert[]
) {
  try {
    const insertPromises = payloads.map(async (payload) => {
      const playerInfo = (await getPlayerById(payload.playerId)) as Player
      const insertPayload: PlayerStatusPayload = {
        id: null,
        playerId: payload.playerId,
        gameId: payload.gameId,
        player: {
          firstname: payload.firstName,
          lastname: payload.lastName,
          middlename: playerInfo.middlename,
          jerseyNumber: playerInfo.jerseyNumber,
          playerImage: playerInfo.playerImage,
          position: playerInfo.position,
        },
        points: payload.points ?? 0,
        rebound: payload.rebound ?? 0,
        assist: payload.assist ?? 0,
        threepoints: payload.threepoints ?? 0,
        steal: payload.steal ?? 0,
        foul: payload.foul ?? 0,
        turnOver: payload.turnOver ?? 0,
      }

      return await createPlayerStatus(insertPayload)
    })

    const results = await Promise.all(insertPromises)
    return results
  } catch (error) {
    console.log(error)
    throw new Error("Something went wrong with bulk inserting player status")
  }
}