import { GameType } from "../enums/GameTypeEnum";

import { GamePlayer } from "./GamePlayer.model"
import { Team } from "./Team.model"

export type GameTeamInfo = Pick<Team, "id" | "teamName" | "teamLogo"> & {
  playerRecord: GamePlayer[]
}

export enum GameStatus {
  PENDING = "PENDING",
  ONGOING = "ONGOING",
  DONE = "DONE",
}

export interface Game {
	id?: string;
	seasonId: string;
	teamOne: GameTeamInfo;
	teamTwo: GameTeamInfo;
	teamOneScore: number;
	teamTwoScore: number;
	gameTime: string;
	gameDate: string;
	gameAddress: string;
	gameWinner: GameTeamInfo | null;
	gameStatus: GameStatus;
	gameType: GameType;
	updatedAt: Date;
}

export type GameInserPayload = Omit<
	Game,
	"id"
>;

export type UpdateGamePayload = Omit<
	Game,
	"id" | "updatedAt"
>;
