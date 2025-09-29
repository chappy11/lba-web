import { GamePlayer } from "./GamePlayer.model";
import { Player } from "./Player.model";

export type PlayerGameInfo = Pick<
  Player,
  | "id"
  | "firstname"
  | "middlename"
  | "lastname"
  | "jerseyNumber"
  | "playerImage"
  | "position"
>

export interface PlayerScoreModel {
  playerId: string
  gameId: string
  player: PlayerGameInfo
  points: number
  rebound: number
  assist: number
  threepoints: number
  steal: number;
  foul: number
}

export type PlayerScoreModeBasedInsert =
    Omit<GamePlayer, "id">;


export type PlayerStatusPayload = PlayerScoreModeBasedInsert & {
    id: string | null;
}