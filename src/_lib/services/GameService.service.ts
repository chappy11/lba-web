import { doc, getDoc, updateDoc } from "firebase/firestore"

import db from "../config/firebaseConfig"
import {
  Game,
  GameInserPayload,
  GameStatus,
  UpdateGamePayload,
} from "../dto/Game.model"
import { GamePlayer } from "../dto/GamePlayer.model"
import { Player } from "../dto/Player.model"
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
import { getPlayerTeamId } from "./PlayerService.service"
import { getActiveSeason } from "./SeasonService.service"

export async function insertGame(payload: GameInserPayload) {
  try {
    const currentSeason = await getActiveSeason()

    if (!currentSeason) {
      return null
    }

    const teamOnePlayers: Array<Player> = await getPlayerTeamId(
      payload?.teamOne?.id as string
    )

    const teamTwoPlayers: Array<Player> = await getPlayerTeamId(
      payload?.teamTwo?.id as string
    )

    const teamOnePlayerRecord: GamePlayer[] = teamOnePlayers.map((val) => {
      return {
        playerId: val?.id as string,
        firstname: val.firstname,
        middlename: val.middlename,
        lastname: val.lastname,
        points: 0,
        rebound: 0,
        assist: 0,
        threepoints: 0,
        foul: 0,
      }
    })

    const teamTwoPlayerRecord: GamePlayer[] = teamTwoPlayers.map((val) => {
      return {
        playerId: val?.id as string,
        firstname: val.firstname,
        middlename: val.middlename,
        lastname: val.lastname,
        points: 0,
        rebound: 0,
        assist: 0,
        threepoints: 0,
        foul: 0,
      }
    })

    const payloadInsert: GameInserPayload = {
      ...payload,
      teamOne: {
        ...payload.teamOne,
        playerRecord: teamOnePlayerRecord,
      },
      teamTwo: {
        ...payload.teamTwo,
        playerRecord: teamTwoPlayerRecord,
      },
      seasonId: currentSeason.id,
    }
    const resp = await addCollection(FirebaseCollection.GAMES, payloadInsert)

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

    if (!rsep) {
      return []
    }
    const whereData: WhereDataType[] = [["seasonId", "==", rsep.id]]

    const qryPayload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.GAMES,
      filter: whereData,
    }

    const data = await getData(qryPayload)
    const sortedData = data.sort(
      (a, b) => new Date(a.gameDate) - new Date(b.gameDate)
    )

    return sortedData
  } catch (error) {
    throw error
  }
}

export async function getAllUpcomingGames() {
  try {
    const resp = (await getActiveSeason()) as Season

    if (!resp) {
      return []
    }

    const whereData: WhereDataType[] = [
      ["gameStatus", "==", GameStatus.PENDING],
    ]

    const qryPayload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.GAMES,
      filter: whereData,
    }

    const data = (await getData(qryPayload)) as Game[]

    const sortedData = data.sort(
      (a, b) => new Date(a.gameDate) - new Date(b.gameDate)
    )

    return sortedData
  } catch (error) {
    throw error
  }
}

export const getGetGamesById = async (gameId: string) => {
  try {
    const docRef = doc(db, FirebaseCollection.GAMES, gameId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      }
    } else {
      throw new Error("Game not found")
    }
  } catch (error) {
    console.log(error)
  }
}

export const updateGameById = async (id: string, game: UpdateGamePayload) => {
  try {
    if (!id) {
      throw new Error("Game ID is required")
    }

    const docRef = doc(db, FirebaseCollection.GAMES, id)

    await updateDoc(docRef, {
      ...game,
      updatedAt: new Date(),
    })

    return true
  } catch (error) {
    throw new Error(`Error updating game: ${error}`)
  }
}

export async function migrateAllDataToISO() {
  const resp = (await getAllGamesViaLatestSeason()) as Game[]

  const updatePromises = resp.map((val) => {
    const docRef = doc(db, FirebaseCollection.GAMES, val.id as string)

    const payload = {
      ...val,
      gameDate: new Date(val.gameDate).toISOString(),
    }

    return updateDoc(docRef, payload)
  })

  await Promise.all(updatePromises)
  console.log("Migration to ISO completed.")
}
