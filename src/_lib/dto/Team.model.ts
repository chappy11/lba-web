import { GameType } from "../enums/GameTypeEnum";

import { Player } from "./Player.model"

export interface CoachInfo {
	firstname: string;
	middlename: string;
	lastname: string;
}

export type FeaturePlayerInfo = Omit<
  Player,
  "dateCreate" | "isActive" | "teamId"
>

export interface Team {
  id?: string
  seasonId: string
  teamName: string
  coachInfo: CoachInfo
  teamLogo: string
  isActive: string
  dateCreate: string
  teamType: GameType
  featurePlayer: FeaturePlayerInfo | null
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

export type UpdateTeam = Omit<Team, "id"> 
