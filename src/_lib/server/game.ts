import { axiosConfig } from "../config/config";
import { GameInserPayload } from "../dto/Game.model";

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


export const getGamesById = async (id: string) => {
  const resp = await axiosConfig.get(`/games/current-games?gameId=${id}`)

  return resp.data
}