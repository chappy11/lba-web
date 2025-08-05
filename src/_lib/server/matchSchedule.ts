import { axiosConfig } from "../config/config";
import { SeasonGames } from "../dto/MatchSchedule";

export const getMatchSchedule =
	async () => {
		const resp = await axiosConfig.get(
			"/teams/round-robin"
		);

		return resp.data;
	};

export const createMatchSchedule =
	async () => {
		const resp = await axiosConfig.post(
			"/teams/round-robin"
		);

		return resp.data;
	};

export const updateMatchSchedule =
	async (data: SeasonGames) => {
		const resp = await axiosConfig.put(
			"/match-shedule",
			data
		);

		return resp;
	};
