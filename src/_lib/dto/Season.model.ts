import { GameType } from "../enums/GameTypeEnum";

import { GameTeamInfo } from "./Game.model";
import { Player } from "./Player.model";



export type MvpOfTheSeason = Pick<
  Player,
  "id" | "firstname" | "middlename" | "lastname" | "jerseyNumber"
> & {
  teamLogo: string
  teamName: string
}

export enum MatchType {
  ROUND_ROBIN = "ROUND_ROBIN",
  ELIMINATION = "ELIMINATION",
}

export interface Season {
  id?: string
  seasonName: string
  isActiveSeason: number
  seasonStartDate: string
  seasonEndDate: string
  dateCreated: string
  gameType: GameType
  seasonLogo: string
  gameWinner: GameTeamInfo | null
  mvpOfTheSeason: MvpOfTheSeason | null
  seasonMotto: string
  matchType?: MatchType
  numberOfTeams?: number
}

export type SeasonInsertPayload = Omit<Season, "id">;

export type GetAllSeasonResponse = Array<Season>;
