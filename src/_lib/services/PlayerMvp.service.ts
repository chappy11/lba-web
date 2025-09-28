import { CreatePlayerPlayload, CreatePlayerPlayloadToDb, PlayerMvp } from "../dto/PlayerMvp.model";
import { FirebaseCollection } from "../enums/FirebaseCollection.enum";
import { GetFirebaseDataPayload, WhereDataType } from "../type/firebaseType.type";
import { addCollection, getData } from "../utils/firebase.utils";

import { getActiveSeason } from "./SeasonService.service";

export const insertPlayerMvp = async (player: CreatePlayerPlayload) => {
  try {
    const seasons = await getActiveSeason()

    if (!seasons) {
      throw new Error("No active season found")
    }
    const payload: CreatePlayerPlayloadToDb = {
      ...player,
      seasonId: seasons?.id || "",
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
    }

    const resp = await addCollection(FirebaseCollection.MVP_PLAYER, payload)

    return resp
  } catch (error) {
    console.log(error)
  }
}

export async function getPlayerMvpByGameId(gameId: string): Promise<PlayerMvp | null> {
    try {
        const whereData: WhereDataType[] = [['gameId', '==', gameId]];
        const qryPayload: GetFirebaseDataPayload = {
          firebaseCollection: FirebaseCollection.MVP_PLAYER,
          filter: whereData,
        }

        const data = await getData(qryPayload) as PlayerMvp[];

        if (data.length < 1) {
            return null;
        }

        return data[0];

    } catch (error) {
        console.log("Error", error);
        return null;
    }
}

export async function getPlayerMvpByPlayerId(playerId:string): Promise<PlayerMvp[]> {
    try {
        const whereData: WhereDataType[] = [['playerId',"==",playerId]];
        const qryPayload: GetFirebaseDataPayload = {
          firebaseCollection: FirebaseCollection.MVP_PLAYER,
          filter: whereData,
        }

        const data = await getData(qryPayload) as PlayerMvp[];

        if (!data) {
            return [];
        }

        return data;

    } catch (error) {
        console.log("Error", error);
        return [];
    }
}