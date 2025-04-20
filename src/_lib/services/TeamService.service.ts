import { TeamInsertPayload } from "../dto/Team.model";
import { FirebaseCollection } from "../enums/FirebaseCollection.enum";
import {
  GetFirebaseDataPayload,
  WhereDataType,
} from "../type/firebaseType.type";
import { addCollection, getData } from "../utils/firebase.utils";

export async function insertTeam(payload: TeamInsertPayload) {
  try {
    const resp = await addCollection(FirebaseCollection.TEAMS, payload);

    return resp;
  } catch (error) {
    console.log(error);
  }
}

//1bBhp3PpDTMQOGMgXepD
export async function getTeamBySeasonId(seasonId: string) {
  try {
    const filter: WhereDataType[] = [["seasonId", "==", seasonId]];

    const payload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.TEAMS,
      filter: filter,
    };

    const resp = await getData(payload);

    return resp;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllTeams() {
  try {
    const payload: GetFirebaseDataPayload = {
      firebaseCollection: FirebaseCollection.TEAMS,
      filter: [],
    };

    const resp = await getData(payload);

    return resp;
  } catch (error) {
    console.log(error);
  }
}
