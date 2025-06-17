import { axiosConfig } from "../config/config";
import {
	GameInserPayload,
	UpdateGamePayload,
} from "../dto/Game.model";

export const insertGame = async (
	payload: GameInserPayload
) => {
	const resp = await axiosConfig.post(
		"/games",
		payload
	);

	return resp.data;
};

export const getGames = async () => {
	const resp = await axiosConfig.get(
		"/games"
	);

	return resp.data;
};

export const getGamesById = async (
	id: string
) => {
	const resp = await axiosConfig.get(
		`/games/current-games?gameId=${id}`
	);

	return resp.data;
};

export const updateGameId = async (
	gameId: string,
	payload: UpdateGamePayload
) => {
	const resp = await axiosConfig.put(
		`/games?gameId=${gameId}`,
		payload
	);

	return resp.data;
};

export const getUpcomingGames =
	async () => {
		const resp = await axiosConfig.get(
			"/games/upcoming-date"
		);

		return resp.data;
	};
