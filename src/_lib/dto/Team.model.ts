import { GameType } from "../enums/GameTypeEnum";

export interface CoachInfo {
	firstname: string;
	middlename: string;
	lastname: string;
}

export interface Team {
	id?: string;
	seasonId: string;
	teamName: string;
	coachInfo: CoachInfo;
	teamLogo: string;
	isActive: string;
	dateCreate: string;
	teamType: GameType;
}

export type TeamInsertPayload = Omit<
	Team,
	"id" | "seasonId"
>;

export type TeamsStanding = Team & {
	lose: number;
	win: number;
	games: number;
};
