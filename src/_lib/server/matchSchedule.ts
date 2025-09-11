import { axiosConfig } from "../config/config";
import { Match, SeasonGames } from "../dto/MatchSchedule"

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

export const getEliminationMatchSchedule = async () => {
  const resp = await axiosConfig.get("/teams/elimination-round")
  return resp.data
}

export const createEliminationMatchSchedule = async () => {
  const resp = await axiosConfig.post("/teams/elimination-round")
  return resp.data
}

export const eliminationMatchScheduleUpdate = async (data: Match) => {
  const resp = await axiosConfig.put("/elimination-schedule", data)
  return resp.data
}

export const getMatchResuts = async () => {
  const resp = await axiosConfig.get("/match-results")

  return resp.data
}