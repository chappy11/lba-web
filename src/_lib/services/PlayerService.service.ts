import {
	doc,
	getDoc,
} from "firebase/firestore";
import db from "../config/firebaseConfig";
import {
	Player,
	PlayerInsertPayload,
	PlayerResponse,
} from "../dto/Player.model";
import { FirebaseCollection } from "../enums/FirebaseCollection.enum";
import {
	addCollection,
	getData,
} from "../utils/firebase.utils";
import {
	GetFirebaseDataPayload,
	WhereDataType,
} from "../type/firebaseType.type";
import { getAllTeams } from "./TeamService.service";

export async function insertPlayer(
	payload: PlayerInsertPayload
) {
	try {
		const resp = await addCollection(
			FirebaseCollection.PLAYERS,
			payload
		);

		return resp;
	} catch (error) {
		console.log(error);
	}
}

export async function getPlayerById(
	playerId: string
) {
	try {
		const docRef = doc(
			db,
			FirebaseCollection.PLAYERS,
			playerId
		);

		const docSnap = await getDoc(
			docRef
		);

		if (docSnap.exists()) {
			return {
				id: docSnap.id,
				...docSnap.data(),
			};
		}

		return null;
	} catch (error) {
		throw error;
	}
}
//team id 6Tb5BHEF0DkRS33XseWI
export async function getPlayerTeamId(
	teamId: string
): Promise<Array<Player>> {
	try {
		const filter: WhereDataType[] = [
			["teamId", "==", teamId],
		];

		const payload: GetFirebaseDataPayload =
			{
				firebaseCollection:
					FirebaseCollection.PLAYERS,
				filter: filter,
			};

		const resp = (await getData(
			payload
		)) as Array<Player>;

		return resp;
	} catch (error) {
		throw error;
	}
}

export async function getAllPlayer() {
	try {
		const payload: GetFirebaseDataPayload =
			{
				firebaseCollection:
					FirebaseCollection.PLAYERS,
				filter: [],
			};

		const resp = (await getData(
			payload
		)) as unknown as Array<Player>;
		const teams = await getAllTeams();
		const playerWithTeam = resp.map(
			(val) => {
				const teamData = teams?.find(
					(team) =>
						team.id === val.teamId
				);

				return {
					...val,
					team: teamData,
				};
			}
		) as unknown as PlayerResponse;
		return playerWithTeam;
	} catch (error) {
		throw error;
	}
}
