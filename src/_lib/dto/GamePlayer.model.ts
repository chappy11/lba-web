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

export interface GamePlayer {
  playerId: string
  gameId: string
  player: PlayerGameInfo
  points: number
  rebound: number
  assist: number
  threepoints: number
  foul: number
}

export type GamePlayerInfoPayload =
	Omit<GamePlayer, "id">;
