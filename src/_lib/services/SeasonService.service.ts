
import { SeasonInsertPayload } from "../dto/Season.model"
import { FirebaseCollection } from "../enums/FirebaseCollection.enum"
import {
  GetFirebaseDataPayload,
  WhereDataType,
} from "../type/firebaseType.type"
import { addCollection, getData } from "../utils/firebase.utils"

export async function insertSeason(payload: SeasonInsertPayload) {
  try {
    //   return payload;
    const resp = await addCollection(FirebaseCollection.SEASONS, payload)
    return resp
  } catch (error) {
    console.log(error)
  }
}

export async function getActiveSeason() {
  try {
    const filter: WhereDataType[] = [["isActiveSeason", "==", 1]]

    const payload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.SEASONS,
      filter: filter,
    }

    const resp = await getData(payload)

    return resp[0]
  } catch (error) {
    console.log(error)
  }
}

export async function getAllSeason() {
  try {
    const payload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.SEASONS,
      filter: [],
    }
    const resp = await getData(payload)

    return resp
  } catch (error) {
    throw error
  }
}
