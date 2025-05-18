import { GameType } from "../enums/GameTypeEnum";
import { Team } from "./Team.model";

export type GameTeamInfo = Pick<
	Team,
	"id" | "teamName" | "teamLogo"
>;

export enum GameStatus {
	PENDING = "PENDING",
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
